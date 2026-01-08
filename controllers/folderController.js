const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Validation
const emptyErr = `must not be empty`;
const subfolderNameExistsErr = 'Subfolder name exists already';

// Custom validator

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

// Post Route
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

module.exports.folderIdPostRoute = [
  isAuth,
  async(req, res, next) => {
    
  }
]

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

module.exports.folderIdGetRoute = [
  isAuth,
  async (req, res, next) => {
    const folder = await queries.getFolderById(parseInt(req.params.folderId));
    
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
    
    const urlWithoutQuery = req.baseUrl + req.path;
    const isEditing = req.query.mode === 'edit';
    
    let data = [...folder.subfolders, ...folder.files];

    // console.log("Folder id...", req.params.folderId);
    // console.log(folder);
    // console.log(`Showing nav:`, nav);
    // console.log("Displaying Current url", req.originalUrl);

    res.render("pages/folder/folderId", {
      title: "Folder",
      folderId: folder.id,
      data: data,
      nav: nav,
      savedUrl: req.originalUrl,
      urlWithoutQuery, urlWithoutQuery,
      isEditing: isEditing,
      targetId: parseInt(req.query.targetId)
    });
  },
];
