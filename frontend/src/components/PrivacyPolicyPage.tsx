import React from 'react';
import LegalPageLayout from './layout/LegalPageLayout';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <LegalPageLayout title="Privacy & Policy" onBack={onBack}>
      <div className="space-y-16">
        <section>
          <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg space-y-6">
            <p>
              Tour Help Desk Inc. ("Tour Help Desk Inc.", "Company," "Us" or "We") values your
              privacy and is dedicated to safeguarding it through our adherence to this
              policy. This Privacy Notice and Policy (hereafter the "Policy") outlines the
              types of information we may gather from you or that you may furnish when
              utilizing www.TourHelpDesk.com and the Company's mobile website, or any content,
              features, and services offered on or through TourHelpDesk.com, as well as our
              procedures for collecting, utilizing, maintaining, safeguarding, sharing, and
              divulging that information.
            </p>

            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">This Policy applies to information we gather:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>On this Website.</li>
              <li>In email, text, and other electronic messages between you and this Website.</li>
              <li>Through mobile and desktop applications you download from this Website.</li>
            </ul>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6">INFORMATION WE COLLECT ABOUT YOU AND HOW WE COLLECT IT</h2>
            
            <p>
              We gather various types of information from and about users of our Website,
              including:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Information through which you may be personally identified, such as name, residential address, postal address, email address, telephone number, credit card numbers or other payment details, or any other identifier by which you may be contacted online or offline ("personal information");</li>
              <li>Information about you that does not individually identify you;</li>
              <li>Details about your internet connection and IP address, the devices you use to access our Website, browser type and language, and access dates/times, referring website addresses, and other usage particulars;</li>
              <li>Categories of personal information specified in subdivision (e) of Section 1798.80 of the California Civil Code, such as name, physical description, address, telephone number, and medical or health insurance information;</li>
              <li>Characteristics of protected classifications under state or federal law, such as age, gender, marital status, medical condition, and disability information;</li>
              <li>Information you provide on our Website to facilitate travel arrangements for yourself or another person, including but not limited to, your username, password, location, zip/postal code, mailing address, email address, driver's license, passport or other government-issued identification numbers, date of birth, gender, arrival and departure details, airline, hotel, or car.</li>
            </ul>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
