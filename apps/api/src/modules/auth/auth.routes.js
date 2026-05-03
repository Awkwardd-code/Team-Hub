const express = require("express");
const authController = require("./auth.controller");
const { ensureGoogleConfigured } = require("./auth.middleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

router.get("/google", ensureGoogleConfigured, authController.google);
router.get("/google/callback", ensureGoogleConfigured, authController.googleCallback);

router.post("/forgot-password", authController.forgotPassword);
router.get("/reset-password/validate", authController.validateResetPasswordToken);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
