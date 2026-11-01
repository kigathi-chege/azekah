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
