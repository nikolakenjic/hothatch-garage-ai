import {Request, Response} from 'express';
import {OK} from '../../constants/http';
import {catchAsync} from '../../utils/catchAsync';
import {changePasswordService, updateProfileService} from './user.service';
import {getUserId} from '../../utils/getUser';

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const user = await updateProfileService(userId, req.body);

    res.status(OK).json({
        status: 'success',
        data: {
            user,
        },
    });
});

export const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getUserId(req);

        await changePasswordService(userId, req.body);

        res.status(OK).json({
            status: 'success',
            message: 'Password changed successfully',
        });
    },
);
