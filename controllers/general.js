const express = require("express");
const router = express.Router();
const meals = require("../models/data");

router.get("/", function (req, res) {
  res.render("general/home", {
    c_meal: meals.getTopMeals(),
  });
});

router.get("/on-the-menu", function (req, res) {
  res.render("general/on-the-menu", {
    m_meal: meals.getAllMeals(),
    c_meal: meals.getTopMeals(),
  });
});

module.exports = router;
