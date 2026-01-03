const { Router } = require('express');

const controller = require('../controllers/fileController');

const router = Router();

// Post Route
router.post('/new', controller.fileNewPostRoute);

// Get Route

router.get('/:fileId', controller.fileIdGetRoute);

module.exports = router;