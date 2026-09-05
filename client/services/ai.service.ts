import BaseService from '@/lib/api/base.service';
import type {AxiosRequestConfig} from 'axios';

import {
    BuildPlanInput,
    BuildPlanResponse,
    BuildReviewInput,
    BuildReviewResponse,
    CostAnalysisInput,
    CostAnalysisResponse,
    GeneratedRecommendation,
    NextUpgradeInput,
    NextUpgradeResponse,
    RecommendationHistoryItem,
    RecommendationsResponse,
    RecommendationType,
    RecommendCarInput,
    RecommendCarResponse,
} from '@/types/ai';

export default class AiService {
    static readonly ENDPOINT = '/ai';

    static async getRecommendations(
        type?: RecommendationType,
        config?: AxiosRequestConfig,
    ): Promise<RecommendationHistoryItem[]> {
        const query = type ? `?type=${encodeURIComponent(type)}` : '';

        const response = await BaseService.get<RecommendationsResponse>(
            `${this.ENDPOINT}/recommendations${query}`,
            config,
        );

        return response.recommendations;
    }

    static async recommendCar(
        data: RecommendCarInput,
        config?: AxiosRequestConfig,
    ): Promise<GeneratedRecommendation> {
        const response = await BaseService.create<RecommendCarResponse>(
            `${this.ENDPOINT}/recommend`,
            data,
            config,
        );

        return response.recommendation;
    }

    static async buildPlan(
        carId: string,
        data: BuildPlanInput,
        config?: AxiosRequestConfig,
    ): Promise<GeneratedRecommendation> {
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
    ): Promise<GeneratedRecommendation> {
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
    ): Promise<GeneratedRecommendation> {
        const response = await BaseService.create<CostAnalysisResponse>(
            `${this.ENDPOINT}/cost-analysis/${carId}`,
            data,
            config,
        );

        return response.recommendation;
    }

    static async nextUpgrade(
        carId: string,
        data: NextUpgradeInput,
        config?: AxiosRequestConfig,
    ): Promise<GeneratedRecommendation> {
        const response = await BaseService.create<NextUpgradeResponse>(
            `${this.ENDPOINT}/next-upgrade/${carId}`,
            data,
            config,
        );

        return response.recommendation;
    }
}
