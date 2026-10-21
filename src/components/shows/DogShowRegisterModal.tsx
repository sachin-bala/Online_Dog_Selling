import React, { useState } from 'react';
import { X, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import type { ShowParticipant } from '../../data/showsData';

export const DogShowRegisterModal: React.FC = () => {
  const { 
    isRegisterShowOpen, 
    setIsRegisterShowOpen, 
    selectedShow, 
    registerForDogShow, 
    currentUser,
  } = useApp();

  const [ownerName, setOwnerName] = useState(currentUser?.fullName || 'Dr. Anand Kumar');
  const [email, setEmail] = useState(currentUser?.email || 'anand@chennaicanines.in');
  const [phone, setPhone] = useState(currentUser?.mobile || '+91 98400 12345');
  const [dogName, setDogName] = useState('Veera Royal Rajapalayam');
  const [breed, setBreed] = useState('Rajapalayam');
  const [age] = useState('12 Weeks');
  const [gender] = useState('Male');
  const [category, setCategory] = useState(selectedShow?.categories[0] || 'Best in Show');
  const [photoUrl] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80');

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isRegisterShowOpen || !selectedShow) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newParticipant: ShowParticipant = {
      id: `part-${Date.now()}`,
      showId: selectedShow.id,
      ownerName,
      email,
      phone,
      dogName,
      breed,
      age,
      gender,
      category,
      status: 'Pending Approval',
      paymentStatus: 'Paid',
      registrationDate: new Date().toISOString().split('T')[0],
      photoUrl
    };

    registerForDogShow(newParticipant);
    setIsSuccess(true);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsRegisterShowOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#242424]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8DED3] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-[#FFF9F2] border-b border-[#E8DED3] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B3A29] text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 text-[#D89B5B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424]">KCI Dog Show Participant Registration</h3>
              <p className="text-xs text-[#6B7280] truncate max-w-xs">{selectedShow.eventName}</p>
            </div>
          </div>

          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-white text-[#6B7280] hover:text-[#242424] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-[#2E8B57]/15 rounded-full flex items-center justify-center mx-auto border border-[#2E8B57]/30">
              <CheckCircle2 className="w-10 h-10 text-[#2E8B57]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#242424]">Registration Confirmed! 🎉</h3>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                <span className="font-bold text-[#5B3A29]">{dogName}</span> has been entered in the <span className="font-bold text-[#2F7D68]">{category}</span> competition. Confirmation badge sent to {email}.
              </p>
            </div>

            <div className="p-4 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] text-left space-y-2 text-xs text-[#242424]">
              <div className="flex justify-between text-[#6B7280]">
                <span>Event Name:</span> <span className="font-bold text-[#242424]">{selectedShow.eventName}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Venue:</span> <span className="font-bold text-[#242424]">{selectedShow.venue} ({selectedShow.city})</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Fee Paid:</span> <span className="font-bold text-[#D89B5B]">₹{selectedShow.registrationFee.toLocaleString()} (UPI / QR Verified)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-xl bg-[#5B3A29] hover:bg-[#482E20] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Return to Championship Events
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            
            {/* Event Pill */}
            <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedShow.bannerImage || '/images/shows/kci-championship.jpg'}
                  alt={selectedShow.eventName}
                  className="w-14 h-14 rounded-xl object-cover border border-[#E8DED3]"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes('kci-championship.jpg')) {
                      img.src = '/images/shows/kci-championship.jpg';
                    }
                  }}
                />
                <div>
                  <h4 className="font-bold text-[#242424] text-xs">{selectedShow.eventName}</h4>
                  <p className="text-[11px] text-[#5B3A29] font-medium">{selectedShow.date} • Entry Fee: <strong className="text-[#D89B5B]">₹{selectedShow.registrationFee.toLocaleString()}</strong></p>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#242424] uppercase tracking-wider">Owner Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Owner Full Name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  className="bg-white border border-[#E8DED3] rounded-xl p-2.5 text-[#242424] placeholder-[#6B7280]/60 focus:outline-none focus:border-[#2F7D68] focus:ring-1 focus:ring-[#2F7D68]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border border-[#E8DED3] rounded-xl p-2.5 text-[#242424] placeholder-[#6B7280]/60 focus:outline-none focus:border-[#2F7D68] focus:ring-1 focus:ring-[#2F7D68]"
                />
                <input
                  type="text"
                  placeholder="Phone (+91)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-white border border-[#E8DED3] rounded-xl p-2.5 text-[#242424] placeholder-[#6B7280]/60 focus:outline-none focus:border-[#2F7D68] focus:ring-1 focus:ring-[#2F7D68]"
                />
              </div>
            </div>

            {/* Dog Specs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#242424] uppercase tracking-wider">Participant Dog Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Dog Name"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  required
                  className="bg-white border border-[#E8DED3] rounded-xl p-2.5 text-[#242424] placeholder-[#6B7280]/60 focus:outline-none focus:border-[#2F7D68] focus:ring-1 focus:ring-[#2F7D68]"
                />
                <input
                  type="text"
                  placeholder="Breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  required
                  className="bg-white border border-[#E8DED3] rounded-xl p-2.5 text-[#242424] placeholder-[#6B7280]/60 focus:outline-none focus:border-[#2F7D68] focus:ring-1 focus:ring-[#2F7D68]"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white border border-[#E8DED3] rounded-xl p-2.5 text-[#242424] focus:outline-none focus:border-[#2F7D68]"
                >
                  {selectedShow.categories.map((c, i) => (
                    <option key={i} value={c} className="bg-white text-[#242424]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fee & QR Payment Preview */}
            <div className="p-4 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#242424]">Registration Fee (₹{selectedShow.registrationFee.toLocaleString()})</div>
                <p className="text-[10px] text-[#6B7280]">Scan UPI QR Code or confirm instant payment</p>
              </div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=PawVerse-ShowFee-${selectedShow.id}`}
                alt="Payment QR"
                className="w-12 h-12 bg-white border border-[#E8DED3] p-1 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#5B3A29] hover:bg-[#482E20] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Pay ₹{selectedShow.registrationFee.toLocaleString()} & Confirm KCI Championship Entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
