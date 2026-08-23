"use client";

import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const res = await authService.forgotPassword(email);
        setSuccessMessage(res.message || 'Password reset link has been sent to your email.');
        return;
      }

      let result;
      if (mode === 'signup') {
        result = await authService.signup({ firstName, lastName, email, password });
      } else {
        result = await authService.login({ email, password });
      }

      onSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Failed to obtain Google ID token.');
      return;
    }
    setError('');
    setSocialLoading('google');

    try {
      const result = await authService.loginWithGoogle(credentialResponse.credential);
      onSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleUnsupportedSocial = (provider: string) => {
    setError(`${provider} login is coming soon. Please use Google or email/password for now.`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 md:p-9 animate-in zoom-in-95 duration-200">
        
        {/* Close X Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Security Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-600/10 rounded-2xl animate-pulse"></div>
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Welcome back'}
            {mode === 'signup' && 'Create an Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs sm:text-sm font-medium">
            {mode === 'login' && 'Sign in to access your travel bookings.'}
            {mode === 'signup' && 'Join Tour Help Desk for exclusive flight & hotel deals.'}
            {mode === 'forgot' && 'Enter your registered email to receive a reset link.'}
          </p>
        </div>

        {/* Login / Sign Up Toggle */}
        {mode !== 'forgot' ? (
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button 
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mb-6 cursor-pointer"
          >
            ← Back to Sign In
          </button>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 px-1">First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 px-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 px-1">Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 px-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* OR Divider */}
        {mode !== 'forgot' && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-extrabold tracking-widest">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">or continue with</span>
              </div>
            </div>

            {/* Social Auth Section */}
            <div className="flex flex-col gap-2.5">
              {/* Google Official OAuth Button */}
              <div className="w-full flex justify-center min-h-[40px] items-center">
                {socialLoading === 'google' ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 px-4 w-full border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="animate-spin text-sm">🌀</span>
                    <span>Signing in with Google...</span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center overflow-hidden rounded-xl">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign-in failed. Please try again.')}
                      shape="rectangular"
                      size="large"
                      theme="outline"
                      width="340"
                      text={mode === 'login' ? 'signin_with' : 'signup_with'}
                    />
                  </div>
                )}
              </div>

            {/* Secondary Social Buttons (Apple, Facebook) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Apple Button */}
              <button
                type="button"
                disabled={Boolean(socialLoading)}
                onClick={() => handleUnsupportedSocial('Apple')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-95 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-50"
              >
                {socialLoading === 'apple' ? (
                  <span className="animate-spin text-xs">🌀</span>
                ) : (
                  <svg className="w-4 h-4 fill-slate-900 dark:fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-1 .04-2.19.67-2.88 1.47-.6.7-1.13 1.83-.98 2.95 1.12.09 2.22-.48 2.87-1.3"/>
                  </svg>
                )}
                <span>Apple</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                disabled={Boolean(socialLoading)}
                onClick={() => handleUnsupportedSocial('Facebook')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-95 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-50"
              >
                {socialLoading === 'facebook' ? (
                  <span className="animate-spin text-xs">🌀</span>
                ) : (
                  <svg className="w-4 h-4 text-[#1877F2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </>
      )}

      </div>
    </div>
  );
};

export default AuthModal;
