const express = require("express");
const controller = require("./milestone.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getMilestones);
router.post("/", controller.createMilestone);
router.patch("/:id", controller.updateMilestone);
router.delete("/:id", controller.deleteMilestone);

module.exports = router;