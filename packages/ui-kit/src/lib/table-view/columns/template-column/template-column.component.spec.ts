import { Component, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UITemplateColumn } from "./template-column.component";
import { UITableViewColumn } from "../table-column.directive";

@Component({
  standalone: true,
  imports: [UITemplateColumn],
  template: `
    <ui-template-column key="actions" headerText="Actions">
      <ng-template let-row>
        <button class="test-action">Edit {{ row.name }}</button>
      </ng-template>
    </ui-template-column>
  `,
})
class TestHost {
  readonly column = viewChild.required(UITemplateColumn);
}

describe("UITemplateColumn", () => {
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
    expect(host.column()).toBeTruthy();
  });

  describe("DI forwarding", () => {
    it("should be injectable as UITableViewColumn", () => {
      const column = host.column();
      expect(column instanceof UITableViewColumn).toBe(true);
    });

    it("should be the same instance via UITableViewColumn provider", () => {
      // The DI provider forwards UITableViewColumn → UITemplateColumn
      const column = host.column();
      expect(column).toBeInstanceOf(UITemplateColumn);
    });
  });

  describe("inputs", () => {
    it("should have the correct key", () => {
      expect(host.column().key()).toBe("actions");
    });

    it("should have the correct headerText", () => {
      expect(host.column().headerText()).toBe("Actions");
    });
  });

  describe("cellTemplate", () => {
    it("should expose the projected template via cellTemplate getter", () => {
      const template = host.column().cellTemplate;
      expect(template).toBeTruthy();
    });

    it("should return a TemplateRef (not a signal)", () => {
      const template = host.column().cellTemplate;
      // The getter unwraps the contentChild signal
      expect(typeof template).not.toBe("function");
      expect(template.createEmbeddedView).toBeTruthy();
    });
  });
});
