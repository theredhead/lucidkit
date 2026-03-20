// ── UIFieldPalette ──────────────────────────────────────────────────

import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { UIIcon, UIIcons } from "@theredhead/ui-kit";

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
  host: { class: "ui-field-palette" },
  template: `
    <h3 class="fp-heading">Fields</h3>
    <div class="fp-list">
      @for (ft of fieldTypes; track ft.key) {
        <button
          type="button"
          class="fp-item"
          [title]="ft.description"
          (click)="fieldRequested.emit(ft.key)"
          draggable="true"
          (dragstart)="onDragStart($event, ft.key)"
        >
          <ui-icon class="fp-icon" [svg]="ft.icon" [size]="16" />
          <span class="fp-label">{{ ft.label }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      background: var(--ui-surface, #f7f8fa);
      border-right: 1px solid var(--ui-border, #d7dce2);
      overflow-y: auto;
      padding: 12px;
      min-width: 180px;
    }

    .fp-heading {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 10px;
      color: var(--ui-text, #1d232b);
      opacity: 0.6;
    }

    .fp-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .fp-item {
      appearance: none;
      border: 1px solid var(--ui-border, #d7dce2);
      background: var(--ui-surface-alt, #ffffff);
      border-radius: 6px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: grab;
      font-size: 0.8125rem;
      color: var(--ui-text, #1d232b);
      transition:
        background 0.12s ease,
        border-color 0.12s ease;
    }

    .fp-item:hover {
      background: var(--theredhead-primary-container, #d6e3ff);
      border-color: var(--theredhead-primary, #3584e4);
    }

    .fp-item:active {
      cursor: grabbing;
    }

    .fp-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      opacity: 0.7;
    }

    .fp-label {
      font-weight: 500;
    }

    :host-context(html.dark-theme) {
      background: var(--ui-surface, #1e2128);
      border-right-color: var(--ui-border, #3a3f47);

      .fp-heading {
        color: var(--ui-text, #f2f6fb);
      }

      .fp-item {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
        color: var(--ui-text, #f2f6fb);
      }

      .fp-item:hover {
        background: var(--theredhead-primary-container, #004787);
        border-color: var(--theredhead-primary, #a8c8ff);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        background: var(--ui-surface, #1e2128);
        border-right-color: var(--ui-border, #3a3f47);

        .fp-heading {
          color: var(--ui-text, #f2f6fb);
        }

        .fp-item {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
          color: var(--ui-text, #f2f6fb);
        }

        .fp-item:hover {
          background: var(--theredhead-primary-container, #004787);
          border-color: var(--theredhead-primary, #a8c8ff);
        }
      }
    }
  `,
})
export class UIFieldPalette {
  /** Emitted when the user clicks a field type to add it. */
  public readonly fieldRequested = output<string>();

  /** @internal Available field types. */
  protected readonly fieldTypes = PALETTE_FIELDS;

  /** @internal */
  protected onDragStart(event: DragEvent, key: string): void {
    event.dataTransfer?.setData("text/plain", key);
    event.dataTransfer!.effectAllowed = "copy";
  }
}
