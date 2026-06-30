import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getAIFeedback, getMwarimuReply, translateToKinyarwanda } from '../../lib/ai';
import { logAIInteraction } from '../../lib/quiz-db';

interface Msg {
  id: number;
  role: 'mw' | 'me';
  text: string;
  textKin?: string;
  translating?: boolean;
  translateFailed?: boolean;
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
  chatKey: string;
  studentName?: string;
  xp?: number;
  onNewSession?: () => void;
}

let nextId = 1;

function addMsg(prev: Msg[], msg: Omit<Msg, 'id'>): Msg[] {
  return [...prev, { id: nextId++, ...msg }];
}

function xpLevel(xp: number): string {
  if (xp < 100)  return 'Beginner';
  if (xp < 500)  return 'Intermediate';
  return 'Advanced';
}

function studentCtx(name?: string, xp?: number): string {
  if (!name) return '';
  const level = xp !== undefined ? ` | Level: ${xpLevel(xp)} (${xp} XP)` : '';
  return `[Student: ${name}${level}]\n`;
}

function saveMsgs(chatKey: string, msgs: Msg[]) {
  const toStore = msgs.map(({ translating: _t, translateFailed: _f, ...m }) => m);
  try { localStorage.setItem(chatKey, JSON.stringify(toStore)); } catch { /* storage full */ }
}

function loadMsgs(chatKey: string): Msg[] {
  try {
    const raw = localStorage.getItem(chatKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Msg[];
    if (!Array.isArray(parsed)) return [];
    // Restore nextId so new messages get unique IDs
    const maxId = parsed.reduce((m, msg) => Math.max(m, msg.id ?? 0), 0);
    if (maxId >= nextId) nextId = maxId + 1;
    return parsed;
  } catch { return []; }
}

export function MwarimuPanel({
  code, error, runCount, instructions, language, onLanguageChange, examMode,
  sessionId, challengeId, onInteractionLogged,
  chatKey, studentName, xp, onNewSession,
}: MwarimuPanelProps) {
  const isKin = language === 'KIN';
  const [messages, setMessages] = useState<Msg[]>(() => loadMsgs(chatKey));
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);
  const lastAutoErrorRef = useRef('');
  const lastAutoTimeRef = useRef(0);

  // Scroll to bottom on new messages
  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Persist messages whenever they change (skip mid-translation state)
  useEffect(() => {
    saveMsgs(chatKey, messages);
  }, [messages, chatKey]);

  // Replace last Mwarimu message if it was a busy/fallback message; otherwise append.
  const BUSY_RE = /bit busy right now|he'll be back shortly/i;
  function setMwMsg(response: string) {
    setMessages(prev => {
      const lastMwIdx = prev.reduce((acc, m, i) => m.role === 'mw' ? i : acc, -1);
      if (lastMwIdx >= 0 && BUSY_RE.test(prev[lastMwIdx].text)) {
        return prev.map((m, i) => i === lastMwIdx ? { ...m, text: response } : m);
      }
      return addMsg(prev, { role: 'mw', text: response });
    });
  }

  // Auto-feedback when student runs code — only fire when the error actually changes.
  useEffect(() => {
    if (runCount === 0 || examMode || !error) return;
    if (loading) return;
    const now = Date.now();
    const errorChanged = error !== lastAutoErrorRef.current;
    if (!errorChanged && now - lastAutoTimeRef.current < 30_000) return;
    lastAutoErrorRef.current = error;
    lastAutoTimeRef.current = now;
    const question = `My code has an error: ${error}`;
    setLoading(true);
    getAIFeedback(code, error, language)
      .then(response => {
        setMwMsg(response);
        logAIInteraction({ question, response, language, sessionId, challengeId })
          .then(() => onInteractionLogged?.());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runCount]);

  // Translate untranslated Mwarimu messages when switching to KIN
  useEffect(() => {
    if (language !== 'KIN') return;
    const untranslated = messages.filter(m => m.role === 'mw' && !m.textKin && !m.translating);
    if (!untranslated.length) return;

    setMessages(prev => prev.map(m =>
      untranslated.some(u => u.id === m.id) ? { ...m, translating: true } : m
    ));

    untranslated.forEach(m => {
      translateToKinyarwanda(m.text)
        .then(textKin => {
          setMessages(prev => prev.map(msg =>
            msg.id === m.id ? { ...msg, textKin, translating: false, translateFailed: false } : msg
          ));
        })
        .catch(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === m.id ? { ...msg, translating: false, translateFailed: true } : msg
          ));
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  async function ask(question: string) {
    setLoading(true);
    const ctx = studentCtx(studentName, xp);
    const wrappedQuestion = examMode
      ? `[CHALLENGE MODE: This student is in a graded challenge. Under NO circumstances reveal the solution or write corrected code. You may ask guiding questions and explain concepts only.]\n\n${ctx}${question}`
      : `${ctx}${question}`;
    try {
      const response = await getMwarimuReply(wrappedQuestion, code, instructions, language);
      if (isKin) {
        const id = nextId;
        setMwMsg(response);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, translating: true } : m));
        translateToKinyarwanda(response)
          .then(textKin => setMessages(prev => prev.map(m => m.id === id ? { ...m, textKin, translating: false, translateFailed: false } : m)))
          .catch(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, translating: false, translateFailed: true } : m)));
      } else {
        setMwMsg(response);
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

  function handleNewSession() {
    const label = isKin
      ? 'Ushaka gutangira ikiganiro gishya? Kode n\'ikiganiro byose bizasubiramo.'
      : 'Start a new session? This will clear your code and this conversation.';
    if (!window.confirm(label)) return;
    setMessages([]);
    try { localStorage.removeItem(chatKey); } catch { /* ignore */ }
    onNewSession?.();
  }

  function renderMwMsg(m: Msg) {
    if (isKin) {
      if (m.translating) return <div className="typing-dots"><span /><span /><span /></div>;
      if (m.translateFailed) return (
        <div>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 6 }}>
            Guhindura mu Kinyarwanda byanze. Gerageza nanone:
          </p>
          <button
            style={{ fontSize: 12, background: 'none', border: '1px solid var(--line)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', color: 'var(--text-2)' }}
            onClick={() => {
              setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, translating: true, translateFailed: false } : msg));
              translateToKinyarwanda(m.text)
                .then(textKin => setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, textKin, translating: false, translateFailed: false } : msg)))
                .catch(() => setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, translating: false, translateFailed: true } : msg)));
            }}
          >
            Gerageza nanone
          </button>
        </div>
      );
      if (m.textKin) return <ReactMarkdown>{m.textKin}</ReactMarkdown>;
    }
    return <ReactMarkdown>{m.text}</ReactMarkdown>;
  }

  const firstName = studentName?.split(' ')[0];
  const emptyStateMsg = isKin
    ? `Tangiza kode yawe maze nzakwereka icyo nabonye${firstName ? `, ${firstName}` : ''}.`
    : `Run your code and I'll take a look${firstName ? `, ${firstName}` : ''}.`;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleNewSession}
            title={isKin ? 'Tangira ikiganiro gishya' : 'New session'}
            style={{
              background: 'none', border: '1px solid var(--line)', borderRadius: 'var(--radius)',
              color: 'var(--text-3)', cursor: 'pointer', fontSize: 11, padding: '3px 8px',
              lineHeight: 1.4, transition: 'color .14s, border-color .14s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text)'; (e.target as HTMLElement).style.borderColor = 'var(--line-strong)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-3)'; (e.target as HTMLElement).style.borderColor = 'var(--line)'; }}
          >
            {isKin ? 'Gishya' : 'New'}
          </button>
          <div className="lang-toggle">
            <button className={language === 'EN' ? 'on' : ''} onClick={() => onLanguageChange('EN')}>EN</button>
            <button className={language === 'KIN' ? 'on' : ''} onClick={() => onLanguageChange('KIN')}>RW</button>
          </div>
        </div>
      </div>

      <div className="ai-feed" ref={feedRef}>
        {messages.length === 0 && !loading && (
          <div className="msg mw">
            <span className="ava">M</span>
            <div className="bubble">
              <p>{emptyStateMsg}</p>
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
