const express = require("express");
const controller = require("./actionItem.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getActionItems);
router.post("/", controller.createActionItem);
router.get("/:id", controller.getActionItem);
router.patch("/:id", controller.updateActionItem);
router.delete("/:id", controller.deleteActionItem);

module.exports = router;