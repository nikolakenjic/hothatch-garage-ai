import {NOT_FOUND} from '../../constants/http';
import {AppError} from '../../utils/AppError';
import {Car} from '../car/car.model';
import {findOwnedCarOrFail} from '../car/car.service';
import {Modification} from './modification.model';
import {
    CreateModificationInput,
    UpdateModificationInput,
} from './modification.validation';

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

    return Modification.find({car: carId}).sort({createdAt: -1}).lean();
};

export const findOwnedModificationOrFail = async (
    modificationId: string,
    userId: string,
) => {
    const modification = await Modification.findById(modificationId);

    if (!modification) {
        throw new AppError('Modification not found', NOT_FOUND);
    }

    const ownedCar = await Car.exists({
        _id: modification.car,
        user: userId,
    });

    if (!ownedCar) {
        throw new AppError('Modification not found', NOT_FOUND);
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
    const userCars = await Car.find({user: userId}).select('_id').lean();

    const carIds = userCars.map((car) => car._id);

    if (carIds.length === 0) {
        return {
            totalModifications: 0,
            totalSpent: 0,
            installedCount: 0,
            plannedCount: 0,
            orderedCount: 0,
            removedCount: 0,
        };
    }

    const [summary] = await Modification.aggregate([
        {
            $match: {
                car: {$in: carIds},
            },
        },
        {
            $group: {
                _id: null,
                totalModifications: {$sum: 1},
                totalSpent: {$sum: {$ifNull: ['$cost', 0]}},
                installedCount: {
                    $sum: {
                        $cond: [{$eq: ['$status', 'installed']}, 1, 0],
                    },
                },
                plannedCount: {
                    $sum: {
                        $cond: [{$eq: ['$status', 'planned']}, 1, 0],
                    },
                },
                orderedCount: {
                    $sum: {
                        $cond: [{$eq: ['$status', 'ordered']}, 1, 0],
                    },
                },
                removedCount: {
                    $sum: {
                        $cond: [{$eq: ['$status', 'removed']}, 1, 0],
                    },
                },
            },
        },
    ]);

    return {
        totalModifications: summary?.totalModifications ?? 0,
        totalSpent: summary?.totalSpent ?? 0,
        installedCount: summary?.installedCount ?? 0,
        plannedCount: summary?.plannedCount ?? 0,
        orderedCount: summary?.orderedCount ?? 0,
        removedCount: summary?.removedCount ?? 0,
    };
};

export const getModificationCostByCategoryService = async (userId: string) => {
    const userCars = await Car.find({user: userId}).select('_id').lean();

    const carIds = userCars.map((car) => car._id);

    if (carIds.length === 0) {
        return {};
    }

    const result = await Modification.aggregate([
        {
            $match: {
                car: {$in: carIds},
            },
        },
        {
            $group: {
                _id: '$category',
                totalCost: {
                    $sum: {$ifNull: ['$cost', 0]},
                },
            },
        },
    ]);

    return result.reduce<Record<string, number>>((acc, item) => {
        acc[item._id] = item.totalCost;
        return acc;
    }, {});
};

export const getRecentModificationsService = async (
    userId: string,
    limit = 10,
) => {
    const userCars = await Car.find({user: userId}).select('_id');

    const carIds = userCars.map((car) => car._id);

    return Modification.find({
        car: {$in: carIds},
    })
        .sort({installedAt: -1, createdAt: -1})
        .limit(limit)
        .lean();
};
