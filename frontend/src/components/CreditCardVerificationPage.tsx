import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock, Mail, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

interface CreditCardVerificationPageProps {
  onBack: () => void;
}

const CreditCardVerificationPage: React.FC<CreditCardVerificationPageProps> = ({ onBack }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 transition-colors duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-800/40 py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl transition-all mb-6 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Secure Travel Authentication
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Credit Card Verification</h1>
              <p className="text-blue-100 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                Learn why and how we verify payment details to keep your bookings and accounts completely secure.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
              <Lock className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">256-Bit SSL Secured</p>
                <p className="text-[11px] text-blue-200">Strict Fraud Prevention Protocol</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections with Images */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-10">

          {/* Card 1: Authorization Form & Photo ID */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/60">
                  <FileText className="w-3.5 h-3.5" />
                  Step 01 • Authorization & ID Verification
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Payment Authorization & Verification
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                  Due to high number of fraud transactions in the past, our fraud team may ask you
                  to fill up a payment authorization form and send it to us with the front and the
                  back copy of your card and a copy of your govt. issued photo ID .
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Signed Authorization Form
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Front & Back Card Copy
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Govt. Issued Photo ID
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
                  <Image
                    src="https://images.unsplash.com/photo-1537724326059-2ea20251b9c8?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Payment authorization form and photo ID verification"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
                    ID & Document Verification
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Card Masking & Safe Submission */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
                  <Image
                    src="https://images.unsplash.com/photo-1558655146-6c222b05fce4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Credit card photo and number masking guidance"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
                    Hide First 12 Digits For Security
                  </span>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-900/60">
                  <Lock className="w-3.5 h-3.5" />
                  Step 02 • Privacy & Masking Safety
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Card Masking & Easy Submission
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/25 border-l-4 border-blue-500 p-5 rounded-r-2xl">
                  <p className="text-blue-950 dark:text-blue-200 text-base md:text-lg leading-relaxed m-0 font-medium">
                    You can hide the first twelve digits on the card, click a picture and send it to
                    us on our customer care email Address:{' '}
                    <a 
                      href="mailto:care@TourHelpDesk.com" 
                      className="font-black text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 ml-1"
                    >
                      <Mail className="w-4 h-4 inline" />
                      care@TourHelpDesk.com
                    </a>
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tip: Keep only the last 4 digits and the cardholder&apos;s name visible. Never share your CVV / CVC code.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Third Party Payment & High-Risk Travel Policy */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider border border-amber-200/60 dark:border-amber-900/60">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Step 03 • Verification Criteria & Policies
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  When Is Verification Required?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                  We only ask you to provide the aforementioned documents if it is a Third party
                  payment (Credit card holder is not one of the passengers), If the travel is to a
                  high risk destination (A destination for which we have had more than 3 fraud
                  transactions in the past), if the card used is billed outside the USA or Canada
                  if the departure is within next 30 days.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">💳 Third-Party Payer</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Cardholder is not traveling as one of the passengers</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">🌍 High-Risk Destination</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Destinations with recorded fraud history</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">🌐 International Billing</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Cards billed outside of USA / Canada</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">⚡ Urgent Departures</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Flights departing within next 30 days</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
                  <Image
                    src="https://images.unsplash.com/photo-1758611974001-2e7ad7b83432?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="International travel and destination fraud protection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
                    Global Travel & Security Standards
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Document Destruction Assurance Box */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-blue-950/40 dark:to-indigo-950/40 border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="flex-grow space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Strict Privacy & Document Disposal Policy</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                Please be assured that all documents are destroyed once verified. We do not
                publish or distribute any personal information to anyone other than the supplier
                and airlines.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreditCardVerificationPage;
