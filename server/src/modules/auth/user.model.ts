import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpires: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

export const User = mongoose.model<IUser>('User', userSchema);
