'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {FieldValues, Path, UseFormReturn} from 'react-hook-form';

export type Field<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
};

type AuthFormProps<T extends FieldValues> = {
    fields: Field<T>[];
    submitText: string;
    submitLoadingText: string;
    form: UseFormReturn<T>;
    onSubmit: (data: T) => Promise<void>;
    secondaryAction?: React.ReactNode;
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

    const getFieldError = (fieldName: Path<T>): string | undefined => {
        const error = errors[fieldName];

        return typeof error?.message === 'string' ? error.message : undefined;
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
        >
            <div className="space-y-4">
                {fields.map((field) => {
                    const errorMessage = getFieldError(field.name);

                    return (
                        <div key={field.name} className="space-y-2">
                            <Label
                                htmlFor={field.name}
                                className="text-sm font-medium text-foreground"
                            >
                                {field.label}
                            </Label>

                            <Input
                                id={field.name}
                                type={field.type ?? 'text'}
                                placeholder={field.placeholder}
                                aria-invalid={Boolean(errorMessage)}
                                aria-describedby={
                                    errorMessage
                                        ? `${field.name}-error`
                                        : undefined
                                }
                                {...register(field.name)}
                                className="h-11 border-border-subtle bg-background/70 px-3.5 shadow-xs transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                            />

                            {errorMessage ? (
                                <p
                                    id={`${field.name}-error`}
                                    role="alert"
                                    className="text-sm text-destructive"
                                >
                                    {errorMessage}
                                </p>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-semibold"
            >
                {isSubmitting ? submitLoadingText : submitText}
            </Button>

            {secondaryAction ? (
                <div className="pt-1">{secondaryAction}</div>
            ) : null}
        </form>
    );
}
