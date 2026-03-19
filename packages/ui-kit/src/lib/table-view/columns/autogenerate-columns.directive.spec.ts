import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UITableView } from "../table-view.component";
import { UIAutogenerateColumnsDirective } from "./autogenerate-columns.directive";
import { Component, signal } from "@angular/core";
import { ArrayDatasource } from "@theredhead/foundation";
import { DatasourceAdapter } from "../datasources/datasource-adapter";

// ── Test data ───────────────────────────────────────────────────────

const testData = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" },
];

const camelCaseData = [
  { userId: 1, firstName: "John", lastName: "Doe", userEmail: "john@test.com" },
  {
    userId: 2,
    firstName: "Jane",
    lastName: "Smith",
    userEmail: "jane@test.com",
  },
];

// ── Test host components ────────────────────────────────────────────

@Component({
  selector: "ui-test-autogenerate",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      uiAutogenerateColumns
    ></ui-table-view>
  `,
})
class BasicTestComponent {
  public readonly datasource = signal<
    DatasourceAdapter<Record<string, unknown>>
  >(new DatasourceAdapter(new ArrayDatasource(testData)));
}

@Component({
  selector: "ui-test-autogenerate-config",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      [uiAutogenerateColumns]="config()"
    ></ui-table-view>
  `,
})
class ConfigTestComponent {
  public readonly datasource = signal(
    new DatasourceAdapter(new ArrayDatasource(camelCaseData)),
  );
  public readonly config = signal<{
    humanizeHeaders?: boolean;
    headerMap?: Record<string, string>;
    excludeKeys?: string[];
  } | null>(null);
}

@Component({
  selector: "ui-test-autogenerate-empty",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      uiAutogenerateColumns
    ></ui-table-view>
  `,
})
class EmptyTestComponent {
  public readonly datasource = signal(
    new DatasourceAdapter(
      new ArrayDatasource<{ id: number; name: string }>([]),
    ),
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function getHeaderTexts(fixture: ComponentFixture<unknown>): string[] {
  const cells: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(
    ".table-header-cell .header-label",
  );
  return Array.from(cells).map((el) => el.textContent!.trim());
}

// ── Tests ───────────────────────────────────────────────────────────

describe("UIAutogenerateColumnsDirective", () => {
  describe("basic column generation", () => {
    let component: BasicTestComponent;
    let fixture: ComponentFixture<BasicTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should create the host component", () => {
      expect(component).toBeTruthy();
    });

    it("should auto-generate columns from the first row", () => {
      const headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(3);
    });

    it("should sort column keys alphabetically", () => {
      const headers = getHeaderTexts(fixture);
      // Keys: email, id, name → sorted alphabetically
      expect(headers[0]).toBe("Email");
      expect(headers[1]).toBe("Id");
      expect(headers[2]).toBe("Name");
    });

    it("should humanize property names by default", () => {
      const headers = getHeaderTexts(fixture);
      expect(headers).toContain("Email");
      expect(headers).toContain("Id");
      expect(headers).toContain("Name");
    });
  });

  describe("camelCase humanization", () => {
    let component: ConfigTestComponent;
    let fixture: ComponentFixture<ConfigTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfigTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should humanize camelCase keys by default", () => {
      const headers = getHeaderTexts(fixture);
      expect(headers).toContain("First Name");
      expect(headers).toContain("Last Name");
      expect(headers).toContain("User Email");
      expect(headers).toContain("User Id");
    });

    it("should use raw property names when humanizeHeaders is false", async () => {
      component.config.set({ humanizeHeaders: false });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const headers = getHeaderTexts(fixture);
      expect(headers).toContain("firstName");
      expect(headers).toContain("lastName");
      expect(headers).toContain("userEmail");
      expect(headers).toContain("userId");
    });
  });

  describe("excludeKeys", () => {
    let component: ConfigTestComponent;
    let fixture: ComponentFixture<ConfigTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfigTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should exclude specified keys from column generation", async () => {
      component.config.set({ excludeKeys: ["userId", "userEmail"] });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(2);
      expect(headers).toContain("First Name");
      expect(headers).toContain("Last Name");
      expect(headers).not.toContain("User Id");
      expect(headers).not.toContain("User Email");
    });

    it("should exclude a single key", async () => {
      component.config.set({ excludeKeys: ["userId"] });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(3);
      expect(headers).not.toContain("User Id");
    });
  });

  describe("headerMap", () => {
    let component: ConfigTestComponent;
    let fixture: ComponentFixture<ConfigTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfigTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should use custom header text from headerMap", async () => {
      component.config.set({
        headerMap: {
          firstName: "Given Name",
          lastName: "Family Name",
        },
      });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const headers = getHeaderTexts(fixture);
      expect(headers).toContain("Given Name");
      expect(headers).toContain("Family Name");
      // Non-mapped keys still humanize
      expect(headers).toContain("User Email");
      expect(headers).toContain("User Id");
    });

    it("should prefer headerMap over humanization", async () => {
      component.config.set({
        headerMap: { firstName: "CUSTOM" },
        humanizeHeaders: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const headers = getHeaderTexts(fixture);
      expect(headers).toContain("CUSTOM");
      // Others still humanized
      expect(headers).toContain("Last Name");
    });
  });

  describe("combined config", () => {
    let component: ConfigTestComponent;
    let fixture: ComponentFixture<ConfigTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConfigTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfigTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should apply excludeKeys and headerMap together", async () => {
      component.config.set({
        excludeKeys: ["userId"],
        headerMap: { firstName: "Name", userEmail: "Email" },
      });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(3);
      expect(headers).not.toContain("User Id");
      expect(headers).toContain("Name");
      expect(headers).toContain("Email");
      expect(headers).toContain("Last Name");
    });
  });

  describe("empty datasource", () => {
    let component: EmptyTestComponent;
    let fixture: ComponentFixture<EmptyTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EmptyTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(EmptyTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should not crash with empty datasource", () => {
      expect(component).toBeTruthy();
    });

    it("should generate no columns for empty datasource", () => {
      const headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(0);
    });
  });

  describe("datasource changes", () => {
    let component: BasicTestComponent;
    let fixture: ComponentFixture<BasicTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should regenerate columns when datasource changes", async () => {
      // Initially 3 columns: email, id, name
      let headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(3);

      // Replace with a datasource that has different keys
      const newData: Record<string, unknown>[] = [
        { age: 30, city: "NYC" },
        { age: 25, city: "LA" },
      ];
      component.datasource.set(
        new DatasourceAdapter(new ArrayDatasource(newData)),
      );
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(2);
      expect(headers).toContain("Age");
      expect(headers).toContain("City");
    });

    it("should clear columns when datasource becomes empty", async () => {
      // Initially 3 columns
      let headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(3);

      // Switch to empty datasource
      component.datasource.set(
        new DatasourceAdapter(new ArrayDatasource<Record<string, unknown>>([])),
      );
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(0);
    });
  });

  describe("cleanup on destroy", () => {
    it("should not leak component refs after destroy", async () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // Columns exist
      const headers = getHeaderTexts(fixture);
      expect(headers.length).toBe(3);

      // Destroy should not throw
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
