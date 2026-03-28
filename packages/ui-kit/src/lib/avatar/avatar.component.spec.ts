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
      [ariaLabel]="ariaLabel()"
    />
  `,
})
class TestHost {
  public readonly src = signal<string | undefined>(undefined);
  public readonly email = signal<string | undefined>(undefined);
  public readonly name = signal("Jane Doe");
  public readonly size = signal<AvatarSize>("medium");
  public readonly ariaLabel = signal<string | undefined>(undefined);
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
      const initials = fixture.nativeElement.querySelector(".initials");
      expect(initials).toBeTruthy();
      expect(initials.textContent.trim()).toBe("JD");
    });

    it("should derive two-letter initials from multi-word name", () => {
      host.name.set("John Michael Smith");
      fixture.detectChanges();
      const initials = fixture.nativeElement.querySelector(".initials");
      expect(initials.textContent.trim()).toBe("JS");
    });

    it("should derive two-letter initials from single-word name", () => {
      host.name.set("Alice");
      fixture.detectChanges();
      const initials = fixture.nativeElement.querySelector(".initials");
      expect(initials.textContent.trim()).toBe("AL");
    });
  });

  describe("image", () => {
    it("should show image when src is provided", () => {
      host.src.set("https://example.com/photo.jpg");
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector(".image");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("https://example.com/photo.jpg");
    });

    it("should fall back to initials on image error", () => {
      host.src.set("https://example.com/broken.jpg");
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector(".image");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".initials")).toBeTruthy();
      expect(fixture.nativeElement.querySelector(".image")).toBeNull();
    });
  });

  describe("fallback icon", () => {
    it("should show fallback when no src and no name", () => {
      host.src.set(undefined);
      host.name.set("");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".fallback")).toBeTruthy();
    });
  });

  describe("sizes", () => {
    const sizes: AvatarSize[] = [
      "extra-small",
      "small",
      "medium",
      "large",
      "extra-large",
    ];

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

      const img = fixture.nativeElement.querySelector("img");
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

      const img = fixture.nativeElement.querySelector(".image");
      expect(img.getAttribute("src")).toBe("https://example.com/photo.jpg");
    });

    it("should include retina size parameter in gravatar URL", async () => {
      host.email.set("test@example.com");
      host.size.set("large");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector(".image");
      // large = 56px × 2 = 112
      expect(img.getAttribute("src")).toContain("s=112");
    });

    it("should normalise email before hashing", async () => {
      host.email.set("  Test@Example.COM  ");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();
      const src1 = fixture.nativeElement
        .querySelector(".image")
        ?.getAttribute("src");

      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();
      const src2 = fixture.nativeElement
        .querySelector(".image")
        ?.getAttribute("src");

      expect(src1).toBe(src2);
    });

    it("should not show gravatar when email is empty", () => {
      host.email.set("");
      host.name.set("");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".image")).toBeNull();
    });

    it("should fall back to initials when gravatar image fails", async () => {
      host.name.set("Jane Doe");
      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector(".image");
      expect(img).toBeTruthy();
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".image")).toBeNull();
      expect(fixture.nativeElement.querySelector(".initials")).toBeTruthy();
    });

    it("should reset error state when email changes", async () => {
      host.email.set("first@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      // Trigger error
      const img = fixture.nativeElement.querySelector(".image");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".image")).toBeNull();

      // Change email — should reset and try again
      host.email.set("second@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".image")).toBeTruthy();
    });

    it("should clear gravatar when email is removed", async () => {
      host.email.set("test@example.com");
      host.name.set("Jane Doe");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector("img")).toBeTruthy();

      host.email.set(undefined);
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector("img")).toBeNull();
      expect(
        fixture.nativeElement.querySelector(".initials")?.textContent.trim(),
      ).toBe("JD");
    });
  });

  describe("accessibility", () => {
    it("should use name as alt text on image by default", () => {
      host.src.set("https://example.com/photo.jpg");
      host.name.set("Jane Doe");
      fixture.detectChanges();

      const img: HTMLImageElement =
        fixture.nativeElement.querySelector(".image");
      expect(img.alt).toBe("Jane Doe");
    });

    it("should use custom ariaLabel as alt text when provided", () => {
      host.src.set("https://example.com/photo.jpg");
      host.name.set("Jane Doe");
      host.ariaLabel.set("Profile photo of Jane");
      fixture.detectChanges();

      const img: HTMLImageElement =
        fixture.nativeElement.querySelector(".image");
      expect(img.alt).toBe("Profile photo of Jane");
    });

    it("should set aria-label on initials span", () => {
      host.name.set("Jane Doe");
      fixture.detectChanges();

      const initials = fixture.nativeElement.querySelector(".initials");
      expect(initials.getAttribute("aria-label")).toBe("Jane Doe");
    });

    it("should use custom ariaLabel on initials when provided", () => {
      host.name.set("Jane Doe");
      host.ariaLabel.set("User avatar");
      fixture.detectChanges();

      const initials = fixture.nativeElement.querySelector(".initials");
      expect(initials.getAttribute("aria-label")).toBe("User avatar");
    });

    it("should set aria-label on fallback icon", () => {
      host.name.set("");
      host.src.set(undefined);
      fixture.detectChanges();

      const fallback = fixture.nativeElement.querySelector(".fallback");
      expect(fallback.getAttribute("aria-label")).toBe("Avatar");
    });

    it("should use custom ariaLabel on fallback icon when provided", () => {
      host.name.set("");
      host.src.set(undefined);
      host.ariaLabel.set("Unknown user");
      fixture.detectChanges();

      const fallback = fixture.nativeElement.querySelector(".fallback");
      expect(fallback.getAttribute("aria-label")).toBe("Unknown user");
    });
  });

  describe("resolution order", () => {
    it("should transition from image to initials when src is removed", () => {
      host.src.set("https://example.com/photo.jpg");
      host.name.set("Jane Doe");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector("img")).toBeTruthy();

      host.src.set(undefined);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector("img")).toBeNull();
      expect(
        fixture.nativeElement.querySelector(".initials")?.textContent.trim(),
      ).toBe("JD");
    });

    it("should transition from initials to image when src is added", () => {
      host.name.set("Jane Doe");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".initials")).toBeTruthy();

      host.src.set("https://example.com/photo.jpg");
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".initials")).toBeNull();
      const img = fixture.nativeElement.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("https://example.com/photo.jpg");
    });

    it("should transition from initials to fallback when name is cleared", () => {
      host.name.set("Jane Doe");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".initials")).toBeTruthy();

      host.name.set("");
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".initials")).toBeNull();
      expect(fixture.nativeElement.querySelector(".fallback")).toBeTruthy();
    });

    it("should transition from fallback to initials when name is set", () => {
      host.name.set("");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".fallback")).toBeTruthy();

      host.name.set("New User");
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".fallback")).toBeNull();
      expect(
        fixture.nativeElement.querySelector(".initials")?.textContent.trim(),
      ).toBe("NU");
    });

    it("should show explicit src even when gravatar also resolves", async () => {
      host.email.set("test@example.com");
      host.src.set("https://example.com/override.jpg");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector("img");
      expect(img.getAttribute("src")).toBe("https://example.com/override.jpg");
    });
  });

  describe("error recovery", () => {
    it("should reset error state when src changes to a new URL", () => {
      host.src.set("https://example.com/broken.jpg");
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector("img");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector("img")).toBeNull();

      host.src.set("https://example.com/working.jpg");
      fixture.detectChanges();

      const newImg = fixture.nativeElement.querySelector("img");
      expect(newImg).toBeTruthy();
      expect(newImg.getAttribute("src")).toBe(
        "https://example.com/working.jpg",
      );
    });

    it("should recover when broken src is replaced by valid gravatar", async () => {
      host.src.set("https://example.com/broken.jpg");
      host.name.set("Jane Doe");
      fixture.detectChanges();

      const img = fixture.nativeElement.querySelector("img");
      img.dispatchEvent(new Event("error"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".initials")).toBeTruthy();

      // Remove broken src, add email
      host.src.set(undefined);
      host.email.set("test@example.com");
      fixture.detectChanges();
      await flushAsync();
      fixture.detectChanges();

      const newImg = fixture.nativeElement.querySelector("img");
      expect(newImg).toBeTruthy();
      expect(newImg.getAttribute("src")).toContain("gravatar.com/avatar/");
    });
  });

  describe("initials edge cases", () => {
    it("should handle whitespace-only name as empty", () => {
      host.name.set("   ");
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".initials")).toBeNull();
      expect(fixture.nativeElement.querySelector(".fallback")).toBeTruthy();
    });

    it("should handle name with extra internal whitespace", () => {
      host.name.set("  Jane    Doe  ");
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(".initials").textContent.trim(),
      ).toBe("JD");
    });

    it("should use first and last word for names with many parts", () => {
      host.name.set("Mary Jane Watson Parker");
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(".initials").textContent.trim(),
      ).toBe("MP");
    });
  });

  describe("defaults", () => {
    it("should default to medium size", () => {
      expect(
        fixture.nativeElement.querySelector("ui-avatar").classList,
      ).toContain("ui-avatar--medium");
    });

    it("should show initials by default (no src, no email)", () => {
      // TestHost defaults: name="Jane Doe", no src, no email
      expect(fixture.nativeElement.querySelector(".initials")).toBeTruthy();
      expect(fixture.nativeElement.querySelector("img")).toBeNull();
      expect(fixture.nativeElement.querySelector(".fallback")).toBeNull();
    });
  });
});
