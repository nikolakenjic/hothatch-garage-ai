export enum AIRecommendationType {
    NEXT_UPGRADE = 'next-upgrade',
    NEXT_UPGRADE_ADVISOR = 'next-upgrade-advisor',
    BUILD_REVIEW = 'build-review',
    COST_ANALYSIS = 'cost-analysis',
    CAR_RECOMMENDATION = 'car-recommendation',
    BUILD_PLAN = 'build-plan',
}

export type RecommendCarInput = {
    budget: string;
    fuel: string;
    use: string;
};

export type BuildPlanInput = {
    budget: string;
    goal: string;
};

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

export type NextUpgradeInput = {
    budget: string;
    goal: string;
};

export type BuildReviewInput = {
    goal: string;
};

export type CostAnalysisInput = {
    budget: string;
    goal: string;
};

export type PreviousRecommendationPromptInput = {
    content: string;
};
