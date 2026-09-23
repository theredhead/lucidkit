import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIImage } from "../image/image.component";
import { UIMediaPlayer } from "../media-player/media-player.component";
import { MediaGalleryService } from "./media-gallery.service";
import { UIMediaGalleryItem } from "./media-gallery.directive";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class IntersectionObserverMock {
      public observe(): void {}
      public disconnect(): void {}
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

@Component({
  standalone: true,
  imports: [UIImage, UIMediaPlayer, UIMediaGalleryItem],
  template: `
    <ui-image gallery src="/unnamed.jpg" alt="Unnamed image" />
    <ui-image gallery="named" src="/named.jpg" alt="Named image" />
    <ui-media-player
      gallery
      type="video"
      [source]="{ url: '/clip.mp4', type: 'video/mp4' }"
      poster="/clip.jpg"
      ariaLabel="Unnamed video"
    />
  `,
})
class GalleryHost {}

describe("UIMediaGalleryItem", () => {
  let fixture: ComponentFixture<GalleryHost>;
  let service: MediaGalleryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryHost],
    }).compileComponents();
    fixture = TestBed.createComponent(GalleryHost);
    service = TestBed.inject(MediaGalleryService);
    fixture.detectChanges();
  });

  it("should register UIImage and UIMediaPlayer hosts", () => {
    expect(service.items("")).toHaveLength(2);
    expect(service.items("named")).toHaveLength(1);
    expect(service.items("")[0]).toMatchObject({
      kind: "image",
      src: "/unnamed.jpg",
      alt: "Unnamed image",
    });
    expect(service.items("")[1]).toMatchObject({
      kind: "video",
      src: "/clip.mp4",
      poster: "/clip.jpg",
      alt: "Unnamed video",
    });
  });

  it("should open the host item when clicked", () => {
    const image = fixture.nativeElement.querySelector("ui-image");
    image.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();

    expect(service.isOpen()).toBe(true);
    expect(service.activeItem()).toMatchObject({
      src: "/unnamed.jpg",
    });
  });
});
