import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FilterableArrayDatasource } from "@theredhead/lucid-kit";
import { UISearchView } from "../../search-view.component";

// ── Sample data ──────────────────────────────────────────────────────

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

const PRODUCTS: Product[] = [
  {
    name: "Mechanical Keyboard",
    category: "Peripherals",
    price: 149.99,
    stock: 42,
    sku: "KB-001",
  },
  {
    name: "Wireless Mouse",
    category: "Peripherals",
    price: 59.99,
    stock: 128,
    sku: "MS-002",
  },
  {
    name: '27" 4K Monitor',
    category: "Displays",
    price: 449.99,
    stock: 15,
    sku: "MN-003",
  },
  {
    name: "USB-C Hub",
    category: "Accessories",
    price: 39.99,
    stock: 200,
    sku: "HB-004",
  },
  {
    name: "Webcam HD",
    category: "Peripherals",
    price: 89.99,
    stock: 67,
    sku: "WC-005",
  },
  {
    name: "Standing Desk",
    category: "Furniture",
    price: 599.99,
    stock: 8,
    sku: "DK-006",
  },
  {
    name: "Monitor Arm",
    category: "Accessories",
    price: 79.99,
    stock: 34,
    sku: "MA-007",
  },
  {
    name: "Desk Lamp",
    category: "Accessories",
    price: 44.99,
    stock: 91,
    sku: "DL-008",
  },
  {
    name: "Noise-Cancelling Headphones",
    category: "Audio",
    price: 299.99,
    stock: 23,
    sku: "HP-009",
  },
  {
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 69.99,
    stock: 56,
    sku: "SP-010",
  },
  {
    name: "Laptop Stand",
    category: "Accessories",
    price: 34.99,
    stock: 144,
    sku: "LS-011",
  },
  {
    name: "Cable Management Kit",
    category: "Accessories",
    price: 19.99,
    stock: 310,
    sku: "CM-012",
  },
  {
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 799.99,
    stock: 5,
    sku: "CH-013",
  },
  {
    name: "Docking Station",
    category: "Peripherals",
    price: 189.99,
    stock: 28,
    sku: "DS-014",
  },
  {
    name: "Portable SSD 1TB",
    category: "Storage",
    price: 109.99,
    stock: 75,
    sku: "SS-015",
  },
];

@Component({
  selector: "ui-search-view-custom-layout-demo",
  standalone: true,
  imports: [UISearchView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./custom-layout.story.scss",
  templateUrl: "./custom-layout.story.html",
})
export class CustomLayoutDemo {
  protected readonly ds = new FilterableArrayDatasource(PRODUCTS);
}
