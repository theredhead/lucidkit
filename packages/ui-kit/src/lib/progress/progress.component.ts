import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import type { ProgressMode, ProgressVariant } from "./progress.types";
import { UISurface } from '@theredhead/foundation';

/**
 * A progress indicator in linear (bar) or circular (ring) form.
 *
 * Supports determinate (value 0–100) and indeterminate (animated) modes.
 *
 * @example
 * ```html
 * <ui-progress [value]="75" />
 * <ui-progress variant="circular" [value]="40" />
 * <ui-progress mode="indeterminate" />
 * ```
 */
@Component({
  selector: "ui-progress",
  standalone: true,
  templateUrl: "./progress.component.html",
  styleUrl: "./progress.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-progress",
    "[class.ui-progress--linear]": "variant() === 'linear'",
    "[class.ui-progress--circular]": "variant() === 'circular'",
    "[class.ui-progress--determinate]": "mode() === 'determinate'",
    "[class.ui-progress--indeterminate]": "mode() === 'indeterminate'",
    role: "progressbar",
    "[attr.aria-valuenow]": "mode() === 'determinate' ? clampedValue() : null",
    "[attr.aria-valuemin]": "mode() === 'determinate' ? 0 : null",
    "[attr.aria-valuemax]": "mode() === 'determinate' ? 100 : null",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UIProgress {
  /** Shape: linear bar or circular ring. */
  public readonly variant = input<ProgressVariant>("linear");

  /** Mode: determinate shows value, indeterminate shows animation. */
  public readonly mode = input<ProgressMode>("determinate");

  /** Progress value (0–100). Only used in determinate mode. */
  public readonly value = input(0);

  /** Accessible label. */
  public readonly ariaLabel = input<string>("Progress");

  /** @internal — value clamped to 0–100. */
  protected readonly clampedValue = computed(() =>
    Math.min(100, Math.max(0, this.value())),
  );

  /** @internal — SVG stroke dash offset for circular variant. */
  protected readonly strokeDashoffset = computed(() => {
    const circumference = 2 * Math.PI * 18; // r=18
    return circumference - (this.clampedValue() / 100) * circumference;
  });

  /** @internal — SVG circumference constant. */
  protected readonly circumference = 2 * Math.PI * 18;
}
