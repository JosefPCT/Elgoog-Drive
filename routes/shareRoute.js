const { Router } = require('express');

const controller = require('../controllers/sharecontroller');
const router = Router();

// POST Route

router.post('/new', controller.newSharePostRoute);
// GET Route

router.get('/:id', controller.shareIdGetRoute);

router.get('/:id/folder/:folderId', controller.shareFolderIdGetRoute);
router.post('/:id/folder/:folderId', controller.shareFolderIdPostRoute);

router.get('/:id/file/:fileId', controller.shareFileIdGetRoute);


module.exports = router;