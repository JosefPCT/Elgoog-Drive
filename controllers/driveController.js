const { body, validationResult, matchedData } = require("express-validator");

const queries = require('../db/queries');
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Post Routes

module.exports.drivePostRoute = [
  upload.single("uploaded_file"),
  async (req, res, next) => {
    console.log(req.body);
    console.log("File object", req.file);
    res.send("aa");
  },
];



// Get Routes

module.exports.driveGetRoute = [
  isAuth,
  async (req, res, next) => {
    res.render("drive", {
      title: "My Drive",
      user: req.user,
    });
  },
];

// Gets the current user in the session and uses the id of that user to search for its main drive/folder
module.exports.myDriveGetRoute = [
  isAuth,
  async (req, res, next) => {
    const currentUser = await queries.getCurrentUserById(req.user.id);
    const myDrive = await queries.getMainDriveOfUserById(currentUser.id);
    const urlWithoutQuery = req.baseUrl + req.path;
    const isEditing = req.query.mode === 'edit';
   
    // console.log("Current data of user:", currentUser);
    // console.log('Drive', myDrive);
    // const data = await queries.getFoldersByParentId(myDrive.id)
    // console.log('Folders', data);
    // console.log(`Is Editing? ${isEditing}`);
    // console.log(req.query);
    // console.log(urlWithoutQuery);
    // console.log('Displaying Current url', req.originalUrl);
    // console.log("Display path test", req.baseUrl + req.url);

    res.render('myDrive', {
        title: 'My Drive',
        folderId: myDrive.id,
        user: currentUser,
        data: myDrive.subfolders,
        currentUrl: req.originalUrl,
        urlWithoutQuery: urlWithoutQuery,
        isEditing: isEditing,
        targetId: parseInt(req.query.targetId)
        
    });
  },
];
