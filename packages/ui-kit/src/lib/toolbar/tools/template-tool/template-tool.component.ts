import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  forwardRef,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A toolbar tool that renders consumer-provided template content.
 *
 * The template receives the `UITemplateTool` instance as `$implicit`
 * context, giving access to all base inputs.
 *
 * @example
 * ```html
 * <ui-toolbar>
 *   <ui-template-tool id="custom">
 *     <ng-template let-tool>
 *       <span>Custom: {{ tool.label() }}</span>
 *     </ng-template>
 *   </ui-template-tool>
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-template-tool",
  standalone: true,
  imports: [NgTemplateOutlet],
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UITemplateTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tpl()) {
      <ng-template
        [ngTemplateOutlet]="tpl()!"
        [ngTemplateOutletContext]="{ $implicit: self }"
      />
    }
  `,
  host: { class: "ui-template-tool" },
})
export class UITemplateTool extends UIToolbarItem {
  /**
   * The consumer-provided template.
   * Receives `UITemplateTool` as `$implicit` context.
   */
  public readonly tpl =
    contentChild<TemplateRef<{ $implicit: UITemplateTool }>>(TemplateRef);

  /**
   * Reference to self, exposed for use in the template context object.
   * @internal
   */
  protected readonly self: UITemplateTool = this;
}
