import type {AxiosRequestConfig} from 'axios';

import BaseService from '@/lib/api/base.service';
import {Car, CreateCarInput, UpdateCarInput} from '@/types/car';

type CarsResponse = {
    message: string;
    data: {
        cars: Car[];
    };
};

type CarDetailsResponse = {
    message: string;
    data: {
        car: Car;
    };
};

type CreateCarResponse = {
    message: string;
    car: Car;
};

type UpdateCarResponse = {
    message: string;
    data: {
        car: Car;
    };
};

export default class CarService {
    static readonly ENDPOINT = '/cars';

    static async getCars(config?: AxiosRequestConfig): Promise<Car[]> {
        const response = await BaseService.get<CarsResponse>(
            this.ENDPOINT,
            config,
        );

        return response.data.cars;
    }

    static async getCarById(
        carId: string,
        config?: AxiosRequestConfig,
    ): Promise<Car> {
        const response = await BaseService.get<CarDetailsResponse>(
            `${this.ENDPOINT}/${carId}`,
            config,
        );

        return response.data.car;
    }

    static async createCar(
        body: CreateCarInput,
        config?: AxiosRequestConfig,
    ): Promise<Car> {
        const response = await BaseService.create<CreateCarResponse>(
            this.ENDPOINT,
            body,
            config,
        );

        return response.car;
    }

    static async updateCar(
        carId: string,
        body: UpdateCarInput,
        config?: AxiosRequestConfig,
    ): Promise<Car> {
        const response = await BaseService.update<UpdateCarResponse>(
            `${this.ENDPOINT}/${carId}`,
            body,
            config,
        );

        return response.data.car;
    }

    static async deleteCar(
        carId: string,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/${carId}`, config);
    }
}
