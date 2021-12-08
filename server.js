/************************************************************************************
* WEB322 – Project (Fall 2021)
* I declare that this assignment is my own work in accordance with Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Name:                 Taranjeet Singh
* Student ID:           145258208
* Course/Section:       ZAA
*
************************************************************************************/

const bodyParser = require("body-parser");
var express = require("express");
const exphbs = require('express-handlebars');
const session=require("express-session");
const fileUpload=require("express-fileupload");
const mongoose=require("mongoose");
// const { url } = require("inspector");
// const Fakedata=require('./models/data')

const dotenv=require('dotenv');
dotenv.config({path:"./config/key.env"});

var app = express();

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout:"main"}));
app.set('view engine', '.hbs');


// Set-up session

app.use(session({
  secret:process.env.Session_Key,
  resave:false,
  saveUninitialized:true
}));

app.use((req,res,next)=>{
  res.locals.user=req.session.user;
  next();
});

app.use((req,res,next)=>{
  res.locals.isCleark=req.session.isCleark;
  next();
});

// setup fileupload

app.use(fileUpload());

// setup folders that contain static resources
app.use(express.static("public/css"));
app.use(express.static("publicicons_images"));
app.use(express.static("public/images"));
app.use(express.static("public/Videos"));
app.use(express.static("public/MealDatabsePic"));

app.use(bodyParser.urlencoded({extended:false}));

// Connect to MongoDB

mongoose.connect(process.env.Pass_Mongo,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log("Connected to Mongo");
})
.catch((err)=>{
  console.log("Error occur: "+err);
});


// setup a 'route' to listen on the default url path (http://localhost)
const generalController=require('./controllers/general');
const usercontrol=require("./controllers/userController");
const mealAdder=require("./controllers/load-data");
const mealManipulate=require("./controllers/mealController");

app.use('/',generalController);
app.use('/',usercontrol);
app.use('/',mealAdder);
app.use('/',mealManipulate);

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Error handling code
app.use((req,res)=>{
  res.status(404).send("Page Not Found");
});

app.use(function(err,req,res,next){
  console.error(err.stack);
  res.status(500).send("Something broke");
});


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);