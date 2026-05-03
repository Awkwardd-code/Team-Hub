const express = require("express");
const controller = require("./adminMember.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/overview", controller.getAdminOverview);
router.get("/:workspaceId/members", controller.getMembers);
router.post("/:workspaceId/invite", controller.inviteMember);
router.patch("/:workspaceId/members/:memberId", controller.updateMemberRole);
router.delete("/:workspaceId/members/:memberId", controller.removeMember);

module.exports = router;
