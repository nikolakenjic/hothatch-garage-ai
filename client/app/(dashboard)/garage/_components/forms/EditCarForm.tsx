'use client';

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
import {Car} from '@/types/car';

const currentYear = new Date().getFullYear();

const editCarSchema = z.object({
    brand: z.string().trim().min(1, 'Brand is required'),
    model: z.string().trim().min(1, 'Model is required'),
    year: z.coerce.number().int().min(1900).max(currentYear),
});

type EditCarFormInput = z.input<typeof editCarSchema>;
type EditCarFormOutput = z.output<typeof editCarSchema>;

type EditCarFormProps = {
    car: Car;
    onSuccess?: () => void;
};

export default function EditCarForm({car, onSuccess}: EditCarFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<EditCarFormInput, unknown, EditCarFormOutput>({
        resolver: zodResolver(editCarSchema),
        defaultValues: {
            brand: car.brand,
            model: car.model,
            year: car.year,
        },
    });

    const onSubmit = async (data: EditCarFormOutput) => {
        try {
            await CarService.updateCar(car._id, data);

            toast.success('Vehicle updated successfully');

            reset(data);

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
            <FormField id="brand" label="Brand" error={errors.brand?.message}>
                <Input
                    id="brand"
                    placeholder="Volkswagen"
                    aria-invalid={Boolean(errors.brand)}
                    {...register('brand')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField id="model" label="Model" error={errors.model?.message}>
                <Input
                    id="model"
                    placeholder="Golf GTD"
                    aria-invalid={Boolean(errors.model)}
                    {...register('model')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

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
                {isSubmitting ? 'Saving changes...' : 'Save changes'}
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
