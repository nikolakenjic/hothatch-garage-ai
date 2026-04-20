import {Router} from 'express';
import {recommendCar} from './ai.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/recommend', protect, recommendCar);

export default router;
