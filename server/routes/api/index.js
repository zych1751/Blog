const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../middlewares/adminAuth');

router.use('/account', require('./account'));

router.post('/post', adminAuthMiddleware);
router.delete('/post', adminAuthMiddleware);
router.put('/post', adminAuthMiddleware);
router.use('/post', require('./post'));

router.post('/category', adminAuthMiddleware);
router.delete('/category', adminAuthMiddleware);
router.put('/category', adminAuthMiddleware);
router.use('/category', require('./category'));

//router.post('/image', adminAuthMiddleware);
router.use('/image', require('./image'));

module.exports = router;
