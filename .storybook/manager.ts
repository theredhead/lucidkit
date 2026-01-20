// Storybook Manager Configuration
// Configure the Storybook UI theme

import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

// Use dark theme for Storybook UI
addons.setConfig({
    theme: themes.dark,
});
