'use client';

import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {z} from 'zod';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {getErrorMessage} from '@/lib/errors';
import ModificationService from '@/services/modification.service';
import {Modification} from '@/types/modification';

import {modificationCategories} from './AddModificationForm';

const editModificationSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(120),
    category: z.enum(modificationCategories),
    cost: z.preprocess((value) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        return Number(value);
    }, z.number().min(0, 'Cost cannot be negative').optional()),
});

type EditModificationFormInput = z.input<typeof editModificationSchema>;
type EditModificationFormOutput = z.output<typeof editModificationSchema>;

type EditModificationFormProps = {
    mod: Modification;
    onSuccess?: () => void;
};

export default function EditModificationForm({
    mod,
    onSuccess,
}: EditModificationFormProps) {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<EditModificationFormInput, unknown, EditModificationFormOutput>(
        {
            resolver: zodResolver(editModificationSchema),
            defaultValues: {
                title: mod.title,
                category: mod.category,
                cost: mod.cost,
            },
        },
    );

    const onSubmit = async (data: EditModificationFormOutput) => {
        try {
            await ModificationService.updateModification(mod._id, data);

            toast.success('Modification updated successfully');

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
            <FormField
                id="modification-title"
                label="Title"
                error={errors.title?.message}
            >
                <Input
                    id="modification-title"
                    placeholder="Performance intake"
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={
                        errors.title ? 'modification-title-error' : undefined
                    }
                    {...register('title')}
                    className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                />
            </FormField>

            <FormField
                id="modification-category"
                label="Category"
                error={errors.category?.message}
            >
                <Controller
                    name="category"
                    control={control}
                    render={({field}) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger
                                id="modification-category"
                                aria-invalid={Boolean(errors.category)}
                                aria-describedby={
                                    errors.category
                                        ? 'modification-category-error'
                                        : undefined
                                }
                                className="h-11 w-full border-border-subtle bg-background/70"
                            >
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="performance">
                                    Performance
                                </SelectItem>
                                <SelectItem value="suspension">
                                    Suspension
                                </SelectItem>
                                <SelectItem value="brakes">Brakes</SelectItem>
                                <SelectItem value="wheels">Wheels</SelectItem>
                                <SelectItem value="exterior">
                                    Exterior
                                </SelectItem>
                                <SelectItem value="interior">
                                    Interior
                                </SelectItem>
                                <SelectItem value="maintenance">
                                    Maintenance
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FormField>

            <FormField
                id="modification-cost"
                label="Cost"
                description="Optional"
                error={errors.cost?.message}
            >
                <Input
                    id="modification-cost"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    placeholder="350"
                    aria-invalid={Boolean(errors.cost)}
                    aria-describedby={
                        errors.cost
                            ? 'modification-cost-error'
                            : 'modification-cost-description'
                    }
                    {...register('cost')}
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
