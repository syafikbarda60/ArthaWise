const express = require("express");
const router = express.Router();
const { getForecast, getFinancialProfile } = require("../controllers/aiController");

router.get("/forecast", getForecast);
router.get("/profile", getFinancialProfile);

module.exports = router;
