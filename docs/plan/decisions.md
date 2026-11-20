# Decision Log

Append-only. To change a decision, add a new entry that supersedes the old one.

| ID | Date | Decision | Why |
|---|---|---|---|
| AZ-D001 | 2026-10-21 | Azekah is revived as a visual, database-backed application builder. | Long-standing idea; prior drafts across Angular, Laravel and Svelte. |
| AZ-D002 | 2026-10-21 | The runtime is web components (custom elements), so output fits any host framework or plain HTML. | "Something that fits everywhere." |
| AZ-D003 | 2026-10-21 | Stack: SvelteKit, Fastify, Postgres (Drizzle); own domain. | Our usual stack; same shape as the commerce engine. |
| AZ-D004 | 2026-10-21 | UI is stored as data: one JSON node tree per document, typed by registered components with manifests. No raw HTML nodes. | Every prior raw-HTML draft had injection holes; manifests drive the editor and validation. |
| AZ-D005 | 2026-10-21 | Named actions replace callbacks. | Callbacks can't be stored in a database (Azekah 0.1 lesson). |
| AZ-D006 | 2026-10-21 | Design tokens as rows, emitted as CSS custom properties; breakpoints via generated stylesheets. | Tokens cross shadow DOM; fixes the `strings` inline-style gap. |
| AZ-D007 | 2026-10-21 | Azekah owns the visual layer only; the commerce engine owns all commerce data and logic and works fully without Azekah. | Must not contradict or take away from the engine. |
| AZ-D008 | 2026-10-21 | Commerce elements live in the engine repo and depend only on the `@azekah/runtime` library, never on the Azekah service. | Keeps the engine self-sufficient while sharing one element toolkit. |
| AZ-D009 | 2026-10-21 | Settings over choices (mirrors commerce D-009): delivery mode, DOM isolation, branding source, and content system per site are settings. | User direction. |
| AZ-D010 | 2026-10-21 | Users are shared through `lyre-auth` (commerce D-012). | Shared user records across systems. |
| AZ-D011 | 2026-10-21 | lyre-content keeps working; Azekah offers an importer and an adapter rather than replacing it. | Aspire depends on it today. |
| AZ-D012 | 2026-10-21 | Rebuild inside this repo. The Angular 0.1.15 code is preserved with a `legacy/angular` tag before new code lands. Resolves AZ-Q001. | User decision. |
| AZ-D013 | 2026-10-21 | Components are authored in Svelte 5 and compiled to custom elements. Resolves AZ-Q002. | User decision; matches our stack. |
| AZ-D014 | 2026-10-21 | "Kunguru" is dropped from scope. Resolves AZ-Q008. | User decision. |
| AZ-D015 | 2026-10-21 | **Sequencing:** Azekah work starts only after the commerce engine is stable, meaning engine phases 0–4 are complete and the engine is in production use with its pilot tenants. Supersedes "runs in parallel" in 03-roadmap. | Engine first. |
| AZ-D016 | 2026-10-21 | Because Azekah comes later, the engine's commerce elements are first built as plain custom elements in the engine repo, and move onto `@azekah/runtime` once it exists. Supersedes the timing in AZ-D008; the dependency direction is unchanged. | The engine must not wait on Azekah. |
| AZ-D017 | 2026-11-20 | **Supersedes AZ-D015 for the shared foundation only.** Owner override: the portable runtime, the manifest/provider schema and provider-owned widget packs may start now. The visual editor, the Azekah service, hosted rendering and the database remain gated behind the original D015 rationale (engine stable, pilot tenants). | Cross-app widgets (Shop, Events, Ads, Toafom) are needed now; they need no editor or service. D015's reason (Azekah must not take away from the engine) is kept by AZ-D008/D018. |
| AZ-D018 | 2026-11-20 | Provider widgets are owned and shipped by the provider's repo and work with no network dependency on the Azekah service. Azekah registers their manifests; it never hosts their data or logic. Extends AZ-D008 from commerce to every provider. | A Shop widget must work when Azekah is down. |
| AZ-D019 | 2026-11-20 | "Widgetify" is a capability inside Azekah (the provider contract, manifests and widget packs), not a separate app, database, dashboard or deployment. There is one editor, owned by Azekah. | Avoids a second builder. |
| AZ-D020 | 2026-11-20 | Shared packages live in this repo (`packages/*`) after the `legacy/angular` tag (AZ-D012). Names: `@azekah/schema`, `@azekah/runtime`, `@azekah/core`, `@azekah/sdk`, `@azekah/adapters`; names are confirmed when the first package is created. | One repo, as AZ-D012. |
| AZ-D021 | 2026-11-20 | Accounts stays the app catalogue and authorization authority. Manifests reference an Accounts app identity; Azekah keeps no app catalogue. `<nipate-apps>` stays canonical in Accounts (`src/lib/embed/nipate-apps.js`); Azekah ships only a manifest/wrapper that loads Accounts' script. | One implementation, no competing copies. |
| AZ-D022 | 2026-11-20 | Existing content systems are the baseline, not a rival: the document model is a typed superset of lyre-content sections (component name + texts/buttons/icons + `data` queries) and contentkit's `registerDef`. Importers and adapters per AZ-D011; the Aspire registry keeps working unchanged. | Aspire runs on lyre-content today. |
| AZ-D023 | 2026-11-20 | Cross-app relations (artist<->Events, artist<->Shop, event<->Shop) are stored by the app that can verify them, as provider-scoped references with a status (`claimed` / `verified` / `revoked`) and a recorded actor. Azekah and widgets never infer or store these. See 06-cross-app-links.md. | An unverified claim must not render as official. |
| AZ-D024 | 2026-11-20 | Stored configuration is data only: no `eval`, no raw HTML, no callbacks. Expressions use a minimal safe language (resolves AZ-Q005 once the spec in 04 is accepted). | AZ-D004/D005, restated for widgets. |
| AZ-D025 | 2026-11-20 | Ads keeps full authority over serving, tracking and accounting; the Azekah Ads widget wraps the existing versioned Ads SDK and never reimplements decide/impression/click. Paid placements are always labelled sponsored. | Existing privacy model. |
| AZ-D026 | 2026-11-20 | Implementation of the foundation is delivered as separate reviewable PRs per repo (azekah, simple-shop, events, toafom-ui, ads, accounts), one consolidated PR per repo, after owner approval to publish. | shared toolbox policy. |
