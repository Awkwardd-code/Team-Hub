const express = require("express");
const controller = require("./workspaceSetting.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/:workspaceId", controller.getSettings);
router.patch("/:workspaceId", controller.updateSettings);

module.exports = router;