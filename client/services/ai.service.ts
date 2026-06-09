import BaseService from '@/lib/api/base.service';
import {BuildPlanInput, BuildPlanResponse, Recommendation} from '@/types/ai';

export default class AiService {
    static readonly ENDPOINT = '/ai';

    static async buildPlan(
        token: string,
        carId: string,
        data: BuildPlanInput,
    ): Promise<Recommendation> {
        const response = await BaseService.create<BuildPlanResponse>(
            `${this.ENDPOINT}/build-plan/${carId}`,
            data,
            token,
        );
        return response.recommendation;
    }
}
