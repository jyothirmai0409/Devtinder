const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authMiddleware } = require("../middlewares/auth");

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

router.patch("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params?.id;
    console.log("user detailsssssssssss", req.user._id, id);
    if (req.user._id.toString() !== id.toString()) {
      throw new Error("Update now allowed");
    }
    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "about",
      "photoUrl",
    ]; // etc.
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    // const isAllowed = Object.keys(req.body).every((k) =>
    //   allowedFields.includes(k)
    // );

    // if (!isAllowed) {
    //   throw new Error("Update now allowed");
    // }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates, // dynamically update all fields from the request
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send("updated user successfully");
    }
  } catch (err) {
    res.status(500).send("Error in updating user" + err.message);
  }
});

module.exports = router;
