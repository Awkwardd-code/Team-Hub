const express = require("express");
const controller = require("./invitation.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getMyInvitations);
router.post("/:id/accept", controller.acceptInvitation);
router.post("/:id/decline", controller.declineInvitation);

module.exports = router;
