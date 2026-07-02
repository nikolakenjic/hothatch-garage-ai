import Groq from 'groq-sdk';
import {env} from '../../config/env';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

export const generateAIContent = async (prompt: string, model: string) => {
    const response = await groq.chat.completions.create({
        model,
        messages: [{role: 'user', content: prompt}],
    });

    return response.choices[0].message.content || '';
};
