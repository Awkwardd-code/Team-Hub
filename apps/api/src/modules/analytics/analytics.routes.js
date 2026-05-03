const express = require("express");
const controller = require("./analytics.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/overview", controller.getOverview);

module.exports = router;