const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
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
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password should be strong");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://l1nq.com/jhaY4",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo url");
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      validate(arr) {
        if (arr.length > 5) {
          throw new Error("more than 5 not allowed");
        }
      },
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
