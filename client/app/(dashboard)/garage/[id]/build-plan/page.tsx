import {cookies} from 'next/headers';
import {getCarByIdService} from '@/services/car.service';
import BuildPlanForm from '@/components/cars/BuildPlanForm';

type Props = {
    params: Promise<{id: string}>;
};

export default async function BuildPlanPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const car = await getCarByIdService(token!, id);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">AI Build Planner 🤖</h1>
            <p className="text-muted-foreground mb-6">
                Get a personalized mod plan for your {car.brand} {car.model}
            </p>
            <BuildPlanForm carId={id} />
        </div>
    );
}
