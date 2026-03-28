import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/foundation";

/** Visual variant of the card. */
export type CardVariant = "elevated" | "outlined" | "filled";

/**
 * A versatile content container with optional header, body, and footer slots.
 *
 * Cards are the primary surface for grouping related content and actions.
 * They support three visual variants that control elevation, border, and
 * background treatment.
 *
 * @example
 * ```html
 * <ui-card>
 *   <ui-card-header>Title</ui-card-header>
 *   <ui-card-body>Content goes here</ui-card-body>
 *   <ui-card-footer>
 *     <ui-button>Action</ui-button>
 *   </ui-card-footer>
 * </ui-card>
 * ```
 */
@Component({
  selector: "ui-card",
  standalone: true,
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
  host: {
    class: "ui-card",
    "[class.ui-card--elevated]": "variant() === 'elevated'",
    "[class.ui-card--outlined]": "variant() === 'outlined'",
    "[class.ui-card--filled]": "variant() === 'filled'",
    "[class.ui-card--interactive]": "interactive()",
    role: "region",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UICard {
  /** Visual variant controlling elevation, border, and background. */
  public readonly variant = input<CardVariant>("elevated");

  /**
   * Whether the card responds to hover/focus with visual feedback.
   * Enable for clickable cards that act as navigation targets.
   */
  public readonly interactive = input(false);

  /** Accessible label for the card region. */
  public readonly ariaLabel = input<string | undefined>(undefined);
}

/**
 * Header section of a card. Typically contains a title and optional actions.
 *
 * @example
 * ```html
 * <ui-card-header>
 *   <h3>Card Title</h3>
 * </ui-card-header>
 * ```
 */
@Component({
  selector: "ui-card-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-card-header" },
  templateUrl: "./card-header.component.html",
})
export class UICardHeader {}

/**
 * Main content area of a card.
 *
 * @example
 * ```html
 * <ui-card-body>
 *   <p>Card content goes here.</p>
 * </ui-card-body>
 * ```
 */
@Component({
  selector: "ui-card-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-card-body" },
  templateUrl: "./card-body.component.html",
})
export class UICardBody {}

/**
 * Footer section of a card. Typically contains actions or metadata.
 *
 * @example
 * ```html
 * <ui-card-footer>
 *   <ui-button variant="text">Cancel</ui-button>
 *   <ui-button>Save</ui-button>
 * </ui-card-footer>
 * ```
 */
@Component({
  selector: "ui-card-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-card-footer" },
  templateUrl: "./card-footer.component.html",
})
export class UICardFooter {}
