import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Heart, BarChart2, Sun, Moon, Bell, ShieldCheck,
  LogOut, Menu, X, Lock, ChevronDown, MapPin, Phone,
  MessageSquareText, User, CheckCircle2, Search,
  Home, Trophy, ShoppingBag, Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

/* ─── Location List ─────────────────────────────────────────── */
const LOCATIONS = [
  'All Cities', 'Chennai, TN', 'Coimbatore, TN', 'Madurai, TN',
  'Salem, TN', 'Tiruchirappalli, TN', 'Rajapalayam, TN',
  'Bengaluru, KA', 'Delhi NCR', 'Hyderabad, TS', 'Mumbai, MH',
];

/* ─── SVG Decorators ─────────────────────────────────────────── */
const LotusIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} style={style} aria-hidden="true">
    <path d="M16 28c0 0-8-6-8-14 0-4 3-7 8-7s8 3 8 7c0 8-8 14-8 14z" opacity="0.25" />
    <path d="M16 26c0 0-5-4-5-10 0-2.8 2-5 5-5s5 2.2 5 5c0 6-5 10-5 10z" opacity="0.5" />
    <path d="M16 24c0 0-3-3-3-7 0-1.8 1.3-3 3-3s3 1.2 3 3c0 4-3 7-3 7z" />
    <circle cx="16" cy="14" r="2" />
  </svg>
);

const PawIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
    <circle cx="6" cy="6.5" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="18" cy="6.5" r="2" />
    <circle cx="9" cy="10.5" r="1.5" /><circle cx="15" cy="10.5" r="1.5" />
    <path d="M11 13c-2.5 0-5 2-5 4.5 0 2 1.5 3 3 2.5l2-1 2 1c1.5.5 3-.5 3-2.5C16 15 13.5 13 11 13z" />
  </svg>
);

const OrnCorner: React.FC<{ flip?: boolean; flipY?: boolean; className?: string }> = ({ flip, flipY, className = '' }) => {
  const t = flip && flipY ? 'scale(-1,-1)' : flip ? 'scaleX(-1)' : flipY ? 'scaleY(-1)' : undefined;
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} style={t ? { transform: t } : undefined} aria-hidden="true">
      <path d="M2 58 Q2 2 58 2" stroke="#C58B2A" strokeWidth="2" fill="none" />
      <path d="M8 58 Q8 8 58 8" stroke="#E7B94E" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="10" cy="10" r="5" fill="#C58B2A" opacity="0.7" />
      <circle cx="10" cy="10" r="2.5" fill="#E7B94E" />
      <path d="M10 20 Q12 15 18 15" stroke="#C58B2A" strokeWidth="1.5" fill="none" />
      <path d="M20 10 Q15 12 15 18" stroke="#C58B2A" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="20" r="2" fill="#C58B2A" opacity="0.5" />
    </svg>
  );
};

/* ─── Pillar decorative SVG ──────────────────────────────────── */
const PillarSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 20 120" className={className} aria-hidden="true" fill="none">
    <rect x="4" y="0" width="12" height="8" rx="1" fill="#C58B2A" opacity="0.5" />
    <rect x="6" y="8" width="8" height="104" rx="0" fill="#E7B94E" opacity="0.18" />
    <rect x="4" y="112" width="12" height="8" rx="1" fill="#C58B2A" opacity="0.5" />
    <line x1="10" y1="8" x2="10" y2="112" stroke="#C58B2A" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

/* ─── Main Navbar Component ──────────────────────────────────── */
export const Navbar: React.FC = () => {
  const {
    theme, toggleTheme, activeTab, setActiveTab,
    wishlist, compareList, setIsCompareOpen, setIsAiFinderOpen,
    setSearchQuery, notifications, currentUser,
    setIsAdminLoginOpen, setIsRegisterSellerOpen, logout,
    addNotification, setIsChatbotOpen,
  } = useApp();

  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [selLoc, setSelLoc] = useState('Chennai, TN');
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  /* close dropdowns on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocDrop(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* scroll compact mode */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* lock body when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  /* ── Handlers ── */
  const handleAdmin = () => {
    if (isAdmin) { setActiveTab('admin'); } else { setIsAdminLoginOpen(true); }
    setMobileOpen(false);
  };

  const handleNav = (id: string, isAi?: boolean) => {
    setActiveTab(id as Parameters<typeof setActiveTab>[0]);
    if (isAi) setIsAiFinderOpen(true);
    setMobileOpen(false);
  };

  const handleSellAPet = () => {
    if (currentUser?.role === 'seller' && currentUser.sellerStatus === 'approved') {
      setActiveTab('seller');
    } else {
      setIsRegisterSellerOpen(true);
    }
    setMobileOpen(false);
  };

  const handlePetHub = () => {
    if (currentUser) {
      setActiveTab('customer');
    } else {
      setIsAdminLoginOpen(false);
      setIsRegisterSellerOpen(true);
    }
    setMobileOpen(false);
  };

  const handleLoc = (loc: string) => {
    setSelLoc(loc);
    setShowLocDrop(false);
    if (loc !== 'All Cities') {
      setSearchQuery(loc.split(',')[0].trim());
      setActiveTab('explore');
      addNotification(`Filtered puppies available in ${loc} 📍`);
    } else {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal.trim());
      setActiveTab('explore');
    }
  };

  /* ── Active Tab Class ── */
  const navCls = (id: string) => {
    const a = activeTab === id;
    return [
      'heritage-nav-item inline-flex items-center gap-1.5 px-4 xl:px-5 py-2',
      'font-cinzel text-sm xl:text-[15px] font-semibold tracking-wide cursor-pointer select-none',
      'transition-all duration-200 border rounded-sm whitespace-nowrap',
      a
        ? 'heritage-nav-active text-[#2A0000] border-[#C0392B]'
        : 'text-[#4A0505] border-transparent hover:text-[#2A0000] hover:border-[#C0392B]',
    ].join(' ');
  };

  /* ── Notification count (notifications is string[]) ── */
  const notifCount = notifications.length;

  /* ── User display name ── */
  const displayName = currentUser?.fullName ?? '';
  const initials = displayName ? displayName.charAt(0).toUpperCase() : '?';
  const firstName = displayName ? displayName.split(' ')[0] : '';

  /* ─────────────────────────────────────────────────────────── */
  return (
    <header
      className={`sticky top-0 z-40 w-full select-none transition-all duration-300 ${scrolled ? 'heritage-header-compact' : ''}`}
      role="banner"
    >
      {/* ═══ LEVEL 1 — HERITAGE HEADER ═══════════════════════════ */}
      <div className="heritage-header-bg heritage-pattern-overlay relative overflow-hidden">
        {/* Top golden stripe */}
        <div className="heritage-top-stripe w-full" />

        {/* Temple pillar background accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <PillarSvg className="absolute left-0 top-0 h-full w-5 opacity-30" />
          <PillarSvg className="absolute left-5 top-0 h-full w-5 opacity-15" />
          <PillarSvg className="absolute right-0 top-0 h-full w-5 opacity-30" />
          <PillarSvg className="absolute right-5 top-0 h-full w-5 opacity-15" />
          {/* Arch curves */}
          {/* Gopuram arch curves — saffron + crimson */}
          <svg className="absolute left-0 top-0 h-full w-24 opacity-20" viewBox="0 0 96 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0 Q48 60 0 120" stroke="#FFD700" strokeWidth="2.5" fill="none" />
            <path d="M16 0 Q64 60 16 120" stroke="#D4500A" strokeWidth="1.5" fill="none" />
            <path d="M32 0 Q72 60 32 120" stroke="#C0392B" strokeWidth="1" fill="none" />
          </svg>
          <svg className="absolute right-0 top-0 h-full w-24 opacity-20" viewBox="0 0 96 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M96 0 Q48 60 96 120" stroke="#FFD700" strokeWidth="2.5" fill="none" />
            <path d="M80 0 Q32 60 80 120" stroke="#D4500A" strokeWidth="1.5" fill="none" />
            <path d="M64 0 Q16 60 64 120" stroke="#C0392B" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* ── Main Level-1 Row ── */}
        <div className="heritage-level1 relative w-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 py-2 sm:py-3 flex items-center justify-between gap-2 lg:gap-4">

          {/* ── LEFT: PawVerse Branding ── */}
          <div className="flex flex-col shrink-0 min-w-[115px] lg:min-w-[175px]">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="group flex flex-col cursor-pointer text-left"
              aria-label="PawVerse AI – Go to Homepage"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg,#4A0505,#7B0D0D)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 0 10px rgba(255,165,0,0.35)'
                  }}
                >
                  <PawIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#FFD700' }} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-cinzel font-black tracking-wider leading-none"
                    style={{
                      fontSize: 'clamp(15px,1.8vw,23px)',
                      color: '#FFF5E0',
                      textShadow: '0 0 12px rgba(255,165,0,0.3), 0 2px 6px rgba(0,0,0,0.7)'
                    }}
                  >
                    PAWVERSE
                  </span>
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest leading-none"
                    style={{
                      background: 'linear-gradient(135deg,#D4500A,#FFD700)',
                      color: '#2A0000',
                      boxShadow: '0 1px 6px rgba(255,165,0,0.4)'
                    }}
                  >
                    AI
                  </span>
                </div>
              </div>
              <span
                className="text-[9px] sm:text-[10px] font-bold tracking-[0.18em] mt-0.5 ml-1"
                style={{ color: '#F5901A', fontFamily: "'Plus Jakarta Sans',sans-serif", textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
              >
                Verified Pet Marketplace
              </span>
            </button>

            {/* Location selector – desktop only */}
            <div className="relative hidden lg:block mt-1.5" ref={locRef}>
              <button
                type="button"
                onClick={() => setShowLocDrop(!showLocDrop)}
                className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-medium cursor-pointer transition-colors"
                style={{ background: 'rgba(42,0,0,0.55)', borderColor: '#D4500A', color: '#F5901A' }}
                aria-label="Select Location"
                aria-expanded={showLocDrop}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[95px]">{selLoc}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showLocDrop ? 'rotate-180' : ''}`} />
              </button>
              {showLocDrop && (
                <div
                  className="absolute top-full left-0 mt-1 w-52 rounded-xl shadow-xl py-1.5 z-50 border"
                  style={{ background: '#FFF5E0', borderColor: '#D4500A' }}
                  role="listbox"
                  aria-label="City selection"
                >
                  <div
                    className="px-3 py-1 text-[9px] font-black uppercase tracking-wider border-b"
                    style={{ color: '#7B0D0D', borderColor: '#FFE8A8', background: 'rgba(212,80,10,0.08)' }}
                  >
                    Select City
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        type="button"
                        role="option"
                        aria-selected={selLoc === loc}
                        onClick={() => handleLoc(loc)}
                        className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer"
                        style={{
                          color: selLoc === loc ? '#2A0000' : '#4A0505',
                          background: selLoc === loc ? 'rgba(192,57,43,0.12)' : 'transparent',
                          fontWeight: selLoc === loc ? '700' : '500',
                        }}
                      >
                        <span>{loc}</span>
                        {selLoc === loc && <CheckCircle2 className="w-3 h-3" style={{ color: '#C0392B' }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CENTER: Tamil Kennel Heritage Frame ── */}
          <div className="hidden md:flex flex-col items-center flex-1 px-2 lg:px-4">
            <div className="relative">
              {/* Ornamental corners */}
              <OrnCorner className="absolute -top-2 -left-3 w-10 h-10 opacity-80 z-10" />
              <OrnCorner flip className="absolute -top-2 -right-3 w-10 h-10 opacity-80 z-10" />
              <OrnCorner flipY className="absolute -bottom-2 -left-3 w-10 h-10 opacity-80 z-10" />
              <OrnCorner flip flipY className="absolute -bottom-2 -right-3 w-10 h-10 opacity-80 z-10" />

              {/* Frame body */}
              <div
                className="heritage-center-frame rounded-sm px-5 sm:px-8 lg:px-12 xl:px-14 py-2 sm:py-3 flex flex-col items-center relative"
                style={{ minWidth: 'clamp(210px,27vw,400px)' }}
              >
                {/* Top lotus divider */}
                {/* Top lotus row — gold + saffron */}
                <div className="flex items-center gap-2 mb-1">
                  <LotusIcon className="w-4 h-4" style={{ color: '#FFD700' }} />
                  <div className="h-[1.5px] flex-1" style={{ background: 'linear-gradient(90deg,transparent,#FFD700)', minWidth: '22px' }} />
                  <LotusIcon className="w-5 h-5" style={{ color: '#F5901A' }} />
                  <div className="h-[1.5px] flex-1" style={{ background: 'linear-gradient(90deg,#FFD700,transparent)', minWidth: '22px' }} />
                  <LotusIcon className="w-4 h-4" style={{ color: '#FFD700' }} />
                </div>

                {/* Main title — high contrast gold on dark crimson */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <PawIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ color: '#F5901A' }} />
                  <h1
                    className="font-heritage font-black tracking-[0.12em] leading-none text-center heritage-title-glow"
                    style={{ fontSize: 'clamp(18px,2.8vw,34px)' }}
                  >
                    TAMIL KENNEL
                  </h1>
                  <PawIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ color: '#F5901A' }} />
                </div>

                {/* Sub-tagline — saffron */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,#D4500A)' }} />
                  <span
                    className="font-cinzel text-[8px] sm:text-[9.5px] tracking-[0.22em] font-bold"
                    style={{ color: '#F5901A', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                  >
                    VERIFIED PET MARKETPLACE
                  </span>
                  <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,#D4500A,transparent)' }} />
                </div>

                {/* Bottom lotus accent */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-px w-8" style={{ background: 'linear-gradient(90deg,transparent,#FFD700)' }} />
                  <LotusIcon className="w-3 h-3" style={{ color: '#FFD700' }} />
                  <div className="h-px w-8" style={{ background: 'linear-gradient(90deg,#FFD700,transparent)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Utility Panel ── */}
          <div className="hidden sm:flex flex-col items-end shrink-0 gap-1.5 min-w-[115px] lg:min-w-[220px]">

            {/* Top row: auth + theme */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
              {currentUser ? (
                <>
                  {/* User chip */}
                  <div
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border"
                    style={{ background: 'rgba(42,0,0,0.55)', borderColor: '#D4500A' }}
                  >
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-[10px] font-black"
                      style={{ borderColor: '#FFD700', background: '#4A0505', color: '#FFD700' }}
                    >
                      {initials}
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-[9px] font-semibold leading-none" style={{ color: '#F5901A' }}>Welcome back</span>
                      <span className="text-[11px] font-bold leading-none" style={{ color: '#FFF5E0' }}>{firstName}</span>
                    </div>
                  </div>

                  {/* Admin panel button */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleAdmin}
                      className="flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded border font-semibold transition-all cursor-pointer text-[9px] sm:text-[10px]"
                      style={{ background: 'linear-gradient(135deg,#4A0505,#7B0D0D)', borderColor: '#FFD700', color: '#FFD700' }}
                      aria-label="Open Admin Panel"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span className="hidden sm:inline">Admin</span>
                    </button>
                  )}

                  {/* Customer Dashboard */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('customer'); setMobileOpen(false); }}
                    className="flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded border font-semibold transition-all cursor-pointer text-[9px] sm:text-[10px]"
                    style={{ borderColor: '#D4500A', color: '#F5901A' }}
                    aria-label="My Dashboard"
                  >
                    <User className="w-3 h-3" />
                    <span className="hidden sm:inline">Pets</span>
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded border text-[9px] sm:text-[10px] transition-all cursor-pointer"
                    style={{ borderColor: '#C0392B', color: '#C0392B' }}
                    aria-label="Logout"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAdmin}
                  className="heritage-btn-gold flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded font-bold cursor-pointer text-[10px] sm:text-xs"
                  aria-label="Admin Login"
                >
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Admin&nbsp;Login</span>
                </button>
              )}

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full border transition-all cursor-pointer"
                style={{ borderColor: '#D4500A', color: '#F5901A' }}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>

            {/* Bottom row: quick-action icons */}
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {/* Search */}
              <button
                type="button"
                onClick={() => { setActiveTab('explore'); }}
                className="relative flex items-center gap-1 px-2 py-1 rounded border text-[10px] cursor-pointer transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(212,80,10,0.5)', color: '#F5901A' }}
                aria-label="Search dogs"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="font-semibold hidden xl:inline">Search</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => { setActiveTab('explore'); }}
                className="relative flex items-center gap-1 px-2 py-1 rounded border text-[10px] cursor-pointer transition-all hover:bg-white/10"
                style={{
                  borderColor: wishlist.length ? '#FFD700' : 'rgba(212,80,10,0.4)',
                  color: wishlist.length ? '#FFD700' : '#F5901A',
                }}
                aria-label={`Wishlist – ${wishlist.length} items`}
              >
                <Heart className="w-3.5 h-3.5" fill={wishlist.length ? 'currentColor' : 'none'} />
                <span className="font-semibold hidden xl:inline">Wishlist</span>
                {wishlist.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                    style={{ background: '#C0392B', color: '#FFF5E0' }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Compare */}
              <button
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="relative flex items-center gap-1 px-2 py-1 rounded border text-[10px] cursor-pointer transition-all hover:bg-white/10"
                style={{
                  borderColor: compareList.length ? '#FFD700' : 'rgba(212,80,10,0.4)',
                  color: compareList.length ? '#FFD700' : '#F5901A',
                }}
                aria-label={`Compare – ${compareList.length} items`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="font-semibold hidden xl:inline">Compare</span>
                {compareList.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                    style={{ background: '#FFD700', color: '#2A0000' }}
                  >
                    {compareList.length}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotif(!showNotif)}
                  className="relative p-1.5 rounded border cursor-pointer transition-all hover:bg-white/10"
                  style={{ borderColor: notifCount > 0 ? '#FFD700' : 'rgba(212,80,10,0.4)', color: notifCount > 0 ? '#FFD700' : '#F5901A' }}
                  aria-label={`Notifications – ${notifCount} new`}
                  aria-expanded={showNotif}
                >
                  <Bell className="w-3.5 h-3.5" />
                  {notifCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center"
                      style={{ background: '#C0392B', color: '#FFF5E0' }}
                    >
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div
                    className="absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl z-50 border overflow-hidden"
                    style={{ background: '#FFF5E0', borderColor: '#D4500A' }}
                    role="dialog"
                    aria-label="Notifications panel"
                  >
                    <div
                      className="px-3 py-2 flex items-center gap-2 border-b"
                      style={{ background: 'linear-gradient(135deg,#4A0505,#7B0D0D)', borderColor: '#D4500A' }}
                    >
                      <Bell className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
                      <span className="font-cinzel text-xs font-bold" style={{ color: '#FFD700' }}>Notifications</span>
                      <span
                        className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-black"
                        style={{ background: '#D4500A', color: '#FFF5E0' }}
                      >
                        {notifCount} new
                      </span>
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs" style={{ color: '#7B0D0D' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((msg, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 border-b text-xs flex gap-2"
                            style={{ borderColor: '#FFE8A8' }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: '#D4500A' }} />
                            <span style={{ color: '#4A0505' }}>{msg}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Chat */}
              <button
                type="button"
                onClick={() => setIsChatbotOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] cursor-pointer transition-all hover:bg-white/10"
                style={{ borderColor: '#14A085', color: '#14A085' }}
                aria-label="Open AI Chat"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Chat</span>
              </button>

              {/* Phone */}
              <a
                href="tel:+917708221221"
                className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] transition-all hover:bg-white/10"
                style={{ borderColor: '#FFD700', color: '#FFD700' }}
                aria-label="Call PawVerse"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Call</span>
              </a>
            </div>
          </div>

          {/* ── Mobile: compact utility row ── */}
          <div className="sm:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="relative p-1.5 rounded border cursor-pointer"
              style={{ borderColor: '#D4500A', color: '#FFD700' }}
              aria-label="Compare"
            >
              <BarChart2 className="w-4 h-4" />
              {compareList.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                  style={{ background: '#FFD700', color: '#2A0000' }}
                >
                  {compareList.length}
                </span>
              )}
            </button>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-1.5 rounded border cursor-pointer"
                style={{ borderColor: '#D4500A', color: '#FFD700' }}
                aria-label="Notifications"
                aria-expanded={showNotif}
              >
                <Bell className="w-4 h-4" />
                {notifCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                    style={{ background: '#C0392B', color: '#FFF5E0' }}
                  >
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div
                  className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl z-50 border overflow-hidden"
                  style={{ background: '#FFF5E0', borderColor: '#D4500A' }}
                >
                  <div
                    className="px-3 py-2 font-cinzel text-xs font-bold border-b"
                    style={{ background: 'linear-gradient(135deg,#4A0505,#7B0D0D)', color: '#FFD700', borderColor: '#D4500A' }}
                  >
                    Notifications
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-4 text-center text-xs" style={{ color: '#7B0D0D' }}>No notifications</div>
                    ) : (
                      notifications.slice(0, 5).map((msg, idx) => (
                        <div key={idx} className="px-3 py-2 border-b text-xs" style={{ borderColor: '#FFE8A8', color: '#4A0505' }}>
                          {msg}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded border cursor-pointer transition-all"
              style={{ borderColor: '#FFD700', color: '#FFD700' }}
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bottom golden stripe */}
        <div className="heritage-bottom-stripe w-full" />
      </div>

      {/* ═══ LEVEL 2 — NAVIGATION BAR ═══════════════════════════ */}
      <nav
        className="heritage-nav-bg relative hidden md:block"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="heritage-pattern-overlay absolute inset-0 opacity-25 pointer-events-none" aria-hidden="true" />
        <div
          className="relative w-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 flex items-center justify-between gap-2"
          style={{ minHeight: '50px' }}
        >
          {/* Desktop nav links */}
          <div className="flex items-center gap-0.5 lg:gap-1 flex-wrap py-1">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={navCls('home')}
              aria-current={activeTab === 'home' ? 'page' : undefined}
            >
              <LotusIcon className="w-4 h-4 opacity-75 shrink-0" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('explore')}
              className={navCls('explore')}
              aria-current={activeTab === 'explore' ? 'page' : undefined}
            >
              <PawIcon className="w-4 h-4 opacity-75 shrink-0" />
              <span>Dogs</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('explore'); setIsAiFinderOpen(true); }}
              className={navCls('ai-finder')}
              aria-current={activeTab === 'ai-finder' ? 'page' : undefined}
            >
              <Sparkles className="w-4 h-4 opacity-75 shrink-0" />
              <span>AI Matcher</span>
              <Sparkles className="w-3 h-3 shrink-0" style={{ color: '#D4500A' }} />
            </button>

            <button
              type="button"
              onClick={() => handleNav('shows')}
              className={navCls('shows')}
              aria-current={activeTab === 'shows' ? 'page' : undefined}
            >
              <Trophy className="w-4 h-4 opacity-75 shrink-0" />
              <span>Dog Shows</span>
            </button>

            <button
              type="button"
              onClick={handlePetHub}
              className={navCls('customer')}
              aria-current={activeTab === 'customer' ? 'page' : undefined}
            >
              <User className="w-4 h-4 opacity-75 shrink-0" />
              <span>Pet Hub</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('store')}
              className={navCls('store')}
              aria-current={activeTab === 'store' ? 'page' : undefined}
            >
              <ShoppingBag className="w-4 h-4 opacity-75 shrink-0" />
              <span>Pet Store</span>
            </button>

            <button
              type="button"
              onClick={handleSellAPet}
              className={navCls('seller')}
              aria-current={activeTab === 'seller' ? 'page' : undefined}
            >
              <Tag className="w-4 h-4 opacity-75 shrink-0" />
              <span>Sell a Pet</span>
              <PawIcon className="w-3 h-3 shrink-0" style={{ color: '#D4500A' }} />
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-none ml-4">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style={{ color: '#D4500A' }}
              />
              <input
                type="search"
                placeholder="Search breeds, dogs…"
                value={searchVal}
                className="w-40 lg:w-56 xl:w-64 2xl:w-72 pl-7 pr-3 py-1.5 rounded border text-xs font-medium outline-none transition-all"
                style={{ background: 'rgba(255,248,224,0.8)', borderColor: '#D4500A', color: '#2A0000' }}
                onFocus={e => {
                  e.target.style.borderColor = '#C0392B';
                  e.target.style.background = '#FFF5E0';
                  e.target.style.boxShadow = '0 0 0 2px rgba(192,57,43,0.2)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#D4500A';
                  e.target.style.background = 'rgba(255,248,224,0.8)';
                  e.target.style.boxShadow = 'none';
                }}
                onChange={e => setSearchVal(e.target.value)}
                aria-label="Search dogs and breeds"
              />
            </div>
          </form>
        </div>
      </nav>

      {/* ═══ MOBILE NAVIGATION DRAWER ════════════════════════════ */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden fixed inset-0 top-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel — Madurai crimson */}
          <div
            className="relative ml-auto w-4/5 max-w-xs h-full overflow-y-auto flex flex-col shadow-2xl"
            style={{
              background: 'linear-gradient(180deg,#2A0000 0%,#4A0505 40%,#7B0D0D 100%)',
              borderLeft: '3px solid #D4500A'
            }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: '#D4500A', background: 'linear-gradient(90deg,#4A0505,#7B0D0D)' }}
            >
              <div className="flex items-center gap-2">
                <PawIcon className="w-7 h-7" style={{ color: '#FFD700' }} />
                <div>
                  <div className="font-cinzel text-sm font-black" style={{ color: '#FFF5E0', letterSpacing: '0.08em' }}>PAWVERSE AI</div>
                  <div className="text-[9px] tracking-[0.2em] font-bold" style={{ color: '#F5901A' }}>TAMIL KENNEL</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded border cursor-pointer"
                style={{ borderColor: '#D4500A', color: '#FFD700' }}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top gopuram stripe in drawer */}
            <div className="heritage-top-stripe w-full" style={{ height: '3px' }} />

            {/* Location selector - mobile */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(212,80,10,0.3)' }}>
              <div className="text-[9px] font-black tracking-widest mb-2" style={{ color: '#F5901A' }}>SELECT CITY</div>
              <div className="grid grid-cols-2 gap-1">
                {LOCATIONS.slice(0, 6).map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => { handleLoc(loc); setMobileOpen(false); }}
                    className="text-left px-2 py-1.5 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    style={{
                      background: selLoc === loc ? '#D4500A' : 'rgba(212,80,10,0.12)',
                      color: selLoc === loc ? '#FFF5E0' : '#F5901A',
                      border: `1px solid ${selLoc === loc ? '#FFD700' : 'rgba(212,80,10,0.3)'}`,
                    }}
                  >
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-3 space-y-1" aria-label="Mobile navigation">
              {[
                { id: 'home', icon: <Home className="w-4 h-4" />, label: 'Home', handler: () => handleNav('home') },
                { id: 'explore', icon: <PawIcon className="w-4 h-4" />, label: 'Dogs', handler: () => handleNav('explore') },
                { id: 'ai-finder', icon: <Sparkles className="w-4 h-4" />, label: 'AI Matcher', handler: () => { setActiveTab('explore'); setIsAiFinderOpen(true); setMobileOpen(false); } },
                { id: 'shows', icon: <Trophy className="w-4 h-4" />, label: 'Dog Shows', handler: () => handleNav('shows') },
                { id: 'customer', icon: <User className="w-4 h-4" />, label: 'Pet Hub', handler: () => { handlePetHub(); } },
                { id: 'store', icon: <ShoppingBag className="w-4 h-4" />, label: 'Pet Store', handler: () => handleNav('store') },
                { id: 'seller', icon: <Tag className="w-4 h-4" />, label: 'Sell a Pet', handler: handleSellAPet },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.handler}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left"
                  style={{
                    background: activeTab === item.id ? 'rgba(212,80,10,0.25)' : 'rgba(255,255,255,0.03)',
                    color: activeTab === item.id ? '#FFD700' : '#FFF5E0',
                    border: `1px solid ${activeTab === item.id ? '#D4500A' : 'rgba(212,80,10,0.15)'}`,
                  }}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  <span style={{ color: activeTab === item.id ? '#FFD700' : '#F5901A' }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.id === 'ai-finder' && <Sparkles className="w-3 h-3 ml-auto" style={{ color: '#D4500A' }} />}
                </button>
              ))}
            </nav>

            {/* Mobile search */}
            <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(212,80,10,0.3)' }}>
              <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#D4500A' }} />
                  <input
                    type="search"
                    placeholder="Search breeds, dogs…"
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded border text-sm font-medium outline-none"
                    style={{ background: 'rgba(42,0,0,0.5)', borderColor: '#D4500A', color: '#FFF5E0' }}
                    aria-label="Search dogs"
                  />
                </div>
              </form>
            </div>

            {/* Mobile auth section */}
            <div className="px-4 py-3 border-t space-y-2" style={{ borderColor: 'rgba(212,80,10,0.3)' }}>
              {currentUser ? (
                <>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                    style={{ background: 'rgba(212,80,10,0.12)', borderColor: '#D4500A' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-black"
                      style={{ borderColor: '#FFD700', background: '#4A0505', color: '#FFD700' }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: '#FFF5E0' }}>{displayName}</div>
                      <div className="text-[10px]" style={{ color: '#F5901A' }}>
                        {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'seller' ? 'Verified Seller' : 'Pet Buyer'}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleAdmin}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                      style={{ background: 'linear-gradient(135deg,#4A0505,#7B0D0D)', border: '1px solid #FFD700', color: '#FFD700' }}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{ border: '1px solid #C0392B', color: '#C0392B' }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => { handleAdmin(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#D4500A,#FFD700)', color: '#2A0000' }}
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin Login</span>
                </button>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px]" style={{ color: '#E7B94E' }}>Theme</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full border cursor-pointer"
                  style={{ borderColor: '#C58B2A', color: '#E7B94E' }}
                  aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
