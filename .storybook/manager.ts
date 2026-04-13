// Storybook Manager Configuration
// Configure the Storybook UI theme

import { addons } from "storybook/manager-api";
import { themes, create } from "storybook/theming";

const theme = create({
  ...themes.dark,
  brandTitle: "LucidKit",
  brandUrl: "https://github.com/theredhead/lucidkit",
  brandTarget: "_blank",
});

// Use dark theme for Storybook UI
addons.setConfig({
  theme,
});
