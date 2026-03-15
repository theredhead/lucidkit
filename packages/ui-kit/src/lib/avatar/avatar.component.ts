import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";

/** Size preset for the avatar. */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * An avatar showing an image, initials, or a fallback icon.
 *
 * Falls back to initials (derived from `name`) when the image fails
 * to load or no `src` is provided.
 *
 * @example
 * ```html
 * <ui-avatar src="photo.jpg" name="Jane Doe" />
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
  /** Image source URL. */
  public readonly src = input<string | undefined>(undefined);

  /** Name used to derive initials when no image is available. */
  public readonly name = input("");

  /** Size preset. */
  public readonly size = input<AvatarSize>("md");

  /** Accessible label. Falls back to `name`. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal — whether the image failed to load. */
  protected readonly imgError = signal(false);

  /** @internal — whether to show the image. */
  protected readonly showImage = computed(
    () => !!this.src() && !this.imgError(),
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

  /** @internal — handle image load error. */
  protected onImageError(): void {
    this.imgError.set(true);
  }
}
