const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { authMiddleware } = require("../middlewares/auth");

router.get("/connections", authMiddleware, async (req, res) => {
  try {
    const populatedUser = await req.user.populate("connections");
    res.status(200).json(populatedUser.connections);
  } catch (err) {
    console.error("Error fetching connections:", err.message);
    res.status(500).send("Failed to fetch connections");
  }
});

router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
    }).populate("fromUserId"); // Optional: populate sender info

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err.message);
    res.status(500).send("Failed to fetch requests");
  }
});

router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // 1. Find all connection requests involving the logged-in user
    const requests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    // 2. Extract all user IDs to exclude (users already involved in a request)
    const excludedUserIds = new Set();
    requests.forEach((req) => {
      excludedUserIds.add(req.fromUserId.toString());
      excludedUserIds.add(req.toUserId.toString());
    });
    excludedUserIds.add(loggedInUserId.toString()); // Also exclude self

    // 3. Fetch all users except those in the excluded set
    const userFeed = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
    });

    res.status(200).json(userFeed);
  } catch (err) {
    console.error("Error in fetching users:", err.message);
    res.status(500).send("Error in fetching users");
  }
});

module.exports = router;
