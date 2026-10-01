import type { TestResult, QuizExecutionResult } from './quiz-executor';

const SQLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js';
const SQLJS_WASM = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm';
const TIMEOUT_MS = 10_000;

export interface SqlTestCase {
  // assertion is a SQL SELECT that must return a single row with a single column
  // that evaluates to truthy (1 / true / any non-empty value).
  // Use __result__ to reference the student's output table.
  // Example: "SELECT COUNT(*) = 3 AS ok FROM __result__"
  assertion: string;
  description: string;
  description_kin?: string | null;
}

export function runSqlTests(
  studentSql: string,
  schema: string,
  testCases: SqlTestCase[]
): Promise<QuizExecutionResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');
    document.body.appendChild(iframe);

    let settled = false;
    const finish = (result: QuizExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      document.body.removeChild(iframe);
      window.removeEventListener('message', onMessage);
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({
        results: testCases.map(t => ({ passed: false, description: t.description, description_kin: t.description_kin ?? null, error: 'Timed out' })),
        output: '', runtimeError: 'SQL execution timed out', allPassed: false,
      });
    }, TIMEOUT_MS);

    const onMessage = (evt: MessageEvent) => {
      if (evt.source !== iframe.contentWindow) return;
      const { type, results, runtimeError } = evt.data;
      if (type !== 'sql-result') return;
      const mapped: TestResult[] = (results ?? []).map((r: { passed: boolean; description: string; description_kin?: string | null; error?: string }) => ({
        passed: r.passed,
        description: r.description,
        description_kin: r.description_kin ?? null,
        error: r.error,
      }));
      finish({ results: mapped, output: '', runtimeError, allPassed: mapped.every(r => r.passed) });
    };

    window.addEventListener('message', onMessage);

    const assertionsJson = JSON.stringify(testCases.map(t => ({
      sql: t.assertion,
      description: t.description,
      description_kin: t.description_kin ?? null,
    })));

    const studentSqlEscaped = JSON.stringify(studentSql);
    const schemaEscaped = JSON.stringify(schema);

    const html = `<!DOCTYPE html><html><body><script>
(async () => {
  try {
    const script = document.createElement('script');
    script.src = ${JSON.stringify(SQLJS_CDN)};
    document.head.appendChild(script);
    await new Promise((res, rej) => { script.onload = res; script.onerror = rej; });

    const SQL = await initSqlJs({ locateFile: () => ${JSON.stringify(SQLJS_WASM)} });
    const db = new SQL.Database();

    // Run schema (CREATE TABLE + seed data)
    const schema = ${schemaEscaped};
    if (schema.trim()) db.run(schema);

    // Run student SQL into a temp view called __result__
    const studentSql = ${studentSqlEscaped};
    let runtimeError = null;

    try {
      db.run('DROP VIEW IF EXISTS __result__');
      db.run('CREATE VIEW __result__ AS ' + studentSql);
    } catch (e) {
      runtimeError = String(e);
      const assertions = ${assertionsJson};
      const results = assertions.map(a => ({ passed: false, description: a.description, description_kin: a.description_kin, error: runtimeError }));
      parent.postMessage({ type: 'sql-result', results, runtimeError }, '*');
      return;
    }

    // Run each assertion
    const assertions = ${assertionsJson};
    const results = [];
    for (const a of assertions) {
      try {
        const stmt = db.prepare(a.sql);
        const row = stmt.getAsObject();
        stmt.free();
        const values = Object.values(row);
        const passed = values.length > 0 && Boolean(values[0]);
        results.push({ passed, description: a.description, description_kin: a.description_kin });
      } catch (e) {
        results.push({ passed: false, description: a.description, description_kin: a.description_kin, error: String(e) });
      }
    }

    parent.postMessage({ type: 'sql-result', results, runtimeError: null }, '*');
    db.close();
  } catch (e) {
    parent.postMessage({ type: 'sql-result', results: [], runtimeError: String(e) }, '*');
  }
})();
<\/script></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);
  });
}
