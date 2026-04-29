import { dirname } from "path";
import { fileURLToPath } from "url";

import type { StorybookConfig } from "@storybook/angular";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: [
    "../packages/ui-kit/src/**/*.mdx",
    "../packages/ui-kit/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../packages/ui-blocks/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../packages/ui-forms/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/angular"),
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  staticDirs: [
    "../public",
    {
      from: "../packages",
      to: "/workspace/packages",
    },
    {
      from: "../artifacts/storybook-screenshots",
      to: "/storybook-screenshots",
    },
  ],
  core: {
    disableTelemetry: true,
  },
  docs: {},
  webpackFinal: async (baseConfig) => ({
    ...baseConfig,
    performance: {
      hints: false,
    },
    ignoreWarnings: [
      ...(baseConfig.ignoreWarnings ?? []),
      (warning) => {
        const warningText =
          typeof warning === "string"
            ? warning
            : warning instanceof Error
              ? warning.message
              : ((warning as { message?: string }).message ?? "");

        return (
          warningText.includes("@eslint/plugin-kit") &&
          warningText.includes(
            "is part of the TypeScript compilation but it's unused",
          )
        );
      },
    ],
  }),
};
export default config;
