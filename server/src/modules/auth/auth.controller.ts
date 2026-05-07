import {Request, Response} from 'express';
import {User} from './auth.model';
import {getMeService, loginService, registerService} from './auth.service';

export const register = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await registerService(email, password);

    res.status(201).json({
        message: 'User created',
        user: {
            id: user._id,
            email: user.email,
        },
    });
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const {user, token} = await loginService(email, password);

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            _id: user._id,
            email: user.email,
        },
    });
};

export const getMe = async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;

    const user = await getMeService(userId);

    res.status(200).json({
        message: 'Success',
        user,
    });
};
