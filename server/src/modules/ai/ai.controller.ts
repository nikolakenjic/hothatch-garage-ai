import {Request, Response} from 'express';
import Groq from 'groq-sdk';
import {env} from '../../config/env';

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
