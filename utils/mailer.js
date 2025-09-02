const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendAdmissionReceipt({ to, name, applicationId }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
      <h2 style="color:#2563eb; margin-bottom:8px;">Admission Form Received</h2>
      <p>Hello ${name || 'Applicant'},</p>
      <p>Thank you for applying to <strong>Worknox University</strong>. We’ve received your application.</p>
      <p><strong>Application ID:</strong> ${applicationId}</p>
      <p>You’ll receive updates as we review your application. Keep this ID for future reference.</p>
      <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
      <p style="font-size:12px;color:#666;">This is an automated message. Do not reply.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject: `Your Admission Application (ID: ${applicationId})`,
    html,
  });

  return info.messageId;
}

module.exports = { sendAdmissionReceipt };
