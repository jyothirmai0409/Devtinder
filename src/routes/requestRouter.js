const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { authMiddleware } = require("../middlewares/auth");

router.post("/send/:status/:userId", authMiddleware, async (req, res) => {
  try {
    const fromUserId = req.user._id; // receiver of the request
    const toUserId = req.params.userId; //loggedIn user sending request
    const status = req.params.status;

    const validStatuses = ["interested", "ignored"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send("Invalid review status");
    }

    //  Check if toUserId exists
    const toUserExists = await User.findById(toUserId);
    if (!toUserExists) {
      return res
        .status(404)
        .send("The user you're trying to connect with does not exist");
    }

    // const existingRequest = await ConnectionRequest.findOne({
    //   $or: [
    //     { fromUserId, toUserId },
    //     { fromUserId: toUserId, toUserId: fromUserId },
    //   ],
    // });

    // if (existingRequest) {
    //   throw new Error("connection request already exist");
    // }
    const request = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await request.save();
    res.status(200).json({ message: "connection request sent", data });
  } catch (err) {
    console.log(err);
    res.status(400).send("connection request failed to send");
  }
});

router.post("/review/:status/:userId", authMiddleware, async (req, res) => {
  try {
    const toUserId = req.user._id; // The logged-in user reviewing the request
    const fromUserId = req.params.userId; // The sender of the original request
    const status = req.params.status;

    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send("Invalid review status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
    });

    if (!connectionRequest) {
      return res.status(404).send("Connection request not found");
    }

    connectionRequest.status = status;
    if (status === "accepted") {
      // Add connection to both users
      if (!req.user.connections.includes(fromUserId)) {
        req.user.connections.push(fromUserId);
      }

      // Also add the reviewer (toUser) to the fromUser's connections
      const fromUser = await User.findById(fromUserId);
      if (fromUser && !fromUser.connections.includes(req.user._id)) {
        fromUser.connections.push(req.user._id);
        await fromUser.save();
      }

      await req.user.save();
    }

    await connectionRequest.save();
    res.status(200).send(`Connection request ${status}`);
  } catch (err) {
    console.error("Review request error:", err.message);
    res.status(400).send("Failed to review connection request");
  }
});

module.exports = router;
