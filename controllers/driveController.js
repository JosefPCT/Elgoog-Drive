const { body, validationResult, matchedData } = require("express-validator");

const prisma = require("../db/client");
const { isAuth } = require('./utils/authMiddleware');
const upload = require("../config/multer");


// Post Routes

module.exports.drivePostRoute = [
  upload.single("uploaded_file"),
  async(req, res, next) => {
    console.log(req.body);
    console.log('File object', req.file);
    res.send('aa');
  }
]

// Get Routes

module.exports.driveGetRoute = [
  isAuth,
  async(req, res, next) => {
    res.render('drive', {
      title: 'My Drive',
      user: req.user,
    })
  }
]

