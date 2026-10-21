import React from 'react';
import { Search, Video, ShieldCheck, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowItWorks: React.FC = () => {
  const { setActiveTab } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Browse & Compare Breeds',
      description: 'Explore verified KCI registered puppies and native Indian breeds with transparent health scores, pedigree details, and live pricing.',
      icon: Search,
      badge: 'Step 1: Explore',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      step: '02',
      title: 'Live 1-on-1 Video Call',
      description: 'Connect directly with certified breeders over HD live video to observe the puppy\'s health, playfulness, and living conditions.',
      icon: Video,
      badge: 'Step 2: Video Call',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      step: '03',
      title: 'Secure Escrow Checkout',
      description: 'Your payment is safely held in an RBI-compliant escrow account via Razorpay/UPI until you inspect and officially receive your pet.',
      icon: ShieldCheck,
      badge: 'Step 3: Escrow Pay',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      step: '04',
      title: 'Chaperoned AC Delivery',
      description: 'Doorstep arrival in climate-controlled AC transport with trained veterinary handlers and real-time live GPS satellite tracking.',
      icon: Truck,
      badge: 'Step 4: Safe Arrival',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#18181B] px-3.5 py-1 rounded-full border border-[#FDE047] dark:border-[#27272A]">
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          Simple & Transparent
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] dark:text-white tracking-tight font-heading">
          How PawVerse Works
        </h2>
        <p className="text-[#71717A] text-sm sm:text-base leading-relaxed font-normal">
          Four easy steps to safely bring home a healthy, certified pedigree puppy with complete peace of mind.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative p-6 flex flex-col justify-between space-y-5 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-3xl shadow-sm hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Header inside card: Step number & Icon */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold font-heading text-[#CA8A04]/50 group-hover:text-[#CA8A04] transition-colors">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl ${item.iconClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xs`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0A0A0A] dark:text-[#0A0A0A] group-hover:text-[#854D0E] transition-colors font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-[#713F12] dark:text-[#713F12] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Step indicator footer */}
              <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                  {item.badge}
                </span>
                {index < 3 && (
                  <ArrowRight className="w-4 h-4 text-[#854D0E] group-hover:translate-x-1 transition-all hidden lg:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Strip */}
      <div className="text-center pt-2">
        <button
          onClick={() => setActiveTab('explore')}
          className="btn-primary"
        >
          <span>Find Available Puppies</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
};
