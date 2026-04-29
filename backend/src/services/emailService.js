const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    connectionTimeout: Number(process.env.SMTP_TIMEOUT_MS || 5000),
    greetingTimeout: Number(process.env.SMTP_TIMEOUT_MS || 5000),
    socketTimeout: Number(process.env.SMTP_TIMEOUT_MS || 5000),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`Email skipped. Configure SMTP to send "${subject}" to ${to}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Leave Payroll System <no-reply@company.com>",
      to,
      subject,
      html
    });
  } catch (error) {
    console.warn(`Email failed for "${subject}" to ${to}: ${error.message}`);
  }
};

module.exports = { sendEmail };
