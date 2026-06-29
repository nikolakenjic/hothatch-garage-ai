import mongoose, {Schema} from 'mongoose';

export type ModificationCategory =
    | 'performance'
    | 'suspension'
    | 'brakes'
    | 'wheels'
    | 'exterior'
    | 'interior'
    | 'maintenance'
    | 'other';

export type ModificationStatus =
    | 'planned'
    | 'ordered'
    | 'installed'
    | 'removed';

export interface IModification {
    car: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    category: ModificationCategory;
    status: ModificationStatus;
    cost?: number;
    installedAt?: Date;
    brand?: string;
    partNumber?: string;
    mileage?: number;
    notes?: string;
}

const modificationSchema = new Schema<IModification>(
    {
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 120,
        },
        description: {
            type: String,
            trim: true,
            maxLength: 1000,
        },
        category: {
            type: String,
            enum: [
                'performance',
                'suspension',
                'brakes',
                'wheels',
                'exterior',
                'interior',
                'maintenance',
                'other',
            ],
            required: true,
        },
        status: {
            type: String,
            enum: ['planned', 'ordered', 'installed', 'removed'],
            default: 'planned',
            required: true,
        },
        cost: {
            type: Number,
            min: 0,
        },
        installedAt: {
            type: Date,
        },
        brand: {
            type: String,
            trim: true,
            maxLength: 80,
        },
        partNumber: {
            type: String,
            trim: true,
            maxLength: 80,
        },
        mileage: {
            type: Number,
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
            maxLength: 1000,
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
