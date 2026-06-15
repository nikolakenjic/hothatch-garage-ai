import {AppError} from '../../utils/AppError';
import {Car} from '../car/car.model';
import {findOwnedCarOrFail} from '../car/car.service';
import {Modification} from './modification.model';

type CreateModificationInput = {
    name: string;
    category: string;
    price?: number;
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

    if (data.name !== undefined) modification.name = data.name;
    if (data.category !== undefined) modification.category = data.category;
    if (data.price !== undefined) modification.price = data.price;

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
