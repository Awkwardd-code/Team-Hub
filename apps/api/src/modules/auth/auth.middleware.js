const { passport, hasGoogleConfig } = require("../../config/passport");

function initializePassport(app) {
  app.use(passport.initialize());
}

function ensureGoogleConfigured(req, res, next) {
  if (!hasGoogleConfig) {
    return res.status(500).json({ message: "Google OAuth is not configured" });
  }

  return next();
}

module.exports = {
  passport,
  initializePassport,
  ensureGoogleConfigured,
};
