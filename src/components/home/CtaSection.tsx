import React from 'react';
import { Compass, Sparkles, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CtaSection: React.FC = () => {
  const { setActiveTab, setIsRegisterSellerOpen, currentUser } = useApp();

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#27272A]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FACC15]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#EAB308]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 text-[#FACC15] text-xs font-bold shadow-xs border border-[#FACC15]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15] stroke-[2.5]" />
            <span>Ethical, DNA-Verified Companions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white font-heading">
            Ready to Welcome Your New Loyal Family Member?
          </h2>

          <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Browse verified listings, schedule a live video call with certified breeders, and enjoy safe escrow protection with doorstep climate-controlled delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('explore')}
              className="px-8 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold text-sm shadow-lg shadow-[#FACC15]/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Available Puppies</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => {
                if (currentUser?.role === 'seller') {
                  setActiveTab('seller');
                } else {
                  setIsRegisterSellerOpen(true);
                }
              }}
              className="px-6 py-3.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-sm border border-[#27272A] hover:border-[#3F3F46] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-[#FACC15] stroke-[2.5]" />
              <span>Are You a Certified Breeder? Apply Here</span>
            </button>
          </div>

          {/* Micro Trust Seals */}
          <div className="pt-6 border-t border-[#27272A] flex flex-wrap items-center gap-6 text-xs text-[#A1A1AA] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
              <span className="text-[#E4E4E7]">100% DNA Health Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
              <span className="text-[#E4E4E7]">KCI Registered Breeders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
              <span className="text-[#E4E4E7]">Escrow Refund Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
