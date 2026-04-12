import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView, Decoration, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

interface CodeEditorProps {
  jsCode: string;
  htmlCode: string;
  onJsChange: (code: string) => void;
  onHtmlChange: (code: string) => void;
  language: 'EN' | 'KIN';
  errorLine?: number;
}

function errorLinePlugin(line: number) {
  return ViewPlugin.fromClass(
    class {
      decorations;
      constructor(view: EditorView) { this.decorations = this.build(view, line); }
      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.build(update.view, line);
        }
      }
      build(view: EditorView, targetLine: number) {
        const builder = new RangeSetBuilder<Decoration>();
        for (const { from, to } of view.visibleRanges) {
          let pos = from;
          while (pos <= to) {
            const lineObj = view.state.doc.lineAt(pos);
            if (lineObj.number === targetLine) {
              builder.add(
                lineObj.from,
                lineObj.from,
                Decoration.line({ attributes: { style: 'background: rgba(239,68,68,0.12); border-left: 3px solid #ef4444;' } })
              );
            }
            pos = lineObj.to + 1;
          }
        }
        return builder.finish();
      }
    },
    { decorations: (v) => v.decorations }
  );
}

type Tab = 'js' | 'html';

export function CodeEditor({ jsCode, htmlCode, onJsChange, onHtmlChange, language, errorLine }: CodeEditorProps) {
  const isKinyarwanda = language === 'KIN';
  const [activeTab, setActiveTab] = useState<Tab>('js');

  const jsExtensions = [
    javascript(),
    EditorView.lineWrapping,
    ...(errorLine && activeTab === 'js' ? [errorLinePlugin(errorLine)] : []),
  ];

  const htmlExtensions = [
    html(),
    EditorView.lineWrapping,
  ];

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Tabs + label row */}
      <div className="flex items-center justify-between border-b border-gray-700 shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('js')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'js'
                ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#1e1e2e]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            script.js
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'html'
                ? 'border-[#f97316] text-[#f97316] bg-[#1e1e2e]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            index.html
          </button>
        </div>
        <span className="text-xs text-gray-400 px-3 py-1 bg-gray-800 rounded mr-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {activeTab === 'js' ? 'JavaScript' : 'HTML'}
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'js' ? (
          <CodeMirror
            key="js"
            value={jsCode}
            onChange={onJsChange}
            theme={vscodeDark}
            extensions={jsExtensions}
            height="100%"
            style={{ height: '100%', fontSize: '14px' }}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
            }}
            placeholder={isKinyarwanda ? '// Andika JavaScript yawe hano...' : '// Write your JavaScript here...'}
          />
        ) : (
          <CodeMirror
            key="html"
            value={htmlCode}
            onChange={onHtmlChange}
            theme={vscodeDark}
            extensions={htmlExtensions}
            height="100%"
            style={{ height: '100%', fontSize: '14px' }}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
            }}
            placeholder="<!-- Add your HTML elements here -->"
          />
        )}
      </div>
    </div>
  );
}
