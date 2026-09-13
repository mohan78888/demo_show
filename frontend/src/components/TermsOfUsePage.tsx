import React from 'react';
import LegalPageLayout from './layout/LegalPageLayout';

interface TermsOfUsePageProps {
  onBack: () => void;
}

const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onBack }) => {
  return (
    <LegalPageLayout title="Terms of Use" onBack={onBack}>
      <div className="space-y-16">
        <section>
          <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg space-y-6">
            <p>
              Welcome to www.TourHelpDesk.com your online travel advisor (Tour Help Desk
              Inc.). www.TourHelpDesk.com is owned and operated by Tour Help Desk Inc. (the
              'Company', "We", "our", or "Us"). Please read carefully the following terms and
              conditions (the "Terms", or "Terms of Use"), because they constitute a binding
              agreement between you and the Company. By accessing Last min-flights or by using
              it in any other manner, you signify your acceptance to these Terms. If you do
              not agree to these Terms of Use, you may not access Tour Help Desk or use it in
              any other manner. Please feel free to submit any questions that you may have
              regarding the Terms to info@TourHelpDesk.com
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6">Description of the Services</h2>
            
            <p>
              Tour Help Desk offers you information about holiday destinations based on your
              personal preferences, such as nightlife, dining, nature and outdoors, sports,
              shopping, languages, climate, time of year, holiday duration, budget, port of
              departure, etc. (the "Services"). We aggregate information on holiday
              destinations from a variety of resources and rank it using our proprietary
              algorithm. Tour Help Desk strives to compound an up-to-date collection of travel
              warnings issued by government agencies and other official institutions. However,
              this information may not be complete. It is therefore recommended to consult the
              relevant government agency in your country of residence (Foreign Ministry,
              Embassy, etc.) prior to your departure.
            </p>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6">Acceptable use of Tour Help Desk</h2>
            
            <p>
              The following Terms define the acceptable use of Tour Help Desk Inc. You may use
              Tour Helpdesk for private and personal purposes only. You agree not to use Tour
              Help Desk for any other purpose without our prior explicit written consent, and
              while using Tour Help Desk you agree to refrain from willfully, or carelessly -
            </p>
            
            <ol className="list-decimal pl-6 space-y-2">
              <li>Interfering with or disrupting the functionality of Tour Help Desk;</li>
              <li>Disobey or breach these Terms or any other applicable instructions conveyed by the Company and its officers;</li>
              <li>Using robots, crawlers and similar applications to collect and compile content from Tour Help Desk;</li>
              <li>Displaying Tour Help Desk or any part thereof in an exposed or concealed frame;</li>
              <li>Violating any applicable local, state, national or international law, statute, ordinance, rule or regulation;</li>
              <li>Impersonating any person or entity, or making any false statement pertaining to your identity, employment, agency or affiliation with any person or entity;</li>
              <li>Linking to certain elements on Tour Help Desk independently from the web pages on which they originally appear.</li>
            </ol>

            <p>
              Registration Tour Help Desk serves all Internet users. However, certain Services, such as
              saving and sharing results with your friends, are available to registered users
              only. When you register with Tour Help Desk We will ask you to provide personal
              details such as your age, gender and e-mail address. You must submit only true,
              accurate and complete details. False or incorrect details may prevent your
              registration and impair our ability to provide you with Services and contact
              you. We will explicitly indicate the fields for mandatory completion. If you do
              not enter the requisite data in these fields, you will be unable to register
              with Tour Help Desk. By submitting the registration form, you represent and
              warrant that the details you provide adhere to these Terms. To login, you must
              use your personal username and password. We may establish and require from time
              to time additional or different means of identification for logging in and
              accessing certain Services. Please maintain your username and password in
              absolute confidentiality and refrain form disclosing them to others. Make sure
              you change your password frequently and at least once every six months. You are
              responsible for any actions taken through your account.
            </p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfUsePage;
