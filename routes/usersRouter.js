const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const authController = require("../controllers/authController");
// const { body, validationResult } = require("express-validatior");
// router.use(authController.isLoggedIn);
router.get("/checkout", userController.checkout);
// router.post('placeOrders')

router.get("/my-account", (req, res) => {
  res.render("my-account");
});

module.exports = router;
