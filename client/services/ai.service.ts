import BaseService from '@/lib/api/base.service';
import {
    BuildPlanInput,
    BuildPlanResponse,
    BuildReviewInput,
    BuildReviewResponse,
    CostAnalysisInput,
    CostAnalysisResponse,
    Recommendation,
} from '@/types/ai';
import {AxiosRequestConfig} from 'axios';

export default class AiService {
    static readonly ENDPOINT = '/ai';

    static async buildPlan(
        carId: string,
        data: BuildPlanInput,
        config?: AxiosRequestConfig,
    ): Promise<Recommendation> {
        const response = await BaseService.create<BuildPlanResponse>(
            `${this.ENDPOINT}/build-plan/${carId}`,
            data,
            config,
        );

        return response.recommendation;
    }

    static async buildReview(
        carId: string,
        data: BuildReviewInput,
        config?: AxiosRequestConfig,
    ): Promise<Recommendation> {
        const response = await BaseService.create<BuildReviewResponse>(
            `${this.ENDPOINT}/build-review/${carId}`,
            data,
            config,
        );

        return response.recommendation;
    }

    static async costAnalysis(
        carId: string,
        data: CostAnalysisInput,
        config?: AxiosRequestConfig,
    ): Promise<Recommendation> {
        const response = await BaseService.create<CostAnalysisResponse>(
            `${this.ENDPOINT}/cost-analysis/${carId}`,
            data,
            config,
        );

        return response.recommendation;
    }
}
