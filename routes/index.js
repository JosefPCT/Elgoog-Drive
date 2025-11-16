const { Router } = require('express');

const controller = require('../controllers/indexController');

const router = Router();

router.get("/", controller.indexGetRoute);

module.exports = router;

