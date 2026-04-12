import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView, Decoration, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: 'EN' | 'KIN';
  errorLine?: number;
}

// Plugin that highlights a specific line in red
function errorLinePlugin(line: number) {
  return ViewPlugin.fromClass(
    class {
      decorations;
      constructor(view: EditorView) {
        this.decorations = this.build(view, line);
      }
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

export function CodeEditor({ code, onChange, language, errorLine }: CodeEditorProps) {
  const isKinyarwanda = language === 'KIN';

  const extensions = [
    javascript(),
    EditorView.lineWrapping,
    ...(errorLine ? [errorLinePlugin(errorLine)] : []),
  ];

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Wandika kode yawe' : 'Code Editor'}
          </span>
          <div className="flex gap-2 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          JavaScript
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={code}
          onChange={onChange}
          theme={vscodeDark}
          extensions={extensions}
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
        />
      </div>
    </div>
  );
}
