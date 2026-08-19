import { Resend } from 'resend';
import env from '../config/env.js';
import logger from '../config/logger.js';

interface WelcomeEmailParams {
  email: string;
  firstName: string;
}

const getResendInstance = (): Resend | null => {
  if (!env.RESEND_API_KEY) {
    logger.warn('[EmailService] RESEND_API_KEY is not defined in environment variables.');
    return null;
  }
  return new Resend(env.RESEND_API_KEY);
};

export const sendWelcomeEmail = async ({ email, firstName }: WelcomeEmailParams): Promise<void> => {
  try {
    const resend = getResendInstance();
    if (!resend) {
      logger.warn(`[EmailService] Skipping welcome email for ${email} because RESEND_API_KEY is missing.`);
      return;
    }

    const senderEmail = env.EMAIL_FROM;
    const subject = 'Welcome to TourHelpDesk!';

    const textContent = `Hi ${firstName},

Welcome to TourHelpDesk! Thanks for subscribing.

You'll now receive exclusive travel deals, destination inspiration, travel tips, and special offers delivered straight to your inbox.

We look forward to helping you plan your next adventure.

Happy travels!

Team
TourHelpDesk.com`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to TourHelpDesk!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">TourHelpDesk</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #0f172a; margin-top: 0;">Hi ${firstName},</h2>
    <p>Welcome to <strong>TourHelpDesk</strong>! Thanks for subscribing.</p>
    <p>You'll now receive exclusive travel deals, destination inspiration, travel tips, and special offers delivered straight to your inbox.</p>
    <p>We look forward to helping you plan your next adventure.</p>
    <p style="margin-top: 30px; margin-bottom: 0;">Happy travels!</p>
    <p style="margin-top: 5px; font-weight: bold; color: #0f172a;">Team TourHelpDesk.com</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
    <p>&copy; ${new Date().getFullYear()} TourHelpDesk.com. All rights reserved.</p>
  </div>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [email],
      subject,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      logger.error(`[EmailService] Failed to send welcome email to ${email}: ${JSON.stringify(error)}`);
    } else {
      logger.info(`[EmailService] Welcome email sent successfully to ${email}. ID: ${data?.id}`);
    }
  } catch (err: any) {
    logger.error(`[EmailService] Unexpected error sending welcome email to ${email}: ${err?.message || err}`);
  }
};
