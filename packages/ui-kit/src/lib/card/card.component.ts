import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  UISurface,
  UI_DEFAULT_SURFACE_TYPE,
} from "@theredhead/lucid-foundation";
import { UIAvatar, type AvatarSize } from "../avatar/avatar.component";
import { UIIcon } from "../icon/icon.component";

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
    "[class.elevated]": "variant() === 'elevated'",
    "[class.outlined]": "variant() === 'outlined'",
    "[class.filled]": "variant() === 'filled'",
    "[class.interactive]": "interactive()",
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
  imports: [UIAvatar, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-card-header" },
  templateUrl: "./card-header.component.html",
  styleUrl: "./card-header.component.scss",
})
export class UICardHeader {
  /** Optional leading icon shown before the header content. Ignored when avatar inputs are provided. */
  public readonly icon = input<string | undefined>(undefined);

  /** Accessible label for the leading icon. Leave empty for decorative icons. */
  public readonly iconAriaLabel = input<string>("");

  /** Size of the leading icon in pixels. */
  public readonly iconSize = input<number>(20);

  /** Avatar image source for the leading avatar. */
  public readonly avatarSrc = input<string | undefined>(undefined);

  /** Avatar email for Gravatar resolution when no explicit avatar source is set. */
  public readonly avatarEmail = input<string | undefined>(undefined);

  /** Avatar name used for initials when no image is available. */
  public readonly avatarName = input<string>("");

  /** Accessible label for the leading avatar. Leave empty for decorative avatars. */
  public readonly avatarAriaLabel = input<string>("");

  /** Size of the leading avatar. */
  public readonly avatarSize = input<AvatarSize>("small");

  /** Optional secondary line shown beneath the main header content. */
  public readonly subtitle = input<string | undefined>(undefined);

  /** @internal */
  protected readonly hasAvatar = computed(
    () => !!this.avatarSrc() || !!this.avatarEmail() || !!this.avatarName(),
  );

  /** @internal */
  protected readonly hasLeadingMedia = computed(
    () => this.hasAvatar() || !!this.icon(),
  );
}

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
 * Full-width media block for use inside a card body.
 *
 * The image fills the available body width and uses `object-fit: cover`
 * within its aspect-ratio box.
 *
 * @example
 * ```html
 * <ui-card-body>
 *   <ui-card-image src="/hero.jpg" alt="Mountain lake" />
 *   <p>Supporting card content.</p>
 * </ui-card-body>
 * ```
 */
@Component({
  selector: "ui-card-image",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-card-image",
    "[style.aspect-ratio]": "aspectRatio()",
  },
  templateUrl: "./card-image.component.html",
  styleUrl: "./card-image.component.scss",
})
export class UICardImage {
  /** Image source URL. */
  public readonly src = input.required<string>();

  /** Alt text forwarded to the native image element. */
  public readonly alt = input<string>("");

  /** Accessible label forwarded to the native image element when needed. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** Aspect ratio used to size the image block. */
  public readonly aspectRatio = input<string>("16 / 9");
}

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
