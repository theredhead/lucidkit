import { Component, type Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { UICard } from "./ui-kit/src/lib/card/card.component";
import { UICarousel } from "./ui-kit/src/lib/carousel/carousel.component";
import type { CarouselStrategy } from "./ui-kit/src/lib/carousel/carousel.types";
import { UIEmojiPicker } from "./ui-kit/src/lib/emoji-picker/emoji-picker.component";
import { UIGauge } from "./ui-kit/src/lib/gauge/gauge.component";
import { UIQRCode } from "./ui-kit/src/lib/qr-code/qr-code.component";
import { UIRichTextView } from "./ui-kit/src/lib/rich-text-view/rich-text-view.component";
import { UISkeleton } from "./ui-kit/src/lib/skeleton/skeleton.component";
import { UITimeline } from "./ui-kit/src/lib/timeline/timeline.component";
import { UIToggle } from "./ui-kit/src/lib/toggle/toggle.component";
import { UIFormDesigner } from "./ui-forms/src/lib/components/designer/form-designer.component";

import { BodyImage } from "./ui-kit/src/lib/card/stories/body-image/body-image.stories";
import { UICardStoryBodyImage } from "./ui-kit/src/lib/card/stories/body-image/body-image.story";
import { Default as CarouselDefault } from "./ui-kit/src/lib/carousel/stories/default/default.stories";
import { DefaultStorySource as CarouselSource } from "./ui-kit/src/lib/carousel/stories/default/default.story";
import { CustomCategories } from "./ui-kit/src/lib/emoji-picker/stories/custom-categories/custom-categories.stories";
import { CustomCategoriesStorySource } from "./ui-kit/src/lib/emoji-picker/stories/custom-categories/custom-categories.story";
import { Analog } from "./ui-kit/src/lib/gauge/stories/analog/analog.stories";
import { AnalogStorySource } from "./ui-kit/src/lib/gauge/stories/analog/analog.story";
import { Playground as QRPlayground } from "./ui-kit/src/lib/qr-code/stories/playground/playground.stories";
import { PlaygroundStorySource as QRSource } from "./ui-kit/src/lib/qr-code/stories/playground/playground.story";
import { WiFi } from "./ui-kit/src/lib/qr-code/stories/wi-fi/wi-fi.stories";
import { WiFiStorySource } from "./ui-kit/src/lib/qr-code/stories/wi-fi/wi-fi.story";
import { ExplicitHtml } from "./ui-kit/src/lib/rich-text-view/stories/explicit-html/explicit-html.stories";
import { ExplicitHtmlStorySource } from "./ui-kit/src/lib/rich-text-view/stories/explicit-html/explicit-html.story";
import { Default as SkeletonDefault } from "./ui-kit/src/lib/skeleton/stories/default/default.stories";
import { DefaultStorySource as SkeletonSource } from "./ui-kit/src/lib/skeleton/stories/default/default.story";
import { Horizontal } from "./ui-kit/src/lib/timeline/stories/horizontal/horizontal.stories";
import { HorizontalStorySource } from "./ui-kit/src/lib/timeline/stories/horizontal/horizontal.story";
import { Playground as TogglePlayground } from "./ui-kit/src/lib/toggle/stories/playground/playground.stories";
import { PlaygroundStorySource as ToggleSource } from "./ui-kit/src/lib/toggle/stories/playground/playground.story";
import { EmptyDesigner } from "./ui-forms/src/lib/components/designer/stories/empty-designer/empty-designer.stories";
import { EmptyDesignerStorySource } from "./ui-forms/src/lib/components/designer/stories/empty-designer/empty-designer.story";

@Component({ selector: "ui-story-control-test-host", standalone: true, template: "" })
class StoryControlHost {}

interface ControlCase {
  name: string;
  story: { render?: unknown; args?: unknown };
  wrapper: Type<unknown>;
  target: Type<unknown>;
  args: Record<string, unknown>;
  expected?: Record<string, unknown>;
}

const cases: ControlCase[] = [
  { name: "toggle", story: TogglePlayground, wrapper: ToggleSource, target: UIToggle,
    args: { value: true, size: "large", onLabel: "Yes", offLabel: "No", disabled: true, ariaLabel: "Demo toggle" } },
  { name: "QR code", story: QRPlayground, wrapper: QRSource, target: UIQRCode,
    args: { value: "changed", size: 240, foreground: "#123456", background: "#ffffff", ariaLabel: "Changed QR" } },
  { name: "Wi-Fi QR code", story: WiFi, wrapper: WiFiStorySource, target: UIQRCode,
    args: { ssid: "DemoNetwork", passphrase: "changed-password", size: 220, foreground: "#123456", background: "#ffffff", ariaLabel: "Wi-Fi" },
    expected: { value: "WIFI:S:DemoNetwork;T:WPA;P:changed-password;;", size: 220, foreground: "#123456", background: "#ffffff", ariaLabel: "Wi-Fi" } },
  { name: "card", story: BodyImage, wrapper: UICardStoryBodyImage, target: UICard,
    args: { variant: "outlined", interactive: true } },
  { name: "gauge", story: Analog, wrapper: AnalogStorySource, target: UIGauge,
    args: { value: 19, min: 5, max: 50, width: 280, height: 240, unit: "changed", detailLevel: "low" } },
  { name: "timeline", story: Horizontal, wrapper: HorizontalStorySource, target: UITimeline,
    args: { orientation: "vertical", alignment: "alternate", ariaLabel: "Changed timeline" } },
  { name: "rich text", story: ExplicitHtml, wrapper: ExplicitHtmlStorySource, target: UIRichTextView,
    args: { strategy: "markdown", ariaLabel: "Changed rich text" } },
  { name: "skeleton", story: SkeletonDefault, wrapper: SkeletonSource, target: UISkeleton,
    args: { variant: "circle", lines: 2, width: "40px", height: "40px", animated: false } },
  { name: "emoji picker", story: CustomCategories, wrapper: CustomCategoriesStorySource, target: UIEmojiPicker,
    args: { searchPlaceholder: "Find an emoji", previewSize: 80, ariaLabel: "Changed emoji picker" } },
  { name: "form designer", story: EmptyDesigner, wrapper: EmptyDesignerStorySource, target: UIFormDesigner,
    args: { schema: { id: "changed", title: "Changed schema", groups: [] }, schemaChange: vi.fn() },
    expected: { schema: { id: "changed", title: "Changed schema", groups: [] } } },
];

describe("Storybook control forwarding", () => {
  for (const item of cases) {
    it(`should apply changed ${item.name} controls through its actual render template`, async () => {
      const instance = await renderStory(item.story, item.wrapper, item.target, item.args);
      for (const [name, value] of Object.entries(item.expected ?? item.args)) {
        expect(instance[name](), name).toEqual(value);
      }
    });
  }

  it("should rebuild the carousel strategy when its layout controls change", async () => {
    const instance = await renderStory(CarouselDefault, CarouselSource, UICarousel, {
      gap: 40, itemWidth: 400, fade: true, showControls: false, showIndicators: true, wrap: true,
    });
    const strategy = instance["strategy"]() as CarouselStrategy;
    const style = strategy.getItemStyle(1, 0, 3);
    expect(style.transform).toBe("translateX(440px)");
    expect(style.opacity).toBe(0.7);
    expect(instance["showControls"]()).toBe(false);
    expect(instance["showIndicators"]()).toBe(true);
    expect(instance["wrap"]()).toBe(true);
  });
});

async function renderStory(
  story: { render?: unknown; args?: unknown },
  wrapper: Type<unknown>,
  target: Type<unknown>,
  overrides: Record<string, unknown>,
): Promise<Record<string, () => unknown>> {
  const render = story.render as (args: Record<string, unknown>) => {
    props: Record<string, unknown>;
    template: string;
  };
  const args = { ...(story.args as Record<string, unknown>), ...overrides };
  const rendered = render(args);
  await TestBed.configureTestingModule({ imports: [StoryControlHost] })
    .overrideComponent(StoryControlHost, { set: { imports: [wrapper], template: rendered.template } })
    .compileComponents();
  const fixture = TestBed.createComponent(StoryControlHost);
  Object.assign(fixture.componentInstance, rendered.props);
  fixture.detectChanges();
  return fixture.debugElement.query(By.directive(target)).componentInstance as Record<string, () => unknown>;
}
