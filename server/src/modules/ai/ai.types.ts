export enum AIRecommendationType {
    NEXT_UPGRADE = 'next-upgrade',
    NEXT_UPGRADE_ADVISOR = 'next-upgrade-advisor',
    BUILD_REVIEW = 'build-review',
    COST_ANALYSIS = 'cost-analysis',
    CAR_RECOMMENDATION = 'car-recommendation',
    BUILD_PLAN = 'build-plan',
}

export type CarPromptInput = {
    brand: string;
    model: string;
    year: number;
};

export type ModificationPromptInput = {
    title: string;
    category: string;
    status: string;
    cost?: number;
    brand?: string;
};

export type PreviousRecommendationPromptInput = {
    content: string;
};
