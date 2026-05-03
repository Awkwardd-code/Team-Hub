const nodemailer = require("nodemailer");

function getBoolean(value) {
  return value === true || String(value).toLowerCase() === "true";
}

const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = getBoolean(process.env.SMTP_SECURE);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
});

async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("SMTP transporter verified successfully");
  } catch (error) {
    console.error("SMTP transporter verification failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
  }
}

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP environment variables are missing");
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
    replyTo: process.env.SMTP_FROM || process.env.SMTP_USER,
  });

  console.log("Email sent:", {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  });

  return info;
}

async function sendVerificationEmail(email, code) {
  const subject = "Your TeamHub verification code";
  const text = [
    "You requested a verification code for your TeamHub account.",
    "",
    `Verification code: ${code}`,
    "",
    "This code expires in 5 minutes.",
    "If you did not create an account, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#0f172a;line-height:1.6">
      <h2 style="margin:0 0 16px">TeamHub verification code</h2>
      <p>You requested a verification code for your TeamHub account.</p>
      <p style="margin:20px 0;font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>
      <p>This code expires in 5 minutes.</p>
      <p>If you did not create an account, you can ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
}

async function sendPasswordResetEmail(email, resetLink) {
  const subject = "Reset your TeamHub password";
  const text = [
    "You requested a password reset for your TeamHub account.",
    "",
    `Reset link: ${resetLink}`,
    "",
    "This link expires in 1 hour.",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#0f172a;line-height:1.6">
      <h2 style="margin:0 0 16px">Reset your TeamHub password</h2>
      <p>You requested a password reset for your TeamHub account.</p>
      <p style="margin:24px 0">
        <a href="${resetLink}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">
          Reset password
        </a>
      </p>
      <p>If the button does not work, use this link:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
}

module.exports = {
  sendEmail,
  verifyEmailTransporter: verifyTransporter,
  verifyTransporter,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
