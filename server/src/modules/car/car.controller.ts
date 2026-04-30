import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {AppError} from '../../utils/AppError';
import {Car} from './car.model';

export const createCar = catchAsync(async (req: Request, res: Response) => {
    const {brand, model, year} = req.body;

    const userId = (req.user as any).userId;

    const car = await Car.create({
        user: userId,
        brand,
        model,
        year,
    });

    res.status(201).json({
        message: 'Car created successfully',
        car,
    });
});

export const getMyCars = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;

    const cars = await Car.find({user: userId});

    res.status(200).json({
        message: 'Cars fetched successfully',
        count: cars.length,
        cars,
    });
});

export const getCarById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = (req.user as any).userId;

    const car = await Car.findById(id);

    if (!car) {
        throw new AppError('Car not found', 404);
    }

    if (car.user.toString() !== userId) {
        throw new AppError('Not authorized to access this car', 403);
    }

    res.status(200).json({
        message: 'Car fetched successfully',
        car,
    });
});

export const updateCar = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = (req.user as any).userId;

    const car = await Car.findById(id);

    if (!car) {
        throw new AppError('Car not found', 404);
    }

    if (car.user.toString() !== userId) {
        throw new AppError('Not authorized to update this car', 403);
    }

    const {brand, model, year} = req.body;

    car.brand = brand ?? car.brand;
    car.model = model ?? car.model;
    car.year = year ?? car.year;

    await car.save();

    res.status(200).json({
        message: 'Car updated successfully',
        car,
    });
});

export const deleteCar = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = (req.user as any).userId;

    const car = await Car.findById(id);

    if (!car) {
        throw new AppError('Car not found', 404);
    }

    if (car.user.toString() !== userId) {
        throw new AppError('Not authorized to delete this car', 403);
    }

    await car.deleteOne();

    res.status(200).json({
        message: 'Car deleted successfully',
    });
});
