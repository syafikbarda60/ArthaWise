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

router.route("/summary").get(getSummary);
router.route("/upload").post(uploadTransactions);

router.route("/").get(getAllTransactions).post(createTransaction);
router.route("/:id").get(getTransactionById).put(updateTransaction).delete(deleteTransaction);

module.exports = router;
