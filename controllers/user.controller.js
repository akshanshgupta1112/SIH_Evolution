const Account = require("../models/Account");
const createError = require("http-errors");

const cloudinary = require("cloudinary").v2;
const { dataUri } = require("../helpers/multer_upload");
const saveData = require("../helpers/save_data");

const updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (req.file) {
      const base64ImageContent = dataUri(req);
      result = await cloudinary.uploader.upload(base64ImageContent, {
        folder: `social/profiles/${userId}`,
      });
    }

    let savedAccountData = {};
    switch (req.body.accountType) {
      case "individual":
        savedAccountData = await saveData.saveIndividual(req, res, next);
        break;

      case "startup":
        savedAccountData = await saveData.saveStartup(req, res, next);
        break;

      case "incubator":
        savedAccountData = await saveData.saveIncubator(req, res, next);
        break;

      case "mentor":
        savedAccountData = await saveData.saveMentor(req, res, next);
        break;

      case "corporation":
        savedAccountData = await saveData.saveCorporation(req, res, next);
        break;
      default:
        throw createError.BadRequest("Please provide the account type.");
    }

    res.status(200).json({
      success: true,
      msg: "User updated",
      data: savedAccountData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.userId == req.params.id) {
      // Finding the user using the userId
      const user = await Account.findById(req.params.id).select("+password");
      let isMatching = await user.isValidPassword(req.body.password);

      // removing this user from the follower list of other users so that their follower is not a non exisiting user.
      if (isMatching) {
        const followingUserList = await user.following;

        if (user.public_id !== "") {
          await cloudinary.uploader.destroy(user.public_id.toString(), {
            resource_type: "image",
            type: "upload",
            invalidate: true,
          });
        }

        Account.findByIdAndDelete(req.userId, (err, docs) => {
          if (err) {
            console.log(err);
            throw createError.NotFound();
          } else {
            res.status(200).json({
              success: true,
              msg: "Account Deleted Successfully",
            });
          }
        });
      } else {
        throw createError.Unauthorized();
      }
    } else {
      throw createError.Unauthorized("You can only delete your account");
    }
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const accountType = req.query.accountType.toString().toLowercase();
    const page = parseInt(req.query.page);
    const count = parseInt(req.query.count);
    let usersList = [];

    switch (accountType) {
      case "individual":
        usersList = await Account.find({ _individual: { $ne: null } })
          .skip((page - 1) * count)
          .limit(count)
          .populate("_individual");
        break;

      case "startup":
        usersList = await Account.find({ _startup: { $ne: null } })
          .skip((page - 1) * count)
          .limit(count)
          .populate("_startup");
        break;

      case "incubator":
        usersList = await Account.find({ _incubator: { $ne: null } })
          .skip((page - 1) * count)
          .limit(count)
          .populate("_incubator");
        break;

      case "mentor":
        usersList = await Account.find({ _mentor: { $ne: null } })
          .skip((page - 1) * count)
          .limit(count)
          .populate("_mentor");
        break;

      case "corporation":
        usersList = await Account.find({
          _corporation: { $ne: null },
        })
          .skip((page - 1) * count)
          .limit(count)
          .populate("_corporation");
        break;

      default:
        throw createError.BadRequest("Please provide the account type.");
    }

    res.status(200).json({
      success: true,
      msg: "Users fetched",
      data: usersList,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getAllUsers,
};
