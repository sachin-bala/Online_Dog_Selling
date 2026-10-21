import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Eye,
  Users,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Info,
  X,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { DogShow } from '../../data/showsData';

export const DEFAULT_SHOW_BANNER = '/images/shows/kci-championship.jpg';

export const DogShowsView: React.FC = () => {
  const {
    dogShows,
    refreshDogShows,
    setSelectedShow,
    setIsRegisterShowOpen,
    currentUser,
    setActiveTab,
  } = useApp();

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  // Automatically refresh dog shows from backend database on mount
  useEffect(() => {
    refreshDogShows();
  }, [refreshDogShows]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [viewingDetailsShow, setViewingDetailsShow] = useState<DogShow | null>(null);

  // Helper to safely parse dates for sorting
  const parseShowDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date(2099, 11, 31);
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed;
    // Try appending current year if format is like 'November 15'
    const fallback = new Date(`${dateStr} ${new Date().getFullYear()}`);
    return isNaN(fallback.getTime()) ? new Date(2099, 11, 31) : fallback;
  };

  const isPastShow = (show: DogShow): boolean => {
    if (show.status === 'Completed') return true;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = parseShowDate(show.date);
    return d < now && show.status !== 'Ongoing';
  };

  // Filter shows by search query
  const matchesSearch = (show: DogShow) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (show.eventName || show.title || '').toLowerCase();
    const loc = (show.location || show.venue || `${show.venue || ''} ${show.city || ''}`).toLowerCase();
    const desc = (show.description || '').toLowerCase();
    return name.includes(q) || loc.includes(q) || desc.includes(q);
  };

  // Segment and sort shows dynamically
  const upcomingShows = dogShows
    .filter((s) => !isPastShow(s) && matchesSearch(s))
    .sort((a, b) => parseShowDate(a.date).getTime() - parseShowDate(b.date).getTime());

  const pastShows = dogShows
    .filter((s) => isPastShow(s) && matchesSearch(s))
    .sort((a, b) => parseShowDate(b.date).getTime() - parseShowDate(a.date).getTime());

  const allShows = dogShows
    .filter((s) => matchesSearch(s))
    .sort((a, b) => parseShowDate(a.date).getTime() - parseShowDate(b.date).getTime());

  const displayedShows =
    activeFilter === 'upcoming'
      ? upcomingShows
      : activeFilter === 'past'
      ? pastShows
      : allShows;

  return (
    <div className="w-full min-h-screen py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ── ADMIN BANNER ────────────────────────────────────────── */}
      {isAdmin && (
        <div className="bg-[#FEF9C3] border-2 border-[#FDE047] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] text-[#FACC15] flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5 text-[#FACC15]" />
            </div>
            <div>
              <p className="font-extrabold text-[#0A0A0A] text-sm font-heading">
                Admin Dog Show Event Management Active
              </p>
              <p className="text-xs text-[#713F12]">
                Create new events, upload custom banners, modify parameters, or manage registrations in the admin dashboard.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className="w-full sm:w-auto btn-primary text-xs py-2.5 px-5 font-bold flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Building2 className="w-4 h-4" />
            Open Admin Dashboard
          </button>
        </div>
      )}

      {/* ── HERO HEADER BANNER ───────────────────────────────────── */}
      <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-[#FEFCE8] via-[#FEF9C3] to-[#FEF08A] border-2 border-[#FDE047] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0A0A] text-[#FACC15] text-xs font-black shadow-sm">
            <Trophy className="w-4 h-4 text-[#FACC15]" />
            <span>KCI Sanctioned Championships & Canine Sports</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A0A0A] tracking-tight font-heading leading-tight">
            Upcoming Dog Shows & <br />
            <span className="text-[#CA8A04]">State Championships</span>
          </h1>

          <p className="text-[#713F12] text-xs sm:text-sm leading-relaxed font-medium">
            Discover sanctioned Kennel Club of India (KCI) breed standards, agility obstacle rings, obedience trials,
            and Tamil Nadu native hound events. Browse scheduled dates, venues, rules, and register your champion dog online.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 justify-center md:justify-start">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] bg-white/80 px-3.5 py-1.5 rounded-xl border border-[#FDE047]">
              <Sparkles className="w-3.5 h-3.5 text-[#CA8A04]" />
              <span>{upcomingShows.length} Upcoming Shows Scheduled</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] bg-white/80 px-3.5 py-1.5 rounded-xl border border-[#FDE047]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Dynamic Database Live Sync</span>
            </div>
          </div>
        </div>

        {/* Decorative Trophy Visual */}
        <div className="hidden lg:flex items-center justify-center shrink-0 relative">
          <div className="w-52 h-52 rounded-full bg-[#FACC15]/30 blur-2xl absolute -inset-2 pointer-events-none" />
          <div className="relative w-44 h-44 rounded-3xl bg-[#0A0A0A] border-4 border-[#FDE047] flex flex-col items-center justify-center text-center p-4 shadow-xl">
            <Trophy className="w-16 h-16 text-[#FACC15] mb-2 animate-bounce duration-1000" />
            <p className="text-[11px] font-black text-[#FACC15] uppercase tracking-wider">KCI Grand Trophy</p>
            <p className="text-[10px] text-white/70">Tamil Nadu State Ring</p>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ─────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#FDE047] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#FEF9C3] p-1.5 rounded-2xl border border-[#FDE047] w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'upcoming'
                  ? 'bg-[#0A0A0A] text-[#FACC15] shadow-xs'
                  : 'text-[#713F12] hover:text-[#0A0A0A]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Dog Shows</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#FEF08A] text-[#0A0A0A] text-[10px] font-black">
                {upcomingShows.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'all'
                  ? 'bg-[#0A0A0A] text-[#FACC15] shadow-xs'
                  : 'text-[#713F12] hover:text-[#0A0A0A]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>All Events</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#FEF08A] text-[#0A0A0A] text-[10px] font-black">
                {allShows.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('past')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'past'
                  ? 'bg-[#0A0A0A] text-[#FACC15] shadow-xs'
                  : 'text-[#713F12] hover:text-[#0A0A0A]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Past Events</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#FEF08A] text-[#0A0A0A] text-[10px] font-black">
                {pastShows.length}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#CA8A04] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, venue, city..."
              className="w-full bg-[#FEFCE8] border border-[#FDE047] rounded-xl p-2.5 pl-10 text-[#0A0A0A] placeholder-[#713F12]/50 text-xs font-medium focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#713F12] hover:text-[#0A0A0A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── EVENTS SECTION HEADER ────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#FDE047] pb-3">
        <div>
          <h2 className="text-xl font-black text-[#0A0A0A] font-heading flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#CA8A04]" />
            {activeFilter === 'upcoming'
              ? 'Upcoming Dog Shows'
              : activeFilter === 'past'
              ? 'Past Events & Hall of Fame'
              : 'All Dog Show Tournaments'}
          </h2>
          <p className="text-xs text-[#713F12]">
            {activeFilter === 'upcoming'
              ? 'Sorted in chronological order by upcoming date'
              : activeFilter === 'past'
              ? 'Completed tournaments and state championship archives'
              : 'Complete dynamic database listings'}
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#713F12]">
          Showing {displayedShows.length} {displayedShows.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      {/* ── EMPTY STATE ──────────────────────────────────────────── */}
      {displayedShows.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-[#FDE047] space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#FEF9C3] border border-[#FDE047] flex items-center justify-center mx-auto text-[#CA8A04]">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#0A0A0A] font-heading">
              No Dog Shows Found
            </h3>
            <p className="text-xs text-[#713F12] max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `No dog shows match your search "${searchQuery}". Try searching by another city or clear the search filter.`
                : activeFilter === 'upcoming'
                ? 'There are currently no upcoming dog shows scheduled. New KCI state championship dates are added regularly, so please check back soon!'
                : 'No dog show events recorded in this category.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="btn-secondary text-xs py-2 px-4 font-bold"
              >
                Clear Search
              </button>
            )}
            {activeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="btn-primary text-xs py-2 px-4 font-bold"
              >
                View All Events
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="btn-primary text-xs py-2 px-4 font-bold flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                Create Event in Admin Studio
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── DYNAMIC EVENTS GRID ─────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedShows.map((show) => {
            const eventName = show.eventName || show.title || 'Untitled Championship';
            const locationStr =
              show.location ||
              show.venue ||
              `${show.venue || ''}${show.city ? `, ${show.city}` : ''}` ||
              'Venue TBA';
            const timeStr = show.time || show.startTime || '09:00 AM - 05:00 PM';
            const isCompleted = isPastShow(show);

            return (
              <div
                key={show.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#FDE047] hover:border-[#CA8A04] hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Event Image Banner */}
                <div className="relative h-52 overflow-hidden bg-[#0A0A0A]">
                  <img
                    src={show.bannerImage || show.image || DEFAULT_SHOW_BANNER}
                    alt={eventName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_SHOW_BANNER;
                    }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-black backdrop-blur-xs shadow-xs ${
                        isCompleted
                          ? 'bg-gray-800 text-gray-200'
                          : show.status === 'Ongoing'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0A0A0A]/90 text-[#FACC15]'
                      }`}
                    >
                      {show.status || (isCompleted ? 'Completed' : 'Upcoming')}
                    </span>
                  </div>

                  {/* Fee Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#FACC15] text-[#0A0A0A] shadow-xs">
                      {show.registrationFee && show.registrationFee > 0
                        ? `₹${show.registrationFee.toLocaleString()}`
                        : 'Free Entry'}
                    </span>
                  </div>

                  {/* Bottom banner gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent pointer-events-none" />
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Event Name */}
                    <h3 className="text-lg font-black text-[#0A0A0A] font-heading leading-snug line-clamp-2">
                      {eventName}
                    </h3>

                    {/* Location with MapPin */}
                    <div className="flex items-start gap-2 text-xs text-[#713F12]">
                      <MapPin className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
                      <span className="font-semibold line-clamp-1">{locationStr}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FEFCE8] rounded-xl border border-[#FDE047] text-xs">
                      <div className="flex items-center gap-1.5 text-[#0A0A0A]">
                        <Calendar className="w-3.5 h-3.5 text-[#CA8A04] shrink-0" />
                        <span className="font-bold truncate">{show.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0A0A0A]">
                        <Clock className="w-3.5 h-3.5 text-[#CA8A04] shrink-0" />
                        <span className="font-bold truncate">{timeStr}</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-[#713F12] line-clamp-2 leading-relaxed">
                      {show.description || 'Join dog breeders, judges, and handlers at this prestigious event.'}
                    </p>

                    {/* Registration Information (when available) */}
                    {(show.registrationDetails || show.registrationDeadline) && (
                      <div className="p-2.5 bg-[#FEF08A]/70 rounded-xl border border-[#FDE047] text-[11px] text-[#713F12] flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-[#CA8A04] shrink-0 mt-0.5" />
                        <div className="line-clamp-2 font-medium">
                          {show.registrationDetails || `Registration Deadline: ${show.registrationDeadline}`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-[#FDE047] flex items-center gap-2">
                    {/* View Details Button (required) */}
                    <button
                      type="button"
                      onClick={() => setViewingDetailsShow(show)}
                      className="flex-1 btn-secondary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>

                    {/* Register Entry button */}
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedShow(show);
                          setIsRegisterShowOpen(true);
                        }}
                        className="btn-primary text-xs py-2.5 px-3.5 font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SEPARATE PAST EVENTS SECTION (When on Upcoming tab) ──── */}
      {activeFilter === 'upcoming' && pastShows.length > 0 && (
        <div className="pt-8 space-y-5 border-t-2 border-[#FDE047]/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#0A0A0A] font-heading flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#CA8A04]" />
                Recent Past Championships
              </h3>
              <p className="text-xs text-[#713F12]">
                Explore completed tournament ring archives and past awards
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveFilter('past')}
              className="text-xs font-bold text-[#CA8A04] hover:text-[#0A0A0A] flex items-center gap-1 hover:underline"
            >
              <span>View All Past Events ({pastShows.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastShows.slice(0, 3).map((show) => {
              const eventName = show.eventName || show.title || 'Past Championship';
              const locationStr = show.location || show.venue || `${show.venue || ''}, ${show.city || ''}`;
              return (
                <div
                  key={show.id}
                  className="bg-white/80 rounded-3xl overflow-hidden border border-[#FDE047] opacity-85 hover:opacity-100 transition-all flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden bg-[#0A0A0A]">
                    <img
                      src={show.bannerImage || show.image || DEFAULT_SHOW_BANNER}
                      alt={eventName}
                      className="w-full h-full object-cover grayscale-30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_SHOW_BANNER;
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gray-900/90 text-gray-200">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-black text-[#0A0A0A] truncate">{eventName}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#713F12]">
                        <MapPin className="w-3.5 h-3.5 text-[#CA8A04]" />
                        <span className="truncate">{locationStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#713F12]">
                        <Calendar className="w-3.5 h-3.5 text-[#CA8A04]" />
                        <span>{show.date}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingDetailsShow(show)}
                      className="w-full btn-secondary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL: PUBLIC VISITOR "VIEW DETAILS" MODAL ───────────── */}
      {viewingDetailsShow && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FEF9C3] dark:bg-[#FEF9C3] border-2 border-[#FDE047] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 my-8 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#FDE047] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] text-[#FACC15] flex items-center justify-center shadow-md">
                  <Trophy className="w-5 h-5 text-[#FACC15]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0A0A0A] text-lg font-heading">
                    Dog Show Championship Details
                  </h4>
                  <p className="text-xs text-[#713F12]">Official tournament schedule & entry parameters</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDetailsShow(null)}
                className="p-2 rounded-xl border border-[#FDE047] text-[#713F12] hover:text-[#0A0A0A] hover:bg-[#FEF08A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Banner Image */}
            <div className="relative rounded-2xl overflow-hidden border border-[#FDE047] h-52 bg-[#0A0A0A]">
              <img
                src={viewingDetailsShow.bannerImage || viewingDetailsShow.image || DEFAULT_SHOW_BANNER}
                alt={viewingDetailsShow.eventName || viewingDetailsShow.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_SHOW_BANNER;
                }}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0A0A0A]/90 text-[#FACC15] backdrop-blur-xs">
                  {viewingDetailsShow.status || 'Upcoming'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FACC15] text-[#0A0A0A] backdrop-blur-xs">
                  Fee: ₹{(viewingDetailsShow.registrationFee ?? 1500).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Event Name */}
            <div>
              <h3 className="text-2xl font-black text-[#0A0A0A] font-heading">
                {viewingDetailsShow.eventName || viewingDetailsShow.title}
              </h3>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#FEF08A]/80 border border-[#FDE047] rounded-xl flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#713F12] font-black">Location & Venue</p>
                  <p className="text-xs font-bold text-[#0A0A0A]">
                    {viewingDetailsShow.location ||
                      viewingDetailsShow.venue ||
                      `${viewingDetailsShow.venue || ''}, ${viewingDetailsShow.city || ''}`}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#FEF08A]/80 border border-[#FDE047] rounded-xl flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#713F12] font-black">Date & Arena Hours</p>
                  <p className="text-xs font-bold text-[#0A0A0A]">
                    {viewingDetailsShow.date} • {viewingDetailsShow.time || viewingDetailsShow.startTime || '09:00 AM - 05:00 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Full Description & Rules */}
            <div className="p-4 bg-white/80 border border-[#FDE047] rounded-2xl space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-[#713F12] font-black">Description & Event Rules</p>
              <p className="text-xs text-[#0A0A0A] leading-relaxed whitespace-pre-line font-medium">
                {viewingDetailsShow.description || 'Full tournament details and judging schedule available at venue check-in desk.'}
              </p>
            </div>

            {/* Registration Details & Instructions */}
            {(viewingDetailsShow.registrationDetails || viewingDetailsShow.registrationDeadline) && (
              <div className="p-4 bg-[#FEF08A]/90 border border-[#FDE047] rounded-2xl space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-[#713F12] font-black flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#CA8A04]" />
                  Registration Guidelines & Contact
                </p>
                <p className="text-xs text-[#0A0A0A] leading-relaxed whitespace-pre-line font-medium">
                  {viewingDetailsShow.registrationDetails || `Registration Deadline: ${viewingDetailsShow.registrationDeadline}`}
                </p>
              </div>
            )}

            {/* Categories & Prizes if present */}
            {viewingDetailsShow.categories && viewingDetailsShow.categories.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-[#713F12] font-black">Featured Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewingDetailsShow.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#FDE047] text-[#0A0A0A] text-[11px] font-bold"
                    >
                      🏆 {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons — strictly NO admin controls for visitors */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FDE047]">
              <button
                type="button"
                onClick={() => setViewingDetailsShow(null)}
                className="btn-secondary text-xs py-2.5 px-5 font-bold"
              >
                Close
              </button>

              {!isPastShow(viewingDetailsShow) && (
                <button
                  type="button"
                  onClick={() => {
                    const s = viewingDetailsShow;
                    setViewingDetailsShow(null);
                    setSelectedShow(s);
                    setIsRegisterShowOpen(true);
                  }}
                  className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Register for this Show
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogShowsView;
