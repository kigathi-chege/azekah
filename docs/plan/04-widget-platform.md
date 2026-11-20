# 04 — Shareable components and business widgets (Widgetify)

Date: 2026-11-20. Status: **plan**. Nothing here is built. Every "exists today"
claim below was read from the repos on that date; anything unverified is marked
**(unverified)**.

Azekah's end goal is a website builder (02-architecture). This document adds the
other half of the same idea: the components Azekah builds with can be **shared
and dropped anywhere**, with **data thrown in**, and the business ones
(products, events, ads, artists) are owned by the apps that own the data.

> Build once. Embed everywhere. Preserve domain ownership. Compose visually or
> programmatically.

## 1. Scope and sequencing

AZ-D017 lifts the AZ-D015 gate for the **foundation only**:

| Starts now | Stays gated (AZ-D015 rationale) |
|---|---|
| `@azekah/schema` (manifests, documents, provider spec) | Visual editor (AZ-3) |
| `@azekah/runtime` (element base, tokens, bindings, actions, context) | Azekah API service, Postgres, versions, publish |
| Provider widget packs, owned by each provider repo | Hosted/SSR site rendering on an Azekah domain |
| Runtime composition harness (a JSON document renders in a test page) | Multi-tenant builder permissions |

Nothing in the foundation needs the Azekah service. If the service never ships,
the widgets still work (AZ-D018).

## 2. Ownership

| System | Owns | Never owns |
|---|---|---|
| **Azekah** | Runtime, primitives, manifest schema, document model, tokens/themes, bindings, action vocabulary, editor, versions, publish, hosted/embedded rendering | Inventory, ticket orders, ad budgets, any domain record |
| **Widgetify** (capability inside Azekah) | Provider contract, manifest registry, widget packaging rules, embed loader, shared interaction/event contract | Its own dashboard, database or deployment |
| **Accounts** | Identity, OIDC, app identities and catalogue, service identities, launcher data, `<nipate-apps>` | — |
| **Shop** | Catalogue, prices, stock, cart, orders, fulfilment | Billing's ledger |
| **Events** | Event data, tiers, reservations, orders, issued tickets, redemption | Payments |
| **Ads** | Placements, decisions, creative review, impression/click tracking, accounting | — |
| **Toafom** | Artists, releases, tracks, playback, licensing | Shop/Events data |
| **Billing** | Financial authority | — |

## 3. What exists today (read 2026-11-20)

- **Azekah repo** (`packages/azekah`, master): legacy Angular 0.1.15 only; plan docs
  01–03. **No `legacy/angular` tag yet**; AZ-D012 requires creating it first.
- **lyre-content** (`packages/lyre/lyre-content`, Laravel): Page → PageSection →
  Section (self-nesting via SectionSection) → Text/Button/Icon/Data; Menu/MenuItem;
  Article. `DataRepository::build` turns a `Data` row's `type` (model class) +
  `filters` (`limit`, `offset`, `orderByColumn`, `orderByOrder`, `unpaginated`,
  `relation`) into a live query.
- **Aspire UI** (`aspire/ui/src/lib/components`): `registry.ts` maps a section
  `name` to a Svelte component (30 sections today); `base.svelte` renders
  `page.sections` through it and **silently skips unknown names**; `page.svelte`
  resolves SEO (prop → `metadata.seo` → page fields).
- **contentkit** (`nipate/simple-shop/packages/contentkit`): Postgres port;
  `registerDef(name, {component, fields})` field schemas; tenant + locale + key.
- **`<nipate-apps>`**: plain-JS Custom Element with Shadow DOM, `--nipate-apps-*`
  variables, `::part()`s; data from `data`/`apps`, same-origin `src`, or
  `accounts` + `token`. Several apps still keep their own `AppSwitcher.svelte`
  or `launcher.ts` (Tasks, Intelligence, Shop, Curator).
- **Shop**: `<nipate-buy-button>` only (public key, https-only links, no-JS
  fallback, per-shop origin). No product card/grid widget. No artist or event
  relation in the catalogue schema.
- **Ads**: versioned SDK (`ads-1.0.0`, `1.1.0`, `1.2.0`) and `core/decide.ts`;
  `/v1/decide`, `/v1/impression`, `/v1/click` referenced in README and tests.
- **Events**: public `GET /v1/events` (read-only, no personal data, cached 60 s,
  CORS `*`; `listing`, `source`, `tickets_url`), `?artist=<slug>`, performer
  table `event_artists(toafom_slug)` as an organizer **claim**.
- **Toafom** (`toafom-ui`): artists (UUID + unique slug), releases, tracks; its
  own link-out `merch_items`; public artist API path **(unverified: Events docs
  say `/api/v1/artists/:slug`, Toafom tests use `/v1/artists/:slug/...`)**.

## 4. Package boundaries

```
@azekah/schema    JSON Schemas + types + validators: manifest, provider, document,
                  context, action, event. No DOM. Used by editor, CI and widgets.
@azekah/runtime   Browser library: element base class, token loader, binding
                  evaluator, action bus, context reader, data client, error/loading
                  states, embed loader. No framework dependency.
@azekah/core      Core pack: layout and primitives (stack, grid, text, image,
                  button, card, list, form, dialog, nav).
@azekah/sdk       Node/server helpers: validate a manifest in CI, sign embed keys
                  where needed, fetch a provider's manifest.
@azekah/adapters  Data source adapters: REST/OpenAPI, Lyre envelope,
                  lyre-content/contentkit importers.
```

Provider packs live **in the provider repo**, depend only on `@azekah/runtime`
and `@azekah/schema`, and publish a manifest:

| Pack | Repo | First widgets |
|---|---|---|
| `shop` | simple-shop | product-card, product-grid/carousel, product-detail (quick view), merch (artist/event configurations) |
| `events` | events | event-card, event-list, artist-performances, event-hero, ticket-tiers |
| `ads` | ads | ad-placement (wraps the Ads SDK) |
| `toafom` | toafom-ui | artist-card, release-card, artist-link |
| `accounts` | accounts | `nipate-apps` manifest + app-shell pieces |
| later | heartstrings, inbox, loyalty, intelligence | per the brief, only what each real API supports |

**Distribution.** Versioned, immutable embed assets per provider
(`/embed/v1/<pack>.js`, in the style of Shop's buy button and Ads' SDK), plus an
npm package for first-party SvelteKit apps. A page loads only the packs it uses.

## 5. Manifest schema (to be finalised in `@azekah/schema`)

A manifest is Custom Elements Manifest compatible plus Nipate fields. JSON Schema,
versioned (`manifestVersion`). Fields:

```
manifestVersion       "1"
id                    "shop.product-grid"      (pack.widget, stable)
version               semver of the widget
runtime               compatible @azekah/runtime range
provider              { app: <Accounts app id>, pack, origin(s) }
element               custom element tag, e.g. "nipate-product-grid"
status                stable | beta | deprecated (+ replacedBy, removeAfter)
props                 JSON Schema per prop (type, bounds, enum, default, i18n flag)
context               { required: [...], optional: [...] }  reference kinds consumed
selection             modes supported: curated | contextual | recommended | popular | query
filters               allowed filter keys and value schemas
data                  allowed operations (read-only unless declared), caching policy
actions               named actions this widget can raise or accept
events                standard + provider-specific events it emits
slots, parts          named slots, CSS parts
tokens                design tokens it reads (with fallbacks)
variants              presentation variants
privacy               public | authenticated; personal-data fields (none for public)
permissions           what a placing user needs (view, place, configure, commercial)
fallback              noscript/empty/error behaviour
i18n                  translatable props, RTL readiness
```

Rules: unknown fields in a **document** are rejected at save and shown as a
visible error at render (never skipped, fixing the Aspire gap). URLs in props are
schema-typed (`https` only unless the manifest allows `mailto:`/`tel:`/`wa.me`).
A manifest never contains a service URL a document author could change; origins
come from the provider's own registration.

## 6. Document model

Unchanged from 02-architecture §3 (JSON node tree: `type`, `props`, `bind`, `on`,
`responsive`, `i18n`, `slots`), with two additions:

- `ref`: a node may instantiate a registered widget by manifest id + version
  range (`"type": "shop.product-grid"`).
- `context`: a node or document may declare which host context it reads.

A document renders identically hosted, embedded or in-app; the runtime is the
only interpreter.

## 7. Host context

A normalised, typed object; every field optional.

```
hostApp, hostProperty, pageType, pageId
tenantId, locale, currency, location
refs: { artist?, event?, product?, collection?, topic[]?, category[]? }
```

Each ref is **provider-scoped**: `{ provider: "toafom", kind: "artist", id: "lulu-ndege" }`.
A Toafom artist ref is never treated as an Events or Shop id. Mapping to another
provider's id goes through a recorded relation (06-cross-app-links.md).

Trust: context supplied by the host **server** is trusted; context from public page
attributes is untrusted and only used for public, read-only selection. No access
tokens, identity claims or tenant secrets ever travel in widget attributes.

## 8. Content selection modes

`curated` (explicit refs), `contextual` (via a verified relation), `recommended`
(provider's own recommendation), `popular` (provider-supported public ranking),
`query` (provider-permitted filters). Each provider decides what is exposed.
Organic, editorially curated and sponsored items are **separate labelled
streams**; sponsored is always labelled. Intelligence may *suggest* relations; a
person confirms (AZ-D023).

## 9. Actions and events

Actions (named, versioned, resolved through the provider; an unsupported one
renders a disabled state with a reason, never a dead button):

```
navigate  openDialog  closeDialog  refresh  emit
viewProduct  addToCart  beginCheckout
viewEvent  selectTicket  beginReservation
openConversation  submitLead
```

Rules: cart, order and reservation state is owned by the provider; the widget
**never shows a purchase or reservation as completed from a browser click**. It
hands off to the provider's checkout (embedded only where that provider documents
a contract). Duplicate interactions are idempotent by provider contract.

Events (CustomEvent, bubbling, composed): `widget.ready|loading|error|empty`,
`widget.item.viewed|selected`, `widget.action.started|completed|failed`, plus
provider events. Payloads carry ids and kinds only: **no personal data, no
payment details**.

Attribution: a non-sensitive `src` parameter (`widget:<pack>.<widget>@<host>`) on
outbound links, validated by the destination, used only for the provider's own
analytics. No cross-site identifier, no parallel ledger (Ads and Billing stay the
authority).

## 10. Delivery modes (AZ-D009 settings)

1. **In-app**: first-party SvelteKit apps import the pack.
2. **Web component embed**: versioned script, Shadow DOM by default for external
   hosts, light DOM where host styles should apply.
3. **Azekah-rendered**: later, gated.
4. **External sites**: allowlisted origins, rate limits, a public embed key that
   is an identifier, not a secret. Private actions require provider server auth.

Failure isolation: timeouts, loading/empty/error states, bounded retry, no global
CSS or JS side effects, no changes to host typography or scroll, clean teardown.

## 11. Theming

One token vocabulary (semantic: surface, text, accent, radius, space, type scale,
focus ring, motion), light/dark, host inheritance through CSS custom properties,
`prefers-reduced-motion` honoured. Source tokens from the brand repo/site and the
existing `--nipate-apps-*` variables are mapped, not renamed (compatibility).
Official logos come from the owning apps/Accounts; no redesign.

## 12. Security

XSS (no raw HTML, sanitised rich text), SSRF (data source origins come from
provider registration only; no arbitrary URL in documents), unsafe redirects
(allowlisted destinations), cross-tenant exposure (tenant-scoped sources, provider
enforces ownership server-side), forged context, embed-origin abuse, credential
leakage (server-side only), replay of sensitive actions (provider nonces),
malicious media/iframes (sandbox), CSP (each embed mode documents its exact
`script-src`/`style-src`/`connect-src`). Authorization is enforced by each
backend, never only by the editor UI. An Accounts login never alone authorises
changing a merchant's storefront or an organiser's event.

## 13. Data freshness

Public product metadata: cacheable; price and stock: short TTL and revalidated on
action; ticket availability: short TTL and **always revalidated with Events before
reservation**; ads: Ads' own decision rules; private account data: never in shared
caches. Use stable resource refs, never copies of domain records; use provider
outbox events for invalidation where they exist **(unverified per provider)**.

## 14. Accounts shell and `<nipate-apps>`

Keep one implementation in Accounts. Azekah's `accounts.nipate-apps` manifest
declares the element, its attributes and `--nipate-apps-*` variables, and the
loader fetches Accounts' served script. A shell is **composable pieces** (app
identity, switcher, profile entry, workspace context, theme control, optional
notifications, optional Inbox help), not one header. Existing per-app switchers
migrate to it one app at a time, in each app's own PR.

## 15. Testing and honesty rules

Unit, integration and browser tests as listed in the brief. A test against static
mock HTML does not count as an integration test. For every widget the status is
tracked separately: designed, implemented, unit tested, integration tested,
browser tested, connected to a real provider, deployed, production verified.
Fixtures are database-backed against real provider APIs run in devstack; nothing
fabricated is presented as operational data.

## 16. Phases

See 03-roadmap.md "WG" phases. Summary: WG-0 contracts and the `legacy/angular`
tag; WG-1 schema + runtime + harness; WG-2 Shop widgets; WG-3 Events widgets;
WG-4 Ads wrapper; WG-5 Accounts shell; WG-6 composition renderer (no editor);
WG-7 other providers.
