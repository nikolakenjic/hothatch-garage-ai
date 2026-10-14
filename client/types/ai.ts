export type RecommendationType =
    | 'next-upgrade'
    | 'next-upgrade-advisor'
    | 'build-review'
    | 'cost-analysis'
    | 'car-recommendation'
    | 'build-plan';

export type GeneratedRecommendation = {
    id: string;
    content: string;
};

export type RecommendationHistoryItem = {
    _id: string;
    car?: string;
    type: RecommendationType;
    input?: Record<string, unknown>;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type RecommendationsPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type RecommendationsResponse = {
    message: string;
    count: number;
    recommendations: RecommendationHistoryItem[];
    pagination: RecommendationsPagination;
};

export type Recommendation = {
    id: string;
    type: RecommendationType;
    content: string;
    createdAt: string;
    car?: string;
    input?: Record<string, unknown>;
};

export type RecommendCarInput = {
    budget: string;
    fuel: string;
    use: string;
};

export type RecommendCarResponse = {
    message: string;
    recommendation: GeneratedRecommendation;
};

export type BuildPlanInput = {
    budget: string;
    goal: string;
};

export type BuildPlanResponse = {
    message: string;
    recommendation: GeneratedRecommendation;
};

export type BuildReviewInput = {
    goal: string;
};

export type BuildReviewResponse = {
    message: string;
    recommendation: GeneratedRecommendation;
};

export type CostAnalysisInput = {
    budget: string;
    goal: string;
};

export type CostAnalysisResponse = {
    message: string;
    recommendation: GeneratedRecommendation;
};

export type NextUpgradeInput = {
    budget: string;
    goal: string;
};

export type NextUpgradeResponse = {
    message: string;
    recommendation: GeneratedRecommendation;
};
