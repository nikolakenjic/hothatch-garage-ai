'use client';

import {ReactNode, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {LoaderCircle, RotateCcw, SearchCheck, Sparkles} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {getErrorMessage} from '@/lib/errors';
import AiService from '@/services/ai.service';
import {BuildReviewInput, GeneratedRecommendation} from '@/types/ai';

const buildReviewSchema = z.object({
    goal: z.string().trim().min(1, 'Goal is required'),
});

type BuildReviewFormProps = {
    carId: string;
};

export default function BuildReviewForm({carId}: BuildReviewFormProps) {
    const [recommendation, setRecommendation] =
        useState<GeneratedRecommendation | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<BuildReviewInput>({
        resolver: zodResolver(buildReviewSchema),
        defaultValues: {
            goal: '',
        },
    });

    const onSubmit = async (data: BuildReviewInput) => {
        try {
            const result = await AiService.buildReview(carId, data);

            setRecommendation(result);
            toast.success('Build review generated successfully');
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
                        <SearchCheck className="size-5" aria-hidden="true" />
                    </div>

                    <div>
                        <p className="eyebrow">Review result</p>

                        <h2 className="section-title mt-2">
                            Your build assessment
                        </h2>

                        <p className="body-text mt-2">
                            A complete review of the current setup, including
                            strengths, weaknesses, and recommended next steps.
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
                    Review another goal
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
                <p className="eyebrow">Review input</p>

                <h2 className="section-title mt-3">
                    Describe the intended build
                </h2>

                <p className="body-text mt-2">
                    Explain what the vehicle should achieve so the advisor can
                    judge whether the current build supports that goal.
                </p>
            </div>

            <FormField
                id="build-review-goal"
                label="Build goal"
                error={errors.goal?.message}
            >
                <textarea
                    id="build-review-goal"
                    rows={7}
                    placeholder="A balanced fast-road build with stronger handling and braking, while maintaining reliability and daily comfort."
                    aria-invalid={Boolean(errors.goal)}
                    aria-describedby={
                        errors.goal ? 'build-review-goal-error' : undefined
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
                        Reviewing build...
                    </>
                ) : (
                    <>
                        <Sparkles className="size-4" aria-hidden="true" />
                        Review current build
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
