'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {FieldValues, Path, UseFormReturn} from 'react-hook-form';

export type Field = {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
};

type AuthFormProps<T extends FieldValues> = {
    fields: Field[];
    submitText: string;
    submitLoadingText: string;
    form: UseFormReturn<T>;
    onSubmit: (data: T) => Promise<void>;
    secondaryAction?: React.ReactNode;
};

const getFieldError = (fieldName: string): string | undefined => {
    const error = errors[fieldName as Path<T>];
    return typeof error?.message === 'string' ? error.message : undefined;
};

export default function AuthForm<T extends FieldValues>({
    fields,
    submitText,
    submitLoadingText,
    form,
    onSubmit,
    secondaryAction,
}: AuthFormProps<T>) {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                        id={field.name}
                        type={field.type ?? 'text'}
                        placeholder={field.placeholder}
                        {...register(field.name as Path<T>)}
                        className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                    />
                    {getFieldError(field.name) && (
                        <p className="text-sm text-red-500">
                            {getFieldError(field.name)}
                        </p>
                    )}
                </div>
            ))}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full bg-red-600 font-bold text-white shadow-lg shadow-red-900/30 transition-all duration-200 hover:scale-[1.01] hover:bg-red-500 active:scale-[0.99]"
            >
                {isSubmitting ? submitLoadingText : submitText}
            </Button>

            {secondaryAction}
        </form>
    );
}
