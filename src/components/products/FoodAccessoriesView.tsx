import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Search, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Star, 
  X, 
  Truck, 
  ChevronRight,
  Filter,
  Package,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { DogProduct } from '../../data/productsData';

export const FoodAccessoriesView: React.FC = () => {
  const { products, addProductToCart, startProductCheckout, setActiveTab, currentUser } = useApp();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'FOOD' | 'ACCESSORY'>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<DogProduct | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  // Subcategories list based on active tab
  const foodSubCategories = ['All', 'Puppy Nutrition', 'Adult Dog Food', 'Starter Nutrition', 'Grain Free Diet', 'Veterinary Diet'];
  const accessorySubCategories = ['All', 'Harnesses & Leashes', 'Beds & Furniture', 'Bowls & Feeders', 'Collars & Tags', 'Toys & Training', 'Grooming & Health'];

  // Filter products
  const filteredProducts = products.filter(p => {
    // Type tab
    if (activeCategoryTab !== 'ALL' && p.type !== activeCategoryTab) return false;

    // Subcategory
    if (selectedSubCategory !== 'All' && p.category !== selectedSubCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchIngredients = p.ingredients?.toLowerCase().includes(q);
      const matchMaterial = p.material?.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory && !matchIngredients && !matchMaterial) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
    return 0; // featured default
  });

  const handleAddToCart = (e: React.MouseEvent, prod: DogProduct) => {
    e.stopPropagation();
    addProductToCart(prod);
    setAddedAnimationId(prod.id);
    setTimeout(() => setAddedAnimationId(null), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent, prod: DogProduct) => {
    e.stopPropagation();
    startProductCheckout(prod);
  };

  const foodCount = products.filter(p => p.type === 'FOOD').length;
  const accessoryCount = products.filter(p => p.type === 'ACCESSORY').length;

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Hero Store Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A0A0A] via-[#1C1917] to-[#0A0A0A] border border-[#27272A] p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15] text-[#0A0A0A] font-extrabold text-xs tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#0A0A0A]" />
            <span>Admin-Verified Quality Store</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Dog Foods &amp; Accessories <br />
            <span className="text-[#FACC15]">Curated for Purebred Health.</span>
          </h1>

          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            From vet-formulated Royal Canin &amp; Drools puppy nutrition to PawVerse escape-proof reflective harnesses and orthopedic memory foam beds. Strictly added and quality-verified by platform administrators.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#FACC15]" />
              <span>100% Genuine Nutrition</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#FACC15]" />
              <span>Express Safe Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FACC15]" />
              <span>Admin Certified Brands</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className="ml-auto px-3 py-1 rounded-xl bg-[#FEF08A] text-[#0A0A0A] font-bold text-xs hover:bg-[#FACC15] transition-colors"
              >
                ⚙️ Admin Studio (Manage Catalog)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Filter Navigation Bar */}
      <div className="space-y-4">
        {/* Type Toggle Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#FDE047] pb-4">
          <div className="flex items-center gap-2 p-1.5 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm">
            <button
              onClick={() => {
                setActiveCategoryTab('ALL');
                setSelectedSubCategory('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'ALL'
                  ? 'bg-[#0A0A0A] text-[#FACC15] shadow-sm'
                  : 'text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A]'
              }`}
            >
              All Supplies ({products.length})
            </button>

            <button
              onClick={() => {
                setActiveCategoryTab('FOOD');
                setSelectedSubCategory('All');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'FOOD'
                  ? 'bg-[#0A0A0A] text-[#FACC15] shadow-sm'
                  : 'text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A]'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Dog Foods ({foodCount})</span>
            </button>

            <button
              onClick={() => {
                setActiveCategoryTab('ACCESSORY');
                setSelectedSubCategory('All');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'ACCESSORY'
                  ? 'bg-[#0A0A0A] text-[#FACC15] shadow-sm'
                  : 'text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Dog Accessories ({accessoryCount})</span>
            </button>
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#713F12] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search food, brand, accessories, beds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 sm:w-72 bg-white border border-[#FDE047] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[#713F12] hover:text-[#0A0A0A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#FDE047] rounded-xl py-2 px-3 text-xs text-[#0A0A0A] font-semibold focus:outline-none focus:border-[#EAB308]"
            >
              <option value="featured">Sort: Featured Supplies</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated Nutrition &amp; Gear</option>
            </select>
          </div>
        </div>

        {/* Subcategories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#713F12] font-bold shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>

          {(activeCategoryTab === 'FOOD' ? foodSubCategories : activeCategoryTab === 'ACCESSORY' ? accessorySubCategories : ['All', ...foodSubCategories.slice(1), ...accessorySubCategories.slice(1)]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSubCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubCategory === cat
                  ? 'bg-[#0A0A0A] text-[#FACC15] font-bold shadow-xs'
                  : 'bg-[#FEF9C3] dark:bg-[#FEF9C3] text-[#713F12] border border-[#FDE047] hover:bg-[#FEF08A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-3xl shadow-sm">
          <Package className="w-14 h-14 text-[#CA8A04] mx-auto opacity-70" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0A0A0A]">No products found matching your search</h3>
            <p className="text-xs text-[#713F12]">Try clearing filters or search for another brand or formula.</p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubCategory('All');
              setActiveCategoryTab('ALL');
            }}
            className="btn-primary text-xs py-2 px-5"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((prod) => {
            const isFood = prod.type === 'FOOD';
            const discountPercent = prod.originalPrice && prod.originalPrice > prod.price
              ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
              : null;

            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="group bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#EAB308] transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-square w-full overflow-hidden bg-white">
                  <img
                    src={prod.images?.[0] || (prod as any).imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isFood
                        ? 'bg-[#0A0A0A] text-[#FACC15]'
                        : 'bg-[#FEF08A] text-[#713F12] border border-[#FDE047]'
                    }`}>
                      {isFood ? 'Dog Food' : 'Gear & Acc'}
                    </span>
                    {discountPercent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D64545] text-white">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Admin Managed Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#10B981]/90 text-white flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Admin Verified</span>
                    </span>
                  </div>

                  {/* Stock Pill on image */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.stock > 0
                        ? 'bg-white/95 text-[#065F46] border border-[#10B981]/40'
                        : 'bg-[#D64545]/90 text-white'
                    }`}>
                      {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold uppercase text-[#CA8A04] tracking-wide">
                        {prod.brand}
                      </span>
                      <div className="flex items-center gap-1 text-[#CA8A04] font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{prod.rating || 4.8}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-[#0A0A0A] text-sm line-clamp-2 group-hover:text-[#CA8A04] transition-colors">
                      {prod.name}
                    </h3>

                    {/* Specs snippet */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                      {prod.weight && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#713F12] font-semibold border border-[#FDE047]">
                          {prod.weight}
                        </span>
                      )}
                      {prod.lifeStage && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#713F12] font-semibold border border-[#FDE047]">
                          {prod.lifeStage}
                        </span>
                      )}
                      {prod.material && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#713F12] font-semibold border border-[#FDE047]">
                          {prod.material}
                        </span>
                      )}
                      {prod.size && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#713F12] font-semibold border border-[#FDE047]">
                          {prod.size}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-2 border-t border-[#FDE047] space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-black text-[#0A0A0A] font-heading">
                          ₹{prod.price?.toLocaleString()}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="ml-2 text-xs text-[#713F12] line-through">
                            ₹{prod.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#713F12] font-semibold">Free Delivery</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        disabled={prod.stock === 0}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          addedAnimationId === prod.id
                            ? 'bg-[#10B981] text-white border-[#10B981]'
                            : 'bg-white hover:bg-[#FEF08A] text-[#0A0A0A] border-[#FDE047]'
                        }`}
                      >
                        {addedAnimationId === prod.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleBuyNow(e, prod)}
                        disabled={prod.stock === 0}
                        className="w-full btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Privilege Notification Banner */}
      <div className="p-6 rounded-3xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#FACC15] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#0A0A0A] text-sm font-heading">
              Platform Food &amp; Gear Policy
            </h4>
            <p className="text-xs text-[#713F12]">
              To protect puppy health and ensure genuine quality, dog food and gear can <strong>only be added, modified, fixed, or removed by verified platform administrators</strong>. Buyers and sellers cannot upload arbitrary consumables.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="btn-primary text-xs shrink-0 py-2.5 px-5"
        >
          <span>Admin Access Panel</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* QUICK VIEW PRODUCT DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 my-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#FDE047] pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selectedProduct.type === 'FOOD' ? 'bg-[#0A0A0A] text-[#FACC15]' : 'bg-[#FEF08A] text-[#713F12]'
                }`}>
                  {selectedProduct.type === 'FOOD' ? 'Dog Nutrition' : 'Dog Accessory'}
                </span>
                <span className="text-xs text-[#CA8A04] font-bold">{selectedProduct.brand}</span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg border border-[#FDE047] text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#FDE047]">
                  <img
                    src={selectedProduct.images?.[0] || (selectedProduct as any).imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-[#FEF08A]/60 rounded-xl border border-[#FDE047] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#713F12]">Admin Authorization:</span>
                    <strong className="text-[#065F46] font-bold">Verified Direct Supply</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#713F12]">Stock Status:</span>
                    <strong className="text-[#0A0A0A]">{selectedProduct.stock} units available</strong>
                  </div>
                </div>
              </div>

              {/* Details & Specifications */}
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-lg font-black text-[#0A0A0A] font-heading leading-snug">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-2xl font-black text-[#0A0A0A] font-heading">
                      ₹{selectedProduct.price?.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-xs text-[#713F12] line-through">
                        ₹{selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[#713F12] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Specs */}
                <div className="space-y-1.5 pt-2 border-t border-[#FDE047]">
                  {selectedProduct.weight && (
                    <div className="flex justify-between">
                      <span className="text-[#713F12]">Bag Weight:</span>
                      <strong className="text-[#0A0A0A]">{selectedProduct.weight}</strong>
                    </div>
                  )}
                  {selectedProduct.lifeStage && (
                    <div className="flex justify-between">
                      <span className="text-[#713F12]">Target Stage:</span>
                      <strong className="text-[#0A0A0A]">{selectedProduct.lifeStage}</strong>
                    </div>
                  )}
                  {selectedProduct.material && (
                    <div className="flex justify-between">
                      <span className="text-[#713F12]">Material / Build:</span>
                      <strong className="text-[#0A0A0A]">{selectedProduct.material}</strong>
                    </div>
                  )}
                  {selectedProduct.size && (
                    <div className="flex justify-between">
                      <span className="text-[#713F12]">Size / Dimension:</span>
                      <strong className="text-[#0A0A0A]">{selectedProduct.size}</strong>
                    </div>
                  )}
                  {selectedProduct.ingredients && (
                    <div className="pt-1">
                      <span className="text-[#713F12] font-bold block mb-0.5">Ingredients / Construction:</span>
                      <p className="text-[#0A0A0A] bg-white p-2 rounded-xl border border-[#FDE047]">
                        {selectedProduct.ingredients}
                      </p>
                    </div>
                  )}
                </div>

                {/* Features List */}
                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[#713F12] font-bold">Key Benefits:</span>
                    <ul className="space-y-1 text-[#0A0A0A]">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#065F46] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#FDE047]">
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-1/2 py-2.5 rounded-xl border border-[#FDE047] bg-white hover:bg-[#FEF08A] text-[#0A0A0A] font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={(e) => {
                      handleBuyNow(e, selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-1/2 btn-primary text-xs py-2.5 flex items-center justify-center gap-1"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
