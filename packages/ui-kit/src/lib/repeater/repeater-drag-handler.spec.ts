import { RepeaterDragHandler } from "./repeater-drag-handler";

function createContainer(itemCount: number): HTMLElement {
  const container = document.createElement("div");
  for (let i = 0; i < itemCount; i++) {
    const item = document.createElement("div");
    item.className = "ui-repeater-item";
    item.textContent = `Item ${i}`;
    container.appendChild(item);
  }
  document.body.appendChild(container);
  return container;
}

function pointerEvent(
  type: string,
  target: HTMLElement,
  overrides: Partial<PointerEvent> = {},
): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    pointerId: 1,
    button: 0,
    clientX: 0,
    clientY: 0,
    ...overrides,
  });
}

describe("RepeaterDragHandler", () => {
  let container: HTMLElement;
  let onReorder: (previousIndex: number, currentIndex: number) => void;
  let onTransfer: (
    targetHandler: RepeaterDragHandler,
    previousIndex: number,
    currentIndex: number,
  ) => void;
  let handler: RepeaterDragHandler;

  beforeEach(() => {
    container = createContainer(3);
    onReorder = vi.fn();
    onTransfer = vi.fn();
    handler = new RepeaterDragHandler(container, onReorder, onTransfer);
  });

  afterEach(() => {
    handler.destroy();
    container.remove();
  });

  describe("construction", () => {
    it("should create", () => {
      expect(handler).toBeTruthy();
    });

    it("should expose the container element", () => {
      expect(handler.container).toBe(container);
    });

    it("should default enabled to false", () => {
      expect(handler.enabled).toBe(false);
    });
  });

  describe("enabled", () => {
    it("should not start drag when disabled", () => {
      handler.enabled = false;
      const item = container.querySelector(".ui-repeater-item")!;
      item.dispatchEvent(pointerEvent("pointerdown", item as HTMLElement));
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
    });

    it("should start drag when enabled", () => {
      handler.enabled = true;
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;

      // Mock setPointerCapture since JSDOM doesn't support it
      item.setPointerCapture = vi.fn();
      item.releasePointerCapture = vi.fn();

      item.dispatchEvent(pointerEvent("pointerdown", item));
      expect(container.classList.contains("ui-repeater--dragging")).toBe(true);
    });
  });

  describe("pointerdown guards", () => {
    it("should ignore non-primary button", () => {
      handler.enabled = true;
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;
      item.setPointerCapture = vi.fn();
      item.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          pointerId: 1,
          button: 2,
        }),
      );
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
    });

    it("should ignore clicks outside items", () => {
      handler.enabled = true;
      container.dispatchEvent(pointerEvent("pointerdown", container));
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
    });
  });

  describe("drag reorder", () => {
    it("should call onReorder when item is dropped at different index", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;

      // We need to mock getBoundingClientRect for rects calculation
      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      const firstItem = items[0];

      // Start drag
      firstItem.dispatchEvent(
        pointerEvent("pointerdown", firstItem, { clientY: 25 }),
      );

      // Move past second item's center (75)
      firstItem.dispatchEvent(
        pointerEvent("pointermove", firstItem, { clientY: 125 }),
      );

      // Drop
      firstItem.dispatchEvent(
        pointerEvent("pointerup", firstItem, { clientY: 125 }),
      );

      expect(onReorder).toHaveBeenCalled();
    });

    it("should not call onReorder when dropped at same position", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;

      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      const firstItem = items[0];
      firstItem.dispatchEvent(
        pointerEvent("pointerdown", firstItem, { clientY: 25 }),
      );
      firstItem.dispatchEvent(
        pointerEvent("pointerup", firstItem, { clientY: 25 }),
      );

      expect(onReorder).not.toHaveBeenCalled();
    });

    it("should shift items downward when dragging from top to bottom", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;

      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      items[0].dispatchEvent(
        pointerEvent("pointerdown", items[0], { clientY: 25 }),
      );
      items[0].dispatchEvent(
        pointerEvent("pointermove", items[0], { clientY: 125 }),
      );

      // Items between fromIndex and newIndex should be shifted
      expect(items[1].style.transform).toContain("translateY");
    });

    it("should shift items upward when dragging from bottom to top", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;

      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      // Start drag from last item
      items[2].dispatchEvent(
        pointerEvent("pointerdown", items[2], { clientY: 125 }),
      );
      // Move up past first item center (25)
      items[2].dispatchEvent(
        pointerEvent("pointermove", items[2], { clientY: 10 }),
      );

      // Items at index 0 and 1 should be shifted
      expect(items[0].style.transform).toContain("translateY");

      // Drop
      items[2].dispatchEvent(
        pointerEvent("pointerup", items[2], { clientY: 10 }),
      );
      expect(onReorder).toHaveBeenCalled();
    });

    it("should clear transforms on drop", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;

      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      items[0].dispatchEvent(
        pointerEvent("pointerdown", items[0], { clientY: 25 }),
      );
      items[0].dispatchEvent(
        pointerEvent("pointermove", items[0], { clientY: 125 }),
      );
      items[0].dispatchEvent(
        pointerEvent("pointerup", items[0], { clientY: 125 }),
      );

      // After drop, all transforms should be cleared
      items.forEach((el) => {
        expect(el.style.transform).toBe("");
      });
    });
  });

  describe("visual feedback", () => {
    it("should add dragging class to item and container", () => {
      handler.enabled = true;
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;
      item.setPointerCapture = vi.fn();
      item.releasePointerCapture = vi.fn();
      item.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 50,
          left: 0,
          right: 200,
          width: 200,
          height: 50,
          x: 0,
          y: 0,
        }) as DOMRect;

      item.dispatchEvent(pointerEvent("pointerdown", item));
      expect(item.classList.contains("ui-repeater-item--dragging")).toBe(true);
      expect(container.classList.contains("ui-repeater--dragging")).toBe(true);
    });

    it("should apply transform on pointermove", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;
      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      const item = items[0];
      item.dispatchEvent(
        pointerEvent("pointerdown", item, { clientX: 10, clientY: 10 }),
      );
      item.dispatchEvent(
        pointerEvent("pointermove", item, { clientX: 20, clientY: 30 }),
      );
      expect(item.style.transform).toBe("translate(10px, 20px)");
    });

    it("should clean up classes on pointerup", () => {
      handler.enabled = true;
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;
      item.setPointerCapture = vi.fn();
      item.releasePointerCapture = vi.fn();
      item.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 50,
          left: 0,
          right: 200,
          width: 200,
          height: 50,
          x: 0,
          y: 0,
        }) as DOMRect;

      item.dispatchEvent(pointerEvent("pointerdown", item));
      item.dispatchEvent(pointerEvent("pointerup", item));
      expect(item.classList.contains("ui-repeater-item--dragging")).toBe(false);
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
      expect(item.style.transform).toBe("");
    });
  });

  describe("setConnected", () => {
    it("should accept an array of handlers", () => {
      const container2 = createContainer(2);
      const handler2 = new RepeaterDragHandler(container2, vi.fn(), vi.fn());
      handler.setConnected([handler2]);
      handler2.destroy();
      container2.remove();
    });
  });

  describe("destroy", () => {
    it("should clean up without error", () => {
      expect(() => handler.destroy()).not.toThrow();
    });

    it("should not respond to pointerdown after destroy", () => {
      handler.enabled = true;
      handler.destroy();
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;
      item.setPointerCapture = vi.fn();
      item.dispatchEvent(pointerEvent("pointerdown", item));
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
    });

    it("should cancel in-progress drag on destroy", () => {
      handler.enabled = true;
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;
      item.setPointerCapture = vi.fn();
      item.releasePointerCapture = vi.fn();
      item.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 50,
          left: 0,
          right: 200,
          width: 200,
          height: 50,
          x: 0,
          y: 0,
        }) as DOMRect;

      item.dispatchEvent(pointerEvent("pointerdown", item));
      expect(container.classList.contains("ui-repeater--dragging")).toBe(true);

      handler.destroy();
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
      expect(item.style.transform).toBe("");
    });
  });

  describe("pointercancel", () => {
    it("should clean up on pointer cancel", () => {
      handler.enabled = true;
      const item = container.querySelector(".ui-repeater-item") as HTMLElement;
      item.setPointerCapture = vi.fn();
      item.releasePointerCapture = vi.fn();
      item.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 50,
          left: 0,
          right: 200,
          width: 200,
          height: 50,
          x: 0,
          y: 0,
        }) as DOMRect;

      item.dispatchEvent(pointerEvent("pointerdown", item));
      item.dispatchEvent(
        new PointerEvent("pointercancel", { bubbles: true, pointerId: 1 }),
      );
      expect(item.classList.contains("ui-repeater-item--dragging")).toBe(false);
      expect(container.classList.contains("ui-repeater--dragging")).toBe(false);
    });
  });

  describe("cross-container transfer", () => {
    let container2: HTMLElement;
    let handler2: RepeaterDragHandler;
    let onTransfer2: (
      targetHandler: RepeaterDragHandler,
      previousIndex: number,
      currentIndex: number,
    ) => void;

    function mockItems(cont: HTMLElement, yOffset = 0): void {
      const items = cont.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;
      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: yOffset + i * 50,
            bottom: yOffset + (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: yOffset + i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });
    }

    beforeEach(() => {
      container2 = createContainer(2);
      onTransfer2 = vi.fn();
      handler2 = new RepeaterDragHandler(
        container2,
        vi.fn<(previousIndex: number, currentIndex: number) => void>(),
        onTransfer2,
      );
      handler2.enabled = true;
      handler.enabled = true;

      // Position containers: container1 at y=0..150, container2 at y=200..300
      container.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 150,
          left: 0,
          right: 200,
          width: 200,
          height: 150,
        }) as DOMRect;
      container2.getBoundingClientRect = () =>
        ({
          top: 200,
          bottom: 300,
          left: 0,
          right: 200,
          width: 200,
          height: 100,
        }) as DOMRect;

      handler.setConnected([handler2]);
      handler2.setConnected([handler]);

      mockItems(container, 0);
      mockItems(container2, 200);
    });

    afterEach(() => {
      handler2.destroy();
      container2.remove();
    });

    it("should call onTransfer when dropping onto a connected container", () => {
      const sourceItems = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;
      const first = sourceItems[0];

      // Start drag in container 1
      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );

      // Move pointer into container 2 — y=225 is inside container2
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );

      // Drop in container 2
      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );

      expect(onTransfer).toHaveBeenCalledWith(handler2, 0, expect.any(Number));
    });

    it("should add drop-target class on target container during transfer", () => {
      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );

      expect(container2.classList.contains("ui-repeater--drop-target")).toBe(
        true,
      );

      // Drop to clean up
      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );
    });

    it("should remove drop-target class after drop", () => {
      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );
      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );

      expect(container2.classList.contains("ui-repeater--drop-target")).toBe(
        false,
      );
    });

    it("should shift target items to make room during transfer", () => {
      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );

      // Move into container2 above first item center (225)
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 210 }),
      );

      const targetItems = container2.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;
      // Items at/after dropIndex should be shifted
      expect(targetItems[0].style.transform).toContain("translateY");

      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 210 }),
      );
    });

    it("should grow target container paddingBottom during transfer", () => {
      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );

      expect(container2.style.paddingBottom).not.toBe("");

      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );
    });

    it("should clear growth padding after drop", () => {
      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );
      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );

      expect(container2.style.paddingBottom).toBe("");
    });

    it("should clear source shifts when moving to connected container", () => {
      const sourceItems = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;
      const first = sourceItems[0];

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      // First move within same container to create shifts
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 80 }),
      );
      // Now move to container2
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );

      // Source items should have transforms cleared
      expect(sourceItems[1].style.transform).toBe("");
      expect(sourceItems[2].style.transform).toBe("");

      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );
    });

    it("should cancel cross-container drag on destroy", () => {
      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );

      handler.destroy();

      expect(container2.classList.contains("ui-repeater--drop-target")).toBe(
        false,
      );
      expect(container2.style.paddingBottom).toBe("");
    });

    it("should skip disabled connected handlers in findTargetHandler", () => {
      handler2.enabled = false;

      const first = container.querySelectorAll(
        ".ui-repeater-item",
      )[0] as HTMLElement;

      first.dispatchEvent(
        pointerEvent("pointerdown", first, { clientX: 100, clientY: 25 }),
      );
      first.dispatchEvent(
        pointerEvent("pointermove", first, { clientX: 100, clientY: 225 }),
      );
      // Should NOT switch to container2 since handler2 is disabled
      first.dispatchEvent(
        pointerEvent("pointerup", first, { clientX: 100, clientY: 225 }),
      );

      // onTransfer should NOT be called — it stays as a local reorder
      expect(onTransfer).not.toHaveBeenCalled();
    });
  });

  describe("computeSlotHeight edge cases", () => {
    it("should use single item height when only one item exists", () => {
      const singleContainer = createContainer(1);
      const singleHandler = new RepeaterDragHandler(
        singleContainer,
        vi.fn(),
        vi.fn(),
      );
      singleHandler.enabled = true;

      const item = singleContainer.querySelector(
        ".ui-repeater-item",
      ) as HTMLElement;
      item.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 60,
          left: 0,
          right: 200,
          width: 200,
          height: 60,
          x: 0,
          y: 0,
        }) as DOMRect;
      item.setPointerCapture = vi.fn();
      item.releasePointerCapture = vi.fn();

      // Start drag — this exercises computeSlotHeight with single item
      item.dispatchEvent(pointerEvent("pointerdown", item, { clientY: 30 }));
      expect(singleContainer.classList.contains("ui-repeater--dragging")).toBe(
        true,
      );

      item.dispatchEvent(pointerEvent("pointerup", item, { clientY: 30 }));
      singleHandler.destroy();
      singleContainer.remove();
    });

    it("should use previous item gap for last item", () => {
      handler.enabled = true;
      const items = container.querySelectorAll(
        ".ui-repeater-item",
      ) as NodeListOf<HTMLElement>;

      items.forEach((el, i) => {
        el.getBoundingClientRect = () =>
          ({
            top: i * 50,
            bottom: (i + 1) * 50,
            left: 0,
            right: 200,
            width: 200,
            height: 50,
            x: 0,
            y: i * 50,
          }) as DOMRect;
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();
      });

      // Drag the last item — exercises index === rects.length - 1 branch
      items[2].dispatchEvent(
        pointerEvent("pointerdown", items[2], { clientY: 125 }),
      );
      expect(container.classList.contains("ui-repeater--dragging")).toBe(true);

      items[2].dispatchEvent(
        pointerEvent("pointerup", items[2], { clientY: 125 }),
      );
    });
  });
});
