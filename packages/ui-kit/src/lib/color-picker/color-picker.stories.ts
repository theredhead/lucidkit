import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";

import { UIColorPicker } from "./color-picker.component";
import type { ColorPickerMode } from "./color-picker.types";

// ── Wrapper component for interactive demo ─────────────────────────

@Component({
  selector: "ui-story-color-picker-demo",
  standalone: true,
  imports: [UIColorPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <div style="display: flex; align-items: center; gap: 12px;">
        <ui-color-picker [(value)]="colour" ariaLabel="Pick a colour" />
        <span style="font-family: monospace; font-size: 14px;">{{
          colour()
        }}</span>
      </div>

      <div
        style="width: 100%; height: 64px; border-radius: 8px; border: 1px solid #ccc;"
        [style.background-color]="colour()"
      ></div>
    </div>
  `,
})
class ColorPickerDemoWrapper {
  public readonly colour = signal("#0061a4");
}

// ── Meta ────────────────────────────────────────────────────────────

const meta: Meta<UIColorPicker> = {
  title: "@theredhead/UI Kit/Color Picker",
  component: UIColorPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A colour-picker trigger button that opens a popover with four selection modes.",
      },
    },
  },
  argTypes: {
    value: {
      control: "color",
      description:
        "The current colour value as a hex string (`#rrggbb` or `#rrggbbaa`).",
    },
    initialMode: {
      control: "select",
      options: [
        "theme",
        "grid",
        "named",
        "rgba",
        "hsla",
      ] satisfies ColorPickerMode[],
      description: "Which tab the popover opens to by default.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the trigger button.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the trigger button.",
    },
  },
};

export default meta;
type Story = StoryObj<UIColorPicker>;

// ── Stories ─────────────────────────────────────────────────────────

/**
 * The default colour picker with `theme` mode.  Click the button to
 * open the popover and explore the four mode tabs.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-color-picker [value]="value" [initialMode]="initialMode" [disabled]="disabled" [ariaLabel]="ariaLabel" />`,
  }),
  args: {
    value: "#0061a4",
    initialMode: "theme",
    disabled: false,
    ariaLabel: "Pick a colour",
  },
  parameters: {
    docs: {
      description: {
        story:
          "### Modes\n" +
          "1. **Theme** — Material-style palette rows in tonal luminosities\n" +
          "2. **Grid** — 72-colour flat grid covering the full spectrum\n" +
          "3. **RGBA** — Red / Green / Blue / Alpha channel sliders\n" +
          "4. **HSLA** — Hue / Saturation / Lightness / Alpha sliders\n\n" +
          "### Features\n" +
          "- Two-way binding with `[(value)]` model signal\n" +
          "- Configurable initial mode via `initialMode` input\n" +
          "- Live colour preview and hex input inside the popover\n" +
          "- Full alpha channel support\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<ui-color-picker [(value)]="myColour" initialMode="rgba" />\n' +
          "```",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-color-picker
  [(value)]="colour"
  initialMode="theme"
  ariaLabel="Pick a colour"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  public readonly colour = signal('#0061a4');
}

// ── SCSS ──
/* No custom styles required — the picker is self-contained. */
`,
      },
    },
  },
};

/**
 * Opens directly to the RGBA slider tab, useful for precise colour
 * authoring workflows.
 */
export const RgbaMode: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-color-picker [value]="value" initialMode="rgba" />`,
  }),
  args: { value: "#e53935" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-color-picker
  [(value)]="colour"
  initialMode="rgba"
  ariaLabel="Pick a colour (RGBA)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-rgba-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './rgba-example.component.html',
})
export class RgbaExampleComponent {
  public readonly colour = signal('#e53935');
}

// ── SCSS ──
/* No custom styles required. */
`,
      },
    },
  },
};

/**
 * Opens to the HSLA slider tab, showing hue, saturation, lightness,
 * and alpha controls.
 */
export const HslaMode: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-color-picker [value]="value" initialMode="hsla" />`,
  }),
  args: { value: "#43a047" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-color-picker
  [(value)]="colour"
  initialMode="hsla"
  ariaLabel="Pick a colour (HSLA)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-hsla-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './hsla-example.component.html',
})
export class HslaExampleComponent {
  public readonly colour = signal('#43a047');
}

// ── SCSS ──
/* No custom styles required. */
`,
      },
    },
  },
};

/**
 * Opens to the colour grid tab — a quick 72-colour palette for fast
 * selection.
 */
export const GridMode: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-color-picker [value]="value" initialMode="grid" />`,
  }),
  args: { value: "#1565c0" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-color-picker
  [(value)]="colour"
  initialMode="grid"
  ariaLabel="Pick a colour (Grid)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-grid-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './grid-example.component.html',
})
export class GridExampleComponent {
  public readonly colour = signal('#1565c0');
}

// ── SCSS ──
/* No custom styles required. */
`,
      },
    },
  },
};

/** Disabled state — the button is visible but non-interactive. */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-color-picker value="#9c27b0" [disabled]="true" />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-color-picker
  [(value)]="colour"
  [disabled]="true"
  ariaLabel="Disabled colour picker"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-disabled-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './disabled-example.component.html',
})
export class DisabledExampleComponent {
  public readonly colour = signal('#9c27b0');
}

// ── SCSS ──
/* No custom styles required. */
`,
      },
    },
  },
};

/**
 * Interactive demo with two-way binding.  The selected colour is
 * reflected in the preview rectangle below the picker.
 */
export const Interactive: Story = {
  decorators: [moduleMetadata({ imports: [ColorPickerDemoWrapper] })],
  render: () => ({
    template: `<ui-story-color-picker-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<div class="colour-demo">
  <div class="colour-demo__row">
    <ui-color-picker [(value)]="colour" ariaLabel="Pick a colour" />
    <span class="colour-demo__hex">{{ colour() }}</span>
  </div>
  <div
    class="colour-demo__preview"
    [style.background-color]="colour()"
  ></div>
</div>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-interactive-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './interactive-example.component.html',
  styleUrl: './interactive-example.component.scss',
})
export class InteractiveExampleComponent {
  public readonly colour = signal('#0061a4');
}

// ── SCSS ──
.colour-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;

  &__row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__hex {
    font-family: monospace;
    font-size: 14px;
  }

  &__preview {
    width: 100%;
    height: 64px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
}
`,
      },
    },
  },
};
