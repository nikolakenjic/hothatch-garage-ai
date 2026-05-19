import {cookies} from 'next/headers';
import {getCarByIdService} from '@/services/car.service';

type Props = {
    params: Promise<{id: string}>;
};

export default async function CarDetailPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const car = await getCarByIdService(token!, id);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">
                {car.brand} {car.model}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">{car.year}</p>
            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Modifications</h2>
                <p className="text-muted-foreground">No modifications yet.</p>
            </div>
        </div>
    );
}
