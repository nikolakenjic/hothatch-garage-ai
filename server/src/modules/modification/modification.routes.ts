import {Router} from 'express';
import {
    createModification,
    deleteModification,
    getModificationsByCar,
    updateModification,
} from './modification.controller';
import {protect} from '../../middlewares/auth.middleware';
import {validate} from '../../middlewares/validate';
import {
    carIdParamsSchema,
    createModificationSchema,
    modificationIdParamsSchema,
    updateModificationSchema,
} from '../../validations/modification.validation';

const router = Router();

router.post(
    '/:carId',
    protect,
    validate(carIdParamsSchema, 'params'),
    validate(createModificationSchema),
    createModification,
);
router.get(
    '/:carId',
    protect,
    validate(carIdParamsSchema, 'params'),
    getModificationsByCar,
);
router.patch(
    '/:id',
    protect,
    validate(modificationIdParamsSchema, 'params'),
    validate(updateModificationSchema),
    updateModification,
);
router.delete(
    '/:id',
    protect,
    validate(modificationIdParamsSchema, 'params'),
    deleteModification,
);

export default router;
