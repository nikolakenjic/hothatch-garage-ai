import mongoose, {Schema} from 'mongoose';
import {AIRecommendationType} from './ai.types';

export interface IAIRecommendation {
    user: mongoose.Types.ObjectId;
    car?: mongoose.Types.ObjectId;
    type: AIRecommendationType;
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
            required: false,
        },
        type: {
            type: String,
            enum: Object.values(AIRecommendationType),
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
