import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UISourceTabs, type UISourceTab } from "./source-tabs.component";

const TABS: readonly UISourceTab[] = [
  {
    label: "Markup",
    language: "HTML",
    filename: "example.component.html",
    code: "<ui-card>Example</ui-card>",
  },
  {
    label: "TypeScript",
    language: "TypeScript",
    filename: "example.component.ts",
    code: "export class ExampleComponent {}",
  },
];

describe("UISourceTabs", () => {
  let fixture: ComponentFixture<UISourceTabs>;
  let component: UISourceTabs;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISourceTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(UISourceTabs);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.componentRef.setInput("tabs", TABS);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should render one tab per non-empty source pane", () => {
    fixture.componentRef.setInput("tabs", [
      ...TABS,
      { label: "Empty", code: "   " },
    ]);
    fixture.detectChanges();

    const tabButtons = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabButtons.length).toBe(2);
    expect(tabButtons[0].textContent).toContain("Markup");
    expect(tabButtons[1].textContent).toContain("TypeScript");
  });

  it("should render the active tab code and metadata", () => {
    fixture.componentRef.setInput("tabs", TABS);
    fixture.detectChanges();

    const filename = fixture.nativeElement.querySelector(".filename");
    const code = fixture.nativeElement.querySelector("code");
    expect(filename?.textContent).toContain("example.component.html");
    expect(code?.textContent).toContain("<ui-card>Example</ui-card>");
  });
});
