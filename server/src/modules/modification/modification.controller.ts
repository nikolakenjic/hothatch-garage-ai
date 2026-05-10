import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {
    createModificationService,
    deleteModificationService,
    getModificationsByCarService,
    updateModificationService,
} from './modification.service';
import {CREATED, OK} from '../../constants/http';

export const createModification = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = (req.user as any).userId;

        const modification = await createModificationService(
            carId,
            userId,
            req.body,
        );

        res.status(CREATED).json({
            message: 'Modification created successfully',
            modification,
        });
    },
);

export const getModificationsByCar = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = (req.user as any).userId;

        const modifications = await getModificationsByCarService(carId, userId);

        res.status(OK).json({
            message: 'Modifications fetched successfully',
            count: modifications.length,
            modifications,
        });
    },
);

export const updateModification = catchAsync(
    async (req: Request, res: Response) => {
        const modificationId = req.params.id as string;
        const userId = (req.user as any).userId;

        const modification = await updateModificationService(
            modificationId,
            userId,
            req.body,
        );

        res.status(OK).json({
            message: 'Modification updated successfully',
            modification,
        });
    },
);

export const deleteModification = catchAsync(
    async (req: Request, res: Response) => {
        const modificationId = req.params.id as string;
        const userId = (req.user as any).userId;

        await deleteModificationService(modificationId, userId);

        res.status(OK).json({
            message: 'Modification deleted successfully',
        });
    },
);
