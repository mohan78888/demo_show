import React from 'react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
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
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">About Us</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-16">
          <section>
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg space-y-6">
              <p>
                At <span className="font-bold text-slate-800 dark:text-slate-200">TourHelpDesk.com</span>, our goal is to provide travelers with the most 
                personalized, comprehensive and easy-to-use online research tool. Our philosophy 
                is different from traditional travel websites because we do not ask users to 
                search through mountains of data to find their preferred travel information. In 
                fact, we've turned the process on its head. We ask users for their travel 
                preferences, then, in a matter of seconds, provide unique, unbiased information 
                for the Best Destinations, Cruise, Hotels, Flights, Car Rental, Activities and 
                much more.
              </p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6">How We Do It - We research, you travel</h2>
              
              <p>
                Today, even the savviest Internet surfers could spend hours, days or weeks 
                figuring out exactly where they want to travel, how to get there and what to do 
                once they finally arrive. That's because the best information is spread out over 
                thousands of sites all over the web.
              </p>

              <p>
                TourHelpDesk.com has spent years perfecting search technology that scours the 
                web for the most relevant, current and highest quality travel information. To 
                date, we've aggregated over 26 million points of data from sources that include: 
                traveler reviews, expert blogs and websites. But Tour Help Desk Inc. is much 
                more than research and aggregation.
              </p>

              <p>
                What sets Tour Help Desk Inc. apart is our ability to analyze, match and 
                reassemble that data quickly and precisely, so that our visitors only get the 
                information that's valuable for them. We are able to do this because our experts 
                have developed cutting-edge artificial intelligence technology. This technology 
                analyzes the preferences a visitor selects and gives unbiased recommendations 
                for a personalized vacation, including the most appropriate destinations, 
                activities, flights, hotels and more!
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-8 mt-10">
                <p className="text-blue-900 dark:text-blue-200 font-medium text-xl leading-relaxed m-0 text-center">
                  By eliminating the frustrating search process, we are able to save our users the 
                  hours, days or weeks that it takes to search for a perfect personalized 
                  vacation. At TourHelpDesk.com, we do the research. You do the traveling!
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
