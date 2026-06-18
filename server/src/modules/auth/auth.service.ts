import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {env} from '../../config/env';
import {AppError} from '../../utils/AppError';
import {User} from './auth.model';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../../utils/token';

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

    // const token = jwt.sign(
    //     {userId: user._id, email: user.email},
    //     env.JWT_SECRET,
    //     {expiresIn: '1d'},
    // );

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    return {user, accessToken, refreshToken};
};

export const getCurrentUserService = async (userId: string) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export const refreshAccessTokenService = async (refreshToken: string) => {
    // verify Refresh token.
    const decoded = verifyRefreshToken(refreshToken);
    // find User
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    // create new access token
    const accessToken = signAccessToken(user._id.toString());
    // return access token
    return accessToken;
};
