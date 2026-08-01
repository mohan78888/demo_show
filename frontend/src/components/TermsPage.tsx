import React from 'react';
import LegalPageLayout from './layout/LegalPageLayout';

interface TermsPageProps {
  onBack: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <LegalPageLayout title="Legal & Privacy" onBack={onBack}>
      <div className="space-y-16">
          {/* Section: Booking Terms */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Booking Terms & Conditions</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
              <p>By using Tour Help Desk, you agree to comply with and be bound by the following terms. All flight bookings are subject to the terms and conditions of the respective airlines.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Passengers must provide valid identification at the time of check-in as per airline regulations.</li>
                <li>Ticket prices include applicable taxes and surcharges unless otherwise stated.</li>
                <li>Tour Help Desk acts as an intermediary; we are not responsible for airline schedule changes, cancellations, or service quality.</li>
              </ul>
            </div>
          </section>

          {/* Section: Unofficial Cheapest Price */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] p-10 border border-blue-100 dark:border-blue-900/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-blue-900 dark:text-blue-100">2. Unofficial Cheapest Price Policy</h2>
            </div>
            <div className="text-blue-800 dark:text-blue-200 leading-relaxed space-y-4 font-medium">
              <p>At Tour Help Desk, we offer access to exclusive offline inventory through our direct corporate travel desks. These are branded as "Unofficial Cheapest Prices."</p>
              <div className="bg-white/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-blue-200 dark:border-blue-900/40">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">How it works:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li><span className="font-bold">Exclusive Sourcing:</span> These fares are negotiated in bulk or sourced from non-public corporate GDS channels.</li>
                  <li><span className="font-bold">Hotline Only:</span> Due to technical and contractual limitations, these specific fares cannot be booked directly through our website and require verification via our 24/7 hotline at <span className="text-blue-600 dark:text-blue-400 font-black underline">1888 791 8007</span>.</li>
                  <li><span className="font-bold">Real-time Availability:</span> Offline prices are highly dynamic and subject to immediate verification during the call.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Privacy Policy */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. Privacy & Data Protection</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
              <p>We value your privacy. We collect personal data such as your name, contact information, and travel preferences to facilitate bookings and improve your experience.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-bold text-slate-800 dark:text-slate-200">Data Security:</span> All transactions are protected using industry-standard 256-bit SSL encryption.</li>
                <li><span className="font-bold text-slate-800 dark:text-slate-200">Sharing Information:</span> We only share your details with airlines and service partners necessary for your itinerary.</li>
                <li><span className="font-bold text-slate-800 dark:text-slate-200">Cookies:</span> We use cookies to remember your preferences and provide personalized offers.</li>
              </ul>
            </div>
          </section>

          {/* Section: Refunds */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. Cancellation & Refund Policy</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
              <p>Cancellation policies vary significantly between airlines and ticket classes. We encourage all users to check the specific fare rules displayed on the "Flight Details" page before confirming a booking.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Standard Refund</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Processed within 7-10 working days to the original payment method.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Instant Refund</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Opt for Tour Help Desk Wallet for immediate credit after cancellation.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Closing */}
        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 text-center transition-colors">
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Questions about our terms? Contact our Legal Desk at <span className="text-blue-600 dark:text-blue-400 font-bold">legal@tourhelpdesk.com</span></p>
        </div>
    </LegalPageLayout>
  );
};

export default TermsPage;