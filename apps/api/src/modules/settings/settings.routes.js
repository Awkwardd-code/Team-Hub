const express = require("express");
const controller = require("./settings.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/preferences", controller.getPreferences);
router.patch("/preferences", controller.updatePreferences);

module.exports = router;
