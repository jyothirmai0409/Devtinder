const express = require("express");
const app = express();

// request handler

app.use("/", (req, res) => {
  res.send("hello just");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/test", (req, res) => {
  res.send("hello test");
});

app.use("/hello", (req, res) => {
  res.send("hello from route hello");
});

// define port
const PORT = process.env.PORT || 8000;

// start server
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
