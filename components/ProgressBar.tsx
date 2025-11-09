import React from 'react';

interface ProgressBarProps {
  isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isLoading }) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-[9999] transition-opacity duration-300 ease-out ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="progressbar"
      aria-busy={isLoading}
      aria-valuetext={isLoading ? 'Loading' : 'Loaded'}
    >
      <div
        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-md"
        style={{
          width: isLoading ? '90%' : '100%',
          transition: `width ${isLoading ? '10s' : '0.3s'} ease-in-out`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
