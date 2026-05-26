import BaseService from '@/lib/api/base.service';
import {BuildPlanInput} from '@/types/ai';

type ResponseType = {recommendation: {id: string; content: string}};

export default class AiService {
    static readonly ENDPOINT = '/ai';

    static async buildPlan(
        token: string,
        carId: string,
        data: BuildPlanInput,
    ): Promise<{id: string; content: string}> {
        const response = await BaseService.create<ResponseType>(
            `${this.ENDPOINT}/build-plan/${carId}`,
            data,
            token,
        );
        return response.recommendation;
    }
}
