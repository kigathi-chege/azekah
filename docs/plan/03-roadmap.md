# 03 — Roadmap

Phases have exit criteria rather than dates.

**Start gate (AZ-D015, narrowed by AZ-D017):** the editor, service and hosted
rendering (AZ-0 service parts, AZ-3 onward) begin only after the commerce engine
is stable. The portable foundation (WG phases below) starts now.

## AZ-0 — Foundations

- Tag the Angular 0.1.15 code `legacy/angular`, then rebuild in this repo (AZ-D012).
- Monorepo layout:
  - `apps/editor` (SvelteKit), `apps/api` (Fastify), `apps/render` (SvelteKit SSR host)
  - `packages/runtime`, `packages/schema` (document + manifest types, validators),
    `packages/pack-core`, `packages/sdk`, `packages/adapters`
- Added to devstack (`apps/azekah*.yaml`), CI with type check, lint, tests.
- Sign-in through `lyre-auth`.

Exit: `./dev up azekah` boots editor, API and renderer; CI is green.

## AZ-1 — Runtime, tokens, rendering

- Svelte 5 → custom elements build (AZ-D013); tag versioning; shadow/light DOM setting.
- Move the engine's commerce elements onto `@azekah/runtime` (AZ-D016).
- Manifests for the core pack: page, section, stack/grid, text, rich text,
  image, button, link, card, list, form, field types, dialog, nav, breadcrumb.
- Themes: token tables → CSS custom properties; style groups; breakpoints.
- Render a stored document: hosted (SSR) and embedded (script tag).

Exit: **the same JSON document renders on the Azekah domain, inside aspire-ui
(Svelte), inside a Laravel Blade page, and on a plain HTML page**, branded by
one theme.

## AZ-2 — Data and actions

- Data source registry: Azekah collections (`@~lyre/model`), Lyre/Laravel API
  adapter, generic REST/OpenAPI.
- Bindings, expression language, repeaters, request context.
- Action bus and the action vocabulary.
- Forms, tables and detail views generated from a source schema.

Exit: a working CRUD app (list, filter, detail, create/edit form with server
validation errors on fields) defined entirely as data against a Postgres table.

## AZ-3 — Editor

- Canvas, layer tree, inspector from manifests, drag and drop, responsive
  preview, undo/redo.
- Templates, symbols, layouts, versions, draft/publish, rollback.
- Permissions (view, edit, publish, data sources, themes).

Exit: someone who doesn't write code builds, previews and publishes a page and
rolls it back.

## AZ-4 — Commerce surfaces

- Engine checkout reads branding tokens from Azekah (branding-source setting).
- Commerce pack manifests available in the editor; engine as a data source.
- Integration templates, e.g. an Aspire "digital library" and "buy this PDF" block.

Exit: Aspire's checkout is branded from an Azekah theme and a "buy this PDF"
block built in Azekah sells through the engine — **and with Azekah switched off,
the engine's checkout still works with its built-in theme.**

## AZ-5 — Apps at scale

- Dashboards with the metric format (tenant-scoped).
- Builder-defined collections with relations, roles and row-level access.
- Multiple sites per workspace, custom domains, routing with layouts.
- lyre-content importer and adapter.
- AI-assisted building from manifests; real-time collaboration.
- Analytics, A/B testing, accessibility checks.

## WG — Shared widget foundation (AZ-D017; details in 04-widget-platform.md)

Runs before and independently of the gated phases. Each phase ends with a
report that keeps *designed / implemented / unit / integration / browser / real
provider / deployed / production* separate. One consolidated PR per repo (AZ-D026).

- **WG-0 Contracts.** Tag `legacy/angular`; resolve the open items in 06; freeze
  manifest v1, context, action and event schemas (`@azekah/schema`).
- **WG-1 Runtime + harness.** `@azekah/runtime`, core primitives, tokens, a
  composition harness that renders one JSON document in SvelteKit and plain HTML.
- **WG-2 Shop widgets** in simple-shop: product card, grid/carousel, quick view,
  artist/event merch configurations; real Shop API; checkout hand-off; shown on a
  Toafom artist page and an Events page.
- **WG-3 Events widgets** in events: card, list, artist performances, hero, ticket
  tiers with revalidation before reservation; shown on Toafom, Heartstrings and Shop.
- **WG-4 Ads wrapper** in ads: manifest + placement element around the existing SDK;
  sponsored labelling; failures never break the host page.
- **WG-5 Accounts shell.** `nipate-apps` manifest/wrapper; composable shell
  pieces; one example host. Other apps migrate their switchers in their own PRs.
- **WG-6 Composition renderer.** Document → elements with a manifest registry and
  visible errors for unknown types; Aspire section wrapper as the first
  lyre-content consumer (05 §2.2).
- **WG-7 More providers.** Toafom, Heartstrings, Inbox, Loyalty, Intelligence,
  limited to what each real API supports.

Exit (foundation): scenarios A–F from the brief demonstrated against real local
provider APIs in devstack, with Azekah's service **not running**.
