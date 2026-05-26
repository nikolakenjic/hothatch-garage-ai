'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getAuthToken} from '@/lib/cookies';
import AiService from '@/services/ai.service';

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
            const token = getAuthToken();
            const recommendation = await AiService.buildPlan(
                token!,
                carId,
                data,
            );
            toast.success('Build plan generated! 🤖');
            setResult(recommendation.content);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to generate plan',
            );
            console.error(
                'Failed to generate plan:',
                error.response?.data?.message,
            );
        }
    };

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Tell me your goals</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                </CardContent>
            </Card>

            {result && (
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Your Build Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="whitespace-pre-wrap text-sm">
                            {result}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
