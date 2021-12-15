const express = require("express");
const router = express.Router();
const mealModel = require("../models/mealsData");


router.get("/load-data/meal-kits",(req,res)=>{

    var message;

    if(req.session && req.session.user && req.session.isCleark)
    {
        mealModel.find().count({},(err,count)=>
        {
            if(err)
            {
                res.send("Couldn't find: "+err);
            }
            else if(count==0)
            {
              var mealdata = [
                {
                  Title: "Biryani",
                  Includings: "Mixed rice, Chicken curry & mint",
                  Description:
                    "Spicy rice mixed with chicken curry and garnished with mint",
                  category: "Classic Dish",
                  Price: "$11.99",
                  CookTime: "2-hours",
                  Servings: 4,
                  Calory: 1135.92,
                  Image_url: "/9.jpg",
                  Top_Meal: true,
                },

                {
                  Title: "Korma",
                  Includings: "Meat & Vegetables",
                  Description: "Rice Mixed with vegetable and Meat curry",
                  category: "Classic Dish",
                  Price: "10.99",
                  CookTime: "1-hour",
                  Servings: 3,
                  Calory: 990,
                  Image_url: "/10.jpg",
                  Top_Meal: true,
                },

                {
                  Title: "Chole Bhature",
                  Includings: "Chickpeas & Puri",
                  Description:
                    "Special chickpeas veg dish with indian flavoured puri",
                  category: "Classic Dish",
                  Price: "8.99",
                  CookTime: "45-minutes",
                  Servings: 2,
                  Calory: 427,
                  Image_url: "/11.jpg",
                  Top_Meal: true,
                },

                {
                  Title: "Gulab Jamun",
                  Includings: "Sweet balls & Sugar syrup",
                  Description: "Milk-solid-sweet balls dipped in sugar syrup",
                  category: "Desert",
                  Price: 4.99,
                  CookTime: "12-minutes",
                  Servings: 1,
                  Calory: 125,
                  Image_url: "/15.jpg",
                  Top_Meal: false,
                },
                {
                  Title: "Shahi Saag",
                  Includings: "Green Saag & Spices",
                  Description: "World best saag with spicy taste and garlic.",
                  category: "Classic Dish",
                  Price: "16.99",
                  CookTime: "2-hour",
                  Servings: 4,
                  Calory: 1252,
                  Image_url: "/14.jpg",
                  Top_Meal: false,
                },
                {
                  Title: "Sandesh",
                  Includings: "Fluffy sweet balls, garnished with Pistachios",
                  Description: "Special Bengali sweet dish, Diwali Special",
                  category: "Desert",
                  Price: "8.99",
                  CookTime: "15-minutes",
                  Servings: 4,
                  Calory: 150,
                  Image_url: "/23.jpg",
                  Top_Meal: false,
                },
                {
                  Title: "Rasmalai",
                  Includings: "spongy rasgulla with smooth cream",
                  Description:
                    "spongy rasgulla swimming in a silky smooth cream perfumed with almonds, pistachios, saffron and cardamom",
                  category: "Desert",
                  Price: "10.99",
                  CookTime: "30-minutes",
                  Servings: 2,
                  Calory: 220,
                  Image_url: "/24.jpg",
                  Top_Meal: false,
                },
                {
                  Title: "Jalebi",
                  Includings: "Funnel cakes dipped in sugar syrup",
                  Description:
                    "Fried, crispy and sugar-coated funnel cake. Famous for sweet texture",
                  category: "Desert",
                  Price: "7.99",
                  CookTime: "30-minutes",
                  Servings: 2,
                  Calory: 150,
                  Image_url: "/25.jpg",
                  Top_Meal: false,
                },
              ];

              mealModel.collection.insertMany(mealdata, (err, docs) => {
                if (err) res.send("Couldn't insert:" + err);
                else 
                {
                    message="Added meal kits to the database";
                    res.render("general/load-data/meal-kits", { messages: message });
                }
              });
            }
            else
            {
                message="Meal kits have already been added to the database";
                res.render("general/load-data/meal-kits", { messages: message });
            }
        });
    }
    else
    {
        message="You are not authorized to add meal kits";
        res.render("general/load-data/meal-kits",{message});
    }

});

module.exports=router;