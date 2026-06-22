import {AppError} from '../../utils/AppError';
import {User} from '../auth/user.model';

type UpdateProfileInput = {
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
};

export const updateProfileService = async (
    userId: string,
    input: UpdateProfileInput,
) => {
    const allowedFields: UpdateProfileInput = {
        username: input.username?.toLowerCase(),
        displayName: input.displayName,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
    };

    const user = await User.findByIdAndUpdate(userId, allowedFields, {
        new: true,
        runValidators: true,
    }).select(
        '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -__v',
    );

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};
