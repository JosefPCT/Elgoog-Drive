const { Router } = require('express');

const controller = require('../controllers/driveController');

const router = Router();

router.get('/', controller.driveGetRoute);
router.post('/', controller.drivePostRoute);

module.exports = router;

