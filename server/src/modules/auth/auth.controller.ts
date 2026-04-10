import {Request, Response} from 'express';
import {User} from './auth.model';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({email});

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists',
        });
    }

    const user = await User.create({
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        message: 'User created',
        user: {
            id: user._id,
            email: user.email,
        },
    });
};
