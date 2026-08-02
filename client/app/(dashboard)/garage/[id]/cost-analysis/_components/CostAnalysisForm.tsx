'use client';

import {ReactNode, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {
    ChartNoAxesCombined,
    LoaderCircle,
    RotateCcw,
    Sparkles,
} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getErrorMessage} from '@/lib/errors';
import AiService from '@/services/ai.service';
import {CostAnalysisInput, Recommendation} from '@/types/ai';

const costAnalysisSchema = z.object({
    budget: z.string().trim().min(1, 'Budget is required'),
    goal: z.string().trim().min(1, 'Goal is required'),
});

type CostAnalysisFormProps = {
    carId: string;
};

export default function CostAnalysisForm({carId}: CostAnalysisFormProps) {
    const [recommendation, setRecommendation] = useState<Recommendation | null>(
        null,
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CostAnalysisInput>({
        resolver: zodResolver(costAnalysisSchema),
        defaultValues: {
            budget: '',
            goal: '',
        },
    });

    const onSubmit = async (data: CostAnalysisInput) => {
        try {
            const result = await AiService.costAnalysis(carId, data);

            setRecommendation(result);
            toast.success('Cost analysis generated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        reset();
        setRecommendation(null);
    };

    if (recommendation) {
        return (
            <div>
                <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ChartNoAxesCombined
                            className="size-5"
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="eyebrow">Analysis result</p>

                        <h2 className="section-title mt-2">
                            Your build cost assessment
                        </h2>

                        <p className="body-text mt-2">
                            A value-focused review of current spending and
                            future upgrade priorities.
                        </p>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-border-subtle bg-surface-muted/40 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                        {recommendation.content}
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={handleReset}
                >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Run another analysis
                </Button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
        >
            <div>
                <p className="eyebrow">Analysis input</p>

                <h2 className="section-title mt-3">
                    Define your spending priorities
                </h2>

                <p className="body-text mt-2">
                    Enter the available budget and explain what you want the
                    build to achieve.
                </p>
            </div>

            <FormField
                id="cost-analysis-budget"
                label="Available budget"
                error={errors.budget?.message}
            >
                <Input
                    id="cost-analysis-budget"
                    placeholder="€3,000"
                    aria-invalid={Boolean(errors.budget)}
                    aria-describedby={
                        errors.budget ? 'cost-analysis-budget-error' : undefined
                    }
                    {...register('budget')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="cost-analysis-goal"
                label="Build goal"
                error={errors.goal?.message}
            >
                <textarea
                    id="cost-analysis-goal"
                    rows={6}
                    placeholder="Create a reliable fast-road build with strong handling and braking while avoiding upgrades that offer poor value."
                    aria-invalid={Boolean(errors.goal)}
                    aria-describedby={
                        errors.goal ? 'cost-analysis-goal-error' : undefined
                    }
                    {...register('goal')}
                    className="flex w-full resize-y rounded-lg border border-border-subtle bg-background/70 px-3.5 py-3 text-sm shadow-xs outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </FormField>

            <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-semibold"
            >
                {isSubmitting ? (
                    <>
                        <LoaderCircle
                            className="size-4 animate-spin"
                            aria-hidden="true"
                        />
                        Analyzing build costs...
                    </>
                ) : (
                    <>
                        <Sparkles className="size-4" aria-hidden="true" />
                        Analyze build costs
                    </>
                )}
            </Button>
        </form>
    );
}

type FormFieldProps = {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
};

function FormField({id, label, error, children}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </Label>

            {children}

            {error ? (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-sm text-destructive"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}
