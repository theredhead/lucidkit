import { provideZonelessChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { themes } from "storybook/theming";

import {
  applicationConfig,
  moduleMetadata,
  type Preview,
} from "@storybook/angular";

import { StoryToolbar } from "./story-toolbar.component";

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync(), provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [StoryToolbar],
    }),
    (story, context) => {
      const result = story();
      const tpl = result.template ?? "";
      if (context?.parameters?.["hideThemeToggle"]) {
        return result;
      }
      return {
        ...result,
        template: `
          <ui-story-toolbar />
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
