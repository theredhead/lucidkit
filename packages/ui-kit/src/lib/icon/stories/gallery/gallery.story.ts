import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UIIcon } from "../../icon.component";
import { UIIcons, type LucideCategory } from "../../lucide-icons.generated";

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
  templateUrl: "./gallery.story.html",
})
export class StoryIconGallery {
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
