import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from "@angular/core";
import { generateQRCodeMatrix } from "./qr-code.utils";

@Component({
  selector: "ui-qr-code",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="'0 0 ' + matrixSize() + ' ' + matrixSize()"
      [attr.aria-label]="ariaLabel()"
      role="img"
      [attr.style]="'background: ' + background() + '; display: block;'"
    >
      @for (row of matrix(); track $index; let y = $index) {
        @for (cell of row; track $index; let x = $index) {
          @if (cell) {
            <rect
              [attr.x]="x"
              [attr.y]="y"
              width="1"
              height="1"
              [attr.fill]="foreground()"
            />
          }
        }
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }
    `,
  ],
})
export class UIQRCode {
  public readonly value = input.required<string>();
  public readonly size = input<number>(128);
  public readonly foreground = input<string>("#222");
  public readonly background = input<string>("#fff");
  public readonly ariaLabel = input<string>("QR code");

  protected readonly matrix = computed(() =>
    generateQRCodeMatrix(this.value()),
  );
  protected readonly matrixSize = computed(() => this.matrix()[0]?.length || 0);
}
