import mongoose, {Schema} from 'mongoose';

export interface ICar {
    user: mongoose.Types.ObjectId;
    brand: string;
    model: string;
    year: number;
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
    },
    {
        timestamps: true,
    },
);

export const Car = mongoose.model<ICar>('Car', carSchema);
