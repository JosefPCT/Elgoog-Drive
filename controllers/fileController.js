const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Post Route

module.exports.fileNewPostRoute = [
  upload.single("uploaded_file"),
  async (req, res, next) => {
    console.log("Uploading a new file...");
    console.log(req.body);
    console.log("File object", req.file);
    res.send("aa");
  },
];

// Get Route
