"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersController");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn);
router.get("/checkout", controller.checkout);
router.post("/placeorders", controller.placeorders);

router.get("/my-account", (req, res) => {
  res.render("my-account");
});

module.exports = router;
