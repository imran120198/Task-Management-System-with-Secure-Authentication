const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const { UserModel } = require("../Models/User.model");

const UserRouter = Router();

// 1. User Signup
UserRouter.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;
      const result = await UserModel.findOne({ email });
      if (result) {
        res.send("Email Already existed");
      } else {
        bcrypt.hash(password, 5, async (err, hash) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Something wrong with signup", err });
          } else {
            const newSignup = new UserModel({
              name: name,
              email: email,
              password: hash,
            });
            const saveSignup = newSignup.save();
            res
              .status(201)
              .send({ message: "Signup Successfully", saveSignup });
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
);

// 2. user login
UserRouter.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
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
  }
);

module.exports = {
  UserRouter,
};
