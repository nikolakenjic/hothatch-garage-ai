import bcrypt from 'bcryptjs';

import {AppError} from '../../utils/AppError';
import {IUser, User} from './user.model';
import {Session} from './session.model';
import {
    generateToken,
    getTokenExpiration,
    hashToken,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../../utils/token';
import {
    sendPasswordResetEmail,
    sendVerificationEmail,
} from '../../utils/email/email.service';
import {RegisterInput} from './auth.validation';
import {appAssert} from '../../utils/appAssert';
import {CONFLICT} from '../../constants/http';
import {
    BCRYPT_SALT_ROUNDS,
    EMAIL_VERIFICATION_TOKEN_TTL_MS,
} from '../../constants/auth.constants';
import {HydratedDocument} from 'mongoose';

type RegisterServiceResult = {
    user: HydratedDocument<IUser>;
    verificationEmailSent: boolean;
};

export const registerService = async ({
    email,
    password,
}: RegisterInput): Promise<RegisterServiceResult> => {
    const existingUser = await User.exists({email});

    appAssert(
        !existingUser,
        CONFLICT,
        'An account with this email already exists',
    );

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const verificationToken = generateToken();
    const verificationTokenHash = hashToken(verificationToken);

    const user = await User.create({
        email,
        passwordHash,
        emailVerificationTokenHash: verificationTokenHash,
        emailVerificationExpires: new Date(
            Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS,
        ),
    });

    let verificationEmailSent = true;

    try {
        await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
        verificationEmailSent = false;
        console.error('Failed to send verification email:', error);
    }

    return {
        user,
        verificationEmailSent,
    };
};

export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({email}).select('+passwordHash');

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
        throw new AppError('Invalid credentials', 400);
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    await Session.create({
        user: user._id,
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: getTokenExpiration(refreshToken),
    });

    return {user, accessToken, refreshToken};
};

export const getCurrentUserService = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export const refreshAccessTokenService = async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);

    const refreshTokenHash = hashToken(refreshToken);

    const session = await Session.findOne({
        refreshTokenHash,
        user: decoded.userId,
    });

    if (!session) {
        throw new AppError('Invalid session', 401);
    }

    if (session.expiresAt <= new Date()) {
        await Session.deleteOne({_id: session._id});

        throw new AppError('Session expired', 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        await Session.deleteOne({_id: session._id});

        throw new AppError('Invalid session', 401);
    }

    return signAccessToken(user._id.toString());
};

export const logoutService = async (refreshToken?: string) => {
    if (!refreshToken) {
        return;
    }

    const refreshTokenHash = hashToken(refreshToken);

    await Session.deleteOne({refreshTokenHash});
};

export const verifyEmailService = async (token: string) => {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        emailVerificationTokenHash: hashedToken,
        emailVerificationExpires: {$gt: new Date()},
    });

    if (!user) {
        throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
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
    user.emailVerificationTokenHash = hashToken(verificationToken);
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

    user.passwordResetTokenHash = hashResetToken;
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
        passwordResetTokenHash: hashedToken,
        passwordResetExpires: {$gt: new Date()},
    });

    if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    await Session.deleteMany({user: user._id});
};
