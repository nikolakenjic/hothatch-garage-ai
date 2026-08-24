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
import {
    BAD_REQUEST,
    CONFLICT,
    NOT_FOUND,
    UNAUTHORIZED,
    FORBIDDEN,
} from '../../constants/http';
import {
    BCRYPT_SALT_ROUNDS,
    EMAIL_VERIFICATION_TOKEN_TTL_MS,
    PASSWORD_RESET_TOKEN_TTL_MS,
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

// Pre-generated bcrypt hash of a random value — never a real user's hash.
// Used so bcrypt.compare() always runs the same expensive work, whether
// or not the account exists, so response time can't leak account existence.
const DUMMY_PASSWORD_HASH =
    '$2a$12$CwTycUXWue0Thq9StjUM0uJ8qDJnQxdT5' + 'Y2A/1a1zM9GJdN2q5F3S';

export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({email}).select('+passwordHash');

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !isPasswordCorrect) {
        throw new AppError('Invalid credentials', UNAUTHORIZED);
    }

    if (!user.isEmailVerified) {
        throw new AppError('Email verification required', FORBIDDEN);
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
        throw new AppError('User not found', NOT_FOUND);
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
        throw new AppError('Invalid session', UNAUTHORIZED);
    }

    if (session.expiresAt <= new Date()) {
        await Session.deleteOne({_id: session._id});

        throw new AppError('Session expired', UNAUTHORIZED);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        await Session.deleteOne({_id: session._id});

        throw new AppError('Invalid session', UNAUTHORIZED);
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
        throw new AppError(
            'Invalid or expired verification token',
            BAD_REQUEST,
        );
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
    user.emailVerificationExpires = new Date(
        Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS,
    );
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
    user.passwordResetExpires = new Date(
        Date.now() + PASSWORD_RESET_TOKEN_TTL_MS,
    );

    await user.save();

    try {
        await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
        console.error('Failed to send password reset email:', error);
    }
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
        throw new AppError('Invalid or expired reset token', BAD_REQUEST);
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    await Session.deleteMany({user: user._id});
};
