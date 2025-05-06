const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validate");

router.post("/signup", async (req, res) => {
  //   console.log("i m here", req);
  try {
    const { firstName, lastName, age, gender, emailId, password } = req.body;
    // validation data
    validateSignupData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).send("user created successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("error in adding user" + err.message);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully");
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const loginUser = await User.findOne({ emailId });
    if (loginUser) {
      const isMatch = await loginUser.validatePassword(password);
      if (isMatch) {
        const token = await loginUser.getJWT();
        res.cookie("token", token);
        res.status(200).json({ message: "loggedin successfully", token });
      } else {
        throw new Error("invalid password");
      }
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    res.status(400).send("error in logging user" + err.message);
  }
});

module.exports = router;
