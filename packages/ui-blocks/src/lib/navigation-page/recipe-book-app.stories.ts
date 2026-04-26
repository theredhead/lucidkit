import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	ElementRef,
	inject,
	signal,
	viewChild,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import recipeBookData from "./data/recipe-book-app.data.json";

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
	type SelectOption,
	UITabGroup,
	UITab,
	UITabSeparator,
	UITabSpacer,
	UITemplateColumn,
	UITextColumn,
	UIToggle,
} from "@theredhead/lucid-kit";

import { UIMasterDetailView } from "../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "./navigation-page.component";
import {
	navItem,
	navGroup,
	type NavigationNode,
} from "./navigation-page.utils";

// ── Domain types ─────────────────────────────────────────────────────

interface Ingredient {
	readonly name: string;
	readonly amount: number;
	readonly unit: string;
}

interface Recipe {
	readonly id: number;
	readonly title: string;
	readonly author: string;
	readonly authorAvatar: string;
	readonly category: string;
	readonly cuisine: string;
	readonly difficulty: "easy" | "medium" | "hard";
	readonly prepTime: number;
	readonly cookTime: number;
	readonly servings: number;
	readonly rating: number;
	readonly reviews: number;
	readonly calories: number;
	readonly description: string;
	readonly ingredients: readonly Ingredient[];
	readonly steps: readonly string[];
	readonly tags: readonly string[];
	readonly featured: boolean;
	readonly image: string;
	readonly created: string;
}

// ── External data ───────────────────────────────────────────────────

const RECIPES = recipeBookData.recipes as Recipe[];

const ALL_CATEGORIES = [
	"All",
	...new Set(RECIPES.map((r) => r.category)),
] as const;
const ALL_CUISINES = [...new Set(RECIPES.map((r) => r.cuisine))] as const;
const ALL_DIFFICULTIES = ["easy", "medium", "hard"] as const;

const ALL_INGREDIENTS = [
	...new Set(RECIPES.flatMap((r) => r.ingredients.map((i) => i.name))),
].sort();

const EXPANDED_FEATURED = RECIPES.filter((r) => r.featured);

// ── Icon constants ───────────────────────────────────────────────────

const ICONS = {
  chefHat: UIIcons.Lucide.FoodBeverage.ChefHat,
  cookingPot: UIIcons.Lucide.FoodBeverage.CookingPot,
  utensils: UIIcons.Lucide.FoodBeverage.Utensils,
  utensilsCrossed: UIIcons.Lucide.FoodBeverage.UtensilsCrossed,
  salad: UIIcons.Lucide.FoodBeverage.Salad,
  pizza: UIIcons.Lucide.FoodBeverage.Pizza,
  soup: UIIcons.Lucide.FoodBeverage.Soup,
  cake: UIIcons.Lucide.FoodBeverage.Cake,
  cakeSlice: UIIcons.Lucide.FoodBeverage.CakeSlice,
  egg: UIIcons.Lucide.FoodBeverage.Egg,
  wheat: UIIcons.Lucide.FoodBeverage.Wheat,
  grape: UIIcons.Lucide.FoodBeverage.Grape,
  cherry: UIIcons.Lucide.FoodBeverage.Cherry,
  beef: UIIcons.Lucide.FoodBeverage.Beef,
  ham: UIIcons.Lucide.FoodBeverage.Ham,
  coffee: UIIcons.Lucide.FoodBeverage.Coffee,
  wine: UIIcons.Lucide.FoodBeverage.Wine,
  leafyGreen: UIIcons.Lucide.FoodBeverage.LeafyGreen,
  sandwich: UIIcons.Lucide.FoodBeverage.Sandwich,
  handPlatter: UIIcons.Lucide.FoodBeverage.HandPlatter,

  clock: UIIcons.Lucide.Time.Clock,
  timer: UIIcons.Lucide.Time.Timer,
  star: UIIcons.Lucide.Social.Star,
  heart: UIIcons.Lucide.Social.Heart,
  flame: UIIcons.Lucide.Social.Flame,
  share: UIIcons.Lucide.Account.Share,
  search: UIIcons.Lucide.Social.Search,
  bookmark: UIIcons.Lucide.Account.Bookmark,
  users: UIIcons.Lucide.Account.Users,
  user: UIIcons.Lucide.Account.User,
  settings: UIIcons.Lucide.Account.Settings,
  tag: UIIcons.Lucide.Account.Tag,
  globe: UIIcons.Lucide.Navigation.Globe,
  plus: UIIcons.Lucide.Math.Plus,
  minus: UIIcons.Lucide.Math.Minus,
  trendingUp: UIIcons.Lucide.Arrows.TrendingUp,
  award: UIIcons.Lucide.Account.Award,
  listOrdered: UIIcons.Lucide.Text.ListOrdered,
  clipboardList: UIIcons.Lucide.Text.ClipboardList,
  fileText: UIIcons.Lucide.Files.FileText,
  camera: UIIcons.Lucide.Photography.Camera,
  image: UIIcons.Lucide.Photography.Image,
  triangleAlert: UIIcons.Lucide.Notifications.TriangleAlert,
  filter: UIIcons.Lucide.Text.ListFilter,
  layers: UIIcons.Lucide.Design.Layers,
  circleCheck: UIIcons.Lucide.Notifications.CircleCheck,
  bell: UIIcons.Lucide.Account.Bell,
} as const;

// ── Navigation structure ─────────────────────────────────────────────

const NAV: NavigationNode[] = [
  navItem("featured", "Featured Recipes", { icon: ICONS.flame }),
  navGroup(
    "browse-section",
    "Browse",
    [
      navItem("all-recipes", "All Recipes", {
        icon: ICONS.utensils,
        badge: String(RECIPES.length),
      }),
      navItem("by-category", "By Category", { icon: ICONS.layers }),
      navItem("by-cuisine", "By Cuisine", { icon: ICONS.globe }),
    ],
    { icon: ICONS.cookingPot, expanded: true },
  ),
  navItem("find-by-ingredients", "Find by Ingredients", {
    icon: ICONS.search,
  }),
  navGroup(
    "my-section",
    "My Kitchen",
    [
      navItem("favorites", "Favorites", {
        icon: ICONS.heart,
        badge: String(RECIPES.filter((r) => r.featured).length),
      }),
      navItem("submit", "Submit a Recipe", { icon: ICONS.plus }),
    ],
    { icon: ICONS.chefHat, expanded: true },
  ),
  navItem("settings", "Settings", { icon: ICONS.settings }),
];

// ── Helper functions ─────────────────────────────────────────────────

function difficultyColor(
  d: string,
): "success" | "warning" | "danger" | "neutral" {
  switch (d) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "danger";
    default:
      return "neutral";
  }
}

function categoryIcon(category: string): string {
  switch (category) {
    case "Main Course":
      return ICONS.utensils;
    case "Dessert":
      return ICONS.cakeSlice;
    case "Soup":
      return ICONS.soup;
    case "Salad":
      return ICONS.salad;
    case "Bread":
      return ICONS.wheat;
    case "Breakfast":
      return ICONS.egg;
    default:
      return ICONS.cookingPot;
  }
}

function formatTime(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function scaleAmount(amount: number, original: number, target: number): string {
  const scaled = (amount / original) * target;
  // Format nicely
  if (Number.isInteger(scaled)) return String(scaled);
  return scaled.toFixed(scaled < 10 ? 1 : 0);
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    "\u2605".repeat(full) + (half ? "\u00BD" : "") + "\u2606".repeat(empty)
  );
}

// ── Demo component ───────────────────────────────────────────────────

@Component({
  selector: "ui-demo-recipe-book-app",
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
  styles: [
    `
      :host {
        display: block;
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

      /* Recipe cards */
      .recipe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }

      .recipe-card-img {
        height: 140px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--ui-accent, #3584e4) 25%, transparent),
          color-mix(in srgb, var(--ui-accent, #3584e4) 8%, transparent)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px 6px 0 0;
      }

      .recipe-card-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.78rem;
        opacity: 0.65;
        margin-top: 0.5rem;
        flex-wrap: wrap;
      }
      .recipe-card-meta-item {
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }

      .recipe-rating {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.82rem;
      }
      .recipe-rating-stars {
        color: var(--ui-accent, #e6a817);
        letter-spacing: 1px;
      }

      /* Ingredient list */
      .ingredient-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .ingredient-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.45rem 0;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
        font-size: 0.88rem;
      }
      .ingredient-row:last-child {
        border-bottom: none;
      }
      .ingredient-name {
        font-weight: 500;
      }
      .ingredient-amount {
        font-family: monospace;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--ui-surface-dim, #2a313c);
        color: var(--ui-text, #1d232b);
      }

      /* Step list */
      .step-list {
        list-style: none;
        padding: 0;
        margin: 0;
        counter-reset: recipe-step;
      }
      .step-item {
        display: flex;
        gap: 1rem;
        padding: 0.65rem 0;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
        counter-increment: recipe-step;
      }
      .step-item:last-child {
        border-bottom: none;
      }
      .step-num {
        font-size: 1.25rem;
        font-weight: 800;
        opacity: 0.35;
        min-width: 2rem;
        text-align: center;
      }
      .step-text {
        flex: 1;
        font-size: 0.88rem;
        line-height: 1.5;
      }

      /* Servings adjuster */
      .servings-adjuster {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        background: var(--ui-surface-dim, #2a313c);
        color: var(--ui-text, #1d232b);
      }
      .servings-label {
        font-weight: 600;
        font-size: 0.88rem;
      }
      .servings-value {
        font-size: 1.25rem;
        font-weight: 800;
        min-width: 2rem;
        text-align: center;
      }

      /* Category / cuisine cards */
      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      .category-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: border-color 0.15s;
      }
      .category-card:hover {
        border-color: var(--ui-accent, #3584e4);
      }
      .category-count {
        font-size: 0.78rem;
        opacity: 0.65;
      }
      .category-name {
        font-weight: 600;
      }

      /* Chip strip */
      .category-strip {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      /* Search by ingredients */
      .ingredient-search-wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
      }
      .ingredient-picker {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        max-height: 240px;
        overflow-y: auto;
      }
      .match-results {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }
      .match-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .match-pct {
        font-weight: 700;
        font-size: 0.88rem;
      }
      .match-ingredients {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
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

      /* Scroll area */
      .scroll-area {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-right: 0.25rem;
      }

      /* Load more sentinel */
      .load-more-sentinel {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0;
      }

      /* Sticky top bar for featured page (matches video-sharing pattern) */
      .recipe-top-bar {
        position: sticky;
        top: -1.5rem;
        z-index: 2;
        background: var(--ui-surface, #f7f8fa);
        margin: -1.5rem -1.5rem 1rem;
        padding: 1.5rem 1.5rem 0;
      }

      /* Featured banner */
      .featured-hero {
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 1px solid
          color-mix(in srgb, var(--ui-accent, #3584e4) 24%, transparent);
        background: linear-gradient(
          135deg,
          color-mix(
            in srgb,
            var(--ui-accent, #3584e4) 38%,
            var(--ui-surface, #1f242c)
          ),
          color-mix(
            in srgb,
            var(--ui-accent, #3584e4) 18%,
            var(--ui-surface, #1f242c)
          )
        );
        color: var(--ui-text, #1d232b);
      }
      .featured-hero h3 {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
      }
      .featured-hero p {
        margin: 0;
        opacity: 0.88;
        line-height: 1.5;
      }
      .featured-hero .recipe-card-meta {
        opacity: 0.92;
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

      /* Tags row */
      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
      }

      /* Nutritional info */
      .nutrition-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      .nutrition-item {
        text-align: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: var(--ui-surface-dim, #2a313c);
        color: var(--ui-text, #1d232b);
      }
      .nutrition-value {
        font-size: 1.1rem;
        font-weight: 700;
      }
      .nutrition-label {
        font-size: 0.72rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="CookBook"
      storageKey="storybook-nav-recipe-book"
    >
      <ng-template #content let-node>
        <!-- ─── Featured Recipes ─── -->
        @if (node.id === "featured") {
          <div class="recipe-top-bar">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.flame" [size]="24" />
                <h2>Featured Recipes</h2>
              </div>
              <div class="page-actions">
                <ui-input
                  placeholder="Search recipes..."
                  ariaLabel="Search"
                  style="width: 240px"
                />
              </div>
            </div>

            <div class="featured-hero">
              <h3>{{ featuredRecipes[0].title }}</h3>
              <p>{{ featuredRecipes[0].description }}</p>
              <div class="recipe-card-meta" style="margin-top: 1rem;">
                <span class="recipe-card-meta-item">
                  <ui-icon [svg]="icons.clock" [size]="14" />
                  {{
                    formatTime(
                      featuredRecipes[0].prepTime + featuredRecipes[0].cookTime
                    )
                  }}
                </span>
                <span class="recipe-card-meta-item">
                  <ui-icon [svg]="icons.users" [size]="14" />
                  {{ featuredRecipes[0].servings }} servings
                </span>
                <span class="recipe-card-meta-item">
                  <ui-icon [svg]="icons.star" [size]="14" />
                  {{ featuredRecipes[0].rating }} ({{
                    featuredRecipes[0].reviews
                  }}
                  reviews)
                </span>
                <span>
                  <ui-badge
                    variant="label"
                    [color]="difficultyColor(featuredRecipes[0].difficulty)"
                  >
                    {{ featuredRecipes[0].difficulty }}
                  </ui-badge>
                </span>
              </div>
            </div>
          </div>

          <div class="recipe-grid">
            @for (recipe of visibleFeatured(); track recipe.id) {
              <ui-card variant="outlined">
                <div class="recipe-card-img">
                  <ui-icon [svg]="categoryIcon(recipe.category)" [size]="48" />
                </div>
                <ui-card-body>
                  <div
                    style="display: flex; justify-content: space-between; align-items: start;"
                  >
                    <div>
                      <strong>{{ recipe.title }}</strong>
                      <div class="recipe-card-meta">
                        <span class="recipe-card-meta-item">
                          <ui-icon [svg]="icons.clock" [size]="13" />
                          {{ formatTime(recipe.prepTime + recipe.cookTime) }}
                        </span>
                        <span class="recipe-card-meta-item">
                          <ui-icon [svg]="icons.users" [size]="13" />
                          {{ recipe.servings }}
                        </span>
                      </div>
                    </div>
                    <ui-badge
                      variant="label"
                      [color]="difficultyColor(recipe.difficulty)"
                    >
                      {{ recipe.difficulty }}
                    </ui-badge>
                  </div>
                  <div class="recipe-rating" style="margin-top: 0.5rem;">
                    <span class="recipe-rating-stars">{{
                      renderStars(recipe.rating)
                    }}</span>
                    <span style="opacity: 0.65; font-size: 0.78rem;"
                      >({{ recipe.reviews }})</span
                    >
                  </div>
                  <div class="tags-row">
                    @for (tag of recipe.tags.slice(0, 3); track tag) {
                      <ui-chip color="neutral" size="small">{{ tag }}</ui-chip>
                    }
                  </div>
                </ui-card-body>
                <ui-card-footer>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <ui-avatar [name]="recipe.author" [size]="24" />
                    <span style="font-size: 0.82rem;">{{ recipe.author }}</span>
                  </div>
                </ui-card-footer>
              </ui-card>
            }
          </div>
          @if (hasMoreFeatured()) {
            <div class="load-more-sentinel" #loadMoreSentinel>
              <ui-progress
                variant="circular"
                mode="indeterminate"
                ariaLabel="Loading more recipes"
              />
            </div>
          }
        }

        <!-- ─── All Recipes ─── -->
        @if (node.id === "all-recipes") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.utensils" [size]="24" />
                <h2>All Recipes</h2>
              </div>
            </div>

            <div class="category-strip">
              @for (cat of allCategories; track cat) {
                <ui-chip
                  [color]="selectedCategory() === cat ? 'primary' : 'neutral'"
                  (click)="selectedCategory.set(cat)"
                  >{{ cat }}</ui-chip
                >
              }
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="filteredRecipesDs()"
                title="Recipes"
                [showFilter]="true"
                placeholder="Select a recipe..."
              >
                <ui-template-column key="title" headerText="Recipe">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                      <ui-icon [svg]="categoryIcon(row.category)" [size]="16" />
                      {{ row.title }}
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="cuisine" headerText="Cuisine" />
                <ui-badge-column key="difficulty" headerText="Difficulty" />

                <ng-template #detail let-recipe>
                  <div class="detail-header">
                    <ui-avatar [name]="recipe.author" [size]="40" />
                    <div>
                      <h3 class="detail-name">{{ recipe.title }}</h3>
                      <p class="detail-sub">
                        by {{ recipe.author }} · {{ recipe.cuisine }} ·
                        {{ recipe.created }}
                      </p>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="Overview" [icon]="icons.fileText">
                      <p style="margin: 0.5rem 0 1rem; line-height: 1.5;">
                        {{ recipe.description }}
                      </p>

                      <div class="detail-grid">
                        <dt>Category</dt>
                        <dd>
                          <ui-badge variant="label" color="neutral">{{
                            recipe.category
                          }}</ui-badge>
                        </dd>
                        <dt>Cuisine</dt>
                        <dd>{{ recipe.cuisine }}</dd>
                        <dt>Difficulty</dt>
                        <dd>
                          <ui-badge
                            variant="label"
                            [color]="difficultyColor(recipe.difficulty)"
                            >{{ recipe.difficulty }}</ui-badge
                          >
                        </dd>
                        <dt>Prep Time</dt>
                        <dd>{{ formatTime(recipe.prepTime) }}</dd>
                        <dt>Cook Time</dt>
                        <dd>
                          {{
                            recipe.cookTime > 0
                              ? formatTime(recipe.cookTime)
                              : "None"
                          }}
                        </dd>
                        <dt>Total Time</dt>
                        <dd>
                          <strong>{{
                            formatTime(recipe.prepTime + recipe.cookTime)
                          }}</strong>
                        </dd>
                        <dt>Servings</dt>
                        <dd>{{ recipe.servings }}</dd>
                        <dt>Rating</dt>
                        <dd>
                          <span class="recipe-rating">
                            <span class="recipe-rating-stars">{{
                              renderStars(recipe.rating)
                            }}</span>
                            {{ recipe.rating }} ({{ recipe.reviews }} reviews)
                          </span>
                        </dd>
                      </div>

                      <div class="nutrition-grid">
                        <div class="nutrition-item">
                          <div class="nutrition-value">
                            {{ recipe.calories }}
                          </div>
                          <div class="nutrition-label">kcal / serving</div>
                        </div>
                        <div class="nutrition-item">
                          <div class="nutrition-value">
                            {{ recipe.ingredients.length }}
                          </div>
                          <div class="nutrition-label">ingredients</div>
                        </div>
                        <div class="nutrition-item">
                          <div class="nutrition-value">
                            {{ recipe.steps.length }}
                          </div>
                          <div class="nutrition-label">steps</div>
                        </div>
                        <div class="nutrition-item">
                          <div class="nutrition-value">
                            {{ formatTime(recipe.prepTime + recipe.cookTime) }}
                          </div>
                          <div class="nutrition-label">total time</div>
                        </div>
                      </div>

                      <div class="tags-row" style="margin-top: 1rem;">
                        @for (tag of recipe.tags; track tag) {
                          <ui-chip color="primary" size="small">{{
                            tag
                          }}</ui-chip>
                        }
                      </div>
                    </ui-tab>

                    <ui-tab label="Ingredients" [icon]="icons.leafyGreen">
                      <div class="servings-adjuster">
                        <span class="servings-label">Servings:</span>
                        <ui-button
                          variant="ghost"
                          size="small"
                          (click)="decrementServings()"
                          ariaLabel="Decrease servings"
                        >
                          <ui-icon [svg]="icons.minus" [size]="14" />
                        </ui-button>
                        <span class="servings-value">{{
                          adjustedServings()
                        }}</span>
                        <ui-button
                          variant="ghost"
                          size="small"
                          (click)="incrementServings()"
                          ariaLabel="Increase servings"
                        >
                          <ui-icon [svg]="icons.plus" [size]="14" />
                        </ui-button>
                        <ui-button
                          variant="outlined"
                          size="small"
                          (click)="resetServings(recipe)"
                          ariaLabel="Reset servings"
                        >
                          Reset
                        </ui-button>
                      </div>

                      <ul class="ingredient-list">
                        @for (ing of recipe.ingredients; track ing.name) {
                          <li class="ingredient-row">
                            <span class="ingredient-name">{{ ing.name }}</span>
                            <span class="ingredient-amount">
                              {{
                                scaleAmount(
                                  ing.amount,
                                  recipe.servings,
                                  adjustedServings()
                                )
                              }}
                              {{ ing.unit }}
                            </span>
                          </li>
                        }
                      </ul>
                    </ui-tab>

                    <ui-tab label="Instructions" [icon]="icons.listOrdered">
                      <ol class="step-list">
                        @for (step of recipe.steps; track $index) {
                          <li class="step-item">
                            <span class="step-num">{{ $index + 1 }}</span>
                            <span class="step-text">{{ step }}</span>
                          </li>
                        }
                      </ol>
                    </ui-tab>

                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.share" ariaLabel="Share">
                      <div style="padding: 1rem 0;">
                        <h4 style="margin: 0 0 1rem;">Share this recipe</h4>
                        <div style="display: flex; gap: 0.5rem;">
                          <ui-button variant="outlined">Copy Link</ui-button>
                          <ui-button variant="outlined">Print</ui-button>
                        </div>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── By Category ─── -->
        @if (node.id === "by-category") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.layers" [size]="24" />
                <h2>Browse by Category</h2>
              </div>
            </div>

            <div class="scroll-area">
              <div class="category-grid">
                @for (cat of categories; track cat) {
                  <div class="category-card">
                    <ui-icon [svg]="categoryIcon(cat)" [size]="28" />
                    <div>
                      <div class="category-name">{{ cat }}</div>
                      <div class="category-count">
                        {{ recipesInCategory(cat) }} recipes
                      </div>
                    </div>
                  </div>
                }
              </div>

              @for (cat of categories; track cat) {
                <h3 style="margin: 1.5rem 0 0.75rem;">{{ cat }}</h3>
                <div class="recipe-grid">
                  @for (recipe of recipesByCategory(cat); track recipe.id) {
                    <ui-card variant="outlined">
                      <ui-card-body>
                        <div
                          style="display: flex; justify-content: space-between; align-items: start;"
                        >
                          <strong>{{ recipe.title }}</strong>
                          <ui-badge
                            variant="label"
                            [color]="difficultyColor(recipe.difficulty)"
                            >{{ recipe.difficulty }}</ui-badge
                          >
                        </div>
                        <div class="recipe-card-meta">
                          <span class="recipe-card-meta-item">
                            <ui-icon [svg]="icons.globe" [size]="13" />
                            {{ recipe.cuisine }}
                          </span>
                          <span class="recipe-card-meta-item">
                            <ui-icon [svg]="icons.clock" [size]="13" />
                            {{ formatTime(recipe.prepTime + recipe.cookTime) }}
                          </span>
                          <span class="recipe-card-meta-item">
                            <ui-icon [svg]="icons.star" [size]="13" />
                            {{ recipe.rating }}
                          </span>
                        </div>
                      </ui-card-body>
                    </ui-card>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- ─── By Cuisine ─── -->
        @if (node.id === "by-cuisine") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.globe" [size]="24" />
                <h2>Browse by Cuisine</h2>
              </div>
            </div>

            <div class="scroll-area">
              <div class="stats-grid">
                @for (cuisine of allCuisines; track cuisine) {
                  <ui-card variant="outlined">
                    <ui-card-body>
                      <div class="stat-icon-row">
                        <ui-icon [svg]="icons.globe" [size]="18" />
                        <span class="stat-label">{{ cuisine }}</span>
                      </div>
                      <div class="stat-value">
                        {{ recipesInCuisine(cuisine) }}
                      </div>
                      <ui-progress
                        [value]="
                          (recipesInCuisine(cuisine) / allRecipes.length) * 100
                        "
                        ariaLabel="Recipes"
                      />
                    </ui-card-body>
                  </ui-card>
                }
              </div>

              @for (cuisine of allCuisines; track cuisine) {
                <h3 style="margin: 1.5rem 0 0.75rem;">
                  <ui-icon [svg]="icons.globe" [size]="20" /> {{ cuisine }}
                </h3>
                <div class="recipe-grid">
                  @for (recipe of recipesByCuisine(cuisine); track recipe.id) {
                    <ui-card variant="outlined">
                      <ui-card-body>
                        <div
                          style="display: flex; justify-content: space-between; align-items: start;"
                        >
                          <strong>{{ recipe.title }}</strong>
                          <ui-badge variant="label" color="neutral">{{
                            recipe.category
                          }}</ui-badge>
                        </div>
                        <div class="recipe-card-meta">
                          <span class="recipe-card-meta-item">
                            <ui-icon [svg]="icons.clock" [size]="13" />
                            {{ formatTime(recipe.prepTime + recipe.cookTime) }}
                          </span>
                          <span class="recipe-card-meta-item">
                            <ui-icon [svg]="icons.star" [size]="13" />
                            {{ recipe.rating }}
                          </span>
                          <span class="recipe-card-meta-item">
                            <ui-icon [svg]="icons.users" [size]="13" />
                            {{ recipe.servings }} servings
                          </span>
                        </div>
                      </ui-card-body>
                    </ui-card>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- ─── Find by Ingredients ─── -->
        @if (node.id === "find-by-ingredients") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.search" [size]="24" />
                <h2>Find a Recipe by Ingredients</h2>
              </div>
            </div>

            <div class="ingredient-search-wrap">
              <div>
                <span
                  class="field-label"
                  style="display: block; margin-bottom: 0.5rem;"
                >
                  Select ingredients you have on hand:
                </span>
                <div class="ingredient-picker">
                  @for (ing of allIngredients; track ing) {
                    <ui-chip
                      [color]="
                        selectedIngredients().includes(ing)
                          ? 'primary'
                          : 'neutral'
                      "
                      (click)="toggleIngredient(ing)"
                      >{{ ing }}</ui-chip
                    >
                  }
                </div>
              </div>

              @if (selectedIngredients().length > 0) {
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="field-label"
                    >Selected ({{ selectedIngredients().length }}):</span
                  >
                  <ui-button
                    variant="ghost"
                    size="small"
                    (click)="selectedIngredients.set([])"
                    ariaLabel="Clear all"
                  >
                    Clear all
                  </ui-button>
                </div>

                <div class="match-results">
                  <div class="recipe-grid">
                    @for (match of matchedRecipes(); track match.recipe.id) {
                      <ui-card variant="outlined">
                        <ui-card-header>
                          <div class="match-card-header">
                            <strong>{{ match.recipe.title }}</strong>
                            <ui-badge
                              variant="label"
                              [color]="
                                match.pct >= 75
                                  ? 'success'
                                  : match.pct >= 50
                                    ? 'warning'
                                    : 'neutral'
                              "
                            >
                              {{ match.pct }}% match
                            </ui-badge>
                          </div>
                        </ui-card-header>
                        <ui-card-body>
                          <ui-progress
                            [value]="match.pct"
                            ariaLabel="Ingredient match"
                          />
                          <div
                            class="recipe-card-meta"
                            style="margin-top: 0.5rem;"
                          >
                            <span class="recipe-card-meta-item">
                              <ui-icon [svg]="icons.clock" [size]="13" />
                              {{
                                formatTime(
                                  match.recipe.prepTime + match.recipe.cookTime
                                )
                              }}
                            </span>
                            <span class="recipe-card-meta-item">
                              <ui-icon [svg]="icons.star" [size]="13" />
                              {{ match.recipe.rating }}
                            </span>
                            <span class="recipe-card-meta-item">
                              {{ match.matched }} /
                              {{ match.recipe.ingredients.length }} ingredients
                            </span>
                          </div>
                          <div class="match-ingredients">
                            @for (
                              ing of match.recipe.ingredients;
                              track ing.name
                            ) {
                              <ui-chip
                                [color]="
                                  selectedIngredients().includes(ing.name)
                                    ? 'success'
                                    : 'danger'
                                "
                                size="small"
                                >{{ ing.name }}</ui-chip
                              >
                            }
                          </div>
                        </ui-card-body>
                      </ui-card>
                    } @empty {
                      <p style="opacity: 0.65;">
                        No matching recipes found. Try selecting more
                        ingredients.
                      </p>
                    }
                  </div>
                </div>
              } @else {
                <div
                  style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; opacity: 0.5;"
                >
                  <ui-icon [svg]="icons.search" [size]="48" />
                  <p style="margin-top: 1rem;">
                    Select ingredients above to find matching recipes
                  </p>
                </div>
              }
            </div>
          </div>
        }

        <!-- ─── Favorites ─── -->
        @if (node.id === "favorites") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.heart" [size]="24" />
                <h2>My Favorites</h2>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="favoritesDs"
                title="Favorites"
                placeholder="Select a favorite recipe..."
              >
                <ui-template-column key="title" headerText="Recipe">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                      <ui-icon [svg]="icons.heart" [size]="14" />
                      {{ row.title }}
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="cuisine" headerText="Cuisine" />
                <ui-badge-column key="difficulty" headerText="Difficulty" />

                <ng-template #detail let-recipe>
                  <div class="detail-header">
                    <ui-avatar [name]="recipe.author" [size]="40" />
                    <div>
                      <h3 class="detail-name">{{ recipe.title }}</h3>
                      <p class="detail-sub">
                        by {{ recipe.author }} · {{ recipe.cuisine }}
                      </p>
                    </div>
                  </div>
                  <p style="line-height: 1.5;">{{ recipe.description }}</p>
                  <div class="detail-grid" style="margin-top: 1rem;">
                    <dt>Total Time</dt>
                    <dd>{{ formatTime(recipe.prepTime + recipe.cookTime) }}</dd>
                    <dt>Servings</dt>
                    <dd>{{ recipe.servings }}</dd>
                    <dt>Calories</dt>
                    <dd>{{ recipe.calories }} kcal</dd>
                    <dt>Rating</dt>
                    <dd>
                      {{ renderStars(recipe.rating) }} {{ recipe.rating }}
                    </dd>
                  </div>
                  <div class="tags-row" style="margin-top: 1rem;">
                    @for (tag of recipe.tags; track tag) {
                      <ui-chip color="primary" size="small">{{ tag }}</ui-chip>
                    }
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Submit Recipe ─── -->
        @if (node.id === "submit") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.plus" [size]="24" />
                <h2>Submit a Recipe</h2>
              </div>
            </div>

            <div class="scroll-area">
              <div class="form-grid">
                <div class="form-field form-field-full">
                  <span class="field-label">Recipe Title</span>
                  <ui-input
                    placeholder="e.g. Grandma's Apple Pie"
                    ariaLabel="Recipe title"
                  />
                </div>

                <div class="form-field">
                  <span class="field-label">Category</span>
                  <ui-dropdown-list
                    ariaLabel="Category"
                    [options]="toOptions(categories)"
                  />
                </div>

                <div class="form-field">
                  <span class="field-label">Cuisine</span>
                  <ui-dropdown-list
                    ariaLabel="Cuisine"
                    [options]="toOptions(allCuisines)"
                  />
                </div>

                <div class="form-field">
                  <span class="field-label">Difficulty</span>
                  <ui-dropdown-list
                    ariaLabel="Difficulty"
                    [options]="toOptions(allDifficulties)"
                  />
                </div>

                <div class="form-field">
                  <span class="field-label">Servings</span>
                  <ui-input placeholder="e.g. 4" ariaLabel="Servings" />
                </div>

                <div class="form-field">
                  <span class="field-label">Prep Time (minutes)</span>
                  <ui-input placeholder="e.g. 30" ariaLabel="Prep time" />
                </div>

                <div class="form-field">
                  <span class="field-label">Cook Time (minutes)</span>
                  <ui-input placeholder="e.g. 45" ariaLabel="Cook time" />
                </div>

                <div class="form-field form-field-full">
                  <span class="field-label">Description</span>
                  <ui-input
                    placeholder="A brief description of your recipe..."
                    ariaLabel="Description"
                  />
                </div>

                <div class="form-field form-field-full">
                  <span class="field-label"
                    >Ingredients (one per line: amount unit name)</span
                  >
                  <ui-input
                    placeholder="e.g. 500g bread flour"
                    ariaLabel="Ingredients"
                  />
                  <ui-input
                    placeholder="e.g. 200ml water"
                    ariaLabel="Ingredients continued"
                  />
                  <ui-input
                    placeholder="e.g. 10g salt"
                    ariaLabel="Ingredients continued"
                  />
                </div>

                <div class="form-field form-field-full">
                  <span class="field-label"
                    >Instructions (one step per line)</span
                  >
                  <ui-input
                    placeholder="Step 1: Preheat oven to 200°C..."
                    ariaLabel="Step 1"
                  />
                  <ui-input
                    placeholder="Step 2: Mix dry ingredients..."
                    ariaLabel="Step 2"
                  />
                  <ui-input placeholder="Step 3: ..." ariaLabel="Step 3" />
                </div>

                <div class="form-field form-field-full">
                  <span class="field-label">Tags (comma-separated)</span>
                  <ui-input
                    placeholder="e.g. vegetarian, easy, italian"
                    ariaLabel="Tags"
                  />
                </div>

                <div class="form-field form-field-full">
                  <ui-checkbox ariaLabel="Submit for featured consideration"
                    >Submit for featured consideration</ui-checkbox
                  >
                </div>

                <div class="form-actions">
                  <ui-button variant="filled">Submit Recipe</ui-button>
                  <ui-button variant="ghost">Save Draft</ui-button>
                </div>
              </div>
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

            <ui-tab-group panelStyle="flat">
              <ui-tab label="Preferences" [icon]="icons.settings">
                <div class="settings-grid">
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Measurement System</div>
                      <div class="setting-desc">
                        Switch between metric and imperial measurements
                      </div>
                    </div>
                    <ui-dropdown-list
                      [options]="measurementOptions"
                      ariaLabel="Measurement system"
                    />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Default Servings</div>
                      <div class="setting-desc">
                        Default number of servings when viewing recipes
                      </div>
                    </div>
                    <ui-dropdown-list
                      [options]="servingOptions"
                      ariaLabel="Default servings"
                    />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Show Nutritional Info</div>
                      <div class="setting-desc">
                        Display calories and nutrition on recipe cards
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Show nutrition" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Auto-scale Ingredients</div>
                      <div class="setting-desc">
                        Automatically scale ingredients when changing servings
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Auto scale" />
                  </div>
                </div>
              </ui-tab>

              <ui-tab label="Notifications" [icon]="icons.bell">
                <div class="settings-grid">
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">
                        New recipes from followed chefs
                      </div>
                      <div class="setting-desc">
                        Get notified when chefs you follow post new recipes
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Chef notifications" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Weekly recipe digest</div>
                      <div class="setting-desc">
                        Receive a weekly email with trending recipes
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Weekly digest" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Comment replies</div>
                      <div class="setting-desc">
                        Notify when someone replies to your recipe comments
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Comment notifications" />
                  </div>
                </div>
              </ui-tab>

              <ui-tab-spacer />
              <ui-tab [icon]="icons.triangleAlert" ariaLabel="Danger Zone">
                <div class="settings-grid">
                  <ui-card variant="outlined">
                    <ui-card-body>
                      <h4
                        style="margin: 0 0 0.5rem; color: var(--ui-text, #1d232b);"
                      >
                        Delete All My Recipes
                      </h4>
                      <p
                        style="font-size: 0.82rem; opacity: 0.65; margin: 0 0 1rem;"
                      >
                        This will permanently remove all recipes you have
                        submitted. This action cannot be undone.
                      </p>
                      <ui-button
                        variant="filled"
                        color="danger"
                        ariaLabel="Delete all recipes"
                        >Delete All Recipes</ui-button
                      >
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
class UIDemoRecipeBookApp {
  protected readonly nav = NAV;
  protected readonly activePage = signal("featured");
  protected readonly selectedCategory = signal<string>("All");
  protected readonly adjustedServings = signal(4);
  protected readonly selectedIngredients = signal<string[]>([]);

  protected readonly allRecipes = RECIPES;
  protected readonly featuredRecipes = EXPANDED_FEATURED;

  private readonly featuredBatchSize = 6;
  protected readonly visibleFeaturedCount = signal(6);
  protected readonly visibleFeatured = computed(() =>
    this.featuredRecipes.slice(0, this.visibleFeaturedCount()),
  );
  protected readonly hasMoreFeatured = computed(
    () => this.visibleFeaturedCount() < this.featuredRecipes.length,
  );
  protected readonly loadMoreSentinel =
    viewChild<ElementRef<HTMLElement>>("loadMoreSentinel");
  private readonly destroyRef = inject(DestroyRef);
  protected readonly allCategories = ALL_CATEGORIES;
  protected readonly categories = [...new Set(RECIPES.map((r) => r.category))];
  protected readonly allCuisines = ALL_CUISINES;
  protected readonly allDifficulties = ALL_DIFFICULTIES;
  protected readonly measurementOptions: SelectOption[] = [
    { value: "metric", label: "Metric" },
    { value: "imperial", label: "Imperial" },
  ];
  protected readonly servingOptions: SelectOption[] = [
    { value: "2", label: "2 servings" },
    { value: "4", label: "4 servings" },
    { value: "6", label: "6 servings" },
    { value: "8", label: "8 servings" },
  ];

  protected toOptions(items: string[]): SelectOption[] {
    return items.map((v) => ({ value: v, label: v }));
  }
  protected readonly allIngredients = ALL_INGREDIENTS;

  protected readonly icons = ICONS;

  protected readonly favoritesDs = new FilterableArrayDatasource(
    RECIPES.filter((r) => r.featured),
  );

  protected readonly filteredRecipesDs = computed(() => {
    const cat = this.selectedCategory();
    const filtered =
      cat === "All" ? RECIPES : RECIPES.filter((r) => r.category === cat);
    return new FilterableArrayDatasource(filtered);
  });

  protected readonly matchedRecipes = computed(() => {
    const selected = this.selectedIngredients();
    if (selected.length === 0) return [];

    return RECIPES.map((recipe) => {
      const matched = recipe.ingredients.filter((i) =>
        selected.includes(i.name),
      ).length;
      const pct = Math.round((matched / recipe.ingredients.length) * 100);
      return { recipe, matched, pct };
    })
      .filter((m) => m.matched > 0)
      .sort((a, b) => b.pct - a.pct);
  });

  protected formatTime(minutes: number): string {
    return formatTime(minutes);
  }

  protected scaleAmount(
    amount: number,
    original: number,
    target: number,
  ): string {
    return scaleAmount(amount, original, target);
  }

  protected renderStars(rating: number): string {
    return renderStars(rating);
  }

  protected difficultyColor(
    d: string,
  ): "success" | "warning" | "danger" | "neutral" {
    return difficultyColor(d);
  }

  protected categoryIcon(category: string): string {
    return categoryIcon(category);
  }

  protected recipesInCategory(cat: string): number {
    return RECIPES.filter((r) => r.category === cat).length;
  }

  protected recipesInCuisine(cuisine: string): number {
    return RECIPES.filter((r) => r.cuisine === cuisine).length;
  }

  protected recipesByCategory(cat: string): Recipe[] {
    return RECIPES.filter((r) => r.category === cat);
  }

  protected recipesByCuisine(cuisine: string): Recipe[] {
    return RECIPES.filter((r) => r.cuisine === cuisine);
  }

  protected incrementServings(): void {
    this.adjustedServings.update((s) => Math.min(s + 1, 50));
  }

  protected decrementServings(): void {
    this.adjustedServings.update((s) => Math.max(s - 1, 1));
  }

  protected resetServings(recipe: Recipe): void {
    this.adjustedServings.set(recipe.servings);
  }

  protected toggleIngredient(name: string): void {
    this.selectedIngredients.update((list) =>
      list.includes(name) ? list.filter((i) => i !== name) : [...list, name],
    );
  }

  public constructor() {
    afterNextRender(() => this.setupInfiniteScroll());
  }

  private setupInfiniteScroll(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && this.hasMoreFeatured()) {
          this.loadMoreRecipes();
        }
      },
      { rootMargin: "200px" },
    );

    this.destroyRef.onDestroy(() => observer.disconnect());

    let currentEl: HTMLElement | null = null;
    const check = (): void => {
      const el = this.loadMoreSentinel()?.nativeElement ?? null;
      if (el !== currentEl) {
        if (currentEl) observer.unobserve(currentEl);
        if (el) observer.observe(el);
        currentEl = el;
      }
      if (!this.destroyed) requestAnimationFrame(check);
    };
    check();
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });
  }

  private destroyed = false;

  private loadMoreRecipes(): void {
    this.visibleFeaturedCount.update((n) =>
      Math.min(n + this.featuredBatchSize, this.featuredRecipes.length),
    );
  }
}

// ── Storybook meta ───────────────────────────────────────────────────

const meta: Meta<UIDemoRecipeBookApp> = {
  title: "@theredhead/Showcases/Recipe Book App",
  component: UIDemoRecipeBookApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
  },
  decorators: [
    moduleMetadata({
      imports: [UIDemoRecipeBookApp],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIDemoRecipeBookApp>;

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
    template: `<ui-demo-recipe-book-app />`,
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
