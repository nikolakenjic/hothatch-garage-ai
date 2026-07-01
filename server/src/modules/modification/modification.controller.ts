import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {
    createModificationService,
    deleteModificationService,
    getModificationsByCarService,
    getModificationSummaryService,
    updateModificationService,
} from './modification.service';
import {CREATED, OK} from '../../constants/http';
import {getUserId} from '../../utils/getUser';

export const createModification = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = getUserId(req);

        const modification = await createModificationService(
            carId,
            userId,
            req.body,
        );

        res.status(CREATED).json({
            message: 'Modification created successfully',
            data: {
                modification,
            },
        });
    },
);

export const getModificationsByCar = catchAsync(
    async (req: Request, res: Response) => {
        const carId = req.params.carId as string;
        const userId = getUserId(req);

        const modifications = await getModificationsByCarService(carId, userId);

        res.status(OK).json({
            message: 'Modifications fetched successfully',
            count: modifications.length,
            data: {
                modifications,
            },
        });
    },
);

export const updateModification = catchAsync(
    async (req: Request, res: Response) => {
        const modificationId = req.params.id as string;
        const userId = getUserId(req);

        const modification = await updateModificationService(
            modificationId,
            userId,
            req.body,
        );

        res.status(OK).json({
            message: 'Modification updated successfully',
            data: {
                modification,
            },
        });
    },
);

export const deleteModification = catchAsync(
    async (req: Request, res: Response) => {
        const modificationId = req.params.id as string;
        const userId = getUserId(req);

        await deleteModificationService(modificationId, userId);

        res.status(OK).json({
            message: 'Modification deleted successfully',
        });
    },
);

export const getModificationSummary = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getUserId(req);

        const summary = await getModificationSummaryService(userId);

        res.status(OK).json({
            message: 'Modification summary fetched successfully',
            data: {
                summary,
            },
        });
    },
);
