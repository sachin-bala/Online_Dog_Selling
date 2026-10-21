import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Award, 
  Truck, 
  QrCode, 
  Download, 
  Heart, 
  Navigation,
  User,
  Compass,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerDashboard: React.FC = () => {
  const { 
    orders, 
    passports, 
    wishlist, 
    dogs, 
    setSelectedDog, 
    addNotification, 
    currentUser, 
    logout,
    setActiveTab 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'passport' | 'gps' | 'wishlist' | 'profile'>('orders');
  const latestOrder = orders.length > 0 ? orders[0] : null;

  const handleDownloadQr = (dogName: string) => {
    addNotification(`Downloaded NFC/QR KCI Digital Pet Passport for ${dogName} 📲`);
  };

  const favoritedDogs = dogs.filter(d => wishlist.includes(d.id));

  const navItems = [
    { id: 'orders', label: 'My Orders & History', icon: ShoppingBag, count: orders.length },
    { id: 'passport', label: 'KCI Pet Passports', icon: QrCode, count: passports.length },
    { id: 'gps', label: 'Live GPS Delivery Tracker', icon: Navigation },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: favoritedDogs.length },
    { id: 'profile', label: 'Account Information', icon: User },
  ];

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FACC15] text-[#0A0A0A] border border-[#EAB308] flex items-center justify-center font-black text-xl shadow-sm shrink-0">
            {currentUser?.fullName?.[0] || 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] font-heading">
                Welcome back, {currentUser?.fullName || 'Pet Lover'}!
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#065F46] border border-[#10B981]/40">
                VIP Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#713F12]">
              Manage your companion orders, digital KCI health passports, and live delivery escorts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className="btn-primary text-xs flex-1 sm:flex-initial"
          >
            <Compass className="w-4 h-4" />
            <span>Browse More Puppies</span>
          </button>

          {currentUser && (
            <button
              onClick={logout}
              className="p-2.5 rounded-xl border border-[#FDE047] text-[#D64545] hover:bg-[#FEF08A] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Responsive Sidebar on Desktop & Horizontal Tabs on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar / Mobile Tabs */}
        <div className="lg:col-span-3 space-y-2 overflow-x-auto pb-1 lg:pb-0 flex lg:flex-col gap-2 p-3 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0A0A0A] text-[#FACC15] shadow-sm font-bold'
                    : 'text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                    isActive ? 'bg-[#FACC15] text-[#0A0A0A]' : 'bg-[#FEF08A] text-[#713F12]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: ORDERS & ORDER HISTORY */}
          {activeSubTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0A0A0A] font-heading">
                  Order History & Escrow Status
                </h3>
                <span className="text-xs text-[#713F12]">
                  Total Orders: {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center space-y-4 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-[#CA8A04] mx-auto" />
                  <h4 className="text-base font-bold text-[#0A0A0A]">No Orders Placed Yet</h4>
                  <p className="text-xs text-[#713F12] max-w-sm mx-auto">
                    You haven't adopted any dogs yet. Explore our verified listings to find your ideal companion!
                  </p>
                  <button onClick={() => setActiveTab('explore')} className="btn-primary text-xs">
                    Explore Available Dogs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 sm:p-6 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FDE047] pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-mono text-[#713F12]">Order ID: #{ord.id}</span>
                          <p className="text-xs text-[#713F12]">Date: {ord.purchaseDate}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            ord.status === 'Delivered'
                              ? 'bg-[#10B981]/20 text-[#065F46] border-[#10B981]/40'
                              : 'bg-[#FEF08A] text-[#713F12] border-[#FDE047]'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <img
                            src={ord.dog?.images?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'}
                            alt={ord.dog?.name}
                            className="w-16 h-16 rounded-xl object-cover border border-[#FDE047] shrink-0"
                          />
                          <div className="space-y-1">
                            <h4 className="font-bold text-[#0A0A0A] text-base">
                              {ord.dog?.name}
                            </h4>
                            <p className="text-xs text-[#713F12]">
                              Breed: <strong className="text-[#0A0A0A]">{ord.dog?.breed}</strong> • Delivery: {ord.estimatedDelivery}
                            </p>
                            <p className="text-xs font-mono text-[#713F12]">
                              Tracking Code: {ord.trackingNumber}
                            </p>
                          </div>
                        </div>

                        <div className="text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <span className="text-[11px] text-[#713F12]">Amount Paid</span>
                          <span className="text-lg font-black text-[#0A0A0A] font-heading">
                            ₹{ord.amount?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {ord.buyerInfo && (
                        <div className="pt-3 border-t border-[#FDE047] text-xs text-[#713F12] flex flex-wrap items-center justify-between gap-2">
                          <span>Recipient: <strong className="text-[#0A0A0A]">{ord.buyerInfo.name}</strong> ({ord.buyerInfo.phone})</span>
                          <span>Address: {ord.buyerInfo.address}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KCI PET PASSPORT */}
          {activeSubTab === 'passport' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0A0A0A] font-heading">
                  KCI Verified Digital Pet Passports
                </h3>
              </div>

              {passports.map((pass) => (
                <div key={pass.id} className="p-6 sm:p-8 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FDE047] pb-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-[#CA8A04] shrink-0" />
                      <div>
                        <h4 className="text-lg font-bold text-[#0A0A0A] flex items-center gap-2">
                          <span>{pass.dogName}'s Digital Passport</span>
                          <span className="text-[10px] bg-[#10B981]/20 text-[#065F46] font-mono px-2 py-0.5 rounded-full border border-[#10B981]/40">
                            DNA Verified
                          </span>
                        </h4>
                        <p className="text-xs text-[#713F12]">Microchip #{pass.microchipId}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadQr(pass.dogName)}
                      className="btn-secondary text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Digital ID</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047]">
                      <span className="text-[10px] text-[#713F12] block font-semibold">Breed</span>
                      <strong className="text-[#0A0A0A]">{pass.breed}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047]">
                      <span className="text-[10px] text-[#713F12] block font-semibold">Gender</span>
                      <strong className="text-[#0A0A0A]">{pass.gender}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047]">
                      <span className="text-[10px] text-[#713F12] block font-semibold">Birth Date</span>
                      <strong className="text-[#0A0A0A]">{pass.birthDate}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047]">
                      <span className="text-[10px] text-[#713F12] block font-semibold">Owner</span>
                      <strong className="text-[#0A0A0A]">{pass.ownerName}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#0A0A0A] block">Vaccination Records:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pass.vaccines?.map((v, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#FEF08A]/60 border border-[#FDE047] flex items-center justify-between text-xs">
                          <span className="text-[#0A0A0A]">{v.name} ({v.date})</span>
                          <span className="text-[#065F46] font-bold">✓ {v.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LIVE GPS DELIVERY TRACKER */}
          {activeSubTab === 'gps' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-heading">
                Live AC Pet Transit Tracking
              </h3>

              {latestOrder ? (
                <div className="p-6 sm:p-8 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FDE047] pb-4">
                    <div>
                      <h4 className="font-bold text-[#0A0A0A] text-base">
                        Escorted Transit for {latestOrder.dog?.name}
                      </h4>
                      <p className="text-xs text-[#713F12]">Live GPS Coordinates: 13.0827° N, 80.2707° E (Chennai Hub)</p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#FEF08A] text-[#713F12] text-xs font-bold border border-[#FDE047]">
                      In Transit • AC Cabin Active (22°C)
                    </span>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40">
                      <span className="font-bold text-[#065F46] block">1. Origin Breeder</span>
                      <p className="text-[11px] text-[#713F12]">Health Check Passed ✓</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40">
                      <span className="font-bold text-[#065F46] block">2. KCI DNA Audit</span>
                      <p className="text-[11px] text-[#713F12]">Microchip Scanned ✓</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047]">
                      <span className="font-bold text-[#0A0A0A] block">3. In AC Vehicle</span>
                      <p className="text-[11px] text-[#713F12]">Vet Escort on Board</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#FDE047]">
                      <span className="font-bold text-[#0A0A0A] block">4. Doorstep Arrival</span>
                      <p className="text-[11px] text-[#713F12]">Estimated Today 4 PM</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm">
                  <Truck className="w-12 h-12 text-[#CA8A04] mx-auto mb-2" />
                  <p className="text-xs text-[#713F12]">No active deliveries in transit currently.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeSubTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0A0A0A] font-heading">
                  Saved Companions ({favoritedDogs.length})
                </h3>
              </div>

              {favoritedDogs.length === 0 ? (
                <div className="p-12 text-center space-y-4 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm">
                  <Heart className="w-12 h-12 text-[#CA8A04] mx-auto" />
                  <p className="text-xs text-[#713F12]">You haven't favorited any puppies yet.</p>
                  <button onClick={() => setActiveTab('explore')} className="btn-primary text-xs">
                    Browse Dogs
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoritedDogs.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDog(d)}
                      className="p-4 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl cursor-pointer hover:border-[#EAB308] hover:shadow-md transition-all flex items-center gap-3"
                    >
                      <img src={d.images?.[0]} alt={d.name} className="w-14 h-14 rounded-xl object-cover border border-[#FDE047]" />
                      <div>
                        <h4 className="font-bold text-sm text-[#0A0A0A]">{d.name}</h4>
                        <p className="text-xs text-[#0A0A0A] font-bold">₹{d.price?.toLocaleString()} || Free Delivery</p>
                        <p className="text-[10px] text-[#713F12]">{d.breed} • {d.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & ACCOUNT INFORMATION */}
          {activeSubTab === 'profile' && (
            <div className="p-6 sm:p-8 bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-heading">
                Account Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047] space-y-1">
                  <span className="text-[10px] text-[#713F12] font-semibold uppercase">Full Name</span>
                  <p className="font-bold text-[#0A0A0A]">{currentUser?.fullName || 'Guest User'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047] space-y-1">
                  <span className="text-[10px] text-[#713F12] font-semibold uppercase">Email Address</span>
                  <p className="font-bold text-[#0A0A0A]">{currentUser?.email || 'guest@pawverse.ai'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047] space-y-1">
                  <span className="text-[10px] text-[#713F12] font-semibold uppercase">Phone Number</span>
                  <p className="font-bold text-[#0A0A0A]">{currentUser?.mobile || '+91 98400 12345'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FEF08A]/60 border border-[#FDE047] space-y-1">
                  <span className="text-[10px] text-[#713F12] font-semibold uppercase">Account Role</span>
                  <p className="font-bold text-[#0A0A0A]">{currentUser?.role || 'Buyer / Customer'}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
