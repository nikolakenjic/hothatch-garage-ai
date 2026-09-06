import Groq from 'groq-sdk';
import {env} from '../../config/env';
import {AppError} from '../../utils/AppError';
import {BAD_GATEWAY, SERVICE_UNAVAILABLE} from '../../constants/http';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

export const generateAIContent = async (
    prompt: string,
    model: string,
): Promise<string> => {
    try {
        const response = await groq.chat.completions.create({
            model,
            messages: [{role: 'user', content: prompt}],
        });

        const content = response.choices[0]?.message?.content?.trim();

        if (!content) {
            throw new AppError(
                'AI provider returned an empty response',
                BAD_GATEWAY,
            );
        }

        return content;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            'AI service is currently unavailable. Please try again later.',
            SERVICE_UNAVAILABLE,
        );
    }
};
