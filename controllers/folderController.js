const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Post Route
module.exports.newFolderPostRoute = [
  isAuth,
  async (req, res, next) => {
    console.log(req.body);
    console.log(req.user);
    await queries.createSubFolderByParentId(req.body.folder_name, req.user.id, parseInt(req.body.parentFolderId));
    res.redirect('/drive/my-drive');
  },
];

// Get Route

module.exports.folderIdGetRoute = [
  isAuth,
  async (req, res, next) => {
    
    console.log("Folder id...", req.params.folderId);
    res.render('pages/folder/folderId', {
      title: 'Folder'
    });
  }
]
