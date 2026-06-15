import {AppError} from '../../utils/AppError';
import {Car} from './car.model';

type CreateCarInput = {
    brand: string;
    model: string;
    year: number;
};

type UpdateCarInput = Partial<CreateCarInput>;

export const createCarService = async (
    userId: string,
    data: CreateCarInput,
) => {
    return Car.create({
        user: userId,
        ...data,
    });
};

export const getMyCarsService = async (userId: string) => {
    return Car.find({user: userId});
};

export const findOwnedCarOrFail = async (carId: string, userId: string) => {
    const car = await Car.findById(carId);

    if (!car) {
        throw new AppError('Car not found', 404);
    }

    if (car.user.toString() !== userId) {
        throw new AppError('Not authorized', 403);
    }

    return car;
};

export const updateCarService = async (
    carId: string,
    userId: string,
    data: UpdateCarInput,
) => {
    const car = await findOwnedCarOrFail(carId, userId);

    if (data.brand !== undefined) car.set('brand', data.brand);
    if (data.model !== undefined) car.set('model', data.model);
    if (data.year !== undefined) car.set('year', data.year);

    await car.save();

    return car;
};

export const deleteCarService = async (carId: string, userId: string) => {
    const car = await findOwnedCarOrFail(carId, userId);

    await car.deleteOne();
};
