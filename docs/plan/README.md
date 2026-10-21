# Azekah Plan

Living plan for reviving Azekah as a **visual, database-backed application
builder** built on **web components**, so what it builds runs anywhere: our
SvelteKit apps, Laravel/Blade apps, Angular, React, or a plain HTML page.

Status: **planning** — nothing has been built against this plan yet.
Started 2026-10-21.

## Vision

Describe apps, sites, pages, forms, lists, dashboards and branded commerce
surfaces as **data** (stored in Postgres), edit them visually, and render them
as framework-agnostic custom elements, either hosted on Azekah's own domain or
embedded in any host system with one script tag.

Azekah draws the screens and owns the visual layer. It does not own business
data. Its first big job is the visual side of the commerce engine — checkout
branding, buy buttons, carts, libraries, and pages for each integration (Aspire
first) — **without the engine ever depending on it** (see the boundary in
[02-architecture.md](02-architecture.md)).

## Documents

| File | What it holds |
|---|---|
| [01-audit.md](01-audit.md) | What Azekah is today, its consumers, and every prior "UI as data" draft |
| [02-architecture.md](02-architecture.md) | Runtime, document model, data binding, actions, theming, delivery modes, boundary with the commerce engine |
| [03-roadmap.md](03-roadmap.md) | Phases with exit criteria |
| [decisions.md](decisions.md) | Decision log (append-only) |
| [open-questions.md](open-questions.md) | Still to decide or investigate |

Related plan: commerce engine at `~/Projects/nipate/simple-shop/docs/plan/`.
Shared rules from that plan apply here too: **settings over choices** (D-009
there, AZ-D009 here) and **shared identity via `lyre-auth`** (D-012 there).

## How to grow this plan

- Add areas as numbered files (`04-…md`) and list them above.
- Decisions go in `decisions.md` with a date; supersede, never rewrite.
- Resolved open questions move to `decisions.md`.
- Keep file paths concrete so the plan stays checkable against the code.
