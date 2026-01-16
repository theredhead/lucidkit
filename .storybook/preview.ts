import {
  provideAnimationsAsync,
} from '@angular/platform-browser/animations/async';

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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;