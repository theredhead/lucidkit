import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";

import { UITableView } from "../../../table-view.component";
import { UIAutogenerateColumnsDirective } from "../../autogenerate-columns.directive";
import { ArrayDatasource } from "../../../datasources/array-datasource";
import { FilterableArrayDatasource } from "../../../datasources/filterable-array-datasource";
import { UIFilter } from "../../../../filter/filter.component";
import { inferFilterFields } from "../../../../filter/infer-filter-fields";
import type {
  FilterExpression,
  FilterFieldDefinition,
} from "../../../../filter/filter.types";

function generateProducts(count: number) {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Food",
    "Health",
    "Automotive",
    "Office",
  ];
  const adjectives = [
    "Premium",
    "Eco",
    "Ultra",
    "Classic",
    "Smart",
    "Pro",
    "Mini",
    "Deluxe",
    "Basic",
    "Advanced",
  ];
  const nouns = [
    "Widget",
    "Gadget",
    "Device",
    "Tool",
    "Kit",
    "Set",
    "Pack",
    "Unit",
    "Module",
    "System",
  ];

  return Array.from({ length: count }, (_, i) => ({
    sku: `SKU-${String(i + 1).padStart(5, "0")}`,
    productName: `${adjectives[i % adjectives.length]} ${nouns[(i * 3) % nouns.length]} ${i + 1}`,
    category: categories[i % categories.length],
    unitPrice: +(5 + ((i * 13.37) % 495)).toFixed(2),
    stockQuantity: (i * 17) % 500,
    reorderLevel: 10 + (i % 40),
    supplierCode: `SUP-${String(((i * 7) % 50) + 1).padStart(3, "0")}`,
    isDiscontinued: i % 13 === 0,
  }));
}

const productsForFilter = generateProducts(500);

const productFilterFields: FilterFieldDefinition[] = inferFilterFields(
  productsForFilter[0],
).filter((f) => f.key !== "isDiscontinued");

@Component({
  selector: "ui-demo-autogenerate-filtered-products",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UIAutogenerateColumnsDirective, UIFilter],
  templateUrl: "./filtered-products500.story.html",
})
export class DemoAutogenerateFilteredProductsComponent {
  public readonly fields = productFilterFields;
  public readonly columnConfig = signal({
    excludeKeys: ["isDiscontinued"],
    headerMap: {
      sku: "SKU",
      unitPrice: "Price ($)",
      stockQuantity: "In Stock",
      reorderLevel: "Reorder At",
      supplierCode: "Supplier",
    },
  });

  public readonly datasource = new FilterableArrayDatasource(productsForFilter);
  private readonly table = viewChild.required(UITableView);

  public onExpressionChange(
    expression: FilterExpression<Record<string, unknown>>,
  ): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}
