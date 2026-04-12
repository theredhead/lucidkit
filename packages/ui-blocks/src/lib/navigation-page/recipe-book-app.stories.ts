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

// ── Seed data ────────────────────────────────────────────────────────

const RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    author: "Chef Marco",
    authorAvatar: "CM",
    category: "Main Course",
    cuisine: "Italian",
    difficulty: "medium",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    rating: 4.8,
    reviews: 342,
    calories: 266,
    description:
      "A traditional Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala, basil leaves, and extra-virgin olive oil on a thin, crispy crust.",
    ingredients: [
      { name: "Pizza dough", amount: 500, unit: "g" },
      { name: "San Marzano tomatoes", amount: 400, unit: "g" },
      { name: "Fresh mozzarella", amount: 250, unit: "g" },
      { name: "Fresh basil leaves", amount: 12, unit: "leaves" },
      { name: "Extra-virgin olive oil", amount: 2, unit: "tbsp" },
      { name: "Sea salt", amount: 1, unit: "tsp" },
      { name: "Garlic cloves", amount: 2, unit: "cloves" },
    ],
    steps: [
      "Preheat oven to 260°C (500°F) with pizza stone inside for at least 30 minutes.",
      "Crush San Marzano tomatoes by hand, mix with minced garlic, salt, and a drizzle of olive oil.",
      "Stretch dough on a floured surface into a 30cm round, keeping edges slightly thicker.",
      "Spread tomato sauce evenly, leaving a 2cm border for the crust.",
      "Tear mozzarella into pieces and distribute over the sauce.",
      "Bake on the hot pizza stone for 12–15 minutes until the crust is golden and cheese is bubbling.",
      "Remove from oven, top with fresh basil leaves and a drizzle of olive oil. Serve immediately.",
    ],
    tags: ["vegetarian", "italian", "classic", "pizza"],
    featured: true,
    image: "pizza-margherita.jpg",
    created: "2 weeks ago",
  },
  {
    id: 2,
    title: "Beef Bourguignon",
    author: "Julia R.",
    authorAvatar: "JR",
    category: "Main Course",
    cuisine: "French",
    difficulty: "hard",
    prepTime: 45,
    cookTime: 180,
    servings: 6,
    rating: 4.9,
    reviews: 287,
    calories: 485,
    description:
      "A rich, slow-braised French stew of beef in red wine with pearl onions, mushrooms, carrots, and fresh thyme — perfect for a cozy dinner party.",
    ingredients: [
      { name: "Beef chuck", amount: 1.2, unit: "kg" },
      { name: "Red wine (Burgundy)", amount: 750, unit: "ml" },
      { name: "Pearl onions", amount: 200, unit: "g" },
      { name: "Button mushrooms", amount: 250, unit: "g" },
      { name: "Carrots", amount: 3, unit: "medium" },
      { name: "Bacon lardons", amount: 150, unit: "g" },
      { name: "Beef stock", amount: 500, unit: "ml" },
      { name: "Tomato paste", amount: 2, unit: "tbsp" },
      { name: "Fresh thyme sprigs", amount: 4, unit: "sprigs" },
      { name: "Bay leaves", amount: 2, unit: "leaves" },
      { name: "Butter", amount: 30, unit: "g" },
      { name: "All-purpose flour", amount: 3, unit: "tbsp" },
    ],
    steps: [
      "Cut beef into 5cm cubes and pat dry. Season generously with salt and pepper.",
      "In a large Dutch oven, cook bacon lardons until crispy. Remove and set aside.",
      "Brown beef cubes in batches in the bacon fat. Do not overcrowd. Set aside.",
      "Sauté sliced carrots in the same pot for 3–4 minutes.",
      "Add tomato paste and flour, stir for 1 minute.",
      "Pour in the entire bottle of red wine and beef stock. Bring to a simmer.",
      "Return beef and bacon to the pot. Add thyme sprigs and bay leaves.",
      "Cover and braise in a 160°C (325°F) oven for 2.5–3 hours.",
      "In the last 30 minutes, sauté pearl onions and mushrooms in butter and add to the stew.",
      "Remove bay leaves and thyme stems. Adjust seasoning and serve over egg noodles or mashed potatoes.",
    ],
    tags: ["french", "stew", "comfort-food", "dinner-party"],
    featured: true,
    image: "beef-bourguignon.jpg",
    created: "1 month ago",
  },
  {
    id: 3,
    title: "Thai Green Curry",
    author: "Suki T.",
    authorAvatar: "ST",
    category: "Main Course",
    cuisine: "Thai",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    rating: 4.7,
    reviews: 198,
    calories: 380,
    description:
      "Aromatic Thai green curry with tender chicken, bamboo shoots, Thai eggplant, and fresh Thai basil in a creamy coconut sauce.",
    ingredients: [
      { name: "Chicken thighs (boneless)", amount: 600, unit: "g" },
      { name: "Green curry paste", amount: 4, unit: "tbsp" },
      { name: "Coconut milk", amount: 400, unit: "ml" },
      { name: "Bamboo shoots", amount: 200, unit: "g" },
      { name: "Thai eggplant", amount: 150, unit: "g" },
      { name: "Thai basil leaves", amount: 1, unit: "cup" },
      { name: "Fish sauce", amount: 2, unit: "tbsp" },
      { name: "Palm sugar", amount: 1, unit: "tbsp" },
      { name: "Kaffir lime leaves", amount: 4, unit: "leaves" },
      { name: "Vegetable oil", amount: 2, unit: "tbsp" },
    ],
    steps: [
      "Heat oil in a wok over high heat. Fry curry paste for 1–2 minutes until fragrant.",
      "Add the thick part of the coconut milk and stir until it starts to split.",
      "Add sliced chicken and cook for 3–4 minutes until sealed.",
      "Pour in remaining coconut milk. Add kaffir lime leaves.",
      "Add bamboo shoots and eggplant. Simmer for 15 minutes.",
      "Season with fish sauce and palm sugar. Taste and adjust.",
      "Stir in Thai basil leaves just before serving. Serve with jasmine rice.",
    ],
    tags: ["thai", "curry", "spicy", "gluten-free"],
    featured: true,
    image: "thai-green-curry.jpg",
    created: "3 weeks ago",
  },
  {
    id: 4,
    title: "Sourdough Bread",
    author: "Baker Lena",
    authorAvatar: "BL",
    category: "Bread",
    cuisine: "European",
    difficulty: "hard",
    prepTime: 60,
    cookTime: 45,
    servings: 1,
    rating: 4.6,
    reviews: 156,
    calories: 120,
    description:
      "A rustic, artisan sourdough loaf with a deep golden crust and an open, tangy crumb — requires an active sourdough starter.",
    ingredients: [
      { name: "Bread flour", amount: 500, unit: "g" },
      { name: "Active sourdough starter", amount: 100, unit: "g" },
      { name: "Water (lukewarm)", amount: 350, unit: "ml" },
      { name: "Fine sea salt", amount: 10, unit: "g" },
    ],
    steps: [
      "Mix flour and water. Autolyse (rest) for 30–45 minutes.",
      "Add starter and salt. Fold dough until combined.",
      "Bulk ferment at room temperature for 4–6 hours, performing stretch-and-folds every 30 min for the first 2 hours.",
      "Shape the dough into a round boule and place in a floured banneton.",
      "Cold retard in the refrigerator for 12–18 hours.",
      "Preheat oven with a Dutch oven inside to 250°C (480°F).",
      "Score the dough, place in the hot Dutch oven, cover and bake for 20 min.",
      "Remove lid and bake for another 20–25 min until deep golden. Cool on a wire rack for at least 1 hour before slicing.",
    ],
    tags: ["bread", "sourdough", "artisan", "vegan"],
    featured: false,
    image: "sourdough-bread.jpg",
    created: "2 months ago",
  },
  {
    id: 5,
    title: "Classic Tiramisu",
    author: "Chef Marco",
    authorAvatar: "CM",
    category: "Dessert",
    cuisine: "Italian",
    difficulty: "medium",
    prepTime: 40,
    cookTime: 0,
    servings: 8,
    rating: 4.9,
    reviews: 421,
    calories: 312,
    description:
      "Layers of espresso-soaked ladyfingers and velvety mascarpone cream, dusted with cocoa powder — the quintessential Italian dessert. No baking required.",
    ingredients: [
      { name: "Mascarpone cheese", amount: 500, unit: "g" },
      { name: "Ladyfinger biscuits", amount: 300, unit: "g" },
      { name: "Espresso (cooled)", amount: 300, unit: "ml" },
      { name: "Egg yolks", amount: 4, unit: "large" },
      { name: "Granulated sugar", amount: 100, unit: "g" },
      { name: "Heavy cream", amount: 200, unit: "ml" },
      { name: "Cocoa powder", amount: 2, unit: "tbsp" },
      { name: "Marsala wine (optional)", amount: 3, unit: "tbsp" },
    ],
    steps: [
      "Whisk egg yolks with sugar until pale and thick (about 4 minutes).",
      "Add mascarpone and fold until smooth.",
      "In a separate bowl, whip heavy cream to soft peaks and fold into the mascarpone mixture.",
      "Mix espresso with Marsala wine (if using).",
      "Quickly dip each ladyfinger into the espresso — do not soak.",
      "Layer dipped ladyfingers in a 9×13 dish. Spread half the cream on top.",
      "Repeat with a second layer of ladyfingers and remaining cream.",
      "Cover and refrigerate for at least 6 hours, preferably overnight.",
      "Dust generously with cocoa powder before serving.",
    ],
    tags: ["italian", "dessert", "no-bake", "coffee"],
    featured: true,
    image: "tiramisu.jpg",
    created: "1 week ago",
  },
  {
    id: 6,
    title: "Japanese Ramen (Tonkotsu)",
    author: "Kenji M.",
    authorAvatar: "KM",
    category: "Soup",
    cuisine: "Japanese",
    difficulty: "hard",
    prepTime: 60,
    cookTime: 720,
    servings: 4,
    rating: 4.8,
    reviews: 203,
    calories: 520,
    description:
      "A rich, milky pork bone broth simmered for 12 hours, served with fresh ramen noodles, chashu pork belly, soft-boiled eggs, and pickled ginger.",
    ingredients: [
      { name: "Pork bones (femur)", amount: 2, unit: "kg" },
      { name: "Pork belly (for chashu)", amount: 500, unit: "g" },
      { name: "Fresh ramen noodles", amount: 400, unit: "g" },
      { name: "Eggs", amount: 4, unit: "large" },
      { name: "Soy sauce", amount: 60, unit: "ml" },
      { name: "Mirin", amount: 60, unit: "ml" },
      { name: "Garlic cloves", amount: 8, unit: "cloves" },
      { name: "Fresh ginger", amount: 50, unit: "g" },
      { name: "Green onions", amount: 4, unit: "stalks" },
      { name: "Nori sheets", amount: 4, unit: "sheets" },
      { name: "Sesame oil", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Blanch pork bones in boiling water for 15 min. Drain, rinse, and scrub clean.",
      "Place cleaned bones in a large stockpot with enough water to cover. Add crushed garlic and sliced ginger.",
      "Bring to a rolling boil, then maintain a vigorous simmer for 10–12 hours, adding water as needed.",
      "Meanwhile, roll and tie pork belly. Sear in a hot pan until golden on all sides.",
      "Braise chashu in a mixture of soy sauce, mirin, and water for 2 hours until tender. Let cool in liquid.",
      "Soft-boil eggs for 6.5 minutes. Ice bath, peel, and marinate in chashu braising liquid for at least 4 hours.",
      "Strain broth — it should be opaque and creamy. Season with salt, soy sauce, and sesame oil.",
      "Cook ramen noodles according to package instructions (usually 90 seconds).",
      "Assemble: broth → noodles → sliced chashu → halved egg → nori → sliced green onions.",
    ],
    tags: ["japanese", "ramen", "soup", "comfort-food"],
    featured: false,
    image: "tonkotsu-ramen.jpg",
    created: "3 weeks ago",
  },
  {
    id: 7,
    title: "Banana Bread",
    author: "Sarah K.",
    authorAvatar: "SK",
    category: "Bread",
    cuisine: "American",
    difficulty: "easy",
    prepTime: 15,
    cookTime: 55,
    servings: 10,
    rating: 4.5,
    reviews: 512,
    calories: 196,
    description:
      "Moist, tender banana bread with a golden crust and pockets of melted chocolate chips — the perfect way to use overripe bananas.",
    ingredients: [
      { name: "Ripe bananas", amount: 3, unit: "large" },
      { name: "All-purpose flour", amount: 280, unit: "g" },
      { name: "Granulated sugar", amount: 150, unit: "g" },
      { name: "Butter (melted)", amount: 80, unit: "g" },
      { name: "Egg", amount: 1, unit: "large" },
      { name: "Baking soda", amount: 1, unit: "tsp" },
      { name: "Vanilla extract", amount: 1, unit: "tsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
      { name: "Chocolate chips", amount: 100, unit: "g" },
    ],
    steps: [
      "Preheat oven to 175°C (350°F). Grease a 9×5 loaf pan.",
      "Mash bananas in a large bowl until smooth with some chunks remaining.",
      "Stir in melted butter, sugar, egg, and vanilla extract.",
      "Add flour, baking soda, and salt. Fold until just combined — do not overmix.",
      "Fold in chocolate chips. Pour batter into the prepared pan.",
      "Bake for 50–55 minutes until a toothpick inserted in the center comes out clean.",
      "Cool in pan for 10 minutes, then transfer to a wire rack.",
    ],
    tags: ["baking", "bread", "easy", "chocolate"],
    featured: false,
    image: "banana-bread.jpg",
    created: "5 days ago",
  },
  {
    id: 8,
    title: "Greek Salad (Horiatiki)",
    author: "Elena P.",
    authorAvatar: "EP",
    category: "Salad",
    cuisine: "Greek",
    difficulty: "easy",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    rating: 4.4,
    reviews: 178,
    calories: 220,
    description:
      "A refreshing traditional Greek village salad with ripe tomatoes, crisp cucumbers, red onion, Kalamata olives, and a thick slab of feta cheese.",
    ingredients: [
      { name: "Ripe tomatoes", amount: 4, unit: "large" },
      { name: "Cucumber", amount: 1, unit: "large" },
      { name: "Red onion", amount: 1, unit: "medium" },
      { name: "Green bell pepper", amount: 1, unit: "medium" },
      { name: "Feta cheese", amount: 200, unit: "g" },
      { name: "Kalamata olives", amount: 100, unit: "g" },
      { name: "Extra-virgin olive oil", amount: 4, unit: "tbsp" },
      { name: "Dried oregano", amount: 1, unit: "tsp" },
      { name: "Red wine vinegar", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Cut tomatoes into wedges. Slice cucumber into thick half-moons.",
      "Slice red onion into thin rings. Cut bell pepper into rings.",
      "Arrange all vegetables on a large platter.",
      "Scatter Kalamata olives over the vegetables.",
      "Place the feta slab on top — do not crumble.",
      "Drizzle generously with olive oil and red wine vinegar.",
      "Sprinkle dried oregano and sea salt. Serve immediately with crusty bread.",
    ],
    tags: ["greek", "salad", "vegetarian", "no-cook", "healthy"],
    featured: false,
    image: "greek-salad.jpg",
    created: "4 days ago",
  },
  {
    id: 9,
    title: "Chicken Tikka Masala",
    author: "Priya N.",
    authorAvatar: "PN",
    category: "Main Course",
    cuisine: "Indian",
    difficulty: "medium",
    prepTime: 30,
    cookTime: 35,
    servings: 5,
    rating: 4.7,
    reviews: 389,
    calories: 410,
    description:
      "Tender chunks of yogurt-marinated chicken in a luscious, smoky tomato-cream sauce with warm spices — the world's favourite curry.",
    ingredients: [
      { name: "Chicken breast", amount: 800, unit: "g" },
      { name: "Plain yogurt", amount: 200, unit: "g" },
      { name: "Canned tomatoes", amount: 400, unit: "g" },
      { name: "Heavy cream", amount: 150, unit: "ml" },
      { name: "Onion", amount: 2, unit: "large" },
      { name: "Garlic cloves", amount: 4, unit: "cloves" },
      { name: "Fresh ginger", amount: 20, unit: "g" },
      { name: "Garam masala", amount: 2, unit: "tbsp" },
      { name: "Turmeric", amount: 1, unit: "tsp" },
      { name: "Cumin", amount: 1, unit: "tsp" },
      { name: "Paprika (smoked)", amount: 2, unit: "tsp" },
      { name: "Butter", amount: 30, unit: "g" },
      { name: "Fresh cilantro", amount: 1, unit: "bunch" },
    ],
    steps: [
      "Cut chicken into 3cm cubes. Marinate in yogurt, turmeric, cumin, and half the garam masala for at least 1 hour.",
      "Thread chicken onto skewers (or use a grill pan). Cook under a hot broiler for 8–10 min, turning once.",
      "In a large pan, melt butter and sauté diced onions until golden (8–10 min).",
      "Add minced garlic, grated ginger, paprika, and remaining garam masala. Cook for 1 minute.",
      "Pour in canned tomatoes. Simmer for 15 minutes, stirring occasionally.",
      "Blend the sauce until smooth (immersion blender works great).",
      "Stir in heavy cream and the grilled chicken. Simmer gently for 10 minutes.",
      "Garnish with fresh cilantro. Serve with basmati rice and warm naan.",
    ],
    tags: ["indian", "curry", "chicken", "popular"],
    featured: true,
    image: "chicken-tikka-masala.jpg",
    created: "1 week ago",
  },
  {
    id: 10,
    title: "Crème Brûlée",
    author: "Julia R.",
    authorAvatar: "JR",
    category: "Dessert",
    cuisine: "French",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    rating: 4.8,
    reviews: 276,
    calories: 350,
    description:
      "Silky vanilla custard with a perfectly caramelised sugar crust that shatters at the tap of a spoon.",
    ingredients: [
      { name: "Heavy cream", amount: 600, unit: "ml" },
      { name: "Egg yolks", amount: 6, unit: "large" },
      { name: "Granulated sugar", amount: 100, unit: "g" },
      { name: "Vanilla bean", amount: 1, unit: "pod" },
      { name: "Extra sugar for torching", amount: 6, unit: "tbsp" },
    ],
    steps: [
      "Preheat oven to 150°C (300°F).",
      "Split vanilla bean lengthwise and scrape seeds into cream. Heat cream with the pod until just simmering. Remove from heat and steep 15 minutes.",
      "Whisk egg yolks with sugar until pale. Slowly pour warm cream into yolks, whisking constantly.",
      "Strain custard through a fine sieve into a jug. Divide among 6 ramekins.",
      "Place ramekins in a baking dish. Pour hot water halfway up the sides.",
      "Bake for 35–40 minutes until set but still slightly wobbly in the center.",
      "Cool to room temperature, then refrigerate for at least 4 hours.",
      "Before serving, sprinkle a thin, even layer of sugar on top. Torch until golden and caramelised.",
    ],
    tags: ["french", "dessert", "custard", "elegant"],
    featured: false,
    image: "creme-brulee.jpg",
    created: "2 weeks ago",
  },
  {
    id: 11,
    title: "Pad Thai",
    author: "Suki T.",
    authorAvatar: "ST",
    category: "Main Course",
    cuisine: "Thai",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 10,
    servings: 3,
    rating: 4.6,
    reviews: 234,
    calories: 390,
    description:
      "Sweet, sour, and savoury stir-fried rice noodles with shrimp, tofu, bean sprouts, crushed peanuts, and a squeeze of fresh lime.",
    ingredients: [
      { name: "Flat rice noodles", amount: 250, unit: "g" },
      { name: "Shrimp (peeled)", amount: 200, unit: "g" },
      { name: "Firm tofu", amount: 150, unit: "g" },
      { name: "Eggs", amount: 2, unit: "large" },
      { name: "Bean sprouts", amount: 150, unit: "g" },
      { name: "Tamarind paste", amount: 3, unit: "tbsp" },
      { name: "Fish sauce", amount: 2, unit: "tbsp" },
      { name: "Palm sugar", amount: 2, unit: "tbsp" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Roasted peanuts (crushed)", amount: 50, unit: "g" },
      { name: "Lime", amount: 1, unit: "whole" },
      { name: "Green onions", amount: 3, unit: "stalks" },
    ],
    steps: [
      "Soak rice noodles in warm water for 20–30 minutes until pliable. Drain.",
      "Mix tamarind paste, fish sauce, and palm sugar in a small bowl. Set aside.",
      "Cube tofu and fry in a hot wok with oil until golden. Remove and set aside.",
      "In the same wok, cook shrimp for 1–2 minutes per side. Remove.",
      "Add minced garlic, crack in eggs, and scramble lightly.",
      "Add drained noodles and the tamarind sauce. Toss for 2 minutes.",
      "Return shrimp and tofu. Add bean sprouts and green onions. Toss for 1 minute.",
      "Plate and top with crushed peanuts and lime wedges.",
    ],
    tags: ["thai", "noodles", "stir-fry", "quick"],
    featured: false,
    image: "pad-thai.jpg",
    created: "10 days ago",
  },
  {
    id: 12,
    title: "Moroccan Lamb Tagine",
    author: "Yasmine B.",
    authorAvatar: "YB",
    category: "Main Course",
    cuisine: "Moroccan",
    difficulty: "medium",
    prepTime: 25,
    cookTime: 120,
    servings: 6,
    rating: 4.7,
    reviews: 145,
    calories: 440,
    description:
      "Slow-cooked lamb shoulder with apricots, almonds, and warm North African spices in a fragrant saffron sauce.",
    ingredients: [
      { name: "Lamb shoulder", amount: 1, unit: "kg" },
      { name: "Dried apricots", amount: 150, unit: "g" },
      { name: "Onions", amount: 2, unit: "large" },
      { name: "Canned chickpeas", amount: 400, unit: "g" },
      { name: "Slivered almonds", amount: 50, unit: "g" },
      { name: "Chicken stock", amount: 400, unit: "ml" },
      { name: "Honey", amount: 2, unit: "tbsp" },
      { name: "Ras el hanout", amount: 2, unit: "tbsp" },
      { name: "Ground cinnamon", amount: 1, unit: "tsp" },
      { name: "Saffron threads", amount: 1, unit: "pinch" },
      { name: "Fresh cilantro", amount: 1, unit: "bunch" },
      { name: "Olive oil", amount: 3, unit: "tbsp" },
    ],
    steps: [
      "Cut lamb into large chunks. Season with ras el hanout, cinnamon, salt, and pepper.",
      "Brown lamb in olive oil in a tagine or Dutch oven. Remove and set aside.",
      "Sauté sliced onions until softened. Add remaining spices and saffron.",
      "Return lamb to pot. Add stock, honey, and apricots.",
      "Cover and cook on low heat or in a 160°C (325°F) oven for 1.5–2 hours.",
      "Add chickpeas in the last 30 minutes of cooking.",
      "Toast almonds in a dry pan until golden.",
      "Serve in the tagine, topped with almonds and fresh cilantro. Pair with couscous.",
    ],
    tags: ["moroccan", "lamb", "slow-cook", "north-african"],
    featured: false,
    image: "lamb-tagine.jpg",
    created: "3 weeks ago",
  },
  {
    id: 13,
    title: "Shakshuka",
    author: "Elena P.",
    authorAvatar: "EP",
    category: "Breakfast",
    cuisine: "Middle Eastern",
    difficulty: "easy",
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    rating: 4.5,
    reviews: 192,
    calories: 280,
    description:
      "Eggs poached in a spiced tomato and pepper sauce with cumin, paprika, and crumbled feta — a satisfying one-pan breakfast.",
    ingredients: [
      { name: "Canned tomatoes", amount: 400, unit: "g" },
      { name: "Red bell pepper", amount: 1, unit: "large" },
      { name: "Onion", amount: 1, unit: "medium" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Eggs", amount: 5, unit: "large" },
      { name: "Feta cheese", amount: 60, unit: "g" },
      { name: "Cumin", amount: 1.5, unit: "tsp" },
      { name: "Smoked paprika", amount: 1, unit: "tsp" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Fresh parsley", amount: 1, unit: "small bunch" },
    ],
    steps: [
      "Heat olive oil in a large, deep skillet. Sauté diced onion and bell pepper for 5 minutes.",
      "Add minced garlic, cumin, and paprika. Cook for 1 minute until fragrant.",
      "Pour in canned tomatoes. Simmer for 8–10 minutes until the sauce thickens slightly.",
      "Make 5 wells in the sauce and crack an egg into each.",
      "Cover and cook on medium-low for 6–8 minutes until whites are set but yolks are still runny.",
      "Crumble feta over the top and scatter fresh parsley.",
      "Serve in the skillet with warm crusty bread for dipping.",
    ],
    tags: ["breakfast", "eggs", "vegetarian", "one-pan"],
    featured: false,
    image: "shakshuka.jpg",
    created: "6 days ago",
  },
  {
    id: 14,
    title: "Chocolate Lava Cake",
    author: "Baker Lena",
    authorAvatar: "BL",
    category: "Dessert",
    cuisine: "French",
    difficulty: "medium",
    prepTime: 15,
    cookTime: 14,
    servings: 4,
    rating: 4.9,
    reviews: 367,
    calories: 410,
    description:
      "Individual molten chocolate cakes with a warm, gooey center that flows like lava when you break through the delicate outer shell.",
    ingredients: [
      { name: "Dark chocolate (70%)", amount: 200, unit: "g" },
      { name: "Butter", amount: 100, unit: "g" },
      { name: "Eggs", amount: 3, unit: "large" },
      { name: "Egg yolks", amount: 2, unit: "large" },
      { name: "Granulated sugar", amount: 80, unit: "g" },
      { name: "All-purpose flour", amount: 40, unit: "g" },
      { name: "Cocoa powder for dusting", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Preheat oven to 220°C (425°F). Butter and dust 4 ramekins with cocoa powder.",
      "Melt chocolate and butter together over a bain-marie or in 30-second microwave bursts. Stir until smooth.",
      "Whisk eggs, egg yolks, and sugar until thick and pale (about 3 minutes).",
      "Fold the chocolate mixture into the eggs. Sift in flour and fold gently.",
      "Divide batter among the ramekins. (Can be refrigerated up to 8 hours at this point.)",
      "Bake for 12–14 minutes until the edges are firm but the center is still soft.",
      "Let stand 1 minute, then run a knife around the edge. Invert onto plates.",
      "Serve immediately with vanilla ice cream or fresh berries.",
    ],
    tags: ["french", "dessert", "chocolate", "elegant"],
    featured: true,
    image: "chocolate-lava-cake.jpg",
    created: "3 days ago",
  },
  {
    id: 15,
    title: "Vietnamese Pho Bo",
    author: "Kenji M.",
    authorAvatar: "KM",
    category: "Soup",
    cuisine: "Vietnamese",
    difficulty: "hard",
    prepTime: 30,
    cookTime: 480,
    servings: 6,
    rating: 4.8,
    reviews: 168,
    calories: 350,
    description:
      "A deeply aromatic beef noodle soup with star anise, cinnamon, and charred ginger — topped with rare beef slices, herbs, and hoisin.",
    ingredients: [
      { name: "Beef bones (marrow & knuckle)", amount: 2, unit: "kg" },
      { name: "Beef sirloin (for slicing)", amount: 300, unit: "g" },
      { name: "Rice noodles (banh pho)", amount: 400, unit: "g" },
      { name: "Star anise", amount: 5, unit: "whole" },
      { name: "Cinnamon sticks", amount: 2, unit: "sticks" },
      { name: "Ginger (charred)", amount: 100, unit: "g" },
      { name: "Onion (charred)", amount: 2, unit: "large" },
      { name: "Fish sauce", amount: 60, unit: "ml" },
      { name: "Rock sugar", amount: 30, unit: "g" },
      { name: "Thai basil", amount: 1, unit: "bunch" },
      { name: "Bean sprouts", amount: 200, unit: "g" },
      { name: "Lime", amount: 2, unit: "whole" },
      { name: "Hoisin sauce", amount: 4, unit: "tbsp" },
    ],
    steps: [
      "Blanch beef bones, drain, and rinse clean. Transfer to a large stock pot with fresh water.",
      "Char ginger and onions over an open flame or under the broiler until blackened.",
      "Toast star anise and cinnamon in a dry pan for 1 minute. Add to the stock along with charred aromatics.",
      "Simmer stock on low heat for 6–8 hours, skimming regularly.",
      "Season broth with fish sauce and rock sugar. Strain through a fine sieve.",
      "Freeze sirloin for 20 minutes, then slice paper-thin against the grain.",
      "Cook rice noodles according to package directions. Divide among bowls.",
      "Top with raw beef slices. Ladle boiling broth over — the heat cooks the beef.",
      "Serve with a plate of Thai basil, bean sprouts, lime wedges, and hoisin sauce.",
    ],
    tags: ["vietnamese", "soup", "noodles", "beef"],
    featured: false,
    image: "pho-bo.jpg",
    created: "2 weeks ago",
  },
  {
    id: 16,
    title: "Eggs Benedict",
    author: "Sarah K.",
    authorAvatar: "SK",
    category: "Breakfast",
    cuisine: "American",
    difficulty: "medium",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    rating: 4.6,
    reviews: 214,
    calories: 480,
    description:
      "Toasted English muffins topped with Canadian bacon, perfectly poached eggs, and a silky hollandaise sauce.",
    ingredients: [
      { name: "English muffins", amount: 2, unit: "whole" },
      { name: "Eggs", amount: 4, unit: "large" },
      { name: "Canadian bacon", amount: 4, unit: "slices" },
      { name: "Butter", amount: 115, unit: "g" },
      { name: "Egg yolks (for hollandaise)", amount: 3, unit: "large" },
      { name: "Lemon juice", amount: 1, unit: "tbsp" },
      { name: "Cayenne pepper", amount: 1, unit: "pinch" },
      { name: "White vinegar", amount: 1, unit: "tbsp" },
      { name: "Fresh chives", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Make hollandaise: melt butter. Whisk yolks and lemon juice over a bain-marie until thick.",
      "Slowly drizzle in melted butter while whisking. Season with salt and cayenne. Keep warm.",
      "Bring a pot of water to a gentle simmer. Add white vinegar.",
      "Create a swirl and gently drop eggs in one at a time. Poach for 3–4 minutes.",
      "Toast English muffin halves and warm Canadian bacon in a pan.",
      "Assemble: muffin → bacon → poached egg → generous spoonful of hollandaise.",
      "Garnish with chopped chives and a crack of black pepper. Serve immediately.",
    ],
    tags: ["breakfast", "eggs", "brunch", "classic"],
    featured: false,
    image: "eggs-benedict.jpg",
    created: "1 week ago",
  },
];

const ALL_CATEGORIES = [
  "All",
  ...new Set(RECIPES.map((r) => r.category)),
] as const;
const ALL_CUISINES = [...new Set(RECIPES.map((r) => r.cuisine))] as const;
const ALL_DIFFICULTIES = ["easy", "medium", "hard"] as const;

const ALL_INGREDIENTS = [
  ...new Set(RECIPES.flatMap((r) => r.ingredients.map((i) => i.name))),
].sort();

// ── Expand featured list for infinite scroll ─────────────────────────

const FEATURED_SEED = RECIPES.filter((r) => r.featured);
const FEATURED_ADJECTIVES = [
  "Mom's Famous",
  "Rustic",
  "Easy Weeknight",
  "30-Minute",
  "One-Pot",
  "Slow Cooker",
  "Air Fryer",
  "Sheet Pan",
  "No-Fuss",
  "Holiday",
  "Summer",
  "Comfort",
  "Gourmet",
  "Budget",
  "Healthy",
  "Spicy",
  "Classic",
  "Fusion",
  "Mediterranean",
  "Farmhouse",
];

const EXPANDED_FEATURED: Recipe[] = [
  ...FEATURED_SEED,
  ...Array.from({ length: 54 }, (_, i) => {
    const base = FEATURED_SEED[i % FEATURED_SEED.length];
    const adj = FEATURED_ADJECTIVES[i % FEATURED_ADJECTIVES.length];
    return {
      ...base,
      id: 100 + i,
      title: `${adj} ${base.title}`,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviews: 50 + Math.floor(Math.random() * 400),
      featured: true,
      created: `${(i % 28) + 1} days ago`,
    };
  }),
];

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
        background: var(--ui-surface-dim, #e8eaed);
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
        background: var(--ui-surface-dim, #f7f8fa);
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
        background: var(--ui-content-bg, #f9fafb);
        margin: -1.5rem -1.5rem 1rem;
        padding: 1.5rem 1.5rem 0;
      }

      /* Featured banner */
      .featured-hero {
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--ui-accent, #3584e4) 20%, transparent),
          color-mix(in srgb, var(--ui-accent, #3584e4) 5%, transparent)
        );
        color: var(--ui-text, #1d232b);
      }
      .featured-hero h3 {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
      }
      .featured-hero p {
        margin: 0;
        opacity: 0.75;
        line-height: 1.5;
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
        background: var(--ui-surface-dim, #f7f8fa);
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
                    <ui-badge [color]="difficultyColor(recipe.difficulty)">
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
                          <ui-badge color="neutral">{{
                            recipe.category
                          }}</ui-badge>
                        </dd>
                        <dt>Cuisine</dt>
                        <dd>{{ recipe.cuisine }}</dd>
                        <dt>Difficulty</dt>
                        <dd>
                          <ui-badge
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
                          variant="outline"
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
                          <ui-button variant="outline">Copy Link</ui-button>
                          <ui-button variant="outline">Print</ui-button>
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
                          <ui-badge color="neutral">{{
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
