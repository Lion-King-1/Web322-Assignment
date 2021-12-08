const mongoose = require("mongoose");
const schema = mongoose.Schema;

const nameSchema=new schema
({
    "Title": {
        "type": String,
        "unique":true,
        "required":true
    },
    "Includings": {
        "type": String,
        "required":true
    },
    "Description":  {
        "type": String,
        "required":true
    },
    "category":  {
        "type": String,
        "required":true
    },
    "Price":  {
        "type": String,
        "required":true
    },
    "CookTime":  {
        "type": String,
        "required":true
    },
    "Servings":  {
        "type": Number,
        "required":true
    },
    "Calory":  {
        "type": Number,
        "required":true
    },
    "Image_url": {
        "type": String
    },
    "Top_Meal": {
        "type": Boolean,
        "required":true
    },
},{versionKey:false});

var dataModel=mongoose.model("MealRecord",nameSchema);

module.exports=dataModel;