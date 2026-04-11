import React from 'react';

interface HeroBannerProps {
  language: 'EN' | 'KIN';
  studentName: string;
}

export function HeroBanner({ language, studentName }: HeroBannerProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="relative bg-gradient-to-r from-[#0ea5e9] via-[#8b5cf6] to-[#10b981] p-8 md:p-12 rounded-xl shadow-xl overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Welcome Text */}
        <div className="flex-1 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? `Mwaramutse, ${studentName}!` : `Hello, ${studentName}!`}
          </h1>
          <p className="text-lg md:text-xl opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Komeza kwiga! Urakora neza' : 'Keep learning! You\'re doing great'}
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14L12 10M12 6H12.01M4 8L12 4L20 8M4 8L12 12M4 8V16L12 20M20 8L12 12M20 8V16L12 20M12 12V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
