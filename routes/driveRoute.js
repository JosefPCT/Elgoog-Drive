const { Router } = require('express');

const folderRouter = require('./folderRoute');
const controller = require('../controllers/driveController');


const router = Router();

router.get('/', controller.driveGetRoute);
router.post('/', controller.drivePostRoute);

router.get('/my-drive', controller.myDriveGetRoute);

router.use('/folder', folderRouter);

module.exports = router;

