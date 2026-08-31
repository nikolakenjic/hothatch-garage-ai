import {NOT_FOUND} from '../../constants/http';
import {AppError} from '../../utils/AppError';
import {Modification} from '../modification/modification.model';
import {Car} from './car.model';
import {CreateCarInput, GetMyCarsQuery, UpdateCarInput} from './car.validation';
import {AIRecommendation} from '../ai/ai.model';

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createCarService = async (
    userId: string,
    data: CreateCarInput,
) => {
    return Car.create({
        user: userId,
        ...data,
    });
};

export const getMyCarsService = async (
    userId: string,
    query: GetMyCarsQuery,
) => {
    const {page, limit} = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
        user: userId,
    };

    if (query.search) {
        const search = escapeRegex(query.search);

        filter.$or = [
            {brand: {$regex: search, $options: 'i'}},
            {model: {$regex: search, $options: 'i'}},
            {nickname: {$regex: search, $options: 'i'}},
        ];
    }

    if (query.fuelType) filter.fuelType = query.fuelType;
    if (query.transmission) filter.transmission = query.transmission;
    if (query.drivetrain) filter.drivetrain = query.drivetrain;

    const [cars, totalCars] = await Promise.all([
        Car.find(filter).sort({createdAt: -1}).skip(skip).limit(limit),
        Car.countDocuments(filter),
    ]);

    return {
        cars,
        pagination: {
            totalCars,
            currentPage: page,
            totalPages: Math.ceil(totalCars / limit),
            limit,
        },
    };
};

export const findOwnedCarOrFail = async (carId: string, userId: string) => {
    const car = await Car.findOne({
        _id: carId,
        user: userId,
    });

    if (!car) {
        throw new AppError('Car not found', NOT_FOUND);
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

    await Promise.all([
        Modification.deleteMany({car: car._id}),
        AIRecommendation.deleteMany({car: car._id}),
    ]);

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
