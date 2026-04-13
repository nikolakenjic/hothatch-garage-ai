import {Request, Response} from 'express';
import {Car} from './car.model';

export const createCar = async (req: Request, res: Response) => {
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
};

export const getMyCars = async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;

    const cars = await Car.find({user: userId});

    res.status(200).json({
        message: 'Cars fetched successfully',
        count: cars.length,
        cars,
    });
};

export const getCarById = async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = (req.user as any).userId;

    const car = await Car.findById(id);

    if (!car) {
        return res.status(404).json({
            message: 'Car not found',
        });
    }

    if (car.user.toString() !== userId) {
        return res.status(403).json({
            message: 'Not authorized to access this car',
        });
    }

    res.status(200).json({
        message: 'Car fetched successfully',
        car,
    });
};
