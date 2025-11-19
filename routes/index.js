const { Router } = require('express');

const controller = require('../controllers/indexController');

const router = Router();

router.get("/", controller.indexGetRoute);

router.get('/register', controller.registerGetRoute);
router.post('/register', controller.registerPostRoute);

router.get('/login', controller.loginGetRoute);
router.post('/login', controller.loginPostRoute);

router.get('/login-success', controller.loginSuccessGetRoute);
router.get('/login-failure', controller.loginFailureGetRoute);

router.get('/logout', controller.logoutGetRoute);

router.get('/protected-route', controller.protectedGetRoute);

router.get('/drive', controller.driveGetRoute);
router.post('/drive', controller.drivePostRoute);

module.exports = router;

