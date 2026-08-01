import React from 'react';

interface CreditCardVerificationPageProps {
  onBack: () => void;
}

const CreditCardVerificationPage: React.FC<CreditCardVerificationPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-16 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 font-bold text-xs uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Credit Card Verification</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-16">
          <section>
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg space-y-6">
              <p>
                Due to high number of fraud transactions in the past, our fraud team may ask you
                to fill up a payment authorization form and send it to us with the front and the
                back copy of your card and a copy of your govt. issued photo ID .
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-2xl my-8">
                <p className="text-blue-900 dark:text-blue-200 m-0">
                  You can hide the first twelve digits on the card, click a picture and send it to
                  us on our customer care email Address:{' '}
                  <a href="mailto:care@TourHelpDesk.com" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    care@TourHelpDesk.com
                  </a>
                </p>
              </div>

              <p>
                We only ask you to provide the aforementioned documents if it is a Third party
                payment (Credit card holder is not one of the passengers), If the travel is to a
                high risk destination (A destination for which we have had more than 3 fraud
                transactions in the past), if the card used is billed outside the USA or Canada
                if the departure is within next 30 days.
              </p>

              <p className="font-medium text-slate-800 dark:text-slate-200 mt-8">
                Please be assured that all documents are destroyed once verified. We do not
                publish or distribute any personal information to anyone other than the supplier
                and airlines.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreditCardVerificationPage;
