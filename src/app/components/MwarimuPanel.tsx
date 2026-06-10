import { useState, useEffect, useRef } from 'react';
import { getAIFeedback, getMwarimuReply } from '../../lib/ai';

interface Msg {
  id: number;
  role: 'mw' | 'me';
  text: string;
  showQuick?: boolean;
}

const QUICK_ACTIONS = [
  {
    en: 'Walk me through it',
    kin: 'Nyobora intambwe ku yindi',
    prompt: "Walk me through finding and fixing this error step by step. Give one hint at a time — don't reveal the full fix yet.",
  },
  {
    en: 'Show the fix',
    kin: 'Nyereka igisubizo',
    prompt: 'Show me exactly what is wrong and how to fix it.',
  },
  {
    en: 'Quiz me instead',
    kin: 'Mbaza ikibazo gusa',
    prompt: "Don't tell me the fix. Ask me a guiding question that helps me find the bug myself.",
  },
];

interface MwarimuPanelProps {
  code: string;
  error: string | null;
  runCount: number;
  instructions: string;
  language: 'EN' | 'KIN';
  onLanguageChange: (l: 'EN' | 'KIN') => void;
  examMode: boolean;
}

let nextId = 1;

export function MwarimuPanel({ code, error, runCount, instructions, language, onLanguageChange, examMode }: MwarimuPanelProps) {
  const isKin = language === 'KIN';
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // React to a code run
  useEffect(() => {
    if (runCount === 0 || examMode) return;
    setLoading(true);
    getAIFeedback(code, error, language)
      .then(response => {
        setMessages(m => [...m, { id: nextId++, role: 'mw', text: response, showQuick: !!error }]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runCount]);

  async function ask(question: string) {
    setLoading(true);
    try {
      const response = await getMwarimuReply(question, code, instructions, language);
      setMessages(m => [...m, { id: nextId++, role: 'mw', text: response }]);
    } catch {
      // ignore — leave the conversation as-is
    } finally {
      setLoading(false);
    }
  }

  function handleQuick(action: typeof QUICK_ACTIONS[number]) {
    if (loading) return;
    setMessages(m => m.map(msg => ({ ...msg, showQuick: false })).concat({
      id: nextId++,
      role: 'me',
      text: isKin ? action.kin : action.en,
    }));
    ask(action.prompt);
  }

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(m => m.map(msg => ({ ...msg, showQuick: false })).concat({ id: nextId++, role: 'me', text }));
    ask(text);
  }

  return (
    <aside className="ws-ai">
      <div className="ai-bar">
        <div className="ai-id">
          <span className="ai-mwicon">M</span>
          <div>
            <div className="nm">Mwarimu</div>
            <div className="st">{loading ? (isKin ? 'Aratekereza...' : 'Thinking...') : (isKin ? 'Arareba kode yawe' : 'Watching your code')}</div>
          </div>
        </div>
        <div className="lang-toggle">
          <button className={language === 'EN' ? 'on' : ''} onClick={() => onLanguageChange('EN')}>EN</button>
          <button className={language === 'KIN' ? 'on' : ''} onClick={() => onLanguageChange('KIN')}>RW</button>
        </div>
      </div>

      <div className="ai-feed" ref={feedRef}>
        {messages.length === 0 && !loading && (
          <div className="msg mw">
            <span className="ava">M</span>
            <div className="bubble">
              <p>{isKin ? 'Tangiza kode yawe maze nzakwereka icyo nabonye.' : "Run your code and I'll take a look."}</p>
            </div>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className={`msg ${m.role}`}>
            <span className="ava">{m.role === 'mw' ? 'M' : 'A'}</span>
            <div className="bubble">
              <p>{m.text}</p>
              {m.showQuick && (
                <div className="quick">
                  {QUICK_ACTIONS.map(a => (
                    <button key={a.en} onClick={() => handleQuick(a)}>{isKin ? a.kin : a.en}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg mw">
            <span className="ava">M</span>
            <div className="bubble"><p>...</p></div>
          </div>
        )}
      </div>

      <div className="ai-compose">
        <div className="compose-box">
          <textarea
            rows={1}
            placeholder={isKin ? 'Baza Mwarimu, cyangwa wandike igisubizo cyawe...' : 'Ask Mwarimu, or type your answer...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="send" aria-label="Send" onClick={handleSend}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <div className="compose-hint">
          {isKin ? 'Mwarimu atanga inama mbere. Hindukira mu Cyongereza igihe icyo ari cyo cyose.' : 'Mwarimu gives hints first. Switch to RW any time.'}
        </div>
      </div>
    </aside>
  );
}
