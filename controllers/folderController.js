const { body, validationResult, matchedData } = require("express-validator");

const queries = require('../db/queries');
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Post Route
module.exports.newFolderPostRoute = async(req, res, next) => {
  console.log(req.body);
  res.send('New Folder');
}