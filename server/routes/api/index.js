const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../middlewares/adminAuth');

router.use('/account', require('./account'));

router.use('/post', require('./post'));

router.use('/category', require('./category'));

router.post('/image', adminAuthMiddleware);
router.use('/image', require('./image'));

module.exports = router;
