import {Router} from 'express';
import {
    createCar,
    deleteCar,
    getCarById,
    getGarageSummary,
    getMyCars,
    updateCar,
} from './car.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {
    carIdParamsSchema,
    createCarSchema,
    getMyCarsQuerySchema,
    updateCarSchema,
} from './car.validation';

const router = Router();

router.post('/', protect, validate(createCarSchema), createCar);
router.get('/', protect, validate(getMyCarsQuerySchema, 'query'), getMyCars);
router.get('/summary', protect, getGarageSummary);
router.get('/:id', protect, validate(carIdParamsSchema, 'params'), getCarById);

router.patch(
    '/:id',
    protect,
    validate(carIdParamsSchema, 'params'),
    validate(updateCarSchema),
    updateCar,
);
router.delete(
    '/:id',
    protect,
    validate(carIdParamsSchema, 'params'),
    deleteCar,
);

export default router;
