import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Truck, Award, Smartphone, Landmark, Clock, User, Phone, MapPin, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, checkoutDog, placeOrder, setActiveTab, currentUser } = useApp();
  
  // Buyer Details Form State
  const [buyerName, setBuyerName] = useState(currentUser?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.mobile || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [buyerAddress, setBuyerAddress] = useState('123 Royal Pet Villa, Anna Nagar, Chennai, Tamil Nadu');
  
  // Payment & Delivery State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeVetDelivery, setIncludeVetDelivery] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCheckoutOpen || !checkoutDog) return null;

  const basePrice = checkoutDog.price;
  const vetDeliveryFee = includeVetDelivery ? 1500 : 0;
  const insuranceFee = includeInsurance ? 500 : 0;
  const totalPrice = basePrice + vetDeliveryFee + insuranceFee;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const methodLabel = paymentMethod === 'upi' ? `UPI (${upiId || 'GPay/PhonePe'})` : paymentMethod.toUpperCase();
      
      await placeOrder(checkoutDog, methodLabel, {
        fullName: buyerName || currentUser?.fullName || 'VIP Buyer',
        phone: buyerPhone || currentUser?.mobile || '+91 98400 12345',
        email: buyerEmail || currentUser?.email || 'buyer@pawverse.ai',
        address: buyerAddress || '123 Royal Pet Villa, Chennai',
      });

      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        console.log('Confetti triggered');
      }
    } catch (err) {
      console.warn('Checkout error:', err);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#242424]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8DED3] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DED3] flex items-center justify-between bg-[#FFF9F2]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B3A29] text-white flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#5B3A29]">Direct Dog Purchase & Adoption</h3>
              <p className="text-xs text-[#6B7280] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D68]" /> KCI Verified • Direct Admin Approval Routing
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose} 
            className="p-2 rounded-xl bg-white border border-[#E8DED3] text-[#5B3A29] hover:bg-[#FFF9F2] transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-6 overflow-y-auto bg-white">
            <div className="w-20 h-20 bg-[#2F7D68]/15 rounded-full flex items-center justify-center mx-auto border-2 border-[#2F7D68]/40 animate-bounce">
              <Clock className="w-10 h-10 text-[#2F7D68]" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#D89B5B]/20 text-[#5B3A29] border border-[#D89B5B]/30 text-xs font-bold uppercase tracking-wider">
                Order Sent to Admin for Approval ⏳
              </span>
              <h3 className="text-2xl font-black text-[#5B3A29]">Purchase Request Registered!</h3>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed font-normal">
                Your adoption and purchase details for <span className="font-bold text-[#5B3A29]">{checkoutDog.name}</span> have been sent to the PawVerse Admin. Admin will review the DNA certificate, verify delivery route, and approve dispatch.
              </p>
            </div>

            {/* Order & Dog Summary Card */}
            <div className="p-5 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-[#E8DED3] pb-2">
                <span className="text-[#6B7280] font-medium">Companion Dog:</span>
                <span className="font-bold text-[#242424]">{checkoutDog.name} ({checkoutDog.breed})</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E8DED3] pb-2">
                <span className="text-[#6B7280] font-medium">Buyer Name:</span>
                <span className="font-medium text-[#242424]">{buyerName || 'VIP Buyer'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E8DED3] pb-2">
                <span className="text-[#6B7280] font-medium">Contact Phone:</span>
                <span className="font-mono text-[#242424]">{buyerPhone || '+91 98400 12345'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E8DED3] pb-2">
                <span className="text-[#6B7280] font-medium">Delivery Address:</span>
                <span className="font-medium text-[#242424] text-right max-w-[300px] truncate">{buyerAddress}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#242424] font-bold">Total Amount Authorized:</span>
                <span className="font-black text-[#D89B5B] text-base">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Approval & Dispatch Pipeline Tracker */}
            <div className="p-5 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] text-left space-y-3">
              <h4 className="text-xs font-bold text-[#5B3A29] uppercase tracking-wider">Dispatch Progress Pipeline</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-[#2F7D68] font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2F7D68]" />
                  <span>Step 1: Order Submitted & Payment Verified</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#5B3A29] font-bold bg-[#D89B5B]/15 p-2.5 rounded-xl border border-[#D89B5B]/30">
                  <Clock className="w-4 h-4 shrink-0 animate-spin text-[#D89B5B]" style={{ animationDuration: '3s' }} />
                  <span>Step 2: Admin Lineage & Health Verification (In Review)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#6B7280]">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Step 3: Veterinary Escorted AC Vehicle Dispatch (Post-Approval)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#6B7280]">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Step 4: Doorstep Delivery & Physical Passport Handover</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleClose();
                setActiveTab('customer');
              }}
              className="btn-primary w-full py-3.5"
            >
              Track Order in Pet Hub (Awaiting Admin Approval)
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayNow} className="p-6 overflow-y-auto space-y-5 bg-white">
            {/* Dog Summary Pill */}
            <div className="flex items-center space-x-4 p-4 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3]">
              <img src={checkoutDog.images[0]} alt={checkoutDog.name} className="w-16 h-16 rounded-xl object-cover border border-[#E8DED3]" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#5B3A29] truncate">{checkoutDog.name}</h4>
                <p className="text-xs text-[#6B7280]">{checkoutDog.breed} • {checkoutDog.location}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-[10px] bg-[#2F7D68]/10 text-[#2F7D68] border border-[#2F7D68]/20 px-2 py-0.5 rounded-md font-bold">
                    KCI DNA Certified
                  </span>
                  <span className="text-[10px] bg-[#D89B5B]/15 text-[#5B3A29] border border-[#D89B5B]/30 px-2 py-0.5 rounded-md font-bold">
                    Microchip: {checkoutDog.health?.microchipId || '98514100'}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-black text-[#D89B5B]">₹{checkoutDog.price.toLocaleString()}</div>
                <div className="text-[10px] text-[#6B7280] line-through">₹{(checkoutDog.price * 1.15).toLocaleString()}</div>
              </div>
            </div>

            {/* Buyer Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#5B3A29] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#D89B5B]" /> Buyer Contact & Delivery Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-[#242424] mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-white border border-[#E8DED3] focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/20 rounded-xl py-2 pl-8 pr-3 text-[#242424] placeholder-[#6B7280] focus:outline-none transition-all font-normal"
                    />
                    <User className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#242424] mb-1">Mobile Number (For GPS Updates) *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+91 98400 12345"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-white border border-[#E8DED3] focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/20 rounded-xl py-2 pl-8 pr-3 text-[#242424] placeholder-[#6B7280] focus:outline-none transition-all font-normal"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-[#242424] mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="buyer@pawverse.ai"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-white border border-[#E8DED3] focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/20 rounded-xl py-2 pl-8 pr-3 text-[#242424] placeholder-[#6B7280] focus:outline-none transition-all font-normal"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#242424] mb-1">Delivery Address & City *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Street, City, State, Pincode"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full bg-white border border-[#E8DED3] focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/20 rounded-xl py-2 pl-8 pr-3 text-[#242424] placeholder-[#6B7280] focus:outline-none transition-all font-normal"
                    />
                    <MapPin className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Add-ons */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#5B3A29] uppercase tracking-wider">Premium Transport & Health Add-ons</h4>
              
              <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5B3A29] text-white flex items-center justify-center font-bold shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#242424]">Veterinary Escort & AC Live GPS Transport</div>
                    <div className="text-[10px] text-[#6B7280]">Climate-controlled van with vet assistant</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#2F7D68]">+₹1,500</span>
                  <input
                    type="checkbox"
                    checked={includeVetDelivery}
                    onChange={(e) => setIncludeVetDelivery(e.target.checked)}
                    className="accent-[#2F7D68] h-4 w-4 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2F7D68] text-white flex items-center justify-center font-bold shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#242424]">1-Year Health Guarantee & Insurance</div>
                    <div className="text-[10px] text-[#6B7280]">Covers genetic health checks & emergency vet care</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#2F7D68]">+₹500</span>
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="accent-[#2F7D68] h-4 w-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#5B3A29] uppercase tracking-wider">Select Payment Gateway</h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                    paymentMethod === 'upi' 
                      ? 'bg-[#2F7D68]/10 border-[#2F7D68] text-[#5B3A29] ring-2 ring-[#2F7D68]/30 shadow-xs' 
                      : 'bg-white border-[#E8DED3] text-[#6B7280] hover:border-[#D89B5B]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#2F7D68]" />
                  <div>
                    <div className="text-xs font-bold text-[#242424]">UPI / QR Code</div>
                    <div className="text-[10px] text-[#6B7280]">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                    paymentMethod === 'razorpay' 
                      ? 'bg-[#2F7D68]/10 border-[#2F7D68] text-[#5B3A29] ring-2 ring-[#2F7D68]/30 shadow-xs' 
                      : 'bg-white border-[#E8DED3] text-[#6B7280] hover:border-[#D89B5B]'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-[#2F7D68]" />
                  <div>
                    <div className="text-xs font-bold text-[#242424]">Razorpay Gate</div>
                    <div className="text-[10px] text-[#6B7280]">Net Banking / Cards</div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] space-y-2 animate-in fade-in">
                  <label className="block text-xs font-medium text-[#242424]">Enter UPI ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="name@okaxis / mobile@ybl"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-[#E8DED3] rounded-xl py-2 px-3 text-xs text-[#242424] placeholder-[#6B7280] focus:outline-none focus:border-[#2F7D68]"
                  />
                </div>
              )}
            </div>

            {/* Total Summary & Order Trigger */}
            <div className="p-4 bg-[#FFF9F2] rounded-2xl border border-[#E8DED3] space-y-2">
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Puppy Base Price:</span>
                <span className="font-bold text-[#242424]">₹{basePrice.toLocaleString()}</span>
              </div>
              {includeVetDelivery && (
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>Vet Escort Delivery:</span>
                  <span className="text-[#2F7D68] font-bold">+₹1,500</span>
                </div>
              )}
              {includeInsurance && (
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>Health Guarantee Insurance:</span>
                  <span className="text-[#2F7D68] font-bold">+₹500</span>
                </div>
              )}
              <div className="border-t border-[#E8DED3] pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-[#242424]">Total Amount Due:</span>
                <span className="text-2xl font-black text-[#D89B5B]">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary w-full py-4 text-sm uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-white" />
              <span>{isProcessing ? 'Submitting to Admin...' : `Buy Now (₹${totalPrice.toLocaleString()}) & Send for Admin Approval`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
