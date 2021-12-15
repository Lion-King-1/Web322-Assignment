const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const meals = require("../models/data");
const path = require("path");
const mealModel = require("../models/mealsData");

router.get("/addNewMeal", (req, res) => {
  if (req.session && req.session.user && req.session.isCleark) {
    res.render("general/addNewMeal");
  } else {
    res.redirect("/");
  }
});

router.get("/list", (req, res) => {
  if (req.session && req.session.user && req.session.isCleark) {
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
  } else {
    res.redirect("/");
  }
});

router.get("/updateMeals", (req, res) => {
  if (req.session && req.session.user && req.session.isCleark) {
    res.redirect("/list");
  } else {
    res.redirect("/");
  }
});

router.post("/addNewMeal", (req, res) => {
  const {
    Title,
    Includings,
    Description,
    category,
    Price,
    CookTime,
    Servings,
    Calory,
    Top_Meal,
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
  } else if (!/^[0-9]*$/.test(Servings.trim())) {
    go = false;
    reason.Servings = "Calory should be a number";
  }

  if (Calory.trim().length === 0) {
    go = false;
    reason.Calory = "Please fill the calory";
  } else if (!/^[0-9]*$/.test(Calory.trim())) {
    go = false;
    reason.Calory = "Calory should be a number";
  }

  if (!req.files) {
    go = false;
    reason.Image_url = "Please upload a picture";
  } else if (
    !/^.*\.(jpg|gif|png|JPG|GIF|PNG)$/.test(
      path.parse(req.files.Image_url.name).ext
    )
  ) {
    go = false;
    reason.Image_url = "Only jpg/png/gif Formats are accepted";
  }

  if (
    Top_Meal.trim().length === 0 &&
    !/(true|True|false|False)/.test(Top_Meal)
  ) {
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
      Top_Meal: /(true|True)/.test(req.body.Top_Meal),
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
                { Image_url: uniqueName }
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
        res.render("general/cleark", {
          messages: `${req.body.Title} alreay exist in the database.`,
        });
      });
  } else {
    res.render("general/addNewMeal", { value: req.body, valid: reason });
  }
});

router.post("/updateMeals", (req, res) => {
  const {
    Title,
    Includings,
    Description,
    category,
    Price,
    CookTime,
    Servings,
    Calory,
    Top_Meal,
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
  } else if (!/^[0-9]*$/.test(Servings.trim())) {
    go = false;
    reason.Servings = "Calory should be a number";
  }

  if (Calory.trim().length === 0) {
    go = false;
    reason.Calory = "Please fill the calory";
  } else if (!/^[0-9]*$/.test(Calory.trim())) {
    go = false;
    reason.Calory = "Calory should be a number";
  }

  if (
    Top_Meal.trim().length === 0 &&
    !/(true|True|false|False)/.test(Top_Meal)
  ) {
    go = false;
    reason.Top_Meal = "Please fill it with true/false";
  }

  if (go) {
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
            Top_Meal: /(true|True)/.test(req.body.Top_Meal),
          },
        }
      )
      .exec()
      .then(() => {
        console.log("Successfully updated the data for " + req.body.Title);
        res.render("general/cleark", {
          messages: `Successfully updated the data for ${req.body.Title}`,
        });
      })
      .catch((err) => {
        console.log("Error : " + err);
      });
  } else {
    res.redirect("/");
  }
});

const ViewName="general/ShoppingCart";

const prepareViewModel=function(req,message)
{

  if(req.session && req.session.user)
  {
    console.log("6");

    var cart=req.session.cart || [];
    var cart_Total=0;

    const hasMeals=cart.length>0;

    if(hasMeals)
    {
      console.log("7");
      
      cart.forEach(cartMeal=>{
        let price=cartMeal.obj.Price;
        let quantity=cartMeal.qty;
        cart_Total=(price*quantity)+cart_Total;
      });
    }

    return {
      hasMeals,
      obj_Meals:cart,
      cartTotal:"$"+cart_Total.toFixed(2),
      message:message
    };
  }
  else
  {
    console.log("8");

    return {

      hasMeals:false,
      obj_Meals:[],
      cartTotal:"$0.00",
      message:message
    };
  }
}


//----
router.get("/Purchase/:val", (req, res) => {
if(req.session.user)
{

const Meal_title=req.params.val;

let obj={};
mealModel
  .find({Title:Meal_title})
  .exec()
  .then((results) => {
    obj=results.pop();
    res.render("general/Purchase", {
      obj
    });
    })
  .catch((err) => {
    console.log("Error in reading Meals: " + err);
  });
}
else
{
  res.redirect("/on-the-menu")
}
});

//---
router.get("/Buy-Meal/:val",(req,res)=>{

  var message;
  if(req.session.user)
  { 
    const Meal_title=req.params.val;
    var cart=req.session.cart=req.session.cart || [];
    console.log(Meal_title);

  var obj={};
  mealModel
    .find({Title:Meal_title})
    .exec()
    .then((results) => {
      obj=results.pop();
      console.log("1");
      var found=false;
      
      cart.forEach(cartMeal=>{
        if(cartMeal.Title==Meal_title)
        {
      console.log("2");
          found=true;
          cartMeal.qty++;
        }
      });
      if(found)
      {
      console.log("3");

        message = "Meal was already in the cart, incremented the quantity by one.";
      }
      else
      {
      console.log("4");

        cart.push({
          Title: Meal_title,
          qty:1,
          obj
        });

        message=obj.Title+" is added to Shopping Cart\n";
      }
      res.render(ViewName,prepareViewModel(req,message));
    
    })
    .catch((err) => {
      console.log("Error in reading Meals: " + err);
      message="Song not found in the database";
    });
  }
  else
  {
    console.log("5");

    message="You must be logged in.";
    res.render(ViewName,prepareViewModel(req,message));
  
  }
});

router.get("/customer", (req, res) => {
  if(req.session && req.session.user)
  {
    if (!req.session.isCleark) {
      res.render("general/customer",prepareViewModel(req));
    } else {
      res.redirect("cleark");
    }
  } else {
    res.redirect("/");
  }
});

router.get("/shop",(req,res)=>{
  if(req.session.user)
  {
      res.render("general/Shoppingcart",prepareViewModel(req,message=""));
  }
  else
  {
    res.redirect("/");
  }
});

router.get("/checkout",(req,res)=>{

var message;
var cart_Total=0;
var arr="";
var p_qty="";
var space="       ";
var space1="\t\t            \t";

  if(req.session.user)
  {
    var cart=req.session.cart || [];

    if(cart.length>0)
    {
      cart.forEach(cartMeal=>{
        let price=cartMeal.obj.Price;
        let quantity=cartMeal.qty;
        cart_Total=(price*quantity)+cart_Total;
        arr=`  ${cartMeal.obj.Title}`+space+arr;
        p_qty=`${cartMeal.qty}`+space+p_qty;
      });

      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.Send_API_KEY);

      console.log(arr);
      var item;
      const msg = {
        to: `${req.session.user.email}`,
        from: "tsingh219@myseneca.ca",
        Subject: "Thanks for Purchasing from TS-Flavours",
        html: `<h1 style="text-align: center;">Purchase Summary</h1><br>
               <p>Thank you for your purchase, below is your order Details<b>( Enjoy )</b></p><br>
               <table><tr><td style="white-space:pre-wrap">Meal Names-------> ${arr}<br></td></tr><tr><td style="white-space:pre-wrap">Quantity          -------->           ${p_qty}<td></tr><tr><td>Total Amount: ${cart_Total}</td></tr>`
      };
      sgMail
        .send(msg)
        .then(() => {          
          message = "Thank you for your purchase, you are now checked out.";
          req.session.cart=[];
          res.render(ViewName,prepareViewModel(req,message));
        })
        .catch((err) => {
          console.log(`Error ${err}`)
        });
    }
    else
    {
      message = "You cannot check-out, there are no items in the cart.";
    res.render(ViewName,prepareViewModel(req,message));
    }
  }
  else{
    message = "You Need to Login first.";
    res.render(ViewName,prepareViewModel(req,message));
  }
});



module.exports = router;
