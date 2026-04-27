import Groq from 'groq-sdk';
import {env} from '../../config/env';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

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
