import BaseService from '@/lib/api/base.service';
import {
    BuildPlanInput,
    BuildPlanResponse,
    BuildReviewInput,
    BuildReviewResponse,
    Recommendation,
} from '@/types/ai';

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

    static async buildReview(
        token: string,
        carId: string,
        data: BuildReviewInput,
    ): Promise<Recommendation> {
        const response = await BaseService.create<BuildReviewResponse>(
            `${this.ENDPOINT}/build-review/${carId}`,
            data,
            token,
        );

        return response.recommendation;
    }
}
