// A replica set supports the transactions used by authentication services.
import mongoose from 'mongoose';
import {MongoMemoryReplSet} from 'mongodb-memory-server';
import {afterAll, afterEach, beforeAll} from 'vitest';

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({replSet: {count: 1}});

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
