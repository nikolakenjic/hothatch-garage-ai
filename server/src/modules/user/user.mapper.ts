import {IUser} from '../auth/user.model';

type PublicProfileMapperInput = {
    id: string;
    username: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    publicGarage: boolean;
};

export const toUserResponse = (user: IUser) => ({
    id: user._id.toString(),
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    preferences: {
        theme: user.preferences?.theme ?? 'system',
        emailNotifications: user.preferences?.emailNotifications ?? true,
    },
    privacy: {
        publicProfile: user.privacy?.publicProfile ?? true,
        publicGarage: user.privacy?.publicGarage ?? false,
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const toPublicProfileResponse = ({
    id,
    username,
    displayName,
    bio,
    avatarUrl,
    createdAt,
    publicGarage,
}: PublicProfileMapperInput) => ({
    id,
    username,
    displayName,
    bio,
    avatarUrl,
    createdAt,
    publicGarage,
});
