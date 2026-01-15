/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    plugins: [
        angular({
            tsconfig: 'tsconfig.spec.json',
            inlineStylesExtension: 'scss',
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['packages/**/src/**/*.spec.ts'],
        exclude: ['node_modules', 'dist'],
        setupFiles: ['./vitest.setup.ts'],
        reporters: ['default'],
    },
    resolve: {
        alias: {
            '@sigmax/ui-kit': './packages/ui-kit/src/public-api.ts',
            '@sigmax/ui-blocks': './packages/ui-blocks/src/public-api.ts',
        },
    },
});
