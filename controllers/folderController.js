const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");

// Validation
const emptyErr = `must not be empty`;

validateFolder = [
  body("folder_name").trim().notEmpty().withMessage(`Folder name ${emptyErr}`),
  body("parentFolderId").trim().notEmpty().withMessage(`Parent folder id ${emptyErr}`),
  body("previous_url").trim().notEmpty().withMessage(`Previous Url ${emptyErr}`)
];

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
        previousUrl: req.body.previous_url
      });
    }

    const { folder_name , parentFolderId , previous_url } = matchedData(req);

    console.log(req.body);
    console.log(req.user);
    await queries.createSubFolderByParentId(
      folder_name,
      req.user.id,
      parseInt(parentFolderId)
    );
    res.redirect(previous_url);
  },
];

// Get Route

module.exports.folderIdGetRoute = [
  isAuth,
  async (req, res, next) => {
    console.log("Folder id...", req.params.folderId);

    const folder = await queries.getFolderById(parseInt(req.params.folderId));
    console.log(folder);

    console.log("Displaying Current url", req.originalUrl);

    res.render("pages/folder/folderId", {
      title: "Folder",
      folderId: folder.id,
      data: folder.subfolders,
      previousUrl: req.originalUrl,
    });
  },
];
