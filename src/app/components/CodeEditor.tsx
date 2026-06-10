import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { EditorView, Decoration, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

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
                Decoration.line({ attributes: { class: 'cm-error-line' } })
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

// Monochrome editor theme matching design/educode.css tokens
const educodeTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--code-bg)',
    color: 'var(--text)',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'var(--mono)',
    fontSize: '13.5px',
    lineHeight: '1.85',
    caretColor: 'var(--text)',
    padding: '14px 0',
  },
  '.cm-scroller': {
    fontFamily: 'var(--mono)',
    backgroundColor: 'var(--code-bg)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--code-bg)',
    color: 'var(--text-3)',
    border: 'none',
  },
  '.cm-gutterElement': {
    opacity: 0.55,
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--surface)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--surface)',
    opacity: 1,
  },
  '.cm-error-line': {
    backgroundColor: 'var(--error-dim)',
  },
  '.cm-error-line.cm-activeLine': {
    backgroundColor: 'var(--error-dim)',
  },
  '.cm-error-line.cm-activeLineGutter': {
    backgroundColor: 'var(--error-dim)',
    color: 'var(--error)',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'var(--line-strong) !important',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--text)',
  },
  '&.cm-editor.cm-focused': {
    outline: 'none',
  },
}, { dark: true });

const educodeHighlight = HighlightStyle.define([
  { tag: t.comment, color: 'var(--sx-comment)', fontStyle: 'italic' },
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.moduleKeyword], color: 'var(--sx-keyword)' },
  { tag: [t.string, t.special(t.string), t.regexp], color: 'var(--sx-string)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--sx-number)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'var(--sx-func)' },
  { tag: [t.variableName, t.definition(t.variableName), t.tagName], color: 'var(--sx-var)' },
  { tag: [t.propertyName, t.attributeName], color: 'var(--sx-prop)' },
  { tag: [t.punctuation, t.bracket, t.operator, t.angleBracket], color: 'var(--sx-punc)' },
]);

type Tab = 'js' | 'html';

export function CodeEditor({ jsCode, htmlCode, onJsChange, onHtmlChange, language, errorLine }: CodeEditorProps) {
  const isKinyarwanda = language === 'KIN';
  const [activeTab, setActiveTab] = useState<Tab>('js');

  const jsExtensions = [
    javascript(),
    EditorView.lineWrapping,
    educodeTheme,
    syntaxHighlighting(educodeHighlight),
    ...(errorLine && activeTab === 'js' ? [errorLinePlugin(errorLine)] : []),
  ];

  const htmlExtensions = [
    html(),
    EditorView.lineWrapping,
    educodeTheme,
    syntaxHighlighting(educodeHighlight),
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col" style={{ background: 'var(--code-bg)' }}>
      <div className="tabs">
        <span className={`tab${activeTab === 'js' ? ' on' : ''}`} onClick={() => setActiveTab('js')}>
          script.js
        </span>
        <span className={`tab${activeTab === 'html' ? ' on' : ''}`} onClick={() => setActiveTab('html')}>
          index.html
        </span>
      </div>

      <div className="editor-area">
        {activeTab === 'js' ? (
          <CodeMirror
            key="js"
            value={jsCode}
            onChange={onJsChange}
            extensions={jsExtensions}
            height="100%"
            style={{ height: '100%' }}
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
            extensions={htmlExtensions}
            height="100%"
            style={{ height: '100%' }}
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
