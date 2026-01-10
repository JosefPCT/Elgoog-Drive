const { Router } = require('express');

const controller = require('../controllers/sharecontroller');
const router = Router();

// POST Route

// GET Route

router.get('/:id', controller.shareIdGetRoute);

module.exports = router;