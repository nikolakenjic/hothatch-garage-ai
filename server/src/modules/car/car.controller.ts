import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {
    createCarService,
    deleteCarService,
    getCarDetailsService,
    getGarageSummaryService,
    getMyCarsService,
    updateCarService,
} from './car.service';
import {CREATED, OK} from '../../constants/http';
import {getUserId} from '../../utils/getUser';
import {GetMyCarsQuery} from './car.validation';

export const createCar = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const car = await createCarService(userId, req.body);

    res.status(CREATED).json({
        message: 'Car created successfully',
        car,
    });
});

export const getMyCars = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const query = req.query as unknown as GetMyCarsQuery;

    const result = await getMyCarsService(userId, query);

    res.status(OK).json({
        message: 'Cars fetched successfully',
        data: result,
    });
});

export const getCarById = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.id as string;
    const userId = getUserId(req);

    const carDetails = await getCarDetailsService(carId, userId);

    res.status(OK).json({
        message: 'Car details fetched successfully',
        data: carDetails,
    });
});

export const updateCar = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.id as string;
    const userId = getUserId(req);

    const car = await updateCarService(carId, userId, req.body);

    res.status(OK).json({
        message: 'Car updated successfully',
        data: {
            car,
        },
    });
});

export const deleteCar = catchAsync(async (req: Request, res: Response) => {
    const carId = req.params.id as string;
    const userId = getUserId(req);

    await deleteCarService(carId, userId);

    res.status(OK).json({
        message: 'Car deleted successfully',
    });
});

export const getGarageSummary = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getUserId(req);

        const summary = await getGarageSummaryService(userId);

        res.status(OK).json({
            message: 'Garage summary fetched successfully',
            data: {
                summary,
            },
        });
    },
);
