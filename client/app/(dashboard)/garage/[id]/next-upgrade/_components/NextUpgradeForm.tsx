'use client';

import {ReactNode, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {BrainCircuit, LoaderCircle, RotateCcw, Sparkles} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getErrorMessage} from '@/lib/errors';

import {GeneratedRecommendation, NextUpgradeInput} from '@/types/ai';
import AiService from '@/services/ai.service';

const nextUpgradeSchema = z.object({
    budget: z.string().trim().min(1, 'Budget is required'),
    goal: z.string().trim().min(1, 'Goal is required'),
});

type NextUpgradeFormProps = {
    carId: string;
};

export default function NextUpgradeForm({carId}: NextUpgradeFormProps) {
    const [recommendation, setRecommendation] =
        useState<GeneratedRecommendation | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<NextUpgradeInput>({
        resolver: zodResolver(nextUpgradeSchema),
        defaultValues: {
            budget: '',
            goal: '',
        },
    });

    const onSubmit = async (data: NextUpgradeInput) => {
        try {
            const result = await AiService.nextUpgrade(carId, data);

            setRecommendation(result);
            toast.success('Next upgrade recommendation generated');
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
                        <BrainCircuit className="size-5" aria-hidden="true" />
                    </div>

                    <div>
                        <p className="eyebrow">Advisor result</p>

                        <h2 className="section-title mt-2">
                            Recommended next upgrades
                        </h2>

                        <p className="body-text mt-2">
                            Prioritized suggestions based on the current vehicle
                            setup and your stated goal.
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
                    Generate another recommendation
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
                <p className="eyebrow">Advisor input</p>

                <h2 className="section-title mt-3">
                    Define your next priority
                </h2>

                <p className="body-text mt-2">
                    Enter your available budget and describe what you want to
                    improve next.
                </p>
            </div>

            <FormField
                id="next-upgrade-budget"
                label="Available budget"
                error={errors.budget?.message}
            >
                <Input
                    id="next-upgrade-budget"
                    placeholder="€1,000"
                    aria-invalid={Boolean(errors.budget)}
                    aria-describedby={
                        errors.budget ? 'next-upgrade-budget-error' : undefined
                    }
                    {...register('budget')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="next-upgrade-goal"
                label="Improvement goal"
                error={errors.goal?.message}
            >
                <textarea
                    id="next-upgrade-goal"
                    rows={6}
                    placeholder="Improve steering response and cornering confidence without making the daily ride excessively harsh."
                    aria-invalid={Boolean(errors.goal)}
                    aria-describedby={
                        errors.goal ? 'next-upgrade-goal-error' : undefined
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
                        Analyzing next upgrade...
                    </>
                ) : (
                    <>
                        <Sparkles className="size-4" aria-hidden="true" />
                        Recommend next upgrade
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
