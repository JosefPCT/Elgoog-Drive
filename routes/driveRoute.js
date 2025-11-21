const { Router } = require('express');

const controller = require('../controllers/driveController');

const router = Router();

router.get('/', controller.driveGetRoute);
router.post('/', controller.drivePostRoute);

router.get('/my-drive', controller.myDriveGetRoute);

module.exports = router;

