const { Router } = require('express');

const controller = require('../controllers/indexController');

const router = Router();

router.get("/", controller.indexGetRoute);

router.get('/register', controller.registerGetRoute);
router.post('/register', controller.registerPostRoute);

module.exports = router;

