import React from 'react';
import { Dog, Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FFF9F2] flex flex-col items-center justify-center space-y-6 text-center">
      {/* Animated glowing paw container */}
      <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-[#5B3A29] p-1 shadow-xl shadow-[#5B3A29]/15">
        <div className="w-full h-full bg-[#5B3A29] rounded-[22px] flex items-center justify-center">
          <Dog className="w-10 h-10 text-[#D89B5B] animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-[#5B3A29] tracking-tight flex items-center justify-center gap-2">
          <span>PawVerse</span> <span className="text-[#D89B5B]">India</span>
          <Sparkles className="w-5 h-5 text-[#D89B5B] animate-spin" />
        </h2>
        <p className="text-xs text-[#6B7280] font-medium tracking-wider uppercase animate-pulse">
          Connecting Verified Lineages & Veterinary Care...
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-[#E8DED3] rounded-full overflow-hidden">
        <div className="w-full h-full bg-[#D89B5B] animate-pulse"></div>
      </div>
    </div>
  );
};
