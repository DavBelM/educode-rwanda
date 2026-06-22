import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  language: 'EN' | 'KIN';
  onAgree: () => void;
}

const RULES_EN = [
  { icon: '📚', title: 'For learning only', body: 'This platform is here to help you build real JavaScript skills — use it honestly, not to find shortcuts.' },
  { icon: '👁', title: 'Your teacher can see you', body: 'Your code, questions to Mwarimu, and progress are visible to your teacher. Work as if they are watching.' },
  { icon: '🤖', title: 'The AI is your tutor, not your author', body: 'Mwarimu helps you understand errors and concepts. The thinking and typing must be yours.' },
  { icon: '🤝', title: 'Be respectful', body: 'Treat your classmates, your teacher, and this platform with respect. No harmful content or abuse.' },
  { icon: '🔒', title: 'Your data is protected', body: 'We only store what is needed for your learning. Your data is never sold or shared outside EduCode Rwanda.' },
];

const RULES_KIN = [
  { icon: '📚', title: 'Bigirwa gusa', body: 'Iyi platform ifasha kwiga JavaScript mu buryo bwiza — yikoreshe neza, ntugerageze inzira ngufi.' },
  { icon: '👁', title: 'Umwarimu arabireba', body: 'Code yawe, ibibazo wasabye Mwarimu, n\'iterambere ryawe bigaragarira umwarimu wawe.' },
  { icon: '🤖', title: 'AI ni umwarimu wawe, si we ukora akazi', body: 'Mwarimu agufasha gusobanukirwa amakosa. Ugomba wowe gutekereza no kwandika code yawe.' },
  { icon: '🤝', title: 'Bana neza', body: 'Ishyira abanyeshuri bawe, umwarimu wawe, n\'iyi platform mu mutima. Nta bibi cyangwa ivangura.' },
  { icon: '🔒', title: 'Amakuru yawe arakingirwa', body: 'Tubika gusa ibikenewe mu kwiga kwawe. Amakuru yawe ntiyagurwa cyangwa ngo asangirwe hanze ya EduCode Rwanda.' },
];

export default function EthicsModal({ language, onAgree }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isKin = language === 'KIN';
  const rules = isKin ? RULES_KIN : RULES_EN;

  const handleAgree = () => {
    if (!agreed) return;
    setPressed(true);
    setTimeout(onAgree, 320);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)', animation: 'ethics-bg-in 0.3s ease both' }}
    >
      <div
        className="card w-full overflow-hidden"
        style={{
          maxWidth: 480,
          padding: 0,
          animation: 'ethics-card-in 0.35s cubic-bezier(0.22,0.61,0.36,1) both',
          opacity: pressed ? 0 : undefined,
          transform: pressed ? 'scale(0.97)' : undefined,
          transition: pressed ? 'opacity 0.28s ease, transform 0.28s ease' : undefined,
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: 'var(--text)', borderRadius: '4px 4px 0 0' }} />

        {/* Header */}
        <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'rise 0.4s 0.1s both',
          }}>
            <ShieldCheck size={22} style={{ color: 'var(--text-2)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--text)', animation: 'rise 0.4s 0.15s both' }}>
            {isKin ? 'Mbere yo gutangira' : 'Before you begin'}
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.5, animation: 'rise 0.4s 0.2s both' }}>
            {isKin
              ? 'Soma ibi byerekeye uburyo bwo gukoresha EduCode neza, hanyuma wemere gukomeza.'
              : 'Read these guidelines for using EduCode responsibly, then agree to continue.'}
          </p>
        </div>

        {/* Rules */}
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {rules.map((rule, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 12, padding: '12px 10px',
                borderRadius: 'var(--radius)',
                animation: `rise 0.38s ${0.25 + i * 0.07}s both`,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{rule.icon}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{rule.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{rule.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Agreement */}
        <div style={{ padding: '16px 24px 0', animation: `rise 0.38s ${0.25 + rules.length * 0.07}s both` }}>
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
            padding: '12px 14px', borderRadius: 'var(--radius)',
            border: `1px solid ${agreed ? 'var(--text-3)' : 'var(--line)'}`,
            background: agreed ? 'var(--surface-2)' : 'transparent',
            transition: 'border-color 0.2s, background 0.2s',
          }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: 2, accentColor: 'var(--text)', width: 15, height: 15, flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
              {isKin
                ? 'Nasomye kandi nemera izi ngingo. Nzikurikiza igihe cyose nkoresha EduCode.'
                : 'I have read and agree to these guidelines. I will follow them whenever I use EduCode.'}
            </span>
          </label>
        </div>

        {/* Action */}
        <div style={{ padding: '16px 24px 24px', animation: `rise 0.38s ${0.3 + rules.length * 0.07}s both` }}>
          <button
            onClick={handleAgree}
            disabled={!agreed}
            className="btn btn-primary"
            style={{ width: '100%', opacity: agreed ? 1 : 0.38, transition: 'opacity 0.2s' }}
          >
            <ShieldCheck size={15} />
            {isKin ? 'Nemera, nkomeze' : 'I agree, let\'s start'}
          </button>
        </div>
      </div>
    </div>
  );
}
