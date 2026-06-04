const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getSummary,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  uploadTransactions
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

router.route("/summary").get(protect, getSummary);
router.route("/upload").post(protect, uploadTransactions);

router.route("/").get(protect, getAllTransactions).post(protect, createTransaction);
router.route("/:id").get(protect, getTransactionById).put(protect, updateTransaction).delete(protect, deleteTransaction);

module.exports = router;
