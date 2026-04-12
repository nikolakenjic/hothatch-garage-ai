import {Router} from 'express';
import {login, register} from './auth.controller';
import {protect} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
    res.status(200).json({
        message: 'Success',
        user: req.user,
    });
});

export default router;
