import {cookies} from 'next/headers';
import {getCarByIdService} from '@/services/car.service';
import {getModificationsService} from '@/services/modification.service';
import {Modification} from '@/types/modification';
import AddModificationForm from '@/components/cars/AddModificationForm';
import DeleteModificationButton from '@/components/cars/DeleteModificationButton';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

type Props = {
    params: Promise<{id: string}>;
};

export default async function CarDetailPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const car = await getCarByIdService(token!, id);
    const modifications = await getModificationsService(token!, id);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">
                {car.brand} {car.model}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">{car.year}</p>
            <Link href={`/garage/${id}/build-plan`}>
                <Button className="mb-6">AI Build Planner 🤖</Button>
            </Link>
            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Modifications</h2>
                {modifications.length === 0 ? (
                    <p className="text-muted-foreground">
                        No modifications yet.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {modifications.map((mod: Modification) => (
                            <div
                                key={mod._id}
                                className="flex items-center justify-between border rounded p-3"
                            >
                                <div>
                                    <p className="font-medium">{mod.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {mod.category}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {mod.price && (
                                        <p className="font-medium">
                                            €{mod.price}
                                        </p>
                                    )}
                                    <DeleteModificationButton modId={mod._id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AddModificationForm carId={id} />
        </div>
    );
}
