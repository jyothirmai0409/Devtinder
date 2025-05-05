const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      required: true,
      // enum: ["Male", "Female", "Other"],
      validate(value) {
        if (!["male", "female", "otherrs"].includes(value)) {
          throw new Error("invalid gender");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: "https://l1nq.com/jhaY4",
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
