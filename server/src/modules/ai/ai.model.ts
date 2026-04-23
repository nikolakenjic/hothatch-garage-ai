import mongoose, {Schema} from 'mongoose';

export interface IAIRecommendation {
    user: mongoose.Types.ObjectId;
    car: mongoose.Types.ObjectId;
    type: string;
    content: string;
}

const aiRecommendationSchema = new Schema<IAIRecommendation>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true,
        },
        type: {
            type: String, // "upgrade" or "car"
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const AIRecommendation = mongoose.model<IAIRecommendation>(
    'AIRecommendation',
    aiRecommendationSchema,
);
