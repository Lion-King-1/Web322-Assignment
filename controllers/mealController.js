const express = require("express");
const router = express.Router();
const meals = require("../models/data");
const path=require("path");
const mealModel = require("../models/mealsData");


router.get("/addNewMeal",(req,res)=>{
    if(req.session && req.session.user && req.session.isCleark)
    {
        res.render("general/addNewMeal");
    }
    else
    {
        res.redirect("/");
    }
});

router.get("/list",(req,res)=>{

  if(req.session && req.session.user && req.session.isCleark)
{
  mealModel
    .find()
    .exec()
    .then((results) => {
      let Mealsdata;
      Mealsdata = results.map((obj) => obj.toObject());
      res.render("general/MealList", {
        c_meal: meals.getAllMeals(Mealsdata),
      });
    })
    .catch((err) => {
      console.log("Error in reading Meals: " + err);
    });
}
else
{
  res.redirect("/");
}
});

router.get("/updateMeals",(req,res)=>{
    if(req.session && req.session.user && req.session.isCleark)
    {
        res.redirect("/list");
    }
    else
    {
        res.redirect("/");
    }
});

router.post("/addNewMeal",(req,res)=>{
  const {
    Title,
    Includings,
    Description,
    category,
    Price,
    CookTime,
    Servings,
    Calory,
    Top_Meal
  } = req.body;

  let go = true;
  let reason = {};

  if (Title.trim().length === 0) {
    go = false;
    reason.Title = "Please fill the Title";
  }
  if (Includings.trim().length === 0) {
    go = false;
    reason.Includings = "Please fill the Includings";
  }
  if (Description.trim().length === 0) {
    go = false;
    reason.Description = "Please fill the Description";
  }
  if (category.trim().length === 0) {
    go = false;
    reason.category = "Please fill the category";
  }

  if (Price.trim().length === 0) {
    go = false;
    reason.Price = "Please fill the price";
  }
  if (CookTime.trim().length === 0) {
    go = false;
    reason.CookTime = "Please fill valid User Name";
  }
  if (Servings.trim().length === 0) {
    go = false;
    reason.Servings = "Please fill the servings";
  }
  else if(!(/^[0-9]*$/.test(Servings.trim())))
  {
    go = false;
    reason.Servings = "Calory should be a number";
  }

  if (Calory.trim().length === 0) {
    go = false;
    reason.Calory = "Please fill the calory";
  }
  else if(!(/^[0-9]*$/.test(Calory.trim())))
  {
    go = false;
    reason.Calory = "Calory should be a number";
  }

  if(!req.files)
  {
    go = false;
    reason.Image_url = "Please upload a picture";
  }
  else if(!(/^.*\.(jpg|gif|png|JPG|GIF|PNG)$/.test(path.parse(req.files.Image_url.name).ext)))
  {
    go = false;
    reason.Image_url = "Only jpg/png/gif Formats are accepted";
  }

  if (Top_Meal.trim().length === 0 && !(/(true|True|false|False)/.test(Top_Meal))) {
    go = false;
    reason.Top_Meal = "Please fill it with true/false";
  }

  if (go) {
    let MealsRec = new mealModel({
      Title: req.body.Title,
      Includings: req.body.Includings,
      Description: req.body.Description,
      category: req.body.category,
      Price: req.body.Price,
      CookTime: req.body.CookTime,
      Servings: req.body.Servings,
      Calory: req.body.Calory,
      Top_Meal: /(true|True)/.test(req.body.Top_Meal)
    });

    MealsRec.save()
      .then((saveData) => {
        console.log(`${saveData.Title} has been added to Database`);
        let message = `${saveData.Title} has been added to Database`;

        let uniqueName = `Meal-pic-${saveData._id}${
          path.parse(req.files.Image_url.name).ext
        }`;
        req.files.Image_url.mv(`public/MealDatabsePic/${uniqueName}`).then(
          () => {
            mealModel
              .updateOne(
                {
                  _id: saveData._id,
                },
                { Image_url: uniqueName}
              )
              .then(() => {
                console.log("User document was updated.");
                res.render("general/cleark", { messages: message });
              })
              .catch(() => {
                console.log("Error updating picture: " + err);
                res.redirect("/");
              });
          }
        );
      })
      .catch((err) => {
        console.log("Error in uploading Data: " + err);
        res.render("general/cleark", { messages: `${req.body.Title} alreay exist in the database.`});
      });
  } else {
    res.render("general/addNewMeal", { value: req.body, valid: reason });
  }
});


router.post("/updateMeals",(req,res)=>{
  const {
    Title,
    Includings,
    Description,
    category,
    Price,
    CookTime,
    Servings,
    Calory,
    Top_Meal
  } = req.body;
  let go = true;
  let reason = {};

  if (Title.trim().length === 0) {
    go = false;
    reason.Title = "Please fill the Title";
  }

  if (CookTime.trim().length === 0) {
    go = false;
    reason.CookTime = "Please fill valid User Name";
  }
  if (Servings.trim().length === 0) {
    go = false;
    reason.Servings = "Please fill the servings";
  }
  else if(!(/^[0-9]*$/.test(Servings.trim())))
  {
    go = false;
    reason.Servings = "Calory should be a number";
  }

  if (Calory.trim().length === 0) {
    go = false;
    reason.Calory = "Please fill the calory";
  }
  else if(!(/^[0-9]*$/.test(Calory.trim())))
  {
    go = false;
    reason.Calory = "Calory should be a number";
  }

  if (Top_Meal.trim().length === 0 && !(/(true|True|false|False)/.test(Top_Meal))) {
    go = false;
    reason.Top_Meal = "Please fill it with true/false";
  }

if(go)
{
  mealModel
    .updateOne(
      {
        Title: req.body.Title,
      },
      {
        $set: {
          Title: req.body.Title,
          Includings: req.body.Includings,
          Description: req.body.Description,
          category: req.body.category,
          Price: req.body.Price,
          CookTime: req.body.CookTime,
          Servings: req.body.Servings,
          Calory: req.body.Calory,
          Top_Meal: /(true|True)/.test(req.body.Top_Meal)
        }
      }
    )
    .exec()
    .then(() => {
      console.log("Successfully updated the data for " + req.body.Title);
      res.render("general/cleark", { messages: `Successfully updated the data for ${req.body.Title}` });
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
}
else
{
  res.redirect("/");
}
});

  
module.exports=router;