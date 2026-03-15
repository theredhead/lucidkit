import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIAvatar, type AvatarSize } from "./avatar.component";

/** Flush pending microtasks / promises (e.g. crypto.subtle). */
async function flushAsync(): Promise<void> {
  // Double-yield: first settles the crypto.subtle Promise chain,
  // second ensures Angular signal notifications propagate.
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
}

@Component({
  standalone: true,
  imports: [UIAvatar],
  template: `
    <ui-avatar
      [src]="src()"
      [email]="email()"
      [name]="name()"
      [size]="size()"
    />
  `,
})
class TestHost {
  public readonly src = signal<string | undefined>(undefined);
  public readonly email = signal<string | undefined>(undefined);
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

  describe("gravatar", () => {
    it("should show gravatar image when email is provided", async () => {
      host.name.set("");
      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector(".av-image");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toContain("gravatar.com/avatar/");
      expect(img.getAttribute("src")).toContain("d=404");
    });

    it("should prefer explicit src over gravatar", async () => {
      host.src.set("https://example.com/photo.jpg");
      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector(".av-image");
      expect(img.getAttribute("src")).toBe("https://example.com/photo.jpg");
    });

    it("should include retina size parameter in gravatar URL", async () => {
      host.email.set("test@example.com");
      host.size.set("lg");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector(".av-image");
      // lg = 56px × 2 = 112
      expect(img.getAttribute("src")).toContain("s=112");
    });

    it("should normalise email before hashing", async () => {
      host.email.set("  Test@Example.COM  ");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();
      const src1 = fixture.nativeElement
        .querySelector(".av-image")
        ?.getAttribute("src");

      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();
      const src2 = fixture.nativeElement
        .querySelector(".av-image")
        ?.getAttribute("src");

      expect(src1).toBe(src2);
    });

    it("should not show gravatar when email is empty", () => {
      host.email.set("");
      host.name.set("");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".av-image")).toBeNull();
    });

    it("should fall back to initials when gravatar image fails", async () => {
      host.name.set("Jane Doe");
      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector(".av-image");
      expect(img).toBeTruthy();
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".av-image")).toBeNull();
      expect(fixture.nativeElement.querySelector(".av-initials")).toBeTruthy();
    });

    it("should reset error state when email changes", async () => {
      host.email.set("first@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      // Trigger error
      const img = fixture.nativeElement.querySelector(".av-image");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".av-image")).toBeNull();

      // Change email — should reset and try again
      host.email.set("second@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".av-image")).toBeTruthy();
    });
  });
});
