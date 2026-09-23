import { TestBed } from "@angular/core/testing";

import type { MediaGalleryItem } from "./media-gallery.types";
import { MediaGalleryService } from "./media-gallery.service";

function createItem(
  id: string,
  collection = "project-alpha",
): MediaGalleryItem {
  return {
    id,
    collection,
    kind: "image",
    src: `/${id}.jpg`,
    alt: id,
  };
}

describe("MediaGalleryService", () => {
  let service: MediaGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaGalleryService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("should pool named items and keep collections isolated", () => {
    const first = createItem("first");
    const second = createItem("second");
    const other = createItem("other", "project-beta");

    service.register(first);
    service.register(second);
    service.register(other);

    expect(service.items("project-alpha")).toEqual([first, second]);
    expect(service.items("project-beta")).toEqual([other]);
  });

  it("should pool plain gallery items under the unnamed collection", () => {
    const first = createItem("first", "");
    const second = createItem("second", "");

    service.register(first);
    service.register(second);

    expect(service.items("")).toEqual([first, second]);
  });

  it("should open an item and expose its collection position", () => {
    const first = createItem("first");
    const second = createItem("second");
    service.register(first);
    service.register(second);

    service.open("second");

    expect(service.isOpen()).toBe(true);
    expect(service.activeItem()).toEqual(second);
    expect(service.activeIndex()).toBe(1);
  });

  it("should navigate within a collection without wrapping", () => {
    const first = createItem("first");
    const second = createItem("second");
    service.register(first);
    service.register(second);
    service.open("first");

    service.previous();
    expect(service.activeItem()).toEqual(first);

    service.next();
    expect(service.activeItem()).toEqual(second);
    service.next();
    expect(service.activeItem()).toEqual(second);
  });

  it("should unregister an item and close when the active item is removed", () => {
    const item = createItem("only");
    const unregister = service.register(item);
    service.open(item.id);

    unregister();

    expect(service.items(item.collection)).toEqual([]);
    expect(service.isOpen()).toBe(false);
    expect(service.activeItem()).toBeNull();
  });

  it("should close and clear the active item", () => {
    const item = createItem("only");
    service.register(item);
    service.open(item.id);

    service.close();

    expect(service.isOpen()).toBe(false);
    expect(service.activeItem()).toBeNull();
  });
});
