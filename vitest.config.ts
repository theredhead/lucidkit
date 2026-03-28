/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vitest/config";

import angular from "@analogjs/vite-plugin-angular";

const root = import.meta.dirname;

export default defineConfig({
  plugins: [
    angular({
      tsconfig: "tsconfig.spec.json",
      inlineStylesExtension: "scss",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["packages/**/src/**/*.spec.ts"],
    exclude: ["node_modules", "dist"],
    setupFiles: ["./vitest.setup.ts"],
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
    },
  },
  resolve: {
    alias: {
      "@theredhead/foundation": resolve(
        root,
        "packages/foundation/src/public-api.ts",
      ),
      "@theredhead/ui-kit": resolve(root, "packages/ui-kit/src/public-api.ts"),
      "@theredhead/ui-blocks": resolve(
        root,
        "packages/ui-blocks/src/public-api.ts",
      ),
      "@theredhead/ui-forms": resolve(
        root,
        "packages/ui-forms/src/public-api.ts",
      ),
      "@theredhead/ui-theme": resolve(
        root,
        "packages/ui-theme/src/public-api.ts",
      ),
    },
  },
});
