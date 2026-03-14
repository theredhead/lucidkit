import {
  provideAnimationsAsync,
} from '@angular/platform-browser/animations/async';

import { themes } from 'storybook/theming';

import {
  applicationConfig,
  type Preview,
} from '@storybook/angular';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync()],
    }),
  ],
  parameters: {
    docs: {
      theme: themes.dark,
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1c1c1e' },
        { name: 'light', value: '#ffffff' },
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