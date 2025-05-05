const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const loggedinUser = await User.findById(decoded.userId);
    if (loggedinUser) {
      req.user = loggedinUser;
      next();
    } else {
      throw new Error("authentication failed");
    }
  } catch (err) {
    console.log(err);
    return res.status(403).send("Invalid or expired token");
  }
};

const userMiddleware = (req, res, next) => {
  const token = "xyz";
  const isAuth = token === "xyz";
  if (!isAuth) {
    res.status(401).send("Unauthorised");
  } else {
    next();
  }
};

module.exports = { authMiddleware, userMiddleware };
