const COOKIE_NAME = "session_token";

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

function setSessionCookie(res, token, expiresAt) {
  res.cookie(COOKIE_NAME, token, {
    ...getCookieOptions(),
    expires: expiresAt,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, getCookieOptions());
}

module.exports = {
  COOKIE_NAME,
  setSessionCookie,
  clearSessionCookie,
};
