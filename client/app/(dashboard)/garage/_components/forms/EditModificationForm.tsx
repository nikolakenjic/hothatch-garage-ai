'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import ModificationService from '@/services/modification.service';
import {useRouter} from 'next/navigation';
import {Modification} from '@/types/modification';
import {getErrorMessage} from '@/lib/errors';

const editModSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.coerce.number().optional(),
});

type EditModInput = z.infer<typeof editModSchema>;

type Props = {
    mod: Modification;
    onSuccess?: () => void;
};

export default function EditModificationForm({mod, onSuccess}: Props) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<EditModInput>({
        resolver: zodResolver(editModSchema) as any,
        defaultValues: {
            name: mod.name,
            category: mod.category,
            price: mod.price,
        },
    });

    const onSubmit = async (data: EditModInput) => {
        try {
            await ModificationService.updateModification(mod._id, data);

            toast.success('Modification updated! 🔧');
            router.refresh();
            onSuccess?.();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...register('name')}
                    className="border-zinc-200 bg-white text-zinc-950 transition-all hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    {...register('category')}
                    className="border-zinc-200 bg-white text-zinc-950 transition-all hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {errors.category && (
                    <p className="text-sm text-red-500">
                        {errors.category.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price (optional)</Label>
                <Input
                    id="price"
                    type="number"
                    {...register('price')}
                    className="border-zinc-200 bg-white text-zinc-950 transition-all hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-red-600 font-bold text-white hover:bg-red-500"
            >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    );
}
