import nodemailer from 'nodemailer';
import { env } from '../config/environment.js';

let transporter: nodemailer.Transporter | null = null;

if (env.SMTP_USER && env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
} else {
  console.log('[ Email Service ] SMTP credentials not provided. Email service will run in log-only mode.');
}

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (transporter) {
      await transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      });
      console.log(`[ Email Sent ] Subject: "${subject}" to ${to}`);
    } else {
      console.log(`[ Email Simulated ] To: ${to} | Subject: "${subject}"`);
    }
    return true;
  } catch (error) {
    console.error(`[ Email Error ] Failed to send email to ${to}:`, error);
    return false;
  }
};

export const sendEmailOtp = async (email: string, otp: string): Promise<boolean> => {
  const subject = 'PawVerse AI - Your Email Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
      <h2 style="color: #fbbf24; text-align: center;">PawVerse AI</h2>
      <p>Hello,</p>
      <p>Your verification code for PawVerse AI is:</p>
      <div style="background: #1e293b; color: #fbbf24; font-size: 32px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendSellerApprovalEmail = async (email: string, sellerName: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<boolean> => {
  const isApproved = status === 'APPROVED';
  const subject = isApproved ? 'PawVerse AI - Seller Verification Approved! 🎉' : 'PawVerse AI - Seller Verification Update';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
      <h2 style="color: #fbbf24;">PawVerse AI Breeder Network</h2>
      <p>Dear <strong>${sellerName}</strong>,</p>
      ${
        isApproved
          ? `<p style="color: #4ade80; font-size: 18px;">Congratulations! Your seller application has been approved.</p>
             <p>You can now list your puppies and dogs directly on PawVerse AI and reach buyers across India.</p>`
          : `<p style="color: #f87171; font-size: 18px;">Regrettably, your seller application was not approved at this time.</p>
             <p><strong>Reason:</strong> ${reason || 'Document verification could not be completed.'}</p>
             <p>Please update your credentials and re-apply.</p>`
      }
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendDogApprovalEmail = async (email: string, dogName: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<boolean> => {
  const isApproved = status === 'APPROVED';
  const subject = isApproved ? `PawVerse AI - Dog Listing "${dogName}" Approved!` : `PawVerse AI - Dog Listing Update for "${dogName}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
      <h2 style="color: #fbbf24;">PawVerse AI Marketplace</h2>
      <p>Your listing for <strong>${dogName}</strong> has been updated.</p>
      ${
        isApproved
          ? `<p style="color: #4ade80;">Your dog listing is now LIVE and visible to all prospective buyers on PawVerse AI.</p>`
          : `<p style="color: #f87171;">Listing status: REJECTED.</p><p>Reason: ${reason || 'Incomplete medical/image documentation.'}</p>`
      }
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendOrderConfirmationEmail = async (email: string, customerName: string, dogName: string, orderId: string, amount: number): Promise<boolean> => {
  const subject = `PawVerse AI - Order Confirmed #${orderId.slice(-6)}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
      <h2 style="color: #fbbf24;">PawVerse AI Order Confirmation</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for choosing PawVerse AI! Your order for <strong>${dogName}</strong> has been successfully confirmed.</p>
      <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Paid:</strong> ₹${amount.toLocaleString('en-IN')}</p>
        <p><strong>Status:</strong> Health Check Passed & In Transit</p>
      </div>
    </div>
  `;
  return sendEmail(email, subject, html);
};
