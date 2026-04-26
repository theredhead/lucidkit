export default {
  themes: ["light", "dark"],
  viewport: {
    width: 1440,
    height: 960,
  },
  selector: "#storybook-root",
  delayMs: 150,
  cropPadding: 16,
  outputDir: "artifacts/storybook-screenshots",
  includeDocs: false,
  components: {
    "@theredhead/UI Kit/Carousel": {
      shrinkWrap: false,
    },
    "@theredhead/UI Kit/Map View": {
      shrinkWrap: false,
      delayMs: 300,
    },
    "@theredhead/UI Kit/Progress": {
      shrinkWrap: false,
    },
    "@theredhead/UI Kit/Rich Text View": {
      shrinkWrap: false,
    },
  },
  stories: {
    "theredhead-ui-kit-rich-text-view--empty": {
      selector: "body",
      shrinkWrap: false,
    },
    // "theredhead-ui-kit-popover--rich-tooltip": {
    //   selector: "body",
    //   cropPadding: 32,
    // },
  },
};