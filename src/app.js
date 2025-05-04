require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const { authMiddleware, userMiddleware } = require("./middlewares/auth");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json()); // ✅ Required for parsing JSON body

app.post("/signup", async (req, res) => {
  console.log("i m here", req);
  try {
    const { firstName, lastName, age, gender, emailId, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password,
    });
    await user.save();
    res.status(200).send("user created successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("error in adding user" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Error in fetching users" + err.message);
  }
});

// get user by email

app.get("/user", async (req, res) => {
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
