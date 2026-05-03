const express = require("express");
const controller = require("./goal.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getGoals);
router.post("/", controller.createGoal);
router.get("/:id", controller.getGoal);
router.patch("/:id", controller.updateGoal);
router.delete("/:id", controller.deleteGoal);

router.post("/:id/milestones", controller.createMilestone);
router.patch("/:id/milestones/:milestoneId", controller.updateMilestone);
router.delete("/:id/milestones/:milestoneId", controller.deleteMilestone);

router.post("/:id/updates", controller.createGoalUpdate);

module.exports = router;