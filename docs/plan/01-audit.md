# 01 — Audit

Audit date: 2026-10-21. Read-only; nothing was changed.

## Azekah today

- Angular 16 library `NgzModule` (selector prefix `ngz-`), Bootstrap styling,
  Remix icons. About 3.5k lines, no tests. npm `azekah` 0.1.15 (2024-01-12);
  last commit 2024-01-13. Code: `projects/ngz/src/lib/`, types in `core/types.ts`.
- **Everything is configured by data** — the idea worth keeping:
  - `ngz-form`: `FormFormat { form_inputs: FormInput[] }` — text, number,
    textarea, checkbox, select, email, password, search-select, editor.
    `helpers/form.helper.ts` maps Laravel-style server errors back onto fields.
  - `ngz-list-card` / `ngz-card`: records kept separate from a display mapping
    (`CardListFormat`, `ColumnDescription`). Slots (title, subtitle, text, badge,
    image, footer) bind to columns with fallbacks (`alt`), concatenation,
    prefix/append/truncate, formatting (`pipe`) and value-dependent classes
    (`helpers/data.helper.ts`).
  - Footer action vocabulary: edit, delete (with confirm), toggle, like, unlike,
    comment, cart; conditional label/class.
  - `ngz-options`: page chrome (title, subtitle, refresh, back, toolbar options
    that navigate or call back). `ngz-breadcrumb` from route data.
  - `ngz-search-select` (relation picker), `ngz-button-select`, `ngz-pagination`
    (Laravel-style `total/current_page/last_page/per_page`).
- Weaknesses: Bootstrap class strings everywhere (no tokens), no data layer (each
  app wrote its own HTTP service), callbacks embedded in configs (cannot be stored).

## Consumers

| Repo | Purpose | Usage | Last push |
|---|---|---|---|
| makini | "Spheres" activity tracker (backend: courageously) | npm `azekah ^0.1.15`: options, card, list-card, form, button-select, breadcrumb | 2024-01-14 |
| organum | Goal tracker (Electron) | npm `azekah ^0.1.5`: options, list-card, form, breadcrumb | 2023-11-29 |
| serenity, ilani, familia, la-familia, angular-findeas-scaffold, swara | Earlier in-app copies of the same components | Copied components in `src/app/shared/components/` | 2023 |

`ilani` (e-commerce admin + storefront on the Mradi backend) had a
`list-table` that took **column definitions from the server**
(`response.displayParams.columns/keys`) plus an entity registry
(`core/constants.ts`). This is the earliest sign of a database-backed builder.
The server code that produced `displayParams` was not found anywhere.

Not found: a repo named `kunguru` (any spelling) under `kigathi-chege` or
`NIPATEAFRICA`. Mradi apps did not use the npm package.

## Prior "UI as data" work

| Source | What it is | Keep | Drop |
|---|---|---|---|
| `packages/lyre/lyre-content` (Laravel) | Pages → recursive sections → texts/buttons/icons/data; menus; SEO fields | Section names a component; **`data` rows declare a live query** (`DataRepository::build`); SEO page fields; menu trees | Globally unique `texts.name`/`buttons.name`; PHP class names as data types; unordered child pivots; uninvalidated cache |
| `aspire/ui` `registry.ts`, `base.svelte`, `page.svelte`; `packages/beacon` | Svelte renderer for lyre-content | Name → component registry; SEO resolution order (prop → `metadata.seo` → page fields) | Static per-app registries; silent skip of unknown sections; route-specific data loaders |
| `nipate/simple-shop` `packages/contentkit`, `theme-core` | Postgres port of lyre-content plus themes | **`registerDef(name, {component, fields})` field schema**; tenant + locale + key; slot + order; batched resolver with locale fallback and cache tags; `ThemeTokens` as CSS variables; `tenant_themes.token_overrides` | Seed-time `misc.items` snapshots (not live); hardcoded `megaMartTheme`; unused `theme.sections` map |
| `nipate/heartstrings` `lyre-svelte-dashboard` | Schema-driven CMS tables and charts | Metric format (`count/sum/average`, period, groupBy) for KPI/chart components; Drizzle introspection | No tenant scoping; coupled to host `$lib/components/ui` |
| `packages/lyre/lyre-filament-admin` | Runtime admin generated from DB schema | `FieldTypeInference` (column → widget); model/relationship metadata | Filament-specific runtime classes |
| `packages/lyre/lyre-model` (`@~lyre/model`) | Auto REST + OpenAPI from Drizzle schema | `autoRegisterModels` with mandatory tenant scope; `buildApiCatalog`; query grammar; envelope | — |
| `nipate-web-builder` (Laravel/Livewire) | JSON-tree drag-and-drop page builder | One JSON tree per page; `page_versions` snapshots; `component_templates` (saved subtrees); publish cache; assets table | Raw HTML nodes; unescaped children; `x-*`/`wire:*` passthrough (injection); editor without authorization; version on every autosave; shallow re-ID of templates; build-time Tailwind for user classes |
| `strings` (Laravel) | Design-token and style draft | Token tables (colors, spacings, breakpoints); **style groups** (named reusable bundles) | Tailwind-as-rows; inline styles (breakpoints impossible); baked CSS that doesn't follow token edits |
| `stoked` (Laravel) | DOM-in-tables page builder | — | Rows per HTML node; unescaped attributes including `on*` |
| `jedison` (fork, 0 own commits) | JSON Schema → form | Candidate for the property inspector (use upstream) | Our fork |
| `nipate-chat-widget` | SvelteKit chat page | — | Not embeddable (iframe only) — shows embedding is unsolved |
| `fidget` (Svelte lib, 2024) | Widgets: DataTable, TipTap editor, Uploader, DatabaseComboBox | Possible blocks | — |
| `adenzo/theme` (paid Shopify theme) | 41 light-DOM custom elements; section `{% schema %}` settings and blocks | **Reference only** (licensed): section settings + blocks format | Code |

## Gaps nothing covers today

- Web-component runtime: build, tag naming/versioning, shadow vs light DOM,
  server rendering, embed loader (CSP, isolation, sizing).
- Component manifest standard (props, events, slots, CSS parts, token use).
- Actions/events model (add to cart, submit, navigate) instead of callbacks.
- Data binding expressions, repeaters, and request context (current product,
  cart, customer, route params).
- Routing, layouts, shared header/footer, site → pages hierarchy.
- Draft/publish, previews, diffs, rollback, scheduled publish.
- Editor: nobody consumes a field schema yet; no responsive props, undo, collaboration.
- Theming: token validation, dark mode, per-surface variants (storefront, checkout, embed, dashboard).
- Builder permissions (edit, publish, bind data sources) and tenant scoping.
- Sanitization of props, URLs and rich text.
- i18n of props inside a node tree.
- Accessibility, analytics, A/B testing, SEO for embeds.
