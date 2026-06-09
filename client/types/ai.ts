export type BuildPlanInput = {
    budget: string;
    goal: string;
};

export type Recommendation = {
    id: string;
    content: string;
};

export type BuildPlanResponse = {
    recommendation: Recommendation;
};
