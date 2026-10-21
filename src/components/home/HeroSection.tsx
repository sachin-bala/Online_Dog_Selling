import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Compass,
  ShieldCheck,
  MapPin,
  Filter,
  ArrowRight,
  CheckCircle2,
  Video,
  Award,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setIsAiFinderOpen, searchQuery, setSearchQuery, setFilterBreed } = useApp();
  const [selectedAge, setSelectedAge] = useState('Any Age');
  const [selectedLocation, setSelectedLocation] = useState('All Cities');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showCardVideo, setShowCardVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;

    const playVideo = () => {
      if (!video) return;
      video.muted = true;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setIsVideoPlaying(true)).catch((err) => {
          console.log('[PawVerse Video Autoplay]:', err.message);
          setIsVideoPlaying(false);
        });
      }
    };

    playVideo();
    video.addEventListener('canplay', playVideo);
    video.addEventListener('loadeddata', playVideo);

    const handleVis = () => {
      if (document.visibilityState === 'visible' && video.paused) playVideo();
    };
    window.addEventListener('focus', handleVis);
    document.addEventListener('visibilitychange', handleVis);

    const gestureEvents = ['pointerdown', 'touchstart', 'scroll', 'click', 'keydown'];
    const handleGesture = () => {
      if (video.paused) playVideo();
      gestureEvents.forEach(evt => window.removeEventListener(evt, handleGesture));
    };
    gestureEvents.forEach(evt => window.addEventListener(evt, handleGesture, { passive: true }));

    return () => {
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('loadeddata', playVideo);
      window.removeEventListener('focus', handleVis);
      document.removeEventListener('visibilitychange', handleVis);
      gestureEvents.forEach(evt => window.removeEventListener(evt, handleGesture));
    };
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation !== 'All Cities') {
      const city = selectedLocation.split(',')[0].trim();
      setSearchQuery(city);
    }
    setActiveTab('explore');
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('why-choose-us');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('explore');
    }
  };

  const popularTags = ['Rajapalayam', 'Golden Retriever', 'Shih Tzu', 'Labrador', 'Chippiparai', 'Beagle'];

  return (
    /* ── FULL VIEWPORT SECTION ─────────────────────────────────── */
    <section
      className="relative w-screen min-h-screen overflow-hidden"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', left: 0, right: 0 }}
    >
      {/* ── FULL-BLEED VIDEO BACKGROUND ─────────────────────────── */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          // @ts-ignore
          webkit-playsinline="true"
          preload="auto"
          poster="/videos/hero-dog-poster.jpg"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '100vh' }}
        >
          <source src="/videos/hero-dog-bg.mp4" type="video/mp4" />
          <source src="https://res.cloudinary.com/demo/video/upload/w_1280,c_scale,q_auto,f_auto/dog.mp4" type="video/mp4" />
        </video>

        {/* Multi-layer Madurai dark scrim — left text area darker, right photo area subtle */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(42,0,0,0.88) 0%, rgba(74,5,5,0.75) 35%, rgba(123,13,13,0.45) 60%, rgba(0,0,0,0.25) 100%)',
          }}
        />
        {/* Bottom vignette for search bar readability */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, rgba(42,0,0,0.92) 0%, transparent 100%)' }}
        />
        {/* Decorative Madurai Gopuram arch lines (left edge) */}
        <svg
          className="absolute left-0 top-0 h-full opacity-10 pointer-events-none"
          style={{ width: '120px' }}
          viewBox="0 0 120 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0 Q60 400 0 800" stroke="#FFD700" strokeWidth="3" fill="none" />
          <path d="M20 0 Q80 400 20 800" stroke="#D4500A" strokeWidth="1.5" fill="none" />
          <path d="M40 0 Q100 400 40 800" stroke="#C0392B" strokeWidth="1" fill="none" />
        </svg>
        {/* Right edge arch */}
        <svg
          className="absolute right-0 top-0 h-full opacity-10 pointer-events-none"
          style={{ width: '120px' }}
          viewBox="0 0 120 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M120 0 Q60 400 120 800" stroke="#FFD700" strokeWidth="3" fill="none" />
          <path d="M100 0 Q40 400 100 800" stroke="#D4500A" strokeWidth="1.5" fill="none" />
          <path d="M80 0 Q20 400 80 800" stroke="#C0392B" strokeWidth="1" fill="none" />
        </svg>

        {/* Top heritage stripe (mirrors the Navbar) */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: 'linear-gradient(90deg,#4A0505,#D4500A,#FFD700,#D4500A,#4A0505)', opacity: 0.7 }}
        />
      </div>

      {/* ── VIDEO CONTROLS PILL ─────────────────────────────────── */}
      <div
        className="absolute top-5 right-5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border shadow-lg"
        style={{ background: 'rgba(10,0,0,0.75)', backdropFilter: 'blur(8px)', borderColor: '#D4500A', color: '#FFD700' }}
      >
        <span className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'animate-pulse' : ''}`} style={{ background: isVideoPlaying ? '#FFD700' : '#71717A' }} />
        <span className="text-[11px] font-bold hidden sm:inline" style={{ color: '#FFD700' }}>
          {isVideoPlaying ? 'Live Motion' : 'Video Ready'}
        </span>
        <div className="h-3 w-px mx-1" style={{ background: 'rgba(255,215,0,0.3)' }} />
        <button
          type="button"
          onClick={toggleVideoPlayback}
          className="p-1 rounded-full transition-colors cursor-pointer"
          style={{ color: '#FFD700' }}
          aria-label="Toggle Video"
        >
          {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>
        <button
          type="button"
          onClick={toggleVideoMute}
          className="p-1 rounded-full transition-colors cursor-pointer"
          style={{ color: '#FFD700' }}
          aria-label="Toggle Audio"
        >
          {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ── MAIN CONTENT (full-width, vertically centered) ──────── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-16 xl:px-24 py-16 lg:py-20">

        {/* Two-column content area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Headlines & CTAs ─────────────────────────── */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

            {/* Trust Pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold shadow-lg"
              style={{
                background: 'rgba(212,80,10,0.18)',
                borderColor: '#D4500A',
                color: '#FFD700',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
              <span>India &amp; Tamil Nadu's Premier Verified Canine Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1
              className="font-extrabold tracking-tight leading-[1.1]"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', color: '#FFF5E0', textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}
            >
              Find Your Healthy,{' '}
              <br />
              <span style={{ color: '#FFD700', textShadow: '0 0 40px rgba(255,215,0,0.4), 0 4px 16px rgba(0,0,0,0.6)' }}>
                Verified Companion
              </span>
            </h1>

            {/* Supporting text */}
            <p
              className="leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', color: 'rgba(255,245,224,0.85)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              Bringing home purebred happiness safely. Explore authentic Tamil Nadu heritage breeds (Rajapalayam, Chippiparai) and KCI Champion puppies with{' '}
              <strong style={{ color: '#FFD700', fontWeight: 800 }}>100% DNA health certifications</strong>, live 1-on-1 video calls, and temperature-controlled AC transport to your doorstep.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveTab('explore')}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#7B0D0D,#D4500A)',
                  color: '#FFD700',
                  border: '2px solid #FFD700',
                  boxShadow: '0 0 24px rgba(212,80,10,0.5)',
                }}
              >
                <Compass className="w-4 h-4" />
                <span>Explore Available Dogs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,245,224,0.12)',
                  color: '#FFF5E0',
                  border: '2px solid rgba(255,245,224,0.4)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span>Why PawVerse?</span>
              </button>

              <button
                onClick={() => { setActiveTab('ai-finder'); setIsAiFinderOpen(true); }}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,215,0,0.15)',
                  color: '#FFD700',
                  border: '2px solid rgba(255,215,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Breed Match</span>
              </button>
            </div>

            {/* Trust Seals */}
            <div
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-semibold"
              style={{ color: 'rgba(255,245,224,0.9)' }}
            >
              {[
                'KCI Certified Breeders',
                '100% DNA Verified',
                'Live Video Inspection',
                'Climate AC Delivery',
              ].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#FFD700' }} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Dog Showcase Card ───────────────────────── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="w-full max-w-sm rounded-3xl p-5 space-y-4 relative group"
              style={{
                background: 'rgba(255,245,224,0.96)',
                backdropFilter: 'blur(16px)',
                border: '2px solid rgba(255,215,0,0.5)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.2)',
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#D4500A' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#7B0D0D' }}>
                    Verified Champion Pedigree
                  </span>
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: '#D4500A', color: '#FFF5E0', border: '1px solid #FFD700' }}
                >
                  Featured
                </span>
              </div>

              {/* Dog Image/Video */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-[4/3] group/media"
                style={{ border: '2px solid rgba(212,80,10,0.25)' }}
              >
                {showCardVideo ? (
                  <video
                    autoPlay loop muted playsInline
                    poster="/videos/hero-dog-poster.jpg"
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/hero-dog-bg.mp4" type="video/mp4" />
                    <source src="https://res.cloudinary.com/demo/video/upload/w_1280,c_scale,q_auto,f_auto/dog.mp4" type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
                    alt="Veera Royal Rajapalayam Champion"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Health badge */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5"
                  style={{ background: 'rgba(255,245,224,0.95)', color: '#2A0000', border: '1px solid rgba(212,80,10,0.4)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#D4500A' }} />
                  <span>Health Score: 99/100</span>
                </div>

                {/* Watch Live Video */}
                <button
                  type="button"
                  onClick={() => setShowCardVideo(!showCardVideo)}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  style={{ background: '#2A0000', color: '#FFD700', border: '1px solid #D4500A' }}
                >
                  <Video className="w-3.5 h-3.5 animate-pulse" style={{ color: '#FFD700' }} />
                  <span>{showCardVideo ? 'Show Photos' : 'Watch Live Video'}</span>
                </button>

                {/* DNA badge */}
                <div
                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"
                  style={{ background: '#2A0000', color: '#FFD700', border: '1px solid rgba(212,80,10,0.5)' }}
                >
                  <Award className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
                  <span>DNA Certified</span>
                </div>
              </div>

              {/* Dog Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base" style={{ color: '#2A0000' }}>
                    Veera – Royal Rajapalayam
                  </h3>
                  <div className="text-right">
                    <span className="text-xl font-extrabold block leading-tight" style={{ color: '#D4500A' }}>₹35,000</span>
                    <span className="text-[10px] line-through" style={{ color: '#9E4F2C' }}>₹42,000</span>
                  </div>
                </div>
                <p className="text-xs font-medium flex items-center gap-1" style={{ color: '#7B0D0D' }}>
                  <MapPin className="w-3 h-3" style={{ color: '#D4500A' }} />
                  Rajapalayam, TN • 12 Weeks • Male
                </p>
              </div>

              {/* Footer */}
              <div
                className="pt-3 border-t flex items-center justify-between text-xs"
                style={{ borderColor: 'rgba(212,80,10,0.2)' }}
              >
                <span className="font-medium" style={{ color: '#2A0000' }}>Breeder: Raja Sundaram</span>
                <span className="font-bold flex items-center gap-1" style={{ color: '#7B0D0D' }}>
                  <ShieldCheck className="w-4 h-4" style={{ color: '#D4500A' }} />
                  KCI Audited Kennel
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR (pinned to bottom area) ──────────────── */}
        <div className="mt-10 lg:mt-14">
          <form
            onSubmit={handleSearch}
            className="rounded-2xl border p-2.5 sm:p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center"
            style={{
              background: 'rgba(42,0,0,0.75)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(212,80,10,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Search Input */}
            <div
              className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 transition-all"
              style={{ background: 'rgba(255,245,224,0.95)', border: '1.5px solid rgba(212,80,10,0.4)' }}
            >
              <Search className="w-4 h-4 shrink-0" style={{ color: '#D4500A' }} />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7B0D0D' }}>
                  Search Breed or Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajapalayam, Retriever..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold placeholder:text-[#9E4F2C] focus:outline-none border-none p-0 min-h-0"
                  style={{ color: '#2A0000' }}
                />
              </div>
            </div>

            {/* Age Stage */}
            <div
              className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 transition-all"
              style={{ background: 'rgba(255,245,224,0.95)', border: '1.5px solid rgba(212,80,10,0.4)' }}
            >
              <Filter className="w-4 h-4 shrink-0" style={{ color: '#D4500A' }} />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7B0D0D' }}>
                  Age Stage
                </label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold focus:outline-none cursor-pointer border-none p-0 min-h-0"
                  style={{ color: '#2A0000' }}
                >
                  <option value="Any Age">Puppies (8-16 Weeks)</option>
                  <option value="Young">Young (4-12 Months)</option>
                  <option value="Adult">Adult (1+ Years)</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div
              className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 transition-all"
              style={{ background: 'rgba(255,245,224,0.95)', border: '1.5px solid rgba(212,80,10,0.4)' }}
            >
              <MapPin className="w-4 h-4 shrink-0" style={{ color: '#D4500A' }} />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7B0D0D' }}>
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold focus:outline-none cursor-pointer border-none p-0 min-h-0"
                  style={{ color: '#2A0000' }}
                >
                  <option value="All Cities">All Tamil Nadu &amp; India</option>
                  <option value="Chennai, TN">Chennai, TN</option>
                  <option value="Coimbatore, TN">Coimbatore, TN</option>
                  <option value="Madurai, TN">Madurai, TN</option>
                  <option value="Tiruchirappalli, TN">Tiruchirappalli, TN</option>
                  <option value="Salem, TN">Salem, TN</option>
                  <option value="Rajapalayam, TN">Rajapalayam, TN</option>
                  <option value="Bengaluru, KA">Bengaluru, KA</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              style={{
                background: 'linear-gradient(135deg,#7B0D0D,#D4500A)',
                color: '#FFD700',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 20px rgba(212,80,10,0.4)',
              }}
            >
              <Search className="w-4 h-4" />
              <span>Search Companions</span>
            </button>
          </form>

          {/* Popular Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-[11px]" style={{ color: 'rgba(255,245,224,0.6)' }}>Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => { setFilterBreed(tag); setActiveTab('explore'); }}
                className="px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,215,0,0.12)',
                  color: 'rgba(255,245,224,0.85)',
                  border: '1px solid rgba(255,215,0,0.25)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
