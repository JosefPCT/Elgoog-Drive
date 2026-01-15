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
    const isSharing = !!req.query.sharing;

    console.log(isSharing);
    if(isSharing){
      const data = await queries.findShareDataById(req.query.sharing);
      console.log('Getting share data...', data);
      let createdAt = data.createdAt;

      const differenceInMilliSeconds = Date.now() - createdAt;

      const oneSecond = 1000;
      const oneMinute = oneSecond * 60;
      const oneHour = oneMinute * 60;
      const oneDay = oneHour * 24;

      const differenceInSeconds = differenceInMilliSeconds / oneSecond;
      const diffInMins = differenceInMilliSeconds / oneMinute;
      const diffInHours = differenceInMilliSeconds / oneHour;
      const diffInDays = differenceInMilliSeconds / oneDay;

      console.log("Difference in days", diffInDays);

      if(data.expiry > diffInDays){
        console.log("Not expired");
      }
    }
   
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

    console.log("Testing data...");

    // Test for checking expirt of shared folder
    // data.forEach((item) => {
    //   console.log('Created At');
    //   let x = item.createdAt ? item.createdAt : item.uploadedAt;
    //   // console.log(x.getTime());
    //   console.log(x);

    //   const differenceInMilliSeconds = Date.now() - x;

    //   // Converion Factors
    //   const oneSecond = 1000;
    //   const oneMinute = oneSecond * 60;
    //   const oneHour = oneMinute * 60;
    //   const oneDay = oneHour * 24;

    //   const differenceInSeconds = differenceInMilliSeconds / oneSecond;
    //   const diffInMins = differenceInMilliSeconds / oneMinute;
    //   const diffInHours = differenceInMilliSeconds / oneHour;
    //   const diffInDays = differenceInMilliSeconds / oneDay;

    //   console.log('Diff in days', diffInDays);
    // })

    res.render('myDrive', {
        title: 'My Drive',
        folderId: myDrive.id,
        user: currentUser,
        data: data,
        currentUrl: req.originalUrl,
        urlWithoutQuery: urlWithoutQuery,
        isEditing: isEditing,
        targetId: parseInt(req.query.targetId),
        files: myDrive.files,
        isSharing: isSharing,
        shareId: req.query.sharing
    });
  },
];
