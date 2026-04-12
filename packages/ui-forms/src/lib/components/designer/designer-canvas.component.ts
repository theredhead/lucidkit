// ── UIDesignerCanvas ────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

import { isFlairComponent } from "../../types/form-schema.types";
import type {
  FormDesignerEngine,
  MutableGroupDefinition,
} from "./designer-engine";
import { UISurface } from '@theredhead/lucid-foundation';

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-designer-canvas" },
  templateUrl: "./designer-canvas.component.html",
  styleUrl: "./designer-canvas.component.scss",
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

  /** @internal Whether a component key is a flair type. */
  protected readonly isFlair = isFlairComponent;

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
