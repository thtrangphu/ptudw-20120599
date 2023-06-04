const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const { body, validationResult } = require("express-validatior");

router.get("/checkout", userController.checkout);
// router.post('placeOrders')

router.get("/my-account", (req, res) => {
  res.render("my-account");
});

module.exports = router;
