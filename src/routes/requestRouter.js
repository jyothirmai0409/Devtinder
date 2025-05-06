const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authMiddleware } = require("../middlewares/auth");

router.post("/sendConnectionRequest", authMiddleware, async (req, res) => {
  const user = req.user;
  res.send("connection request sent");
});

module.exports = router;
