import BaseService from '@/lib/api/base.service';
import {Modification, CreateModificationInput} from '@/types/modification';

type ModificationsResponse = {modifications: Modification[]};
type ModificationResponse = {modification: Modification};

export default class ModificationService {
    static readonly ENDPOINT = '/modifications';

    static async getModifications(
        token: string,
        carId: string,
    ): Promise<Modification[]> {
        const data = await BaseService.fetch<ModificationsResponse>(
            `${this.ENDPOINT}/${carId}`,
            token,
        );
        return data.modifications;
    }

    static async createModification(
        token: string,
        carId: string,
        data: CreateModificationInput,
    ): Promise<Modification> {
        const response = await BaseService.create<ModificationResponse>(
            `${this.ENDPOINT}/${carId}`,
            data,
            token,
        );
        return response.modification;
    }

    static async updateModification(
        token: string,
        modId: string,
        body: Partial<CreateModificationInput>,
    ): Promise<Modification> {
        const data = await BaseService.update<ModificationResponse>(
            `${this.ENDPOINT}/${modId}`,
            body,
            token,
        );
        return data.modification;
    }

    static async deleteModification(
        token: string,
        modId: string,
    ): Promise<void> {
        await BaseService.remove(`${this.ENDPOINT}/${modId}`, token);
    }
}
