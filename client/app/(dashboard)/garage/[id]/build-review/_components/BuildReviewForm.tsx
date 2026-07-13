'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getAuthToken} from '@/lib/cookies';
import {getErrorMessage} from '@/lib/errors';
import AiService from '@/services/ai.service';

const buildReviewSchema = z.object({
    goal: z.string().min(1, 'Goal is required'),
});

type BuildReviewInput = z.infer<typeof buildReviewSchema>;

type Props = {
    carId: string;
};

export default function BuildReviewForm({carId}: Props) {
    const [result, setResult] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<BuildReviewInput>({
        resolver: zodResolver(buildReviewSchema),
    });

    const onSubmit = async (data: BuildReviewInput) => {
        try {
            const token = getAuthToken();

            if (!token) {
                toast.error('You are not logged in');
                return;
            }

            const recommendation = await AiService.buildReview(
                token,
                carId,
                data,
            );

            setResult(recommendation.content);
            toast.success('Build review generated! 🤖');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                <h2 className="mb-6 font-heading text-2xl font-black text-zinc-950 dark:text-white">
                    Describe your build goal
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="goal">Goal</Label>

                        <Input
                            id="goal"
                            placeholder="e.g. balanced daily performance build"
                            {...register('goal')}
                        />

                        {errors.goal && (
                            <p className="text-sm text-red-500">
                                {errors.goal.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Reviewing build...'
                            : 'Review My Build 🤖'}
                    </Button>
                </form>
            </div>

            {result && (
                <div className="rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <h2 className="mb-4 font-heading text-2xl font-black text-zinc-950 dark:text-white">
                        Build Review
                    </h2>

                    <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    );
}
