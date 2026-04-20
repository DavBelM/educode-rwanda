import { useState } from 'react';
import { ArrowRight, X, Code2, BookOpen, Users, BarChart2, Megaphone, ClipboardList, CheckCircle } from 'lucide-react';

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
}

export default function OnboardingModal({ userType, userName, language, onDone }: Props) {
  const isKin = language === 'KIN';
  const [step, setStep] = useState(0);
  const firstName = userName.split(' ')[0];

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
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)' }}><Users size={28} style={{ color: '#00d4aa' }} /></div>,
      title: isKin ? 'Kora Ishuri Ryawe' : 'Create Your Class',
      description: isKin
        ? 'Tangira no gukora ishuri. Buri ishuri rifite kode yihariye yo kwinjira — ushyiraho abanyeshuri bawe bakoresheje iyo kode.'
        : 'Start by creating a class. Each class gets a unique invite code — share it with your students so they can join.',
      tip: isKin ? 'Urashobora gukora amashuri menshi.' : 'You can create multiple classes.',
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}><ClipboardList size={28} style={{ color: '#8b5cf6' }} /></div>,
      title: isKin ? 'Tanga Imishinga' : 'Create Assignments',
      description: isKin
        ? 'Tanga imishinga yo kwandika (theoretical) cyangwa ya code. Ushobora gushyira igihe, amanota, n\'imikino yo gusuzuma (exam mode) kugirango abanyeshuri bawe bige neza.'
        : 'Create written (theoretical) or coding assignments. Set deadlines, marks, and enable Exam Mode to prevent cheating.',
      tip: isKin ? 'Exam Mode ifunga screen kandi ikurikirane guhindura tab.' : 'Exam Mode locks the screen and tracks tab switches.',
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}><BarChart2 size={28} style={{ color: '#f59e0b' }} /></div>,
      title: isKin ? 'Subiramo no Guha Amanota' : 'Review & Grade',
      description: isKin
        ? 'Reba ibisubizo bya buri munyeshuri, tanga amanota, wongere igitekerezo cyawe. Reba Analytics kugirango ubonee ikigereranyo cy\'ishuri ryawe.'
        : "Review each student's submission, assign marks, and leave feedback. Use Analytics to see your whole class performance at a glance.",
      tip: isKin ? 'Abanyeshuri babona igitekerezo cyawe kuri dashboard yabo.' : 'Students see your feedback on their dashboard.',
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)' }}><Megaphone size={28} style={{ color: '#00d4aa' }} /></div>,
      title: isKin ? 'Ohereza Inkuru' : 'Post Announcements',
      description: isKin
        ? 'Tumira abanyeshuri bawe inkuru ingenzi, nk\'igihe cy\'ikizamini cyangwa amakuru mashya. Abanyeshuri babona buri kintu kuri dashboard yabo.'
        : 'Send your students important notices — exam dates, reminders, updates. Students see them instantly on their dashboard.',
      tip: isKin ? 'Ushobora gushyira inkuru ndetse ukazisiba.' : 'You can pin announcements for extra visibility.',
    },
  ];

  const studentSteps: Step[] = [
    {
      icon: <div className="text-5xl">🎉</div>,
      title: isKin ? `Murakaza neza, ${firstName}!` : `Welcome, ${firstName}!`,
      description: isKin
        ? 'Winjiye kuri EduCode Rwanda — ahantu ho kwiga JavaScript mu Kinyarwanda no mu Cyongereza. Dufashe.'
        : "You've joined EduCode Rwanda — a place to learn JavaScript in Kinyarwanda and English. Let's get you started.",
      tip: isKin ? 'Ibi bizafata iminota ibiri.' : "This will only take two minutes.",
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)' }}><Users size={28} style={{ color: '#00d4aa' }} /></div>,
      title: isKin ? 'Injira mu Ishuri' : 'Join Your Class',
      description: isKin
        ? 'Baza umwarimu wawe kode yo kwinjira mu ishuri. Kanda "Join Class" kuri dashboard kuzuzamo iyo kode.'
        : 'Ask your teacher for the class invite code. Click "Join Class" on your dashboard and enter it.',
      tip: isKin ? 'Urashobora kwinjira mu mashuri menshi.' : 'You can join multiple classes.',
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}><BookOpen size={28} style={{ color: '#8b5cf6' }} /></div>,
      title: isKin ? 'Kora Imishinga' : 'Complete Assignments',
      description: isKin
        ? 'Imishinga yawe igaragara kuri dashboard. Fungura umushinga, subiza ibibazo, cyangwa wandike code — hanyuma wohereze mbere y\'itariki.'
        : 'Your assignments appear on your dashboard. Open one, answer the questions or write your code — then submit before the deadline.',
      tip: isKin ? 'Imishinga y\'ikizamini ifunga screen nkuko igihe gitemba.' : 'Exam assignments lock the screen and auto-submit when time runs out.',
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)' }}><Code2 size={28} style={{ color: '#00d4aa' }} /></div>,
      title: isKin ? 'Wige Gukora Code' : 'Practice Coding',
      description: isKin
        ? 'Fungura "Courses" kugirango ubone amasomo. Jya muri Coding Workspace igihe icyo aricyo cyose kugirango ugerageze JavaScript yawe.'
        : 'Open Courses to follow structured lessons. Use the Coding Workspace anytime to experiment with JavaScript freely.',
      tip: isKin ? 'AI izagufasha gusobanura amakosa mu code yawe.' : 'The AI will explain errors in your code as you learn.',
    },
    {
      icon: <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}><CheckCircle size={28} style={{ color: '#f59e0b' }} /></div>,
      title: isKin ? 'Kurikirana Iterambere Ryawe' : 'Track Your Progress',
      description: isKin
        ? 'Kanda "My Results" kugirango ubone amanota yawe yose, igitekerezo cy\'umwarimu, n\'iterambere ryawe. Buri munsi wakoze wongera streak yawe.'
        : 'Click "My Results" to see all your grades and teacher feedback. Log in every day to build your streak.',
      tip: isKin ? 'Amanota menshi atera urwego rwawe gukura.' : 'More marks = higher level on the leaderboard.',
    },
  ];

  const steps = userType === 'teacher' ? teacherSteps : studentSteps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>

        {/* Progress bar */}
        <div className="h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00d4aa, #8b5cf6)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <span className="text-xs font-semibold" style={{ color: '#334155' }}>
            {step + 1} / {steps.length}
          </span>
          <button onClick={onDone} style={{ color: '#334155' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center">
          <div className="flex justify-center mb-6">{current.icon}</div>

          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            {current.title}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748b', maxWidth: '360px', margin: '0 auto 16px' }}>
            {current.description}
          </p>

          {current.tip && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.15)', color: '#00d4aa' }}>
              💡 {current.tip}
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
                background: i === step ? '#00d4aa' : i < step ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.1)',
              }} />
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
              {isKin ? 'Subira' : 'Back'}
            </button>
          )}
          <button
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: isLast ? '#00d4aa' : 'rgba(0,212,170,0.12)', color: isLast ? '#0d0f14' : '#00d4aa', border: isLast ? 'none' : '1px solid rgba(0,212,170,0.25)', boxShadow: isLast ? '0 0 24px rgba(0,212,170,0.25)' : 'none' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isLast ? '#00bfa0' : 'rgba(0,212,170,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isLast ? '#00d4aa' : 'rgba(0,212,170,0.12)'; }}>
            {isLast
              ? <>{isKin ? 'Tangira!' : "Let's go!"} <CheckCircle size={16} /></>
              : <>{isKin ? 'Komeza' : 'Next'} <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
