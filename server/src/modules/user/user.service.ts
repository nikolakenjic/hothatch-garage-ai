import {AppError} from '../../utils/AppError';
import {User} from '../auth/user.model';
import bcrypt from 'bcryptjs';
import {Car} from '../car/car.model';
import {Modification} from '../modification/modification.model';
import {AIRecommendation} from '../ai/ai.model';
import {Session} from '../auth/session.model';
import {BCRYPT_SALT_ROUNDS} from '../../constants/auth.constants';
import {NOT_FOUND, UNAUTHORIZED, CONFLICT} from '../../constants/http';
import type {
    ChangePasswordInput,
    UpdateProfileInput,
    UpdateSettingsInput,
} from './user.validation';
import {toPublicProfileResponse} from './user.mapper';

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

    if (input.username) {
        const existingUser = await User.findOne({
            username: input.username.toLowerCase(),
            _id: {$ne: userId},
        });

        if (existingUser) {
            throw new AppError('Username is already taken', CONFLICT);
        }
    }

    const user = await User.findByIdAndUpdate(userId, allowedFields, {
        new: true,
        runValidators: true,
    }).select('-__v');

    if (!user) {
        throw new AppError('User not found', NOT_FOUND);
    }

    return user;
};

export const changePasswordService = async (
    userId: string,
    input: ChangePasswordInput,
) => {
    const user = await User.findById(userId).select('+passwordHash');

    if (!user) {
        throw new AppError('User not found', NOT_FOUND);
    }

    const isPasswordCorrect = await bcrypt.compare(
        input.currentPassword,
        user.passwordHash,
    );

    if (!isPasswordCorrect) {
        throw new AppError('Current password is incorrect', UNAUTHORIZED);
    }

    user.passwordHash = await bcrypt.hash(
        input.newPassword,
        BCRYPT_SALT_ROUNDS,
    );

    await user.save();

    await Session.deleteMany({user: userId});
};

export const deleteAccountService = async (userId: string) => {
    const cars = await Car.find({user: userId}).select('_id');

    const carIds = cars.map((car) => car._id);

    await Modification.deleteMany({car: {$in: carIds}});
    await AIRecommendation.deleteMany({user: userId});
    await Session.deleteMany({user: userId});
    await Car.deleteMany({user: userId});
    await User.findByIdAndDelete(userId);
};

export const getUserStatsService = async (userId: string) => {
    const cars = await Car.find({user: userId});

    const carIds = cars.map((car) => car._id);

    const modifications = await Modification.find({
        car: {$in: carIds},
    });

    const totalMoneySpent = modifications.reduce(
        (sum, mod) => sum + (mod.cost || 0),
        0,
    );

    return {
        totalCars: cars.length,
        totalModifications: modifications.length,
        totalMoneySpent,
    };
};

export const getPublicProfileService = async (username: string) => {
    const user = await User.findOne({
        username: username.toLowerCase(),
        'privacy.publicProfile': true,
    });

    if (!user || !user.username) {
        throw new AppError('Profile not found', NOT_FOUND);
    }

    const publicGarage = user.privacy?.publicGarage ?? false;

    const profile = toPublicProfileResponse({
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        publicGarage,
    });

    if (!publicGarage) {
        return {
            profile,
            stats: null,
            cars: [],
        };
    }

    const cars = await Car.find({user: user._id})
        .select(
            'brand model year nickname fuelType horsepower torque transmission drivetrain createdAt',
        )
        .sort({createdAt: -1})
        .lean();

    const carIds = cars.map((car) => car._id);

    const modifications = await Modification.find({
        car: {$in: carIds},
    }).select('car cost');

    const totalMoneySpent = modifications.reduce(
        (sum, modification) => sum + (modification.cost ?? 0),
        0,
    );

    return {
        profile,
        stats: {
            totalCars: cars.length,
            totalModifications: modifications.length,
            totalMoneySpent,
        },
        cars: cars.map((car) => ({
            id: car._id.toString(),
            brand: car.brand,
            model: car.model,
            year: car.year,
            nickname: car.nickname,
            fuelType: car.fuelType,
            horsepower: car.horsepower,
            torque: car.torque,
            transmission: car.transmission,
            drivetrain: car.drivetrain,
            createdAt: car.createdAt,
        })),
    };
};

export const updateSettingsService = async (
    userId: string,
    input: UpdateSettingsInput,
) => {
    const update: Record<string, unknown> = {};

    if (input.preferences?.theme !== undefined) {
        update['preferences.theme'] = input.preferences.theme;
    }

    if (input.preferences?.emailNotifications !== undefined) {
        update['preferences.emailNotifications'] =
            input.preferences.emailNotifications;
    }

    if (input.privacy?.publicProfile !== undefined) {
        update['privacy.publicProfile'] = input.privacy.publicProfile;
    }

    if (input.privacy?.publicGarage !== undefined) {
        update['privacy.publicGarage'] = input.privacy.publicGarage;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {$set: update},
        {
            new: true,
            runValidators: true,
        },
    ).select(' -__v');

    if (!user) {
        throw new AppError('User not found', NOT_FOUND);
    }

    return user;
};
