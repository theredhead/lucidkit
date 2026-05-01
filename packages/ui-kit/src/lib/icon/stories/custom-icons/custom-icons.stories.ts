import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";

import { CustomIconsStorySource } from "./custom-icons.story";

const meta = {
  title: "@theredhead/UI Kit/Icon",
  component: CustomIconsStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders an inline SVG icon from a raw SVG string. The library ships " +
          "a categorised icon registry (`UIIcons.Lucide`) generated from the " +
          "[Lucide](https://lucide.dev) icon set, but you can also create and use " +
          "**your own custom icons**.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [CustomIconsStorySource] })]
} satisfies Meta<CustomIconsStorySource>;

export default meta;
type Story = StoryObj<CustomIconsStorySource>;

export const CustomIcons: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    props: {
      customIcons: [
        {
          name: "Diamond",
          svg: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />`,
        },
        {
          name: "Spark",
          svg: `<path d="M12 3 13.5 8.5 19 10 13.5 11.5 12 17 10.5 11.5 5 10 10.5 8.5Z" />`,
        },
        {
          name: "Crosshair",
          svg: `<circle cx="12" cy="12" r="8" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><circle cx="12" cy="12" r="2" />`,
        },
        {
          name: "Lightning",
          svg: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />`,
        },
        {
          name: "Heart (filled)",
          svg: `<path fill="currentColor" stroke="none" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />`,
          cssClass: "heart",
        },
        {
          name: "Waves",
          svg: `<path d="M2 6c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" /><path d="M2 12c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" /><path d="M2 18c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" />`,
        },
      ],
    },
    template: `
      <style>ui-icon.heart { color: #e74c3c; }</style>
      <div style="font-family: system-ui, sans-serif;">
        <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
          These icons are <strong>not</strong> from the built-in Lucide registry —
          they are raw SVG strings passed directly to the <code>svg</code> input.
        </p>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          @for (icon of customIcons; track icon.name) {
            <div style="text-align: center; min-width: 80px;">
              <ui-icon [svg]="icon.svg" [size]="32" [class]="icon.cssClass || ''" />
              <div style="font-size: 11px; color: #888; margin-top: 6px;">{{ icon.name }}</div>
            </div>
          }
        </div>
        <details style="margin-top: 24px; font-size: 13px; color: #555;">
          <summary style="cursor: pointer; font-weight: 600;">How it works</summary>
          <ul style="margin-top: 8px; line-height: 1.8;">
            <li>The <code>svg</code> input accepts any SVG inner markup (paths, circles, lines, etc.)</li>
            <li>The component wraps it in <code>&lt;svg viewBox="0 0 24 24"&gt;</code> with stroke rendering</li>
            <li>Design custom icons on a <strong>24 × 24 grid</strong> to match the built-in set</li>
            <li>For filled icons, add <code>fill="currentColor" stroke="none"</code> on your paths</li>
            <li>Icons inherit the parent's CSS <code>color</code> via <code>currentColor</code></li>
            <li>Group related custom icons in a <code>const</code> object for tree-shaking</li>
          </ul>
        </details>
      </div>
    `,
  })
};
