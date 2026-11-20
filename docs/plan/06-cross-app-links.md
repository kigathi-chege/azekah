# 06 — Cross-app links: the source of truth

Date: 2026-11-20. Status: **proposal for owner approval** (AZ-D023). Read from
`toafom-ui/api/migrations`, `events/migrations/0001_init.sql`,
`events/docs/integrations/*`, `simple-shop/packages/db`.

Widgets such as "merch on an artist page" or "upcoming shows for this artist" need
a relation between records owned by different apps. Today:

| Relation | Today |
|---|---|
| Toafom artist ↔ Events | Events `event_artists(name, toafom_slug)`: an organizer **claim**. Events validates the slug against Toafom (advisory, cached, never blocks save). Reverse lookup exists: `GET /v1/events?artist=<slug>`. |
| Toafom artist ↔ Shop | **None.** Shop's catalogue has no artist/event field. Toafom has its own link-out `merch_items` (title, price, https/wa.me link, kind). |
| Event ↔ Shop | Events shows an organizer storefront link only. Combined checkout is not built. |

## Rules

1. **Identity of the artist** is Toafom's `slug` (unique, stable pattern
   `^[a-z0-9][a-z0-9-]{1,60}$`), referenced as `toafom:artist:<slug>`. Slugs are
   never reused for a different artist; a rename keeps an alias.
2. **A relation is a record, not an inference.** Fields: `from` ref, `to` ref,
   `kind` (`performs_at`, `sells_merch_for`, `official_merch_of`), `status`
   (`claimed` | `verified` | `revoked`), `claimedBy` (Accounts actor + app role),
   `verifiedBy`, timestamps.
3. **The app that can verify owns the record.**

   | Relation | Stored in | Claimed by | Verified by |
   |---|---|---|---|
   | artist performs at event | Events (`event_artists`, plus status/verifier columns) | event organizer | the Toafom artist's member or a Toafom admin, through a Toafom-signed confirmation (Toafom API) |
   | artist sells Shop product | Shop (new `product_external_refs` style table keyed by the artist ref) | the Shop merchant | the Toafom artist member (same confirmation) |
   | event has official Shop merch | Events (event ↔ Shop product id list) | event organizer | the Shop merchant who owns the product |

4. **Widgets only call provider APIs.** `claimed` relations render labelled
   "listed by the organizer/seller", never as official. `verified` render as
   official. `revoked` never render. Provider APIs return the status.
5. **No copies.** Relation records hold refs; titles, prices, stock, dates always
   come from the owner at read time (with the freshness rules in 04 §13).
6. **No silent AI links.** Intelligence may propose; a person with rights on the
   owning side confirms.
7. **Toafom's existing link-out merch stays** until the artist has verified Shop
   products; the artist-merch widget can show both, clearly separated and
   labelled by source.

## To resolve before building

- Which Toafom public artist path is real (`/v1/artists/:slug` vs
  `/api/v1/artists/:slug`): verify against running Toafom.
- Shop: whether `facets.ts` `metadata` or a new table is the right home
  (read the catalogue schema in the Shop slice).
- Verification UX in Toafom (artist inbox of pending claims) is a Toafom feature
  and its own PR; until it exists, everything cross-app is `claimed`.
- Who may verify for an artist signed to a publisher (`artists.org_id`).
