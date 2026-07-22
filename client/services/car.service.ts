import type {AxiosRequestConfig} from 'axios';

import BaseService from '@/lib/api/base.service';
import {Car, CreateCarInput} from '@/types/car';

type CarsResponse = {
    message: string;
    data: {
        cars: Car[];
    };
};

type CarResponse = {
    car: Car;
};

export default class CarService {
    static readonly ENDPOINT = '/cars';

    static async getCars(config?: AxiosRequestConfig): Promise<Car[]> {
        const data = await BaseService.get<CarsResponse>(this.ENDPOINT, config);

        return data.data.cars;
    }

    static async getCarById(
        carId: string,
        config?: AxiosRequestConfig,
    ): Promise<Car> {
        const data = await BaseService.get<CarResponse>(
            `${this.ENDPOINT}/${carId}`,
            config,
        );

        return data.car;
    }

    static async createCar(
        body: CreateCarInput,
        config?: AxiosRequestConfig,
    ): Promise<Car> {
        const data = await BaseService.create<CarResponse>(
            this.ENDPOINT,
            body,
            config,
        );

        return data.car;
    }

    static async updateCar(
        carId: string,
        body: Partial<CreateCarInput>,
        config?: AxiosRequestConfig,
    ): Promise<Car> {
        const data = await BaseService.update<CarResponse>(
            `${this.ENDPOINT}/${carId}`,
            body,
            config,
        );

        return data.car;
    }

    static async deleteCar(
        carId: string,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/${carId}`, config);
    }
}
