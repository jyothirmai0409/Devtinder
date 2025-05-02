const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  // http://localhost:8000/user?userId=1&age=10
  console.log("query params", req.query);

  res.json({
    fname: "jyothi",
    lname: "kattamuri",
  });
});

// reading the dynamic routes

app.get("/user/:id/:name/:age", (req, res) => {
  // http://localhost:8000/user?userId=1&age=10
  console.log("by id's", req.params);

  res.json({
    fname: "jyothi",
    lname: "kattamuri",
  });
});

app.post("/user", (req, res) => {
  res.send("post user successfully");
});

app.delete("/user", (req, res) => {
  res.send("delete user successfully");
});

// the below handler will handle anything that comes after /xyz, /test, /1 - so always place app.use carefully in the code either top or last
app.use("/", (req, res) => {
  res.send("hello test");
});

// define port
const PORT = process.env.PORT || 8000;

// start server
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
