#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(
  __dirname,
  "../packages/ui-blocks/src/lib/navigation-page/data",
);

mkdirSync(outputDir, { recursive: true });

function writeJson(fileName, value) {
  writeFileSync(
    path.join(outputDir, fileName),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(index, unit) {
  const amount = (index % 27) + 1;
  return `${amount} ${unit}${amount === 1 ? "" : "s"} ago`;
}

function fixedDateTime(index) {
  const day = ((index * 7) % 28) + 1;
  const hour = (8 + (index % 10)).toString().padStart(2, "0");
  const minute = ((index * 13) % 60).toString().padStart(2, "0");
  return `2026-03-${String(day).padStart(2, "0")} ${hour}:${minute}`;
}

function isoDate(index, month = 3) {
  const day = ((index * 5) % 28) + 1;
  return `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function metric(value) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  }
  return String(value);
}

function currency(value) {
  return Number(value.toFixed(2));
}

const firstNames = [
  "Alice",
  "Marcus",
  "Priya",
  "James",
  "Aisha",
  "Luca",
  "Sophie",
  "Noah",
  "Elena",
  "Daria",
  "Mateo",
  "Jasmine",
  "Haruto",
  "Nina",
  "Owen",
  "Fatima",
  "Lucas",
  "Avery",
  "Maya",
  "Daniel",
  "Chloe",
  "Tariq",
  "Eva",
  "Jonas",
  "Leila",
  "Henry",
  "Mina",
  "Leo",
  "Anika",
  "Samir",
  "Grace",
  "Theo",
  "Isla",
  "Rafael",
  "Layla",
  "Milo",
  "Sarah",
  "Nora",
  "Aria",
  "Zane",
];

const lastNames = [
  "Vasquez",
  "Chen",
  "Nair",
  "O'Brien",
  "Kwame",
  "Moretti",
  "Andersen",
  "Patel",
  "Nguyen",
  "Diaz",
  "Hart",
  "Okafor",
  "Kobayashi",
  "Singh",
  "Rivera",
  "Bennett",
  "Alvarez",
  "Campbell",
  "Dubois",
  "Johansson",
  "Hughes",
  "Kim",
  "Morales",
  "Fischer",
  "Reed",
  "Ali",
  "Silva",
  "Baker",
  "Lopez",
  "Sato",
  "Carter",
  "Murray",
  "Brooks",
  "Sharma",
  "Young",
  "Edwards",
  "Mendes",
  "Parker",
  "Ward",
  "Cooper",
];

const departments = [
  "Engineering",
  "Operations",
  "Marketing",
  "Finance",
  "Human Resources",
  "Product",
  "Sales",
  "Support",
  "Design",
  "Legal",
];

const recipeTemplates = [
  {
    title: "Margherita Pizza",
    category: "Main Course",
    cuisine: "Italian",
    description: "A crisp thin-crust pizza with bright tomato sauce, basil, and melted mozzarella.",
    tags: ["vegetarian", "italian", "pizza", "classic"],
    image: "pizza-margherita.jpg",
    ingredients: [
      ["Pizza dough", "g"],
      ["Tomato sauce", "g"],
      ["Fresh mozzarella", "g"],
      ["Basil leaves", "leaves"],
      ["Olive oil", "tbsp"],
      ["Sea salt", "tsp"],
    ],
  },
  {
    title: "Thai Green Curry",
    category: "Main Course",
    cuisine: "Thai",
    description: "A fragrant coconut curry packed with herbs, vegetables, and tender protein.",
    tags: ["thai", "curry", "spicy", "comfort"],
    image: "thai-green-curry.jpg",
    ingredients: [
      ["Coconut milk", "ml"],
      ["Green curry paste", "tbsp"],
      ["Chicken thighs", "g"],
      ["Green beans", "g"],
      ["Thai basil", "leaves"],
      ["Fish sauce", "tbsp"],
    ],
  },
  {
    title: "Banana Bread",
    category: "Bread",
    cuisine: "American",
    description: "Moist banana bread with a caramelized crust and soft crumb.",
    tags: ["baking", "bread", "snack", "classic"],
    image: "banana-bread.jpg",
    ingredients: [
      ["Ripe bananas", "whole"],
      ["Flour", "g"],
      ["Brown sugar", "g"],
      ["Butter", "g"],
      ["Eggs", "whole"],
      ["Baking soda", "tsp"],
    ],
  },
  {
    title: "Greek Salad",
    category: "Salad",
    cuisine: "Greek",
    description: "Crisp vegetables, briny olives, and creamy feta tossed in oregano dressing.",
    tags: ["salad", "greek", "fresh", "vegetarian"],
    image: "greek-salad.jpg",
    ingredients: [
      ["Tomatoes", "whole"],
      ["Cucumber", "whole"],
      ["Red onion", "whole"],
      ["Feta", "g"],
      ["Kalamata olives", "g"],
      ["Olive oil", "tbsp"],
    ],
  },
  {
    title: "Chocolate Lava Cake",
    category: "Dessert",
    cuisine: "French",
    description: "A rich individual cake with a warm molten chocolate center.",
    tags: ["dessert", "chocolate", "baking", "date-night"],
    image: "chocolate-lava-cake.jpg",
    ingredients: [
      ["Dark chocolate", "g"],
      ["Butter", "g"],
      ["Eggs", "whole"],
      ["Sugar", "g"],
      ["Flour", "g"],
      ["Vanilla extract", "tsp"],
    ],
  },
  {
    title: "Shakshuka",
    category: "Breakfast",
    cuisine: "Middle Eastern",
    description: "Eggs poached in a spicy tomato and pepper sauce with warm spices.",
    tags: ["breakfast", "eggs", "one-pan", "spicy"],
    image: "shakshuka.jpg",
    ingredients: [
      ["Eggs", "whole"],
      ["Tomatoes", "g"],
      ["Red peppers", "whole"],
      ["Onion", "whole"],
      ["Paprika", "tsp"],
      ["Cumin", "tsp"],
    ],
  },
  {
    title: "Ramen Bowl",
    category: "Soup",
    cuisine: "Japanese",
    description: "A savory ramen bowl with rich broth, springy noodles, and layered toppings.",
    tags: ["soup", "japanese", "noodles", "broth"],
    image: "ramen-bowl.jpg",
    ingredients: [
      ["Ramen noodles", "g"],
      ["Broth", "ml"],
      ["Soy sauce", "tbsp"],
      ["Mushrooms", "g"],
      ["Soft-boiled eggs", "whole"],
      ["Scallions", "stalks"],
    ],
  },
  {
    title: "Chicken Tikka Masala",
    category: "Main Course",
    cuisine: "Indian",
    description: "Charred chicken pieces in a creamy tomato masala sauce.",
    tags: ["indian", "curry", "creamy", "weeknight"],
    image: "chicken-tikka-masala.jpg",
    ingredients: [
      ["Chicken thighs", "g"],
      ["Yogurt", "g"],
      ["Tomato puree", "g"],
      ["Cream", "ml"],
      ["Garam masala", "tsp"],
      ["Ginger garlic paste", "tbsp"],
    ],
  },
];

const recipePrefixes = [
  "Classic",
  "Weeknight",
  "Rustic",
  "Bright",
  "Slow-Roasted",
  "One-Pan",
  "Market Fresh",
  "Golden",
  "Spicy",
  "Family-Style",
  "Comfort",
  "Garden",
];

function ingredientAmount(unit, index) {
  switch (unit) {
    case "g":
      return 80 + ((index * 35) % 420);
    case "ml":
      return 120 + ((index * 25) % 500);
    case "tbsp":
      return 1 + (index % 4);
    case "tsp":
      return 1 + (index % 3);
    case "leaves":
      return 4 + (index % 12);
    case "whole":
      return 1 + (index % 6);
    case "stalks":
      return 1 + (index % 5);
    default:
      return 1 + (index % 8);
  }
}

function buildRecipes(count) {
  return Array.from({ length: count }, (_, index) => {
    const template = recipeTemplates[index % recipeTemplates.length];
    const authorName = `${firstNames[index % firstNames.length]} ${lastNames[(index * 3) % lastNames.length]}`;
    const recipeIndex = index + 1;
    return {
      id: recipeIndex,
      title: `${recipePrefixes[index % recipePrefixes.length]} ${template.title}`,
      author: authorName,
      authorAvatar: initials(authorName),
      category: template.category,
      cuisine: template.cuisine,
      difficulty: ["easy", "medium", "hard"][index % 3],
      prepTime: 10 + ((index * 7) % 55),
      cookTime: 15 + ((index * 11) % 150),
      servings: 2 + (index % 6),
      rating: Number((3.6 + ((index * 7) % 14) / 10).toFixed(1)),
      reviews: 25 + ((index * 19) % 4200),
      calories: 220 + ((index * 37) % 520),
      description: template.description,
      ingredients: template.ingredients.map(([name, unit], ingredientIndex) => ({
        name,
        amount: ingredientAmount(unit, index + ingredientIndex),
        unit,
      })),
      steps: [
        `Prepare the mise en place for ${template.title.toLowerCase()} and heat your cooking surface.`,
        `Build the base flavors using the primary aromatics and seasoning for batch ${recipeIndex}.`,
        `Cook the main ingredients until tender and balanced in texture.`,
        `Taste, adjust seasoning, and finish with a final garnish before serving.`,
      ],
      tags: template.tags,
      featured: index % 7 === 0,
      image: template.image,
      created: relativeTime(index, index % 5 === 0 ? "week" : "day"),
    };
  });
}

const roleTemplates = [
  {
    name: "Super Admin",
    description: "Unrestricted tenant-wide administration and policy control.",
    level: "critical",
    privileges: ["User lifecycle", "Policy management", "Billing", "Audit export"],
  },
  {
    name: "Admin",
    description: "Operational administration across departments and teams.",
    level: "elevated",
    privileges: ["User lifecycle", "Role assignment", "Reporting", "Support escalation"],
  },
  {
    name: "Security Admin",
    description: "Access reviews, incident triage, and authentication controls.",
    level: "critical",
    privileges: ["MFA policy", "Session revoke", "Access reviews", "SIEM export"],
  },
  {
    name: "Editor",
    description: "Day-to-day content and workspace management.",
    level: "standard",
    privileges: ["Edit records", "Create content", "Invite viewers"],
  },
  {
    name: "Viewer",
    description: "Read-only access to assigned spaces and dashboards.",
    level: "standard",
    privileges: ["Read records", "Export own views"],
  },
  {
    name: "Analyst",
    description: "Reporting, dashboards, and data quality review access.",
    level: "standard",
    privileges: ["Dashboard access", "Data exports", "Saved filters"],
  },
  {
    name: "Support Lead",
    description: "Queue management and customer escalation handling.",
    level: "elevated",
    privileges: ["Queue routing", "Escalations", "Customer history"],
  },
  {
    name: "Finance Manager",
    description: "Billing controls, approvals, and financial reporting.",
    level: "elevated",
    privileges: ["Billing approvals", "Invoice exports", "Spend reports"],
  },
];

function buildUsers(count) {
  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 5) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const role = roleTemplates[index % roleTemplates.length].name;
    return {
      id: index + 1,
      name,
      email: `${firstName}.${lastName}`.toLowerCase().replace(/'/g, "") + "@acme.io",
      role,
      department: departments[index % departments.length],
      status: ["active", "active", "active", "inactive", "suspended"][index % 5],
      lastLogin: fixedDateTime(index),
      mfaEnabled: index % 4 !== 0,
    };
  });
}

function buildRoles(users) {
  return roleTemplates.map((role, index) => ({
    id: index + 1,
    name: role.name,
    description: role.description,
    userCount: users.filter((user) => user.role === role.name).length,
    level: role.level,
    privileges: role.privileges,
  }));
}

const auditActions = [
  "Created user",
  "Updated role",
  "Reset password",
  "Disabled account",
  "Exported audit log",
  "Revoked session",
  "Updated MFA policy",
  "Approved access request",
];

function buildAuditLog(users, count) {
  return Array.from({ length: count }, (_, index) => {
    const user = users[index % users.length];
    return {
      id: index + 1,
      timestamp: fixedDateTime(index),
      user: user.name,
      action: auditActions[index % auditActions.length],
      target: departments[index % departments.length],
      status: ["success", "success", "success", "warning", "failure"][index % 5],
    };
  });
}

const warehouseCategories = [
  "Resistors",
  "Capacitors",
  "ICs",
  "Connectors",
  "Sensors",
  "Cables",
  "Power",
  "Mechanical",
  "Displays",
  "Tools",
];

const supplierNames = [
  "MicroComp Ltd",
  "CapaTech Inc",
  "ChipSource Global",
  "SensorForge",
  "FlexWire Systems",
  "Precision Motion Co",
  "Northline Supply",
  "Delta Components",
  "Future Parts Group",
  "Apex Industrial",
];

function buildSuppliers(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = `${supplierNames[index % supplierNames.length]} ${String.fromCharCode(65 + (index % 26))}`;
    const contactName = `${firstNames[(index * 2) % firstNames.length]} ${lastNames[(index * 7) % lastNames.length]}`;
    return {
      id: index + 1,
      name,
      contact: contactName,
      email: `${contactName.toLowerCase().replace(/\s+/g, ".").replace(/'/g, "")}@supplier.example`,
      leadTime: `${3 + (index % 18)} days`,
      rating: Number((3.8 + ((index * 3) % 12) / 10).toFixed(1)),
      activeOrders: 2 + (index % 24),
      totalParts: 15 + ((index * 9) % 180),
    };
  });
}

function buildZones() {
  const types = ["receiving", "storage", "picking", "shipping"];
  return Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    name: `Zone ${String.fromCharCode(65 + (index % 6))}-${Math.floor(index / 6) + 1}`,
    type: types[index % types.length],
    capacity: 120 + ((index * 25) % 260),
    utilization: 32 + ((index * 11) % 66),
    temperature: ["Ambient", "Cool", "Climate Controlled"][index % 3],
    racks: 8 + (index % 14),
  }));
}

function buildParts(suppliers, count) {
  return Array.from({ length: count }, (_, index) => {
    const category = warehouseCategories[index % warehouseCategories.length];
    const minStock = 40 + ((index * 17) % 460);
    const quantity = (index % 19 === 0 ? 0 : minStock + ((index * 29) % 2800));
    const supplier = suppliers[index % suppliers.length].name;
    const status =
      index % 37 === 0
        ? "discontinued"
        : quantity === 0
          ? "out-of-stock"
          : quantity <= minStock
            ? "low-stock"
            : "in-stock";
    return {
      id: index + 1,
      sku: `${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(5, "0")}`,
      name: `${category} Item ${index + 1}`,
      category,
      location: `${String.fromCharCode(65 + (index % 8))}-${String((index % 24) + 1).padStart(2, "0")}-${String((index % 14) + 1).padStart(2, "0")}`,
      quantity,
      minStock,
      unitPrice: currency(0.5 + ((index * 13) % 650) / 10),
      supplier,
      status,
      lastReceived: relativeTime(index, index % 3 === 0 ? "day" : "week"),
    };
  });
}

function buildPickOrders(count) {
  const priorities = ["urgent", "high", "normal", "low"];
  const statuses = ["pending", "picking", "packed", "shipped", "cancelled"];
  return Array.from({ length: count }, (_, index) => {
    const customer = `${firstNames[index % firstNames.length]} ${lastNames[(index * 11) % lastNames.length]} Industries`;
    const assignee = `${firstNames[(index * 3) % firstNames.length]} ${lastNames[(index * 2) % lastNames.length]}`;
    return {
      id: index + 1,
      orderNumber: `PO-${String(2026000 + index + 1)}`,
      customer,
      items: 1 + (index % 18),
      priority: priorities[index % priorities.length],
      status: statuses[index % statuses.length],
      created: relativeTime(index, index % 2 === 0 ? "hour" : "day"),
      assignee,
      totalValue: currency(150 + ((index * 97) % 12500)),
    };
  });
}

function buildShipments(count) {
  const carriers = ["DHL", "FedEx", "UPS", "Maersk", "Royal Mail", "DPD"];
  const destinations = ["Berlin", "London", "Oslo", "Toronto", "Warsaw", "Madrid", "Dubai", "Singapore"];
  const statuses = ["in-transit", "delivered", "delayed", "returned"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    trackingNumber: `TRK-${202600000 + index}`,
    carrier: carriers[index % carriers.length],
    destination: destinations[index % destinations.length],
    parcels: 1 + (index % 6),
    weight: `${(1.5 + ((index * 7) % 240) / 10).toFixed(1)} kg`,
    status: statuses[index % statuses.length],
    estimatedDelivery: isoDate(index, 4),
  }));
}

const videoChannelWords = [
  "Code",
  "Wave",
  "Vista",
  "Pulse",
  "Nova",
  "Forge",
  "Beacon",
  "Atlas",
  "Craft",
  "Studio",
  "Lens",
  "Zen",
  "Orbit",
  "Signal",
];

const videoCategories = [
  "Education",
  "Music",
  "Travel",
  "Science",
  "Food",
  "Fitness",
  "Gaming",
  "Other",
];

function buildVideoChannels(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = `${videoChannelWords[index % videoChannelWords.length]} ${videoChannelWords[(index * 5 + 3) % videoChannelWords.length]} ${index + 1}`;
    const subscribers = 12_000 + ((index * 91_337) % 8_000_000);
    const totalViews = subscribers * (10 + (index % 70));
    return {
      id: index + 1,
      name,
      handle: `@${name.toLowerCase().replace(/\s+/g, "")}`,
      subscribers: metric(subscribers),
      totalViews: metric(totalViews),
      videoCount: 18 + (index % 420),
      joinedDate: isoDate(index, 1 + (index % 9)),
      verified: index % 5 === 0,
      description: `${name} publishes ${videoCategories[index % videoCategories.length].toLowerCase()} videos with a strong creator-community focus.`,
    };
  });
}

const videoTitles = [
  "REST API from Scratch",
  "Lo-fi Beats to Code To",
  "Hidden Gems Travel Guide",
  "Quantum Computing Explained",
  "Homemade Ramen Workshop",
  "Advanced TypeScript Patterns",
  "Morning Yoga Flow",
  "History of the Internet",
  "Street Photography Tips",
  "Uploading New Content",
  "Graph Algorithms Visualized",
  "Budget Weekend Escapes",
  "Full Body Mobility Reset",
  "One-Pan Dinner Ideas",
  "Retro Game Engine Breakdown",
];

function formatViews(index) {
  const views = 4_500 + ((index * 783_211) % 28_000_000);
  return `${metric(views)} views`;
}

function buildVideos(channels, count) {
  return Array.from({ length: count }, (_, index) => {
    const channel = channels[index % channels.length];
    const status =
      index % 41 === 0
        ? "removed"
        : index % 17 === 0
          ? "processing"
          : index % 13 === 0
            ? "draft"
            : "published";
    return {
      id: index + 1,
      title: `${videoTitles[index % videoTitles.length]} ${index + 1}`,
      channel: channel.name,
      channelAvatar: initials(channel.name),
      views: formatViews(index),
      uploaded: relativeTime(index, index % 3 === 0 ? "day" : "week"),
      duration: `${5 + ((index * 7) % 115)}:${String((index * 13) % 60).padStart(2, "0")}`,
      category: videoCategories[index % videoCategories.length],
      likes: 240 + ((index * 1_301) % 980_000),
      dislikes: 10 + ((index * 37) % 22_000),
      comments: 5 + ((index * 73) % 48_000),
      status,
    };
  });
}

function buildVideoComments(count) {
  return Array.from({ length: count }, (_, index) => {
    const author = `${firstNames[(index * 2) % firstNames.length]}${lastNames[(index * 3) % lastNames.length]}`;
    return {
      id: index + 1,
      author,
      text: `Comment ${index + 1}: thoughtful feedback about pacing, clarity, or follow-up topics for the creator.`,
      timestamp: relativeTime(index, index % 2 === 0 ? "day" : "week"),
      likes: 2 + ((index * 17) % 8_400),
      replies: index % 27,
    };
  });
}

function buildPlaylists(count) {
  const visibilities = ["public", "private", "unlisted"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${videoCategories[index % videoCategories.length]} Collection ${index + 1}`,
    videoCount: 8 + (index % 120),
    visibility: visibilities[index % visibilities.length],
    lastUpdated: relativeTime(index, index % 2 === 0 ? "day" : "week"),
  }));
}

const jobTitles = [
  "Staff Engineer",
  "Product Manager",
  "Designer",
  "Finance Partner",
  "Support Lead",
  "Operations Manager",
  "People Partner",
  "Account Executive",
  "Researcher",
  "Security Analyst",
];

const companies = ["Acme Corp", "Northwind", "Globex", "Innotech", "Lumina Labs"];

function buildContacts(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = `${firstNames[index % firstNames.length]} ${lastNames[(index * 9) % lastNames.length]}`;
    return {
      id: index + 1,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".").replace(/'/g, "")}@acme.com`,
      department: departments[index % departments.length],
      title: jobTitles[index % jobTitles.length],
      phone: `+1 555-${String(1000 + (index % 9000)).padStart(4, "0")}`,
      avatar: initials(name),
      status: ["online", "busy", "away", "offline"][index % 4],
      company: companies[index % companies.length],
      external: index % 6 === 0,
    };
  });
}

const mailSubjects = [
  "Q2 Planning Notes",
  "Updated Project Timeline",
  "Customer Escalation Summary",
  "Security Review Follow-up",
  "Team Offsite Agenda",
  "Contract Redlines",
  "Design Review Recording",
  "Vendor Renewal Reminder",
];

function buildMailMessages(contacts, count) {
  const folders = ["inbox", "sent", "drafts", "archive", "trash"];
  const priorities = ["low", "normal", "high", "urgent"];
  return Array.from({ length: count }, (_, index) => {
    const contact = contacts[index % contacts.length];
    const folder = folders[index % folders.length];
    return {
      id: index + 1,
      from: contact.name,
      fromEmail: contact.email,
      to: "Kris Thompson",
      toEmail: "kris.thompson@acme.com",
      subject: `${mailSubjects[index % mailSubjects.length]} ${index + 1}`,
      preview: `Quick summary for message ${index + 1} with the main action item highlighted upfront.`,
      body: `Hello team,\n\nThis is message ${index + 1}. It contains the detailed context, follow-up actions, and the latest status update for the thread.\n\nRegards,\n${contact.name}`,
      date: fixedDateTime(index),
      read: folder !== "inbox" || index % 3 === 0,
      starred: index % 9 === 0,
      folder,
      labels: [departments[index % departments.length], priorities[index % priorities.length]],
      hasAttachment: index % 5 === 0,
      priority: priorities[index % priorities.length],
    };
  });
}

function buildChatChannels(count) {
  const types = ["channel", "direct", "group"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name:
      types[index % types.length] === "channel"
        ? `team-${departments[index % departments.length].toLowerCase().replace(/\s+/g, "-")}-${index + 1}`
        : `${firstNames[index % firstNames.length]} ${lastNames[(index * 2) % lastNames.length]}`,
    type: types[index % types.length],
    members: 2 + (index % 18),
    lastMessage: `Latest update ${index + 1}`,
    lastSender: `${firstNames[(index * 3) % firstNames.length]} ${lastNames[(index * 4) % lastNames.length]}`,
    lastTime: relativeTime(index, index % 2 === 0 ? "hour" : "day"),
    unread: index % 7,
    description: `Discussion stream ${index + 1} for ongoing collaboration and status updates.`,
    pinned: index % 10 === 0,
  }));
}

function buildChatMessages(channels, contacts, count) {
  return Array.from({ length: count }, (_, index) => {
    const channel = channels[index % channels.length];
    const sender = index % 5 === 0 ? "Kris Thompson" : contacts[index % contacts.length].name;
    return {
      id: index + 1,
      channelId: channel.id,
      sender,
      text: `Message ${index + 1} in ${channel.name}: concise collaboration update, question, or decision note.`,
      time: `${8 + (index % 10)}:${String((index * 7) % 60).padStart(2, "0")}`,
      reactions: ["👍", "🎯", "✅", "🔥"].slice(0, index % 4),
    };
  });
}

function buildMeetings(count) {
  const types = ["virtual", "in-person", "hybrid"];
  const statuses = ["confirmed", "tentative", "cancelled"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `${departments[index % departments.length]} Sync ${index + 1}`,
    organizer: `${firstNames[index % firstNames.length]} ${lastNames[(index * 3) % lastNames.length]}`,
    date: isoDate(index, 4),
    startTime: `${9 + (index % 8)}:00`,
    endTime: `${10 + (index % 8)}:00`,
    type: types[index % types.length],
    room: `Room ${String.fromCharCode(65 + (index % 8))}-${(index % 12) + 1}`,
    link: `https://meet.example.com/${index + 1}`,
    attendees: [
      `${firstNames[(index + 1) % firstNames.length]} ${lastNames[(index + 2) % lastNames.length]}`,
      `${firstNames[(index + 3) % firstNames.length]} ${lastNames[(index + 4) % lastNames.length]}`,
      `${firstNames[(index + 5) % firstNames.length]} ${lastNames[(index + 6) % lastNames.length]}`,
    ],
    status: statuses[index % statuses.length],
    description: `Agenda for meeting ${index + 1}: review progress, unblock risks, and confirm owners.`,
    recurring: index % 4 === 0,
    recurrence: index % 4 === 0 ? "Weekly" : "One-time",
  }));
}

function buildRooms(count) {
  const amenities = ["Display", "Whiteboard", "VC Kit", "Speakerphone", "Standing Desk", "Recording"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Room ${String.fromCharCode(65 + (index % 10))}-${(index % 24) + 1}`,
    building: `Building ${String.fromCharCode(65 + (index % 5))}`,
    floor: 1 + (index % 12),
    capacity: 4 + (index % 24),
    amenities: amenities.filter((_, amenityIndex) => (index + amenityIndex) % 2 === 0),
    available: index % 3 !== 0,
    nextAvailable: relativeTime(index, index % 2 === 0 ? "hour" : "day"),
    image: `room-${(index % 12) + 1}.jpg`,
  }));
}

const recipeData = {
  recipes: buildRecipes(2400),
};

const users = buildUsers(2400);
const userManagementData = {
  users,
  roles: buildRoles(users),
  auditLog: buildAuditLog(users, 2400),
};

const suppliers = buildSuppliers(180);
const warehouseData = {
  parts: buildParts(suppliers, 2400),
  pickOrders: buildPickOrders(2400),
  shipments: buildShipments(2400),
  zones: buildZones(),
  suppliers,
};

const channels = buildVideoChannels(140);
const videoSharingData = {
  videos: buildVideos(channels, 2400),
  channels,
  comments: buildVideoComments(2400),
  playlists: buildPlaylists(90),
};

const contacts = buildContacts(2400);
const chatChannels = buildChatChannels(240);
const communicationSuiteData = {
  currentUser: {
    id: "kris-thompson",
    name: "Kris Thompson",
    avatarLabel: "KT",
  },
  contacts,
  mailMessages: buildMailMessages(contacts, 2400),
  chatChannels,
  chatMessages: buildChatMessages(chatChannels, contacts, 4800),
  meetings: buildMeetings(2400),
  rooms: buildRooms(180),
};

writeJson("recipe-book-app.data.json", recipeData);
writeJson("user-management-app.data.json", userManagementData);
writeJson("warehouse-management-app.data.json", warehouseData);
writeJson("video-sharing-app.data.json", videoSharingData);
writeJson("communication-suite-app.data.json", communicationSuiteData);

console.log(`Wrote showcase data files to ${outputDir}`);