const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Validation Error messages stored
const emptyErr = `must not be empty`;
const subfolderNameExistsErr = 'Subfolder name exists already';

// Custom Validators

// Checks the database if a folder already exists by the passed name, uses the 'req' object to get the parentFolderId to search through
// Throws an error if data is found
const subfolderNameExists = async(value, { req }) => {
  console.log("Validating subfolder name....");
  console.log(value);
  console.log(req.body);
  let data = await queries.getFolderByNameInsideAFolder(parseInt(req.body.parentFolderId), value);
  console.log('Folder exists...?', data);
  if(data){
    throw new Error(`${value} ${subfolderNameExistsErr}`)
  }
  return true;
}

// Custom validator to check if the new passed value is not the same as the previous one, then checks if there is already a folder name as the new passed value
// Will throw an error if there is
const notSameAndValidSubfolderName = async(value,  { req }) => {
  let previousFolderData = await queries.getFolderById(parseInt(req.body.folder_id));
  if(value !== previousFolderData.name){
    const data = await queries.getFolderByNameInsideAFolder(parseInt(req.body.parent_folder_id), value);
    if(data){
      throw new Error(`${value} ${subfolderNameExistsErr}`);
    } 
  } 
  return true;
}

// Validation
// Uses methods from express-validator package
validateFolder = [
  body("folder_name").trim().notEmpty().withMessage(`Folder name ${emptyErr}`).custom(subfolderNameExists),
  body("parentFolderId").trim().notEmpty().withMessage(`Parent folder id ${emptyErr}`),
  body("previous_url").trim().notEmpty().withMessage(`Previous Url ${emptyErr}`)
];

validateEditFolder = [
  body("folder_name")
    .trim()
    .notEmpty().withMessage(`Folder name ${emptyErr}`)
   .custom(notSameAndValidSubfolderName),
  body("parent_folder_id")
    .trim()
    .notEmpty().withMessage(`Parent Folder Id ${emptyErr}`),
  body("folder_id")
    .trim()
    .notEmpty().withMessage(`Folder Id ${emptyErr}`),
  body("previous_url")
    .trim()
    .notEmpty().withMessage(`Previous Url ${emptyErr}`)
  
]

// Post Routes

// Handler for POST route of '/drive/folder/new'
// Uses middleware of isAuth to check if current user in session is authorized
// Uses middleware of validateFolder to validate the sent data from req.body to the route
// Checks for validation errors using method from express validator ( validationResult ), renders an error page if theres a validation errors
// Then creates data in the DB using a query
// Redirects to the previous url
module.exports.newFolderPostRoute = [
  isAuth,
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("404", {
        title: "404",
        errors: errors.array(),
        savedUrl: req.body.previous_url
      });
    }

    const { folder_name , parentFolderId , previous_url } = matchedData(req);

    // console.log(req.body);
    // console.log(req.user);
    await queries.createSubFolderByParentId(
      folder_name,
      req.user.id,
      parseInt(parentFolderId)
    );
    res.redirect(previous_url);
  },
];

// Handler for POST route of '/drive/folder/:folderId
// Uses isAuth middleware
// Similar to the handler for the GET route, with a differece of having a sortOrder object and conditional query to get the actual folder data
module.exports.folderIdPostRoute = [
  isAuth,
  async(req, res, next) => {
    console.log("Folder Id Post Route...");
    // const folder = await queries.getFolderById(parseInt(req.params.folderId));
    const currentUser = await queries.getCurrentUserById(req.user.id);
    const urlWithoutQuery = req.baseUrl + req.path;
    const isEditing = req.query.mode === 'edit';
    const isSharing = !!req.query.sharing;
    
  
    let sortOrder = ( req.body.isAsc === "true" ) ? "false" : "true";
    console.log(sortOrder);
    let folder;
    if(req.body._method === 'SORT'){
      folder = await queries.getFolderById(parseInt(req.params.folderId), req.body.colName, req.body.isAsc);
    } else {
      folder = await queries.getFolderById(parseInt(req.params.folderId));
    }

    let data = [...folder.subfolders, ...folder.files];
    console.log("Showing data...", data);

    // Creating the nav object
    let flag = true;
    let nav = [];
    let targetFolderId = req.params.folderId;
    while(flag){
      let currFolder = await queries.getFolderById(parseInt(targetFolderId));
      // console.log(currFolder);
      nav.unshift({id: currFolder.id, name: currFolder.name});
      targetFolderId = currFolder.parentId;
      if(currFolder.parentId === null) {
        flag = false;
      } 
    }

    res.render("pages/folder/folderId", {
      title: "Folder",
      folderId: folder.id,
      user: currentUser,
      data: data,
      nav: nav,
      savedUrl: req.originalUrl,
      urlWithoutQuery, urlWithoutQuery,
      isEditing: isEditing,
      targetId: parseInt(req.query.targetId),
      sortOrder: sortOrder,
      isSharing: isSharing,
      shareId: req.query.sharing
    });
  }
]

// POST route handler for '/drive/folder/:folderId/edit'
// Uses middlewares such as: isAuth and validateEditFolder
// Checks for errors in validation, renders an error page if there is
// Changes the folder name if no validation error then redirects to the previousUrl
module.exports.editFolderIdPostRoute = [
  isAuth,
  validateEditFolder,
  async(req, res, next) => {
    console.log('Edit post route');
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("404", {
        title: "404",
        errors: errors.array(),
        savedUrl: req.body.previous_url
      })
    }

    const { folder_name , parent_folder_id , folder_id, previous_url } = matchedData(req);

    await queries.editNameOfFolderById(parseInt(folder_id), folder_name)
    res.redirect(previous_url);
    
  }
]

// POST route handler for '/drive/folder/:folderId/delete'
// Handles delete request of folders then redirects to the specified url
module.exports.deleteFolderIdPostRoute = [
  isAuth,
  async (req, res, next) => {
    const folderId = req.params.folderId
    console.log("Folder Id", folderId);
    console.log(req.body);
    if(req.body._method === "DELETE"){
      await queries.deleteFolderById(parseInt(folderId));
    }
    res.redirect(req.body.previousUrl);
  }
]

// Get Route

// Route handler for GET route for '/drive/folder/:folderId'
// Uses isAuth middleware
// Creates multiple objects/data to pass on to the view to render including
// A nav object to create the navigation heading for the folders
// Also checks if theres a query parameter, for editing and sharing features
module.exports.folderIdGetRoute = [
  isAuth,
  async (req, res, next) => {
    const folder = await queries.getFolderById(parseInt(req.params.folderId));
    const currentUser = await queries.getCurrentUserById(req.user.id);
    const urlWithoutQuery = req.baseUrl + req.path;
    const isEditing = req.query.mode === 'edit';
    const isSharing = !!req.query.sharing;

    let data = [...folder.subfolders, ...folder.files];

    // Creating the nav object
    let flag = true;
    let nav = [];
    let targetFolderId = req.params.folderId;
    while(flag){
      let currFolder = await queries.getFolderById(parseInt(targetFolderId));
      console.log(currFolder);
      nav.unshift({id: currFolder.id, name: currFolder.name});
      targetFolderId = currFolder.parentId;
      if(currFolder.parentId === null) {
        flag = false;
      } 
    }
    
    // console.log("Folder id...", req.params.folderId);
    // console.log(folder);
    // console.log(`Showing nav:`, nav);
    // console.log("Displaying Current url", req.originalUrl);

    res.render("pages/folder/folderId", {
      title: "Folder",
      folderId: folder.id,
      user: currentUser,
      data: data,
      nav: nav,
      savedUrl: req.originalUrl,
      urlWithoutQuery, urlWithoutQuery,
      isEditing: isEditing,
      targetId: parseInt(req.query.targetId),
      isSharing: isSharing,
      shareId: req.query.sharing
    });
  },
];
