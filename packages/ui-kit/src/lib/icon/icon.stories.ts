import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";
import { UIIcon } from "./icon.component";
import { UIIcons, type LucideCategory } from "./lucide-icons.generated";

// ── helper: flatten the categorised registry for the gallery ─────────

interface IconEntry {
  name: string;
  category: string;
  svg: string;
}

function buildIconList(): IconEntry[] {
  const entries: IconEntry[] = [];
  const seen = new Set<string>();
  const cats = UIIcons.Lucide as Record<string, Record<string, string>>;

  for (const [category, icons] of Object.entries(cats)) {
    for (const [name, svg] of Object.entries(icons)) {
      const key = `${category}/${name}`;
      if (!seen.has(key)) {
        seen.add(key);
        entries.push({ name, category, svg });
      }
    }
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

const ALL_ICONS = buildIconList();
const CATEGORIES = Object.keys(UIIcons.Lucide).sort() as LucideCategory[];

// ── Gallery wrapper component ────────────────────────────────────────

@Component({
  selector: "ui-icon-gallery",
  standalone: true,
  imports: [UIIcon, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    .gallery-controls {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .gallery-controls input {
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
      min-width: 240px;
    }
    .gallery-controls select {
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }
    .gallery-stats {
      font-size: 13px;
      color: #888;
    }
    .category-section h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e5e5;
    }
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
    }
    .icon-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 4px;
      border-radius: 8px;
      cursor: default;
      transition: background-color 0.15s;
    }
    .icon-tile:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .icon-tile .icon-name {
      font-size: 10px;
      color: #666;
      text-align: center;
      word-break: break-all;
      line-height: 1.3;
    }
  `,
  template: `
    <div class="gallery-controls">
      <input
        type="text"
        placeholder="Search icons…"
        [ngModel]="query()"
        (ngModelChange)="query.set($event)"
      />
      <select
        [ngModel]="selectedCategory()"
        (ngModelChange)="selectedCategory.set($event)"
      >
        <option value="">All categories</option>
        @for (cat of categories; track cat) {
          <option [value]="cat">{{ cat }}</option>
        }
      </select>
      <span class="gallery-stats">{{ filteredIcons().length }} icons</span>
    </div>

    @for (group of groupedIcons(); track group.category) {
      <div class="category-section">
        <h3>{{ group.category }}</h3>
        <div class="icon-grid">
          @for (icon of group.icons; track icon.name) {
            <div class="icon-tile" [title]="icon.category + ' / ' + icon.name">
              <ui-icon [svg]="icon.svg" [size]="iconSize()" />
              <span class="icon-name">{{ icon.name }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
})
class StoryIconGallery {
  readonly query = signal("");
  readonly selectedCategory = signal("");
  readonly iconSize = signal(24);
  readonly categories = CATEGORIES;

  readonly filteredIcons = computed(() => {
    const q = this.query().toLowerCase();
    const cat = this.selectedCategory();
    return ALL_ICONS.filter((icon) => {
      if (cat && icon.category !== cat) return false;
      if (q && !icon.name.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  readonly groupedIcons = computed(() => {
    const icons = this.filteredIcons();
    const groups = new Map<string, IconEntry[]>();
    for (const icon of icons) {
      const list = groups.get(icon.category) ?? [];
      list.push(icon);
      groups.set(icon.category, list);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, icons]) => ({ category, icons }));
  });
}

// ── Storybook meta & stories ─────────────────────────────────────────

const meta: Meta<UIIcon> = {
  title: "@theredhead/UI Kit/Icon",
  component: UIIcon,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [StoryIconGallery],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIIcon>;

/** Single icon with controls. */
export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      svg: args.svg || UIIcons.Lucide.Text.Bold,
    },
    template: `<ui-icon [svg]="svg" [size]="size" [ariaLabel]="ariaLabel" />`,
  }),
  args: {
    size: 24,
    ariaLabel: "",
  },
};

/** All available sizes side by side. */
export const Sizes: Story = {
  render: () => ({
    props: {
      svg: UIIcons.Lucide.Text.Bold,
      sizes: [12, 16, 20, 24, 32, 48],
    },
    template: `
      <div style="display:flex; align-items:center; gap:16px;">
        @for (s of sizes; track s) {
          <div style="text-align:center">
            <ui-icon [svg]="svg" [size]="s" />
            <div style="font-size:11px;color:#888;margin-top:4px">{{ s }}px</div>
          </div>
        }
      </div>
    `,
  }),
};

/** Text-editing icons used in the rich-text editor toolbar. */
export const TextEditing: Story = {
  render: () => ({
    props: {
      icons: [
        { name: "Bold", svg: UIIcons.Lucide.Text.Bold },
        { name: "Italic", svg: UIIcons.Lucide.Text.Italic },
        { name: "Underline", svg: UIIcons.Lucide.Text.Underline },
        { name: "Strikethrough", svg: UIIcons.Lucide.Text.Strikethrough },
        { name: "Heading1", svg: UIIcons.Lucide.Text.Heading1 },
        { name: "Heading2", svg: UIIcons.Lucide.Text.Heading2 },
        { name: "Heading3", svg: UIIcons.Lucide.Text.Heading3 },
        { name: "List", svg: UIIcons.Lucide.Text.List },
        { name: "ListOrdered", svg: UIIcons.Lucide.Text.ListOrdered },
        { name: "Code", svg: UIIcons.Lucide.Development.Code },
        { name: "RemoveFormatting", svg: UIIcons.Lucide.Text.RemoveFormatting },
      ],
    },
    template: `
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        @for (icon of icons; track icon.name) {
          <div style="text-align:center; min-width:60px;">
            <ui-icon [svg]="icon.svg" [size]="20" />
            <div style="font-size:10px;color:#888;margin-top:4px">{{ icon.name }}</div>
          </div>
        }
      </div>
    `,
  }),
};

/** Browseable gallery of all icons. */
export const Gallery: Story = {
  render: () => ({
    template: `<ui-icon-gallery />`,
  }),
};
