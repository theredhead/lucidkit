/**
 * Lightweight pointer-event drag handler for {@link UIRepeater}.
 *
 * Moves the actual DOM element via CSS transforms instead of cloning
 * to `<body>`, so scoped and dark-mode styles are never lost.
 *
 * @internal — not part of the public API.
 */

interface DragState {
  readonly pointerId: number;
  readonly element: HTMLElement;
  readonly fromIndex: number;
  readonly startX: number;
  readonly startY: number;
  readonly items: HTMLElement[];
  readonly rects: DOMRect[];
  readonly slotHeight: number;
  currentIndex: number;
  activeTarget: RepeaterDragHandler;
}

export class RepeaterDragHandler {
  private static readonly ITEM = ".ui-repeater-item";

  /** Whether this handler accepts drag interactions. */
  public enabled = false;

  /** Connected handlers that items can be transferred to/from. */
  private connected: readonly RepeaterDragHandler[] = [];

  /** Active drag state, or `null` when idle. */
  private drag: DragState | null = null;

  public constructor(
    /** The host element of the repeater (container). */
    public readonly container: HTMLElement,
    private readonly onReorder: (
      previousIndex: number,
      currentIndex: number,
    ) => void,
    private readonly onTransfer: (
      targetHandler: RepeaterDragHandler,
      previousIndex: number,
      currentIndex: number,
    ) => void,
  ) {
    this.container.addEventListener("pointerdown", this.handleDown);
  }

  /** Update the set of connected handlers for cross-container transfer. */
  public setConnected(handlers: readonly RepeaterDragHandler[]): void {
    this.connected = handlers;
  }

  /** Tear down all listeners and cancel any in-progress drag. */
  public destroy(): void {
    this.cancel();
    this.container.removeEventListener("pointerdown", this.handleDown);
  }

  // ── Pointer handlers ──────────────────────────────────────────

  private handleDown = (e: PointerEvent): void => {
    if (!this.enabled || e.button !== 0 || this.drag) return;

    const item = (e.target as HTMLElement).closest(
      RepeaterDragHandler.ITEM,
    ) as HTMLElement | null;
    if (!item || !this.container.contains(item)) return;

    const items = Array.from(
      this.container.querySelectorAll(RepeaterDragHandler.ITEM),
    ) as HTMLElement[];
    const index = items.indexOf(item);
    if (index < 0) return;

    e.preventDefault();
    item.setPointerCapture(e.pointerId);

    const rects = items.map((el) => el.getBoundingClientRect());

    this.drag = {
      pointerId: e.pointerId,
      element: item,
      fromIndex: index,
      currentIndex: index,
      startX: e.clientX,
      startY: e.clientY,
      items,
      rects,
      slotHeight: this.computeSlotHeight(rects, index),
      activeTarget: this,
    };

    item.classList.add("ui-repeater-item--dragging");
    this.container.classList.add("ui-repeater--dragging");

    item.addEventListener("pointermove", this.handleMove);
    item.addEventListener("pointerup", this.handleUp);
    item.addEventListener("pointercancel", this.handleUp);
  };

  private handleMove = (e: PointerEvent): void => {
    const d = this.drag;
    if (!d) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    d.element.style.transform = `translate(${dx}px, ${dy}px)`;

    // Determine which container the pointer is currently over
    const target = this.findTargetHandler(e.clientX, e.clientY);

    // Switched containers?
    if (target !== d.activeTarget) {
      this.clearShifts(d.activeTarget);
      this.clearGrowth(d.activeTarget);
      d.activeTarget.container.classList.remove("ui-repeater--drop-target");
      d.activeTarget = target;
      if (target !== this) {
        target.container.classList.add("ui-repeater--drop-target");
      }
    }

    if (target === this) {
      this.updateReorder(e.clientY, d);
    } else {
      this.updateTransfer(e.clientY, d, target);
    }
  };

  private handleUp = (e: PointerEvent): void => {
    const d = this.drag;
    if (!d) return;

    d.element.releasePointerCapture(e.pointerId);
    d.element.removeEventListener("pointermove", this.handleMove);
    d.element.removeEventListener("pointerup", this.handleUp);
    d.element.removeEventListener("pointercancel", this.handleUp);

    // Clean up all visual state
    d.element.classList.remove("ui-repeater-item--dragging");
    d.element.style.transform = "";
    this.container.classList.remove("ui-repeater--dragging");
    this.clearShifts(this);

    if (d.activeTarget !== this) {
      this.clearShifts(d.activeTarget);
      this.clearGrowth(d.activeTarget);
      d.activeTarget.container.classList.remove("ui-repeater--drop-target");
    }

    const from = d.fromIndex;
    const to = d.currentIndex;
    const target = d.activeTarget;
    this.drag = null;

    if (target === this) {
      if (from !== to) {
        this.onReorder(from, to);
      }
    } else {
      this.onTransfer(target, from, to);
    }
  };

  // ── Reorder / transfer logic ──────────────────────────────────

  private updateReorder(clientY: number, d: DragState): void {
    const dragRect = d.rects[d.fromIndex];
    const dragCenter =
      dragRect.top + dragRect.height / 2 + (clientY - d.startY);

    let newIndex = d.fromIndex;
    for (let i = 0; i < d.rects.length; i++) {
      if (i === d.fromIndex) continue;
      const center = d.rects[i].top + d.rects[i].height / 2;
      if (d.fromIndex < i && dragCenter > center) {
        newIndex = i;
      } else if (d.fromIndex > i && dragCenter < center) {
        newIndex = Math.min(newIndex, i);
      }
    }
    d.currentIndex = newIndex;

    for (let i = 0; i < d.items.length; i++) {
      if (i === d.fromIndex) continue;
      const el = d.items[i];
      if (d.fromIndex < newIndex && i > d.fromIndex && i <= newIndex) {
        el.style.transform = `translateY(-${d.slotHeight}px)`;
      } else if (d.fromIndex > newIndex && i >= newIndex && i < d.fromIndex) {
        el.style.transform = `translateY(${d.slotHeight}px)`;
      } else {
        el.style.transform = "";
      }
    }
  }

  private updateTransfer(
    clientY: number,
    d: DragState,
    target: RepeaterDragHandler,
  ): void {
    // Clear source shifts
    for (let i = 0; i < d.items.length; i++) {
      if (i === d.fromIndex) continue;
      d.items[i].style.transform = "";
    }

    // Calculate drop index in target container
    const targetItems = Array.from(
      target.container.querySelectorAll(RepeaterDragHandler.ITEM),
    ) as HTMLElement[];
    const targetRects = targetItems.map((el) => el.getBoundingClientRect());

    let dropIndex = targetRects.length;
    for (let i = 0; i < targetRects.length; i++) {
      const center = targetRects[i].top + targetRects[i].height / 2;
      if (clientY < center) {
        dropIndex = i;
        break;
      }
    }
    d.currentIndex = dropIndex;

    // Shift target items to make room
    for (let i = 0; i < targetItems.length; i++) {
      targetItems[i].style.transform =
        i >= dropIndex ? `translateY(${d.slotHeight}px)` : "";
    }

    // Grow the target container so shifted items don't overflow.
    // Preserve existing padding-bottom and add the slot height on top.
    const existing =
      parseFloat(getComputedStyle(target.container).paddingBottom) || 0;
    if (!target.container.dataset["origPb"]) {
      target.container.dataset["origPb"] = String(existing);
    }
    const origPb = parseFloat(target.container.dataset["origPb"]!) || 0;
    target.container.style.paddingBottom = `${origPb + d.slotHeight}px`;
  }

  // ── Utilities ─────────────────────────────────────────────────

  /** Find which handler (this or a connected one) the pointer is over. */
  private findTargetHandler(
    clientX: number,
    clientY: number,
  ): RepeaterDragHandler {
    for (const h of this.connected) {
      if (!h.enabled) continue;
      const r = h.container.getBoundingClientRect();
      if (
        clientX >= r.left &&
        clientX <= r.right &&
        clientY >= r.top &&
        clientY <= r.bottom
      ) {
        return h;
      }
    }
    return this; // eslint doesn't allow aliasing `this`, so return directly
  }

  private computeSlotHeight(rects: DOMRect[], index: number): number {
    if (rects.length > 1 && index < rects.length - 1) {
      return rects[index + 1].top - rects[index].top;
    }
    if (rects.length > 1 && index > 0) {
      return rects[index].top - rects[index - 1].top;
    }
    return rects[index]?.height ?? 0;
  }

  private clearShifts(handler: RepeaterDragHandler): void {
    const items = handler.container.querySelectorAll(
      RepeaterDragHandler.ITEM,
    ) as NodeListOf<HTMLElement>;
    for (const item of Array.from(items)) {
      item.style.transform = "";
    }
  }

  /** Remove temporary padding added to grow the container during transfer. */
  private clearGrowth(handler: RepeaterDragHandler): void {
    handler.container.style.paddingBottom = "";
    delete handler.container.dataset["origPb"];
  }

  private cancel(): void {
    const d = this.drag;
    if (!d) return;

    d.element.releasePointerCapture(d.pointerId);
    d.element.removeEventListener("pointermove", this.handleMove);
    d.element.removeEventListener("pointerup", this.handleUp);
    d.element.removeEventListener("pointercancel", this.handleUp);
    d.element.classList.remove("ui-repeater-item--dragging");
    d.element.style.transform = "";
    this.container.classList.remove("ui-repeater--dragging");
    this.clearShifts(this);

    if (d.activeTarget !== this) {
      this.clearShifts(d.activeTarget);
      this.clearGrowth(d.activeTarget);
      d.activeTarget.container.classList.remove("ui-repeater--drop-target");
    }

    this.drag = null;
  }
}
