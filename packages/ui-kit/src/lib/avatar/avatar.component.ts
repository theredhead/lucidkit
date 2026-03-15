import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from "@angular/core";

/** Size preset for the avatar. */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Pixel dimensions for each avatar size (used for Gravatar requests). */
const AVATAR_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
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
 * <ui-avatar email="jane@example.com" name="Jane Doe" size="lg" />
 * <ui-avatar name="John Smith" size="lg" />
 * ```
 */
@Component({
  selector: "ui-avatar",
  standalone: true,
  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-avatar",
    "[class.ui-avatar--xs]": "size() === 'xs'",
    "[class.ui-avatar--sm]": "size() === 'sm'",
    "[class.ui-avatar--md]": "size() === 'md'",
    "[class.ui-avatar--lg]": "size() === 'lg'",
    "[class.ui-avatar--xl]": "size() === 'xl'",
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

  /** Size preset. */
  public readonly size = input<AvatarSize>("md");

  /** Accessible label. Falls back to `name`. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  // ── Computed ───────────────────────────────────────────────────

  /** @internal — Gravatar image URL (undefined when no email is set). */
  protected readonly gravatarUrl = computed(() => {
    const hash = this.gravatarHash();
    if (!hash) return undefined;
    const px = AVATAR_PX[this.size()] * 2; // 2× for retina
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

  // ── Constructor ────────────────────────────────────────────────

  public constructor() {
    // Compute SHA-256 hash when email changes
    effect(() => {
      const raw = this.email();
      if (!raw?.trim()) {
        this.gravatarHash.set(undefined);
        return;
      }
      const normalised = raw.trim().toLowerCase();
      void sha256Hex(normalised).then((hash) => this.gravatarHash.set(hash));
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
