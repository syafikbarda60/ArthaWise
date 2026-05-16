const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.route("/").get(getAllTransactions).post(createTransaction);
router.route("/:id").delete(deleteTransaction);

module.exports = router;
