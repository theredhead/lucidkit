// ── UIFieldPalette ──────────────────────────────────────────────────

import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { UIIcon, UIIcons } from "@theredhead/lucid-kit";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * Metadata for a draggable field type shown in the palette.
 */
export interface PaletteFieldType {
  /** Registry component key (e.g. `"text"`, `"select"`). */
  readonly key: string;
  /** Display label. */
  readonly label: string;
  /** Short description shown on hover. */
  readonly description: string;
  /** SVG icon content from the `UIIcons` registry. */
  readonly icon: string;
}

/** All built-in field types available in the palette. */
const PALETTE_FIELDS: readonly PaletteFieldType[] = [
  {
    key: "text",
    label: "Text",
    description: "Single-line text input",
    icon: UIIcons.Lucide.Text.TextCursorInput,
  },
  {
    key: "select",
    label: "Select",
    description: "Dropdown selection",
    icon: UIIcons.Lucide.Arrows.ChevronsUpDown,
  },
  {
    key: "checkbox",
    label: "Checkbox",
    description: "Boolean checkbox",
    icon: UIIcons.Lucide.Notifications.SquareCheck,
  },
  {
    key: "toggle",
    label: "Toggle",
    description: "On/off toggle switch",
    icon: UIIcons.Lucide.Account.ToggleLeft,
  },
  {
    key: "radio",
    label: "Radio",
    description: "Radio button group",
    icon: UIIcons.Lucide.Shapes.CircleDot,
  },
  {
    key: "autocomplete",
    label: "Autocomplete",
    description: "Search with suggestions",
    icon: UIIcons.Lucide.Social.Search,
  },
  {
    key: "date",
    label: "Date",
    description: "Date picker",
    icon: UIIcons.Lucide.Time.Calendar,
  },
  {
    key: "time",
    label: "Time",
    description: "Time picker",
    icon: UIIcons.Lucide.Time.Clock,
  },
  {
    key: "datetime",
    label: "Date/Time",
    description: "Date and time picker",
    icon: UIIcons.Lucide.Time.CalendarClock,
  },
  {
    key: "color",
    label: "Color",
    description: "Color picker",
    icon: UIIcons.Lucide.Design.Palette,
  },
  {
    key: "slider",
    label: "Slider",
    description: "Numeric range slider",
    icon: UIIcons.Lucide.Account.SlidersHorizontal,
  },
  {
    key: "richtext",
    label: "Rich Text",
    description: "Rich text editor",
    icon: UIIcons.Lucide.Text.Pilcrow,
  },
  {
    key: "file",
    label: "File",
    description: "File upload",
    icon: UIIcons.Lucide.Files.FileUp,
  },
];

/** Flair (non-data) types available in the palette. */
const PALETTE_FLAIR: readonly PaletteFieldType[] = [
  {
    key: "flair:richtext",
    label: "Rich Text",
    description: "Static rich text content",
    icon: UIIcons.Lucide.Text.PenLine,
  },
  {
    key: "flair:image",
    label: "Image",
    description: "Static image",
    icon: UIIcons.Lucide.Photography.Image,
  },
  {
    key: "flair:media",
    label: "Media",
    description: "Audio or video player",
    icon: UIIcons.Lucide.Communication.Video,
  },
];

/**
 * Palette sidebar that lists available field types. Clicking or
 * dragging a type emits the component key so the parent can add
 * it to the canvas.
 *
 * @example
 * ```html
 * <ui-field-palette (fieldRequested)="onAddField($event)" />
 * ```
 */
@Component({
  selector: "ui-field-palette",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-field-palette" },
  templateUrl: "./field-palette.component.html",
  styleUrl: "./field-palette.component.scss",
})
export class UIFieldPalette {
  /** Emitted when the user clicks a field type to add it. */
  public readonly fieldRequested = output<string>();

  /** @internal Available field types. */
  protected readonly fieldTypes = PALETTE_FIELDS;

  /** @internal Available flair types. */
  protected readonly flairTypes = PALETTE_FLAIR;

  /** @internal */
  protected onDragStart(event: DragEvent, key: string): void {
    event.dataTransfer?.setData("text/plain", key);
    event.dataTransfer!.effectAllowed = "copy";
  }
}
