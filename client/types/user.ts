export type ThemePreference = 'light' | 'dark' | 'system';

export type UserPreferences = {
    theme: ThemePreference;
    emailNotifications: boolean;
};

export type UserPrivacy = {
    publicProfile: boolean;
    publicGarage: boolean;
};

export type User = {
    id: string;
    email: string;
    isEmailVerified: boolean;
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    preferences: UserPreferences;
    privacy: UserPrivacy;
    createdAt: string;
    updatedAt: string;
};

export type UpdateProfileInput = {
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
};

export type UpdateSettingsInput = {
    preferences?: Partial<UserPreferences>;
    privacy?: Partial<UserPrivacy>;
};

export type ChangePasswordInput = {
    currentPassword: string;
    newPassword: string;
};

export type UserStats = {
    totalCars: number;
    totalModifications: number;
    totalMoneySpent: number;
};

export type PublicProfile = {
    id: string;
    username: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: string;
    publicGarage: boolean;
};

export type PublicCar = {
    id: string;
    brand: string;
    model: string;
    year: number;
    nickname?: string;
    fuelType?: string;
    horsepower?: number;
    torque?: number;
    transmission?: string;
    drivetrain?: string;
    createdAt: string;
};

export type PublicProfileStats = {
    totalCars: number;
    totalModifications: number;
    totalMoneySpent: number;
};

export type PublicProfileResponse = {
    message: string;
    profile: PublicProfile;
    stats: PublicProfileStats | null;
    cars: PublicCar[];
};
