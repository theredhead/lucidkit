import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { RecipeBookAppStorySource } from "./recipe-book-app.story";

const meta: Meta = {
  title: "@theredhead/Showcases/Recipe Book App",
  component: RecipeBookAppStorySource,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
  },
  decorators: [
    moduleMetadata({
      imports: [RecipeBookAppStorySource],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * ## Recipe Book — Full-featured showcase
 *
 * A community recipe sharing platform built with `UINavigationPage`,
 * `UIMasterDetailView`, `UITabGroup`, and `UICard`.
 *
 * ### Pages
 *
 * - **Featured Recipes** — hero banner and featured recipe cards with ratings
 * - **All Recipes** — master-detail with category chip filters, tabbed detail
 *   (Overview, Ingredients with servings adjuster, Instructions, Share)
 * - **By Category** — category cards and grouped recipe listings
 * - **By Cuisine** — cuisine stats and grouped recipe listings
 * - **Find by Ingredients** — ingredient chip picker with match-percentage results
 * - **Favorites** — master-detail view of bookmarked recipes
 * - **Submit a Recipe** — full form with inputs, selects, and checkboxes
 * - **Settings** — preferences, notifications, and danger zone
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-recipe-book-app-story-source />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="CookBook" storageKey="storybook-nav-recipe-book">
  <ng-template #content let-node>
    @if (node.id === 'featured') {
      <!-- Featured recipe hero + card grid -->
    }
    @if (node.id === 'all-recipes') {
      <ui-master-detail-view [datasource]="recipesDs" title="Recipes" [showFilter]="true">
        <ui-template-column key="title" headerText="Recipe">
          <ng-template let-row>
            <ui-icon [svg]="icons.utensils" [size]="16" /> {{ row.title }}
          </ng-template>
        </ui-template-column>
        <ui-badge-column key="difficulty" headerText="Difficulty" />

        <ng-template #detail let-recipe>
          <ui-tab-group panelStyle="flat">
            <ui-tab label="Overview" [icon]="icons.fileText">
              <!-- Description, metadata, nutrition -->
            </ui-tab>
            <ui-tab label="Ingredients" [icon]="icons.leafyGreen">
              <!-- Servings adjuster + scaled ingredient list -->
              <div class="servings-adjuster">
                <span>Servings:</span>
                <ui-button variant="ghost" (click)="decrementServings()">−</ui-button>
                <span>{{ adjustedServings() }}</span>
                <ui-button variant="ghost" (click)="incrementServings()">+</ui-button>
              </div>
              @for (ing of recipe.ingredients; track ing.name) {
                <div class="ingredient-row">
                  <span>{{ ing.name }}</span>
                  <span>{{ scaleAmount(ing.amount, recipe.servings, adjustedServings()) }} {{ ing.unit }}</span>
                </div>
              }
            </ui-tab>
            <ui-tab label="Instructions" [icon]="icons.listOrdered">
              <!-- Numbered step list -->
            </ui-tab>
          </ui-tab-group>
        </ng-template>
      </ui-master-detail-view>
    }
    @if (node.id === 'find-by-ingredients') {
      <!-- Ingredient chip picker → matched recipe cards with % -->
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal, computed } from '@angular/core';
import {
  UINavigationPage, navItem, navGroup, type NavigationNode,
  UIMasterDetailView,
} from '@theredhead/lucid-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab, UITabSpacer,
  UIChip, UIAvatar, UIBadge, UIBadgeColumn, UITemplateColumn,
  UIIcon, UIIcons, UIProgress, UICard, UICardBody, UIButton,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-recipe-book',
  standalone: true,
  imports: [
    UINavigationPage, UIMasterDetailView,
    UITabGroup, UITab, UITabSpacer,
    UIChip, UIAvatar, UIBadge, UIBadgeColumn, UITemplateColumn,
    UIIcon, UIProgress, UICard, UICardBody, UIButton,
  ],
  templateUrl: './recipe-book.component.html',
})
export class RecipeBookComponent {
  protected readonly activePage = signal('featured');
  protected readonly adjustedServings = signal(4);
  protected readonly selectedIngredients = signal<string[]>([]);
  protected readonly recipesDs = new FilterableArrayDatasource(RECIPES);
  protected readonly icons = {
    utensils: UIIcons.Lucide.FoodBeverage.Utensils,
    chefHat: UIIcons.Lucide.FoodBeverage.ChefHat,
    clock: UIIcons.Lucide.Time.Clock,
    star: UIIcons.Lucide.Social.Star,
    search: UIIcons.Lucide.Social.Search,
    heart: UIIcons.Lucide.Social.Heart,
  };
  protected readonly nav: NavigationNode[] = [
    navItem('featured', 'Featured Recipes', { icon: UIIcons.Lucide.Social.Flame }),
    navItem('all-recipes', 'All Recipes', { icon: UIIcons.Lucide.FoodBeverage.Utensils }),
    navItem('find-by-ingredients', 'Find by Ingredients', { icon: UIIcons.Lucide.Social.Search }),
  ];

  protected scaleAmount(amount: number, original: number, target: number): string {
    const scaled = (amount / original) * target;
    return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(1);
  }
}

// ── SCSS ──
/* Uses component-scoped styles. Key patterns:
   - .servings-adjuster: flex row with +/- buttons for scaling
   - .ingredient-row: space-between layout for name + amount
   - .recipe-grid: auto-fill card grid
   - .ingredient-picker: wrap chips for "find by ingredients"
*/
`,
      },
    },
  },
};
