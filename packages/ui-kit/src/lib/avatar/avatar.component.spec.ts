import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIAvatar, type AvatarSize } from "./avatar.component";

@Component({
  standalone: true,
  imports: [UIAvatar],
  template: ` <ui-avatar [src]="src()" [name]="name()" [size]="size()" /> `,
})
class TestHost {
  public readonly src = signal<string | undefined>(undefined);
  public readonly name = signal("Jane Doe");
  public readonly size = signal<AvatarSize>("md");
}

describe("UIAvatar", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.nativeElement.querySelector("ui-avatar")).toBeTruthy();
  });

  it("should have ui-avatar host class", () => {
    expect(
      fixture.nativeElement.querySelector("ui-avatar").classList,
    ).toContain("ui-avatar");
  });

  describe("initials", () => {
    it("should show initials when no src is provided", () => {
      const initials = fixture.nativeElement.querySelector(".av-initials");
      expect(initials).toBeTruthy();
      expect(initials.textContent.trim()).toBe("JD");
    });

    it("should derive two-letter initials from multi-word name", () => {
      host.name.set("John Michael Smith");
      fixture.detectChanges();
      const initials = fixture.nativeElement.querySelector(".av-initials");
      expect(initials.textContent.trim()).toBe("JS");
    });

    it("should derive two-letter initials from single-word name", () => {
      host.name.set("Alice");
      fixture.detectChanges();
      const initials = fixture.nativeElement.querySelector(".av-initials");
      expect(initials.textContent.trim()).toBe("AL");
    });
  });

  describe("image", () => {
    it("should show image when src is provided", () => {
      host.src.set("https://example.com/photo.jpg");
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector(".av-image");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("https://example.com/photo.jpg");
    });

    it("should fall back to initials on image error", () => {
      host.src.set("https://example.com/broken.jpg");
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector(".av-image");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".av-initials")).toBeTruthy();
      expect(fixture.nativeElement.querySelector(".av-image")).toBeNull();
    });
  });

  describe("fallback icon", () => {
    it("should show fallback when no src and no name", () => {
      host.src.set(undefined);
      host.name.set("");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".av-fallback")).toBeTruthy();
    });
  });

  describe("sizes", () => {
    const sizes: AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];

    for (const size of sizes) {
      it(`should apply ${size} size class`, () => {
        host.size.set(size);
        fixture.detectChanges();
        expect(
          fixture.nativeElement.querySelector("ui-avatar").classList,
        ).toContain(`ui-avatar--${size}`);
      });
    }
  });
});
