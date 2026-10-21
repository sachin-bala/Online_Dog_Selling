import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Heart, 
  BarChart2, 
  Video, 
  RotateCw, 
  Check, 
  Star, 
  Phone,
  MapPin,
  Award,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Viewer360 } from '../common/360Viewer';

export const DogDetailsModal: React.FC = () => {
  const { 
    selectedDog, 
    setSelectedDog, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare,
    startCheckout,
    startVideoCall,
    dogs
  } = useApp();

  const [activeMedia, setActiveMedia] = useState<'photos' | '360' | 'video'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!selectedDog) return null;

  const isFavorited = wishlist.includes(selectedDog.id);
  const isCompared = compareList.includes(selectedDog.id);

  const images = selectedDog.images && selectedDog.images.length > 0 
    ? selectedDog.images 
    : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80'];

  const relatedDogs = dogs.filter(d => d.id !== selectedDog.id && (d.breed === selectedDog.breed || d.category === selectedDog.category)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#121212] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#FAFAFA] dark:bg-[#18181B] border-b border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF08A] dark:bg-[#FACC15]/15 px-3 py-1 rounded-full border border-[#FDE047] dark:border-[#FACC15]/25 shadow-xs">
              {selectedDog.breed}
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0A0A0A] dark:text-white hidden sm:block truncate max-w-xs font-heading">
              {selectedDog.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(selectedDog.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isCompared 
                  ? 'bg-[#FACC15] text-[#0A0A0A] font-bold border-[#FACC15] shadow-xs' 
                  : 'bg-white dark:bg-[#1E1E22] text-[#71717A] dark:text-[#A1A1AA] border-[#E4E4E7] dark:border-[#27272A] hover:text-[#0A0A0A] dark:hover:text-white'
              }`}
              title="Compare"
              aria-label="Compare"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWishlist(selectedDog.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isFavorited 
                  ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-xs' 
                  : 'bg-white dark:bg-[#1E1E22] text-[#71717A] dark:text-[#A1A1AA] border-[#E4E4E7] dark:border-[#27272A] hover:text-[#EF4444]'
              }`}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedDog(null)}
              className="p-2 rounded-xl bg-white dark:bg-[#1E1E22] border border-[#E4E4E7] dark:border-[#27272A] text-[#0A0A0A] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 bg-white dark:bg-[#121212]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Media Showcase */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Media Viewport */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
                {activeMedia === 'photos' && (
                  <img
                    src={images[activePhotoIndex] || images[0]}
                    alt={selectedDog.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                )}

                {activeMedia === '360' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Viewer360 
                      frames={selectedDog.frames360 && selectedDog.frames360.length > 0 ? selectedDog.frames360 : images} 
                      dogName={selectedDog.name}
                    />
                  </div>
                )}

                {activeMedia === 'video' && selectedDog.videoUrl && (
                  <div className="w-full h-full flex items-center justify-center p-6 text-center">
                    <button
                      onClick={() => startVideoCall(selectedDog)}
                      className="btn-primary"
                    >
                      <Video className="w-4 h-4" />
                      <span>Connect Live Video Call</span>
                    </button>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3 bg-black/85 text-[#FACC15] backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-[#FACC15]/30 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>KCI Verified Pedigree</span>
                </div>
              </div>

              {/* Media Switcher Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMedia('photos')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeMedia === 'photos' ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] shadow-xs' : 'bg-[#FAFAFA] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA]'
                  }`}
                >
                  Photos ({images.length})
                </button>

                <button
                  onClick={() => setActiveMedia('360')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    activeMedia === '360' ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] shadow-xs' : 'bg-[#FAFAFA] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA]'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>360° View</span>
                </button>

                {selectedDog.videoUrl && (
                  <button
                    onClick={() => setActiveMedia('video')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      activeMedia === 'video' ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] shadow-xs' : 'bg-[#FAFAFA] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Live Video</span>
                  </button>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePhotoIndex(idx);
                        setActiveMedia('photos');
                      }}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activePhotoIndex === idx && activeMedia === 'photos'
                          ? 'border-[#FACC15] shadow-xs scale-105'
                          : 'border-[#E4E4E7] dark:border-[#27272A] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right Column: Dog Details & Specifications */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Title, Breed, Location */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#71717A] dark:text-[#A1A1AA]">
                  <span className="text-[#CA8A04] dark:text-[#FACC15] uppercase tracking-wider">{selectedDog.breed}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#EAB308]" /> {selectedDog.location}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] dark:text-white font-heading">
                  {selectedDog.name}
                </h1>

                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                  {selectedDog.age} • {selectedDog.gender} • {selectedDog.color} • Weight: {selectedDog.weightKg || 8} kg
                </p>
              </div>

              {/* Price Banner & Availability */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] block">Adoption Fee</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#0A0A0A] dark:text-[#FACC15] font-heading">
                      ₹{selectedDog.price?.toLocaleString() || selectedDog.price}
                    </span>
                    {selectedDog.originalPrice && selectedDog.originalPrice > selectedDog.price && (
                      <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] line-through">
                        ₹{selectedDog.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#713F12] dark:text-[#FACC15] bg-[#FEF08A] dark:bg-[#FACC15]/15 px-3 py-1 rounded-full border border-[#FDE047] dark:border-[#FACC15]/25 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Ready for Adoption
                  </span>
                  <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] mt-1 font-medium">Escrow Protected Payment</p>
                </div>
              </div>

              {/* Key Traits & Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center shadow-xs">
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] block font-medium">Vaccination</span>
                  <span className="text-xs font-bold text-[#0A0A0A] dark:text-white">{selectedDog.health?.vaccinationStatus || 'Complete'}</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center shadow-xs">
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] block font-medium">Microchip</span>
                  <span className="text-xs font-bold text-[#0A0A0A] dark:text-white">{selectedDog.health?.microchipId ? 'Installed ✓' : 'Available'}</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center shadow-xs">
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] block font-medium">Health Score</span>
                  <span className="text-xs font-bold text-[#CA8A04] dark:text-[#FACC15]">{selectedDog.health?.healthScore || 98}/100</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center shadow-xs">
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] block font-medium">DNA Tested</span>
                  <span className="text-xs font-bold text-[#CA8A04] dark:text-[#FACC15]">{selectedDog.health?.dnaVerified ? 'Verified ✓' : 'Certified'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] dark:text-white">About Companion</h4>
                <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed font-normal">
                  {selectedDog.description}
                </p>
              </div>

              {/* Seller Information Card */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] dark:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#EAB308]" /> Certified Breeder Profile
                  </span>
                  <span className="text-[10px] bg-[#FEF08A] dark:bg-[#FACC15]/15 text-[#713F12] dark:text-[#FACC15] font-bold px-2 py-0.5 rounded-full border border-[#FDE047] dark:border-[#FACC15]/25">
                    KCI Audited
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedDog.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={selectedDog.seller?.name || 'Breeder'}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E4E4E7] dark:border-[#27272A]"
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#0A0A0A] dark:text-white text-sm">
                      {selectedDog.seller?.businessName || selectedDog.seller?.name || 'Verified Breeder'}
                    </h4>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                      Contact: {selectedDog.seller?.name} • {selectedDog.seller?.city || selectedDog.location}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                      <span className="flex items-center text-[#EAB308] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {selectedDog.seller?.rating || 4.9}
                      </span>
                      <span>({selectedDog.seller?.reviewsCount || 18} Verified Reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#EAB308]" /> {selectedDog.seller?.phone || '+91 98400 12345'}
                  </span>
                  <span className="font-semibold text-[#0A0A0A] dark:text-[#FACC15]">
                    Direct Breeder Verified
                  </span>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => startCheckout(selectedDog)}
                  className="btn-primary py-3.5 flex-1 text-sm shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adopt / Reserve Now (₹{selectedDog.price?.toLocaleString()})</span>
                </button>

                <button
                  onClick={() => startVideoCall(selectedDog)}
                  className="btn-secondary py-3.5 px-5 text-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>Meet on Live Call</span>
                </button>
              </div>

            </div>

          </div>

          {/* Related Companions Section */}
          {relatedDogs.length > 0 && (
            <div className="pt-8 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-4">
              <h3 className="text-base font-bold text-[#0A0A0A] dark:text-white font-heading">
                Similar Certified Companions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedDogs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDog(d);
                      setActivePhotoIndex(0);
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex items-center gap-3 cursor-pointer hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-colors shadow-xs"
                  >
                    <img src={d.images?.[0]} alt={d.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-[#0A0A0A] dark:text-white line-clamp-1">{d.name}</h4>
                      <p className="text-[11px] text-[#0A0A0A] dark:text-[#FACC15] font-bold">₹{d.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
