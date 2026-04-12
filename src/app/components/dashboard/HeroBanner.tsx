interface HeroBannerProps {
  language: 'EN' | 'KIN';
  studentName: string;
}

export function HeroBanner({ language, studentName }: HeroBannerProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, #13161e 0%, #1a1e2a 50%, #13161e 100%)',
      border: '1px solid rgba(0, 212, 170, 0.2)',
      boxShadow: '0 0 40px rgba(0, 212, 170, 0.06)'
    }}>
      {/* Teal glow top-left */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)',
        transform: 'translate(-30%, -30%)'
      }} />
      {/* Purple glow bottom-right */}
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
        transform: 'translate(30%, 30%)'
      }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
            {isKinyarwanda ? 'Murakaza neza' : 'Welcome back'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>
            {isKinyarwanda ? `Mwaramutse, ${studentName}!` : `Hello, ${studentName}!`}
          </h1>
          <p className="text-base" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8' }}>
            {isKinyarwanda ? 'Komeza kwiga — urakora neza' : 'Keep learning — you\'re doing great'}
          </p>
        </div>

        {/* Code icon box */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center shrink-0" style={{
          background: 'rgba(0,212,170,0.08)',
          border: '1px solid rgba(0,212,170,0.2)',
        }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <path d="M8 6L2 12L8 18" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 6L22 12L16 18" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 4L10 20" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
