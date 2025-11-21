const { Router } = require('express');

const controller = require('../controllers/folderController');

const router = Router();

// Post Route
router.post('/new', controller.newFolderPostRoute);

module.exports = router;

