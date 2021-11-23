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
// setup folders that contain static resources
app.use(express.static("css"));
app.use(express.static("icons_images"));
app.use(express.static("images"));
app.use(express.static("Videos"));

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
const usercontrol=require("./controllers/userController")

app.use('/',generalController);
app.use('/',usercontrol);


// app.get("/",(req,res)=>{
//   namemodel.find()
//   .exec()
//   .then((data)=>{

//     data=data.map(view=>value.toObject());
  
//     res.render("general/Register",{
//       data,
//       layout:false
//     });
//   });
// });


// app.post("/Sign-up",(req,res)=>{
//   let newName=new namemodel({
//     firstName:req.body.firstName,
//     lastName:req.body.lastName,
//     email:req.body.email,
//     Password:req.body.Password
//   });

//   newName.save((err)=>{
//     if(err)
//     {
//       console.log("Couldn't create the new name: "+err);
//     }
//     else
//     {
//       console.log("Successfully created a new name for "+newName.firstName);
//     }

//     res.redirect("/");
//   });
// });


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