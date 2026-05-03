const nodemailer = require("nodemailer");

let transporter;
let verificationPromise;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure:
        typeof process.env.SMTP_SECURE === "string"
          ? process.env.SMTP_SECURE === "true"
          : Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
    });
  }

  return transporter;
}

async function verifyTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return false;
  }

  if (!verificationPromise) {
    verificationPromise = getTransporter()
      .verify()
      .then(() => {
        if (process.env.NODE_ENV !== "production") {
          console.log("SMTP transporter verified");
        }
        return true;
      })
      .catch((error) => {
        verificationPromise = null;
        if (process.env.NODE_ENV !== "production") {
          console.error("SMTP verify failed:", error.message);
        }
        throw error;
      });
  }

  return verificationPromise;
}

function getSender() {
  return {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "TeamHub <no-reply@teamhub.local>",
    replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_USER || undefined,
  };
}

async function sendEmail({ to, subject, text, html }) {
  const { from, replyTo } = getSender();

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject} | Body: ${text}`);
    return;
  }

  try {
    await verifyTransporter();
    await getTransporter().sendMail({
      from,
      replyTo,
      to,
      subject,
      text,
      html,
      headers: {
        "X-Application-Name": "TeamHub",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Email send failed for ${to}:`, error.message);
    }
    throw error;
  }
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

  await sendEmail({ to: email, subject, text, html });
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

  await sendEmail({ to: email, subject, text, html });
}

module.exports = {
  verifyTransporter,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
