import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIDialog } from "./dialog.component";
import { UIButton } from "../button/button.component";

@Component({
  selector: "ui-dialog-demo",
  standalone: true,
  imports: [UIDialog, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="showDialog.set(true)">Open Dialog</ui-button>

    <ui-dialog [(open)]="showDialog" ariaLabel="Example dialog">
      <span ui-dialog-title>Hello Dialog</span>
      <p>
        This is a declarative dialog component built on the native
        <code>&lt;dialog&gt;</code> element.
      </p>
      <p>It supports projected header, body, and footer slots.</p>
      <div ui-dialog-footer>
        <ui-button variant="outlined" (click)="showDialog.set(false)"
          >Cancel</ui-button
        >
        <ui-button (click)="showDialog.set(false)">OK</ui-button>
      </div>
    </ui-dialog>
  `,
})
class DialogDemo {
  public readonly showDialog = signal(false);
}

@Component({
  selector: "ui-dialog-nobackdrop-demo",
  standalone: true,
  imports: [UIDialog, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="showDialog.set(true)"
      >Open (no backdrop close)</ui-button
    >

    <ui-dialog
      [(open)]="showDialog"
      [closeOnBackdropClick]="false"
      ariaLabel="Persistent dialog"
    >
      <span ui-dialog-title>Persistent Dialog</span>
      <p>
        Clicking the backdrop won't close this dialog. You must use the button
        below.
      </p>
      <div ui-dialog-footer>
        <ui-button (click)="showDialog.set(false)">Got it</ui-button>
      </div>
    </ui-dialog>
  `,
})
class DialogNoBackdropDemo {
  public readonly showDialog = signal(false);
}

const meta: Meta<UIDialog> = {
  title: "@theredhead/UI Kit/Dialog",
  component: UIDialog,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [DialogDemo, DialogNoBackdropDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIDialog>;

/** Default declarative dialog with header / body / footer slots. */
export const Default: Story = {
  render: () => ({
    template: `<ui-dialog-demo />`,
  }),
};

/** Dialog that cannot be closed by clicking the backdrop. */
export const PersistentBackdrop: Story = {
  render: () => ({
    template: `<ui-dialog-nobackdrop-demo />`,
  }),
};
