import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from "@angular/core";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";
import { UISkeleton } from "../skeleton/skeleton.component";

/** Named size preset for the avatar. */
export type AvatarSizeName =
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large";

/** Accepted avatar size: a named preset or a pixel number. */
export type AvatarSize = AvatarSizeName | number;

/** Pixel dimensions for each named avatar size (used for Gravatar requests). */
const AVATAR_PX: Record<AvatarSizeName, number> = {
  "extra-small": 24,
  small: 32,
  medium: 40,
  large: 56,
  "extra-large": 80,
};

/**
 * Compute the SHA-256 hex digest of a string using the Web Crypto API.
 * @internal
 */
async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * An avatar showing an image, Gravatar, initials, or a fallback icon.
 *
 * Resolution order:
 * 1. Explicit `src` URL
 * 2. Gravatar image derived from `email`
 * 3. Initials derived from `name`
 * 4. Generic silhouette icon
 *
 * @example
 * ```html
 * <ui-avatar src="photo.jpg" name="Jane Doe" />
 * <ui-avatar email="jane@example.com" name="Jane Doe" size="large" />
 * <ui-avatar name="John Smith" [size]="48" />
 * ```
 */
@Component({
  selector: "ui-avatar",
  standalone: true,
  imports: [UISkeleton],
  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "avatar" }],
  host: {
    class: "ui-avatar",
    "[class.extra-small]": "size() === 'extra-small'",
    "[class.small]": "size() === 'small'",
    "[class.medium]": "size() === 'medium'",
    "[class.large]": "size() === 'large'",
    "[class.extra-large]": "size() === 'extra-large'",
    "[style.--avatar-custom-size]": "customSizePx()",
    "[class.custom]": "customSizePx()",
  },
})
export class UIAvatar {
  // ── Inputs ─────────────────────────────────────────────────────

  /** Image source URL. Takes precedence over Gravatar. */
  public readonly src = input<string | undefined>(undefined);

  /**
   * Email address used to fetch a
   * [Gravatar](https://gravatar.com) image.
   *
   * The email is trimmed, lower-cased, and SHA-256 hashed per the
   * Gravatar spec. Only used when no explicit `src` is provided.
   * If the Gravatar service returns 404 the component falls through
   * to initials / fallback icon.
   */
  public readonly email = input<string | undefined>(undefined);

  /** Name used to derive initials when no image is available. */
  public readonly name = input("");

  /** Size preset or pixel number. */
  public readonly size = input<AvatarSize>("medium");

  /** Accessible label. Falls back to `name`. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  // ── Computed ───────────────────────────────────────────────────

  /** @internal — resolved pixel size for the current size input. */
  protected readonly customSizePx = computed(() => {
    const s = this.size();
    return typeof s === "number" ? `${s}px` : null;
  });

  /** @internal — Gravatar image URL (undefined when no email is set). */
  protected readonly gravatarUrl = computed(() => {
    const hash = this.gravatarHash();
    if (!hash) return undefined;
    const s = this.size();
    const basePx = typeof s === "number" ? s : AVATAR_PX[s];
    const px = basePx * 2; // 2× for retina
    return `https://gravatar.com/avatar/${hash}?d=404&s=${px}`;
  });

  /**
   * The resolved image source: explicit `src` takes precedence,
   * then Gravatar, then `undefined` (falls through to initials / fallback).
   * @internal
   */
  protected readonly effectiveSrc = computed(
    () => this.src() ?? this.gravatarUrl(),
  );

  /** @internal — whether to show the image. */
  protected readonly showImage = computed(
    () => !!this.effectiveSrc() && !this.imgError(),
  );

  /** @internal — whether the Gravatar hash is being computed (show skeleton). */
  protected readonly showSkeleton = computed(
    () => this.gravatarLoading() && !this.src(),
  );

  /** @internal — derived initials from the name (max 2 letters). */
  protected readonly initials = computed(() => {
    const n = this.name().trim();
    if (!n) {
      return "";
    }
    const parts = n.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  });

  // ── Protected fields ───────────────────────────────────────────

  /** @internal — whether the image failed to load. */
  protected readonly imgError = signal(false);

  // ── Private fields ─────────────────────────────────────────────

  /** @internal — SHA-256 hex digest of the normalised email. */
  private readonly gravatarHash = signal<string | undefined>(undefined);
  /** @internal — true while sha256 hash is being computed. */
  private readonly gravatarLoading = signal(false);
  // ── Constructor ────────────────────────────────────────────────

  public constructor() {
    // Compute SHA-256 hash when email changes
    effect(() => {
      const raw = this.email();
      if (!raw?.trim()) {
        this.gravatarHash.set(undefined);
        this.gravatarLoading.set(false);
        return;
      }
      const normalised = raw.trim().toLowerCase();
      this.gravatarLoading.set(true);
      void sha256Hex(normalised).then((hash) => {
        this.gravatarHash.set(hash);
        this.gravatarLoading.set(false);
      });
    });

    // Reset image-error state whenever the resolved source changes
    effect(() => {
      this.effectiveSrc();
      untracked(() => this.imgError.set(false));
    });
  }

  // ── Protected methods ──────────────────────────────────────────

  /** @internal — handle image load error. */
  protected onImageError(): void {
    this.imgError.set(true);
  }
}
