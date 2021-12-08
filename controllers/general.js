const express = require("express");
const router = express.Router();
const meals = require("../models/data");
const mealModel = require("../models/mealsData");


router.get("/", function (req, res) {
  mealModel.find()
    .exec()
    .then((results) => {
      let Mealsdata;
      Mealsdata = results.map((obj) => obj.toObject());
      res.render("general/home", {
        c_meal: meals.getTopMeals(Mealsdata)
      });
    })
    .catch((err) => {
      console.log("Error in reading Meals: " + err);
    });
});

router.get("/on-the-menu", function (req, res) {
  
  mealModel.find()
    .exec()
    .then((results) => {
      let Mealsdata;
      Mealsdata = results.map((obj) => obj.toObject());
      res.render("general/on-the-menu", {
        m_meal: meals.getAllMeals(Mealsdata),
        c_meal: meals.getTopMeals(Mealsdata),
      });
    })
    .catch((err) => {
      console.log("Error in reading: " + err);
    });
});

module.exports = router;
