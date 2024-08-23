const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Models/User.model");

const UserRouter = Router();

// 1. User Signup
UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await UserModel.findOne({ email });
    if (result) {
      res.send("Email Already existed");
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(500).send({ message: "Something wrong with signup", err });
        } else {
          const newSignup = new UserModel({
            name: name,
            email: email,
            password: hash,
          });
          const saveSignup = newSignup.save();
          res.status(201).send({ message: "Signup Successfully", saveSignup });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// 2. user login
UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const hash = user.password;

    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Something wrong with login", err });
      }
      if (result) {
        const expiresIn = "1d";
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
          expiresIn,
        });
        res.status(201).send({ message: "Login Successful", token, user });
      } else {
        res.status(500).send({ message: "Invalid Credential" });
      }
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = {
  UserRouter,
};
