import {AppError} from '../../utils/AppError';
import {User} from '../auth/user.model';
import bcrypt from 'bcryptjs';
import {Car} from '../car/car.model';
import {Modification} from '../modification/modification.model';
import {AIRecommendation} from '../ai/ai.model';
import {Session} from '../auth/session.model';

type UpdateProfileInput = {
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
};

type ChangePasswordInput = {
    currentPassword: string;
    newPassword: string;
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

    if (input.username) {
        const existingUser = await User.findOne({
            username: input.username.toLowerCase(),
            _id: {$ne: userId},
        });

        if (existingUser) {
            throw new AppError('Username is already taken', 409);
        }
    }

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

export const changePasswordService = async (
    userId: string,
    input: ChangePasswordInput,
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isPasswordCorrect = await bcrypt.compare(
        input.currentPassword,
        user.password,
    );

    if (!isPasswordCorrect) {
        throw new AppError('Current password is incorrect', 401);
    }

    user.password = await bcrypt.hash(input.newPassword, 10);

    await user.save();
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
        (sum, mod) => sum + (mod.price || 0),
        0,
    );

    return {
        totalCars: cars.length,
        totalModifications: modifications.length,
        totalMoneySpent,
    };
};
