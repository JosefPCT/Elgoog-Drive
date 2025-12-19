const { Router } = require('express');

const folderRouter = require('./folderRoute');
const fileRouter = require('./fileRoute');
const controller = require('../controllers/driveController');


const router = Router();

router.get('/', controller.driveGetRoute);
router.post('/', controller.drivePostRoute);

router.get('/my-drive', controller.myDriveGetRoute);
router.post('/my-drive', controller.myDrivePostRoute);

router.use('/file', fileRouter);

router.use('/folder', folderRouter);


module.exports = router;

