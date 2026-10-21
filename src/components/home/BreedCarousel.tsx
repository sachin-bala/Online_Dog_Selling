import React from 'react';
import { BREEDS_LIST } from '../../data/breedData';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BreedCarousel: React.FC = () => {
  const { setActiveTab, setFilterBreed } = useApp();

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#18181B] px-3.5 py-1 rounded-full border border-[#FDE047] dark:border-[#27272A] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
            Breed Intelligence Guide
          </span>
          <h2 className="text-3xl font-extrabold text-[#0A0A0A] dark:text-white mt-2 font-heading">
            Popular Dog Breeds
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-normal mt-0.5">
            Detailed breed profiles, temperament analysis, and care guides for Indian families.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="btn-outline text-xs font-bold flex items-center gap-1.5"
        >
          <span>Explore All Breed Profiles</span>
          <ArrowRight className="w-4 h-4 text-[#EAB308]" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BREEDS_LIST.map((breed, idx) => (
          <div
            key={idx}
            onClick={() => {
              setFilterBreed(breed.name);
              setActiveTab('explore');
            }}
            className="rounded-3xl overflow-hidden bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] cursor-pointer hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between shadow-sm"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#FAFAFA] dark:bg-[#18181B]">
              <img
                src={breed.image}
                alt={breed.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 text-[#FACC15] font-bold backdrop-blur-md px-3 py-1 rounded-full text-[11px] border border-[#27272A] shadow-xs">
                {breed.avgPriceRange}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#0A0A0A] dark:text-[#0A0A0A] text-base group-hover:text-[#854D0E] transition-colors font-heading">
                  {breed.name}
                </h3>
                <span className="text-xs text-[#713F12] font-semibold">{breed.origin}</span>
              </div>

              <p className="text-xs text-[#713F12] dark:text-[#713F12] line-clamp-2 leading-relaxed font-medium">
                {breed.description}
              </p>

              <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between text-xs text-[#713F12]">
                <span>Energy: <strong className="text-[#0A0A0A] dark:text-[#0A0A0A] font-bold">{breed.energyLevel}</strong></span>
                <span>Lifespan: <strong className="text-[#854D0E] font-bold">{breed.lifeExpectancy}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
