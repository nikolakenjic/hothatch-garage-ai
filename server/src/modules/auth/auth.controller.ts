import {Request, Response} from 'express';
import {User} from './auth.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {env} from '../../config/env';

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

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({
            message: 'Invalid credentials',
        });
    }

    const token = jwt.sign(
        {userId: user._id, email: user.email},
        env.JWT_SECRET,
        {expiresIn: '1d'},
    );

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: 'Invalid credentials',
        });
    }

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            _id: user._id,
            email: user.email,
        },
    });
};
