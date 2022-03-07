const Account = require("../models/Account");
const client = require("../helpers/redis_init");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const jwt = require("jsonwebtoken");

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/auth_jwt");

const registerUser = async (req, res, next) => {
  try {
    const { email, mobileNumber } = req.body;
    const foundUser = await Account.findOne({ email });

    if (foundUser) {
      throw createError.Conflict(`The email is already registered.`);
    }

    const existingAccount = await Account.findOne({
      mobileNumber,
    });

    if (existingAccount) {
      throw createError.Conflict("The mobile is already registered");
    }
    const newUser = await new Account(req.body);

    const savedUser = await newUser.save();

    const options = {
      issuer: "randomexample.com",
      audience: savedUser.id,
      expiresIn: "10m",
    };
    jwt.sign({}, process.env.OTP_SECRET, options, (err, token) => {
      if (err) {
        console.log(err);
        throw createError.InternalServerError();
      }
      console.log("Token", token);
      twilio.verify
        .services(process.env.VERIFICATION_SID)
        .verifications.create({
          to: `+91 ${mobileNumber}`,
          channel: "sms",
        })
        .then(async (verification) => {
          console.log(verification.status);

          await Account.findByIdAndUpdate(savedUser.id, {
            $set: { otpKey: token },
          });

          res.status(200).json({
            success: true,
            msg: "OTP verification sent",
            data: {
              otpToken: token,
            },
          });
        });
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await Account.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      throw createError.NotFound("Your account is not registered");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) throw createError.Unauthorized("Invalid email or password");

    if (!user.verified) {
      throw createError.Unauthorized("Your mobile number is not verified.np");
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.status(200).json({
      success: true,
      msg: "Logged in successfuly",
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.status(200).json({
      success: true,
      msg: "Token refreshed",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw createError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    client.del(userId, (err, val) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      } else console.log(val);
    });
    res.status(204).json({
      success: true,
      msg: "Logged out",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { otp, otpKey } = req.body;

    jwt.verify(otpKey, process.env.OTP_SECRET, async (err, decoded) => {
      if (err) throw createError.Unauthorized("Invalid Operation");
      const userId = decoded.aud;
      console.log(userId);
      const foundAccount = await Account.findById(userId);
      if (!foundAccount) throw createError.NotFound("User not found");

      if (!foundAccount.verified) {
        console.log("Found account", foundAccount);

        twilio.verify
          .services(process.env.VERIFICATION_SID)
          .verificationChecks.create({
            to: "+91 " + foundAccount.mobileNumber,
            code: otp,
          })
          .then(async (verification_check) => {
            console.log(verification_check);
            if (verification_check.status === "approved") {
              foundAccount.verified = true;
              await foundAccount.save();
              const accessToken = await signAccessToken(userId);
              const refreshToken = await signRefreshToken(userId);
              res.status(200).json({
                success: true,
                msg: "OTP verified",
                data: { accessToken, refreshToken },
              });
            }
          });
      }
    });
  } catch (err) {
    next(err);
  }
};

const getUserByToken = async (req, res, next) => {
  try {
    const user = await Account.findById(req.userId);

    const { password, ...userData } = await user._doc;
    res.status(200).json({
      success: true,
      msg: "Done",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  refreshToken,
  getUserByToken,
  logoutUser,
  verifyOTP,
};
