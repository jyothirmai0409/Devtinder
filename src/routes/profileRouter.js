const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");

router.get("/view", authMiddleware, async (req, res) => {
  try {
    const userDetails = req.user;
    if (!userDetails) {
      res.status(404).send("user not found");
    }
    res.status(200).json(userDetails);
  } catch (err) {
    res.status(400).send("error fetching user profile" + err.message);
  }
});

router.patch("/edit", authMiddleware, async (req, res) => {
  try {
    // etc.
    // const updates = Object.fromEntries(
    //   Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    // );
    // const updatedUser = await User.findByIdAndUpdate(
    //   id,
    //   updates, // dynamically update all fields from the request
    //   { new: true, runValidators: true }
    // );

    const isAllowed = validateEditProfileData(req);
    if (!isAllowed) {
      throw new Error("edit not allowed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log("after update", loggedInUser);
    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser.firstName} profile data is updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send("Error in updating user" + err.message);
  }
});

router.patch("/password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loginUser = req.user;
    const isMatch = await bcrypt.compare(oldPassword, loginUser.password);
    if (isMatch) {
      loginUser.password = await bcrypt.hash(newPassword, 10);
      await loginUser.save();
      res.send("password updated successfully");
    } else {
      throw new Error("old password is incorrect");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
