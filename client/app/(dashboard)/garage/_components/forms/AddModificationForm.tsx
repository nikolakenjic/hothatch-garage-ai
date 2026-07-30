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
import ModificationService from '@/services/modification.service';

const addModificationSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    category: z.string().trim().min(1, 'Category is required'),
    price: z.preprocess((value) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        return Number(value);
    }, z.number().min(0, 'Price cannot be negative').optional()),
});

type AddModificationFormInput = z.input<typeof addModificationSchema>;
type AddModificationFormOutput = z.output<typeof addModificationSchema>;

type AddModificationFormProps = {
    carId: string;
};

export default function AddModificationForm({carId}: AddModificationFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<AddModificationFormInput, unknown, AddModificationFormOutput>({
        resolver: zodResolver(addModificationSchema),
        defaultValues: {
            name: '',
            category: '',
            price: undefined,
        },
    });

    const onSubmit = async (data: AddModificationFormOutput) => {
        try {
            await ModificationService.createModification(carId, data);

            toast.success('Modification added successfully');
            reset();
            router.refresh();
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
            <FormField
                id="modification-name"
                label="Name"
                error={errors.name?.message}
            >
                <Input
                    id="modification-name"
                    placeholder="Performance intake"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                        errors.name ? 'modification-name-error' : undefined
                    }
                    {...register('name')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="modification-category"
                label="Category"
                error={errors.category?.message}
            >
                <Input
                    id="modification-category"
                    placeholder="Engine"
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={
                        errors.category
                            ? 'modification-category-error'
                            : undefined
                    }
                    {...register('category')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="modification-price"
                label="Price"
                description="Optional"
                error={errors.price?.message}
            >
                <Input
                    id="modification-price"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    placeholder="350"
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={
                        errors.price
                            ? 'modification-price-error'
                            : 'modification-price-description'
                    }
                    {...register('price')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-semibold"
            >
                {isSubmitting ? 'Adding modification...' : 'Add modification'}
            </Button>
        </form>
    );
}

type FormFieldProps = {
    id: string;
    label: string;
    description?: string;
    error?: string;
    children: React.ReactNode;
};

function FormField({id, label, description, error, children}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <Label
                    htmlFor={id}
                    className="text-sm font-medium text-foreground"
                >
                    {label}
                </Label>

                {description ? (
                    <span
                        id={`${id}-description`}
                        className="text-xs text-muted-foreground"
                    >
                        {description}
                    </span>
                ) : null}
            </div>

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
