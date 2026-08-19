import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants/config';

interface ContactUsPageProps {
  onBack: () => void;
}

const ContactUsPage: React.FC<ContactUsPageProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !message) {
      setStatus('Please fill in all fields before submitting.');
      return;
    }

    setStatus('Thanks! Your message has been sent. Our team will respond within 24 hours.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 lg:py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 sm:p-10 text-white flex flex-col justify-between gap-6 sm:gap-8">
              <div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-blue-200">Contact Us</span>
                <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl font-black leading-tight">Tour Help Desk Support</h1>
                <p className="mt-5 text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl">
                  Have a question about your booking, flight status, or travel plans? Send us a message and our travel specialists will get back to you quickly.
                </p>
              </div>
              <div className="space-y-4 text-sm text-blue-100">
                <p className="font-bold">Need faster support?</p>
                <p>Call Our Toll free 24/7: <a href={CONTACT_INFO.HOTLINE_TEL} className="font-black hover:underline">{CONTACT_INFO.HOTLINE_DISPLAY}</a></p>
                <p>Email us at <a href="mailto:care@tourhelpdesk.com" className="underline">care@tourhelpdesk.com</a></p>
                <div className="pt-4 mt-2 border-t border-blue-400/30">
                  <p className="font-bold mb-1 text-white">Company Address:</p>
                  <p>Tour Help Desk inc.</p>
                  <p>7952, Graham Ave,</p>
                  <p>Burnaby, BC, V3N1V9 Canada</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3">Send a message</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl">We’re here to help with booking support, travel advice, and account questions.</p>
              </div>

              {status && (
                <div className="mb-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 p-4 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-4 text-sm outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 text-slate-900 dark:text-white"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-4 text-sm outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 text-slate-900 dark:text-white"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help"
                    rows={4}
                    className="mt-2 w-full rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-4 text-sm outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 text-slate-900 dark:text-white"
                  />
                </label>

                <button type="submit" className="w-full rounded-3xl bg-blue-600 dark:bg-blue-500 text-white font-black py-4 text-sm uppercase tracking-[0.12em] hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 dark:shadow-none">
                  Submit Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
