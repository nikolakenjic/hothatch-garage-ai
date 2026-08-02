export type RecommendationType =
    | 'next-upgrade'
    | 'next-upgrade-advisor'
    | 'build-review'
    | 'cost-analysis'
    | 'car-recommendation'
    | 'build-plan';

export type Recommendation = {
    id: string;
    type: RecommendationType;
    content: string;
    createdAt: string;
    car?: string;
    input?: Record<string, unknown>;
};

export type RecommendationsResponse = {
    message: string;
    count: number;
    recommendations: Recommendation[];
};

export type RecommendCarInput = {
    budget: string;
    fuel: string;
    use: string;
};

export type RecommendCarResponse = {
    message: string;
    recommendation: Recommendation;
};

export type BuildPlanInput = {
    budget: string;
    goal: string;
};

export type BuildPlanResponse = {
    message: string;
    recommendation: Recommendation;
};

export type BuildReviewInput = {
    goal: string;
};

export type BuildReviewResponse = {
    message: string;
    recommendation: Recommendation;
};

export type CostAnalysisInput = {
    budget: string;
    goal: string;
};

export type CostAnalysisResponse = {
    message: string;
    recommendation: Recommendation;
};
