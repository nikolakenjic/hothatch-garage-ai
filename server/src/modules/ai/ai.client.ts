import Groq from 'groq-sdk';
import {env} from '../../config/env';
import {AppError} from '../../utils/AppError';
import {BAD_GATEWAY, SERVICE_UNAVAILABLE} from '../../constants/http';
import type {AIPrompt} from './ai.types';

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
    timeout: 30_000,
    maxRetries: 1,
});

export const generateAIContent = async (
    prompt: AIPrompt,
    model: string,
): Promise<string> => {
    try {
        const response = await groq.chat.completions.create({
            model,
            messages: [
                {
                    role: 'system',
                    content: prompt.system,
                },
                {
                    role: 'user',
                    content: prompt.user,
                },
            ],
            max_completion_tokens: 2048,
        });

        const content = response.choices[0]?.message?.content?.trim();

        if (!content) {
            console.error('AI provider returned an empty response', {
                model,
            });

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

        console.error('AI provider request failed', error);

        throw new AppError(
            'AI service is currently unavailable. Please try again later.',
            SERVICE_UNAVAILABLE,
        );
    }
};
