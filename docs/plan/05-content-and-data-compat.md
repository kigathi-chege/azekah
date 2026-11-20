# 05 — Content systems, data and the website-builder path

Date: 2026-11-20. Status: **plan**. Read from `lyre-content`, `aspire/ui` and
`simple-shop/packages/contentkit` on that date.

The ambition we already had: a page is a list of **sections**; each section names
a component and carries texts, buttons, icons and **live data queries**; the
frontend maps names to components. Aspire runs on this today. Azekah is that idea
made portable, typed and visual. This document says how the existing systems map
onto Azekah so nothing is thrown away and the website builder grows from them.

## 1. What each system already gives us

| Concept | lyre-content (Laravel) | Aspire UI | contentkit (Postgres) | Azekah (planned) |
|---|---|---|---|---|
| Page + SEO | `Page` | `page.svelte` SEO resolution | page rows | route + SEO per document |
| Unit of layout | `Section` (self-nesting, `SectionSection`) | section `name` → component | section + slot + order | node (`type`, slots) |
| Content | `Text`, `Button`, `Icon` | `section.texts`, `.buttons` | keyed items, locale fallback | props + `i18n` |
| Live data | `Data{type, filters}` via `DataRepository::build` | per-route loaders | batched resolver, cache tags | `bind` queries through data sources |
| Field schema | none | none | `registerDef(name,{component,fields})` | manifest `props` (JSON Schema) |
| Component lookup | none | static `registry.ts` | server registry | manifest registry |
| Navigation | `Menu`, `MenuItem` | menus | menus | nav component + routes |
| Theme | none | Tailwind in app | `theme-core` tokens | token rows → CSS variables |

Known weaknesses to fix (from 01-audit): global unique text names, PHP class names
as data types, unordered pivots, uninvalidated caches, static registry, **silent
skip of unknown sections**, tenant scoping.

## 2. Mapping

### 2.1 Section → node

```
lyre Section { name, title, subtitle, texts[], buttons[], icons[], data[], sections[] }
        ↓ importer
Azekah node  { type: <registered component id>, props: {title, subtitle, …},
               slots: { texts: […], buttons: […], children: […] },
               bind:  { items: { source, query } } }
```

- `name` resolves through a **component map** (Aspire name → manifest id), kept in
  the importer, e.g. `Faqs → aspire.faqs`. Unknown names fail the import loudly.
- `Text.content` rich text is sanitised on import.
- `Data{type, filters}` becomes a `bind` whose `source` is a registered data source
  (`lyre.articles`, not `\Lyre\Content\Models\Article`). The `filters` keys map to
  the Lyre query grammar the adapter speaks (`limit`, `offset`, `orderBy*`,
  `unpaginated`, `relation` as `rel,value` pairs).

### 2.2 Aspire keeps working

Aspire's `registry.ts` is a valid **in-app** consumer: Azekah can ship a
`lyre-content` adapter that returns the same `page.sections` shape Aspire already
renders (AZ-D011). Migration is per section, never a flag day:

1. **Wrap** an Aspire section component as an Azekah component with a manifest
   (props from the section shape). The Svelte file does not change.
2. **Expose** the manifest; Azekah documents can now place it.
3. **Replace** `registry.ts` lookups with the runtime registry when Aspire opts in.
   Unknown sections then render a visible error instead of vanishing.

Aspire's UI is Tailwind/shadcn; the wrapper stays in light DOM (AZ-D009 isolation
setting), so styling is unchanged.

### 2.3 contentkit

`registerDef` field schemas convert mechanically to manifest `props`. contentkit
remains the storefront's built-in content system (02-architecture §11); a per-
tenant setting decides whether storefront pages come from contentkit or Azekah
documents (AZ-Q007).

## 3. Data sources and "data thrown in"

A component never fetches by itself with a hard-coded URL. It receives data three
ways, in this order of preference:

1. **Passed in** by the host as a property (`data`/`items`), server-rendered, like
   `<nipate-apps data=…>`. Best for SEO and for apps that already hold the data.
2. **Bound** to a registered data source through `bind` (query grammar + safe
   mapping expressions). Adapters: Lyre envelope (lyre-model auto-REST), generic
   REST/OpenAPI, Azekah collections later.
3. **Provider-resolved** for business widgets: the provider's own element calls
   its own public API (Shop, Events, Ads). Azekah is not in the data path.

Mapping uses the minimal safe expression language (paths, fallbacks, concat,
formatting, conditional class), descended from the original `ngz-card`
`ColumnDescription` (title/subtitle/image/badge slots with fallback, prefix,
truncate, pipe, value-dependent class). Original useful Azekah ideas kept:
schema-driven form (`FormFormat`) with server-error mapping, list/card with
separate records and display mapping, Laravel-style pagination meta, structured
actions replacing callbacks.

## 4. Path to the website builder

| Stage | Capability | Needs the service? |
|---|---|---|
| A (WG-1…6) | Components, manifests, JSON documents render from a file or host-supplied data; Aspire sections wrapped | No |
| B (AZ-2) | Data source registry + bindings against real APIs, generated forms/tables | Light (registry only) |
| C (AZ-3) | Visual editor: canvas, layer tree, manifest-generated inspector, templates, symbols | Yes |
| D (AZ-4/5) | Hosted sites, routes, layouts, versions/publish, themes per surface, permissions, custom domains, importers at scale | Yes |

Stage A is the portion un-gated by AZ-D017. Because the editor reads manifests,
every widget built in stage A shows up in the editor automatically in stage C.
The website builder is therefore the *same* components, not a second set.

## 5. Open items

- AZ-Q003 (SSR strategy) matters most for hosted sites and for SEO-sensitive
  widgets (Events/Shop cards on Heartstrings and Toafom pages): prefer host-side
  server rendering with `data` passed in, hydrate with the element.
- AZ-Q005 (expression language): propose a minimal in-house language first; adopt
  JSONata only if the minimal one proves too small.
- Component name map for Aspire's 30 sections: produce during the Aspire wrapper
  slice, not now.
