import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { themes } from "storybook/theming";

import {
  applicationConfig,
  moduleMetadata,
  type Preview,
} from "@storybook/angular";

import { UIThemeToggle } from "../packages/ui-kit/src/lib/theme-toggle/theme-toggle.component";

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync()],
    }),
    moduleMetadata({
      imports: [UIThemeToggle],
    }),
    (story) => {
      const result = story();
      const tpl = result.template ?? "";
      return {
        ...result,
        template: `
          <div style="display: flex; justify-content: flex-end; padding: 4px 8px; margin-bottom: 12px">
            <ui-theme-toggle />
          </div>
          ${tpl}
        `,
      };
    },
  ],
  tags: ["autodocs"],
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
      },
    },
    docs: {
      theme: themes.dark,
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1c1c1e" },
        { name: "light", value: "#ffffff" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
