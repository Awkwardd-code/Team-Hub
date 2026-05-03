const { COOKIE_NAME } = require("../utils/cookies");
const { getUserFromSession } = require("../modules/auth/auth.service");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    const user = await getUserFromSession(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Admin permission required" });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
