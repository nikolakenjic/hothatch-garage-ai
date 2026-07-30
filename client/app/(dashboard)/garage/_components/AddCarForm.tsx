'use client';

import {ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getErrorMessage} from '@/lib/errors';
import CarService from '@/services/car.service';

const currentYear = new Date().getFullYear();

const addCarSchema = z.object({
    brand: z.string().trim().min(1, 'Brand is required'),
    model: z.string().trim().min(1, 'Model is required'),
    year: z.coerce
        .number()
        .int('Year must be a whole number')
        .min(1900, 'Year must be 1900 or newer')
        .max(currentYear, `Year cannot be later than ${currentYear}`),
});

type AddCarFormInput = z.input<typeof addCarSchema>;
type AddCarFormOutput = z.output<typeof addCarSchema>;

type AddCarFormProps = {
    onSuccess?: () => void;
};

export default function AddCarForm({onSuccess}: AddCarFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<AddCarFormInput, unknown, AddCarFormOutput>({
        resolver: zodResolver(addCarSchema),
        defaultValues: {
            brand: '',
            model: '',
            year: currentYear,
        },
    });

    const onSubmit = async (data: AddCarFormOutput) => {
        try {
            await CarService.createCar(data);

            toast.success('Vehicle added successfully');
            reset();
            router.refresh();
            onSuccess?.();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
        >
            <div className="grid gap-4 md:grid-cols-2">
                <FormField
                    id="brand"
                    label="Brand"
                    error={errors.brand?.message}
                >
                    <Input
                        id="brand"
                        placeholder="Volkswagen"
                        aria-invalid={Boolean(errors.brand)}
                        aria-describedby={
                            errors.brand ? 'brand-error' : undefined
                        }
                        {...register('brand')}
                        className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                    />
                </FormField>

                <FormField
                    id="model"
                    label="Model"
                    error={errors.model?.message}
                >
                    <Input
                        id="model"
                        placeholder="Golf GTD"
                        aria-invalid={Boolean(errors.model)}
                        aria-describedby={
                            errors.model ? 'model-error' : undefined
                        }
                        {...register('model')}
                        className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                    />
                </FormField>
            </div>

            <FormField
                id="year"
                label="Model year"
                error={errors.year?.message}
            >
                <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={currentYear}
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.year)}
                    aria-describedby={errors.year ? 'year-error' : undefined}
                    {...register('year')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-semibold"
            >
                {isSubmitting ? 'Adding vehicle...' : 'Add vehicle'}
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
