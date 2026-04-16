import {Request, Response} from 'express';
import {Car} from '../car/car.model';
import {Modification} from './modification.model';

export const createModification = async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const {name, category, price} = req.body;
    const userId = (req.user as any).userId;

    const car = await Car.findById(carId);

    if (!car) {
        return res.status(404).json({
            message: 'Car not found',
        });
    }

    if (car.user.toString() !== userId) {
        return res.status(403).json({
            message: 'Not authorized to add modification to this car',
        });
    }

    const modification = await Modification.create({
        car: carId,
        name,
        category,
        price,
    });

    res.status(201).json({
        message: 'Modification created successfully',
        modification,
    });
};

export const getModificationsByCar = async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const userId = (req.user as any).userId;

    const car = await Car.findById(carId);

    if (!car) {
        return res.status(404).json({
            message: 'Car not found',
        });
    }

    if (car.user.toString() !== userId) {
        return res.status(403).json({
            message: 'Not authorized to view modifications for this car',
        });
    }

    const modifications = await Modification.find({car: carId});

    res.status(200).json({
        message: 'Modifications fetched successfully',
        count: modifications.length,
        modifications,
    });
};
