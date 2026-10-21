import React from 'react';
import { Sparkles, Cpu, ArrowRight, Home, Heart, Thermometer, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiTeaserSection: React.FC = () => {
  const { setActiveTab, setIsAiFinderOpen } = useApp();

  const parameters = [
    { label: 'Living Space Matrix', detail: 'Apartment vs Suburban Villa', icon: Home, color: 'text-[#2F7D68] bg-[#2F7D68]/20 border-[#2F7D68]/30' },
    { label: 'Family & Toddler Safety', detail: 'Temperament evaluation for kids', icon: Heart, color: 'text-[#D89B5B] bg-[#D89B5B]/20 border-[#D89B5B]/30' },
    { label: 'Climate Tolerance', detail: 'Cold snow vs tropical heat adaptation', icon: Thermometer, color: 'text-[#D89B5B] bg-[#D89B5B]/20 border-[#D89B5B]/30' },
    { label: 'Activity Index', detail: 'Daily walking minutes & energy match', icon: UserCheck, color: 'text-[#2F7D68] bg-[#2F7D68]/20 border-[#2F7D68]/30' }
  ];

  return (
    <section className="w-full py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden bg-[#5B3A29] text-white border border-[#482E20] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D89B5B]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2F7D68]/15 blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="max-w-xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D89B5B]/20 text-[#D89B5B] text-xs font-bold border border-[#D89B5B]/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#D89B5B] stroke-[2.5]" />
            <span>AI Companion Engine v4.2</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Find Your Companion Using <br />
            <span className="text-[#D89B5B]">Artificial Intelligence</span>
          </h2>

          <p className="text-[#FFF9F2]/80 text-xs sm:text-sm leading-relaxed font-normal">
            Stop guessing! Our neural algorithm cross-references 150+ breed behaviors, grooming needs, daily active hours, and apartment suitability to pinpoint your 99.4% compatible companion.
          </p>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {parameters.map((param, idx) => {
              const Icon = param.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${param.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">{param.label}</h5>
                    <p className="text-[10px] text-[#FFF9F2]/70">{param.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('ai-finder');
                setIsAiFinderOpen(true);
              }}
              className="px-6 py-3.5 rounded-xl bg-[#2F7D68] hover:bg-[#246252] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Launch AI Breed Questionnaire</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Neural Visual Graphic */}
        <div className="w-full lg:w-96 bg-[#482E20] p-6 rounded-2xl border border-[#D89B5B]/30 text-center space-y-4 shadow-xl relative z-10">
          <div className="w-16 h-16 bg-[#D89B5B] rounded-2xl mx-auto flex items-center justify-center shadow-md">
            <Cpu className="w-8 h-8 text-[#5B3A29] stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-[#D89B5B] flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-[#2F7D68]" />
              <span>99.4% Match Accuracy</span>
            </div>
            <p className="text-xs text-[#FFF9F2]/70 font-medium">Based on 12,000+ successful adoptions</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#3D2518] border border-[#5B3A29] text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#FFF9F2]">
              <span className="font-medium text-xs">Lifestyle Score:</span> 
              <span className="font-bold text-[#2F7D68] bg-[#2F7D68]/20 px-2 py-0.5 rounded border border-[#2F7D68]/30 text-[10px]">Optimal (98/100)</span>
            </div>
            <div className="flex justify-between items-center text-[#FFF9F2]">
              <span className="font-medium text-xs">Apartment Rating:</span> 
              <span className="font-bold text-[#D89B5B] bg-[#D89B5B]/20 px-2 py-0.5 rounded border border-[#D89B5B]/30 text-[10px]">High Suitability</span>
            </div>
            <div className="flex justify-between items-center text-[#FFF9F2]">
              <span className="font-medium text-xs">Climate Fit:</span> 
              <span className="font-bold text-[#2F7D68] bg-[#2F7D68]/20 px-2 py-0.5 rounded border border-[#2F7D68]/30 text-[10px]">100% Compatible</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
