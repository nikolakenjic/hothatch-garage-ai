export type Recommendation = {
    id: string;
    content: string;
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
