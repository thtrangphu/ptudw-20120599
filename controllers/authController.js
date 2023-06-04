"use strict";

const controller = {};
controller.show = (req, res) => {
  res.render("login");
};

controller.login = (req, res) => {};
module.exports = controller;
