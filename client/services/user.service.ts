import BaseService from '@/lib/api/base.service';
import {
    ChangePasswordInput,
    PublicProfile,
    UpdateProfileInput,
    UpdateSettingsInput,
    User,
    UserStats,
} from '@/types/user';

export type UserResponse = {
    message: string;
    user: User;
};

export type UserStatsResponse = {
    status: string;
    data: UserStats;
};

export type PublicProfileResponse = {
    status: string;
    data: {
        profile: PublicProfile;
    };
};

export default class UserService {
    static readonly ENDPOINT = '/users';

    static async updateProfile(data: UpdateProfileInput): Promise<User> {
        const response = await BaseService.update<UserResponse>(
            `${this.ENDPOINT}/me/profile`,
            data,
        );

        return response.user;
    }

    static async updateSettings(data: UpdateSettingsInput): Promise<User> {
        const response = await BaseService.update<UserResponse>(
            `${this.ENDPOINT}/me/settings`,
            data,
        );

        return response.user;
    }

    static async changePassword(data: ChangePasswordInput): Promise<void> {
        await BaseService.update(`${this.ENDPOINT}/me/password`, data);
    }

    static async deleteAccount(): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/me`);
    }

    static async getStats(): Promise<UserStats> {
        const response = await BaseService.get<UserStatsResponse>(
            `${this.ENDPOINT}/me/stats`,
        );

        return response.data;
    }

    static async getPublicProfile(username: string): Promise<PublicProfile> {
        const response = await BaseService.get<PublicProfileResponse>(
            `${this.ENDPOINT}/${username}`,
        );

        return response.data.profile;
    }
}
