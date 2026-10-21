import React from 'react';
import { TESTIMONIALS } from '../../data/testimonialsData';
import { Star, ShieldCheck, Quote, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#18181B] px-3.5 py-1 rounded-full border border-[#FDE047] dark:border-[#27272A] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          Verified Stories
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] dark:text-white tracking-tight font-heading">
          Loved by Verified Families
        </h2>
        <p className="text-[#71717A] text-xs sm:text-sm font-normal">
          Real experiences from pet parents who adopted healthy, certified companions through our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="p-6 sm:p-7 rounded-3xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4 relative flex flex-col justify-between shadow-sm group"
          >
            <Quote className="w-9 h-9 text-[#EAB308]/20 absolute top-5 right-5 pointer-events-none group-hover:text-[#EAB308]/35 transition-colors" />

            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-[#EAB308]">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current stroke-[2.2]" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-[#0A0A0A] dark:text-[#0A0A0A] leading-relaxed italic font-medium">
                "{t.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#EAB308] shadow-xs" 
                />
                <div>
                  <h4 className="font-bold text-[#0A0A0A] dark:text-[#0A0A0A] text-xs font-heading">{t.name}</h4>
                  <p className="text-[10px] text-[#713F12] font-semibold">{t.role} • {t.city}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] bg-[#0A0A0A] text-[#FACC15] font-bold px-2.5 py-0.5 rounded-full border border-black flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" /> Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
