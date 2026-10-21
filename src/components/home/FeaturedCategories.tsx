import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  HeartHandshake, 
  Star, 
  Shield, 
  Award, 
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturedCategories: React.FC = () => {
  const { setActiveTab, setFilterCategory } = useApp();

  const categories = [
    { 
      id: 'Puppies', 
      name: 'Puppies', 
      count: '45+ Available', 
      icon: Sparkles, 
      iconClass: 'bg-[#FEF08A] text-[#713F12]',
      image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'Guard Dogs', 
      name: 'Guard Dogs', 
      count: '18 Available', 
      icon: ShieldAlert, 
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'Family Dogs', 
      name: 'Family Dogs', 
      count: '32 Available', 
      icon: HeartHandshake, 
      iconClass: 'bg-[#FEF08A] text-[#713F12]',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'Small Dogs', 
      name: 'Small Dogs', 
      count: '28 Available', 
      icon: Star, 
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'Large Dogs', 
      name: 'Large Dogs', 
      count: '22 Available', 
      icon: Shield, 
      iconClass: 'bg-[#FEF08A] text-[#713F12]',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'Rare Breeds', 
      name: 'TN Heritage', 
      count: 'Rajapalayam & Kanni', 
      icon: Award, 
      iconClass: 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A]',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9875e?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'Show Dogs', 
      name: 'Show Champions', 
      count: '15 Available', 
      icon: Award, 
      iconClass: 'bg-[#FEF08A] text-[#713F12]',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=400&q=80'
    },
  ];

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF9C3] dark:bg-[#18181B] text-[#713F12] dark:text-[#FACC15] border border-[#FDE047] dark:border-[#27272A] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" /> Curated Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] dark:text-white mt-1 font-heading">
            Browse By Category
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-normal mt-0.5">
            Explore companion dogs handpicked for your lifestyle, home size, and family needs.
          </p>
        </div>

        <button
          onClick={() => {
            setFilterCategory('All');
            setActiveTab('explore');
          }}
          className="btn-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <span>View All Categories</span>
          <ChevronRight className="w-4 h-4 text-[#EAB308]" />
        </button>
      </div>

      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 sm:pb-0 scroll-smooth snap-x snap-mandatory">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
                setActiveTab('explore');
              }}
              className="min-w-[130px] sm:min-w-0 flex-shrink-0 p-4 rounded-2xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] text-center cursor-pointer hover:border-[#EAB308] hover:-translate-y-1 transition-all duration-300 group shadow-sm snap-start flex flex-col items-center justify-between"
            >
              {/* Category Image Avatar with Icon Badge */}
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#EAB308]/40 group-hover:border-[#EAB308] transition-colors shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${cat.iconClass} flex items-center justify-center shadow-sm border border-[#FEF9C3] text-xs`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </div>

              {/* Title & Count */}
              <div>
                <h4 className="font-bold text-[#0A0A0A] text-xs sm:text-sm group-hover:text-[#713F12] transition-colors font-heading">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-[#713F12]/70 mt-0.5 font-medium">{cat.count}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
