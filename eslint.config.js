// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "ui",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "ui",
          style: "kebab-case",
        },
      ],
      // Allow non-null assertions — common in Angular with ViewChild etc.
      "@typescript-eslint/no-non-null-assertion": "off",
      // Allow empty functions — lifecycle hooks, abstract stubs
      "@typescript-eslint/no-empty-function": "off",
      // Warn on explicit any
      "@typescript-eslint/no-explicit-any": "warn",
      // Warn on unused vars (allow underscore prefix to skip)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Allow empty interfaces for Angular DI tokens etc.
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      // Prefer inject() over constructor injection — warn for now, migrate later
      "@angular-eslint/prefer-inject": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    // Ignore build outputs, resources, generated files, and coverage reports
    ignores: [
      "dist/",
      "storybook-static/",
      "node_modules/",
      ".angular/",
      "resources/",
      "coverage/",
      "**/*.generated.ts",
      "packages/ui-kit/src/stories/",
    ],
  },
);
