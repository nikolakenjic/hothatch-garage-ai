import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {env} from '../../config/env';
import {AppError} from '../../utils/AppError';
import {User} from './auth.model';

export const registerService = async (email: string, password: string) => {
    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new AppError('User already exists', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
    });

    return user;
};

export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new AppError('Invalid credentials', 400);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new AppError('Invalid credentials', 400);
    }

    const token = jwt.sign(
        {userId: user._id, email: user.email},
        env.JWT_SECRET,
        {expiresIn: '1d'},
    );

    return {user, token};
};

export const getMeService = async (userId: string) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};
