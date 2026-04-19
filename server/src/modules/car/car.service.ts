import {Car} from './car.model';

export const getCarIfOwned = async (carId: string, userId: string) => {
    const car = await Car.findById(carId);

    if (!car) {
        return {error: 'Car not found', status: 404};
    }

    if (car.user.toString() !== userId) {
        return {error: 'Not authorized', status: 403};
    }

    return {car};
};
