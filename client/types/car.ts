export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type Transmission = 'manual' | 'automatic';
export type Drivetrain = 'fwd' | 'rwd' | 'awd';

export type Car = {
    _id: string;
    user: string;
    brand: string;
    model: string;
    year: number;
    nickname?: string;
    fuelType?: FuelType;
    horsepower?: number;
    torque?: number;
    transmission?: Transmission;
    drivetrain?: Drivetrain;
    createdAt: string;
    updatedAt: string;
};

export type CreateCarInput = {
    brand: string;
    model: string;
    year: number;
    nickname?: string;
    fuelType?: FuelType;
    horsepower?: number;
    torque?: number;
    transmission?: Transmission;
    drivetrain?: Drivetrain;
};
