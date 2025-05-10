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

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];
  const isAllowed = Object.keys(req.body).every((k) =>
    allowedFields.includes(k)
  );

  return isAllowed;
};

module.exports = { validateSignupData, validateEditProfileData };
