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

// Almost the same its GET Route, but with handling logic for sorting
module.exports.myDrivePostRoute = [
  isAuth,
  async(req, res, next) => {
    console.log('Post Route...');
    console.log(req.body);
    console.log(req.body.isAsc === 'true');

    const currentUser = await queries.getCurrentUserById(req.user.id);
    const urlWithoutQuery = req.baseUrl + req.path;
    const isEditing = req.query.mode === 'edit';

    // Have to use a string so that using `locals.sortOrder` in the view won't give false positives
    let sortOrder = ( req.body.isAsc === "true" ) ? "false" : "true";
    console.log(sortOrder);
    let myDrive;
    if(req.body._method === 'SORT'){
      myDrive = await queries.getMainDriveOfUserById(currentUser.id, req.body.colName, req.body.isAsc);
    } else {
      myDrive = await queries.getMainDriveOfUserById(currentUser.id);
    }

    let data = [...myDrive.subfolders, ...myDrive.files];

    res.render('myDrive', {
        title: 'My Drive',
        folderId: myDrive.id,
        user: currentUser,
        data: data,
        files: myDrive.files,
        currentUrl: req.originalUrl,
        urlWithoutQuery: urlWithoutQuery,
        isEditing: isEditing,
        targetId: parseInt(req.query.targetId),
        sortOrder: sortOrder
    });
  }
]


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

    // console.log("Showing Data:");
    // console.dir(myDrive);

    // console.log("Showing combined table");
    let data = [...myDrive.subfolders, ...myDrive.files];
    // console.dir(data);

    console.log("On Get Route");

    res.render('myDrive', {
        title: 'My Drive',
        folderId: myDrive.id,
        user: currentUser,
        data: data,
        files: myDrive.files,
        currentUrl: req.originalUrl,
        urlWithoutQuery: urlWithoutQuery,
        isEditing: isEditing,
        targetId: parseInt(req.query.targetId)
        
    });
  },
];
