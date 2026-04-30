export interface AnalogClockStoryArgs {
  ariaLabel: string;
  dayIconColor: string;
  nightIconColor: string;
  showNumbers: boolean;
  showSeconds: boolean;
  showTickMarks: boolean;
  size: number;
}

export const ANALOG_CLOCK_STORY_ARG_TYPES = {
  size: {
    control: { type: "range", min: 40, max: 500, step: 10 },
    description: "Clock diameter in CSS pixels",
  },
  showSeconds: {
    control: "boolean",
    description: "Whether to show the second hand",
  },
  showNumbers: {
    control: "boolean",
    description: "Whether to show hour numbers (1–12)",
  },
  showTickMarks: {
    control: "boolean",
    description: "Whether to show tick marks around the rim",
  },
  dayIconColor: {
    control: "color",
    description: "Stroke colour for the daytime indicator icon",
  },
  nightIconColor: {
    control: "color",
    description: "Stroke colour for the nighttime indicator icon",
  },
  ariaLabel: {
    control: "text",
    description: "Accessible label for screen readers",
  },
} as const;
