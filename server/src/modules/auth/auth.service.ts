import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {env} from '../../config/env';
import {AppError} from '../../utils/AppError';
import {User} from './user.model';
import {Session} from './session.model';
import {
    generateToken,
    hashToken,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../../utils/token';
import crypto from 'crypto';
import {
    sendPasswordResetEmail,
    sendVerificationEmail,
} from '../../utils/email/email.service';

export const registerService = async (email: string, password: string) => {
    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = generateToken();
    const hashedVerificationToken = hashToken(verificationToken);

    const user = await User.create({
        email,
        password: hashedPassword,
        isEmailVerified: false,
        emailVerificationToken: hashedVerificationToken,
        emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    });

    await sendVerificationEmail(user.email, verificationToken);

    return {user};
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

    await Session.create({
        user: user._id,
        refreshToken,
    });

    return {user, accessToken, refreshToken};
};

export const getCurrentUserService = async (userId: string) => {
    const user = await User.findById(userId).select(
        '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires',
    );

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export const refreshAccessTokenService = async (refreshToken: string) => {
    // verify Refresh token.
    const decoded = verifyRefreshToken(refreshToken);
    // find session
    const session = await Session.findOne({refreshToken});
    if (!session) {
        throw new AppError('Session not found', 401);
    }
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

export const logoutService = async (refreshToken?: string) => {
    if (refreshToken) {
        await Session.deleteOne({refreshToken});
    }
};

export const verifyEmailService = async (token: string) => {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: {$gt: new Date()},
    });

    if (!user) {
        throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return user;
};

export const resendVerificationService = async (email: string) => {
    const user = await User.findOne({email});

    if (!user) {
        return;
    }

    if (user.isEmailVerified) {
        return;
    }

    const verificationToken = generateToken();
    user.emailVerificationToken = hashToken(verificationToken);
    user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
};

export const forgotPasswordService = async (email: string) => {
    const user = await User.findOne({email});

    if (!user) {
        return;
    }

    const resetToken = generateToken();
    const hashResetToken = hashToken(resetToken);

    user.passwordResetToken = hashResetToken;
    user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 15);

    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);
};

export const resetPasswordService = async (
    token: string,
    newPassword: string,
) => {
    const hashedToken = hashToken(token);
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: new Date()},
    });

    if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return user;
};
