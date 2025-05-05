const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstname and lastname is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = { validateSignupData };
