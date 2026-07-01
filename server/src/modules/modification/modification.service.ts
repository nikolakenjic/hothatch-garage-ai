import {AppError} from '../../utils/AppError';
import {Car} from '../car/car.model';
import {findOwnedCarOrFail} from '../car/car.service';
import {Modification} from './modification.model';

type CreateModificationInput = {
    title: string;
    description?: string;
    category:
        | 'performance'
        | 'suspension'
        | 'brakes'
        | 'wheels'
        | 'exterior'
        | 'interior'
        | 'maintenance'
        | 'other';
    status?: 'planned' | 'ordered' | 'installed' | 'removed';
    cost?: number;
    installedAt?: Date;
    brand?: string;
    partNumber?: string;
    mileage?: number;
    notes?: string;
};

type UpdateModificationInput = Partial<CreateModificationInput>;

export const createModificationService = async (
    carId: string,
    userId: string,
    data: CreateModificationInput,
) => {
    await findOwnedCarOrFail(carId, userId);

    return Modification.create({
        car: carId,
        ...data,
    });
};

export const getModificationsByCarService = async (
    carId: string,
    userId: string,
) => {
    await findOwnedCarOrFail(carId, userId);

    return Modification.find({car: carId});
};

export const findOwnedModificationOrFail = async (
    modificationId: string,
    userId: string,
) => {
    const modification = await Modification.findById(modificationId);

    if (!modification) {
        throw new AppError('Modification not found', 404);
    }

    const car = await Car.findById(modification.car);

    if (!car || car.user.toString() !== userId) {
        throw new AppError('Not authorized', 403);
    }

    return modification;
};

export const updateModificationService = async (
    modificationId: string,
    userId: string,
    data: UpdateModificationInput,
) => {
    const modification = await findOwnedModificationOrFail(
        modificationId,
        userId,
    );

    modification.set(data);
    await modification.save();

    return modification;
};

export const deleteModificationService = async (
    modificationId: string,
    userId: string,
) => {
    const modification = await findOwnedModificationOrFail(
        modificationId,
        userId,
    );

    await modification.deleteOne();
};

export const getModificationSummaryService = async (userId: string) => {
    const userCars = await Car.find({user: userId}).select('_id');

    const carIds = userCars.map((car) => car._id);

    const modifications = await Modification.find({
        car: {$in: carIds},
    });

    const totalModifications = modifications.length;

    const totalSpent = modifications.reduce(
        (sum, modification) => sum + (modification.cost ?? 0),
        0,
    );

    const installedCount = modifications.filter(
        (modification) => modification.status === 'installed',
    ).length;

    const plannedCount = modifications.filter(
        (modification) => modification.status === 'planned',
    ).length;

    const orderedCount = modifications.filter(
        (modification) => modification.status === 'ordered',
    ).length;

    const removedCount = modifications.filter(
        (modification) => modification.status === 'removed',
    ).length;

    return {
        totalModifications,
        totalSpent,
        installedCount,
        plannedCount,
        orderedCount,
        removedCount,
    };
};

export const getModificationCostByCategoryService = async (userId: string) => {
    const userCars = await Car.find({user: userId}).select('_id');

    const carIds = userCars.map((car) => car._id);

    const modifications = await Modification.find({
        car: {$in: carIds},
    });

    return modifications.reduce<Record<string, number>>((acc, modification) => {
        const category = modification.category;
        const cost = modification.cost ?? 0;

        acc[category] = (acc[category] ?? 0) + cost;

        return acc;
    }, {});
};
