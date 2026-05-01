import { type Meta } from "@storybook/angular";

import { UIAnalogClock } from "../../analog-clock.component";
import {
  ANALOG_CLOCK_STORY_ARG_TYPES,
  type AnalogClockStoryArgs,
} from "../analog-clock-story-helpers";

const meta = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: UIAnalogClock,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIAnalogClock` renders a classic analog clock face as inline SVG.",
          "",
          "## Key Features",
          "",
          "- **Live ticking** — when no `time` is provided the clock updates every second",
          "- **Fixed time** — pass a `Date` to `[time]` to freeze the hands",
          "- **Configurable** — toggle second hand, hour numbers, and tick marks",
          "- **Scalable** — set any `[size]` in pixels; the SVG scales cleanly",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Day/night indicator** — sun icon during the day, moon & stars at night, with tinted face colors",
          '- **Accessible** — `role="img"` with configurable `ariaLabel`',
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `time` | `Date \\| null` | `null` | Fixed time to display; `null` = live |",
          "| `size` | `number` | `200` | Diameter in CSS pixels |",
          "| `showSeconds` | `boolean` | `true` | Show the second hand |",
          "| `showNumbers` | `boolean` | `true` | Show 1–12 hour numbers |",
          "| `showTickMarks` | `boolean` | `true` | Show minute/hour tick marks |",
          '| `ariaLabel` | `string` | `"Analog clock"` | Accessible label |',
          "| `dayIcon` | `string` | Sun (Lucide) | SVG inner content for the day indicator |",
          "| `nightIcon` | `string` | MoonStar (Lucide) | SVG inner content for the night indicator |",
          '| `dayIconColor` | `string` | `"#f59e0b"` | Stroke colour for the day icon |',
          '| `nightIconColor` | `string` | `"#e8e0c0"` | Stroke colour for the night icon |',
        ].join("\n"),
      },
    },
  },
  argTypes: ANALOG_CLOCK_STORY_ARG_TYPES,
} satisfies Meta<AnalogClockStoryArgs>;

export default meta;
