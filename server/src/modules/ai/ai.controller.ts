import {Request, Response} from 'express';
import Groq from 'groq-sdk';
import {env} from '../../config/env';
import {Modification} from '../modification/modification.model';
import {Car} from '../car/car.model';
import {AIRecommendation} from './ai.model';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

export const recommendCar = async (req: Request, res: Response) => {
    const {budget, fuel, use} = req.body;

    const prompt = `
You are a car expert specialized in hot hatch cars.

User preferences:
- Budget: ${budget}
- Fuel: ${fuel}
- Use: ${use}

Recommend ONE hot hatch car with a short explanation.
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

    const recommendation = response.choices[0].message.content;

    res.status(200).json({
        message: 'Recommendation generated',
        recommendation,
    });
};

export const recommendUpgrade = async (req: Request, res: Response) => {
    const carId = req.params.carId as string;
    const userId = (req.user as any).userId;

    const car = await Car.findById(carId);

    if (!car) {
        return res.status(404).json({message: 'Car not found'});
    }

    if (car.user.toString() !== userId) {
        return res.status(403).json({message: 'Not authorized'});
    }

    const modifications = await Modification.find({car: carId});

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

    const recommendation = response.choices[0].message.content;

    const savedRecommendation = await AIRecommendation.create({
        user: userId,
        car: carId,
        type: 'upgrade',
        content: recommendation || '',
    });

    res.status(200).json({
        message: 'Upgrade recommendation generated',
        recommendation: savedRecommendation,
    });
};
