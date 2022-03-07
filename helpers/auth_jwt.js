const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("./redis_init");

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "5s",
      audience: userId,
      issuer: "blogbyshashank.com",
    };
    jwt.sign(payload, secret, options, (err, accessToken) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(accessToken);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  try {
    const accessString = req.headers["authorization"];
    if (!accessString) {
      throw createError.Unauthorized();
    }
    const bearerToken = accessString.split(" ");
    const accessToken = bearerToken[1];

    if (!accessToken) {
      throw createError.Unauthorized();
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET,

      function (err, result) {
        if (err) {
          throw createError.Unauthorized("Invalid access token");
        }
        req.userId = result.aud;
        next();
      }
    );
  } catch (err) {
    next(err);
  }
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      issuer: "blogbyshashank.com",
      audience: userId,
      expiresIn: "1y",
    };

    jwt.sign(payload, secret, options, (err, refreshToken) => {
      if (err) {
        return reject(createError.InternalServerError());
      }
      client.set(
        userId,
        refreshToken,
        "EX",
        365 * 24 * 60 * 60,
        (err, tokenSaved) => {
          if (err) {
            return reject("Data Store Error");
          }

          client.expire(userId, 365 * 24 * 60 * 60, (err, result) => {
            return resolve(refreshToken);
          });
        }
      );
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    console.log(refreshToken);
    try {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,

        function (err, result) {
          if (err) {
            throw createError.Unauthorized("Invalid refresh token");
          }
          console.log("Verify Refresh Token", result);
          const userId = result.aud;
          client.get(userId, (err, storedRefreshToken) => {
            if (err) {
              throw createError.InternalServerError();
            }
            console.log({ storedRefreshToken });
            console.log({ refreshToken });
            if (refreshToken !== storedRefreshToken) {
              throw createError.Unauthorized();
            }
            return resolve(userId);
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
