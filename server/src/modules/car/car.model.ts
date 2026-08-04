import mongoose, {Schema} from 'mongoose';

export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type Transmission = 'manual' | 'automatic' | 'dsg';
export type Drivetrain = 'fwd' | 'rwd' | 'awd';

export interface ICar {
    user: mongoose.Types.ObjectId;
    brand: string;
    model: string;
    year: number;
    nickname?: string;
    fuelType?: FuelType;
    horsepower?: number;
    torque?: number;
    transmission?: Transmission;
    drivetrain?: Drivetrain;
    createdAt: Date;
    updatedAt: Date;
}

const carSchema = new Schema<ICar>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: Number,
            required: true,
        },
        nickname: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'hybrid', 'electric'],
        },
        horsepower: {
            type: Number,
            min: 1,
            max: 2000,
        },
        torque: {
            type: Number,
            min: 1,
            max: 3000,
        },
        transmission: {
            type: String,
            enum: ['manual', 'automatic', 'dsg'],
        },
        drivetrain: {
            type: String,
            enum: ['fwd', 'rwd', 'awd'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

export const Car = mongoose.model<ICar>('Car', carSchema);
