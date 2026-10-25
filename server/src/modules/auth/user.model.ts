import mongoose, {Schema} from 'mongoose';

export type UserTheme = 'light' | 'dark' | 'system';

export interface IUserPreferences {
    theme: UserTheme;
    emailNotifications: boolean;
}

export interface IUserPrivacy {
    publicProfile: boolean;
    publicGarage: boolean;
}

export interface IUser {
    email: string;
    passwordHash?: string;
    googleSub?: string;
    isEmailVerified: boolean;
    emailVerificationTokenHash?: string;
    emailVerificationExpires?: Date;
    passwordResetTokenHash?: string;
    passwordResetExpires?: Date;
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    preferences?: IUserPreferences;
    privacy?: IUserPrivacy;
    createdAt: Date;
    updatedAt: Date;
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
        passwordHash: {
            type: String,
            select: false,
        },
        googleSub: {
            type: String,
            select: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
            required: true,
        },
        emailVerificationTokenHash: {
            type: String,
            select: false,
            index: true,
        },
        emailVerificationExpires: {
            type: Date,
            select: false,
        },
        passwordResetTokenHash: {
            type: String,
            select: false,
            index: true,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        displayName: {
            type: String,
            trim: true,
            maxLength: 50,
        },
        bio: {
            type: String,
            trim: true,
            maxLength: 300,
        },
        avatarUrl: {
            type: String,
        },
        preferences: {
            theme: {
                type: String,
                enum: ['light', 'dark', 'system'],
                default: 'system',
            },
            emailNotifications: {
                type: Boolean,
                default: true,
            },
        },
        privacy: {
            publicProfile: {
                type: Boolean,
                default: true,
            },
            publicGarage: {
                type: Boolean,
                default: false,
            },
        },
    },
    {
        timestamps: true,
    },
);

userSchema.index(
    {googleSub: 1},
    {
        unique: true,
        partialFilterExpression: {
            googleSub: {$type: 'string'},
        },
    },
);

userSchema.pre('validate', function () {
    if (!this.passwordHash && !this.googleSub) {
        this.invalidate(
            'passwordHash',
            'At least one authentication method is required',
        );
    }
});

export const User = mongoose.model<IUser>('User', userSchema);
