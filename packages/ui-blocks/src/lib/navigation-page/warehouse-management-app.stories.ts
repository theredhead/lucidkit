import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  FilterableArrayDatasource,
  UIAccordion,
  UIAccordionItem,
  UIAvatar,
  UIBadge,
  UIBadgeColumn,
  UIButton,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICheckbox,
  UIChip,
  UIIcon,
  UIIcons,
  UIInput,
  UIProgress,
  UISelect,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/ui-kit";

import { UIMasterDetailView } from "../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "./navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "./navigation-page.utils";

// ── Domain types ─────────────────────────────────────────────────────

interface Part {
  readonly id: number;
  readonly sku: string;
  readonly name: string;
  readonly category: string;
  readonly location: string;
  readonly quantity: number;
  readonly minStock: number;
  readonly unitPrice: number;
  readonly supplier: string;
  readonly status: "in-stock" | "low-stock" | "out-of-stock" | "discontinued";
  readonly lastReceived: string;
}

interface PickOrder {
  readonly id: number;
  readonly orderNumber: string;
  readonly customer: string;
  readonly items: number;
  readonly priority: "urgent" | "high" | "normal" | "low";
  readonly status: "pending" | "picking" | "packed" | "shipped" | "cancelled";
  readonly created: string;
  readonly assignee: string;
  readonly totalValue: number;
}

interface Shipment {
  readonly id: number;
  readonly trackingNumber: string;
  readonly carrier: string;
  readonly destination: string;
  readonly parcels: number;
  readonly weight: string;
  readonly status: "in-transit" | "delivered" | "delayed" | "returned";
  readonly estimatedDelivery: string;
}

interface Zone {
  readonly id: number;
  readonly name: string;
  readonly type: "receiving" | "storage" | "picking" | "shipping";
  readonly capacity: number;
  readonly utilization: number;
  readonly temperature: string;
  readonly racks: number;
}

interface Supplier {
  readonly id: number;
  readonly name: string;
  readonly contact: string;
  readonly email: string;
  readonly leadTime: string;
  readonly rating: number;
  readonly activeOrders: number;
  readonly totalParts: number;
}

// ── Seed data ────────────────────────────────────────────────────────

const PARTS: Part[] = [
  {
    id: 1,
    sku: "RES-10K-0805",
    name: "10K Ohm Resistor (0805)",
    category: "Resistors",
    location: "A-01-03",
    quantity: 24500,
    minStock: 5000,
    unitPrice: 0.002,
    supplier: "MicroComp Ltd",
    status: "in-stock",
    lastReceived: "2 days ago",
  },
  {
    id: 2,
    sku: "CAP-100UF-EL",
    name: "100µF Electrolytic Capacitor",
    category: "Capacitors",
    location: "A-02-07",
    quantity: 8200,
    minStock: 2000,
    unitPrice: 0.15,
    supplier: "CapaTech Inc",
    status: "in-stock",
    lastReceived: "1 week ago",
  },
  {
    id: 3,
    sku: "IC-ATMEGA328P",
    name: "ATmega328P Microcontroller",
    category: "ICs",
    location: "B-04-12",
    quantity: 340,
    minStock: 500,
    unitPrice: 2.85,
    supplier: "ChipSource Global",
    status: "low-stock",
    lastReceived: "3 weeks ago",
  },
  {
    id: 4,
    sku: "LED-RED-5MM",
    name: "Red LED 5mm (620nm)",
    category: "LEDs",
    location: "A-03-01",
    quantity: 15800,
    minStock: 3000,
    unitPrice: 0.04,
    supplier: "BrightParts Co",
    status: "in-stock",
    lastReceived: "5 days ago",
  },
  {
    id: 5,
    sku: "CONN-USB-C-F",
    name: "USB-C Female Connector",
    category: "Connectors",
    location: "C-01-09",
    quantity: 1200,
    minStock: 1000,
    unitPrice: 0.45,
    supplier: "ConnectPro",
    status: "low-stock",
    lastReceived: "2 weeks ago",
  },
  {
    id: 6,
    sku: "TRANS-2N2222A",
    name: "2N2222A NPN Transistor",
    category: "Transistors",
    location: "B-02-05",
    quantity: 6700,
    minStock: 2000,
    unitPrice: 0.08,
    supplier: "MicroComp Ltd",
    status: "in-stock",
    lastReceived: "1 week ago",
  },
  {
    id: 7,
    sku: "PCB-PROTO-10X",
    name: "Prototype PCB 10x10cm",
    category: "PCBs",
    location: "D-01-02",
    quantity: 450,
    minStock: 200,
    unitPrice: 1.2,
    supplier: "BoardWorks",
    status: "in-stock",
    lastReceived: "3 days ago",
  },
  {
    id: 8,
    sku: "IC-ESP32-WROOM",
    name: "ESP32-WROOM-32 Module",
    category: "ICs",
    location: "B-04-15",
    quantity: 0,
    minStock: 300,
    unitPrice: 3.5,
    supplier: "ChipSource Global",
    status: "out-of-stock",
    lastReceived: "2 months ago",
  },
  {
    id: 9,
    sku: "DIODE-1N4007",
    name: "1N4007 Rectifier Diode",
    category: "Diodes",
    location: "A-05-02",
    quantity: 18900,
    minStock: 5000,
    unitPrice: 0.015,
    supplier: "MicroComp Ltd",
    status: "in-stock",
    lastReceived: "4 days ago",
  },
  {
    id: 10,
    sku: "XTAL-16MHZ",
    name: "16MHz Crystal Oscillator",
    category: "Crystals",
    location: "B-03-08",
    quantity: 2100,
    minStock: 500,
    unitPrice: 0.25,
    supplier: "FreqTech",
    status: "in-stock",
    lastReceived: "1 week ago",
  },
  {
    id: 11,
    sku: "RELAY-5V-SPDT",
    name: "5V SPDT Relay Module",
    category: "Relays",
    location: "C-02-04",
    quantity: 890,
    minStock: 300,
    unitPrice: 0.95,
    supplier: "SwitchMaster",
    status: "in-stock",
    lastReceived: "10 days ago",
  },
  {
    id: 12,
    sku: "FUSE-250MA-5X",
    name: "250mA Glass Fuse 5x20mm",
    category: "Fuses",
    location: "C-03-01",
    quantity: 0,
    minStock: 500,
    unitPrice: 0.06,
    supplier: "SafeCircuit",
    status: "discontinued",
    lastReceived: "—",
  },
];

const PICK_ORDERS: PickOrder[] = [
  {
    id: 1,
    orderNumber: "PO-2026-001",
    customer: "ElectroBuild GmbH",
    items: 5,
    priority: "urgent",
    status: "picking",
    created: "20 min ago",
    assignee: "Maria S.",
    totalValue: 1245.0,
  },
  {
    id: 2,
    orderNumber: "PO-2026-002",
    customer: "HomeLab Kits",
    items: 12,
    priority: "normal",
    status: "pending",
    created: "1 hour ago",
    assignee: "Unassigned",
    totalValue: 89.5,
  },
  {
    id: 3,
    orderNumber: "PO-2026-003",
    customer: "RoboCorp Inc",
    items: 3,
    priority: "high",
    status: "packed",
    created: "3 hours ago",
    assignee: "Jan K.",
    totalValue: 4320.0,
  },
  {
    id: 4,
    orderNumber: "PO-2026-004",
    customer: "MakerSpace Berlin",
    items: 8,
    priority: "normal",
    status: "shipped",
    created: "Yesterday",
    assignee: "Lena B.",
    totalValue: 562.3,
  },
  {
    id: 5,
    orderNumber: "PO-2026-005",
    customer: "IoT Solutions AG",
    items: 22,
    priority: "high",
    status: "pending",
    created: "2 hours ago",
    assignee: "Unassigned",
    totalValue: 7891.0,
  },
  {
    id: 6,
    orderNumber: "PO-2026-006",
    customer: "University Lab Supply",
    items: 15,
    priority: "low",
    status: "pending",
    created: "4 hours ago",
    assignee: "Unassigned",
    totalValue: 234.8,
  },
  {
    id: 7,
    orderNumber: "PO-2026-007",
    customer: "AutoSense Ltd",
    items: 6,
    priority: "urgent",
    status: "picking",
    created: "45 min ago",
    assignee: "Tom R.",
    totalValue: 3100.0,
  },
  {
    id: 8,
    orderNumber: "PO-2026-008",
    customer: "GreenTech Devices",
    items: 4,
    priority: "normal",
    status: "cancelled",
    created: "2 days ago",
    assignee: "—",
    totalValue: 0,
  },
];

const SHIPMENTS: Shipment[] = [
  {
    id: 1,
    trackingNumber: "TRK-928374",
    carrier: "DHL Express",
    destination: "Munich, DE",
    parcels: 2,
    weight: "4.2 kg",
    status: "in-transit",
    estimatedDelivery: "Tomorrow",
  },
  {
    id: 2,
    trackingNumber: "TRK-182736",
    carrier: "FedEx",
    destination: "Amsterdam, NL",
    parcels: 1,
    weight: "1.8 kg",
    status: "delivered",
    estimatedDelivery: "Delivered",
  },
  {
    id: 3,
    trackingNumber: "TRK-456123",
    carrier: "UPS",
    destination: "Prague, CZ",
    parcels: 3,
    weight: "12.5 kg",
    status: "delayed",
    estimatedDelivery: "2 days late",
  },
  {
    id: 4,
    trackingNumber: "TRK-789012",
    carrier: "DHL Express",
    destination: "Vienna, AT",
    parcels: 1,
    weight: "0.8 kg",
    status: "in-transit",
    estimatedDelivery: "Thu 27 Mar",
  },
  {
    id: 5,
    trackingNumber: "TRK-345678",
    carrier: "GLS",
    destination: "Warsaw, PL",
    parcels: 4,
    weight: "8.1 kg",
    status: "returned",
    estimatedDelivery: "—",
  },
];

const ZONES: Zone[] = [
  {
    id: 1,
    name: "Zone A — SMD Components",
    type: "storage",
    capacity: 50000,
    utilization: 78,
    temperature: "22°C",
    racks: 12,
  },
  {
    id: 2,
    name: "Zone B — ICs & Modules",
    type: "storage",
    capacity: 20000,
    utilization: 62,
    temperature: "20°C (controlled)",
    racks: 8,
  },
  {
    id: 3,
    name: "Zone C — Connectors & Relays",
    type: "storage",
    capacity: 15000,
    utilization: 45,
    temperature: "22°C",
    racks: 6,
  },
  {
    id: 4,
    name: "Zone D — PCBs & Assemblies",
    type: "storage",
    capacity: 8000,
    utilization: 34,
    temperature: "21°C",
    racks: 4,
  },
  {
    id: 5,
    name: "Receiving Dock",
    type: "receiving",
    capacity: 5000,
    utilization: 52,
    temperature: "ambient",
    racks: 2,
  },
  {
    id: 6,
    name: "Pick & Pack Station",
    type: "picking",
    capacity: 2000,
    utilization: 88,
    temperature: "22°C",
    racks: 3,
  },
  {
    id: 7,
    name: "Shipping Dock",
    type: "shipping",
    capacity: 3000,
    utilization: 41,
    temperature: "ambient",
    racks: 2,
  },
];

const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "MicroComp Ltd",
    contact: "Hans Müller",
    email: "hans@microcomp.de",
    leadTime: "5–7 days",
    rating: 4.8,
    activeOrders: 3,
    totalParts: 142,
  },
  {
    id: 2,
    name: "ChipSource Global",
    contact: "Yuki Tanaka",
    email: "yuki@chipsource.jp",
    leadTime: "10–14 days",
    rating: 4.5,
    activeOrders: 2,
    totalParts: 89,
  },
  {
    id: 3,
    name: "ConnectPro",
    contact: "Anna Svensson",
    email: "anna@connectpro.se",
    leadTime: "3–5 days",
    rating: 4.9,
    activeOrders: 1,
    totalParts: 67,
  },
  {
    id: 4,
    name: "BrightParts Co",
    contact: "Liam O'Connor",
    email: "liam@brightparts.ie",
    leadTime: "7–10 days",
    rating: 4.2,
    activeOrders: 0,
    totalParts: 38,
  },
  {
    id: 5,
    name: "BoardWorks",
    contact: "Clara Dupont",
    email: "clara@boardworks.fr",
    leadTime: "5–8 days",
    rating: 4.6,
    activeOrders: 1,
    totalParts: 24,
  },
];

// ── Icon constants ───────────────────────────────────────────────────

const ICONS = {
  warehouse: UIIcons.Lucide.Buildings.Warehouse,
  factory: UIIcons.Lucide.Buildings.Factory,
  package: UIIcons.Lucide.Development.Package,
  packageCheck: UIIcons.Lucide.Development.PackageCheck,
  packageOpen: UIIcons.Lucide.Development.PackageOpen,
  packageX: UIIcons.Lucide.Development.PackageX,
  boxes: UIIcons.Lucide.Development.Boxes,
  box: UIIcons.Lucide.Development.Box,
  circuitBoard: UIIcons.Lucide.Development.CircuitBoard,
  container: UIIcons.Lucide.Development.Container,
  cpu: UIIcons.Lucide.Devices.Cpu,
  zap: UIIcons.Lucide.Devices.Zap,
  barcode: UIIcons.Lucide.Shopping.Barcode,
  scanBarcode: UIIcons.Lucide.Shopping.ScanBarcode,
  scan: UIIcons.Lucide.Shopping.Scan,
  shoppingCart: UIIcons.Lucide.Shopping.ShoppingCart,
  dollarSign: UIIcons.Lucide.Finance.DollarSign,
  truck: UIIcons.Lucide.Transportation.Truck,
  forklift: UIIcons.Lucide.Transportation.Forklift,
  mapPin: UIIcons.Lucide.Navigation.MapPin,
  tag: UIIcons.Lucide.Account.Tag,
  settings: UIIcons.Lucide.Account.Settings,
  user: UIIcons.Lucide.Account.User,
  users: UIIcons.Lucide.Account.Users,
  bell: UIIcons.Lucide.Account.Bell,
  clipboardList: UIIcons.Lucide.Text.ClipboardList,
  clipboardCheck: UIIcons.Lucide.Text.ClipboardCheck,
  listChecks: UIIcons.Lucide.Text.ListChecks,
  listOrdered: UIIcons.Lucide.Text.ListOrdered,
  shelvingUnit: UIIcons.Lucide.Home.ShelvingUnit,
  bolt: UIIcons.Lucide.Home.Bolt,
  circleCheck: UIIcons.Lucide.Notifications.CircleCheck,
  triangleAlert: UIIcons.Lucide.Notifications.TriangleAlert,
  archive: UIIcons.Lucide.Files.Archive,
  search: UIIcons.Lucide.Social.Search,
  trendingUp: UIIcons.Lucide.Arrows.TrendingUp,
  clock: UIIcons.Lucide.Time.Clock,
  layers: UIIcons.Lucide.Design.Layers,
  wrench: UIIcons.Lucide.Tools.Wrench,
  hardHat: UIIcons.Lucide.Tools.HardHat,
} as const;

// ── Navigation structure ─────────────────────────────────────────────

const NAV: NavigationNode[] = [
  navItem("dashboard", "Dashboard", { icon: ICONS.warehouse }),
  navGroup(
    "inventory-section",
    "Inventory",
    [
      navItem("parts", "Parts Catalog", {
        icon: ICONS.cpu,
        badge: String(PARTS.filter((p) => p.status !== "discontinued").length),
      }),
      navItem("receive", "Receive Stock", { icon: ICONS.packageOpen }),
      navItem("low-stock", "Low Stock Alerts", {
        icon: ICONS.triangleAlert,
        badge: String(
          PARTS.filter(
            (p) => p.status === "low-stock" || p.status === "out-of-stock",
          ).length,
        ),
      }),
    ],
    { icon: ICONS.boxes, expanded: true },
  ),
  navGroup(
    "orders-section",
    "Order Picking",
    [
      navItem("pick-queue", "Pick Queue", {
        icon: ICONS.clipboardList,
        badge: String(PICK_ORDERS.filter((o) => o.status === "pending").length),
      }),
      navItem("active-picks", "Active Picks", {
        icon: ICONS.listChecks,
        badge: String(PICK_ORDERS.filter((o) => o.status === "picking").length),
      }),
    ],
    { icon: ICONS.clipboardCheck, expanded: true },
  ),
  navItem("shipments", "Shipments", {
    icon: ICONS.truck,
    badge: String(SHIPMENTS.filter((s) => s.status === "in-transit").length),
  }),
  navItem("zones", "Warehouse Zones", { icon: ICONS.layers }),
  navItem("suppliers", "Suppliers", { icon: ICONS.factory }),
  navItem("settings", "Settings", { icon: ICONS.settings }),
];

// ── Helper functions ─────────────────────────────────────────────────

function partStatusColor(
  status: string,
): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "in-stock":
      return "success";
    case "low-stock":
      return "warning";
    case "out-of-stock":
      return "danger";
    case "discontinued":
      return "neutral";
    default:
      return "neutral";
  }
}

function orderStatusColor(
  status: string,
): "success" | "warning" | "danger" | "neutral" | "primary" {
  switch (status) {
    case "pending":
      return "warning";
    case "picking":
      return "primary";
    case "packed":
      return "success";
    case "shipped":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

function priorityColor(
  priority: string,
): "danger" | "warning" | "success" | "neutral" {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "normal":
      return "success";
    case "low":
      return "neutral";
    default:
      return "neutral";
  }
}

function shipmentStatusColor(
  status: string,
): "success" | "warning" | "danger" | "neutral" | "primary" {
  switch (status) {
    case "in-transit":
      return "primary";
    case "delivered":
      return "success";
    case "delayed":
      return "danger";
    case "returned":
      return "warning";
    default:
      return "neutral";
  }
}

function zoneTypeColor(
  type: string,
): "success" | "warning" | "neutral" | "primary" {
  switch (type) {
    case "storage":
      return "neutral";
    case "receiving":
      return "primary";
    case "picking":
      return "warning";
    case "shipping":
      return "success";
    default:
      return "neutral";
  }
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatQty(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

// ── Demo component ───────────────────────────────────────────────────

@Component({
  selector: "ui-demo-warehouse-app",
  standalone: true,
  imports: [
    UINavigationPage,
    UIMasterDetailView,
    UITabGroup,
    UITab,
    UITabSeparator,
    UITabSpacer,
    UIButton,
    UIIcon,
    UIInput,
    UISelect,
    UICheckbox,
    UIToggle,
    UIBadge,
    UIChip,
    UIAvatar,
    UICard,
    UICardHeader,
    UICardBody,
    UICardFooter,
    UIAccordion,
    UIAccordionItem,
    UIProgress,
    UITextColumn,
    UITemplateColumn,
    UIBadgeColumn,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: grid;
        height: 100vh;
        overflow: hidden;
      }

      .page-fill {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .page-fill > ui-tab-group {
        flex: 1;
        min-height: 0;
      }

      .page-fill > ui-tab-group ::ng-deep .panel {
        display: flex;
        flex-direction: column;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 1.25rem;
      }
      .page-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .page-title h2 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 700;
      }
      .page-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Stats grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-value {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0.25rem 0;
      }
      .stat-label {
        font-size: 0.78rem;
        opacity: 0.65;
      }
      .stat-icon-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Master-detail wrapper */
      .mdv-wrap {
        flex: 1;
        min-height: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }

      /* Detail pane */
      .detail-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .detail-name {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
      }
      .detail-sub {
        font-size: 0.82rem;
        opacity: 0.65;
        margin: 0.15rem 0 0;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 9rem 1fr;
        gap: 0.35rem 1rem;
        font-size: 0.88rem;
      }
      .detail-grid dt {
        font-weight: 600;
        margin: 0;
      }
      .detail-grid dd {
        margin: 0;
      }

      /* Stock bar */
      .stock-bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
      .stock-bar-label {
        font-size: 0.78rem;
        font-weight: 600;
        min-width: 4rem;
      }

      /* Zone cards */
      .zone-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }
      .zone-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .zone-bar-pct {
        font-size: 0.82rem;
        font-weight: 700;
        min-width: 2.5rem;
        text-align: right;
      }
      .zone-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.82rem;
        margin-top: 0.5rem;
      }
      .zone-meta-item {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      /* Order items list */
      .order-item-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
        font-size: 0.88rem;
      }
      .order-item-row:last-child {
        border-bottom: none;
      }

      /* Form grid */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        max-width: 36rem;
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .field-label {
        font-size: 0.82rem;
        font-weight: 600;
      }
      .form-field-full {
        grid-column: 1 / -1;
      }
      .form-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      /* Supplier cards */
      .supplier-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .supplier-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.82rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
      }
      .supplier-stat {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      /* Settings */
      .settings-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 36rem;
      }
      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        font-size: 0.88rem;
      }
      .setting-label {
        font-weight: 600;
      }
      .setting-desc {
        font-size: 0.78rem;
        opacity: 0.65;
        margin-top: 0.15rem;
      }

      /* Scroll area */
      .scroll-area {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-right: 0.25rem;
      }

      /* Pick sequence */
      .pick-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.65rem 0;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
      }
      .pick-step:last-child {
        border-bottom: none;
      }
      .pick-step-num {
        font-size: 1.25rem;
        font-weight: 800;
        opacity: 0.35;
        min-width: 2rem;
        text-align: center;
      }
      .pick-step-info {
        flex: 1;
        min-width: 0;
      }
      .pick-step-loc {
        font-family: monospace;
        font-size: 0.82rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--ui-surface-dim, #e8eaed);
        color: var(--ui-text, #1d232b);
      }

      /* Category chip strip */
      .category-strip {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      /* KPI row */
      .kpi-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.25rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="PartVault WMS"
    >
      <ng-template #content let-node>
        <!-- ─── Dashboard ─── -->
        @if (node.id === "dashboard") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.warehouse" [size]="24" />
                <h2>Dashboard</h2>
              </div>
              <div class="page-actions">
                <ui-input
                  placeholder="Search parts, orders..."
                  ariaLabel="Search"
                  style="width: 240px"
                />
              </div>
            </div>

            <div class="stats-grid">
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-icon-row">
                    <ui-icon [svg]="icons.boxes" [size]="18" />
                    <span class="stat-label">Total Parts</span>
                  </div>
                  <div class="stat-value">{{ totalSKUs }}</div>
                  <ui-progress [value]="100" ariaLabel="Total parts" />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-icon-row">
                    <ui-icon [svg]="icons.clipboardList" [size]="18" />
                    <span class="stat-label">Pending Orders</span>
                  </div>
                  <div class="stat-value">{{ pendingOrders }}</div>
                  <ui-progress
                    [value]="(pendingOrders / allOrders.length) * 100"
                    ariaLabel="Pending orders"
                  />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-icon-row">
                    <ui-icon [svg]="icons.triangleAlert" [size]="18" />
                    <span class="stat-label">Low Stock Alerts</span>
                  </div>
                  <div class="stat-value">{{ lowStockCount }}</div>
                  <ui-progress
                    [value]="(lowStockCount / allParts.length) * 100"
                    ariaLabel="Low stock"
                  />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-icon-row">
                    <ui-icon [svg]="icons.truck" [size]="18" />
                    <span class="stat-label">In Transit</span>
                  </div>
                  <div class="stat-value">{{ inTransitCount }}</div>
                  <ui-progress
                    [value]="(inTransitCount / allShipments.length) * 100"
                    ariaLabel="In transit"
                  />
                </ui-card-body>
              </ui-card>
            </div>

            <ui-tab-group panelStyle="outline">
              <ui-tab label="Recent Orders" [icon]="icons.clipboardList">
                <div class="mdv-wrap" style="border: none; margin-top: 0.5rem">
                  <ui-master-detail-view
                    [datasource]="recentOrdersDs"
                    title="Recent"
                    placeholder="Select an order"
                  >
                    <ui-text-column key="orderNumber" headerText="Order #" />
                    <ui-text-column key="customer" headerText="Customer" />
                    <ui-badge-column key="status" headerText="Status" />

                    <ng-template #detail let-order>
                      <dl class="detail-grid">
                        <dt>Order</dt>
                        <dd>{{ order.orderNumber }}</dd>
                        <dt>Customer</dt>
                        <dd>{{ order.customer }}</dd>
                        <dt>Items</dt>
                        <dd>{{ order.items }}</dd>
                        <dt>Priority</dt>
                        <dd>
                          <ui-chip [color]="getPriorityColor(order.priority)">
                            {{ order.priority }}
                          </ui-chip>
                        </dd>
                        <dt>Assignee</dt>
                        <dd>{{ order.assignee }}</dd>
                        <dt>Value</dt>
                        <dd>{{ fmtCurrency(order.totalValue) }}</dd>
                      </dl>
                    </ng-template>
                  </ui-master-detail-view>
                </div>
              </ui-tab>
              <ui-tab-separator />
              <ui-tab label="Zone Utilization" [icon]="icons.layers">
                <div style="padding-top: 0.75rem">
                  @for (zone of allZones; track zone.id) {
                    <div class="zone-bar">
                      <span class="stock-bar-label" style="min-width: 14rem">
                        {{ zone.name }}
                      </span>
                      <ui-progress
                        [value]="zone.utilization"
                        [ariaLabel]="zone.name + ' utilization'"
                        style="flex: 1"
                      />
                      <span class="zone-bar-pct">{{ zone.utilization }}%</span>
                    </div>
                  }
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }

        <!-- ─── Parts Catalog ─── -->
        @if (node.id === "parts") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.cpu" [size]="24" />
                <h2>Parts Catalog</h2>
                <ui-badge
                  variant="count"
                  [count]="allParts.length"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-button variant="outlined" size="sm"> Export CSV </ui-button>
              </div>
            </div>

            <div class="category-strip">
              @for (cat of partCategories; track cat) {
                <ui-chip
                  [color]="selectedCategory() === cat ? 'primary' : 'neutral'"
                  (click)="selectedCategory.set(cat)"
                >
                  {{ cat }}
                </ui-chip>
              }
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="partsDs"
                title="Parts"
                [showFilter]="true"
                placeholder="Select a part to view details"
              >
                <ui-template-column key="sku" headerText="SKU">
                  <ng-template let-row>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                      "
                    >
                      <ui-icon [svg]="icons.barcode" [size]="14" />
                      <span style="font-family: monospace; font-weight: 600">
                        {{ row.sku }}
                      </span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="name" headerText="Part Name" />
                <ui-text-column key="location" headerText="Location" />
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-part>
                  <div class="detail-header">
                    <ui-icon [svg]="icons.circuitBoard" [size]="28" />
                    <div>
                      <h3 class="detail-name">{{ part.name }}</h3>
                      <p class="detail-sub">
                        {{ part.sku }} · {{ part.category }}
                      </p>
                    </div>
                    <div style="margin-left: auto">
                      <ui-chip [color]="getPartStatusColor(part.status)">
                        {{ part.status }}
                      </ui-chip>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="Details" [icon]="icons.cpu">
                      <dl class="detail-grid" style="padding-top: 0.75rem">
                        <dt>SKU</dt>
                        <dd style="font-family: monospace">{{ part.sku }}</dd>
                        <dt>Category</dt>
                        <dd>{{ part.category }}</dd>
                        <dt>Location</dt>
                        <dd>
                          <span class="pick-step-loc">
                            {{ part.location }}
                          </span>
                        </dd>
                        <dt>Quantity</dt>
                        <dd>{{ part.quantity | number }}</dd>
                        <dt>Min Stock</dt>
                        <dd>{{ part.minStock | number }}</dd>
                        <dt>Unit Price</dt>
                        <dd>{{ fmtCurrency(part.unitPrice) }}</dd>
                        <dt>Supplier</dt>
                        <dd>{{ part.supplier }}</dd>
                        <dt>Last Received</dt>
                        <dd>{{ part.lastReceived }}</dd>
                      </dl>
                    </ui-tab>
                    <ui-tab label="Stock Level" [icon]="icons.trendingUp">
                      <div style="padding-top: 0.75rem">
                        <div class="stock-bar">
                          <span class="stock-bar-label">Current</span>
                          <ui-progress
                            [value]="
                              part.minStock > 0
                                ? (part.quantity / (part.minStock * 5)) * 100
                                : 0
                            "
                            ariaLabel="Stock level"
                            style="flex: 1"
                          />
                          <span style="font-weight: 700; font-size: 0.88rem">
                            {{ fmtQty(part.quantity) }}
                          </span>
                        </div>
                        <div class="stock-bar">
                          <span class="stock-bar-label">Min</span>
                          <ui-progress
                            [value]="
                              part.minStock > 0
                                ? (part.minStock / (part.minStock * 5)) * 100
                                : 0
                            "
                            ariaLabel="Minimum stock"
                            style="flex: 1"
                          />
                          <span
                            style="
                              font-weight: 700;
                              font-size: 0.88rem;
                              opacity: 0.55;
                            "
                          >
                            {{ fmtQty(part.minStock) }}
                          </span>
                        </div>
                        @if (part.quantity < part.minStock) {
                          <div
                            style="
                              margin-top: 0.75rem;
                              display: flex;
                              gap: 0.5rem;
                              align-items: center;
                            "
                          >
                            <ui-icon [svg]="icons.triangleAlert" [size]="16" />
                            <span style="font-size: 0.88rem; font-weight: 600">
                              Reorder recommended — below minimum threshold
                            </span>
                          </div>
                        }
                        <div style="margin-top: 1rem">
                          <ui-button variant="outlined" size="sm">
                            Create Reorder
                          </ui-button>
                        </div>
                      </div>
                    </ui-tab>
                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.scanBarcode" ariaLabel="Scan">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.5rem">
                          Scan this part's barcode to update inventory:
                        </p>
                        <div style="display: flex; gap: 0.5rem">
                          <ui-button variant="outlined" size="sm">
                            Print Label
                          </ui-button>
                          <ui-button variant="ghost" size="sm">
                            Show QR Code
                          </ui-button>
                        </div>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Receive Stock ─── -->
        @if (node.id === "receive") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.packageOpen" [size]="24" />
              <h2>Receive Stock</h2>
            </div>
          </div>

          <ui-card variant="outlined">
            <ui-card-header>
              <h3 style="margin: 0; font-size: 1rem">
                Inbound Shipment Details
              </h3>
            </ui-card-header>
            <ui-card-body>
              <div class="form-grid">
                <div class="form-field">
                  <span class="field-label">Supplier</span>
                  <ui-select
                    [options]="supplierOptions"
                    placeholder="Select supplier"
                    ariaLabel="Supplier"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Purchase Order #</span>
                  <ui-input
                    placeholder="PO-2026-XXX"
                    ariaLabel="Purchase order number"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Part SKU</span>
                  <ui-input
                    placeholder="Scan or enter SKU"
                    ariaLabel="Part SKU"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Quantity</span>
                  <ui-input placeholder="0" ariaLabel="Quantity received" />
                </div>
                <div class="form-field">
                  <span class="field-label">Storage Location</span>
                  <ui-select
                    [options]="locationOptions"
                    placeholder="Select zone & rack"
                    ariaLabel="Storage location"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Condition</span>
                  <ui-select
                    [options]="conditionOptions"
                    placeholder="Select condition"
                    ariaLabel="Part condition"
                  />
                </div>
                <div class="form-field form-field-full">
                  <ui-checkbox ariaLabel="Quality inspection">
                    Quality inspection passed
                  </ui-checkbox>
                </div>
                <div class="form-field form-field-full">
                  <span class="field-label">Notes</span>
                  <ui-input
                    placeholder="Batch notes, damage report..."
                    ariaLabel="Notes"
                  />
                </div>
                <div class="form-actions">
                  <ui-button variant="filled">Confirm Receipt</ui-button>
                  <ui-button variant="outlined"> Scan Next Item </ui-button>
                  <ui-button variant="ghost">Cancel</ui-button>
                </div>
              </div>
            </ui-card-body>
          </ui-card>
        }

        <!-- ─── Low Stock Alerts ─── -->
        @if (node.id === "low-stock") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.triangleAlert" [size]="24" />
                <h2>Low Stock Alerts</h2>
                <ui-badge
                  variant="count"
                  [count]="lowStockParts.length"
                  color="danger"
                />
              </div>
              <div class="page-actions">
                <ui-button variant="filled" size="sm"> Reorder All </ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="lowStockDs"
                title="Alerts"
                placeholder="Select an alert to view details"
              >
                <ui-template-column key="sku" headerText="SKU">
                  <ng-template let-row>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                      "
                    >
                      <ui-icon [svg]="icons.triangleAlert" [size]="14" />
                      <span style="font-family: monospace; font-weight: 600">
                        {{ row.sku }}
                      </span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="name" headerText="Part" />
                <ui-template-column key="quantity" headerText="Qty">
                  <ng-template let-row>
                    <span
                      style="font-weight: 700"
                      [style.color]="
                        row.quantity === 0
                          ? 'var(--ui-danger, #dc2626)'
                          : 'var(--ui-warning, #d97706)'
                      "
                    >
                      {{ row.quantity | number }}
                    </span>
                    /
                    <span style="opacity: 0.55">
                      {{ row.minStock | number }}
                    </span>
                  </ng-template>
                </ui-template-column>
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-part>
                  <div class="detail-header">
                    <ui-icon [svg]="icons.triangleAlert" [size]="28" />
                    <div>
                      <h3 class="detail-name">{{ part.name }}</h3>
                      <p class="detail-sub">
                        {{ part.sku }} · {{ part.supplier }}
                      </p>
                    </div>
                  </div>
                  <dl class="detail-grid">
                    <dt>Current Qty</dt>
                    <dd>{{ part.quantity | number }}</dd>
                    <dt>Min Stock</dt>
                    <dd>{{ part.minStock | number }}</dd>
                    <dt>Deficit</dt>
                    <dd
                      style="font-weight: 700; color: var(--ui-danger, #dc2626)"
                    >
                      {{ part.minStock - part.quantity | number }} units
                    </dd>
                    <dt>Supplier</dt>
                    <dd>{{ part.supplier }}</dd>
                    <dt>Location</dt>
                    <dd>
                      <span class="pick-step-loc">{{ part.location }}</span>
                    </dd>
                  </dl>
                  <div style="margin-top: 1rem; display: flex; gap: 0.5rem">
                    <ui-button variant="filled" size="sm">
                      Create Purchase Order
                    </ui-button>
                    <ui-button variant="ghost" size="sm">
                      Dismiss Alert
                    </ui-button>
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Pick Queue ─── -->
        @if (node.id === "pick-queue") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.clipboardList" [size]="24" />
                <h2>Pick Queue</h2>
                <ui-badge
                  variant="count"
                  [count]="pendingOrders"
                  color="warning"
                />
              </div>
              <div class="page-actions">
                <ui-button variant="filled" size="sm"> Auto-Assign </ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="pickQueueDs"
                title="Queue"
                [showFilter]="true"
                placeholder="Select an order to begin picking"
              >
                <ui-template-column key="orderNumber" headerText="Order">
                  <ng-template let-row>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                      "
                    >
                      <ui-icon [svg]="icons.clipboardList" [size]="14" />
                      <span style="font-weight: 600">
                        {{ row.orderNumber }}
                      </span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="customer" headerText="Customer" />
                <ui-template-column key="priority" headerText="Priority">
                  <ng-template let-row>
                    <ui-chip [color]="getPriorityColor(row.priority)">
                      {{ row.priority }}
                    </ui-chip>
                  </ng-template>
                </ui-template-column>
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-order>
                  <div class="detail-header">
                    <ui-icon [svg]="icons.package" [size]="28" />
                    <div>
                      <h3 class="detail-name">{{ order.orderNumber }}</h3>
                      <p class="detail-sub">
                        {{ order.customer }} · {{ order.created }}
                      </p>
                    </div>
                    <div style="margin-left: auto; display: flex; gap: 0.5rem">
                      <ui-chip [color]="getPriorityColor(order.priority)">
                        {{ order.priority }}
                      </ui-chip>
                      <ui-chip [color]="getOrderStatusColor(order.status)">
                        {{ order.status }}
                      </ui-chip>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="Order Details" [icon]="icons.clipboardList">
                      <dl class="detail-grid" style="padding-top: 0.75rem">
                        <dt>Customer</dt>
                        <dd>{{ order.customer }}</dd>
                        <dt>Items</dt>
                        <dd>{{ order.items }}</dd>
                        <dt>Total Value</dt>
                        <dd>{{ fmtCurrency(order.totalValue) }}</dd>
                        <dt>Assignee</dt>
                        <dd>{{ order.assignee }}</dd>
                        <dt>Created</dt>
                        <dd>{{ order.created }}</dd>
                      </dl>
                    </ui-tab>
                    <ui-tab label="Pick Sequence" [icon]="icons.listOrdered">
                      <div style="padding-top: 0.5rem">
                        @for (
                          step of pickSteps;
                          track step.seq;
                          let i = $index
                        ) {
                          <div class="pick-step">
                            <span class="pick-step-num">{{ step.seq }}</span>
                            <span class="pick-step-loc">
                              {{ step.location }}
                            </span>
                            <div class="pick-step-info">
                              <span style="font-weight: 600">
                                {{ step.part }}
                              </span>
                              <span style="opacity: 0.55; margin-left: 0.5rem">
                                × {{ step.qty }}
                              </span>
                            </div>
                            <ui-chip color="neutral">{{ step.status }}</ui-chip>
                          </div>
                        }
                      </div>
                    </ui-tab>
                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.scan" ariaLabel="Scan">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.5rem">
                          Scan items as you pick them:
                        </p>
                        <div style="display: flex; gap: 0.5rem">
                          <ui-button variant="filled" size="sm">
                            Start Picking
                          </ui-button>
                          <ui-button variant="outlined" size="sm">
                            Print Pick List
                          </ui-button>
                        </div>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Active Picks ─── -->
        @if (node.id === "active-picks") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.listChecks" [size]="24" />
                <h2>Active Picks</h2>
                <ui-badge
                  variant="count"
                  [count]="activePickOrders.length"
                  color="primary"
                />
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="activePicksDs"
                title="In Progress"
                placeholder="Select a pick to view progress"
              >
                <ui-text-column key="orderNumber" headerText="Order" />
                <ui-text-column key="assignee" headerText="Picker" />
                <ui-text-column key="items" headerText="Items" />
                <ui-template-column key="priority" headerText="Priority">
                  <ng-template let-row>
                    <ui-chip [color]="getPriorityColor(row.priority)">
                      {{ row.priority }}
                    </ui-chip>
                  </ng-template>
                </ui-template-column>

                <ng-template #detail let-order>
                  <div class="detail-header">
                    <ui-avatar [name]="order.assignee" size="md" />
                    <div>
                      <h3 class="detail-name">
                        {{ order.orderNumber }}
                      </h3>
                      <p class="detail-sub">Assigned to {{ order.assignee }}</p>
                    </div>
                  </div>
                  <div class="stock-bar" style="margin-bottom: 0.75rem">
                    <span class="stock-bar-label">Progress</span>
                    <ui-progress
                      [value]="65"
                      ariaLabel="Pick progress"
                      style="flex: 1"
                    />
                    <span style="font-weight: 700; font-size: 0.88rem">
                      65%
                    </span>
                  </div>
                  <dl class="detail-grid">
                    <dt>Customer</dt>
                    <dd>{{ order.customer }}</dd>
                    <dt>Items</dt>
                    <dd>{{ order.items }}</dd>
                    <dt>Priority</dt>
                    <dd>
                      <ui-chip [color]="getPriorityColor(order.priority)">
                        {{ order.priority }}
                      </ui-chip>
                    </dd>
                    <dt>Started</dt>
                    <dd>{{ order.created }}</dd>
                  </dl>
                  <div style="margin-top: 1rem; display: flex; gap: 0.5rem">
                    <ui-button variant="filled" size="sm">
                      Mark Complete
                    </ui-button>
                    <ui-button variant="outlined" size="sm">
                      Reassign
                    </ui-button>
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Shipments ─── -->
        @if (node.id === "shipments") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.truck" [size]="24" />
                <h2>Shipments</h2>
                <ui-badge
                  variant="count"
                  [count]="allShipments.length"
                  color="primary"
                />
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="shipmentsDs"
                title="Shipments"
                [showFilter]="true"
                placeholder="Select a shipment to track"
              >
                <ui-template-column
                  key="trackingNumber"
                  headerText="Tracking #"
                >
                  <ng-template let-row>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                      "
                    >
                      <ui-icon [svg]="icons.truck" [size]="14" />
                      <span style="font-family: monospace; font-weight: 600">
                        {{ row.trackingNumber }}
                      </span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="carrier" headerText="Carrier" />
                <ui-text-column key="destination" headerText="Destination" />
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-ship>
                  <div class="detail-header">
                    <ui-icon [svg]="icons.truck" [size]="28" />
                    <div>
                      <h3 class="detail-name">{{ ship.trackingNumber }}</h3>
                      <p class="detail-sub">
                        {{ ship.carrier }} · {{ ship.destination }}
                      </p>
                    </div>
                    <div style="margin-left: auto">
                      <ui-chip [color]="getShipmentStatusColor(ship.status)">
                        {{ ship.status }}
                      </ui-chip>
                    </div>
                  </div>
                  <dl class="detail-grid">
                    <dt>Tracking</dt>
                    <dd style="font-family: monospace">
                      {{ ship.trackingNumber }}
                    </dd>
                    <dt>Carrier</dt>
                    <dd>{{ ship.carrier }}</dd>
                    <dt>Destination</dt>
                    <dd>{{ ship.destination }}</dd>
                    <dt>Parcels</dt>
                    <dd>{{ ship.parcels }}</dd>
                    <dt>Weight</dt>
                    <dd>{{ ship.weight }}</dd>
                    <dt>ETA</dt>
                    <dd>{{ ship.estimatedDelivery }}</dd>
                  </dl>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Warehouse Zones ─── -->
        @if (node.id === "zones") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.layers" [size]="24" />
              <h2>Warehouse Zones</h2>
              <ui-badge
                variant="count"
                [count]="allZones.length"
                color="primary"
              />
            </div>
          </div>

          <div class="zone-grid">
            @for (zone of allZones; track zone.id) {
              <ui-card variant="outlined">
                <ui-card-body>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <span style="font-weight: 700">{{ zone.name }}</span>
                    <ui-chip [color]="getZoneTypeColor(zone.type)">
                      {{ zone.type }}
                    </ui-chip>
                  </div>
                  <div class="zone-bar">
                    <ui-progress
                      [value]="zone.utilization"
                      [ariaLabel]="zone.name + ' utilization'"
                      style="flex: 1"
                    />
                    <span class="zone-bar-pct">{{ zone.utilization }}%</span>
                  </div>
                  <div class="zone-meta">
                    <span class="zone-meta-item">
                      <ui-icon [svg]="icons.shelvingUnit" [size]="14" />
                      {{ zone.racks }} racks
                    </span>
                    <span class="zone-meta-item">
                      <ui-icon [svg]="icons.boxes" [size]="14" />
                      {{ zone.capacity | number }} capacity
                    </span>
                  </div>
                  <div
                    class="zone-meta"
                    style="opacity: 0.55; font-size: 0.78rem"
                  >
                    {{ zone.temperature }}
                  </div>
                </ui-card-body>
                <ui-card-footer>
                  <div style="display: flex; gap: 0.5rem">
                    <ui-button variant="ghost" size="sm">
                      View Racks
                    </ui-button>
                    <ui-button variant="ghost" size="sm"> Zone Map </ui-button>
                  </div>
                </ui-card-footer>
              </ui-card>
            }
          </div>
        }

        <!-- ─── Suppliers ─── -->
        @if (node.id === "suppliers") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.factory" [size]="24" />
                <h2>Suppliers</h2>
                <ui-badge
                  variant="count"
                  [count]="allSuppliers.length"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-button variant="outlined" size="sm">
                  Add Supplier
                </ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="suppliersDs"
                title="Suppliers"
                [showFilter]="true"
                placeholder="Select a supplier to view details"
              >
                <ui-template-column key="name" headerText="Supplier">
                  <ng-template let-row>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                      "
                    >
                      <ui-avatar [name]="row.name" size="sm" />
                      <span style="font-weight: 600">{{ row.name }}</span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="leadTime" headerText="Lead Time" />
                <ui-text-column key="activeOrders" headerText="Active Orders" />

                <ng-template #detail let-sup>
                  <div class="detail-header">
                    <ui-avatar [name]="sup.name" size="lg" />
                    <div>
                      <h3 class="detail-name">{{ sup.name }}</h3>
                      <p class="detail-sub">
                        {{ sup.contact }} · {{ sup.email }}
                      </p>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="Overview" [icon]="icons.factory">
                      <dl class="detail-grid" style="padding-top: 0.75rem">
                        <dt>Contact</dt>
                        <dd>{{ sup.contact }}</dd>
                        <dt>Email</dt>
                        <dd>{{ sup.email }}</dd>
                        <dt>Lead Time</dt>
                        <dd>{{ sup.leadTime }}</dd>
                        <dt>Rating</dt>
                        <dd>{{ sup.rating }} / 5.0</dd>
                        <dt>Active Orders</dt>
                        <dd>{{ sup.activeOrders }}</dd>
                        <dt>Total Parts</dt>
                        <dd>{{ sup.totalParts }}</dd>
                      </dl>
                      <div class="stock-bar" style="margin-top: 0.75rem">
                        <span class="stock-bar-label">Rating</span>
                        <ui-progress
                          [value]="(sup.rating / 5) * 100"
                          ariaLabel="Supplier rating"
                          style="flex: 1"
                        />
                        <span style="font-weight: 700; font-size: 0.88rem">
                          {{ sup.rating }}
                        </span>
                      </div>
                    </ui-tab>
                    <ui-tab label="Parts" [icon]="icons.cpu">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.5rem">
                          {{ sup.totalParts }} parts sourced from this supplier.
                        </p>
                        <div class="category-strip">
                          @for (
                            prt of getSupplierParts(sup.name);
                            track prt.id
                          ) {
                            <ui-chip color="neutral">
                              {{ prt.sku }}
                            </ui-chip>
                          }
                        </div>
                      </div>
                    </ui-tab>
                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.dollarSign" ariaLabel="Pricing">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.5rem">
                          Pricing information and purchase history.
                        </p>
                        <ui-button variant="outlined" size="sm">
                          View Price Sheet
                        </ui-button>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Settings ─── -->
        @if (node.id === "settings") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.settings" [size]="24" />
                <h2>Settings</h2>
              </div>
            </div>

            <ui-tab-group>
              <ui-tab label="Warehouse" [icon]="icons.warehouse">
                <div style="padding-top: 0.75rem">
                  <ui-accordion mode="single">
                    <ui-accordion-item label="General" [expanded]="true">
                      <div class="settings-grid">
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">Warehouse Name</div>
                            <div class="setting-desc">
                              Displayed in reports and shipment labels.
                            </div>
                          </div>
                          <ui-input
                            ariaLabel="Warehouse name"
                            placeholder="PartVault Central"
                          />
                        </div>
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">Default Currency</div>
                            <div class="setting-desc">
                              Currency for pricing and reports.
                            </div>
                          </div>
                          <ui-select
                            [options]="currencyOptions"
                            ariaLabel="Currency"
                          />
                        </div>
                      </div>
                    </ui-accordion-item>
                    <ui-accordion-item label="Stock Thresholds">
                      <div class="settings-grid">
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">
                              Auto-Reorder on Low Stock
                            </div>
                            <div class="setting-desc">
                              Automatically create POs when stock drops below
                              minimum.
                            </div>
                          </div>
                          <ui-toggle [value]="false" ariaLabel="Auto reorder" />
                        </div>
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">
                              Low Stock Email Alerts
                            </div>
                            <div class="setting-desc">
                              Send daily digest of low-stock items.
                            </div>
                          </div>
                          <ui-toggle
                            [value]="true"
                            ariaLabel="Low stock email alerts"
                          />
                        </div>
                      </div>
                    </ui-accordion-item>
                  </ui-accordion>
                </div>
              </ui-tab>
              <ui-tab label="Scanning" [icon]="icons.scanBarcode">
                <div style="padding-top: 0.75rem">
                  <div class="settings-grid">
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Barcode Format</div>
                        <div class="setting-desc">
                          Default format for label printing.
                        </div>
                      </div>
                      <ui-select
                        [options]="barcodeFormatOptions"
                        ariaLabel="Barcode format"
                      />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Auto-Confirm on Scan</div>
                        <div class="setting-desc">
                          Automatically mark items as picked after scanning.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="true"
                        ariaLabel="Auto confirm on scan"
                      />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Scanner Sound</div>
                        <div class="setting-desc">
                          Play an audible tone on successful scan.
                        </div>
                      </div>
                      <ui-toggle [value]="true" ariaLabel="Scanner sound" />
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab label="Notifications" [icon]="icons.bell">
                <div style="padding-top: 0.75rem">
                  <div class="settings-grid">
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">New Order Alerts</div>
                        <div class="setting-desc">
                          Notify when new pick orders arrive.
                        </div>
                      </div>
                      <ui-toggle [value]="true" ariaLabel="New order alerts" />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Shipment Updates</div>
                        <div class="setting-desc">
                          Track carrier status changes in real time.
                        </div>
                      </div>
                      <ui-toggle [value]="true" ariaLabel="Shipment updates" />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">
                          Supplier Lead Time Warnings
                        </div>
                        <div class="setting-desc">
                          Alert when estimated delivery exceeds threshold.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="false"
                        ariaLabel="Lead time warnings"
                      />
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab-spacer />
              <ui-tab [icon]="icons.wrench" ariaLabel="Maintenance">
                <div style="padding-top: 0.75rem">
                  <ui-card variant="outlined">
                    <ui-card-header>
                      <span
                        style="
                          font-weight: 700;
                          color: var(--ui-danger, #dc2626);
                        "
                      >
                        Danger Zone
                      </span>
                    </ui-card-header>
                    <ui-card-body>
                      <p
                        style="
                          margin: 0 0 1rem;
                          font-size: 0.88rem;
                          line-height: 1.5;
                        "
                      >
                        These actions are destructive and cannot be undone.
                      </p>
                      <div style="display: flex; gap: 0.5rem">
                        <ui-button variant="outlined" size="sm">
                          Export Full Inventory
                        </ui-button>
                        <ui-button variant="outlined" size="sm">
                          Reset All Zones
                        </ui-button>
                        <ui-button variant="outlined" size="sm">
                          Purge Cancelled Orders
                        </ui-button>
                      </div>
                    </ui-card-body>
                  </ui-card>
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }
      </ng-template>
    </ui-navigation-page>
  `,
})
class WarehouseManagementAppDemo {
  protected readonly icons = ICONS;
  protected readonly nav = NAV;
  protected readonly activePage = signal("dashboard");
  protected readonly selectedCategory = signal("All");

  protected readonly allParts = PARTS;
  protected readonly allOrders = PICK_ORDERS;
  protected readonly allShipments = SHIPMENTS;
  protected readonly allZones = ZONES;
  protected readonly allSuppliers = SUPPLIERS;

  protected readonly lowStockParts = PARTS.filter(
    (p) => p.status === "low-stock" || p.status === "out-of-stock",
  );
  protected readonly activePickOrders = PICK_ORDERS.filter(
    (o) => o.status === "picking",
  );

  protected readonly totalSKUs = PARTS.filter(
    (p) => p.status !== "discontinued",
  ).length;
  protected readonly pendingOrders = PICK_ORDERS.filter(
    (o) => o.status === "pending",
  ).length;
  protected readonly lowStockCount = PARTS.filter(
    (p) => p.status === "low-stock" || p.status === "out-of-stock",
  ).length;
  protected readonly inTransitCount = SHIPMENTS.filter(
    (s) => s.status === "in-transit",
  ).length;

  protected readonly partCategories = [
    "All",
    ...new Set(PARTS.map((p) => p.category)),
  ];

  protected readonly partsDs = new FilterableArrayDatasource(PARTS);
  protected readonly pickQueueDs = new FilterableArrayDatasource(
    PICK_ORDERS.filter((o) => o.status === "pending" || o.status === "picking"),
  );
  protected readonly activePicksDs = new FilterableArrayDatasource(
    PICK_ORDERS.filter((o) => o.status === "picking"),
  );
  protected readonly shipmentsDs = new FilterableArrayDatasource(SHIPMENTS);
  protected readonly lowStockDs = new FilterableArrayDatasource(
    PARTS.filter(
      (p) => p.status === "low-stock" || p.status === "out-of-stock",
    ),
  );
  protected readonly recentOrdersDs = new FilterableArrayDatasource(
    PICK_ORDERS.slice(0, 5),
  );
  protected readonly suppliersDs = new FilterableArrayDatasource(SUPPLIERS);

  protected readonly pickSteps = [
    {
      seq: 1,
      location: "A-01-03",
      part: "10K Ohm Resistor (0805)",
      qty: 500,
      status: "picked",
    },
    {
      seq: 2,
      location: "A-02-07",
      part: "100µF Electrolytic Capacitor",
      qty: 200,
      status: "picked",
    },
    {
      seq: 3,
      location: "B-04-12",
      part: "ATmega328P Microcontroller",
      qty: 50,
      status: "next",
    },
    {
      seq: 4,
      location: "C-01-09",
      part: "USB-C Female Connector",
      qty: 100,
      status: "pending",
    },
    {
      seq: 5,
      location: "A-03-01",
      part: "Red LED 5mm (620nm)",
      qty: 300,
      status: "pending",
    },
  ];

  protected readonly supplierOptions = SUPPLIERS.map((s) => ({
    label: s.name,
    value: s.name,
  }));

  protected readonly locationOptions = [
    { label: "Zone A — SMD Components", value: "A" },
    { label: "Zone B — ICs & Modules", value: "B" },
    { label: "Zone C — Connectors & Relays", value: "C" },
    { label: "Zone D — PCBs & Assemblies", value: "D" },
    { label: "Receiving Dock", value: "R" },
  ];

  protected readonly conditionOptions = [
    { label: "New — Factory Sealed", value: "new" },
    { label: "Inspected — Passed", value: "inspected" },
    { label: "Damaged — Partial", value: "damaged" },
    { label: "Rejected — Return to Supplier", value: "rejected" },
  ];

  protected readonly currencyOptions = [
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "JPY (¥)", value: "JPY" },
  ];

  protected readonly barcodeFormatOptions = [
    { label: "Code 128", value: "code128" },
    { label: "QR Code", value: "qr" },
    { label: "EAN-13", value: "ean13" },
    { label: "Data Matrix", value: "datamatrix" },
  ];

  protected getPartStatusColor(
    status: string,
  ): "success" | "warning" | "danger" | "neutral" {
    return partStatusColor(status);
  }

  protected getOrderStatusColor(
    status: string,
  ): "success" | "warning" | "danger" | "neutral" | "primary" {
    return orderStatusColor(status);
  }

  protected getPriorityColor(
    priority: string,
  ): "danger" | "warning" | "success" | "neutral" {
    return priorityColor(priority);
  }

  protected getShipmentStatusColor(
    status: string,
  ): "success" | "warning" | "danger" | "neutral" | "primary" {
    return shipmentStatusColor(status);
  }

  protected getZoneTypeColor(
    type: string,
  ): "success" | "warning" | "neutral" | "primary" {
    return zoneTypeColor(type);
  }

  protected fmtCurrency(n: number): string {
    return formatCurrency(n);
  }

  protected fmtQty(n: number): string {
    return formatQty(n);
  }

  protected getSupplierParts(supplierName: string): Part[] {
    return PARTS.filter((p) => p.supplier === supplierName);
  }
}

// ── Story meta ───────────────────────────────────────────────────────

const meta: Meta = {
  title: "@theredhead/Showcases/Warehouse Management App",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      description: {
        component:
          "A fictional **Electronics Parts Warehouse** management system " +
          "showcasing many components composed together. Features a navigation " +
          "page with sidebar, inventory management with barcode scanning, " +
          "order picking workflows, shipment tracking, warehouse zone " +
          "utilization cards, supplier profiles, and warehouse settings — " +
          "all driven by in-memory data.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [WarehouseManagementAppDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * A fully interactive electronics warehouse management application.
 * Navigate the sidebar to explore:
 *
 * - **Dashboard** — KPI stats, recent orders master-detail, zone utilization bars
 * - **Parts Catalog** — filterable master-detail with stock level progress bars and barcode actions
 * - **Receive Stock** — form with supplier selects, SKU input, condition checks
 * - **Low Stock Alerts** — master-detail with deficit calculations and reorder actions
 * - **Pick Queue** — master-detail with pick sequence steps and priority chips
 * - **Active Picks** — in-progress orders with progress bar and reassignment
 * - **Shipments** — master-detail with carrier tracking and status badges
 * - **Warehouse Zones** — card grid with utilization progress bars and zone metadata
 * - **Suppliers** — master-detail with rating bars, tabbed profiles, and sourced-parts chips
 * - **Settings** — accordion warehouse config, scanning toggles, notification preferences, danger zone
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-warehouse-app />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="PartVault WMS">
  <ng-template #content let-node>
    @if (node.id === 'dashboard') {
      <div class="stats-grid">
        <ui-card variant="outlined">
          <ui-card-body>
            <ui-icon [svg]="icons.boxes" [size]="18" />
            <span class="stat-label">Total Parts</span>
            <div class="stat-value">11</div>
            <ui-progress [value]="100" ariaLabel="Total parts" />
          </ui-card-body>
        </ui-card>
        <!-- More stat cards... -->
      </div>
    }
    @if (node.id === 'parts') {
      <ui-master-detail-view [datasource]="partsDs" title="Parts" [showFilter]="true">
        <ui-template-column key="sku" headerText="SKU">
          <ng-template let-row>
            <ui-icon [svg]="icons.barcode" [size]="14" />
            {{ row.sku }}
          </ng-template>
        </ui-template-column>
        <ui-badge-column key="status" headerText="Status" />

        <ng-template #detail let-part>
          <ui-tab-group panelStyle="flat">
            <ui-tab label="Details" [icon]="icons.cpu">
              <!-- Part details: SKU, location, quantity, price -->
            </ui-tab>
            <ui-tab label="Stock Level" [icon]="icons.trendingUp">
              <!-- Progress bars for current vs minimum stock -->
            </ui-tab>
          </ui-tab-group>
        </ng-template>
      </ui-master-detail-view>
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage, navItem, navGroup, type NavigationNode,
  UIMasterDetailView,
} from '@theredhead/ui-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab,
  UIChip, UIBadgeColumn, UITemplateColumn, UIIcon, UIIcons,
  UIProgress, UICard, UICardBody, UIButton,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    UINavigationPage, UIMasterDetailView,
    UITabGroup, UITab, UIChip, UIBadgeColumn, UITemplateColumn,
    UIIcon, UIProgress, UICard, UICardBody, UIButton,
  ],
  templateUrl: './warehouse.component.html',
})
export class WarehouseComponent {
  protected readonly activePage = signal('dashboard');
  protected readonly partsDs = new FilterableArrayDatasource(PARTS);
  protected readonly icons = {
    warehouse: UIIcons.Lucide.Buildings.Warehouse,
    boxes: UIIcons.Lucide.Development.Boxes,
    cpu: UIIcons.Lucide.Devices.Cpu,
    barcode: UIIcons.Lucide.Shopping.Barcode,
    truck: UIIcons.Lucide.Transportation.Truck,
    trendingUp: UIIcons.Lucide.Arrows.TrendingUp,
  };
  protected readonly nav: NavigationNode[] = [
    navItem('dashboard', 'Dashboard', { icon: UIIcons.Lucide.Buildings.Warehouse }),
    navGroup('inventory', 'Inventory', [
      navItem('parts', 'Parts Catalog', { icon: UIIcons.Lucide.Devices.Cpu }),
      navItem('receive', 'Receive Stock', { icon: UIIcons.Lucide.Development.PackageOpen }),
    ], { icon: UIIcons.Lucide.Development.Boxes }),
    navItem('shipments', 'Shipments', { icon: UIIcons.Lucide.Transportation.Truck }),
  ];
}
`,
      },
    },
  },
};
