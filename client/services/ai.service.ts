import api from '@/lib/axios';

export type BuildPlanInput = {
    budget: string;
    goal: string;
};

export const buildPlanService = async (
    token: string,
    carId: string,
    data: BuildPlanInput,
) => {
    const response = await api.post(`/ai/build-plan/${carId}`, data, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.recommendation;
};
