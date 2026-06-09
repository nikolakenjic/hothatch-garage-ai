import BaseService from '@/lib/api/base.service';
import {Car, CreateCarInput} from '@/types/car';

type CarsResponse = {cars: Car[]};
type CarResponse = {car: Car};

export default class CarService {
    static readonly ENDPOINT = '/cars';

    static async getCars(token: string): Promise<Car[]> {
        const data = await BaseService.get<CarsResponse>(this.ENDPOINT, token);
        return data.cars;
    }

    static async getCarById(token: string, carId: string): Promise<Car> {
        const data = await BaseService.get<CarResponse>(
            `${this.ENDPOINT}/${carId}`,
            token,
        );
        return data.car;
    }

    static async createCar(token: string, body: CreateCarInput): Promise<Car> {
        const data = await BaseService.create<CarResponse>(
            this.ENDPOINT,
            body,
            token,
        );
        return data.car;
    }

    static async updateCar(
        token: string,
        carId: string,
        body: Partial<CreateCarInput>,
    ): Promise<Car> {
        const data = await BaseService.update<CarResponse>(
            `${this.ENDPOINT}/${carId}`,
            body,
            token,
        );

        return data.car;
    }

    static async deleteCar(token: string, carId: string): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/${carId}`, token);
    }
}
