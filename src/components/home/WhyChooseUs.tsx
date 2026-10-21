import React from 'react';
import { 
  UserCheck, 
  FileCheck, 
  Video, 
  ShieldCheck, 
  Truck, 
  HeartHandshake,
  Sparkles 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Verified Breeders',
      description: 'Every kennel undergoes strict in-person audits, government registration checks, and Kennel Club of India (KCI) registry verification.',
      icon: UserCheck,
      badge: 'Audited & Verified',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      id: 2,
      title: '100% DNA Certified',
      description: 'Authentic pedigree records, genetic purebred certification, microchip identification, and up-to-date core vaccination records.',
      icon: FileCheck,
      badge: 'Genetic Purity',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      id: 3,
      title: 'Live Video Inspection',
      description: 'Schedule HD 1-on-1 live video calls with breeders to inspect puppy behavior, playfulness, and living environment before reserving.',
      icon: Video,
      badge: 'HD Video Calls',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      id: 4,
      title: 'Secure Escrow Payment',
      description: 'Your payment is safely held in an RBI-compliant escrow account until your puppy arrives home safely and passes your personal inspection.',
      icon: ShieldCheck,
      badge: 'Escrow Guarantee',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      id: 5,
      title: 'AC Climate Delivery',
      description: 'Doorstep transit in temperature-regulated vehicles accompanied by certified veterinary handlers with real-time GPS tracking.',
      icon: Truck,
      badge: 'Doorstep GPS',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    {
      id: 6,
      title: 'Lifetime Vet Support',
      description: 'Complimentary access to certified canine nutritionists and veterinary advice for vaccinations, diet, and training throughout their life.',
      icon: HeartHandshake,
      badge: '24/7 Care Advice',
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#18181B] px-3.5 py-1 rounded-full border border-[#FDE047] dark:border-[#27272A]">
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          Trust & Excellence
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] dark:text-white tracking-tight font-heading">
          Why Choose PawVerse
        </h2>
        <p className="text-[#71717A] text-sm sm:text-base leading-relaxed font-normal">
          We set the gold standard in ethical pet companionship, putting health, transparency, and safety above all else.
        </p>
      </div>

      {/* 6 Benefit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-6 flex flex-col justify-between space-y-4 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-3xl shadow-sm hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${item.iconClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xs`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#0A0A0A] dark:text-[#0A0A0A] group-hover:text-[#854D0E] transition-colors font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#713F12] dark:text-[#713F12] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047]">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
