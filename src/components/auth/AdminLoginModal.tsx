import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, Mail, User, AlertCircle, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin, registerAdmin, setActiveTab } = useApp();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (isRegisterMode) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        const success = await registerAdmin(fullName.trim(), cleanEmail, password, confirmPassword);
        if (success) {
          setIsAdminLoginOpen(false);
          setActiveTab('admin');
        }
      } else {
        const success = await loginAdmin(cleanEmail, password);
        if (success) {
          setIsAdminLoginOpen(false);
          setActiveTab('admin');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setErrorMsg('');
    setIsRegisterMode(prev => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121212] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#FAFAFA] dark:bg-[#18181B] border-b border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A0A0A] dark:text-white flex items-center gap-1.5 font-heading">
                <span>{isRegisterMode ? 'Create Admin Account' : 'Admin Studio Access'}</span>
                <span className="text-[10px] bg-[#FEF08A] dark:bg-[#FACC15]/15 text-[#713F12] dark:text-[#FACC15] border border-[#FDE047] dark:border-[#FACC15]/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {isRegisterMode ? 'Register' : 'Secure'}
                </span>
              </h3>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                {isRegisterMode ? 'Super Admin & Moderator Setup' : 'Administrator Session Verification'}
              </p>
            </div>
          </div>

          <button onClick={() => setIsAdminLoginOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isRegisterMode && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#0A0A0A] dark:text-white">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-[#71717A] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#0A0A0A] dark:text-white">Admin Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#0A0A0A] dark:text-white">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none transition-colors"
              />
              <Key className="w-4 h-4 text-[#71717A] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {isRegisterMode && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#0A0A0A] dark:text-white">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#F4F4F5] dark:bg-[#1C1C1E] border border-[#E4E4E7] dark:border-[#27272A] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#0A0A0A] dark:text-white placeholder-[#71717A] focus:outline-none transition-colors"
                />
                <Key className="w-4 h-4 text-[#71717A] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FACC15]/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>
              {isSubmitting
                ? isRegisterMode
                  ? 'Creating Account...'
                  : 'Authenticating...'
                : isRegisterMode
                ? 'Create Admin Account'
                : 'Login as Administrator'}
            </span>
          </button>

          {/* Quick Demo Autofill button */}
          {!isRegisterMode && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gmail.com');
                  setPassword('admin@123');
                }}
                className="text-[11px] font-bold text-[#CA8A04] dark:text-[#FACC15] hover:underline cursor-pointer"
              >
                Use Seeded Admin (admin@gmail.com / admin@123)
              </button>
            </div>
          )}

          {/* Mode Switch Toggle */}
          <div className="pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-[#FACC15] transition-colors font-medium cursor-pointer"
            >
              {isRegisterMode
                ? 'Already have an admin account? Back to Login'
                : "Don't have an admin account? Create Admin Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
