import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '../services/authService';

interface LoginProps {
  onBack: () => void;
  onSuccess?: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

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
      
      if (onSuccess) {
        onSuccess(result.user);
      } else {
        onBack();
      }
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
      if (onSuccess) {
        onSuccess(result.user);
      } else {
        onBack();
      }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-50/50 dark:bg-orange-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[340px] relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2 font-medium text-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none p-4 md:p-5 border border-slate-100 dark:border-slate-800">
          {/* Security Icon Container */}
          <div className="flex justify-center mb-2">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center relative">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-3">
            <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Join Tour Help Desk'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
              {mode === 'login' && 'Continue your journey with us.'}
              {mode === 'signup' && 'Create an account to manage bookings.'}
              {mode === 'forgot' && 'Enter your registered email to receive a reset link.'}
            </p>
          </div>

          {/* Toggle Login/Signup */}
          {mode !== 'forgot' ? (
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3">
              <button 
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${mode === 'login' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${mode === 'signup' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-3 cursor-pointer"
            >
              ← Back to Sign In
            </button>
          )}

          {error && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-lg animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold rounded-lg animate-in slide-in-from-top-2">
              {successMessage}
            </div>
          )}

          <form className="space-y-2.5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 px-0.5">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 px-0.5">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 px-0.5">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 px-0.5">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white text-xs"
                  />
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all shadow-sm shadow-blue-600/25 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              {loading ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Social / Alternative Login (Only for login and signup modes) */}
          {mode !== 'forgot' && (
            <div className="mt-3">
              <div className="relative mb-2.5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500">or continue with</span>
                </div>
              </div>

              {/* Google Sign In via @react-oauth/google */}
              <div className="w-full flex justify-center mb-2">
                {socialLoading === 'google' ? (
                  <div className="w-full py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="animate-spin text-xs">🌀</span>
                    <span>Signing in with Google...</span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center overflow-hidden rounded-lg">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign-in failed. Please try again.')}
                      shape="rectangular"
                      size="medium"
                      theme="outline"
                      width="290"
                      text={mode === 'login' ? 'signin_with' : 'signup_with'}
                    />
                  </div>
                )}
              </div>

              {/* Secondary Social Buttons (Apple, Facebook) */}
              <div className="grid grid-cols-2 gap-1.5">
                {/* Apple */}
                <button 
                  type="button"
                  disabled={Boolean(socialLoading)}
                  onClick={() => handleUnsupportedSocial('Apple')}
                  className="flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-[11px] font-bold text-slate-700 dark:text-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-3 h-3 fill-slate-900 dark:fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-1 .04-2.19.67-2.88 1.47-.6.7-1.13 1.83-.98 2.95 1.12.09 2.22-.48 2.87-1.3"/>
                  </svg>
                  <span>Apple</span>
                </button>

                {/* Facebook */}
                <button 
                  type="button"
                  disabled={Boolean(socialLoading)}
                  onClick={() => handleUnsupportedSocial('Facebook')}
                  className="flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-[11px] font-bold text-slate-700 dark:text-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-3 h-3 text-[#1877F2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-tight">
              By continuing, you agree to Tour Help Desk's <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Terms</a> and <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Privacy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;