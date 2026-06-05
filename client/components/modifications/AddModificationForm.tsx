'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';
import ModificationService from '@/services/modification.service';

const addModSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.coerce.number().optional(),
});

type AddModInput = z.infer<typeof addModSchema>;

type Props = {
    carId: string;
};

export default function AddModificationForm({carId}: Props) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<AddModInput>({
        resolver: zodResolver(addModSchema) as any,
    });

    const onSubmit = async (data: AddModInput) => {
        try {
            const token = getAuthToken();
            await ModificationService.createModification(token!, carId, data);
            toast.success('Modification added! 🔧');
            reset();
            router.refresh();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to add modification',
            );
            console.error('Failed to add mod:', error.response?.data?.message);
        }
    };

    return (
        <Card className="w-full max-w-md mt-6">
            <CardHeader>
                <CardTitle>Add Modification</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" {...register('category')} />
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
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Modification'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
