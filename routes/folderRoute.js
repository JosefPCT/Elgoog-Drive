const { Router } = require('express');

const controller = require('../controllers/folderController');

const router = Router();

// Post Route
router.post('/new', controller.newFolderPostRoute);
router.post('/:folderId', controller.folderIdPostRoute);
router.post('/:folderId/edit', controller.editFolderIdPostRoute);
router.post('/:folderId/delete', controller.deleteFolderIdPostRoute);

// Get Route

router.get('/:folderId', controller.folderIdGetRoute);


module.exports = router;

