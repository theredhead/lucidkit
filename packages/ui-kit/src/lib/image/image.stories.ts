import type { Meta, StoryObj } from "@storybook/angular";
import { UIImage } from "./image.component";

const meta: Meta<UIImage> = {
  title: "@theredhead/UI Kit/Image",
  component: UIImage,
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL.",
    },
    alt: {
      control: "text",
      description: "Alternative text for accessibility.",
    },
    width: {
      control: "number",
      description: "Width in pixels.",
    },
    height: {
      control: "number",
      description: "Height in pixels.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
};
export default meta;
type Story = StoryObj<UIImage>;

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-image [src]="src" [alt]="alt" [width]="width" [height]="height" />`,
  }),
  args: {
    src: SAMPLE_SRC,
    alt: "Mountain landscape",
    width: 400,
    height: 300,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-image src="photo.jpg" alt="Mountain landscape" [width]="400" [height]="300" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIImage } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIImage],
  template: \\\`<ui-image src="photo.jpg" alt="Mountain landscape" [width]="400" [height]="300" />\\\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* Use object-fit via CSS: ui-image img { object-fit: cover; } */
`,
      },
    },
  },
};

export const Contain: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-image [src]="src" [alt]="alt" [width]="width" [height]="height" style="object-fit: contain" />`,
  }),
  args: {
    src: SAMPLE_SRC,
    alt: "Contained image",
    width: 400,
    height: 300,
  },
};

export const Cover: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-image [src]="src" [alt]="alt" [width]="width" [height]="height" style="object-fit: cover" />`,
  }),
  args: {
    src: SAMPLE_SRC,
    alt: "Cover image",
    width: 400,
    height: 300,
  },
};

export const CustomSize: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-image [src]="src" alt="Wide banner" [width]="width" [height]="height" />`,
  }),
  args: {
    src: SAMPLE_SRC,
    width: 800,
    height: 200,
  },
};
