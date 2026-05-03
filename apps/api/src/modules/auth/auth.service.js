const bcrypt = require("bcrypt");
const prisma = require("../../prisma/client");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../../utils/email");
const { generateSessionToken, generateEmailCode, generatePasswordResetToken } = require("../../utils/token");
const { hashToken } = require("../../utils/hash");

const SESSION_DAYS = 7;
function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    provider: user.provider,
    emailVerified: user.emailVerified,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function assertRequired(data, fields) {
  for (const field of fields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }
}

async function createSession(userId) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return { token, expiresAt };
}

async function register({ name, email, password }) {
  assertRequired({ name, email, password }, ["name", "email", "password"]);

  const existing = await prisma.user.findUnique({ where: { email } });
  let user = existing;

  if (existing?.emailVerified) {
    throw new Error("Email already registered");
  }

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        provider: "credentials",
        emailVerified: false,
      },
    });
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        name,
        passwordHash,
        provider: "credentials",
        emailVerified: false,
      },
    });
  }

  const code = generateEmailCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.emailVerificationCode.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  await prisma.emailVerificationCode.create({
    data: {
      userId: user.id,
      code,
      expiresAt,
    },
  });

  try {
    await sendVerificationEmail(user.email, code);
  } catch (error) {
    console.error("VERIFICATION EMAIL SEND FAILED:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw new Error("Unable to send verification email");
  }

  return { email: user.email };
}

async function verifyEmail({ email, code }) {
  assertRequired({ email, code }, ["email", "code"]);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid verification request");
  }

  const verificationCode = await prisma.emailVerificationCode.findFirst({
    where: {
      userId: user.id,
      code,
      usedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!verificationCode) {
    throw new Error("Invalid code");
  }

  if (verificationCode.expiresAt < new Date()) {
    throw new Error("Code expired");
  }

  await prisma.$transaction([
    prisma.emailVerificationCode.update({
      where: { id: verificationCode.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    }),
  ]);

  const session = await createSession(user.id);
  const refreshedUser = await prisma.user.findUnique({ where: { id: user.id } });

  return { user: sanitizeUser(refreshedUser), session };
}

async function login({ email, password }) {
  assertRequired({ email, password }, ["email", "password"]);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) {
    throw new Error("Invalid email or password");
  }

  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }

  const session = await createSession(user.id);
  return { user: sanitizeUser(user), session };
}

async function forgotPassword({ email }) {
  assertRequired({ email }, ["email"]);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const rawToken = generatePasswordResetToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const resetLink = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;
  try {
    await sendPasswordResetEmail(user.email, resetLink);
  } catch (error) {
    console.error("Forgot password email send failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error;
  }
}

async function validateResetPasswordToken(token) {
  if (!token) return false;

  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!resetToken) return false;

  if (resetToken.usedAt) return false;
  if (resetToken.expiresAt < new Date()) return false;

  return true;
}

async function resetPassword({ token, newPassword }) {
  assertRequired({ token, newPassword }, ["token", "newPassword"]);

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new Error("Reset token is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash,
        provider: "credentials",
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.deleteMany({ where: { userId: resetToken.userId } }),
  ]);
}

async function logout(token) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { token } });
}

async function getUserFromSession(token) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    return null;
  }

  return sanitizeUser(session.user);
}

module.exports = {
  register,
  verifyEmail,
  login,
  createSession,
  forgotPassword,
  validateResetPasswordToken,
  resetPassword,
  logout,
  getUserFromSession,
};
