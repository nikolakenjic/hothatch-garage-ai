import Groq from 'groq-sdk';

import {env} from '../../config/env';
import {findOwnedCarOrFail} from '../car/car.service';
import {Modification} from '../modification/modification.model';
import {AIRecommendation} from './ai.model';
import {
    buildBuildPlanPrompt,
    buildCarRecommendationPrompt,
    buildUpgradeRecommendationPrompt,
} from './ai.prompts';
import {AIRecommendationType} from './ai.types';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

type RecommendCarInput = {
    budget: string;
    fuel: string;
    use: string;
};

type BuildPlanInput = {
    budget: string;
    goal: string;
};

const generateAIContent = async (prompt: string, model: string) => {
    const response = await groq.chat.completions.create({
        model,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content || '';
};

export const generateCarRecommendationService = async (
    userId: string,
    data: RecommendCarInput,
) => {
    const prompt = buildCarRecommendationPrompt(data);

    const content = await generateAIContent(prompt, 'llama-3.3-70b-versatile');

    const saved = await AIRecommendation.create({
        user: userId,
        type: AIRecommendationType.CAR_RECOMMENDATION,
        prompt,
        input: data,
        content,
    });

    return {
        id: saved._id,
        content: saved.content,
    };
};

export const recommendUpgradeService = async (
    carId: string,
    userId: string,
) => {
    const car = await findOwnedCarOrFail(carId, userId);
    const modifications = await Modification.find({car: carId});

    const prompt = buildUpgradeRecommendationPrompt(car, modifications);

    const content = await generateAIContent(prompt, 'llama-3.1-8b-instant');

    const savedRecommendation = await AIRecommendation.create({
        user: userId,
        car: carId,
        type: AIRecommendationType.NEXT_UPGRADE,
        prompt,
        input: {
            carId,
        },
        content,
    });

    return {
        id: savedRecommendation._id,
        content: savedRecommendation.content,
    };
};

export const getRecommendationsService = async (userId: string) => {
    return AIRecommendation.find({user: userId}).sort({createdAt: -1});
};

export const getRecommendationsByCarService = async (
    carId: string,
    userId: string,
) => {
    await findOwnedCarOrFail(carId, userId);

    return AIRecommendation.find({
        user: userId,
        car: carId,
    }).sort({createdAt: -1});
};

export const buildPlanService = async (
    carId: string,
    userId: string,
    data: BuildPlanInput,
) => {
    const car = await findOwnedCarOrFail(carId, userId);
    const modifications = await Modification.find({car: carId});

    const prompt = buildBuildPlanPrompt(car, modifications, data);

    const content = await generateAIContent(prompt, 'llama-3.3-70b-versatile');

    const saved = await AIRecommendation.create({
        user: userId,
        car: carId,
        type: AIRecommendationType.BUILD_PLAN,
        prompt,
        input: data,
        content,
    });

    return {
        id: saved._id,
        content: saved.content,
    };
};
