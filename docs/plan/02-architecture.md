# 02 — Architecture

## Shape

```
              ┌──────────────────────── Azekah ────────────────────────┐
 Builders ──▶ │ Editor (SvelteKit)  ──▶  API (Fastify)  ──▶  Postgres  │
              │   canvas · tree · inspector    documents · themes ·    │
              │                                versions · data sources │
              └───────────────┬────────────────────────────────────────┘
                              │ published documents + theme CSS
          ┌───────────────────┼──────────────────────────────┐
          ▼                   ▼                              ▼
  Hosted on Azekah     Embedded with one script     Used inside host apps
  domain / custom      tag on any website           (Svelte, Blade, Angular,
  domain (SSR)         (<az-page>, <az-form>, …)     React, plain HTML)
                              │
                              ▼  data sources (read/write through their own APIs)
     Commerce engine API · @~lyre/model tables · Lyre/Laravel APIs · any REST
```

Stack: SvelteKit (editor and hosted rendering), Fastify (API), Postgres with
Drizzle, Svelte 5 compiled to custom elements for the runtime. Own domain.
Identity through `lyre-auth` (shared users, D-012 in the commerce plan).

## 1. Runtime: web components

- Every building block is a custom element with a stable, versioned tag
  (prefix `az-`, e.g. `az-form`, `az-list`, `az-card`, `az-chart`).
- `@azekah/runtime` (a library, not a service) provides: element base, token
  loader, binding evaluator, action bus, data client, embed loader.
- Isolation is a **setting** (AZ-D009): shadow DOM for third-party embeds, light
  DOM where host styles should apply. Design tokens are CSS custom properties,
  which cross shadow boundaries either way.
- Hosted pages are server-rendered by SvelteKit; elements hydrate in the
  browser. Embeds load from one script tag.

## 2. Component packs and manifests

- Components ship in **packs** (core, data, dashboard, commerce, …).
- Each component has a **manifest** (Custom Elements Manifest compatible):
  tag, props as JSON Schema, slots, events, CSS parts, tokens used, data
  requirements, allowed children. Grown from contentkit's
  `registerDef(name, {component, fields})`.
- The editor's inspector, validation and AI generation all read manifests.
- Unknown types are rejected at save and shown as a visible error at render
  (never silently skipped).

## 3. Document model

- **Workspace** (tenant) → **Site/App** → **Routes** (patterns such as
  `/products/[slug]`) → **Documents**.
- A document is one JSON tree. Node:

  ```json
  {
    "id": "uuid",
    "type": "az-list",
    "props": { "layout": "grid", "columns": 3 },
    "bind": { "items": { "source": "engine.products", "query": { "filter": "collection,books", "limit": 12 } } },
    "on": { "select": [{ "action": "navigate", "to": "/products/{item.slug}" }] },
    "responsive": { "md": { "columns": 2 }, "sm": { "columns": 1 } },
    "i18n": { "sw": { "title": "Vitabu" } },
    "slots": { "item": [ { "id": "…", "type": "az-card", "props": {}, "bind": {} } ] }
  }
  ```
- **Layouts** and **symbols** (shared header/footer, reusable sections): edit
  once, every use updates.
- **Templates**: saved subtrees with category and thumbnail, inserted with fresh
  ids at every depth.
- **Versions**: explicit saves create snapshots (autosave updates the draft
  only); draft and published are separate; preview, diff and rollback;
  scheduled publish later.
- SEO per route: title, description, canonical, Open Graph, JSON-LD, robots;
  resolution order kept from aspire `page.svelte`.

## 4. Data: what makes it database-backed

- **Data sources** are registered per workspace, each with a schema of what it
  can return:
  - **Azekah collections**: tables builders define in Azekah's own Postgres,
    served by `@~lyre/model` auto-REST with mandatory tenant scope. These are
    the "database-backed apps".
  - **Commerce engine**: through its public API and SDK only.
  - **Lyre/Laravel APIs** (Aspire, lyre-content): adapter for the Lyre envelope
    and query grammar.
  - **Any REST/OpenAPI** endpoint.
- **Bindings** are declarative: a query (the `@~lyre/model` grammar: filter,
  range, relation, order, limit, with) plus a small safe expression language for
  mapping fields to props — paths, fallbacks, concatenation, formatting,
  conditional classes. Descended from Azekah's card mapping and lyre-content's
  `data` rows. No `eval`, no arbitrary JS.
- **Repeaters**: any slot can repeat over a bound list.
- **Context**: route params, current user, current product, cart, locale, and
  values passed by the host app.
- **Generated UIs**: forms, tables and detail views generated from a source's
  schema (`FieldTypeInference` from lyre-filament-admin, `LyreTableMeta`),
  editable afterwards.
- **Dashboards**: the heartstrings metric format (count/sum/average, period,
  groupBy) with tenant scoping added.

## 5. Actions

Named actions replace callbacks, so everything can be stored:
`navigate`, `submit`, `call` (data source operation), `open`/`close` (dialog,
drawer), `confirm`, `toast`, `set` (local state), `emit` (event to the host
app), `refresh`. Commerce actions (`addToCart`, `checkout`, `buy`) come from the
commerce pack. Actions can be chained and conditioned.

## 6. Theming and branding

- **Tokens** as rows: colors, typography, spacing, radii, shadows, breakpoints
  (from `strings` and `theme-core`), emitted as CSS custom properties.
- One token vocabulary across storefront, checkout, embeds and dashboards
  (merging theme-core and the shadcn names used by the dashboard).
- **Style groups / presets**: named bundles applied to many nodes.
- Breakpoints become generated media/container queries in a stylesheet, never
  inline styles.
- **Surfaces**: a theme can vary by surface (storefront, checkout, embed,
  dashboard) and by color scheme (light/dark).
- Brand assets: logos, fonts (with a loading policy), favicons.

## 7. Delivery modes (settings)

Per site/app, any combination (AZ-D009):

| Mode | How |
|---|---|
| Hosted | Azekah domain or a custom domain; SSR by SvelteKit |
| Embedded | `<script src=…/az.js>` plus `<az-page src="…">` or individual elements |
| In-app | Host app installs `@azekah/runtime` and the packs, and renders documents it fetches |
| Export | Static HTML/CSS bundle for simple sites |

## 8. Editor

Canvas (sandboxed preview), layer tree, inspector generated from manifests
(upstream jedison or our own), drag and drop, responsive preview, undo/redo,
templates, symbols, versions, publish. Later: real-time collaboration and
AI-assisted building (manifests double as the tool schema).

## 9. Security

- No raw HTML nodes; rich text is sanitized; URLs are allowlisted by scheme.
- Props validated against the manifest schema at save and render.
- Data sources are tenant-scoped; bindings can only reach sources the
  workspace registered.
- Permissions: view, edit, publish, manage data sources, manage themes.
- Every editor and API endpoint authorizes the document (the
  nipate-web-builder IDOR must not recur).
- Embed guidance for host CSP.

## 10. Boundary with the commerce engine

The engine must work fully without Azekah. Rules:

| Area | Owner |
|---|---|
| Catalog, prices, carts, orders, payments, entitlements, customers, checkout logic, webhooks | **Commerce engine** |
| Themes, branding, page documents, layouts, component packs, the editor | **Azekah** |

- Azekah stores no commerce data. The engine is just another data source,
  reached through its public API and SDK.
- The engine's hosted checkout ships with a built-in default theme. Branding
  source is a setting: built-in, or an Azekah theme (tokens only).
- **Commerce elements** (buy button, cart, checkout embed, library) live in the
  engine repo as the commerce pack. They depend only on the `@azekah/runtime`
  **library**, never on the Azekah service, and publish manifests so the
  Azekah editor can place them.
- Azekah work never blocks engine roadmap phases 0–4.

## 11. Existing content systems

- **lyre-content** (Laravel, used by Aspire) keeps working. Azekah offers an
  importer (pages and sections → documents) and an adapter to read it as a data
  source. Whether a given site uses lyre-content rendering or Azekah documents
  is a setting per site.
- **simple-shop contentkit** stays as the storefront's built-in content system;
  storefront pages may later come from Azekah documents (per-tenant setting).
