// Global integration test setup will live here.
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {afterAll, afterEach, beforeAll} from 'vitest';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
