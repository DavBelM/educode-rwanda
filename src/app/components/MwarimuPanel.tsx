import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getAIFeedback, getMwarimuReply, translateToKinyarwanda } from '../../lib/ai';
import { logAIInteraction } from '../../lib/quiz-db';

interface Msg {
  id: number;
  role: 'mw' | 'me';
  text: string;       // original EN text
  textKin?: string;   // KIN translation, fetched on demand
  translating?: boolean;
}

interface MwarimuPanelProps {
  code: string;
  error: string | null;
  runCount: number;
  instructions: string;
  language: 'EN' | 'KIN';
  onLanguageChange: (l: 'EN' | 'KIN') => void;
  examMode: boolean;
  sessionId?: string | null;
  challengeId?: string | null;
  onInteractionLogged?: () => void;
}

let nextId = 1;

function addMsg(prev: Msg[], msg: Omit<Msg, 'id'>): Msg[] {
  return [...prev, { id: nextId++, ...msg }];
}

export function MwarimuPanel({
  code, error, runCount, instructions, language, onLanguageChange, examMode,
  sessionId, challengeId, onInteractionLogged,
}: MwarimuPanelProps) {
  const isKin = language === 'KIN';
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-feedback when student runs code with an error
  useEffect(() => {
    if (runCount === 0 || examMode || !error) return;
    const question = `My code has an error: ${error}`;
    setLoading(true);
    getAIFeedback(code, error, language)
      .then(response => {
        setMessages(prev => addMsg(prev, { role: 'mw', text: response }));
        logAIInteraction({ question, response, language, sessionId, challengeId })
          .then(() => onInteractionLogged?.());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runCount]);

  // When the student switches to KIN, translate any untranslated Mwarimu messages
  useEffect(() => {
    if (language !== 'KIN') return;
    const untranslated = messages.filter(m => m.role === 'mw' && !m.textKin && !m.translating);
    if (!untranslated.length) return;

    // Mark them as translating
    setMessages(prev => prev.map(m =>
      untranslated.some(u => u.id === m.id) ? { ...m, translating: true } : m
    ));

    // Fetch translations in parallel
    untranslated.forEach(m => {
      translateToKinyarwanda(m.text)
        .then(textKin => {
          setMessages(prev => prev.map(msg =>
            msg.id === m.id ? { ...msg, textKin, translating: false } : msg
          ));
        })
        .catch(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === m.id ? { ...msg, translating: false } : msg
          ));
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  async function ask(question: string) {
    setLoading(true);
    const wrappedQuestion = examMode
      ? `[CHALLENGE MODE: This student is in a graded challenge. Under NO circumstances reveal the solution or write corrected code. You may ask guiding questions and explain concepts only.]\n\n${question}`
      : question;
    try {
      const response = await getMwarimuReply(wrappedQuestion, code, instructions, language);
      const newMsg: Omit<Msg, 'id'> = { role: 'mw', text: response };
      // If already in KIN mode, immediately queue translation
      if (isKin) {
        const id = nextId;
        setMessages(prev => addMsg(prev, { ...newMsg, translating: true }));
        translateToKinyarwanda(response)
          .then(textKin => setMessages(prev => prev.map(m => m.id === id ? { ...m, textKin, translating: false } : m)))
          .catch(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, translating: false } : m)));
      } else {
        setMessages(prev => addMsg(prev, newMsg));
      }
      logAIInteraction({ question, response, language, sessionId, challengeId })
        .then(() => onInteractionLogged?.());
    } catch {
      // leave conversation as-is
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => addMsg(prev, { role: 'me', text }));
    ask(text);
  }

  function renderMwMsg(m: Msg) {
    if (isKin) {
      if (m.translating) return <div className="typing-dots"><span /><span /><span /></div>;
      if (m.textKin)     return <ReactMarkdown>{m.textKin}</ReactMarkdown>;
    }
    return <ReactMarkdown>{m.text}</ReactMarkdown>;
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
              {m.role === 'mw' ? renderMwMsg(m) : <p>{m.text}</p>}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg mw">
            <span className="ava">M</span>
            <div className="bubble">
              <div className="typing-dots"><span /><span /><span /></div>
            </div>
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
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
          />
          <button className="send" aria-label="Send" onClick={handleSend}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <div className="compose-hint">
          {isKin ? 'Kanda RW kugira ngo uhindukirire mu Kinyarwanda.' : 'Click RW to translate to Kinyarwanda.'}
        </div>
      </div>
    </aside>
  );
}
