const express = require("express");
const controller = require("./announcement.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getAnnouncements);
router.post("/", controller.createAnnouncement);
router.patch("/:id", controller.updateAnnouncement);
router.delete("/:id", controller.deleteAnnouncement);

router.post("/:id/comments", controller.createComment);
router.post("/:id/reactions", controller.toggleReaction);

module.exports = router;