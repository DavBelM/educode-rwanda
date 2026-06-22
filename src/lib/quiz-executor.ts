export interface TestCase {
  assertion: string;
  description: string;
  description_kin?: string | null;
}

export interface TestResult {
  passed: boolean;
  description: string;
  description_kin?: string | null;
  error?: string;
}

export interface QuizExecutionResult {
  results: TestResult[];
  output: string;
  runtimeError: string | null;
  allPassed: boolean;
}

const TIMEOUT_MS = 6000;

export function runQuizTests(
  jsCode: string,
  htmlCode: string,
  testCases: TestCase[]
): Promise<QuizExecutionResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('sandbox', 'allow-scripts');
    document.body.appendChild(iframe);

    let settled = false;

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
      clearTimeout(timer);
    };

    const settle = (r: QuizExecutionResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(r);
    };

    const timer = setTimeout(() => {
      settle({
        results: testCases.map(tc => ({ passed: false, description: tc.description, description_kin: tc.description_kin, error: 'Timeout' })),
        output: '',
        runtimeError: 'Code took too long. Check for infinite loops.',
        allPassed: false,
      });
    }, TIMEOUT_MS);

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      const data = event.data;
      if (data?.type !== 'quiz_result') return;

      const rawResults: { passed: boolean; description: string; error?: string }[] = data.results ?? [];
      const results: TestResult[] = rawResults.map((r, i) => ({
        passed: r.passed,
        description: testCases[i]?.description ?? r.description,
        description_kin: testCases[i]?.description_kin ?? null,
        error: r.error,
      }));

      settle({
        results,
        output: data.output ?? '',
        runtimeError: data.runtimeError ?? null,
        allPassed: results.length > 0 && results.every(r => r.passed),
      });
    };

    window.addEventListener('message', handleMessage);

    const testCasesJson = JSON.stringify(testCases.map(tc => ({
      assertion: tc.assertion,
      description: tc.description,
    })));

    // Two-pass execution:
    // Pass 1 — new Function() parses student code at runtime so SyntaxErrors are
    //           catchable (inlined code kills the entire script block on parse failure).
    // Pass 2 — inline student code so const/let stay in scope for assertion eval().
    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
${htmlCode}
<script>
(function() {
  var __logs = [];
  var __results = [];
  var __runtimeError = null;
  var __testCases = ${testCasesJson};

  // __output getter so click-event assertions see fresh log state
  Object.defineProperty(window, '__output', {
    get: function() { return __logs.join('\\n'); },
    configurable: true
  });

  var __log = function() {
    var args = Array.prototype.slice.call(arguments);
    __logs.push(args.map(function(a) {
      if (typeof a === 'object' && a !== null) {
        try { return JSON.stringify(a); } catch(e) { return String(a); }
      }
      return String(a);
    }).join(' '));
  };
  console.log = __log;
  console.warn = __log;
  console.error = __log;

  // Pass 1: syntax check — new Function parses without running
  try {
    new Function(${JSON.stringify(jsCode)});
  } catch (__se) {
    __runtimeError = __se.toString();
    while (__results.length < __testCases.length) {
      __results.push({ passed: false, description: __testCases[__results.length].description });
    }
    window.parent.postMessage({ type: 'quiz_result', results: __results, output: '', runtimeError: __runtimeError }, '*');
    return;
  }

  // Pass 2: safe to inline — syntax is valid; const/let stay in scope for assertions
  try {
    // ── student code starts ──
    ${jsCode}
    // ── student code ends ──

    // assertions run in same scope — eval() sees student's const/let vars
    var __i;
    for (__i = 0; __i < __testCases.length; __i++) {
      try {
        var __passed = Boolean(eval(__testCases[__i].assertion));
        __results.push({ passed: __passed, description: __testCases[__i].description });
      } catch (__ae) {
        __results.push({ passed: false, description: __testCases[__i].description, error: __ae.message });
      }
    }
  } catch (__re) {
    __runtimeError = __re.toString();
    while (__results.length < __testCases.length) {
      __results.push({ passed: false, description: __testCases[__results.length].description });
    }
  }

  window.parent.postMessage({
    type: 'quiz_result',
    results: __results,
    output: window.__output,
    runtimeError: __runtimeError
  }, '*');
})();
<\/script>
</body>
</html>`;
  });
}
