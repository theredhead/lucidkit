import { provideZonelessChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { themes } from "storybook/theming";

import {
  applicationConfig,
  moduleMetadata,
  type Preview,
} from "@storybook/angular";

import { StoryChrome } from "./story-chrome.component";

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync(), provideZonelessChangeDetection()],
    }),
    moduleMetadata({
      imports: [StoryChrome],
    }),
    (story, context) => {
      const result = story();
      const tpl = result.template ?? "";

      if (context.viewMode !== "story") {
        return result;
      }

      return {
        ...result,
        props: {
          ...(result.props ?? {}),
          __storyId: context.id,
        },
        template: `
          <ui-story-chrome [storyId]="__storyId">
            ${tpl}
          </ui-story-chrome>
        `,
      };
    },
  ],
  tags: ["autodocs"],
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "@theredhead",
          [
            "Showcases",
            ["A Quick Tour", "*"],
            "UI Kit",
            "UI Blocks",
            "UI Forms",
            "*",
          ],
          "*",
        ],
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
