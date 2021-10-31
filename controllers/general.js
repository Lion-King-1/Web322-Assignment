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

router.get("/Welcome", function (req, res) {
  res.render("general/Welcome");
});

router.get("/Sign-up", function (req, res) {
  res.render("general/Register");
});

router.post("/Sign-up", function (req, res) {
  console.log(req.body);

  const { firstName, lastName, email, Password } = req.body;

  let go = true;
  let reason = {};

  if (firstName.trim().length === 0) {
    go = false;
    reason.firstName = "Please fill valid User Name";
  }
  if (lastName.trim().length === 0) {
    go = false;
    reason.lastName = "Please enter valid Last Name";
  }
  if (email.trim().length === 0) {
    go = false;
    reason.email = "Please enter valid Email Address";
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    go = false;
    reason.email = "Please enter valid Email Address ( Format: xyz@mail.com)";
  }
  if (
    Password.trim().length === 0 ||
    Password.trim().length < 6 ||
    Password.trim().length > 12
  ) {
    go = false;
    reason.Password = "Password must be between 6-12 characters";
  } else if (
    !(
      /\W+/g.test(Password) &&
      /[a-zA-Z]+/g.test(Password) &&
      /\d+/.test(Password)
    )
  ) {
    go = false;
    reason.Password =
      "Password must contain one Symbol, Lowercase letter, Uppercase letter and Number";
  }

  if (go) {
    const sgMail=require("@sendgrid/mail");
    sgMail.setApiKey(process.env.Send_API_KEY);

    const msg={
      to:`${email}`,
      from:'tsingh219@myseneca.ca',
      Subject:'Contact Us Form Submission',
      html:`<h1 style="text-align: center;">Welcome to TS-Flavours</h1><br>
            <p>My name is Taranjeet Singh and I welcome you to <b>Food Hunters</b> Community</p><br>
            Visitor's Full Name: ${firstName} ${lastName}<br>
            Visitor's Email Address: ${email}<br>`
    }
    sgMail.send(msg)
    .then(()=>{
      res.send("Sucess, Validation passed, email sent.");
    })
    .catch(err=>{
      console.log(`Error ${err}`);

      res.render("general/Register", {
        value: req.body,
        valid: reason,
      });
      
    });

  } else {
    res.render("general/Register", {
      value: req.body,
      valid: reason,
    });
  }
});

router.get("/login", function (req, res) {
  res.render("general/login");
});

router.post("/login", function (req, res) {
  console.log(req.body);

  const { UserName, Pass } = req.body;

  let good = true;
  let dis = {};

  if (!UserName) {
    good = false;
    dis.UserName = "Please fill valid UserName";
  }
  if (!Pass) {
    good = false;
    dis.Pass = "Please enter your Password";
  }

  if (good) {
    res.render("general/Welcome");
  } else {
    res.render("general/login", {
      set: req.body,
      val: dis,
    });
  }
});

module.exports = router;
