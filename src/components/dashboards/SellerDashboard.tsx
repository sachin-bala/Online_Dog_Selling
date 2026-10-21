import React, { useState } from 'react';
import { 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp,
  AlertCircle,
  Clock,
  XCircle,
  Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Dog } from '../../data/dogsData';

export const SellerDashboard: React.FC = () => {
  const { dogs, addDogListing, currentUser, setIsRegisterSellerOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'add-dog' | 'listings' | 'schedule'>('overview');

  // Form State for Adding New Dog Listing
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('Golden Retriever');
  const [category, setCategory] = useState<'Puppies' | 'Guard Dogs' | 'Family Dogs' | 'Small Dogs' | 'Large Dogs' | 'Rare Breeds' | 'Show Dogs'>('Puppies');
  const [age] = useState('10 Weeks');
  const [gender] = useState<'Male' | 'Female'>('Male');
  const [price, setPrice] = useState(25000);
  const [location, setLocation] = useState('Chennai, TN');
  const [color] = useState('Cream Gold');
  const [weightKg] = useState(5.5);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80');
  const [microchipId] = useState(`98514100${Math.floor(100000 + Math.random() * 900000)}`);
  const [description, setDescription] = useState('Home raised, healthy, playful puppy with full championship lineage and early socialization.');

  const isSellerApproved = currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.sellerStatus === 'approved';

  const handleAddDog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed) return;

    const newDog: Dog = {
      id: `dog-${Date.now()}`,
      name,
      breed,
      category,
      age,
      ageMonths: 2.5,
      gender,
      price,
      location,
      color,
      weightKg,
      images: [imageUrl, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80'],
      frames360: [imageUrl],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-golden-retriever-dog-running-41584-large.mp4',
      health: {
        vaccinationStatus: 'Fully Vaccinated',
        healthScore: 99,
        microchipId,
        dnaVerified: true,
        vetInspectionDate: new Date().toISOString().split('T')[0],
        deWormed: true,
        medicalHistory: ['DHPP Core Shot', 'Vet Inspection Clear']
      },
      seller: {
        id: currentUser?.id || 'seller-verified',
        name: currentUser?.fullName || 'Verified Breeder',
        businessName: currentUser?.business?.kennelName || 'Apex Canine Kennel',
        avatar: currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        reviewsCount: 18,
        verifiedBreeder: true,
        city: currentUser?.address?.city || 'Chennai',
        state: currentUser?.address?.state || 'Tamil Nadu',
        phone: currentUser?.mobile || '+91 98400 12345',
        responseRate: '100% (< 10 mins)',
        joinedYear: 2024
      },
      traits: { affection: 5, energy: 4, grooming: 3, barking: 2, trainability: 5 },
      suitableFor: { apartment: true, kids: true, firstTimeOwner: true, climate: 'Any' },
      foodRecommendation: 'High protein puppy diet.',
      exerciseRecommendation: '30 mins play daily.',
      description,
      certified: true,
      availableNow: true,
      featured: true
    };

    addDogListing(newDog);
    setActiveTab('listings');
    setName('');
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FDE047] pb-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FACC15] border border-[#EAB308] flex items-center justify-center shadow-sm">
            <Store className="w-6 h-6 text-[#0A0A0A]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A]">Breeder Studio</h1>
            <p className="text-xs sm:text-sm text-[#713F12]">Manage companion inventory, live video schedules, and sales revenue</p>
          </div>
        </div>

        {isSellerApproved ? (
          <button
            onClick={() => setActiveTab('add-dog')}
            className="btn-primary text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Dog Listing</span>
          </button>
        ) : (
          <button
            onClick={() => setIsRegisterSellerOpen(true)}
            className="btn-primary text-xs"
          >
            Register / Resubmit Application
          </button>
        )}
      </div>

      {/* Verification Status Warning Banners */}
      {!currentUser && (
        <div className="p-5 rounded-2xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
          <div className="flex items-start sm:items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-[#CA8A04] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="font-bold text-[#0A0A0A] text-sm">Registered Breeder Verification Required</h4>
              <p className="text-[#713F12]">To upload companion listings, please complete the seller registration & Government ID verification.</p>
            </div>
          </div>
          <button
            onClick={() => setIsRegisterSellerOpen(true)}
            className="btn-primary text-xs whitespace-nowrap"
          >
            Register Breeder Account
          </button>
        </div>
      )}

      {currentUser?.sellerStatus === 'pending_admin' && (
        <div className="p-5 rounded-2xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] flex items-start sm:items-center space-x-3 text-xs shadow-sm">
          <Clock className="w-6 h-6 text-[#CA8A04] shrink-0 animate-pulse" />
          <div>
            <h4 className="font-bold text-[#0A0A0A] text-sm">Application Under Admin Review</h4>
            <p className="text-[#713F12]">
              Your breeder application and Government ID <span className="font-mono font-bold text-[#0A0A0A]">({currentUser.govtIdNumber})</span> have been received. Listing upload features will unlock automatically upon Admin approval.
            </p>
          </div>
        </div>
      )}

      {currentUser?.sellerStatus === 'rejected' && (
        <div className="p-5 rounded-2xl bg-[#D64545]/10 border border-[#D64545]/30 space-y-3 text-xs shadow-sm">
          <div className="flex items-center space-x-3 text-[#D64545]">
            <XCircle className="w-6 h-6 shrink-0" />
            <h4 className="font-bold text-sm">Application Rejected by Admin</h4>
          </div>
          <p className="text-[#713F12]">Rejection Reason: <strong className="text-[#D64545]">{currentUser.rejectionReason || 'Invalid Government ID'}</strong></p>
          <button
            onClick={() => setIsRegisterSellerOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#D64545] hover:bg-[#c0392b] text-white font-bold text-xs transition-colors"
          >
            Update Profile & Resubmit Verification
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-5 rounded-2xl border border-[#FDE047] space-y-1 shadow-sm">
          <div className="text-xs text-[#713F12] font-semibold uppercase tracking-wider">Total Sales</div>
          <div className="text-2xl font-black text-[#0A0A0A]">₹34,80,000</div>
          <div className="text-[10px] text-[#065F46] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </div>
        </div>
        <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-5 rounded-2xl border border-[#FDE047] space-y-1 shadow-sm">
          <div className="text-xs text-[#713F12] font-semibold uppercase tracking-wider">Active Listings</div>
          <div className="text-2xl font-black text-[#0A0A0A]">{dogs.length} Puppies</div>
          <div className="text-[10px] text-[#CA8A04] font-semibold">100% KCI Verified</div>
        </div>
        <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-5 rounded-2xl border border-[#FDE047] space-y-1 shadow-sm">
          <div className="text-xs text-[#713F12] font-semibold uppercase tracking-wider">Live Video Calls</div>
          <div className="text-2xl font-black text-[#0A0A0A]">14 Scheduled</div>
          <div className="text-[10px] text-[#CA8A04] font-semibold">5.0 ★ Rating</div>
        </div>
        <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-5 rounded-2xl border border-[#FDE047] space-y-1 shadow-sm">
          <div className="text-xs text-[#713F12] font-semibold uppercase tracking-wider">Breeder Status</div>
          <div className="text-xl font-bold text-[#065F46] flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-5 h-5 shrink-0" /> {isSellerApproved ? 'Verified' : 'Pending'}
          </div>
          <div className="text-[10px] text-[#713F12]">License: KCI-99120-TN</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-[#FDE047] pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Analytics' },
          { id: 'add-dog', label: 'Upload Listing' },
          { id: 'listings', label: 'Manage Dogs' },
          { id: 'schedule', label: 'Live Video Schedule' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.id 
                ? 'bg-[#0A0A0A] text-[#FACC15] shadow-sm' 
                : 'text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Upload Dog Listing */}
      {activeTab === 'add-dog' && (
        isSellerApproved ? (
          <form onSubmit={handleAddDog} className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-6 sm:p-8 rounded-3xl border border-[#FDE047] space-y-6 max-w-3xl shadow-sm">
            <h3 className="text-lg font-bold text-[#0A0A0A] border-b border-[#FDE047] pb-3">Create New Companion Listing</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Puppy Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aurelius Champion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Breed *</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
                >
                  <option value="Golden Retriever">Golden Retriever</option>
                  <option value="French Bulldog">French Bulldog</option>
                  <option value="German Shepherd">German Shepherd</option>
                  <option value="Pomeranian">Pomeranian</option>
                  <option value="Rajapalayam">Rajapalayam</option>
                  <option value="Kombai">Kombai</option>
                  <option value="Chippiparai">Chippiparai</option>
                  <option value="Toy Poodle">Toy Poodle</option>
                  <option value="Siberian Husky">Siberian Husky</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
                >
                  <option value="Puppies">Puppies</option>
                  <option value="Guard Dogs">Guard Dogs</option>
                  <option value="Family Dogs">Family Dogs</option>
                  <option value="Small Dogs">Small Dogs</option>
                  <option value="Rare Breeds">Rare Breeds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] font-bold focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A0A0A] mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#FDE047] rounded-xl p-2.5 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5"
            >
              Publish Verified Listing (Awaiting Admin Review)
            </button>
          </form>
        ) : (
          <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-12 rounded-3xl border border-[#FDE047] text-center space-y-4 shadow-sm">
            <Clock className="w-12 h-12 text-[#CA8A04] mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-[#0A0A0A]">Seller Approval Required</h3>
            <p className="text-xs text-[#713F12] max-w-md mx-auto">
              Listing uploads are restricted to Admin-approved sellers. Please wait for Admin verification or login as Super Admin.
            </p>
          </div>
        )
      )}

      {/* Tab Content: Manage Dogs - Desktop Table + Mobile Cards */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#FEF9C3] dark:bg-[#FEF9C3] rounded-2xl border border-[#FDE047] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FEF08A]/70 text-[#713F12] border-b border-[#FDE047]">
                <tr>
                  <th className="p-4 font-bold">Dog</th>
                  <th className="p-4 font-bold">Breed</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Health & Microchip</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDE047] text-[#0A0A0A]">
                {dogs.map(dog => (
                  <tr key={dog.id} className="hover:bg-[#FEF08A]/40 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={dog.images[0]} alt={dog.name} className="w-10 h-10 rounded-xl object-cover border border-[#FDE047]" />
                      <span className="font-bold text-[#0A0A0A]">{dog.name}</span>
                    </td>
                    <td className="p-4 font-medium text-[#713F12]">{dog.breed}</td>
                    <td className="p-4 font-black text-[#0A0A0A]">₹{dog.price.toLocaleString()}</td>
                    <td className="p-4 font-mono text-[#713F12]">#{dog.health.microchipId}</td>
                    <td className="p-4">
                      <span className="bg-[#10B981]/20 text-[#065F46] px-2.5 py-1 rounded-full border border-[#10B981]/40 text-[10px] font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden space-y-3">
            {dogs.map(dog => (
              <div key={dog.id} className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-4 rounded-2xl border border-[#FDE047] shadow-sm flex items-center gap-3.5">
                <img src={dog.images[0]} alt={dog.name} className="w-14 h-14 rounded-xl object-cover border border-[#FDE047] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#0A0A0A] text-sm truncate">{dog.name}</h4>
                    <span className="text-[10px] bg-[#10B981]/20 text-[#065F46] px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#713F12]">{dog.breed}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-[#0A0A0A]">₹{dog.price.toLocaleString()}</span>
                    <span className="text-[10px] font-mono text-[#713F12]">#{dog.health.microchipId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Analytics Overview */}
      {activeTab === 'overview' && (
        <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-8 rounded-3xl border border-[#FDE047] space-y-4 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center mx-auto text-[#065F46]">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#0A0A0A]">Breeder Sales Analytics</h3>
          <p className="text-xs sm:text-sm text-[#713F12] max-w-md mx-auto leading-relaxed">
            Your kennel conversion rate is 94.2%. 100% of buyers rated live video call interaction 5 out of 5 stars.
          </p>
        </div>
      )}

      {/* Tab Content: Live Video Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] p-8 rounded-3xl border border-[#FDE047] space-y-4 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center mx-auto text-[#0A0A0A]">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#0A0A0A]">Live Inspection Calendar</h3>
          <p className="text-xs sm:text-sm text-[#713F12] max-w-md mx-auto leading-relaxed">
            Buyers can request 1-on-1 live video calls with you. All video calls are escorted through high-definition encrypted WebRTC channels.
          </p>
        </div>
      )}
    </div>
  );
};
