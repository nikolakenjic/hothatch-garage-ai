import BaseService from '@/lib/api/base.service';
import {Modification, CreateModificationInput} from '@/types/modification';
import {AxiosRequestConfig} from 'axios';

type ModificationsResponse = {
    modifications: Modification[];
};

type ModificationResponse = {
    modification: Modification;
};

export default class ModificationService {
    static readonly ENDPOINT = '/modifications';

    static async getModifications(
        carId: string,
        config?: AxiosRequestConfig,
    ): Promise<Modification[]> {
        const data = await BaseService.get<ModificationsResponse>(
            `${this.ENDPOINT}/${carId}`,
            config,
        );

        return data.modifications;
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

        return response.modification;
    }

    static async updateModification(
        modId: string,
        body: Partial<CreateModificationInput>,
        config?: AxiosRequestConfig,
    ): Promise<Modification> {
        const data = await BaseService.update<ModificationResponse>(
            `${this.ENDPOINT}/${modId}`,
            body,
            config,
        );

        return data.modification;
    }

    static async deleteModification(
        modId: string,
        config?: AxiosRequestConfig,
    ): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/${modId}`, config);
    }
}
