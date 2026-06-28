import {AppError} from '../../utils/AppError';
import {Car} from './car.model';

type CreateCarInput = {
    brand: string;
    model: string;
    year: number;
    nickname?: string;
    fuelType?: 'petrol' | 'diesel' | 'hybrid' | 'electric';
    horsepower?: number;
    torque?: number;
    transmission?: 'manual' | 'automatic' | 'dsg';
    drivetrain?: 'fwd' | 'rwd' | 'awd';
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

    car.set(data);

    await car.save();

    return car;
};

export const getCarDetailsService = async (carId: string, userId: string) => {
    const car = await findOwnedCarOrFail(carId, userId);

    return {
        car,
    };
};

export const deleteCarService = async (carId: string, userId: string) => {
    const car = await findOwnedCarOrFail(carId, userId);

    await car.deleteOne();
};

export const getGarageSummaryService = async (userId: string) => {
    const cars = await Car.find({user: userId});

    const totalCars = cars.length;

    const totalHorsepower = cars.reduce(
        (sum, car) => sum + (car.horsepower || 0),
        0,
    );

    const carsWithHorsepower = cars.filter((car) => car.horsepower);

    const averageHorsepower =
        carsWithHorsepower.length > 0
            ? Math.round(totalHorsepower / carsWithHorsepower.length)
            : 0;

    const newestCar = cars.length
        ? cars.reduce((newest, car) => (car.year > newest.year ? car : newest))
        : null;

    const oldestCar = cars.length
        ? cars.reduce((oldest, car) => (car.year < oldest.year ? car : oldest))
        : null;

    return {
        totalCars,
        totalHorsepower,
        averageHorsepower,
        newestCar,
        oldestCar,
    };
};
