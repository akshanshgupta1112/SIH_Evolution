const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const {
  registerValidationRules,
  validate,
  loginValidationRules,
} = require("../helpers/validate_credentials");
const { verifyAccessToken } = require("../helpers/auth_jwt");

router.post(
  "/register",
  registerValidationRules(),
  validate,
  authController.registerUser
);

router.post("/verify", authController.verifyOTP);

router.post(
  "/login",
  loginValidationRules(),
  validate,
  authController.loginUser
);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logoutUser);

router.get("/user", verifyAccessToken, authController.getUserByToken);

module.exports = router;
