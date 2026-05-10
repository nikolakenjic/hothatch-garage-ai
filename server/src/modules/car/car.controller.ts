import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {
    createCarService,
    deleteCarService,
    getCarIfOwned,
    getMyCarsService,
    updateCarService,
} from './car.service';
import {CREATED, OK} from '../../constants/http';

export const createCar = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;

    const car = await createCarService(userId, req.body);

    res.status(CREATED).json({
        message: 'Car created successfully',
        car,
    });
});

export const getMyCars = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;

    const cars = await getMyCarsService(userId);

    res.status(OK).json({
        message: 'Cars fetched successfully',
        count: cars.length,
        cars,
    });
});

export const getCarById = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.id as string;
    const userId = (req.user as any).userId;

    const car = await getCarIfOwned(carId, userId);

    res.status(OK).json({
        message: 'Car fetched successfully',
        car,
    });
});

export const updateCar = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.id as string;
    const userId = (req.user as any).userId;

    const car = await updateCarService(carId, userId, req.body);

    res.status(OK).json({
        message: 'Car updated successfully',
        car,
    });
});

export const deleteCar = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.id as string;
    const userId = (req.user as any).userId;

    await deleteCarService(carId, userId);

    res.status(OK).json({
        message: 'Car deleted successfully',
    });
});
