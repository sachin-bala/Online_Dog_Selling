import React from 'react';

export const DogCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-white border border-[#E8DED3] p-4 space-y-4 shadow-xs">
      <div className="w-full h-56 bg-[#FFF9F2] border border-[#E8DED3]/50 rounded-2xl animate-pulse"></div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-[#E8DED3]/60 rounded animate-pulse"></div>
        <div className="w-1/2 h-4 bg-[#E8DED3]/40 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="w-20 h-6 bg-[#E8DED3]/50 rounded-lg animate-pulse"></div>
        <div className="w-24 h-9 bg-[#5B3A29]/10 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-white border border-[#E8DED3] p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="w-24 h-4 bg-[#E8DED3]/60 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-[#E8DED3]/50 rounded-full animate-pulse"></div>
      </div>
      <div className="w-36 h-8 bg-[#E8DED3]/70 rounded animate-pulse"></div>
      <div className="w-full h-2 bg-[#E8DED3]/40 rounded-full animate-pulse"></div>
    </div>
  );
};
