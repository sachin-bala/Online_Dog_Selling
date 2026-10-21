import React, { useState } from 'react';
import { X, UserCheck, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RegisterSellerModal: React.FC = () => {
  const { isRegisterSellerOpen, setIsRegisterSellerOpen, registerSeller, verifyEmailOtp, setActiveTab } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const [country] = useState('India');
  const [state] = useState('Tamil Nadu');
  const [city, setCity] = useState('Chennai');
  const [pincode] = useState('600035');

  const [govtIdNumber, setGovtIdNumber] = useState('AADHAAR-TN-981024-X');
  const [kennelName, setKennelName] = useState('Chennai Royal Companion Kennel');
  const [experienceYears, setExperienceYears] = useState(5);
  const website = 'https://chennaicanines.in';
  const [termsAgreed, setTermsAgreed] = useState(true);

  // OTP State
  const [otpInput, setOtpInput] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isRegisterSellerOpen) return null;

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!termsAgreed) {
      setErrorMsg('Please confirm that all information provided is true.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerSeller({
        fullName,
        email,
        mobile,
        govtIdNumber,
        address: { country, state, city, pincode },
        business: { kennelName, experienceYears, website }
      });
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit seller application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const verified = await verifyEmailOtp(otpInput);
      if (verified) {
        setIsRegisterSellerOpen(false);
        setStep(1);
        setActiveTab('seller');
      } else {
        setErrorMsg('Invalid OTP code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#FAFAFA] dark:bg-[#18181B] border-b border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A0A0A] dark:text-white font-heading">
                Verified Breeder Application
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Step {step} of 2 • {step === 1 ? 'Personal & Kennel Details' : 'Email OTP Verification'}
              </p>
            </div>
          </div>

          <button onClick={() => setIsRegisterSellerOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-5 text-xs">
              
              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#CA8A04] dark:text-[#FACC15] uppercase tracking-wider text-[11px]">
                  1. Breeder Identity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Raja Sundaram"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">Mobile Contact *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94431 88920"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="raja@rajapalayamkennel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Kennel & Facility */}
              <div className="space-y-3 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A]">
                <h4 className="font-bold text-[#CA8A04] dark:text-[#FACC15] uppercase tracking-wider text-[11px]">
                  2. Kennel & Facility Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">Kennel Business Name *</label>
                    <input
                      type="text"
                      required
                      value={kennelName}
                      onChange={(e) => setKennelName(e.target.value)}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">Govt / KCI ID *</label>
                    <input
                      type="text"
                      required
                      value={govtIdNumber}
                      onChange={(e) => setGovtIdNumber(e.target.value)}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A0A0A] dark:text-white font-bold mb-1">Years Experience</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#71717A] dark:text-[#A1A1AA]">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="rounded text-[#0A0A0A] dark:text-[#FACC15] focus:ring-[#FACC15] accent-[#FACC15]"
                  />
                  <span>I agree to KCI veterinary health audits and ethical breeding standards.</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterSellerOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs py-2.5 px-6"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Continue to Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: OTP */
            <form onSubmit={handleOtpVerify} className="space-y-4 text-xs text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-center mx-auto text-[#0A0A0A] dark:text-[#FACC15]">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#0A0A0A] dark:text-white text-base font-heading">
                Enter 6-Digit Email OTP
              </h4>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto">
                We've sent a 6-digit confirmation code to <strong>{email}</strong>. Enter it below to complete registration.
              </p>

              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-40 mx-auto text-center font-mono text-lg font-bold tracking-widest bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-2.5 text-[#0A0A0A] dark:text-white focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
              />

              <div className="pt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs px-6"
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Complete & Open Portal'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
