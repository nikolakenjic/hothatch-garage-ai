import {Request, Response} from 'express';
import {Car} from '../car/car.model';
import {Modification} from './modification.model';
import {getCarIfOwned} from '../car/car.service';

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

    const result = await getCarIfOwned(carId, userId);

    if (result.error) {
        return res.status(result.status).json({
            message: result.error,
        });
    }

    const car = result.car;

    const modifications = await Modification.find({car: carId});

    res.status(200).json({
        message: 'Modifications fetched successfully',
        count: modifications.length,
        modifications,
    });
};

export const updateModification = async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = (req.user as any).userId;

    const modification = await Modification.findById(id);

    if (!modification) {
        return res.status(404).json({
            message: 'Modification not found',
        });
    }

    const car = await Car.findById(modification.car);

    if (!car || car.user.toString() !== userId) {
        return res.status(403).json({
            message: 'Not authorized to update this modification',
        });
    }

    const {name, category, price} = req.body;

    modification.name = name || modification.name;
    modification.category = category || modification.category;
    modification.price = price || modification.price;

    await modification.save();

    res.status(200).json({
        message: 'Modification updated successfully',
        modification,
    });
};

export const deleteModification = async (req: Request, res: Response) => {
    const {id} = req.params;
    const userId = (req.user as any).userId;

    const modification = await Modification.findById(id);

    if (!modification) {
        return res.status(404).json({
            message: 'Modification not found',
        });
    }

    const car = await Car.findById(modification.car);

    if (!car || car.user.toString() !== userId) {
        return res.status(403).json({
            message: 'Not authorized to delete this modification',
        });
    }

    await modification.deleteOne();

    res.status(200).json({
        message: 'Modification deleted successfully',
    });
};
