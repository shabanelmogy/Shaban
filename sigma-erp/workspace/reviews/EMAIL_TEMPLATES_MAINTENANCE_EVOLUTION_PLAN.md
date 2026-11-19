# Email Templates — Maintenance / Evolution Plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-17 |

## Existing-state inventory / impact map / gap decisions
| Area / owner | Existing behavior and consumers | Decision / target | Risk and phase |
|---|---|---|---|
| Angular emailTemplates | Untyped selector/body-only form, blind Save, no error or dirty guard | Refactor shared settings shell; Extend subject/CC/BCC and catalog | UI behavior,3/5 |
| EmailTemplatesController + service | Raw GET and POST Result, key-upsert via helper, one save | Keep transports; Extend typed Options and lean fields/validation | Coordinated API rollout,1 |
| EmailTemplate entity/config | Type/body only; inherited tenant; no unique key | Extend nullable headers and filtered logical key uniqueness | Historical headers null; owner duplicate review + migration |
| Enum | IDs0..12 | Keep explicitly; append six13..18 | Never renumber persisted values |
| Mapper | AddBaseVm/ReverseMap; unused broad detail | Refactor directional lean read/write maps | Symbol search and source audit |
| Token catalog | Missing | Create backend metadata from all screenshots | No token replacement or runtime data invented |
| Guide/i18n/toolbar | Administration guide/menu and route exist | Extend only relevant topic/keys/title exclusion | Preserve working-tree edits |
| Delivery, reports, financial effects | No consumer found for template settings | Keep outside scope | No send action or accounting effect |

## Alternatives and decision review
1. UI-only subject/CC/BCC would lose values on refresh: rejected.
2. New parallel template CRUD/table/mail sender: duplicates current settings owner and invents delivery workflow: rejected.
3. Extend current keyed settings plus lean metadata: selected under user implementation request and Master2 owner standing rule. Nullable historical headers avoid rewriting old data. Save requires a user-supplied subject. New enum values append, never shift old IDs.

Detailed target contract is frozen in EMAIL_TEMPLATES_SETTINGS_CONTRACT_FREEZE.md. No destruction/access/accounting decision is taken. Unknown production duplicate count is an owner migration precondition, not an assumption that data are clean.

## Dependency-ordered slices and verification
Phase0 evidence/source discovery -> Phase1 freeze -> backend and frontend bounded independent implementations -> guide/integration -> root Phase6 complete scoped diffs. Phase2 no list; Phase4 no transitions. Source-only: check mappings, property/type/case parity, catalog tokens, failure retention, request cancellation, translations, guide/route, schema impact, merge markers and whitespace. Builds/tests/lint/browser/DB/migrations/commits/deployment prohibited and owner pending. Rollout: owner inspects duplicates, generates/reviews/applies migration, backend then matching frontend; do not roll frontend against old API. Rollback requires owner-devised schema/data review; no automated rollback/destruction.

