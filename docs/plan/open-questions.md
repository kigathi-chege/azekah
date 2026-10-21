# Open Questions

Move each item to `decisions.md` once resolved.

| ID | Question | Notes |
|---|---|---|
| AZ-Q003 | Server rendering of elements: Declarative Shadow DOM, light-DOM SSR, or both depending on the isolation setting? | Affects SEO for hosted sites. |
| AZ-Q004 | Inspector: upstream jedison, another JSON Schema form library, or our own built on the core pack? | Our own would dogfood `az-form`. |
| AZ-Q005 | Expression language: adopt an existing safe one (e.g. JSONata, Liquid-style filters) or define a minimal one? | Must never allow arbitrary JS. |
| AZ-Q006 | Domain and product name for the hosted service. | |
| AZ-Q007 | Does the simple-shop storefront move its pages to Azekah documents, and when? | Per-tenant setting per 02-architecture §11; timing open. |
| AZ-Q009 | Hosting for the Azekah service (shared with the engine's hosting decision, commerce Q-004). | |
