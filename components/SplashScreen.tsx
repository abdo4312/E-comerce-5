import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
    <svg className={`${className} text-orange-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

const SplashScreen: React.FC = () => {
  return (
    <div dir="rtl" className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100">
      <div className="text-center">
        <div className="animate-bounce">
            <LogoIcon className="w-24 h-24 mx-auto mb-4" />
        </div>
        <span className="text-4xl font-black text-gray-800 animate-pulse">قرطاسية</span>
        <p className="text-gray-600 mt-4 animate-pulse">...جاري التحميل</p>
      </div>
    </div>
  );
};

export default SplashScreen;
