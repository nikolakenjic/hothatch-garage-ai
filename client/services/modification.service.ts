import BaseService from '@/lib/api/base.service';
import {Modification, CreateModificationInput} from '@/types/modification';
import {AxiosRequestConfig} from 'axios';

type ModificationsResponse = {
    message: string;
    count: number;
    data: {
        modifications: Modification[];
    };
};

type ModificationResponse = {
    message: string;
    data: {
        modification: Modification;
    };
};

export default class ModificationService {
    static readonly ENDPOINT = '/modifications';

    static async getModifications(
        carId: string,
        config?: AxiosRequestConfig,
    ): Promise<Modification[]> {
        const response = await BaseService.get<ModificationsResponse>(
            `${this.ENDPOINT}/${carId}`,
            config,
        );

        return response.data.modifications;
    }

    static async createModification(
        carId: string,
        data: CreateModificationInput,
        config?: AxiosRequestConfig,
    ): Promise<Modification> {
        const response = await BaseService.create<ModificationResponse>(
            `${this.ENDPOINT}/${carId}`,
            data,
            config,
        );

        return response.data.modification;
    }

    static async updateModification(
        modId: string,
        body: Partial<CreateModificationInput>,
        config?: AxiosRequestConfig,
    ): Promise<Modification> {
        const response = await BaseService.update<ModificationResponse>(
            `${this.ENDPOINT}/${modId}`,
            body,
            config,
        );

        return response.data.modification;
    }

    static async deleteModification(
        modId: string,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/${modId}`, config);
    }
}
