const { Router } = require('express');

const controller = require('../controllers/fileController');

const router = Router();

// Post Route
router.post('/new', controller.fileNewPostRoute);

module.exports = router;