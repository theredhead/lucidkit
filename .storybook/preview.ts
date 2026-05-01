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
      // @ts-expect-error implicit any on storySort params — Storybook parses preview.ts as raw JS
      storySort: (a, b) => {
        const sections = ["Showcases", "UI Kit", "UI Blocks", "UI Forms"];
        const aIdx = sections.findIndex((s) =>
          a.title.startsWith(`@theredhead/${s}`),
        );
        const bIdx = sections.findIndex((s) =>
          b.title.startsWith(`@theredhead/${s}`),
        );

        if (aIdx !== bIdx) {
          if (aIdx === -1) return 1;
          if (bIdx === -1) return -1;
          return aIdx - bIdx;
        }

        if (a.title !== b.title) return a.title.localeCompare(b.title);

        if (a.type === "docs") return -1;
        if (b.type === "docs") return 1;
        if (a.name === "Default") return -1;
        if (b.name === "Default") return 1;
        return a.name.localeCompare(b.name);
      },
    },
    docs: {
      theme: themes.dark,
    },
    backgrounds: {
      disable: true,
    },
    toolbar: {
      background: { hidden: true },
      "storybook/background": { hidden: true },
      theme: { hidden: true },
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
