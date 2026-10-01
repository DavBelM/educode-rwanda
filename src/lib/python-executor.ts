import type { TestResult, QuizExecutionResult } from './quiz-executor';

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js';
const TIMEOUT_MS = 30_000; // Python cold-start can take ~5s on first load

// Worker script as a string so it loads Pyodide from CDN without a separate file
const WORKER_SRC = `
let pyodide = null;
let loading = false;
let ready = false;

async function ensurePyodide() {
  if (ready) return;
  if (loading) return;
  loading = true;
  try {
    self.postMessage({ type: 'status', text: 'Loading Python runtime...' });
    importScripts('${PYODIDE_CDN}');
    pyodide = await self.loadPyodide();
    ready = true;
    self.postMessage({ type: 'status', text: 'Python ready' });
  } catch (e) {
    self.postMessage({ type: 'error', text: String(e) });
  }
}

self.onmessage = async (evt) => {
  const { id, code, assertions } = evt.data;
  try {
    await ensurePyodide();
    if (!ready) {
      self.postMessage({ id, type: 'result', error: 'Python runtime failed to load' });
      return;
    }

    const results = [];

    // Run student code first (define their functions/variables)
    try {
      pyodide.runPython(code);
    } catch (e) {
      // Runtime error in student code — fail all tests with this error
      const msg = String(e).split('\\n').slice(-2).join(' ').trim();
      for (const a of assertions) {
        results.push({ passed: false, assertion: a.assertion, description: a.description, description_kin: a.description_kin ?? null, error: msg });
      }
      self.postMessage({ id, type: 'result', results, runtimeError: msg });
      return;
    }

    // Run each assertion
    for (const a of assertions) {
      try {
        const val = pyodide.runPython(a.assertion);
        results.push({ passed: val === true || val === 1 || val === true, assertion: a.assertion, description: a.description, description_kin: a.description_kin ?? null });
      } catch (e) {
        const msg = String(e).split('\\n').slice(-2).join(' ').trim();
        results.push({ passed: false, assertion: a.assertion, description: a.description, description_kin: a.description_kin ?? null, error: msg });
      }
    }

    self.postMessage({ id, type: 'result', results, runtimeError: null });
  } catch (e) {
    self.postMessage({ id, type: 'result', error: String(e) });
  }
};
`;

let worker: Worker | null = null;
let pendingCallbacks = new Map<number, (r: QuizExecutionResult) => void>();
let nextId = 1;

function getWorker(): Worker {
  if (worker) return worker;
  const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
  worker = new Worker(URL.createObjectURL(blob));
  worker.onmessage = (evt) => {
    const { id, type, results, runtimeError, error } = evt.data;
    if (type === 'status') return; // progress updates — ignore for now
    const cb = pendingCallbacks.get(id);
    if (!cb) return;
    pendingCallbacks.delete(id);
    if (error) {
      cb({ results: [], output: '', runtimeError: error, allPassed: false });
      return;
    }
    const mapped: TestResult[] = (results ?? []).map((r: { passed: boolean; description: string; description_kin?: string | null; error?: string }) => ({
      passed: r.passed,
      description: r.description,
      description_kin: r.description_kin ?? null,
      error: r.error,
    }));
    cb({ results: mapped, output: '', runtimeError, allPassed: mapped.every(r => r.passed) });
  };
  worker.onerror = (e) => {
    console.error('[PythonWorker] error', e);
    // Fail all pending callbacks
    for (const [id, cb] of pendingCallbacks) {
      pendingCallbacks.delete(id);
      cb({ results: [], output: '', runtimeError: `Worker error: ${e.message}`, allPassed: false });
    }
  };
  return worker;
}

export interface PythonTestCase {
  assertion: string;
  description: string;
  description_kin?: string | null;
}

export function runPythonTests(
  code: string,
  testCases: PythonTestCase[]
): Promise<QuizExecutionResult> {
  return new Promise((resolve) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      pendingCallbacks.delete(id);
      resolve({
        results: testCases.map(t => ({ passed: false, description: t.description, description_kin: t.description_kin ?? null, error: 'Timed out — check for infinite loops' })),
        output: '',
        runtimeError: 'Execution timed out',
        allPassed: false,
      });
    }, TIMEOUT_MS);

    pendingCallbacks.set(id, (result) => {
      clearTimeout(timer);
      resolve(result);
    });

    try {
      getWorker().postMessage({ id, code, assertions: testCases });
    } catch (e) {
      clearTimeout(timer);
      pendingCallbacks.delete(id);
      resolve({ results: [], output: '', runtimeError: String(e), allPassed: false });
    }
  });
}

// Warm up the Pyodide worker immediately when this module is first imported
// (only in browser — not during SSR)
export function preloadPyodide() {
  if (typeof window !== 'undefined') {
    try { getWorker(); } catch { /* ignore */ }
  }
}
