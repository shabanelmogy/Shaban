| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Shared JV loading appearance — maintenance/evolution plan

Owner explicitly requests unifying the JV loader in Customers, Suppliers and program startup, documenting it and removing other loaders. Tier L, presentation/lifecycle scope, implementation authorized by the request; no business/API/schema change. Initial Generate-SigmaRecipes -Check passed all eight. Existing Customers/Receipts/shared vocab changes and prior Supplier current-balance changes remain untouched except focused loading/guide edits.

## Existing owners and impact map

| Area | Current source/evidence | Disposition / target |
|---|---|---|
| JV page | JVs list/detail start/finalize LoadingService; list suppresses table indicator; Layout renders StateMessage ring | Keep canonical actual appearance: primary ring36px/3px/900ms + inner ring,44px in page card |
| StateMessage + Layout | component SCSS owns ring; shell content overlay owns44px card/surface | Refactor presentation into one early-loaded shared CSS asset; retain StateMessage as status/error/empty owner and existing shell host |
| Startup | index.html modern-spinner uses48px/4px/#009ef7 and separate rotation/pulsing text/card | Replace obsolete loading skin with the same shared ring/status/card; native body-root bootstrap still removes splash |
| Shared controls | PrimaryActionButton/EditorDialog have rotating refresh icons; DataTable falls back to PrimeNG spinner | Replace owned loading visuals with shared ring; retain busy inputs, aria-busy, disabled/events and global suppression. Adapt publisher select loading icon to same primitive; no vendor source edits |
| Customers | eight active screens, profile/driver/report/history dialogs, many already adopted StateMessage/reference status and local reads | Reconcile one visible owner per operation; no private spinner or duplicate table/select indicator; source contracts/cache/watch/errors preserved |
| Suppliers | four active screens; lookups show duplicate select icons; statement dialog uses hidden global progress; Supplier detail mixes local read StateMessage/global count | Refactor read progress ownership and duplicate indicators, retain Save/Delete global counts and local busy state |
| Shared errors | errorInterceptor decrements anonymous global counts without start, alongside owner finalize | Remove unowned release; feedback/401 and write-navigation service remain unchanged |
| Docs/guides | UI22 appearance/error text, UI24 shared appearance, skill digest; generated phase packets | Extend canonical ownership and skill together, regenerate only via generator, review dependency/rule semantics and -Check |

## Options and frozen decisions

Copying JV styles into each feature is rejected: one source prevents drift. A second Angular loader component is unnecessary: StateMessage and existing control owners already exist. A separate bootstrap-only skin is rejected. Chosen: one native CSS asset referenced in index head, available before JS and to all current shared owners. Its public ring/status/card/overlay classes preserve the current JV values; local sizes are the same ring scaled by CSS variables. Static startup labels remain readable before Angular translations; application labels retain translation keys.

Remove actual competing loaders/animations in requested scope, not request state/errors/Retry. Do not delete decorative animated counts/skeletons: they are data-placeholder presentation, not page-loading owners; branch request icons use the ring. Retained reference refresh remains silent under UI2 with the existing shared header badge. Shared changes apply generally, no per-screen opt-in for the unified appearance. No unrelated app-wide feature sweep.

## Work slices / verification

Root freezes this plan and UI handoff before delegation. One disjoint Customers-only worker may change Customers files and its directly owned guide text, preserve all existing changes, and report evidence. Root owns shared owners/startup/Suppliers, canonical docs/skill/packets, guides/integration and final diff. No overlap. Source-only: no builds/tests/lint/browser/runtime/DB/migrations/commits. Syntax/public API/import/translation and complete scoped diff checks; runtime visibility/motion/RTL/theme/sizing/overlap/cancel and startup offline asset behavior remain owner acceptance.

No data/API/financial/permissions/migration impact. Performance review covers same requests/queries/cache source matrices from current Customers and Suppliers reviews, plus one tiny static startup CSS request; no speed improvement is claimed. SQL/index changes are neither needed nor authorized by this presentation task. Exact implementation/evidence goes in SHARED_LOADING_UNIFICATION_FEATURE_REVIEW.md.

Pre-implementation source refinement: UI29's copied-asset CriticalCSS limitation and critical startup guidance favor keeping the **single shared loading stylesheet inline in index.html head**. This supersedes the separate-asset placement and adds no new request; all owners still use the same ring/status/card classes. No JavaScript or feature CSS copy is needed. The UI handoff records this refinement before editing source.
