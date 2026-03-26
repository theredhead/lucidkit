import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";

import {
  UIButton,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  ModalRef,
} from "@theredhead/ui-kit";

/**
 * Content component for an "About" dialog.
 *
 * Displayed by {@link CommonDialogService.about}. Shows the
 * application name, version, description, optional logo, copyright
 * notice, and credits.
 *
 * @internal — not intended for direct use; use the service instead.
 */
@Component({
  selector: "ui-about-dialog",
  standalone: true,
  imports: [UIButton, UIDialogHeader, UIDialogBody, UIDialogFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-about-dialog" },
  template: `
    <ui-dialog-header>About {{ appName() }}</ui-dialog-header>
    <ui-dialog-body>
      <div class="cd-about-content">
        @if (logoUrl()) {
          <img
            class="cd-about-logo"
            [src]="logoUrl()"
            [alt]="appName() + ' logo'"
          />
        }
        <h2 class="cd-about-name">{{ appName() }}</h2>
        @if (version()) {
          <span class="cd-about-version">Version {{ version() }}</span>
        }
        @if (description()) {
          <p class="cd-about-desc">{{ description() }}</p>
        }
        @if (credits().length > 0) {
          <div class="cd-about-credits">
            <h4 class="cd-about-credits-title">Credits</h4>
            <ul class="cd-about-credits-list">
              @for (credit of credits(); track credit) {
                <li>{{ credit }}</li>
              }
            </ul>
          </div>
        }
        @if (copyright()) {
          <p class="cd-about-copyright">{{ copyright() }}</p>
        }
      </div>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="filled" ariaLabel="Close" (click)="dismiss()">
        Close
      </ui-button>
    </ui-dialog-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-width: 22rem;
        max-width: 28rem;
      }
      .cd-about-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.25rem;
      }
      .cd-about-logo {
        width: 64px;
        height: 64px;
        object-fit: contain;
        margin-bottom: 0.5rem;
      }
      .cd-about-name {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
      }
      .cd-about-version {
        font-size: 0.82rem;
        color: var(--ui-text-muted, #5a6470);
      }
      .cd-about-desc {
        margin: 0.5rem 0 0;
        line-height: 1.55;
        font-size: 0.92rem;
      }
      .cd-about-credits {
        margin-top: 0.75rem;
        width: 100%;
        text-align: left;
      }
      .cd-about-credits-title {
        margin: 0 0 0.35rem;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .cd-about-credits-list {
        margin: 0;
        padding-left: 1.25rem;
        font-size: 0.85rem;
        line-height: 1.6;
        color: var(--ui-text-muted, #5a6470);
      }
      .cd-about-copyright {
        margin: 0.75rem 0 0;
        font-size: 0.78rem;
        color: var(--ui-text-muted, #5a6470);
      }
    `,
  ],
})
export class UIAboutDialog {
  public readonly appName = input("Application");
  public readonly version = input("");
  public readonly description = input("");
  public readonly logoUrl = input("");
  public readonly copyright = input("");
  public readonly credits = input<readonly string[]>([]);

  private readonly modalRef = inject(ModalRef<void>);

  public dismiss(): void {
    this.modalRef.close(undefined);
  }
}
