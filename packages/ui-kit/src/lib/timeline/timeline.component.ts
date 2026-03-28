import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  output,
  signal,
  TemplateRef,
} from "@angular/core";
import { NgComponentOutlet, NgTemplateOutlet } from "@angular/common";

import type { IDatasource } from "../table-view/datasources/datasource";
import { DatasourceAdapter } from "../table-view/datasources/datasource-adapter";

import type {
  TimelineAlignment,
  TimelineComponentResolver,
  TimelineEventContext,
  TimelineOrientation,
} from "./timeline.types";
import { UISurface } from '@theredhead/foundation';

/**
 * A visual timeline that renders events from a datasource.
 *
 * Each event is rendered through either:
 * - A **projected template** (`ng-template`) for simple, uniform rendering.
 * - A **component resolver** function (`withComponent`) that returns the
 *   Angular component class to instantiate for each event. The resolved
 *   component receives the event data via an `event` input.
 *
 * When both are provided, `withComponent` takes precedence.
 *
 * @example
 * Template-based rendering:
 * ```html
 * <ui-timeline [datasource]="events">
 *   <ng-template let-event let-i="index">
 *     <h3>{{ event.title }}</h3>
 *     <p>{{ event.description }}</p>
 *   </ng-template>
 * </ui-timeline>
 * ```
 *
 * @example
 * Component-based rendering:
 * ```ts
 * const resolver: TimelineComponentResolver<MyEvent> = (event) =>
 *   event.type === 'milestone' ? MilestoneCard : DefaultCard;
 * ```
 * ```html
 * <ui-timeline [datasource]="events" [withComponent]="resolver" />
 * ```
 *
 * @typeParam T - The event data type.
 */
@Component({
  selector: "ui-timeline",
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-timeline",
    "[class.ui-timeline--vertical]": "orientation() === 'vertical'",
    "[class.ui-timeline--horizontal]": "orientation() === 'horizontal'",
    "[class.ui-timeline--start]": "alignment() === 'start'",
    "[class.ui-timeline--end]": "alignment() === 'end'",
    "[class.ui-timeline--alternate]": "alignment() === 'alternate'",
    "[attr.aria-label]": "ariaLabel()",
    role: "list",
  },
})
export class UITimeline<T = unknown> {
  /** The datasource providing timeline events. */
  public readonly datasource = input.required<IDatasource<T>>();

  /**
   * A function that returns the component class to render for a given event.
   * When provided, takes precedence over the projected template.
   */
  public readonly withComponent = input<
    TimelineComponentResolver<T> | undefined
  >(undefined);

  /** Layout direction. Defaults to `'vertical'`. */
  public readonly orientation = input<TimelineOrientation>("vertical");

  /** Side alignment for events. Defaults to `'alternate'`. */
  public readonly alignment = input<TimelineAlignment>("alternate");

  /** Accessible label for the timeline container. */
  public readonly ariaLabel = input<string>("Timeline");

  /** Emitted when a timeline event is clicked. */
  public readonly eventClick = output<T>();

  /** @internal — the projected event template (optional). */
  public readonly eventTemplate =
    contentChild<TemplateRef<TimelineEventContext<T>>>(TemplateRef);

  /** @internal — adapter wrapping the datasource for signal-based access. */
  protected readonly adapter = signal<DatasourceAdapter<T> | null>(null);

  /** @internal — resolved items ready for rendering. */
  protected readonly items = signal<T[]>([]);

  /** @internal — whether to use component-based rendering. */
  protected readonly useComponentOutlet = computed(
    () => this.withComponent() !== undefined,
  );

  public constructor() {
    // Rebuild adapter when datasource changes
    effect(() => {
      const ds = this.datasource();
      const adapter = new DatasourceAdapter<T>(ds, 100_000);
      this.adapter.set(adapter);
    });

    // Resolve visible window into concrete items
    effect(() => {
      const adapter = this.adapter();
      if (!adapter) {
        this.items.set([]);
        return;
      }

      const window = adapter.visibleWindow();
      const resolved: T[] = [];
      const promises: Promise<void>[] = [];

      for (let i = 0; i < window.length; i++) {
        const rowResult = window[i];
        if (rowResult instanceof Promise) {
          promises.push(
            rowResult.then((value) => {
              resolved[i] = value;
            }),
          );
        } else {
          resolved[i] = rowResult;
        }
      }

      if (promises.length === 0) {
        this.items.set(resolved);
      } else {
        Promise.all(promises).then(() => {
          this.items.set([...resolved]);
        });
      }
    });
  }

  /** Build template context for an event at a given index. */
  protected buildContext(event: T, index: number): TimelineEventContext<T> {
    const items = this.items();
    return {
      $implicit: event,
      index,
      first: index === 0,
      last: index === items.length - 1,
    };
  }

  /** Resolve the component class for a given event. */
  protected resolveComponent(event: T): import("@angular/core").Type<unknown> {
    const resolver = this.withComponent();
    if (!resolver) {
      throw new Error(
        "UITimeline: withComponent resolver is not set but component rendering was requested.",
      );
    }
    return resolver(event);
  }

  /** Build the injector inputs for a dynamically rendered component. */
  protected buildComponentInputs(
    event: T,
    index: number,
  ): Record<string, unknown> {
    return {
      event,
      index,
      first: index === 0,
      last: index === this.items().length - 1,
    };
  }

  /** @internal — handle click on a timeline event. */
  protected handleEventClick(event: T): void {
    this.eventClick.emit(event);
  }
}
