'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import AiService from '@/services/ai.service';
import {getErrorMessage} from '@/lib/errors';
import GlassPanel from '@/components/shared/GlassPanel';

const buildPlanSchema = z.object({
    budget: z.string().min(1, 'Budget is required'),
    goal: z.string().min(1, 'Goal is required'),
});

type BuildPlanInput = z.infer<typeof buildPlanSchema>;

type Props = {
    carId: string;
};

export default function BuildPlanForm({carId}: Props) {
    const [result, setResult] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<BuildPlanInput>({
        resolver: zodResolver(buildPlanSchema),
    });

    const onSubmit = async (data: BuildPlanInput) => {
        try {
            const recommendation = await AiService.buildPlan(carId, data);
            toast.success('Build plan generated! 🤖');
            setResult(recommendation.content);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6">
            <GlassPanel>
                <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                    Tell me your goals
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget (€)</Label>
                        <Input
                            id="budget"
                            placeholder="e.g. 2000"
                            {...register('budget')}
                        />
                        {errors.budget && (
                            <p className="text-sm text-red-500">
                                {errors.budget.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="goal">Goal</Label>
                        <Input
                            id="goal"
                            placeholder="e.g. track performance"
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
                            ? 'Generating plan...'
                            : 'Generate Build Plan 🤖'}
                    </Button>
                </form>
            </GlassPanel>

            {result && (
                <div className="rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-4">
                        Your Build Plan
                    </h2>
                    <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    );
}
