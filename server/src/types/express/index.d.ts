import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface UserPayload {
            userId: mongoose.Types.ObjectId;
            email: string;
        }

        interface Request {
            user?: UserPayload;
        }
    }
}

export {};
