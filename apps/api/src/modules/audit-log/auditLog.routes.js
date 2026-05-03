const express = require("express");
const controller = require("./auditLog.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getAuditLogs);
router.post("/", controller.createAuditLog);
router.get("/export", controller.exportAuditLogsCsv);

module.exports = router;