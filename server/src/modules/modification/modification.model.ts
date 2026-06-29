import mongoose, {Schema} from 'mongoose';

export interface IModification {
    car: mongoose.Types.ObjectId;
    title: string;
    category: string;
    price?: number;
}

const modificationSchema = new Schema<IModification>(
    {
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                'performance',
                'suspension',
                'brakes',
                'wheels',
                'maintenance',
                'other',
            ],
            required: true,
        },
        price: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

export const Modification = mongoose.model<IModification>(
    'Modification',
    modificationSchema,
);
