// ── UIDesignerCanvas ────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/ui-kit";

import type {
  FormDesignerEngine,
  MutableGroupDefinition,
} from "./designer-engine";

/**
 * The central canvas of the form designer. Displays all groups
 * and their fields as interactive cards that can be selected,
 * reordered, and deleted.
 *
 * @example
 * ```html
 * <ui-designer-canvas [engine]="engine" />
 * ```
 */
@Component({
  selector: "ui-designer-canvas",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-designer-canvas" },
  template: `
    <!-- Form header (click to select form-level props) -->
    <button
      type="button"
      class="dc-form-header"
      [class.dc-form-header--selected]="engine().selection()?.kind === 'form'"
      (click)="engine().selectForm()"
    >
      <span class="dc-form-title">
        {{ engine().formTitle() || "Untitled Form" }}
      </span>
      @if (engine().formDescription()) {
        <span class="dc-form-desc">{{ engine().formDescription() }}</span>
      }
    </button>

    <!-- Groups -->
    @for (group of engine().groups(); track group.uid; let gi = $index) {
      <section
        class="dc-group"
        [class.dc-group--selected]="
          engine().selection()?.kind === 'group' &&
          engine().selection()?.groupUid === group.uid
        "
        (drop)="onDropField($event, group)"
        (dragover)="onDragOver($event)"
      >
        <!-- Group header -->
        <div
          class="dc-group-header"
          tabindex="0"
          role="button"
          (click)="engine().selectGroup(group.uid)"
          (keydown.enter)="engine().selectGroup(group.uid)"
        >
          <span class="dc-group-title">{{
            group.title() || "Group " + (gi + 1)
          }}</span>
          <div class="dc-group-actions">
            <button
              type="button"
              class="dc-icon-btn"
              title="Move up"
              [disabled]="gi === 0"
              (click)="moveGroupUp($event, group.uid, gi)"
            >
              <ui-icon [svg]="icons.ChevronUp" [size]="14" />
            </button>
            <button
              type="button"
              class="dc-icon-btn"
              title="Move down"
              [disabled]="gi === engine().groups().length - 1"
              (click)="moveGroupDown($event, group.uid, gi)"
            >
              <ui-icon [svg]="icons.ChevronDown" [size]="14" />
            </button>
            <button
              type="button"
              class="dc-icon-btn dc-icon-btn--danger"
              title="Remove group"
              (click)="removeGroup($event, group.uid)"
            >
              <ui-icon [svg]="icons.X" [size]="14" />
            </button>
          </div>
        </div>

        <!-- Fields -->
        <div class="dc-fields">
          @for (field of group.fields(); track field.uid; let fi = $index) {
            <div
              class="dc-field"
              [class.dc-field--selected]="
                engine().selection()?.fieldUid === field.uid
              "
              tabindex="0"
              role="button"
              (click)="engine().selectField(group.uid, field.uid)"
              (keydown.enter)="engine().selectField(group.uid, field.uid)"
            >
              <div class="dc-field-info">
                <span class="dc-field-component">{{ field.component() }}</span>
                <span class="dc-field-title">{{ field.title() }}</span>
                <span class="dc-field-id">{{ field.id() }}</span>
              </div>
              <div class="dc-field-actions">
                <button
                  type="button"
                  class="dc-icon-btn"
                  title="Move up"
                  [disabled]="fi === 0"
                  (click)="moveFieldUp($event, group.uid, field.uid, fi)"
                >
                  <ui-icon [svg]="icons.ChevronUp" [size]="14" />
                </button>
                <button
                  type="button"
                  class="dc-icon-btn"
                  title="Move down"
                  [disabled]="fi === group.fields().length - 1"
                  (click)="moveFieldDown($event, group.uid, field.uid, fi)"
                >
                  <ui-icon [svg]="icons.ChevronDown" [size]="14" />
                </button>
                <button
                  type="button"
                  class="dc-icon-btn"
                  title="Duplicate"
                  (click)="duplicateField($event, group.uid, field.uid)"
                >
                  <ui-icon [svg]="icons.Copy" [size]="14" />
                </button>
                <button
                  type="button"
                  class="dc-icon-btn dc-icon-btn--danger"
                  title="Remove field"
                  (click)="removeField($event, group.uid, field.uid)"
                >
                  <ui-icon [svg]="icons.X" [size]="14" />
                </button>
              </div>
            </div>
          }

          @if (group.fields().length === 0) {
            <div class="dc-empty">
              Drop or click a field type to add it here
            </div>
          }
        </div>

        <!-- Add field button -->
        <button
          type="button"
          class="dc-add-field"
          (click)="addFieldRequest.emit(group.uid)"
        >
          + Add field
        </button>
      </section>
    }

    <!-- Add group button -->
    <button type="button" class="dc-add-group" (click)="engine().addGroup()">
      + Add group
    </button>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: var(--ui-surface-bg, #eef1f5);
    }

    /* Form header */

    .dc-form-header {
      appearance: none;
      border: 2px dashed var(--ui-border, #d7dce2);
      background: var(--ui-surface-alt, #ffffff);
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
      text-align: left;
      transition: border-color 0.15s ease;
    }

    .dc-form-header:hover {
      border-color: var(--theredhead-primary, #3584e4);
    }

    .dc-form-header--selected {
      border-color: var(--theredhead-primary, #3584e4);
      border-style: solid;
      background: var(--theredhead-primary-container, #d6e3ff);
    }

    .dc-form-title {
      display: block;
      font-weight: 700;
      font-size: 1rem;
      color: var(--ui-text, #1d232b);
    }

    .dc-form-desc {
      display: block;
      font-size: 0.8125rem;
      opacity: 0.65;
      margin-top: 2px;
    }

    /* Groups */

    .dc-group {
      border: 1px solid var(--ui-border, #d7dce2);
      border-radius: 8px;
      background: var(--ui-surface-alt, #ffffff);
      overflow: hidden;
    }

    .dc-group--selected {
      border-color: var(--theredhead-primary, #3584e4);
      box-shadow: 0 0 0 1px var(--theredhead-primary, #3584e4);
    }

    .dc-group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--ui-surface, #f0f2f5);
      cursor: pointer;
      border-bottom: 1px solid var(--ui-border, #d7dce2);
    }

    .dc-group-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--ui-text, #1d232b);
    }

    .dc-group-actions {
      display: flex;
      gap: 2px;
    }

    /* Fields */

    .dc-fields {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-height: 40px;
    }

    .dc-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border: 1px solid var(--ui-border, #d7dce2);
      border-radius: 6px;
      cursor: pointer;
      background: var(--ui-surface-alt, #ffffff);
      transition:
        border-color 0.12s ease,
        background 0.12s ease;
    }

    .dc-field:hover {
      border-color: var(--theredhead-primary, #3584e4);
    }

    .dc-field--selected {
      border-color: var(--theredhead-primary, #3584e4);
      background: var(--theredhead-primary-container, #d6e3ff);
    }

    .dc-field-info {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .dc-field-component {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--theredhead-primary, #3584e4);
      color: var(--theredhead-on-primary, #ffffff);
      padding: 2px 6px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .dc-field-title {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--ui-text, #1d232b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dc-field-id {
      font-size: 0.75rem;
      opacity: 0.5;
      font-family: monospace;
    }

    .dc-field-actions {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.12s ease;
    }

    .dc-field:hover .dc-field-actions {
      opacity: 1;
    }

    .dc-field--selected .dc-field-actions {
      opacity: 1;
    }

    .dc-empty {
      text-align: center;
      padding: 16px;
      font-size: 0.8125rem;
      opacity: 0.5;
      font-style: italic;
    }

    /* Icon buttons */

    .dc-icon-btn {
      appearance: none;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.8125rem;
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: var(--ui-text, #1d232b);
      transition: background 0.1s ease;
    }

    .dc-icon-btn:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .dc-icon-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .dc-icon-btn--danger:hover {
      background: var(--theredhead-error, #ba1a1a);
      color: #ffffff;
    }

    /* Add buttons */

    .dc-add-field {
      appearance: none;
      border: 1px dashed var(--ui-border, #d7dce2);
      background: transparent;
      border-radius: 6px;
      padding: 8px;
      margin: 4px 8px 8px;
      cursor: pointer;
      font-size: 0.8125rem;
      color: var(--theredhead-primary, #3584e4);
      font-weight: 500;
      transition: background 0.12s ease;
    }

    .dc-add-field:hover {
      background: var(--theredhead-primary-container, #d6e3ff);
    }

    .dc-add-group {
      appearance: none;
      border: 2px dashed var(--ui-border, #d7dce2);
      background: transparent;
      border-radius: 8px;
      padding: 14px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--theredhead-primary, #3584e4);
      transition:
        background 0.12s ease,
        border-color 0.12s ease;
    }

    .dc-add-group:hover {
      background: var(--theredhead-primary-container, #d6e3ff);
      border-color: var(--theredhead-primary, #3584e4);
    }

    /* Dark mode */

    :host-context(html.dark-theme) {
      background: var(--ui-surface-bg, #16181d);

      .dc-form-header {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
      }
      .dc-form-header--selected {
        background: var(--theredhead-primary-container, #004787);
      }
      .dc-form-title {
        color: var(--ui-text, #f2f6fb);
      }

      .dc-group {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
      }
      .dc-group-header {
        background: var(--ui-surface, #1e2128);
        border-bottom-color: var(--ui-border, #3a3f47);
      }
      .dc-group-title {
        color: var(--ui-text, #f2f6fb);
      }

      .dc-field {
        background: var(--ui-surface, #1e2128);
        border-color: var(--ui-border, #3a3f47);
      }
      .dc-field--selected {
        background: var(--theredhead-primary-container, #004787);
      }
      .dc-field-title {
        color: var(--ui-text, #f2f6fb);
      }

      .dc-icon-btn {
        color: var(--ui-text, #f2f6fb);
      }
      .dc-icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .dc-add-field {
        border-color: var(--ui-border, #3a3f47);
        color: var(--theredhead-primary, #a8c8ff);
      }
      .dc-add-field:hover {
        background: var(--theredhead-primary-container, #004787);
      }

      .dc-add-group {
        border-color: var(--ui-border, #3a3f47);
        color: var(--theredhead-primary, #a8c8ff);
      }
      .dc-add-group:hover {
        background: var(--theredhead-primary-container, #004787);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        background: var(--ui-surface-bg, #16181d);

        .dc-form-header {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
        }
        .dc-form-header--selected {
          background: var(--theredhead-primary-container, #004787);
        }
        .dc-form-title {
          color: var(--ui-text, #f2f6fb);
        }

        .dc-group {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
        }
        .dc-group-header {
          background: var(--ui-surface, #1e2128);
          border-bottom-color: var(--ui-border, #3a3f47);
        }
        .dc-group-title {
          color: var(--ui-text, #f2f6fb);
        }

        .dc-field {
          background: var(--ui-surface, #1e2128);
          border-color: var(--ui-border, #3a3f47);
        }
        .dc-field--selected {
          background: var(--theredhead-primary-container, #004787);
        }
        .dc-field-title {
          color: var(--ui-text, #f2f6fb);
        }

        .dc-icon-btn {
          color: var(--ui-text, #f2f6fb);
        }
        .dc-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dc-add-field {
          border-color: var(--ui-border, #3a3f47);
          color: var(--theredhead-primary, #a8c8ff);
        }
        .dc-add-field:hover {
          background: var(--theredhead-primary-container, #004787);
        }

        .dc-add-group {
          border-color: var(--ui-border, #3a3f47);
          color: var(--theredhead-primary, #a8c8ff);
        }
        .dc-add-group:hover {
          background: var(--theredhead-primary-container, #004787);
        }
      }
    }
  `,
})
export class UIDesignerCanvas {
  /** The designer engine driving this canvas. */
  public readonly engine = input.required<FormDesignerEngine>();

  /** Emitted when "Add field" is clicked on a group (passes group uid). */
  public readonly addFieldRequest = output<string>();

  /** @internal Icon references exposed to the template. */
  protected readonly icons = {
    ChevronUp: UIIcons.Lucide.Arrows.ChevronUp,
    ChevronDown: UIIcons.Lucide.Arrows.ChevronDown,
    Copy: UIIcons.Lucide.Text.Copy,
    X: UIIcons.Lucide.Notifications.X,
  } as const;

  /** @internal */
  protected moveGroupUp(event: Event, uid: string, index: number): void {
    event.stopPropagation();
    this.engine().moveGroup(uid, index - 1);
  }

  /** @internal */
  protected moveGroupDown(event: Event, uid: string, index: number): void {
    event.stopPropagation();
    this.engine().moveGroup(uid, index + 1);
  }

  /** @internal */
  protected removeGroup(event: Event, uid: string): void {
    event.stopPropagation();
    this.engine().removeGroup(uid);
  }

  /** @internal */
  protected moveFieldUp(
    event: Event,
    groupUid: string,
    fieldUid: string,
    index: number,
  ): void {
    event.stopPropagation();
    this.engine().moveField(groupUid, fieldUid, groupUid, index - 1);
  }

  /** @internal */
  protected moveFieldDown(
    event: Event,
    groupUid: string,
    fieldUid: string,
    index: number,
  ): void {
    event.stopPropagation();
    this.engine().moveField(groupUid, fieldUid, groupUid, index + 1);
  }

  /** @internal */
  protected duplicateField(
    event: Event,
    groupUid: string,
    fieldUid: string,
  ): void {
    event.stopPropagation();
    this.engine().duplicateField(groupUid, fieldUid);
  }

  /** @internal */
  protected removeField(
    event: Event,
    groupUid: string,
    fieldUid: string,
  ): void {
    event.stopPropagation();
    this.engine().removeField(groupUid, fieldUid);
  }

  /** @internal */
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "copy";
  }

  /** @internal */
  protected onDropField(event: DragEvent, group: MutableGroupDefinition): void {
    event.preventDefault();
    const component = event.dataTransfer?.getData("text/plain");
    if (component) {
      this.engine().addField(group.uid, component);
    }
  }
}
