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
  parameters: {
    docs: {
      description: {
        component:
          "Renders an inline SVG icon from a raw SVG string. The library ships " +
          "a categorised icon registry (`UIIcons.Lucide`) generated from the " +
          "[Lucide](https://lucide.dev) icon set, but you can also create and use " +
          "**your own custom icons**.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [StoryIconGallery],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIIcon>;

/**
 * A single icon with Storybook controls for `size` and `ariaLabel`.
 * The default SVG is the Bold icon from the Text category.
 */
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
  parameters: {
    docs: {
      description: {
        story:
          "> **Lucide Icons** — Created by [Cole Bemis](https://github.com/colebemis) " +
          "as a fork of [Feather Icons](https://feathericons.com), now maintained by " +
          "[Eric Fennis](https://github.com/ericfennis) and the " +
          "[Lucide community](https://github.com/lucide-icons/lucide). " +
          "Licensed under the [ISC Licence](https://github.com/lucide-icons/lucide/blob/main/LICENSE).\n\n" +
          "### Features\n" +
          "- **Tree-shakeable** — only referenced icons end up in the bundle\n" +
          "- **Scalable** — `size` input controls width & height in pixels\n" +
          "- **Accessible** — optional `ariaLabel`; icons are `aria-hidden` by default\n" +
          "- **Categorised** — `UIIcons.Lucide.Text.*`, `UIIcons.Lucide.Navigation.*`, etc.\n" +
          "- **Extensible** — supply any SVG inner markup string as a custom icon\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `svg` | `string` | *(required)* | Raw SVG inner markup (paths, circles, etc.) |\n" +
          "| `size` | `number` | `24` | Icon dimensions in px |\n" +
          "| `ariaLabel` | `string` | `''` | Accessible label (sets `aria-hidden=\"false\"`) |\n\n" +
          "### Using built-in icons\n" +
          "```ts\n" +
          "import { UIIcon, UIIcons } from '@theredhead/ui-kit';\n" +
          "```\n" +
          "```html\n" +
          '<ui-icon [svg]="UIIcons.Lucide.Text.Bold" [size]="20" />\n' +
          "```\n\n" +
          "### Using custom icons\n" +
          "The `svg` input accepts any string of SVG inner markup. The component " +
          'wraps it in a `<svg>` element with `viewBox="0 0 24 24"` and stroke-based ' +
          "rendering. Design your custom icons on a 24 × 24 grid.\n" +
          "```ts\n" +
          "const MyIcons = {\n" +
          '  Diamond: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59..." />`,\n' +
          "};\n" +
          "```\n" +
          "```html\n" +
          '<ui-icon [svg]="MyIcons.Diamond" />\n' +
          "```\n\n" +
          "See the **Custom Icons** story for a full working example.",
      },
      source: {
        code: [
          "// ── HTML ──",
          '<ui-icon [svg]="boldIcon" [size]="24" ariaLabel="Bold" />',
          "",
          "// ── TypeScript ──",
          "import { UIIcon, UIIcons } from '@theredhead/ui-kit';",
          "",
          "@Component({",
          "  imports: [UIIcon],",
          '  template: `<ui-icon [svg]="boldIcon" [size]="24" ariaLabel="Bold" />`,',
          "})",
          "export class MyComponent {",
          "  readonly boldIcon = UIIcons.Lucide.Text.Bold;",
          "}",
          "",
          "// ── SCSS ──",
          "// No custom styles needed — UIIcon inherits the parent's color.",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * All available size presets rendered side-by-side (12, 16, 20, 24,
 * 32, 48 px). Demonstrates how the `size` input scales the SVG
 * viewport proportionally.
 */
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
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          '<ui-icon [svg]="icon" [size]="12" />',
          '<ui-icon [svg]="icon" [size]="16" />',
          '<ui-icon [svg]="icon" [size]="20" />',
          '<ui-icon [svg]="icon" [size]="24" />',
          '<ui-icon [svg]="icon" [size]="32" />',
          '<ui-icon [svg]="icon" [size]="48" />',
          "",
          "// ── TypeScript ──",
          "import { UIIcon, UIIcons } from '@theredhead/ui-kit';",
          "",
          "@Component({",
          "  imports: [UIIcon],",
          "  template: `",
          '    <ui-icon [svg]="icon" [size]="12" />',
          '    <ui-icon [svg]="icon" [size]="24" />',
          '    <ui-icon [svg]="icon" [size]="48" />',
          "  `,",
          "})",
          "export class MyComponent {",
          "  readonly icon = UIIcons.Lucide.Text.Bold;",
          "}",
          "",
          "// ── SCSS ──",
          "// No custom styles needed — the size input controls the icon dimensions.",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * The text-editing icons used in the rich-text-editor toolbar.
 * This subset lives in `UIIcons.Lucide.Text` and
 * `UIIcons.Lucide.Development`.
 */
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
  parameters: {
    docs: {
      source: {
        code: [
          "// ── HTML ──",
          '<div class="toolbar">',
          '  <ui-icon [svg]="boldIcon"   [size]="20" ariaLabel="Bold" />',
          '  <ui-icon [svg]="italicIcon" [size]="20" ariaLabel="Italic" />',
          '  <ui-icon [svg]="codeIcon"   [size]="20" ariaLabel="Code" />',
          "</div>",
          "",
          "// ── TypeScript ──",
          "import { UIIcon, UIIcons } from '@theredhead/ui-kit';",
          "",
          "@Component({",
          "  imports: [UIIcon],",
          "  template: `",
          '    <div class="toolbar">',
          '      <ui-icon [svg]="boldIcon"   [size]="20" ariaLabel="Bold" />',
          '      <ui-icon [svg]="italicIcon" [size]="20" ariaLabel="Italic" />',
          '      <ui-icon [svg]="codeIcon"   [size]="20" ariaLabel="Code" />',
          "    </div>",
          "  `,",
          "})",
          "export class MyToolbar {",
          "  readonly boldIcon   = UIIcons.Lucide.Text.Bold;",
          "  readonly italicIcon = UIIcons.Lucide.Text.Italic;",
          "  readonly codeIcon   = UIIcons.Lucide.Development.Code;",
          "}",
          "",
          "// ── SCSS ──",
          ".toolbar {",
          "  display: flex;",
          "  gap: 8px;",
          "  align-items: center;",
          "}",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * Demonstrates how to extend the icon collection with your own custom
 * SVG icons. Any valid SVG inner markup (paths, circles, lines, etc.)
 * works — design on a 24 × 24 grid to match the built-in Lucide set.
 */
export const CustomIcons: Story = {
  render: () => ({
    props: {
      customIcons: [
        {
          name: "Diamond",
          svg: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />`,
        },
        {
          name: "Spark",
          svg: `<path d="M12 3 13.5 8.5 19 10 13.5 11.5 12 17 10.5 11.5 5 10 10.5 8.5Z" />`,
        },
        {
          name: "Crosshair",
          svg: `<circle cx="12" cy="12" r="8" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><circle cx="12" cy="12" r="2" />`,
        },
        {
          name: "Lightning",
          svg: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />`,
        },
        {
          name: "Heart (filled)",
          svg: `<path fill="currentColor" stroke="none" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />`,
          cssClass: "heart",
        },
        {
          name: "Waves",
          svg: `<path d="M2 6c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" /><path d="M2 12c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" /><path d="M2 18c1 0 2-2 4-2s3 2 4 2 2-2 4-2 3 2 4 2" />`,
        },
      ],
    },
    template: `
      <style>ui-icon.heart { color: #e74c3c; }</style>
      <div style="font-family: system-ui, sans-serif;">
        <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
          These icons are <strong>not</strong> from the built-in Lucide registry —
          they are raw SVG strings passed directly to the <code>svg</code> input.
        </p>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          @for (icon of customIcons; track icon.name) {
            <div style="text-align: center; min-width: 80px;">
              <ui-icon [svg]="icon.svg" [size]="32" [class]="icon.cssClass || ''" />
              <div style="font-size: 11px; color: #888; margin-top: 6px;">{{ icon.name }}</div>
            </div>
          }
        </div>
        <details style="margin-top: 24px; font-size: 13px; color: #555;">
          <summary style="cursor: pointer; font-weight: 600;">How it works</summary>
          <ul style="margin-top: 8px; line-height: 1.8;">
            <li>The <code>svg</code> input accepts any SVG inner markup (paths, circles, lines, etc.)</li>
            <li>The component wraps it in <code>&lt;svg viewBox="0 0 24 24"&gt;</code> with stroke rendering</li>
            <li>Design custom icons on a <strong>24 × 24 grid</strong> to match the built-in set</li>
            <li>For filled icons, add <code>fill="currentColor" stroke="none"</code> on your paths</li>
            <li>Icons inherit the parent's CSS <code>color</code> via <code>currentColor</code></li>
            <li>Group related custom icons in a <code>const</code> object for tree-shaking</li>
          </ul>
        </details>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: [
          "// ── app-icons.ts ──",
          "// Define your custom icons as raw SVG inner markup on a 24×24 grid.",
          "// The UIIcon component wraps the content in an <svg> element with",
          '// viewBox="0 0 24 24", stroke="currentColor", fill="none".',
          "",
          "export const AppIcons = {",
          "  /** A rotated square / diamond shape. */",
          '  Diamond: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59',
          "    a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41",
          '    l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />`,',
          "",
          "  /** A four-pointed star / spark. */",
          '  Spark: `<path d="M12 3 13.5 8.5 19 10 13.5 11.5 12 17',
          '    10.5 11.5 5 10 10.5 8.5Z" />`,',
          "",
          "  /**",
          "   * A filled heart — override the default stroke rendering by",
          '   * setting fill="currentColor" and stroke="none" on the path.',
          "   */",
          '  HeartFilled: `<path fill="currentColor" stroke="none"',
          '    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5',
          "    2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09",
          "    C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5",
          '    c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />`,',
          "} as const;",
          "",
          "// ── HTML ──",
          '<ui-icon [svg]="icons.Diamond" [size]="24" ariaLabel="Diamond" />',
          '<ui-icon [svg]="icons.Spark" [size]="20" />',
          '<ui-icon [svg]="icons.HeartFilled" [size]="24" ariaLabel="Favourite" />',
          "",
          "// ── TypeScript ──",
          "import { Component } from '@angular/core';",
          "import { UIIcon } from '@theredhead/ui-kit';",
          "import { AppIcons } from './app-icons';",
          "",
          "@Component({",
          "  selector: 'app-toolbar',",
          "  standalone: true,",
          "  imports: [UIIcon],",
          "  template: `",
          '    <ui-icon [svg]="icons.Diamond" [size]="24" ariaLabel="Diamond" />',
          '    <ui-icon [svg]="icons.Spark" [size]="20" />',
          '    <ui-icon [svg]="icons.HeartFilled" [size]="24" ariaLabel="Favourite" />',
          "  `,",
          "})",
          "export class AppToolbar {",
          "  protected readonly icons = AppIcons;",
          "}",
          "",
          "// ── SCSS ──",
          "/* Custom icons inherit the parent's color via currentColor. */",
          "/* Override per-icon if needed: */",
          "ui-icon.heart { color: #e74c3c; }",
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * Interactive searchable gallery of every icon in the Lucide set.
 * Filter by name or category using the controls at the top.
 * Each tile shows the icon at the current size with its registry name.
 */
export const Gallery: Story = {
  render: () => ({
    template: `<ui-icon-gallery />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- Single icon -->
<ui-icon [svg]="UIIcons.Lucide.Text.Bold" [size]="24" ariaLabel="Bold" />

<!-- Available categories: Text, Navigation, Media, Development, ... -->
<!-- Browse all icons in this interactive gallery -->`,
        language: "html",
      },
    },
  },
};
