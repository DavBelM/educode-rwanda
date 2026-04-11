export interface ExecutionResult {
  output: string;
  error: string | null;
  errorType: string | null;
  errorMessage: string | null;
  timedOut: boolean;
}

const TIMEOUT_MS = 5000;

export function executeCode(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('sandbox', 'allow-scripts');
    document.body.appendChild(iframe);

    let settled = false;

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };

    const settle = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(result);
    };

    const timer = setTimeout(() => {
      settle({
        output: '',
        error: 'Your code took too long to run. Check for infinite loops.',
        errorType: 'TimeoutError',
        errorMessage: 'Execution exceeded 5 seconds',
        timedOut: true
      });
    }, TIMEOUT_MS);

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      settle(event.data as ExecutionResult);
    };

    window.addEventListener('message', handleMessage);

    // Code that runs inside the sandboxed iframe
    iframe.srcdoc = `
      <script>
        const __logs = [];

        // Override console methods to capture output
        console.log = (...args) => {
          __logs.push(args.map(a => {
            if (typeof a === 'object' && a !== null) {
              try { return JSON.stringify(a, null, 2); } catch { return String(a); }
            }
            return String(a);
          }).join(' '));
        };
        console.warn = (...args) => {
          __logs.push('⚠️ ' + args.map(a => String(a)).join(' '));
        };
        console.error = (...args) => {
          __logs.push('❌ ' + args.map(a => String(a)).join(' '));
        };

        try {
          ${code}

          window.parent.postMessage({
            output: __logs.join('\\n'),
            error: null,
            errorType: null,
            errorMessage: null,
            timedOut: false
          }, '*');

        } catch (e) {
          window.parent.postMessage({
            output: __logs.join('\\n'),
            error: e.toString(),
            errorType: e.name || 'Error',
            errorMessage: e.message || '',
            timedOut: false
          }, '*');
        }
      </script>
    `;
  });
}
