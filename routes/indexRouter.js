// "use strict"; sử dụng strict mode -> môi trường an toàn hơn.
"use strict";

//Import thư viện Express,  framework phổ biến trong Node.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

// Chi de tao csdl, neu tao xong roi thi comment de khoi tao nua
router.get("/createTables", (req, res) => {
  let models = require("../models");
  models.sequelize.sync().then(() => {
    res.send("tables created successfully");
  });
});

router.get("/", controller.showHomePage);

//
router.get("/:page", controller.showPage);

module.exports = router;
