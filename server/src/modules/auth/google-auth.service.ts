import {OAuth2Client} from 'google-auth-library';
import {AppError} from '../../utils/AppError';
import {User} from './user.model';
import {Session} from './session.model';
import {env} from '../../config/env';
import {CONFLICT, UNAUTHORIZED} from '../../constants/http';
import {REFRESH_TOKEN_TTL_SECONDS} from '../../constants/auth.constants';
import {hashToken, signAccessToken, signRefreshToken} from '../../utils/token';

const googleClient = new OAuth2Client();

export const googleLoginService = async (idToken: string) => {
    if (!env.GOOGLE_CLIENT_ID) {
        throw new Error('Google authentication is not configured');
    }

    let payload;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });

        payload = ticket.getPayload();
    } catch {
        throw new AppError('Invalid Google credentials', UNAUTHORIZED);
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        throw new AppError('Google account verification failed', UNAUTHORIZED);
    }

    const googleSub = payload.sub;
    const email = payload.email.toLowerCase();

    let user = await User.findOne({googleSub});

    if (!user) {
        const existingEmailUser = await User.exists({email});

        if (existingEmailUser) {
            throw new AppError(
                'An account with this email already exists. Use your existing sign-in method.',
                CONFLICT,
            );
        }

        try {
            user = await User.create({
                email,
                googleSub,
                isEmailVerified: true,
                displayName: payload.name?.slice(0, 50),
            });
        } catch (error) {
            if (
                error instanceof Error &&
                'code' in error &&
                error.code === 11000
            ) {
                throw new AppError(
                    'Account conflict. Please try again.',
                    CONFLICT,
                );
            }

            throw error;
        }
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    await Session.create({
        user: user._id,
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    });

    return {
        user,
        accessToken,
        refreshToken,
    };
};
