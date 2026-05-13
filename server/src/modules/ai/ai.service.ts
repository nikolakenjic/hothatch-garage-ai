import Groq from 'groq-sdk';
import {env} from '../../config/env';
import {getCarIfOwned} from '../car/car.service';
import {Modification} from '../modification/modification.model';
import {AIRecommendation} from './ai.model';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

type RecommendCarInput = {
    budget: string;
    fuel: string;
    use: string;
};

export const generateCarRecommendationService = async (
    userId: string,
    data: RecommendCarInput,
) => {
    const {budget, fuel, use} = data;

    const prompt = `
You are a car expert specialized in hot hatch cars.

User preferences:
- Budget: ${budget}
- Fuel: ${fuel}
- Use: ${use}

Recommend ONE hot hatch car with a short explanation.
`;

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const content = response.choices[0].message.content || '';

    const saved = await AIRecommendation.create({
        user: userId,
        type: 'car',
        content,
    });

    return {
        id: saved._id,
        content: saved.content,
    };
};

export const generateUpgradeRecommendation = async (
    car: any,
    modifications: any[],
) => {
    const modsList = modifications.map((m) => m.name).join(', ') || 'none';

    const prompt = `
You are a car tuning expert.

Car:
- Brand: ${car.brand}
- Model: ${car.model}
- Year: ${car.year}

Current modifications:
${modsList}

Suggest ONE next best upgrade for this car.

Respond in this format:

Upgrade: <name>
Why: <short explanation>
`;

    const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content;
};

export const recommendUpgradeService = async (
    carId: string,
    userId: string,
) => {
    const car = await getCarIfOwned(carId, userId);

    const modifications = await Modification.find({car: carId});

    const recommendation = await generateUpgradeRecommendation(
        car,
        modifications,
    );

    const savedRecommendation = await AIRecommendation.create({
        user: userId,
        car: carId,
        type: 'upgrade',
        content: recommendation || '',
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
    await getCarIfOwned(carId, userId);

    return AIRecommendation.find({
        user: userId,
        car: carId,
    }).sort({createdAt: -1});
};
