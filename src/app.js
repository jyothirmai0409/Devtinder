require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { authMiddleware } = require("./middlewares/auth");
const User = require("./models/user");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // ✅ Required for parsing JSON body
app.use(cookieParser()); //'to read a cookie we need cookie parser middleware' ( express js package)

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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

// update user

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
