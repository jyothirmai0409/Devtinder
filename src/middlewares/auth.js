const authMiddleware = (req, res, next) => {
  const token = "xyz";
  const isAuth = token === "xyz";
  if (!isAuth) {
    res.status(401).send("Unauthorised");
  } else {
    next();
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
