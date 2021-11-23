const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const userModel = require("../models/user");

router.get("/Welcome", function (req, res) {
  res.render("general/Welcome");
});

router.get("/cleark", (req, res) => {
  if (!(req.session.isCleark === undefined || req.session.isCleark === null)) {
    if (req.session.isCleark) {
      res.render("general/cleark");
    } else {
      res.redirect("customer");
    }
  } else {
    res.redirect("/");
  }
});

router.get("/customer", (req, res) => {
  if (!(req.session.isCleark === undefined || !req.session.isCleark === null)) {
    if (!req.session.isCleark) {
      res.render("general/customer");
    } else {
      res.redirect("cleark");
    }
  } else {
    res.redirect("/");
  }
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
    let newName = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      Password: req.body.Password,
    });

    newName
      .save()
      .then((userSave) => {
        console.log(
          `User ${userSave.firstName} has been added to the database`
        );

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.Send_API_KEY);

        const msg = {
          to: `${email}`,
          from: "tsingh219@myseneca.ca",
          Subject: "Contact Us Form Submission",
          html: `<h1 style="text-align: center;">Welcome to TS-Flavours</h1><br>
                 <p>My name is Taranjeet Singh and I welcome you to <b>Food Hunters</b> Community</p><br>
                 Visitor's Full Name: ${firstName} ${lastName}<br>
                 Visitor's Email Address: ${email}<br>`,
        };
        sgMail
          .send(msg)
          .then(() => {
            res.render("general/Welcome", {
              set: req.body,
            });
          })
          .catch((err) => {
            console.log(`Error ${err}`);
            res.render("general/Register", {
              value: req.body,
              valid: reason,
            });
          });
      })
      .catch((err) => {
        console.log(`Error adding user to the database ... ${err}`);
        reason.email = `User with Email Already Exist`;
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

  const { email, Password, isCheck } = req.body;

  let good = true;
  let dis = {};

  if (!email) {
    good = false;
    dis.email = "Please fill valid UserName";
  }
  if (!Password) {
    good = false;
    dis.Password = "Please enter your Password";
  }

  if (good) {
    let error = [];

    userModel
      .findOne({
        email: req.body.email,
      })
      .then((user) => {
        if (user) {
          bcrypt
            .compare(req.body.Password, user.Password)
            .then((isMatch) => {
              if (isMatch) {
                // Create a new session & store user object

                req.session.user = user;
                req.session.isCleark = req.body.Operator === "Cleark";

                if (req.session.isCleark) {
                  console.log("User is a Cleark");
                  res.redirect("cleark");
                } else {
                  console.log("User is a Customer");
                  res.redirect("customer");
                }
              } else {
                console.log(`Password do not match`);
                error.push(`Sorry, your password does not match`);

                res.render("general/login", {
                  error,
                });
              }
            })
            .catch((err) => {
              console.log(`Unable to compare password.`);
              error.push(`Oop's something went wrong!`);

              res.render("general/login", {
                error,
              });
            });
        } else {
          console.log(`User not found in the database.`);
          error.push(`Email not found in the database.`);

          res.render("general/login", {
            error,
          });
        }
      })
      .catch((err) => {
        console.log(`Error finding the user in the database ... ${err}`);
        error.push("Oop's something went wrong");

        res.render("general/login", {
          error,
        });
      });
  } else {
    res.render("general/login", {
      set: req.body,
      val: dis,
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("login");
});

module.exports = router;
