const router = require("express").Router();
const { upload } = require("../helpers/multer_upload");
const userController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../helpers/auth_jwt");

router.get("/", verifyAccessToken, userController.getAllUsers);

router.put(
  "/update",
  verifyAccessToken,
  upload.single("profileImage"),
  userController.updateUser
);

router.delete("/:id", verifyAccessToken, userController.deleteUser);

module.exports = router;
