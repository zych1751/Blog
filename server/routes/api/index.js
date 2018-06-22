const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../middlewares/adminAuth');

router.use('/account', require('./account'));

router.post('/post', adminAuthMiddleware);
router.delete('/post', adminAuthMiddleware);
router.put('/post', adminAuthMiddleware);
router.use('/post', require('./post'));

router.use('/category', require('./category'));

module.exports = router;
