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
  <div style="background: #0f172a; padding: 20px 16px; text-align: center; border-radius: 16px 16px 0 0;">
    <img src="https://tourhelpdesk.com/tourhelpdesk-ts.png" alt="TourHelpDesk Logo" width="34" height="31" style="width: 34px; max-width: 34px; height: auto; display: inline-block; margin-bottom: 6px; border: 0;" onerror="this.style.display='none'" />
    <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">TourHelpDesk</h1>
    <p style="color: #94a3b8; margin: 2px 0 0 0; font-size: 11px; font-weight: 500;">Your Trusted Global Travel Partner</p>
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
  <div style="background: #0f172a; padding: 20px 16px; text-align: center; border-radius: 16px 16px 0 0;">
    <img src="https://tourhelpdesk.com/tourhelpdesk-ts.png" alt="TourHelpDesk Logo" width="34" height="31" style="width: 34px; max-width: 34px; height: auto; display: inline-block; margin-bottom: 6px; border: 0;" onerror="this.style.display='none'" />
    <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">TourHelpDesk</h1>
    <p style="color: #94a3b8; margin: 2px 0 0 0; font-size: 11px; font-weight: 500;">Account Security & Recovery</p>
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

export interface FlightBookingEmailData {
  requestId: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
  flight: {
    airline: string;
    flightNumber?: string;
    origin: string;
    destination: string;
    departureTime?: string;
    arrivalTime?: string;
    travelDate: string;
    returnDate?: string;
    travelClass?: string;
    price?: number;
    currency?: string;
    stops?: number;
  };
  passengers: Array<{
    paxType: string;
    title: string;
    firstName: string;
    lastName: string;
    gender: string;
    age?: number;
    dob?: string;
    passportNumber?: string;
    nationality?: string;
  }>;
  remarks?: string;
  createdAt?: Date | string;
}

export const sendFlightBookingCustomerEmail = async (data: FlightBookingEmailData): Promise<void> => {
  try {
    const resend = getResendInstance();
    if (!resend) {
      logger.warn(`[EmailService] Skipping customer booking email for ${data.customer.email} (RESEND_API_KEY missing).`);
      return;
    }

    const senderEmail = env.EMAIL_FROM || 'TourHelpDesk <onboarding@resend.dev>';
    const subject = `Your Flight Booking Request Has Been Received - ${data.requestId}`;

    const passengerNames = data.passengers.map(p => `${p.title} ${p.firstName} ${p.lastName} (${p.paxType})`).join(', ');

    const textContent = `Hi ${data.customer.name},

Thank you for choosing TourHelpDesk! We have received your flight booking request.

IMPORTANT NOTICE:
This is a booking request, not an issued e-ticket. Our dedicated travel desk is reviewing the best live fares and availability, and will contact you shortly via phone or email to confirm your itinerary and finalize payment.

BOOKING REQUEST SUMMARY:
- Request ID: ${data.requestId}
- Route: ${data.flight.origin} -> ${data.flight.destination}
- Airline: ${data.flight.airline} ${data.flight.flightNumber || ''}
- Travel Date: ${data.flight.travelDate} ${data.flight.departureTime ? `at ${data.flight.departureTime}` : ''}
- Class: ${data.flight.travelClass || 'Economy'}
- Passengers (${data.passengers.length}): ${passengerNames}
${data.flight.price ? `- Estimated Fare: ${data.flight.currency || 'INR'} ${data.flight.price.toLocaleString()}` : ''}

Need immediate assistance?
Call our 24/7 Booking Desk at +1 (888) 791-8007 or reply to this email.

Best regards,
Team TourHelpDesk.com`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flight Booking Request Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: #0f172a; padding: 24px 20px; text-align: center; border-radius: 16px 16px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">TourHelpDesk</h1>
    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; font-weight: 500;">Flight Booking Request Confirmation</p>
  </div>

  <div style="background-color: #ffffff; padding: 32px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <h2 style="color: #065f46; margin: 0 0 4px 0; font-size: 16px; font-weight: 700;">✅ Request Received Successfully</h2>
      <p style="color: #047857; margin: 0; font-size: 13px;">Request Reference ID: <strong style="font-family: monospace; font-size: 14px;">${data.requestId}</strong></p>
    </div>

    <p style="font-size: 14px; color: #334155; margin-top: 0;">Hi <strong>${data.customer.name}</strong>,</p>
    <p style="font-size: 14px; color: #334155;">We have received your flight booking request. Our travel concierge team is currently processing your request to secure the lowest unpublished fare and seat allocation.</p>

    <!-- Important Notice Box -->
    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600;">
        ⚠️ Please note: This is a booking request, not an issued e-ticket. Our travel specialist will contact you via phone (<a href="tel:${data.customer.mobile}" style="color: #92400e;">${data.customer.mobile}</a>) or email to confirm final details and secure payment.
      </p>
    </div>

    <!-- Flight Details Table -->
    <h3 style="color: #0f172a; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">Flight Summary</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 35%;">Route</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${data.flight.origin} &rarr; ${data.flight.destination}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Airline</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.flight.airline} ${data.flight.flightNumber || ''}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Travel Date</td>
        <td style="padding: 8px 0; color: #0f172a;">${data.flight.travelDate} ${data.flight.departureTime ? `(${data.flight.departureTime})` : ''}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Cabin Class</td>
        <td style="padding: 8px 0; color: #0f172a;">${data.flight.travelClass || 'Economy'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Passengers (${data.passengers.length})</td>
        <td style="padding: 8px 0; color: #0f172a;">${passengerNames}</td>
      </tr>
    </table>

    <div style="background: #f1f5f9; border-radius: 12px; padding: 16px; text-align: center; margin: 28px 0 16px 0;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #475569; font-weight: 600;">Need urgent assistance or itinerary modification?</p>
      <p style="margin: 0; font-size: 15px; font-weight: 800; color: #0f172a;">📞 Call Booking Desk: +1 (888) 791-8007</p>
    </div>

    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px 0;" />
    <p style="margin: 0; font-size: 13px; color: #64748b;">Happy travels,<br/><strong style="color: #0f172a;">Team TourHelpDesk.com</strong></p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} TourHelpDesk.com. All rights reserved.</p>
  </div>
</body>
</html>`;

    let sendResult = await resend.emails.send({
      from: senderEmail,
      to: [data.customer.email],
      subject,
      text: textContent,
      html: htmlContent,
    });

    if (sendResult.error && sendResult.error.message?.includes('domain')) {
      logger.warn(`[EmailService] Retrying customer email with sandbox domain: ${sendResult.error.message}`);
      sendResult = await resend.emails.send({
        from: 'TourHelpDesk <onboarding@resend.dev>',
        to: [data.customer.email],
        subject,
        text: textContent,
        html: htmlContent,
      });
    }

    if (sendResult.error) {
      logger.error(`[EmailService] Failed to send customer booking request email: ${JSON.stringify(sendResult.error)}`);
    } else {
      logger.info(`[EmailService] Customer booking email sent successfully. ID: ${sendResult.data?.id}`);
    }
  } catch (err: any) {
    logger.error(`[EmailService] Error sending customer booking email: ${err?.message || err}`);
  }
};

export const sendFlightBookingAdminEmail = async (data: FlightBookingEmailData): Promise<void> => {
  try {
    const resend = getResendInstance();
    if (!resend) {
      logger.warn(`[EmailService] Skipping admin booking notification (RESEND_API_KEY missing).`);
      return;
    }

    const adminRecipient = env.EMAIL_FROM || 'support@tourhelpdesk.com';
    const senderEmail = env.EMAIL_FROM || 'TourHelpDesk <onboarding@resend.dev>';
    const subject = `✈️ [NEW BOOKING REQUEST] #${data.requestId} - ${data.customer.name} (${data.flight.origin} -> ${data.flight.destination})`;

    const passengersHtmlRows = data.passengers
      .map(
        (p, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-weight: 600;">${idx + 1}. ${p.title} ${p.firstName} ${p.lastName}</td>
        <td style="padding: 8px;">${p.paxType}</td>
        <td style="padding: 8px;">${p.gender}</td>
        <td style="padding: 8px;">${p.dob || p.age || 'N/A'}</td>
        <td style="padding: 8px;">${p.passportNumber || p.nationality || 'N/A'}</td>
      </tr>`
      )
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Flight Booking Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
  <div style="background: #1e293b; padding: 20px; border-radius: 12px 12px 0 0; color: #ffffff;">
    <h2 style="margin: 0; font-size: 18px;">✈️ New Flight Booking Request: <span style="color: #38bdf8;">#${data.requestId}</span></h2>
    <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Received on ${new Date().toLocaleString()}</p>
  </div>

  <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
    <!-- Customer Contact Card -->
    <h3 style="margin-top: 0; color: #0f172a; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">1. Customer Details</h3>
    <table style="width: 100%; font-size: 13px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 6px 0; width: 30%; color: #64748b;">Full Name:</td>
        <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${data.customer.name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Email Address:</td>
        <td style="padding: 6px 0;"><a href="mailto:${data.customer.email}" style="color: #2563eb; font-weight: 600;">${data.customer.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Mobile / Phone:</td>
        <td style="padding: 6px 0;"><a href="tel:${data.customer.mobile}" style="color: #16a34a; font-weight: 700; font-size: 14px;">${data.customer.mobile}</a></td>
      </tr>
    </table>

    <!-- Flight Details -->
    <h3 style="color: #0f172a; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">2. Requested Flight Itinerary</h3>
    <table style="width: 100%; font-size: 13px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 6px 0; width: 30%; color: #64748b;">Route:</td>
        <td style="padding: 6px 0; font-weight: 800; color: #0f172a; font-size: 14px;">${data.flight.origin} &rarr; ${data.flight.destination}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Airline / Flight:</td>
        <td style="padding: 6px 0; font-weight: 600;">${data.flight.airline} ${data.flight.flightNumber || ''}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Departure Date:</td>
        <td style="padding: 6px 0; font-weight: 600;">${data.flight.travelDate} ${data.flight.departureTime ? `(${data.flight.departureTime})` : ''}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Cabin Class / Stops:</td>
        <td style="padding: 6px 0;">${data.flight.travelClass || 'Economy'} • ${data.flight.stops ?? 0} Stop(s)</td>
      </tr>
      ${data.flight.price ? `<tr><td style="padding: 6px 0; color: #64748b;">Indicative Fare:</td><td style="padding: 6px 0; font-weight: 800; color: #0284c7;">${data.flight.currency || 'INR'} ${data.flight.price.toLocaleString()}</td></tr>` : ''}
    </table>

    <!-- Passengers Table -->
    <h3 style="color: #0f172a; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">3. Passenger Roster (${data.passengers.length})</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f8fafc; text-align: left;">
          <th style="padding: 8px;">Passenger</th>
          <th style="padding: 8px;">Type</th>
          <th style="padding: 8px;">Gender</th>
          <th style="padding: 8px;">DOB / Age</th>
          <th style="padding: 8px;">Passport / Nationality</th>
        </tr>
      </thead>
      <tbody>
        ${passengersHtmlRows}
      </tbody>
    </table>

    <!-- Remarks -->
    ${
      data.remarks
        ? `
    <h3 style="color: #0f172a; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">4. Special Requests / Remarks</h3>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 13px; color: #334155; margin-bottom: 20px;">
      ${data.remarks}
    </div>`
        : ''
    }

    <div style="text-align: center; margin-top: 24px; padding: 16px; background: #ecfeff; border-radius: 8px; border: 1px solid #a5f3fc;">
      <p style="margin: 0; font-weight: 700; color: #0e7490; font-size: 14px;">Action Required: Contact customer at <a href="tel:${data.customer.mobile}">${data.customer.mobile}</a></p>
    </div>
  </div>
</body>
</html>`;

    // Attempt sending to owner/admin email
    // If running in development or sandbox, also sends without throwing
    let sendResult = await resend.emails.send({
      from: senderEmail,
      to: [adminRecipient],
      subject,
      html: htmlContent,
    });

    if (sendResult.error && sendResult.error.message?.includes('domain')) {
      logger.warn(`[EmailService] Retrying admin email with resend sandbox domain: ${sendResult.error.message}`);
      sendResult = await resend.emails.send({
        from: 'TourHelpDesk <onboarding@resend.dev>',
        to: [adminRecipient],
        subject,
        html: htmlContent,
      });
    }

    if (sendResult.error) {
      logger.error(`[EmailService] Failed to send admin booking alert: ${JSON.stringify(sendResult.error)}`);
    } else {
      logger.info(`[EmailService] Admin booking alert sent successfully. ID: ${sendResult.data?.id}`);
    }
  } catch (err: any) {
    logger.error(`[EmailService] Error sending admin booking alert: ${err?.message || err}`);
  }
};

