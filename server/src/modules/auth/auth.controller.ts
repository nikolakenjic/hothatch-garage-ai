import {Request, Response} from 'express';
import {User} from './auth.model';

export const register = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists',
        });
    }

    const user = await User.create({
        email,
        password,
    });

    res.status(201).json({
        message: 'User created',
        user,
    });
};
