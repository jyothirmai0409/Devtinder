require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { authMiddleware } = require("./middlewares/auth");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validate");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json()); // ✅ Required for parsing JSON body
app.use(cookieParser()); //'to read a cookie we need cookie parser middleware' ( express js package)

app.post("/signup", async (req, res) => {
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

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully");
});

app.post("/login", async (req, res) => {
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

app.get("/profile", authMiddleware, async (req, res) => {
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

app.get("/feed", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Error in fetching users" + err.message);
  }
});

// get user by email

app.get("/user", authMiddleware, async (req, res) => {
  try {
    const { userEmail } = req.body;
    const user = await User.find({ emailId: userEmail });
    // const user = await User.findOne({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).send("Error in fetching user" + err.message);
  }
});

app.delete("/user/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete({ _id: id });
    if (!deletedUser) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send("deleted user successfully");
    }
  } catch (err) {
    res.status(500).send("Error in deleting user" + err.message);
  }
});

app.post("/sendConnectionRequest", authMiddleware, async (req, res) => {
  const user = req.user;
  res.send("connection request sent");
});

// update user

app.patch("/user/:id", authMiddleware, async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("db connected successfullly");
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
