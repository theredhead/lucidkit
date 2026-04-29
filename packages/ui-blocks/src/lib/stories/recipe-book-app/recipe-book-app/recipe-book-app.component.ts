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
import recipeBookData from "./recipe-book-app.data.json";

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

import { UIMasterDetailView } from "../../../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "../../../navigation-page/navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "../../../navigation-page/navigation-page.utils";
import { UIRecipeBookDetailHeader } from "./recipe-book-detail-header.component";
import { UIRecipeBookCategoryCard } from "./recipe-book-category-card.component";
import { UIRecipeBookCuisineStatCard } from "./recipe-book-cuisine-stat-card.component";
import { UIRecipeBookFeaturedCard } from "./recipe-book-featured-card.component";
import { UIRecipeBookIngredientMatchCard } from "./recipe-book-ingredient-match-card.component";
import { UIRecipeBookPageHeader } from "./recipe-book-page-header.component";
import { UIRecipeBookSummaryCard } from "./recipe-book-summary-card.component";

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
    UIRecipeBookDetailHeader,
    UIRecipeBookCategoryCard,
    UIRecipeBookCuisineStatCard,
    UIRecipeBookFeaturedCard,
    UIRecipeBookIngredientMatchCard,
    UIRecipeBookPageHeader,
    UIRecipeBookSummaryCard,
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
  templateUrl: "./recipe-book-app.component.html",
  styleUrl: "./recipe-book-app.component.scss",
})
export class UIDemoRecipeBookApp {
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

  protected ingredientNames(ingredients: readonly Ingredient[]): string[] {
    return ingredients.map((ingredient) => ingredient.name);
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
