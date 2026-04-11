# Authorization-Aware UI — Design Document

> **Status:** Draft · **Package:** `@theredhead/lucid-blocks`  
> **Date:** 2026-03-21

---

## Problem

Application developers using `@theredhead/lucid-kit` and `@theredhead/lucid-blocks`
need to disable (or hide) UI elements based on the current user's permissions.
The UI library must support this without:

- shipping or depending on any authentication/authorization implementation,
- constraining the consumer's choice of authorization architecture,
- requiring verbose per-element template wiring.

---

## Design Principles

| Principle                  | Implication                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------- |
| **Inversion of control**   | The library defines the contract; the consumer supplies the implementation.            |
| **Zero opinion on auth**   | Works with RBAC, ABAC, CASL, NGXS, NgRx, Firebase, hand-rolled JWT parsing — anything. |
| **Minimal template noise** | A single attribute directive on the protected element — no extra bindings.             |
| **Graceful degradation**   | When no provider is registered, the directive is a no-op. Nothing breaks.              |
| **Progressive adoption**   | Start with per-element directives (Phase 1), add bulk zones later (Phase 2).           |

---

## Core Contract — `IAuthorizationProvider`

The library ships a single-method interface and an `InjectionToken`. The
consumer is responsible for providing an implementation at the application root.

````ts
import { InjectionToken, Signal } from "@angular/core";

/**
 * Contract for authorization providers.
 *
 * Implementations translate a named permission string into a reactive
 * boolean signal. The signal must emit synchronously on change so that
 * the UI stays in sync with the authorization state.
 *
 * The library never interprets the permission name — it is an opaque
 * string whose meaning is defined entirely by the consumer's
 * authorization system.
 */
export interface IAuthorizationProvider {
  /**
   * Returns a signal that emits `true` when the current user holds
   * the given permission, `false` otherwise.
   *
   * Implementations may cache signals per permission name to avoid
   * redundant allocations.
   *
   * @param permission - An opaque permission identifier
   *   (e.g. `"user.edit"`, `"admin"`, `"invoice:write"`).
   */
  hasPermission(permission: string): Signal<boolean>;
}

/**
 * DI token for the application's authorization provider.
 *
 * Provide at root level:
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     {
 *       provide: AUTHORIZATION_PROVIDER,
 *       useClass: MyAuthorizationService,
 *     },
 *   ],
 * });
 * ```
 */
export const AUTHORIZATION_PROVIDER =
  new InjectionToken<IAuthorizationProvider>("AUTHORIZATION_PROVIDER");
````

### Why a `Signal<boolean>`?

- Signals are Angular's reactive primitive — no RxJS subscription management.
- The directive can use `effect()` to react to permission changes in real time
  (e.g. when the user's role is updated, or a new JWT is received).
- A synchronous read (`checker.hasPermission('x')()`) is available for
  imperative checks.

### Why not `Observable<boolean>`?

An observable-based API would work, but it adds teardown responsibility to every
consumer. Signals are automatically tracked by Angular's change detection and
`effect()` lifecycle — no `takeUntilDestroyed`, no `async` pipe. Consumers
whose auth layer is observable-based can bridge trivially:

```ts
hasPermission(name: string): Signal<boolean> {
  return toSignal(this.permissions$.pipe(map(p => p.includes(name))), {
    initialValue: false,
  });
}
```

---

## Phase 1 — `uiRequirePermission` Attribute Directive

### Usage

```html
<!-- Single element -->
<ui-button uiRequirePermission="user.delete" variant="danger">
  Delete Account
</ui-button>

<!-- Works on any element, not just library components -->
<button uiRequirePermission="report.export">Export PDF</button>

<!-- Works on form controls -->
<ui-input uiRequirePermission="invoice.edit" label="Amount" />

<!-- Works on complex components -->
<ui-table-view uiRequirePermission="data.view" [datasource]="ds" />
```

### Behaviour

| Condition                               | Result                                                            |
| --------------------------------------- | ----------------------------------------------------------------- |
| `AUTHORIZATION_PROVIDER` not registered | Directive is a **no-op** — element stays enabled.                 |
| Provider returns `true`                 | Element stays enabled (no DOM changes).                           |
| Provider returns `false`                | `disabled` attribute set, `ui-permission-denied` CSS class added. |
| Permission signal changes at runtime    | Attribute and class toggle reactively via `effect()`.             |

### Implementation Sketch

```ts
@Directive({
  selector: "[uiRequirePermission]",
  standalone: true,
})
export class UIRequirePermission {
  /** The permission name to check. */
  public readonly permission = input.required<string>({
    alias: "uiRequirePermission",
  });

  private readonly provider = inject(AUTHORIZATION_PROVIDER, {
    optional: true,
  });
  private readonly el = inject(ElementRef<HTMLElement>);

  public constructor() {
    effect(() => {
      const perm = this.permission();
      if (!this.provider) return;

      const allowed = this.provider.hasPermission(perm)();

      if (allowed) {
        this.el.nativeElement.removeAttribute("disabled");
        this.el.nativeElement.classList.remove("ui-permission-denied");
      } else {
        this.el.nativeElement.setAttribute("disabled", "");
        this.el.nativeElement.classList.add("ui-permission-denied");
      }
    });
  }
}
```

### CSS Styling Hook

Consumers can style denied elements globally:

```scss
.ui-permission-denied {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
```

Or per-component:

```scss
ui-button.ui-permission-denied {
  // custom styling for denied buttons
}
```

---

## Phase 2 — `uiPermissionZone` Container Directive (future)

Bulk-disable all permission-aware descendants with a single annotation:

```html
<section uiPermissionZone="admin-section">
  <ui-button>Save Settings</ui-button>
  <ui-input label="Timeout" />
  <ui-select label="Log Level" [options]="levels" />
  <!-- everything above is disabled if the user lacks "admin-section" -->
</section>
```

### Implementation Approach

- `UIPermissionZone` provides a `PERMISSION_ZONE` context token.
- `UIRequirePermission` checks for both its own permission **and** any
  ancestor zone's permission (both must be granted).
- Zones can nest — inner zones can require additional permissions.

```html
<div uiPermissionZone="billing">
  <ui-button>View Invoices</ui-button>
  <!-- needs "billing" -->

  <div uiPermissionZone="billing.admin">
    <ui-button>Void Invoice</ui-button>
    <!-- needs "billing" AND "billing.admin" -->
  </div>
</div>
```

This is additive — a zone never _grants_ permissions, only _requires_ them.

---

## Phase 3 — `uiHideWithoutPermission` Structural Directive (future)

For cases where denied elements should be **removed** from the DOM rather than
disabled:

```html
<ui-button *uiHideWithoutPermission="'user.delete'" variant="danger">
  Delete
</ui-button>
```

Implemented as a structural directive wrapping an embedded view. The view is
created or destroyed reactively based on the permission signal.

---

## Role → Context → Permission Derivation

The `IAuthorizationProvider` interface deliberately takes an **opaque
permission string**. It does not define roles, contexts, or a mapping
between them — that is the consumer's domain. However, almost every real
application derives permissions from a **role** held in a specific
**context** (organisation, project, tenant, workspace, etc.).

The typical flow looks like this:

```
User
 ├── Role in Context A  (e.g. "editor" in Project Alpha)
 │    └── expands to: ["doc.read", "doc.write", "comment.create"]
 │
 ├── Role in Context B  (e.g. "viewer" in Project Beta)
 │    └── expands to: ["doc.read"]
 │
 └── Global role         (e.g. "billing-admin")
      └── expands to: ["invoice.read", "invoice.write", "invoice.void"]
```

The consumer's `IAuthorizationProvider` implementation must:

1. **Know the active context** — e.g. via a route parameter, a
   `signal<Context>`, or a context-selection service.
2. **Know the user's role within that context** — from a JWT claim,
   an API response, or a local store.
3. **Expand the role into a set of permission strings** — using a
   role-definition map that lives in the consumer's codebase.
4. **Expose the expanded set** through `hasPermission()` so the
   library directives can query it.

Because everything is signal-based, the permission set recomputes
automatically whenever the active context or the user's role changes.

### Role-definition map (consumer-side)

A simple pattern for mapping roles to permissions:

```ts
/** Each role is an array of granted permission strings. */
const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  owner: [
    "user.read",
    "user.write",
    "user.delete",
    "settings.write",
    "billing.manage",
  ],
  editor: ["user.read", "user.write"],
  viewer: ["user.read"],
} as const;

/**
 * Expand a role name to the set of permissions it grants.
 * Returns an empty set for unknown roles — fail-closed.
 */
function expandRole(role: string): ReadonlySet<string> {
  return new Set(ROLE_PERMISSIONS[role] ?? []);
}
```

Roles can also **inherit** from other roles:

```ts
const ROLE_HIERARCHY: Record<string, readonly string[]> = {
  owner: ["editor", "billing-admin"], // owner inherits editor + billing-admin
  editor: ["viewer"], // editor inherits viewer
  viewer: [],
  "billing-admin": [],
};

function expandRoleRecursive(role: string): ReadonlySet<string> {
  const perms = new Set(ROLE_PERMISSIONS[role] ?? []);
  for (const parent of ROLE_HIERARCHY[role] ?? []) {
    for (const p of expandRoleRecursive(parent)) {
      perms.add(p);
    }
  }
  return perms;
}
```

### Why the library stays out of this

- Role schemas vary wildly between applications (flat strings, nested
  hierarchies, ABAC attribute tuples, CASL ability definitions, …).
- Context granularity differs (org-level, project-level, resource-level).
- The expansion logic often lives server-side; the UI only needs the
  **result**.

By keeping the contract at the level of `hasPermission(name): Signal<boolean>`,
the library works with any derivation strategy — the consumer wires it once
and the UI reacts.

---

## Consumer Integration Examples

### Example A — Simple flat permission set

Suitable when the backend returns a pre-expanded list of permission strings
(e.g. from a JWT `permissions` claim).

```ts
import { Injectable, Signal, computed, signal } from "@angular/core";
import { IAuthorizationProvider } from "@theredhead/lucid-blocks";

@Injectable({ providedIn: "root" })
export class AuthorizationService implements IAuthorizationProvider {
  private readonly currentPermissions = signal<ReadonlySet<string>>(new Set());
  private readonly cache = new Map<string, Signal<boolean>>();

  public hasPermission(permission: string): Signal<boolean> {
    let sig = this.cache.get(permission);
    if (!sig) {
      sig = computed(() => this.currentPermissions().has(permission));
      this.cache.set(permission, sig);
    }
    return sig;
  }

  /** Called by your auth layer when permissions change. */
  public updatePermissions(permissions: string[]): void {
    this.currentPermissions.set(new Set(permissions));
  }
}
```

### Example B — Role-in-context derivation

Suitable when the user has a **role** per context (project, org, tenant)
and permissions are derived client-side.

```ts
import { Injectable, Signal, computed, signal } from "@angular/core";
import { IAuthorizationProvider } from "@theredhead/lucid-blocks";

interface UserContext {
  readonly contextId: string;
  readonly role: string;
}

const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  owner: ["user.read", "user.write", "user.delete", "settings.write"],
  editor: ["user.read", "user.write"],
  viewer: ["user.read"],
};

@Injectable({ providedIn: "root" })
export class RoleAuthorizationService implements IAuthorizationProvider {
  /** The active context — set by a route guard, context switcher, etc. */
  public readonly activeContext = signal<UserContext | null>(null);

  /**
   * Derived: the set of permissions the current user has in the
   * currently active context. Recomputes whenever the context or
   * role changes.
   */
  private readonly effectivePermissions = computed<ReadonlySet<string>>(() => {
    const ctx = this.activeContext();
    if (!ctx) return new Set();
    return new Set(ROLE_PERMISSIONS[ctx.role] ?? []);
  });

  private readonly cache = new Map<string, Signal<boolean>>();

  public hasPermission(permission: string): Signal<boolean> {
    let sig = this.cache.get(permission);
    if (!sig) {
      sig = computed(() => this.effectivePermissions().has(permission));
      this.cache.set(permission, sig);
    }
    return sig;
  }

  /** Called when the user navigates to a different project / org. */
  public switchContext(contextId: string, role: string): void {
    this.activeContext.set({ contextId, role });
  }
}
```

When the user switches context (e.g. navigates to a different project),
calling `switchContext()` updates the `activeContext` signal, which
recomputes `effectivePermissions`, which invalidates every cached
`hasPermission` signal — and the UI updates automatically.

### Example C — Multi-context with global + scoped roles

For applications where users have **both** global roles (e.g.
`billing-admin`) and per-context roles (e.g. `editor` in Project X):

```ts
@Injectable({ providedIn: "root" })
export class MultiContextAuthService implements IAuthorizationProvider {
  /** Global permissions that apply regardless of active context. */
  public readonly globalPermissions = signal<ReadonlySet<string>>(new Set());

  /** Context-scoped permissions derived from the active role. */
  public readonly contextPermissions = signal<ReadonlySet<string>>(new Set());

  /** Union of global + context-scoped permissions. */
  private readonly effectivePermissions = computed<ReadonlySet<string>>(() => {
    return new Set([...this.globalPermissions(), ...this.contextPermissions()]);
  });

  private readonly cache = new Map<string, Signal<boolean>>();

  public hasPermission(permission: string): Signal<boolean> {
    let sig = this.cache.get(permission);
    if (!sig) {
      sig = computed(() => this.effectivePermissions().has(permission));
      this.cache.set(permission, sig);
    }
    return sig;
  }
}
```

### Register the provider

```ts
import { AUTHORIZATION_PROVIDER } from "@theredhead/lucid-blocks";
import { RoleAuthorizationService } from "./auth/role-authorization.service";

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: AUTHORIZATION_PROVIDER,
      useExisting: RoleAuthorizationService,
    },
  ],
});
```

### Use in templates

```html
<ui-button uiRequirePermission="user.create">Add User</ui-button>
<ui-button uiRequirePermission="user.delete" variant="danger">Delete</ui-button>

<section uiPermissionZone="admin">
  <!-- everything here requires "admin" -->
</section>
```

No other wiring needed — the directives don't know or care whether
permissions came from a flat list, a role expansion, or a moon-phase
calculation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  Consumer Application                           │
│                                                 │
│  ┌─────────────────────────────────────┐        │
│  │ AuthorizationService                │        │
│  │ implements IAuthorizationProvider   │        │
│  │                                     │        │
│  │ ┌─────────────┐  ┌──────────────┐  │        │
│  │ │ JWT / OIDC  │  │ Role Store   │  │        │
│  │ │ CASL / NGXS │  │ Firebase     │  │        │
│  │ │ ... any     │  │ ... any      │  │        │
│  │ └─────────────┘  └──────────────┘  │        │
│  └──────────────┬──────────────────────┘        │
│                 │ provides                      │
│                 ▼                                │
│  ┌──────────────────────────────────┐           │
│  │ AUTHORIZATION_PROVIDER token    │           │
│  └──────────────┬───────────────────┘           │
└─────────────────┼───────────────────────────────┘
                  │ inject (optional)
                  ▼
┌─────────────────────────────────────────────────┐
│  @theredhead/lucid-blocks                          │
│                                                 │
│  ┌──────────────────────────────────────┐       │
│  │ IAuthorizationProvider (interface)   │       │
│  │ AUTHORIZATION_PROVIDER (token)       │       │
│  ├──────────────────────────────────────┤       │
│  │ UIRequirePermission (directive)      │ ◄── Phase 1
│  │ UIPermissionZone (directive)         │ ◄── Phase 2
│  │ UIHideWithoutPermission (structural) │ ◄── Phase 3
│  └──────────────────────────────────────┘       │
│                 │                                │
│                 │ sets disabled / class /        │
│                 │ removes from DOM               │
│                 ▼                                │
│  ┌──────────────────────────────────────┐       │
│  │ @theredhead/lucid-kit components        │       │
│  │ (UIButton, UIInput, UISelect, ...)   │       │
│  │                                      │       │
│  │ No changes needed — the directive    │       │
│  │ operates on the host element via     │       │
│  │ DOM attributes and CSS classes.      │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

---

## Open Questions

| #   | Question                                                                                          | Notes                                                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Should the denied state be `disabled` attribute, `aria-disabled`, or both?                        | `aria-disabled="true"` keeps the element focusable for screen readers but prevents interaction via CSS `pointer-events: none`. Using the native `disabled` attribute removes it from tab order entirely. Could be configurable via an input (`deniedBehaviour: 'disable' \| 'aria-disable'`). |
| 2   | Should the directive support an `else` template for a "request access" fallback?                  | e.g. `<ui-button *uiRequirePermission="'admin'; else requestAccess">`. This overlaps with Phase 3's structural directive.                                                                                                                                                                     |
| 3   | Should `IAuthorizationProvider` support a `hasAnyPermission(names: string[])` convenience method? | Could be useful for OR logic, but can be composed from `hasPermission` + `computed`. Keep the interface minimal for now.                                                                                                                                                                      |
| 4   | Should permission names support negation?                                                         | e.g. `uiRequirePermission="!guest"` meaning "anyone except guests". Adds parsing complexity — better left to the provider implementation.                                                                                                                                                     |
| 5   | Package placement — `ui-blocks` or `foundation`?                                                  | The interface + token could live in `foundation` (so `ui-kit` can also use it independently). The directives belong in `ui-blocks`.                                                                                                                                                           |
| 6   | Should the library ship a `RoleDefinitionMap` type or helper?                                     | A lightweight type like `Record<string, readonly string[]>` plus an `expandRole()` utility could reduce boilerplate for RBAC consumers. But it risks being too opinionated — roles with inheritance, attribute conditions, or server-side expansion wouldn't benefit.                         |
| 7   | Should `hasPermission` accept an optional context parameter?                                      | e.g. `hasPermission(permission, context?)`. This would let a single page show data from multiple contexts simultaneously. Current design relies on a single active context — multi-context views would need the consumer to compose signals manually.                                         |
