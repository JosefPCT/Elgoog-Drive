const { Router } = require('express');

const controller = require('../controllers/folderController');

const router = Router();

// Post Route
router.post('/new', controller.newFolderPostRoute);

// Get Route

router.get('/:folderId', controller.folderIdGetRoute);

module.exports = router;

