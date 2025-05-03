const express = require("express");
const { authMiddleware, userMiddleware } = require("./middlewares/auth");
const app = express();

// // the below handler will handle anything that comes after /xyz, /test, /1 - so always place app.use carefully in the code either top or last
app.use("/admin", authMiddleware);
// app.use("/user", userMiddleware);

app.get("/admin", (req, res) => {
  res.send("fetched users successfully");
});

app.delete("/admin", (req, res) => {
  res.send("deleted users successfully");
});

app.get("/user", (req, res) => {
  res.send("fetched users successfully");
});

// the below way of using middleware is also correct

app.get("/user", userMiddleware, (req, res) => {
  res.send("fetched users successfully");
});

// define port
const PORT = process.env.PORT || 8000;

// start server
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
