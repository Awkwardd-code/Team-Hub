const COOKIE_NAME = "session_token";

function getCookieOptions(includeMaxAge = true) {
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };

  if (includeMaxAge) {
    options.maxAge = 7 * 24 * 60 * 60 * 1000;
  }

  return options;
}

function setSessionCookie(res, token, expiresAt) {
  res.cookie(COOKIE_NAME, token, {
    ...getCookieOptions(),
    expires: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, getCookieOptions(false));
}

module.exports = {
  COOKIE_NAME,
  setSessionCookie,
  clearSessionCookie,
};
