const express = require("express");
const { requireAuth } = require("../../middleware/auth");
const { updateCurrentUser } = require("./user.controller");

const router = express.Router();

router.patch("/me", requireAuth, updateCurrentUser);

module.exports = router;
