const express = require("express");
const controller = require("./workspace.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getWorkspaces);
router.post("/", controller.createWorkspace);
router.get("/:id", controller.getWorkspace);
router.get("/:id/overview", controller.getWorkspaceOverview);
router.patch("/:id", controller.updateWorkspace);
router.delete("/:id", controller.deleteWorkspace);

router.get("/:id/members", controller.getMembers);
router.post("/:id/invite", controller.inviteMember);
router.patch("/:id/members/:memberId", controller.updateMemberRole);
router.delete("/:id/members/:memberId", controller.removeMember);

module.exports = router;
