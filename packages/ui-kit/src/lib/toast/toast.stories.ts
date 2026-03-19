import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIToastContainer } from "./toast.component";
import { ToastService } from "./toast.service";
import { UIButton } from "../button/button.component";

@Component({
  selector: "ui-demo-toast-basic",
  standalone: true,
  imports: [UIToastContainer, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <ui-button (click)="showInfo()">Info</ui-button>
      <ui-button (click)="showSuccess()">Success</ui-button>
      <ui-button (click)="showWarning()">Warning</ui-button>
      <ui-button (click)="showError()">Error</ui-button>
    </div>
    <ui-toast-container />
  `,
})
class DemoToastBasicComponent {
  private readonly toast = inject(ToastService);

  public showInfo(): void {
    this.toast.info("This is an informational message.");
  }

  public showSuccess(): void {
    this.toast.success("Document saved successfully.");
  }

  public showWarning(): void {
    this.toast.warning("Your session will expire in 5 minutes.");
  }

  public showError(): void {
    this.toast.error("Failed to save. Please try again.");
  }
}

@Component({
  selector: "ui-demo-toast-with-actions",
  standalone: true,
  imports: [UIToastContainer, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <ui-button (click)="showUndo()">Delete with Undo</ui-button>
      <ui-button (click)="showWithTitle()">With Title</ui-button>
      <ui-button (click)="showPersistent()"
        >Persistent (no auto-dismiss)</ui-button
      >
    </div>
    <ui-toast-container />
  `,
})
class DemoToastWithActionsComponent {
  private readonly toast = inject(ToastService);

  public showUndo(): void {
    this.toast.success("Item deleted", {
      actionLabel: "Undo",
      actionFn: () => this.toast.info("Undo successful!"),
    });
  }

  public showWithTitle(): void {
    this.toast.show({
      title: "System Update",
      message: "A new version is available. Restart to apply.",
      severity: "info",
      actionLabel: "Restart",
      actionFn: () => this.toast.info("Restarting..."),
      duration: 8000,
    });
  }

  public showPersistent(): void {
    this.toast.error("Connection lost. Check your network.", {
      duration: 0,
    });
  }
}

@Component({
  selector: "ui-demo-toast-positions",
  standalone: true,
  imports: [UIToastContainer, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <ui-button (click)="show('top-left')">Top Left</ui-button>
      <ui-button (click)="show('top-center')">Top Center</ui-button>
      <ui-button (click)="show('top-right')">Top Right</ui-button>
      <ui-button (click)="show('bottom-left')">Bottom Left</ui-button>
      <ui-button (click)="show('bottom-center')">Bottom Center</ui-button>
      <ui-button (click)="show('bottom-right')">Bottom Right</ui-button>
    </div>
    <ui-toast-container position="top-left" />
    <ui-toast-container position="top-center" />
    <ui-toast-container position="top-right" />
    <ui-toast-container position="bottom-left" />
    <ui-toast-container position="bottom-center" />
    <ui-toast-container position="bottom-right" />
  `,
})
class DemoToastPositionsComponent {
  private readonly toast = inject(ToastService);

  public show(position: string): void {
    this.toast.info(`Toast at ${position}`, {
      position: position as Parameters<ToastService["show"]>[0]["position"],
    });
  }
}

const meta: Meta<UIToastContainer> = {
  title: "@Theredhead/UI Kit/Toast",
  component: UIToastContainer,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        DemoToastBasicComponent,
        DemoToastWithActionsComponent,
        DemoToastPositionsComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Auto-dismissing notification toasts.\n\n" +
          "### Setup\n" +
          "Place `<ui-toast-container />` in your root template. " +
          "Inject `ToastService` anywhere and call `info()`, `success()`, " +
          "`warning()`, or `error()`.\n\n" +
          "### Features\n" +
          "- Four severity levels with distinct icons and colors\n" +
          "- Six position options (top/bottom × left/center/right)\n" +
          "- Optional title, action button, and custom duration\n" +
          "- `duration: 0` for persistent toasts\n" +
          "- Slide-in/slide-out animations\n" +
          "- Full dark-mode support",
      },
    },
  },
};

export default meta;
type Story = StoryObj<UIToastContainer>;

export const AllSeverities: Story = {
  render: () => ({
    template: `<ui-demo-toast-basic />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Place the container once in your root template -->
<ui-toast-container />

// ── TypeScript ──
import { Component, inject } from '@angular/core';
import { UIToastContainer, ToastService } from '@theredhead/ui-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UIToastContainer],
  template: \`
    <button (click)="showInfo()">Info</button>
    <button (click)="showSuccess()">Success</button>
    <button (click)="showWarning()">Warning</button>
    <button (click)="showError()">Error</button>
    <ui-toast-container />
  \`,
})
export class AppComponent {
  private readonly toast = inject(ToastService);

  showInfo()    { this.toast.info('Informational message.'); }
  showSuccess() { this.toast.success('Document saved.'); }
  showWarning() { this.toast.warning('Session expiring soon.'); }
  showError()   { this.toast.error('Save failed.'); }
}

// ── SCSS ──
/* No custom styles needed — toast tokens handle theming. */
`,
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `<ui-demo-toast-with-actions />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-toast-container />

// ── TypeScript ──
import { Component, inject } from '@angular/core';
import { UIToastContainer, ToastService } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIToastContainer],
  template: \`
    <button (click)="deleteWithUndo()">Delete Item</button>
    <button (click)="showPersistent()">Persistent Error</button>
    <ui-toast-container />
  \`,
})
export class ExampleComponent {
  private readonly toast = inject(ToastService);

  deleteWithUndo() {
    this.toast.success('Item deleted', {
      actionLabel: 'Undo',
      actionFn: () => this.toast.info('Undo successful!'),
    });
  }

  showPersistent() {
    // duration: 0 keeps the toast until manually dismissed
    this.toast.error('Connection lost.', { duration: 0 });
  }
}

// ── SCSS ──
/* No custom styles needed — toast tokens handle theming. */
`,
      },
    },
  },
};

export const Positions: Story = {
  render: () => ({
    template: `<ui-demo-toast-positions />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Use multiple containers for different positions -->
<ui-toast-container position="top-right" />
<ui-toast-container position="bottom-center" />

// ── TypeScript ──
import { Component, inject } from '@angular/core';
import { UIToastContainer, ToastService } from '@theredhead/ui-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UIToastContainer],
  template: \`
    <ui-toast-container position="top-right" />
    <ui-toast-container position="bottom-center" />
  \`,
})
export class AppComponent {
  private readonly toast = inject(ToastService);

  notify() {
    // Toasts appear in the matching container
    this.toast.info('Top right toast', { position: 'top-right' });
    this.toast.success('Bottom center toast', { position: 'bottom-center' });
  }
}

// ── SCSS ──
/* No custom styles needed — positions are handled by the container. */
`,
      },
    },
  },
};
