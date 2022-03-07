const multer = require("multer");
const path = require("path");
const DatauriParser = require("datauri/parser");

function checkFileTypes(req, file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;

  //Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    req.fileValidationError = "Error: Images Only";
    cb(null, true);
    // return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    checkFileTypes(req, file, cb);
  },
});

const dataUri = (req) => {
  const parser = new DatauriParser();
  console.log(req.body);
  const ext = path.extname(req.file.originalname).toString();

  const buffer = req.file.buffer;

  const base64Image = parser.format(ext.toString(), buffer);
  return base64Image.content;
};

module.exports = { upload, dataUri };
