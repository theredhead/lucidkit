import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIPropertySheet } from "./property-sheet.component";
import type {
  PropertyChangeEvent,
  PropertyFieldDefinition,
} from "./property-sheet.types";

interface Config {
  name: string;
  count: number;
  enabled: boolean;
  theme: string;
  color: string;
  opacity: number;
}

const FIELDS: PropertyFieldDefinition<Config>[] = [
  { key: "name", label: "Name", type: "string", group: "General" },
  { key: "count", label: "Count", type: "number", group: "General" },
  { key: "enabled", label: "Enabled", type: "boolean", group: "General" },
  {
    key: "theme",
    label: "Theme",
    type: "select",
    group: "Appearance",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
  },
  { key: "color", label: "Color", type: "color", group: "Appearance" },
  {
    key: "opacity",
    label: "Opacity",
    type: "slider",
    group: "Appearance",
    min: 0,
    max: 100,
    step: 5,
  },
];

const INITIAL_DATA: Config = {
  name: "Widget",
  count: 10,
  enabled: true,
  theme: "light",
  color: "#0061a4",
  opacity: 80,
};

@Component({
  standalone: true,
  imports: [UIPropertySheet],
  template: `
    <ui-property-sheet
      [fields]="fields()"
      [(data)]="data"
      (propertyChange)="onChange($event)"
    />
  `,
})
class TestHost {
  public readonly fields = signal(FIELDS);
  public readonly data = signal({ ...INITIAL_DATA });
  public readonly lastChange = signal<PropertyChangeEvent<Config> | undefined>(
    undefined,
  );

  public onChange(event: PropertyChangeEvent<Config>): void {
    this.lastChange.set(event);
  }
}

function detectAndFlush(fixture: ComponentFixture<unknown>): void {
  fixture.detectChanges();
  TestBed.flushEffects();
  fixture.detectChanges();
}

describe("UIPropertySheet", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    detectAndFlush(fixture);
    el = fixture.nativeElement;
  });

  it("should create", () => {
    const sheet = el.querySelector("ui-property-sheet");
    expect(sheet).toBeTruthy();
  });

  describe("rendering", () => {
    it("should render all field rows", () => {
      const rows = el.querySelectorAll(".ps-row");
      expect(rows.length).toBe(6);
    });

    it("should render group headings", () => {
      const headings = el.querySelectorAll(".ps-group-heading");
      expect(headings.length).toBe(2);
      expect(headings[0].textContent?.trim()).toBe("General");
      expect(headings[1].textContent?.trim()).toBe("Appearance");
    });

    it("should render labels", () => {
      const labels = el.querySelectorAll(".ps-label");
      expect(labels[0].textContent?.trim()).toBe("Name");
      expect(labels[1].textContent?.trim()).toBe("Count");
    });
  });

  describe("field types", () => {
    it("should render ui-input for string fields", () => {
      const inputs = el.querySelectorAll("ui-input");
      expect(inputs.length).toBe(2); // name + count
    });

    it("should render ui-checkbox for boolean fields", () => {
      const checkboxes = el.querySelectorAll("ui-checkbox");
      expect(checkboxes.length).toBe(1);
    });

    it("should render ui-select for select fields", () => {
      const selects = el.querySelectorAll("ui-select");
      expect(selects.length).toBe(1);
    });

    it("should render ui-color-picker for color fields", () => {
      const pickers = el.querySelectorAll("ui-color-picker");
      expect(pickers.length).toBe(1);
    });

    it("should render ui-slider for slider fields", () => {
      const sliders = el.querySelectorAll("ui-slider");
      expect(sliders.length).toBe(1);
    });
  });

  describe("grouping", () => {
    it("should not render heading for unnamed group", () => {
      const ungroupedFields: PropertyFieldDefinition<Config>[] = [
        { key: "name", label: "Name", type: "string" },
        { key: "count", label: "Count", type: "number" },
      ];
      host.fields.set(ungroupedFields);
      detectAndFlush(fixture);

      const headings = el.querySelectorAll(".ps-group-heading");
      expect(headings.length).toBe(0);
    });
  });

  describe("readonly", () => {
    it("should apply readonly class", () => {
      const readonlyFields: PropertyFieldDefinition<Config>[] = [
        { key: "name", label: "Name", type: "string", readonly: true },
      ];
      host.fields.set(readonlyFields);
      detectAndFlush(fixture);

      const row = el.querySelector(".ps-row");
      expect(row?.classList.contains("ps-row--readonly")).toBe(true);
    });
  });
});
