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
    return res.status(200).json({ message: "connection request sent", data });
  } catch (err) {
    console.log(err);
    return res.status(400).send("connection request failed to send");
  }
});

router.post("/review/:status/:requestId", authMiddleware, async (req, res) => {
  try {
    const toUserId = req.user._id; // The logged-in user reviewing the request
    const requestId = req.params.requestId; // The sender of the original request
    const status = req.params.status;

    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send("Invalid review status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).send("Connection request not found");
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();
    return res
      .status(200)
      .json({ message: `connection request ${status}`, data });
  } catch (err) {
    console.error("Review request error:", err.message);
    return res.status(400).send("Failed to review connection request");
  }
});

module.exports = router;
