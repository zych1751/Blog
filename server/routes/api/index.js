import { Router } from 'express';
import adminAuthMiddleware from '../../middlewares/adminAuth';
import account from './account';
import post from './post';
import category from './category';
import image from './image';

const router = Router();

router.use('/account', account);

router.use('/post', post);

router.use('/category', category);

router.post('/image', adminAuthMiddleware);
router.use('/image', image);

export default router;
