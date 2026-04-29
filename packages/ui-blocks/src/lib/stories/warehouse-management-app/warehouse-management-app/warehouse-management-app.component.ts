import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import warehouseData from "./warehouse-management-app.data.json";

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
  UIDropdownList,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/lucid-kit";

import { UIMasterDetailView } from "../../../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "../../../navigation-page/navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "../../../navigation-page/navigation-page.utils";
import { UIWarehouseDetailHeader } from "./warehouse-detail-header.component";
import { UIWarehousePageHeader } from "./warehouse-page-header.component";
import { UIWarehouseProgressRow } from "./warehouse-progress-row.component";
import { UIWarehouseStatCard } from "./warehouse-stat-card.component";

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

// ── External data ───────────────────────────────────────────────────

const PARTS = warehouseData.parts as Part[];
const PICK_ORDERS = warehouseData.pickOrders as PickOrder[];
const SHIPMENTS = warehouseData.shipments as Shipment[];
const ZONES = warehouseData.zones as Zone[];
const SUPPLIERS = warehouseData.suppliers as Supplier[];

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
    UIWarehouseDetailHeader,
    UIWarehousePageHeader,
    UIWarehouseProgressRow,
    UIWarehouseStatCard,
    UINavigationPage,
    UIMasterDetailView,
    UITabGroup,
    UITab,
    UITabSeparator,
    UITabSpacer,
    UIButton,
    UIIcon,
    UIInput,
    UIDropdownList,
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
  templateUrl: "./warehouse-management-app.component.html",
  styleUrl: "./warehouse-management-app.component.scss",
})
export class WarehouseManagementAppDemo {
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
