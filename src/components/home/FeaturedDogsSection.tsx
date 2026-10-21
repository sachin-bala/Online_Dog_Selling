import React from 'react';
import { 
  Heart, 
  BarChart2, 
  Video, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturedDogsSection: React.FC = () => {
  const { 
    dogs, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare, 
    setSelectedDog, 
    startVideoCall,
    setActiveTab
  } = useApp();

  const featuredDogs = dogs.filter(d => d.featured || d.price > 2000).slice(0, 8);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#18181B] px-3.5 py-1 rounded-full border border-[#FDE047] dark:border-[#27272A]">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
            Verified Pedigree Litters
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] dark:text-white tracking-tight font-heading">
            Featured <span className="text-[#CA8A04] dark:text-[#FACC15]">Puppies & Dogs</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-normal">
            Hand-selected KCI certified litters with complete veterinary health clearances, microchip IDs, and live video inspection.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="btn-outline text-xs shrink-0 font-bold flex items-center gap-1.5"
        >
          <span>View All 150+ Puppies</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#EAB308]" />
        </button>
      </div>

      {/* Responsive Dogs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredDogs.map((dog) => {
          const isFavorited = wishlist.includes(dog.id);
          const isCompared = compareList.includes(dog.id);

          return (
            <div
              key={dog.id}
              className="rounded-3xl overflow-hidden bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] shadow-sm hover:shadow-lg hover:border-[#EAB308] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Quick Action Header */}
              <div className="relative aspect-[4/3] bg-[#FAFAFA] dark:bg-[#18181B] overflow-hidden">
                <img
                  src={dog.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'}
                  alt={dog.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Health & Availability Badge */}
                <div className="absolute top-3 left-3 bg-[#FEF9C3]/95 text-[#713F12] backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FDE047] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EAB308]" />
                  <span>Score {dog.health?.healthScore || 98}/100</span>
                </div>

                {/* Wishlist & Compare Quick Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleCompare(dog.id)}
                    className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                      isCompared
                        ? 'bg-[#FACC15] text-[#0A0A0A] shadow-xs'
                        : 'bg-[#FEF9C3]/90 text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A] shadow-xs border border-[#FDE047]'
                    }`}
                    title="Compare Specs"
                    aria-label="Compare"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(dog.id)}
                    className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                      isFavorited
                        ? 'bg-[#EF4444] text-white shadow-xs'
                        : 'bg-[#FEF9C3]/90 text-[#713F12] hover:text-[#EF4444] hover:bg-[#FEF08A] shadow-xs border border-[#FDE047]'
                    }`}
                    title="Add to Wishlist"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Live Video Indicator */}
                {dog.videoUrl && (
                  <button
                    onClick={() => startVideoCall(dog)}
                    className="absolute bottom-3 left-3 bg-[#0A0A0A] hover:bg-[#18181B] text-[#FACC15] border border-[#27272A] font-bold px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="w-3 h-3 stroke-[2] text-[#FACC15]" />
                    <span>Live Video</span>
                  </button>
                )}

                {/* Vibrant Yellow Featured Pill */}
                {dog.featured && (
                  <div className="absolute bottom-3 right-3 bg-[#FACC15] text-[#0A0A0A] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-xs border border-[#EAB308]">
                    Featured
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#713F12] mb-1">
                    <span className="text-[#713F12] font-bold uppercase tracking-wider bg-[#FEF08A] px-2 py-0.5 rounded-md border border-[#FACC15]">
                      {dog.breed}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[130px] text-[#713F12] font-medium">
                      <MapPin className="w-3 h-3 text-[#CA8A04] shrink-0" />
                      <span className="truncate">{dog.location}</span>
                    </span>
                  </div>

                  {/* Heading */}
                  <h3
                    onClick={() => setSelectedDog(dog)}
                    className="font-bold text-[#0A0A0A] dark:text-[#0A0A0A] text-base hover:text-[#854D0E] cursor-pointer transition-colors line-clamp-1 font-heading pt-1"
                  >
                    {dog.name}
                  </h3>

                  {/* Details metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#713F12] dark:text-[#713F12] pt-1 font-medium">
                    <span>{dog.age}</span>
                    <span>•</span>
                    <span>{dog.gender}</span>
                    <span>•</span>
                    <span className="truncate">{dog.color}</span>
                  </div>

                  {/* Breeder snippet */}
                  <div className="flex items-center justify-between text-[11px] text-[#713F12] dark:text-[#713F12] pt-2 border-t border-[#FDE047] dark:border-[#FDE047] mt-2">
                    <span className="truncate">Breeder: <strong className="text-[#0A0A0A] dark:text-[#0A0A0A] font-bold">{dog.seller?.name || 'Verified Kennel'}</strong></span>
                    {dog.seller?.rating && (
                      <span className="flex items-center gap-0.5 text-[#854D0E] font-bold">
                        <Star className="w-3 h-3 fill-current text-[#EAB308]" />
                        <span>{dog.seller.rating}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Price & Details Button */}
                <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#713F12] dark:text-[#713F12] block -mb-0.5 font-bold">Adoption Fee</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-[#0A0A0A] dark:text-[#0A0A0A]">
                        ₹{dog.price?.toLocaleString() || dog.price}
                      </span>
                      {dog.originalPrice && dog.originalPrice > dog.price && (
                        <span className="text-[10px] text-[#713F12]/60 line-through">
                          ₹{dog.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDog(dog)}
                    className="btn-primary px-3.5 py-2 text-xs shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
