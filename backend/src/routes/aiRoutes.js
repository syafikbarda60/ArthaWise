const express = require("express");
const router = express.Router();
const { getForecast, getFinancialProfile } = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

router.get("/forecast", protect, getForecast);
router.get("/profile", protect, getFinancialProfile);

module.exports = router;
