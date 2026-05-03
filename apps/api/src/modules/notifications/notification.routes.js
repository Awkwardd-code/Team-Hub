const express = require("express");
const controller = require("./notification.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", controller.getNotifications);
router.patch("/:id/read", controller.markRead);
router.patch("/read-all", controller.markAllRead);
router.delete("/:id", controller.deleteNotification);

module.exports = router;
