import {Router} from 'express';
import {
    createCar,
    deleteCar,
    getCarById,
    getMyCars,
    updateCar,
} from './car.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {
    carIdParamsSchema,
    createCarSchema,
    updateCarSchema,
} from './car.validation';

const router = Router();

router.post('/', protect, validate(createCarSchema), createCar);
router.get('/', protect, getMyCars);
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
