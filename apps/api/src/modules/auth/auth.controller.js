const authService = require("./auth.service");
const { COOKIE_NAME, setSessionCookie, clearSessionCookie } = require("../../utils/cookies");
const { passport } = require("./auth.middleware");

function handleError(res, error) {
  return res.status(400).json({ message: error.message || "Request failed" });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const data = await authService.register({ name, email, password });
    return res.status(201).json({ message: "Verification code sent", ...data });
  } catch (error) {
    return handleError(res, error);
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    const { user, session } = await authService.verifyEmail({ email, code });
    setSessionCookie(res, session.token, session.expiresAt);
    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, session } = await authService.login({ email, password });
    setSessionCookie(res, session.token, session.expiresAt);
    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error);
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    await authService.forgotPassword({ email });
    return res.status(200).json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    return res.status(200).json({ message: "If an account exists, a reset link has been sent." });
  }
}

function google(req, res, next) {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}

function googleCallback(req, res, next) {
  return passport.authenticate("google", { session: false }, async (error, user) => {
    if (error || !user) {
      const query = new URLSearchParams({
        error: error?.message || "Google login failed",
      }).toString();
      return res.redirect(`${process.env.CLIENT_URL}/login?${query}`);
    }

    try {
      const session = await authService.createSession(user.id);
      setSessionCookie(res, session.token, session.expiresAt);
      return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    } catch (sessionError) {
      const query = new URLSearchParams({
        error: sessionError.message || "Google login failed",
      }).toString();
      return res.redirect(`${process.env.CLIENT_URL}/login?${query}`);
    }
  })(req, res, next);
}

async function validateResetPasswordToken(req, res) {
  try {
    const token = req.query.token;
    const valid = await authService.validateResetPasswordToken(token);
    return res.status(200).json({ valid });
  } catch (error) {
    return res.status(200).json({ valid: false });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword({ token, newPassword });
    clearSessionCookie(res);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies[COOKIE_NAME];
    await authService.logout(token);
    clearSessionCookie(res);
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function me(req, res) {
  try {
    const token = req.cookies[COOKIE_NAME];
    const user = await authService.getUserFromSession(token);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  google,
  googleCallback,
  forgotPassword,
  validateResetPasswordToken,
  resetPassword,
  logout,
  me,
};
