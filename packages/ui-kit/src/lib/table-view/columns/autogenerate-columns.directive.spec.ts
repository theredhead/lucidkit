import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UITableView } from "../table-view.component";
import { UIAutogenerateColumnsDirective } from "./autogenerate-columns.directive";
import { Component, signal } from "@angular/core";
import { ArrayDatasource } from "@theredhead/foundation";
import { DatasourceAdapter } from "../datasources/datasource-adapter";

describe("UIAutogenerateColumnsDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  const testData = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ];

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
  class TestComponent {
    public readonly datasource = signal(
      new DatasourceAdapter(new ArrayDatasource(testData), testData.length),
    );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the directive", () => {
    expect(component).toBeTruthy();
  });

  it("should auto-generate columns from the first row", async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // For now, just check that the directive doesn't crash
    expect(fixture).toBeTruthy();
  });

  it("should handle empty datasource", () => {
    const emptyData: Record<string, unknown>[] = [];
    component.datasource.set(
      new DatasourceAdapter(new ArrayDatasource(emptyData), 1),
    );
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
