export enum AIRecommendationType {
    NEXT_UPGRADE = 'next-upgrade',
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
};
