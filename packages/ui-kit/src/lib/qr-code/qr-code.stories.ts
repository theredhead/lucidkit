import { Meta, StoryObj } from "@storybook/angular";
import { UIQRCode } from "./qr-code.component";

const meta: Meta<UIQRCode> = {
  title: "@Theredhead/UI Kit/QR Code",
  component: UIQRCode,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<UIQRCode>;

export const Rickroll: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-qr-code [value]="value" [size]="size" [foreground]="foreground" [background]="background" ariaLabel="QR code" />
      <div style="margin-top: 12px; color: #1d232b; background: #f7f8fa; padding: 8px; font-size: 14px;">Scan to get going!</div>
    `,
  }),
  args: {
    value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    size: 180,
    foreground: "#222",
    background: "#fff",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-qr-code [value]="'https://www.youtube.com/watch?v=dQw4w9WgXcQ'" [size]="180"></ui-qr-code>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIQRCode } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIQRCode],
  template: '<ui-qr-code [value]="'https://www.youtube.com/watch?v=dQw4w9WgXcQ'" [size]="180"></ui-qr-code>'
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — QR code tokens handle theming. */
`,
      },
    },
  },
};

export const CustomColors: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-qr-code [value]="value" [size]="size" [foreground]="foreground" [background]="background" ariaLabel="Custom color QR code" />
    `,
  }),
  args: {
    value: "https://theredhead.nl",
    size: 160,
    foreground: "#0a7cff",
    background: "#eaf6ff",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-qr-code [value]="'https://theredhead.nl'" [size]="160" [foreground]="'#0a7cff'" [background]="'#eaf6ff'"></ui-qr-code>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIQRCode } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIQRCode],
  template: '<ui-qr-code [value]="'https://theredhead.nl'" [size]="160" [foreground]="'#0a7cff'" [background]="'#eaf6ff'"></ui-qr-code>'
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — QR code tokens handle theming. */
`,
      },
    },
  },
};

export const WiFi: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-qr-code [value]="value" [size]="size" ariaLabel="WiFi QR code" />
      <div style="margin-top: 12px; color: #1d232b; background: #f7f8fa; padding: 8px; font-size: 14px;">Scan to connect to WiFi</div>
    `,
  }),
  args: {
    value: "WIFI:T:WPA;S:GuestNetwork;P:welcome123;;",
    size: 200,
    foreground: "#222",
    background: "#fff",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-qr-code [value]="wifiString" [size]="200"></ui-qr-code>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIQRCode } from '@theredhead/ui-kit';

@Component({
  selector: 'app-wifi-qr',
  standalone: true,
  imports: [UIQRCode],
  template: '<ui-qr-code [value]="wifiString" [size]="200"></ui-qr-code>',
})
export class WifiQrComponent {
  // Format: WIFI:T:<auth>;S:<ssid>;P:<password>;;
  // auth: WPA, WEP, or nopass
  public readonly wifiString = 'WIFI:T:WPA;S:GuestNetwork;P:welcome123;;';
}

// ── SCSS ──
/* No custom styles needed — QR code tokens handle theming. */
`,
      },
    },
  },
};
