import React, { useState } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  RotateCcw, 
  Heart, 
  BarChart2, 
  Eye, 
  MapPin, 
  Clock, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BREEDS_LIST } from '../../data/breedData';

export const ExploreDogsView: React.FC = () => {
  const { 
    dogs, 
    searchQuery, 
    setSearchQuery, 
    filterBreed, 
    setFilterBreed, 
    filterCategory, 
    setFilterCategory,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    setSelectedDog,
    startVideoCall
  } = useApp();

  const [priceMax, setPriceMax] = useState<number>(150000);
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [onlyVaccinated, setOnlyVaccinated] = useState<boolean>(false);
  const [onlyMicrochipped, setOnlyMicrochipped] = useState<boolean>(false);
  const [onlyDnaVerified, setOnlyDnaVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'Puppies', 'Guard Dogs', 'Family Dogs', 'Small Dogs', 'Large Dogs', 'Rare Breeds', 'Show Dogs'];
  const breeds = ['All', ...BREEDS_LIST.map(b => b.name)];
  const cities = ['All', 'Chennai, TN', 'Coimbatore, TN', 'Madurai, TN', 'Tiruchirappalli, TN', 'Salem, TN', 'Rajapalayam, TN', 'Tirunelveli, TN', 'Bengaluru, KA'];

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterBreed('All');
    setFilterCategory('All');
    setSelectedCity('All');
    setPriceMax(150000);
    setSelectedGender('All');
    setOnlyVaccinated(false);
    setOnlyMicrochipped(false);
    setOnlyDnaVerified(false);
  };

  // Filter Logic
  const filteredDogs = dogs.filter(dog => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = dog.name.toLowerCase().includes(q);
      const matchBreed = dog.breed.toLowerCase().includes(q);
      const matchCity = (dog.location || '').toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchCity) return false;
    }

    if (filterCategory !== 'All' && dog.category !== filterCategory) return false;
    if (filterBreed !== 'All' && dog.breed !== filterBreed) return false;
    if (selectedCity !== 'All' && !(dog.location || '').toLowerCase().includes(selectedCity.split(',')[0].toLowerCase())) return false;
    if (dog.price > priceMax) return false;
    if (selectedGender !== 'All' && dog.gender !== selectedGender) return false;
    if (onlyVaccinated && dog.health?.vaccinationStatus !== 'Fully Vaccinated') return false;
    if (onlyMicrochipped && !dog.health?.microchipId) return false;
    if (onlyDnaVerified && !dog.health?.dnaVerified) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.seller?.rating || 0) - (a.seller?.rating || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const activeFilterCount = [
    searchQuery !== '',
    filterBreed !== 'All',
    filterCategory !== 'All',
    selectedCity !== 'All',
    priceMax < 150000,
    selectedGender !== 'All',
    onlyVaccinated,
    onlyMicrochipped,
    onlyDnaVerified,
  ].filter(Boolean).length;

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF08A] dark:bg-[#FACC15]/10 px-3 py-0.5 rounded-full border border-[#FDE047] dark:border-[#FACC15]/20">
            <Sparkles className="w-3 h-3 text-[#EAB308]" /> Certified Canine Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] dark:text-white tracking-tight font-heading mt-1">
            Explore <span className="text-[#CA8A04] dark:text-[#FACC15]">Companion Dogs</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] font-normal">
            Showing <strong className="text-[#0A0A0A] dark:text-white font-bold">{filteredDogs.length}</strong> verified listings across India & Tamil Nadu with 100% health guarantee.
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FACC15] dark:text-[#0A0A0A]" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#0A0A0A] border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold text-[#0A0A0A] dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Breeder Rating</option>
            </select>
          </div>

          {/* Grid / List Mode */}
          <div className="flex items-center bg-white dark:bg-[#0A0A0A] p-1 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] shadow-xs font-bold' : 'text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] shadow-xs font-bold' : 'text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-white'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Search & Filter Bar */}
      <div className={`space-y-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-4 sm:p-5 shadow-card space-y-4">
          
          {/* Top Row: Search input + Primary Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search dog name, breed, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-[#0A0A0A] dark:text-white placeholder-[#A1A1AA] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#71717A] dark:text-[#FACC15] absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Breed Select */}
            <div>
              <select
                value={filterBreed}
                onChange={(e) => setFilterBreed(e.target.value)}
                className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] rounded-xl px-3 py-2 text-xs font-medium text-[#0A0A0A] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="All">Breed: All Breeds (150+)</option>
                {breeds.filter(b => b !== 'All').map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] rounded-xl px-3 py-2 text-xs font-medium text-[#0A0A0A] dark:text-white focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c} value={c}>Category: {c}</option>
                ))}
              </select>
            </div>

            {/* City Location Select */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] rounded-xl px-3 py-2 text-xs font-medium text-[#0A0A0A] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="All">City: All Cities & TN</option>
                {cities.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Bottom Row: Additional Fine-Tuning Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A]">
            
            {/* Gender Toggle */}
            <div className="flex items-center gap-1.5 bg-[#F4F4F5] dark:bg-[#1C1C1E] p-1 rounded-xl border border-[#E4E4E7] dark:border-[#27272A]">
              {['All', 'Male', 'Female'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedGender === g 
                      ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-white dark:text-[#0A0A0A] shadow-xs' 
                      : 'text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Price Slider & Checkbox Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#0A0A0A] dark:text-white font-medium">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA]">Max: ₹{priceMax.toLocaleString()}</span>
                <input
                  type="range"
                  min={10000}
                  max={150000}
                  step={5000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#FACC15] cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVaccinated}
                  onChange={(e) => setOnlyVaccinated(e.target.checked)}
                  className="rounded accent-[#FACC15] cursor-pointer"
                />
                <span className="text-[#0A0A0A] dark:text-white font-bold">Vaccinated</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyMicrochipped}
                  onChange={(e) => setOnlyMicrochipped(e.target.checked)}
                  className="rounded accent-[#FACC15] cursor-pointer"
                />
                <span className="text-[#71717A] dark:text-[#A1A1AA]">Microchipped</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDnaVerified}
                  onChange={(e) => setOnlyDnaVerified(e.target.checked)}
                  className="rounded accent-[#FACC15] cursor-pointer"
                />
                <span className="text-[#0A0A0A] dark:text-white font-bold">DNA Verified</span>
              </label>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#EF4444] hover:text-[#DC2626] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Dogs Results Layout */}
      {filteredDogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0A0A0A] border border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-10 space-y-4">
          <p className="text-lg font-black text-[#0A0A0A] dark:text-white font-heading">No Companions Matched Your Filters</p>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-normal max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all available litters.
          </p>
          <button
            onClick={handleResetFilters}
            className="btn-primary"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDogs.map((dog) => {
            const isFavorited = wishlist.includes(dog.id);
            const isCompared = compareList.includes(dog.id);

            return (
              <div
                key={dog.id}
                className="rounded-3xl overflow-hidden bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] shadow-sm hover:shadow-lg hover:border-[#EAB308] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  <img
                    src={dog.images?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'}
                    alt={dog.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Availability / Status Badge */}
                  {dog.status === 'PENDING' ? (
                    <div className="absolute top-3 left-3 bg-[#EAB308] text-[#0A0A0A] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3 stroke-[2.5]" />
                      <span>Pending Approval</span>
                    </div>
                  ) : dog.status === 'SOLD' || dog.availability === false ? (
                    <div className="absolute top-3 left-3 bg-neutral-700 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <span>Adopted / Sold</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-[#FEF9C3]/95 text-[#713F12] backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs border border-[#FDE047]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#EAB308]" />
                      <span>Score {dog.health?.healthScore || 98}/100</span>
                    </div>
                  )}

                  {/* Top Right Quick Actions: Wishlist & Compare */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCompare(dog.id)}
                      className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                        isCompared
                          ? 'bg-[#FACC15] text-[#0A0A0A] font-bold shadow-xs'
                          : 'bg-[#FEF9C3]/90 text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A] shadow-xs border border-[#FDE047]'
                      }`}
                      title="Compare"
                      aria-label="Compare"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleWishlist(dog.id)}
                      className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                        isFavorited
                          ? 'bg-[#EF4444] text-white shadow-xs'
                          : 'bg-[#FEF9C3]/90 text-[#713F12] hover:text-[#EF4444] hover:bg-[#FEF08A] shadow-xs border border-[#FDE047]'
                      }`}
                      title="Wishlist"
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Video Call Available */}
                  {dog.videoUrl && (
                    <button
                      onClick={() => startVideoCall(dog)}
                      className="absolute bottom-3 left-3 bg-[#0A0A0A] hover:bg-neutral-800 text-[#FACC15] font-bold px-2 py-0.5 rounded-lg text-[9px] flex items-center gap-1 shadow-xs border border-[#FACC15]/30 transition-colors cursor-pointer"
                    >
                      <Video className="w-3 h-3" />
                      <span>Live Video</span>
                    </button>
                  )}
                </div>

                {/* Card Information */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#713F12] mb-1">
                      <span className="font-bold text-[#713F12] uppercase tracking-wider bg-[#FEF08A] px-2 py-0.5 rounded-md border border-[#FACC15]">
                        {dog.breed}
                      </span>
                      <span className="flex items-center gap-0.5 truncate max-w-[120px] text-[#713F12]">
                        <MapPin className="w-3 h-3 text-[#CA8A04] shrink-0" />
                        <span className="truncate">{dog.location}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedDog(dog)}
                      className="font-bold text-[#0A0A0A] dark:text-[#0A0A0A] text-base hover:text-[#854D0E] cursor-pointer transition-colors line-clamp-1 font-heading pt-0.5"
                    >
                      {dog.name}
                    </h3>

                    <p className="text-xs text-[#713F12] dark:text-[#713F12] pt-0.5 font-medium">
                      {dog.age} • {dog.gender}
                    </p>
                  </div>

                  {/* Card Price & View Details Action */}
                  <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#713F12] dark:text-[#713F12] block -mb-0.5 font-bold">Adoption Fee</span>
                      <span className="text-base sm:text-lg font-black text-[#0A0A0A] dark:text-[#0A0A0A]">
                        ₹{dog.price?.toLocaleString() || dog.price}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDog(dog)}
                      className="btn-primary text-xs py-1.5 px-3.5"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode Layout */
        <div className="space-y-4">
          {filteredDogs.map((dog) => {
            const isFavorited = wishlist.includes(dog.id);
            const isCompared = compareList.includes(dog.id);

            return (
              <div
                key={dog.id}
                className="rounded-3xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] p-4 sm:p-5 shadow-sm hover:shadow-card hover:border-[#EAB308] transition-all flex flex-col sm:flex-row items-center justify-between gap-5 group"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shrink-0 border border-[#FDE047]">
                    <img
                      src={dog.images?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'}
                      alt={dog.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-bold text-[#713F12] uppercase tracking-wider bg-[#FEF08A] px-2 py-0.5 rounded-md border border-[#FACC15]">
                        {dog.breed}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <span className="text-xs text-[#713F12] font-semibold flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#CA8A04]" /> {dog.location}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedDog(dog)}
                      className="text-lg font-bold text-[#0A0A0A] dark:text-[#0A0A0A] hover:text-[#854D0E] cursor-pointer transition-colors font-heading"
                    >
                      {dog.name}
                    </h3>

                    <p className="text-xs text-[#713F12] dark:text-[#713F12] font-medium">
                      {dog.age} • {dog.gender} • {dog.color} • <strong className="text-[#0A0A0A] font-bold">Score: {dog.health?.healthScore || 98}/100</strong>
                    </p>

                    <p className="text-xs text-[#713F12] dark:text-[#713F12] line-clamp-1 max-w-md pt-1 font-medium">
                      {dog.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#FDE047] dark:border-[#FDE047]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#713F12] block font-bold">Adoption Fee</span>
                    <span className="text-xl font-black text-[#0A0A0A] dark:text-[#0A0A0A]">
                      ₹{dog.price?.toLocaleString() || dog.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(dog.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFavorited
                          ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-xs'
                          : 'bg-[#FEF08A] text-[#713F12] border-[#FDE047] hover:text-[#EF4444]'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleCompare(dog.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isCompared
                          ? 'bg-[#FACC15] text-[#0A0A0A] font-bold border-[#FACC15] shadow-xs'
                          : 'bg-[#FEF08A] text-[#713F12] border-[#FDE047] hover:text-[#0A0A0A]'
                      }`}
                      title={isCompared ? 'Remove from compare' : 'Add to compare'}
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedDog(dog)}
                      className="btn-primary text-xs py-2 px-4 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
