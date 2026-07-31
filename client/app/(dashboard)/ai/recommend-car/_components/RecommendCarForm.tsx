'use client';

import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {Bot, LoaderCircle, RotateCcw} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getErrorMessage} from '@/lib/errors';
import AiService from '@/services/ai.service';
import {Recommendation, RecommendCarInput} from '@/types/ai';

const recommendCarSchema = z.object({
    budget: z.string().trim().min(1, 'Budget is required'),
    fuel: z.string().trim().min(1, 'Fuel type is required'),
    use: z.string().trim().min(1, 'Use case is required'),
});

export default function RecommendCarForm() {
    const [recommendation, setRecommendation] = useState<Recommendation | null>(
        null,
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<RecommendCarInput>({
        resolver: zodResolver(recommendCarSchema),
        defaultValues: {
            budget: '',
            fuel: '',
            use: '',
        },
    });

    const onSubmit = async (data: RecommendCarInput) => {
        try {
            const result = await AiService.recommendCar(data);
            setRecommendation(result);
            toast.success('Recommendation generated');
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
                        <Bot className="size-5" aria-hidden="true" />
                    </div>

                    <div>
                        <p className="eyebrow">AI recommendation</p>
                        <h2 className="section-title mt-2">
                            Your suggested hot hatch
                        </h2>
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
                    Start another recommendation
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
                <p className="eyebrow">Recommendation criteria</p>

                <h2 className="section-title mt-3">
                    Tell us what you are looking for
                </h2>

                <p className="body-text mt-2">
                    The current advisor returns one focused hot hatch
                    recommendation.
                </p>
            </div>

            <FormField
                id="budget"
                label="Budget"
                error={errors.budget?.message}
            >
                <Input
                    id="budget"
                    placeholder="€15,000"
                    aria-invalid={Boolean(errors.budget)}
                    aria-describedby={
                        errors.budget ? 'budget-error' : undefined
                    }
                    {...register('budget')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="fuel"
                label="Preferred fuel"
                error={errors.fuel?.message}
            >
                <Input
                    id="fuel"
                    placeholder="Petrol, diesel, hybrid..."
                    aria-invalid={Boolean(errors.fuel)}
                    aria-describedby={errors.fuel ? 'fuel-error' : undefined}
                    {...register('fuel')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="use"
                label="Use case and priorities"
                error={errors.use?.message}
            >
                <textarea
                    id="use"
                    rows={6}
                    placeholder="Daily driving, mountain roads, manual gearbox, strong steering feel, reliability..."
                    aria-invalid={Boolean(errors.use)}
                    aria-describedby={errors.use ? 'use-error' : undefined}
                    {...register('use')}
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
                        Generating recommendation...
                    </>
                ) : (
                    <>
                        <Bot className="size-4" aria-hidden="true" />
                        Generate recommendation
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
    children: React.ReactNode;
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
