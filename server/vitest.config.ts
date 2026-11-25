import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        // Allow time for replica-set startup and password hashing on slower machines.
        hookTimeout: 60_000,
        testTimeout: 15_000,
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.test.ts'],
        exclude: ['dist/**'],
    },
});
