import { useState } from 'react';
import { ArrowRight, X, Code2, BookOpen, Users, BarChart2, Megaphone, ClipboardList, CheckCircle, Loader } from 'lucide-react';
import { getClassWithInviteCode, joinClass } from '../lib/db';

interface Props {
  userType: 'student' | 'teacher' | 'self_learner';
  userName: string;
  language: 'EN' | 'KIN';
  onDone: () => void;
}

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
  interactive?: 'join_class';
}

export default function OnboardingModal({ userType, userName, language, onDone }: Props) {
  const isKin = language === 'KIN';
  const [step, setStep] = useState(0);
  const firstName = userName.split(' ')[0];

  // Join class state (used on interactive step)
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joined, setJoined] = useState(false);

  const iconBox = (icon: React.ReactNode) => (
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text)' }}>
      {icon}
    </div>
  );

  const teacherSteps: Step[] = [
    {
      icon: <div className="text-5xl">👋</div>,
      title: isKin ? `Murakaza neza, ${firstName}!` : `Welcome, ${firstName}!`,
      description: isKin
        ? 'Uri umwarimu kuri EduCode Rwanda. Dufashe abanyeshuri bawe bige programming mu buryo bushimishije.'
        : "You're a teacher on EduCode Rwanda. Let's help your students learn programming in an engaging way.",
      tip: isKin ? 'Ibi bizakugenda neza.' : "Here's a quick tour of what you can do.",
    },
    {
      icon: iconBox(<Users size={28} />),
      title: isKin ? 'Kora Ishuri Ryawe' : 'Create Your Class',
      description: isKin
        ? 'Tangira ukora ishuri. Buri shuri rihabwa kode yaryo — usangire n\'abanyeshuri bawe bayikoreshe binjira.'
        : 'Start by creating a class. Each class gets a unique invite code — share it with your students so they can join.',
      tip: isKin ? 'Urashobora gukora amashuri menshi.' : 'You can create multiple classes.',
    },
    {
      icon: iconBox(<ClipboardList size={28} />),
      title: isKin ? 'Tanga imikoro' : 'Create Assignments',
      description: isKin
        ? 'Tanga imikoro yo kwandika cyangwa iya code. Shyiraho igihe ntarengwa, amanota, n\'uburyo bw\'ikizamini (Exam Mode) kugirango birinde gukopera.'
        : 'Create written (theoretical) or coding assignments. Set deadlines, marks, and enable Exam Mode to prevent cheating.',
      tip: isKin ? 'Uburyo bw\'ikizamini (Exam Mode) bufunga screen kandi bukurikirana niba umunyeshuri ahinduye paji.' : 'Exam Mode locks the screen and tracks tab switches.',
    },
    {
      icon: iconBox(<BarChart2 size={28} />),
      title: isKin ? 'Suzuma kandi uhe amanota' : 'Review & Grade',
      description: isKin
        ? 'Reba ibisubizo bya buri munyeshuri, tanga amanota, wongere igitekerezo cyawe. Reba Analytics kugirango ubonee ikigereranyo cy\'ishuri ryawe.'
        : "Review each student's submission, assign marks, and leave feedback. Use Analytics to see your whole class performance at a glance.",
      tip: isKin ? 'Abanyeshuri babona ibitekerezo byawe kuri dashboard yabo.' : 'Students see your feedback on their dashboard.',
    },
    {
      icon: iconBox(<Megaphone size={28} />),
      title: isKin ? 'Shyiraho amatangazo' : 'Post Announcements',
      description: isKin
        ? 'Yoherereza abanyeshuri bawe amakuru y\'ingenzi — nk\'amatariki y\'ibizamini n\'ibindi. Abanyeshuri bayabona ako kanya kuri dashboard yabo.'
        : 'Send your students important notices — exam dates, reminders, updates. Students see them instantly on their dashboard.',
      tip: isKin ? 'Urashobora gushyira amatangazo hejuru kugirango agaragare cyane.' : 'You can pin announcements for extra visibility.',
    },
  ];

  const studentSteps: Step[] = [
    {
      icon: <div className="text-5xl">🎉</div>,
      title: isKin ? `Murakaza neza, ${firstName}!` : `Welcome, ${firstName}!`,
      description: isKin
        ? 'Winjiye kuri EduCode Rwanda — ahantu ho kwiga JavaScript mu Kinyarwanda no mu Cyongereza.'
        : "You've joined EduCode Rwanda — a place to learn JavaScript in Kinyarwanda and English.",
      tip: isKin ? 'Ibi bizafata iminota ibiri.' : "This will only take two minutes.",
    },
    {
      icon: iconBox(<BookOpen size={28} />),
      title: isKin ? 'Kora imikoro' : 'Complete Assignments',
      description: isKin
        ? 'Imikoro yawe igaragara kuri dashboard. Fungura umwe, usubize ibibazo cyangwa wandike code — hanyuma uwohereze mbere y\'igihe ntarengwa.'
        : 'Your assignments appear on your dashboard. Open one, answer the questions or write your code — then submit before the deadline.',
      tip: isKin ? 'Imikoro y\'ibizamini ifunga screen kandi ikoherezwa mu buryo bwikora iyo igihe kirangiye.' : 'Exam assignments lock the screen and auto-submit when time runs out.',
    },
    {
      icon: iconBox(<Code2 size={28} />),
      title: isKin ? 'Imenyereze gukora code' : 'Practice Coding',
      description: isKin
        ? 'Fungura "Courses" kugirango ubone amasomo. Jya muri Coding Workspace igihe icyo aricyo cyose kugirango ugerageze JavaScript yawe.'
        : 'Open Courses to follow structured lessons. Use the Coding Workspace anytime to experiment with JavaScript freely.',
      tip: isKin ? 'AI izajya igusobanurira amakosa mu gihe wandika code.' : 'The AI will explain errors in your code as you learn.',
    },
    {
      icon: iconBox(<CheckCircle size={28} />),
      title: isKin ? 'Kurikirana iterambere ryawe' : 'Track Your Progress',
      description: isKin
        ? 'Kanda "My Results" kugirango ubone amanota yawe yose, igitekerezo cy\'umwarimu, n\'iterambere ryawe. Buri munsi wakoze wongera streak yawe.'
        : 'Click "My Results" to see all your grades and teacher feedback. Log in every day to build your streak.',
      tip: isKin ? 'Amanota menshi = urwego rwo hejuru mu ntonde.' : 'More marks = higher level on the leaderboard.',
    },
    {
      icon: <div className="text-5xl">🏫</div>,
      title: isKin ? 'Injira mu Ishuri Ryawe' : 'Join Your Class',
      description: isKin
        ? 'Shyiramo kode wahawe n\'umwarimu wawe kugirango utangire kubona imikoro yawe.'
        : "Enter the invite code your teacher shared with you to start receiving assignments.",
      interactive: 'join_class',
    },
  ];

  const steps = userType === 'teacher' ? teacherSteps : studentSteps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  const handleJoinClass = async () => {
    if (code.trim().length < 4) return;
    setJoining(true);
    setJoinError('');

    const { data: cls, error: lookupError } = await getClassWithInviteCode(code.trim());
    if (lookupError || !cls) {
      setJoinError(isKin ? 'Kode ntabwo ibonetse. Baza umwarimu wawe.' : 'Code not found. Check with your teacher.');
      setJoining(false);
      return;
    }

    const { error: err } = await joinClass(cls.id);
    if (err === 'already_enrolled') {
      setJoined(true);
      setTimeout(onDone, 1200);
      return;
    }
    if (err) {
      setJoinError(err);
      setJoining(false);
      return;
    }

    setJoined(true);
    setTimeout(onDone, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-lg overflow-hidden" style={{ padding: 0 }}>

        {/* Progress bar */}
        <div className="h-1" style={{ background: 'var(--surface-2)' }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'var(--text)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <span className="text-xs font-semibold dim">
            {step + 1} / {steps.length}
          </span>
          <button onClick={onDone} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content — key={step} re-animates on each step change */}
        <div key={step} className="px-8 py-8 text-center" style={{ animation: 'rise 0.28s ease both' }}>
          <div className="flex justify-center mb-6">{current.icon}</div>

          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {current.title}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-2)', maxWidth: '360px', margin: '0 auto 16px' }}>
            {current.description}
          </p>

          {current.tip && (
            <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', color: 'var(--text-2)' }}>
              💡 {current.tip}
            </div>
          )}

          {/* Interactive join class form on last student step */}
          {current.interactive === 'join_class' && (
            <div style={{ marginTop: 20, textAlign: 'left' }}>
              {joined ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  padding: '20px 0', animation: 'rise 0.3s ease both',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'var(--surface-2)', border: '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle size={22} style={{ color: 'var(--text)' }} />
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>
                    {isKin ? 'Winjiye neza mu ishuri!' : "You've joined the class!"}
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleJoinClass()}
                      placeholder={isKin ? 'Shyiramo kode y\'ishuri...' : 'Enter class code...'}
                      className="input"
                      style={{ flex: 1, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                      maxLength={10}
                      autoFocus
                    />
                    <button
                      onClick={handleJoinClass}
                      disabled={joining || code.trim().length < 4}
                      className="btn btn-primary"
                      style={{ flexShrink: 0 }}
                    >
                      {joining
                        ? <Loader size={15} className="animate-spin" />
                        : <>{isKin ? 'Injira' : 'Join'} <ArrowRight size={14} /></>}
                    </button>
                  </div>
                  {joinError && (
                    <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--error)' }}>{joinError}</p>
                  )}
                  <button
                    onClick={onDone}
                    style={{ marginTop: 14, fontSize: 12.5, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block', width: '100%', textAlign: 'center' }}
                  >
                    {isKin ? 'Reka ubu, nzabikoreza nyuma →' : "Skip for now, I'll do this later →"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-4">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="transition-all"
              style={{
                width: i === step ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? 'var(--text)' : i < step ? 'var(--text-3)' : 'var(--line-strong)',
              }} />
          ))}
        </div>

        {/* Nav buttons — hidden on join class step (it has its own CTA) */}
        {!current.interactive && (
          <div className="px-6 pb-6 flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary flex-1">
                {isKin ? 'Subira inyuma' : 'Back'}
              </button>
            )}
            <button
              onClick={() => isLast ? onDone() : setStep(s => s + 1)}
              className="btn btn-primary flex-1">
              {isLast
                ? <>{isKin ? 'Tangira!' : "Let's go!"} <CheckCircle size={16} /></>
                : <>{isKin ? 'Komeza' : 'Next'} <ArrowRight size={16} /></>}
            </button>
          </div>
        )}

        {current.interactive && <div style={{ paddingBottom: 24 }} />}
      </div>
    </div>
  );
}
