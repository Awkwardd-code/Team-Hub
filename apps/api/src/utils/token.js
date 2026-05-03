const crypto = require("crypto");

function generateSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

function generateEmailCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function generatePasswordResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = {
  generateSessionToken,
  generateEmailCode,
  generatePasswordResetToken,
};
