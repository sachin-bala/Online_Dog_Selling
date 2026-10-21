import React, { useState } from 'react';
import { 
  Dog, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsAiFinderOpen, addNotification, setIsAdminLoginOpen } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    addNotification('Newsletter Subscribed! Promo Code "PAWTN2026" unlocked 🎁');
  };

  return (
    <footer className="w-full bg-[#0A0A0A] text-white/80 text-xs border-t border-[#27272A] transition-colors">
      
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 border-b border-[#27272A]">
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0A0A0A] border border-[#27272A] flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl text-center lg:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15] stroke-[2.5]" /> Verified Breeders Club
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
              Unlock Native Breed Alerts & ₹2,000 First-Time Discount
            </h3>
            <p className="text-[#A1A1AA] text-xs leading-relaxed font-normal">
              Join 45,000+ dog lovers receiving weekly champion pedigree arrivals, KCI registration guidelines, and native hound updates.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 max-w-md w-full">
                <div className="relative w-full">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 rounded-xl py-3 pl-4 pr-10 text-xs text-white placeholder:text-[#71717A] focus:outline-none transition-all font-normal"
                  />
                  <Mail className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FACC15]/15 border border-[#FACC15]/30 text-white flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FACC15] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-xs">Subscription Confirmed!</h4>
                  <p className="text-[11px] text-[#A1A1AA]">
                    Use code <span className="font-mono font-bold text-[#FACC15]">PAWTN2026</span> for ₹2,000 off your first companion.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
        
        {/* Brand Column */}
        <div className="sm:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-[#FACC15] flex items-center justify-center text-[#0A0A0A] font-black shadow-md border border-[#EAB308]">
              <Dog className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-black text-xl text-white font-heading">
              PawVerse <span className="text-[#FACC15]">India</span>
            </span>
          </div>

          <p className="text-[#A1A1AA] text-xs leading-relaxed max-w-sm font-normal">
            PawVerse India is the premier verified canine marketplace. Combining artificial intelligence compatibility matching, KCI & native breed certifications, live video call inspection, and temperature-controlled AC delivery across South India and nationally.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2 text-white/80">
              <Phone className="w-4 h-4 text-[#FACC15] shrink-0" />
              <span>Helpline: <strong className="text-white">+91 87796 92292</strong> (9 AM - 8 PM IST)</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Mail className="w-4 h-4 text-[#FACC15] shrink-0" />
              <span>Email: <strong className="text-white">support@pawverse.in</strong></span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4 text-[#FACC15] shrink-0" />
              <span>Headquarters: Chennai & Rajapalayam, Tamil Nadu</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#27272A] pb-2 font-heading">
            Explore Platform
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <button onClick={() => setActiveTab('explore')} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Available Puppies & Dogs
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('ai-finder'); setIsAiFinderOpen(true); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FACC15]" /> AI Breed Matcher
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('customer')} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Customer Pet Hub
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('seller')} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Breeder Portal & Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setIsAdminLoginOpen(true)} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Admin Management Studio
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Featured Breeds */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#27272A] pb-2 font-heading">
            Popular Breeds
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <button onClick={() => { setActiveTab('explore'); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Rajapalayam Hound (TN Native)
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('explore'); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Chippiparai Sight Hound
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('explore'); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Golden Retriever Puppies
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('explore'); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Siberian Husky Litters
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('explore'); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Shih Tzu & Small Breeds
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('explore'); }} className="hover:text-[#FACC15] transition-colors cursor-pointer text-left">
                Beagle & Family Dogs
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Major Locations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#27272A] pb-2 font-heading">
            Delivery Areas
          </h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <span className="text-[#A1A1AA]">Chennai, Tamil Nadu</span>
            </li>
            <li>
              <span className="text-[#A1A1AA]">Coimbatore, Tamil Nadu</span>
            </li>
            <li>
              <span className="text-[#A1A1AA]">Madurai, Tamil Nadu</span>
            </li>
            <li>
              <span className="text-[#A1A1AA]">Salem & Trichy, Tamil Nadu</span>
            </li>
            <li>
              <span className="text-[#A1A1AA]">Bengaluru, Karnataka</span>
            </li>
            <li>
              <span className="text-[#A1A1AA]">Hyderabad & Mumbai</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-[#27272A] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#71717A]">
        <p>© {new Date().getFullYear()} PawVerse India Technologies. All rights reserved. Built for ethical pet companionship.</p>

        <div className="flex items-center gap-4">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">Escrow Policy</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">KCI Code of Ethics</span>
        </div>
      </div>
    </footer>
  );
};
