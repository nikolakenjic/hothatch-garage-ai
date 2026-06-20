import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface UserPayload {
            userId: mongoose.Types.ObjectId;
        }

        interface Request {
            user?: UserPayload;
        }
    }
}

export {};
