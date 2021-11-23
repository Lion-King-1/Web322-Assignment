const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const nameSchema = new schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

nameSchema.pre("save", function (next) {
  let user = this;

  // Generate unique Salt
  bcrypt.genSalt(10)
    .then((salt) => {
      // Hash password
      bcrypt.hash(user.Password, salt)
      .then(hashedPwd=>{
        user.Password=hashedPwd;
        next();
      })
      .catch(err=>{
        console.log(`Error occured when hashing ... ${err}`);
      });
    })
    .catch((err) => {
      console.log(`Error occurer when Salting .... ${err}`);
    });
});

const userModel = mongoose.model("names", nameSchema);

module.exports = userModel;
