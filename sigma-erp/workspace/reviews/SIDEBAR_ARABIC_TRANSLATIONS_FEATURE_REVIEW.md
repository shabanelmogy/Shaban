# Selected sidebar Arabic translations — implementation continuation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Authorization | Owner instruction: طبق التعديلات |
| Scope | Equipment Rental; Limousine → Reports; Assets; main Reports including salesperson reports |

The initial read-only review and the implementation amendment frozen before editing were moved concurrently into [the historical review](Archive/Completed/2026-10-23/SIDEBAR_ARABIC_TRANSLATIONS_FEATURE_REVIEW.md). Preserve that archive without rewriting its findings. This current continuation records the authorized implementation and final reconciliation; the historical Frozen status is not a claim of runtime closure.

## Contract and conformance

Tier S, sidebar vocabulary only. Authority: Master1/4/5/7 and UI1/23/29, applied through the current sigma-screen-refactor skill. Existing SidebarMenu/MenuCatalog/PanelMenu is the UI shape; no backend shape, API, report calculation or new business workflow applies. Phases0/5/6 apply proportionally to key inventory, consumer wiring and source reconciliation.

| Concern | Book block | Reference / shared owner | Final match |
|---|---|---|---|
| Exact language paths | UI23 | `vocabs/en.ts`, `vocabs/ar.ts`; actual catalogue titles in `sidebar-menu-data.ts` | Added exactly84 missing consumed Arabic leaves; no English edits for this task |
| Navigation shape | UI1 | SidebarMenuComponent / MenuCatalog / existing PanelMenu | Preserved keys, routes, disclosures and runtime translation ownership |
| Guide handoff | Master7; UI23 | SHARED_SCREEN_GUIDANCE; existing GuideReader overview | Added one bilingual navigation paragraph; existing import/property/template loop confirmed |
| Verification | Master7; UI29 | Scoped source inventory/diff | Source-only checks; compilation, runtime and visual acceptance pending |

The user authorized the confirmed missing-key corrections, preserving the three existing Arabic values and the proposed terminology in the historical review. No screen body, route, database translation, other Limousine entry or business rule is changed. Do not add the three unused reportss aliases just for dictionary-block parity.

## Implemented result

| Selected subtree | Labels consumed | Arabic additions | Missing Arabic after change | Missing English |
|---|---:|---:|---:|---:|
| Equipment Rental | 6 | 5 | 0 | 0 |
| Limousine → Reports | 3 | 3 | 0 | 0 |
| Assets | 7 | 7 | 0 | 0 |
| Main Reports | 71 | 69 | 0 | 0 |
| Total | 87 | 84 | 0 | 0 |

Existing equipment-guide, trial-balance and driver-time-sheet labels are unchanged. Equipment wording reuses its guide topic names; Limousine report wording reuses existing Arabic screen headings. The asset sidebar uses الإهلاك as proposed in the frozen review.

The amendment chose conservative literal wording for ambiguous source labels while retaining their original English qualifiers:

| Key under sideMenu.reportss | Implemented text |
|---|---|
| outstandingAgreements | الاتفاقيات القائمة (Outstanding) |
| rentalVehiclesOnServiceReplacements | مركبات التأجير ضمن استبدالات الخدمة (Rental Vehicles On Service Replacements) |
| vehicleChargedVsDriven | المفوتر مقابل المقطوع للمركبة (Vehicle Charged Vs Driven) |

Keep CID and AUH unexpanded; Download Description is translated literally. These wording choices do not establish a settlement state, replacement workflow, distance/currency unit or service behavior. Fully localized business-specific replacements for the three qualifiers remain pending confirmed report semantics; the existing placeholder routes cannot prove them.

## Final reconciliation and evidence

- TypeScript AST inventory of the actual four catalogue subtrees resolves all87 consumed labels in both dictionaries; every Arabic value is nonempty and contains Arabic text.
- Parsed Arabic/English vocabulary, menu catalogue and shared guide syntax without diagnostics. This is source parsing, not Angular compilation or typechecking.
- Compared Arabic sideMenu leaves with repository HEAD: exactly84 additions, zero changed/removed prior values, zero additions outside the frozen scope. No duplicate Arabic sideMenu property exists.
- Scoped whitespace diff check passed. Reviewed the full scoped diff and preserved preexisting login vocabulary, concurrent shared guide/loader/sidebar/theme/account-guide and unrelated changes. Only the Arabic additions and one guide paragraph belong to this implementation.
- The standard line-based parity checker reports four missing Arabic keys: three unused aliases plus the multiline vehicleChargedVsDriven entry it cannot parse. Its four apparent missing-English entries are also multiline-parser limitations. The full AST confirms all consumed paths; the checker itself was not changed.
- The shared guide paragraph explains the four navigation groups and retained English qualifiers. Its existing GuideReader consumer was confirmed; no new guide route or reader was created.

Packet maintenance: the initial implementation check passed. A later check detected concurrent provenance drift; by the subsequent inspection/check, generated fingerprints were current. Normalized procedures and approved-reference lists match all eight templates. Final full generator -Check passed for PLAN-00 and PHASE-00 through PHASE-06. This implementation did not regenerate or directly edit any packet; the prior review's separate derivative refresh remains documented historically.

No new reusable rule was introduced, so canonical books and the skill require no feature-specific additions. No agent implementation was needed for the single-dictionary change. No build, tests, lint, browser/runtime check, database command, migration, commit/push or deployment ran. Runtime dictionary overrides may affect deployed labels; source-only evidence cannot establish their current values or visual rendering. Owner runtime/RTL/layout acceptance remains pending.

Suggested future commit: `fix(i18n): translate selected sidebar groups into Arabic`; stage only intended translation/guide hunks alongside preserved peer changes.
