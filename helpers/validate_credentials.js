const { body, validationResult } = require("express-validator");

const Account = require("../models/Account");

const registerValidationRules = () => {
  return [
    body("email")
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Please enter a valid email."),
    body("password")
      .isLength({ min: 5 })
      .withMessage("The password should be atleast 5 characters long"),
    body("confirmPassword", "Please confirm you passwords correctly.")
      .exists()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("The passwords do not match")
      .isLength({ min: 5 }),
    body("mobileNumber")
      .exists()
      .isLength({ min: 10, max: 10 })
      .withMessage("Please enter a valid mobile number"),
    body("name").exists().withMessage("Please enter the name"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  console.log(extractedErrors);
  let msg = "";
  console.log("First error", extractedErrors[0]);
  console.log("Key", Object.keys(extractedErrors[0]));
  msg = msg + Object.values(extractedErrors[0])[0];

  return res.status(400).json({
    success: false,
    msg,
  });
};

const loginValidationRules = () => {
  return [
    body("email")
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value) => {
        return Account.findOne({ email: value }).then((foundUser) => {
          if (!foundUser) {
            return Promise.reject("The email is not registered");
          }
        });
      }),
    body("password")
      .exists()
      .isLength({ min: 5 })
      .withMessage("The password should be atleast 5 characters long"),
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
