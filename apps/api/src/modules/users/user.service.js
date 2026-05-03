const { COOKIE_NAME } = require("../../utils/cookies");
const { getUserFromSession } = require("../auth/auth.service");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    const user = await getUserFromSession(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  requireAuth,
};