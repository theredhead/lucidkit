import { Component, signal } from "@angular/core";
import { UITableView } from "../../../table-view.component";
import { UIAutogenerateColumnsDirective } from "../../autogenerate-columns.directive";
import { ArrayDatasource } from "../../../datasources/array-datasource";

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

@Component({
  selector: "ui-demo-autogenerate-products",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  templateUrl: "./products500.story.html",
})
export class DemoAutogenerateProductsComponent {
  public readonly datasource = signal(
    new ArrayDatasource(generateProducts(500)),
  );
  public readonly config = signal({
    excludeKeys: ["isDiscontinued"],
    headerMap: {
      sku: "SKU",
      unitPrice: "Price ($)",
      stockQuantity: "In Stock",
      reorderLevel: "Reorder At",
      supplierCode: "Supplier",
    },
  });
}
