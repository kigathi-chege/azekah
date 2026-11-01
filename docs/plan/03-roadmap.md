# 03 — Roadmap

Phases have exit criteria rather than dates.

**Start gate (AZ-D015):** Azekah work begins only after the commerce engine is
stable — engine phases 0–4 complete and the engine in production use with its
pilot tenants.

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
