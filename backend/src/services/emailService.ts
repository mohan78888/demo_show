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

    const senderEmail = env.EMAIL_FROM || 'TourHelpDesk <onboarding@resend.dev>';
    const subject = 'Welcome to TourHelpDesk!';

    const textContent = `Hi ${firstName},

Welcome to TourHelpDesk! Thanks for joining us.

You can now search and book the cheapest flights, exclusive hotels, and tour packages with 24/7 dedicated support.

We look forward to helping you plan your next unforgettable adventure.

Happy travels!

Team TourHelpDesk.com`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TourHelpDesk!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <!-- Header with Official Logo -->
  <div style="background: #0f172a; padding: 28px 24px; text-align: center; border-radius: 16px 16px 0 0;">
    <img src="https://tourhelpdesk.com/tourhelpdesk.png" alt="TourHelpDesk Logo" style="max-height: 48px; width: auto; display: inline-block; margin-bottom: 8px;" onerror="this.style.display='none'" />
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">TourHelpDesk</h1>
    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; font-weight: 500;">Your Trusted Global Travel Partner</p>
  </div>

  <!-- Body Content -->
  <div style="background-color: #ffffff; padding: 36px 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Hi ${firstName},</h2>
    <p style="font-size: 14px; color: #475569;">Welcome to <strong>TourHelpDesk</strong>! We're thrilled to have you with us.</p>
    <p style="font-size: 14px; color: #475569;">You now have instant access to discounted flight fares, top-tier luxury hotels, and personalized travel bookings with our 24/7 concierge support.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://tourhelpdesk.com/flights" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.25);">Explore Flights</a>
    </div>

    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />

    <p style="margin-bottom: 4px; font-size: 14px; color: #64748b;">Happy travels,</p>
    <p style="margin-top: 0; font-weight: 800; color: #0f172a; font-size: 15px;">Team TourHelpDesk.com</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} TourHelpDesk.com. All rights reserved.</p>
    <p style="margin: 4px 0 0 0;">Need assistance? Contact us anytime at support@tourhelpdesk.com</p>
  </div>
</body>
</html>`;

    let emailFrom = senderEmail;
    // Attempt sending with configured email; fallback to onboarding@resend.dev if domain not yet verified
    let sendResult = await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject,
      text: textContent,
      html: htmlContent,
    });

    if (sendResult.error && sendResult.error.message?.includes('domain')) {
      logger.warn(`[EmailService] Retrying welcome email with resend sandbox domain: ${sendResult.error.message}`);
      sendResult = await resend.emails.send({
        from: 'TourHelpDesk <onboarding@resend.dev>',
        to: [email],
        subject,
        text: textContent,
        html: htmlContent,
      });
    }

    if (sendResult.error) {
      logger.error(`[EmailService] Failed to send welcome email to ${email}: ${JSON.stringify(sendResult.error)}`);
    } else {
      logger.info(`[EmailService] Welcome email sent successfully to ${email}. ID: ${sendResult.data?.id}`);
    }
  } catch (err: any) {
    logger.error(`[EmailService] Unexpected error sending welcome email to ${email}: ${err?.message || err}`);
  }
};

export const sendPasswordResetEmail = async ({
  email,
  firstName,
  resetUrl,
}: {
  email: string;
  firstName: string;
  resetUrl: string;
}): Promise<void> => {
  try {
    const resend = getResendInstance();
    if (!resend) {
      logger.warn(`[EmailService] Skipping password reset email for ${email} because RESEND_API_KEY is missing. Reset URL: ${resetUrl}`);
      return;
    }

    const senderEmail = env.EMAIL_FROM || 'TourHelpDesk <onboarding@resend.dev>';
    const subject = 'Password Reset Request - TourHelpDesk';

    const textContent = `Hi ${firstName},

You requested a password reset for your TourHelpDesk account.

Please use the following link to reset your password (valid for 15 minutes):
${resetUrl}

If you did not request this, please ignore this email.

Team TourHelpDesk.com`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <!-- Header with Official Logo -->
  <div style="background: #0f172a; padding: 28px 24px; text-align: center; border-radius: 16px 16px 0 0;">
    <img src="https://tourhelpdesk.com/tourhelpdesk.png" alt="TourHelpDesk Logo" style="max-height: 48px; width: auto; display: inline-block; margin-bottom: 8px;" onerror="this.style.display='none'" />
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">TourHelpDesk</h1>
    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; font-weight: 500;">Account Security & Recovery</p>
  </div>

  <!-- Body Content -->
  <div style="background-color: #ffffff; padding: 36px 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
    <p style="font-size: 14px; color: #475569;">Hi ${firstName},</p>
    <p style="font-size: 14px; color: #475569;">We received a request to reset the password for your TourHelpDesk account. Click the button below to choose a new password:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.25);">Reset My Password</a>
    </div>

    <p style="font-size: 12px; color: #64748b; background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      ⏱️ This link is cryptographically secured and will expire in <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email.
    </p>

    <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">Or copy and paste this link in your browser:<br/><a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a></p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} TourHelpDesk.com. All rights reserved.</p>
  </div>
</body>
</html>`;

    let sendResult = await resend.emails.send({
      from: senderEmail,
      to: [email],
      subject,
      text: textContent,
      html: htmlContent,
    });

    if (sendResult.error && sendResult.error.message?.includes('domain')) {
      logger.warn(`[EmailService] Retrying reset email with resend sandbox domain: ${sendResult.error.message}`);
      sendResult = await resend.emails.send({
        from: 'TourHelpDesk <onboarding@resend.dev>',
        to: [email],
        subject,
        text: textContent,
        html: htmlContent,
      });
    }

    if (sendResult.error) {
      logger.error(`[EmailService] Failed to send password reset email to ${email}: ${JSON.stringify(sendResult.error)}`);
    } else {
      logger.info(`[EmailService] Password reset email sent to ${email}. ID: ${sendResult.data?.id}`);
    }
  } catch (err: any) {
    logger.error(`[EmailService] Unexpected error sending reset email to ${email}: ${err?.message || err}`);
  }
};
