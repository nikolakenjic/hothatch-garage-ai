import mongoose from 'mongoose';
import {AIRecommendation} from './ai.model';
import {AIRecommendationType} from './ai.types';
import {generateAIContent} from './ai.client';

type CreateRecommendationArgs = {
    userId: string;
    carId?: string;
    type: AIRecommendationType;
    prompt: string;
    model: string;
    input?: Record<string, unknown>;
};

export const createAIRecommendation = async ({
    userId,
    carId,
    type,
    prompt,
    model,
    input,
}: CreateRecommendationArgs) => {
    const content = await generateAIContent(prompt, model);

    const saved = await AIRecommendation.create({
        user: new mongoose.Types.ObjectId(userId),
        car: carId ? new mongoose.Types.ObjectId(carId) : undefined,
        type,
        prompt,
        input,
        content,
    });

    return {id: saved._id, content: saved.content};
};
