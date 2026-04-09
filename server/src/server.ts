import app from './app';
import {env} from './config/env';
import {connectDB} from './config/db';

const PORT = Number(env.PORT);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
