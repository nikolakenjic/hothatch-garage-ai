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
