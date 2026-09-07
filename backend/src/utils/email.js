const nodemailer = require('nodemailer');

const isDev = process.env.NODE_ENV !== 'production';
const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;

if (!isDev && hasSmtp) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.EMAIL_FROM || 'Ayush Portal <noreply@ayushportal.in>';

/**
 * Send an email — logs in dev, sends via SMTP in production with credentials
 */
const sendEmail = async ({ to, subject, html }) => {
  if (isDev || !hasSmtp) {
    console.log(`\n📧 [EMAIL LOG] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};

// ─── Email Templates ──────────────────────────────────────────────────────────

const emailTemplates = {
  applicationReceived: (studentName, jobTitle, companyName) => ({
    subject: `Application Received – ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a5276, #148f77); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🌿 Ayush Portal</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received successfully.</p>
          <p>We will notify you as soon as the employer reviews your application.</p>
          <p style="color: #666; font-size: 14px;">Ministry of Ayush – Academia-Industry Collaboration Portal</p>
        </div>
      </div>`,
  }),

  statusUpdated: (studentName, jobTitle, status) => ({
    subject: `Application Update – ${jobTitle}: ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a5276, #148f77); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🌿 Ayush Portal</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your application status for <strong>${jobTitle}</strong> has been updated to:</p>
          <div style="background: ${status === 'ACCEPTED' ? '#d4edda' : status === 'SHORTLISTED' ? '#fff3cd' : status === 'REJECTED' ? '#f8d7da' : '#cce5ff'}; 
                      border-radius: 6px; padding: 12px 20px; display: inline-block; margin: 12px 0;">
            <strong style="font-size: 18px; color: ${status === 'ACCEPTED' ? '#155724' : status === 'SHORTLISTED' ? '#856404' : status === 'REJECTED' ? '#721c24' : '#004085'};">${status}</strong>
          </div>
          <p style="color: #666; font-size: 14px;">Ministry of Ayush – Academia-Industry Collaboration Portal</p>
        </div>
      </div>`,
  }),

  verificationApproved: (name) => ({
    subject: 'Account Verified – You can now log in to Ayush Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a5276, #148f77); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🌿 Ayush Portal</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your account has been verified by your institution. You can now log in and start using the Ayush Portal.</p>
          <p style="color: #666; font-size: 14px;">Ministry of Ayush – Academia-Industry Collaboration Portal</p>
        </div>
      </div>`,
  }),
};

module.exports = { sendEmail, emailTemplates };
