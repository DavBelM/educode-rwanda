import { useState } from 'react';

interface ConsoleProps {
  output: string;
  feedback: Array<{ type: 'success' | 'error' | 'info'; message: string }>;
  isRunning: boolean;
  language: 'EN' | 'KIN';
  onClear: () => void;
  previewSrcdoc?: string;
}

export function Console({ output, feedback, isRunning, language, onClear, previewSrcdoc }: ConsoleProps) {
  const isKin = language === 'KIN';
  const [tab, setTab] = useState<'console' | 'preview' | 'tests'>('console');

  const lines = output.split('\n').filter(l => l.length > 0);

  return (
    <div className="console">
      <div className="console-bar">
        <span className={`ct${tab === 'console' ? '' : ' off'}`} onClick={() => setTab('console')}>
          {isKin ? 'Ibisubizo' : 'Console'}
        </span>
        <span className={`ct${tab === 'preview' ? '' : ' off'}`} onClick={() => setTab('preview')}>
          {isKin ? 'Reba' : 'Preview'}
        </span>
        <span className={`ct${tab === 'tests' ? '' : ' off'}`} onClick={() => setTab('tests')}>
          {isKin ? 'Amagerageza' : 'Tests'}
        </span>
        <span className="clear" onClick={onClear}>{isKin ? 'Siba' : 'Clear'}</span>
      </div>

      {tab === 'preview' ? (
        <div className="console-preview">
          {previewSrcdoc ? (
            <iframe srcDoc={previewSrcdoc} sandbox="allow-scripts" title="preview" />
          ) : (
            <div style={{ padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text-3)' }}>
              › {isKin ? 'Kanda Run kugirango ubone urupapuro rwawe.' : 'Click Run to see your page preview.'}
            </div>
          )}
        </div>
      ) : (
        <div className="console-body">
          {tab === 'console' ? (
            isRunning && lines.length === 0 ? (
              <div className="cl"><span className="arrow">›</span>{isKin ? 'Birimo gukora...' : 'Running...'}</div>
            ) : lines.length > 0 ? (
              lines.map((line, i) => {
                const isError = line.startsWith('❌') || /Error/.test(line);
                return (
                  <div key={i} className={`cl${isError ? ' error' : ' out'}`}>
                    <span className="arrow">{isError ? '✕' : '›'}</span>
                    {line.replace(/^❌\s*/, '')}
                  </div>
                );
              })
            ) : (
              <div className="cl"><span className="arrow">›</span>{isKin ? 'Nta gisubizo kirahari. Kanda Run.' : 'No output yet. Click Run to execute your code.'}</div>
            )
          ) : feedback.length > 0 ? (
            feedback.map((f, i) => (
              <div key={i} className={`cl${f.type === 'error' ? ' error' : f.type === 'success' ? ' out' : ''}`}>
                <span className="arrow">{f.type === 'error' ? '✕' : f.type === 'success' ? '✓' : '›'}</span>
                {f.message}
              </div>
            ))
          ) : (
            <div className="cl"><span className="arrow">›</span>{isKin ? 'Tangiza code yawe kugirango ubone amagerageza.' : 'Run your code to see test feedback.'}</div>
          )}
        </div>
      )}
    </div>
  );
}
