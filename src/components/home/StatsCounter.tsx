import React from 'react';
import { ShieldCheck, Users, Dog, MapPin } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    { 
      id: 1, 
      label: 'Companions Placed in Loving Homes', 
      value: '12,450+', 
      icon: Dog, 
      highlight: '100% DNA Verified',
      iconBg: 'bg-[#FACC15] text-[#0A0A0A] border border-[#EAB308]',
      valueColor: 'text-[#0A0A0A] dark:text-[#0A0A0A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    { 
      id: 2, 
      label: 'Customer Satisfaction Score', 
      value: '99.8%', 
      icon: Users, 
      highlight: '5-Star Verified Reviews',
      iconBg: 'bg-[#EAB308] text-[#0A0A0A] border border-[#CA8A04]',
      valueColor: 'text-[#0A0A0A] dark:text-[#0A0A0A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    { 
      id: 3, 
      label: 'KCI Registered Breeders', 
      value: '450+', 
      icon: ShieldCheck, 
      highlight: 'Strictly Audited Kennels',
      iconBg: 'bg-[#FACC15] text-[#0A0A0A] border border-[#EAB308]',
      valueColor: 'text-[#0A0A0A] dark:text-[#0A0A0A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
    { 
      id: 4, 
      label: 'Cities Covered Across India', 
      value: '120+', 
      icon: MapPin, 
      highlight: 'AC Climate Delivery',
      iconBg: 'bg-[#EAB308] text-[#0A0A0A] border border-[#CA8A04]',
      valueColor: 'text-[#0A0A0A] dark:text-[#0A0A0A]',
      badgeClass: 'bg-[#0A0A0A] text-[#FACC15] border-[#27272A]'
    },
  ];

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] text-center space-y-2 hover:border-[#EAB308] hover:shadow-lg transition-all duration-300 group shadow-sm"
            >
              <div className={`w-11 h-11 rounded-2xl ${stat.iconBg} flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${stat.valueColor} tracking-tight font-heading`}>
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[#713F12] leading-snug">{stat.label}</div>
              <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${stat.badgeClass}`}>
                {stat.highlight}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
