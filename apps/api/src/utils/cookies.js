const COOKIE_NAME = "session_token";

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
}

function clearSessionCookie(res) {
  const options = getCookieOptions();
  delete options.maxAge;
  res.clearCookie(COOKIE_NAME, options);
}

module.exports = {
  COOKIE_NAME,
  getCookieOptions,
  setSessionCookie,
  clearSessionCookie,
};
