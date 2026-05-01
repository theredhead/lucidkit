import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { WarehouseManagementAppStorySource } from "./warehouse-management-app.story";

const meta: Meta = {
  title: "@theredhead/Showcases/Warehouse Management App",
  component: WarehouseManagementAppStorySource,
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
      imports: [WarehouseManagementAppStorySource],
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
    template: `<ui-warehouse-management-app-story-source />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="PartVault WMS" storageKey="storybook-nav-warehouse">
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
} from '@theredhead/lucid-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab,
  UIChip, UIBadgeColumn, UITemplateColumn, UIIcon, UIIcons,
  UIProgress, UICard, UICardBody, UIButton,
} from '@theredhead/lucid-kit';

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
