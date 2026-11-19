| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Correct Vehicle Status final reconciliation — 2026-10-14

## Delivered

The screen now uses the Sigma routed editor shell and shared title, section, summary-card, state-message, field-error, dropdown, primary-action and confirmation owners. Vehicle selection is typed and nullable, reads use `switchMap`, old responses are ignored, both Result and transport failures retain inline recovery, and correction is guarded against duplicate clicks and stale suggestions. The page title is excluded from the Metronic toolbar.

The backend now derives a nullable target from the latest supported Agreement, AgreementDelivery, Workshop, NRM or collection evidence. An open Agreement/AgreementDelivery suggests Hired, supported Workshop/NRM movement suggests Workshop/NRM, and canonical Lease collection rows (including `Type=null`) suggest Available. Unsupported, tied, replacement-only, sold-NRM and terminal/disposal cases remain without a guessed target. The write re-reads the snapshot, validates the expected target, appends one history row only when the status differs, and returns the updated detail snapshot. Tenant ownership is repository-owned; no SubscriptionId is accepted or assigned.

## Contract comparison

| Path | Producer | Consumer | Status |
|---|---|---|---|
| Vehicle lookup | `GetVehiclesPlatNo` → `Results<DropdownDto>` | typed dropdown `DropDownSelect[]` | Matched; inline failure/retry |
| Status read | `CurrentStatus/{vehicleId}` → `Result<VehicleStatusCorrectionDetailVM>` | typed detail model and shared status cards | Matched; current/suggested/canCorrect/last movement |
| Correction | `POST Update` with vehicle + expected suggestion | guarded confirmation and snapshot replacement | Matched; one append-only save; stale expectation = 409 |
| Auth/tenant | `[Authorize]`, repository tenant scope | root interceptor client | Matched; no invented role API |
| Translations/guide | EN/AR feature keys, Administration guide topic | template and UserGuide reader | Matched; parity check passed |

## Evidence and unresolved limits

The attached screenshot is functional/content evidence (`E1`): vehicle selector, current status, last movement fields, suggested status, and correction action are explicit. It does not determine styling, control choice, backend semantics or state authorization. The derived-target policy is a reviewer decision under the owner's standing Missing-detail rule, grounded in existing movement writers and `LeaseAgreementService` status writes. Cross-writer fleet-wide concurrency is not claimed: the existing correction-only application lock does not coordinate unrelated movement writers.

No entity, EF configuration, migration, model snapshot, or persisted history rewrite was added. `Add-Migration` is not required. The controller remains a custom domain-action controller because generic CRUD would expose unsupported operations.

## Verification

Performed: recipe `Generate-SigmaRecipes.ps1 -Check` (all packets OK); `Check-Translations.ps1 -Block correctVehicleStatus` (14 EN / 14 AR, no missing/case differences); XML parse of both GeneralMessage resources; source brace/parenthesis balance; scoped `git diff --check` and complete scoped diff review in both repositories. Not performed per Sigma execution boundary: build, tests, lint, browser/runtime, database, migration, deployment, commit or push.

## Guide handoff

Content: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/administration-guide.ts`; route/menu entry: existing `/CorrectVehicleStatus` route and Administration sidebar entry; topic: `correctVehicleStatus.title`. Covered: prerequisite vehicle selection, server-derived suggestion, unavailable/ambiguous evidence, confirmation, append-only correction, refresh/retry and failure behavior in EN/AR. Owner must verify navigation, keyboard focus, RTL, dark theme, narrow/intermediate widths, no page scroll, API authorization, stale movement replay and persisted status history.

## Suggested commits

`SiGmaAngularFrontEnd`: `fix(correct-vehicle-status): derive and confirm vehicle status corrections`

`SigmaBackend`: `fix(correct-vehicle-status): validate and append derived vehicle status corrections`

Documentation artifact: `docs(correct-vehicle-status): record status correction contracts and guide handoff`

Agent utilization: one backend implementation agent was delegated after Phase 1 freeze but exhausted its usage limit before delivery; the root agent completed and reconciled the backend and frontend changes. No overlapping ownership was retained. Prohibited commands (builds, tests, lint, browser, database, migrations, commits, pushes, deployment and Graphify) were not run.

## Compiler-feedback follow-up — 2026-10-14

Owner supplied TS2724 importing CorrectVehicleStatusRequest from ../models/create. At inspection time, current models/create.ts already exports CorrectVehicleStatusRequest with vehicleId:number and expectedSuggestedStatus:CorrectionVehicleStatus, and correctVehicleStatus.service.ts imports that exact symbol/path. The owning list sends precisely those fields to service.correct; the legacy correctVehicleStatusDTO is absent from these feature files. Therefore no additional alias/rename or application-source change was necessary for this error. The supplied compiler diagnostic describes source different from the current files; an incremental cache cause is possible but not verified.

Read-only source evidence: actual exported-interface AST and exact service import checked; parsing both reported feature folders (13 TS files) yielded zero syntax errors; scoped git diff --check passed. No build/type-check/test/lint/cache deletion or runtime/database/browser commands run. Owner should rerun the build against the current checkout; if a watch process repeats the old missing-export diagnostic, restart that process. No migration, guide/workflow change, new shared rule/extraction or subagent required.

## Repeated TS2724 follow-up — current resolver evidence

The owner repeated TS2724 after the previous source inspection. TypeScript resolveModuleName with the actual tsconfig.app.json resolves ../models/create from correctVehicleStatus.service.ts to F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/correctVehicleStatus/models/create.ts. That exact file exports CorrectVehicleStatusRequest (vehicleId, expectedSuggestedStatus). A read-only process-path inventory confirms the running Angular CLI executable belongs to this same repository; it does not establish the watcher's in-memory source or rebuild success.

Both files were saved with explicit type-only imports: CorrectionVehicleStatus in models/create.ts, and CorrectVehicleStatusRequest in services/correctVehicleStatus.service.ts. This preserves the request contract and causes source change events for both dependency and consumer. No alias, old DTO fallback, new compiler root, cache removal, process restart, API change or guide change was introduced. The continued diagnosis refers to the historical correctVehicleStatusDTO export rather than the current source; its exact compiler-state cause remains unverified.

Post-edit resolver/declaration checks: correct absolute resolved path, exported=true, typeOnlyImport=true, correct imported symbol,0 parse errors; git diff --check passed. No app terminal is attached to this chat, so the live watcher output could not be inspected. Compilation replay remains owner-pending. No build/test/lint/runtime/browser/database/migration/commit/push command was run. Only the two import lines were changed in this follow-up; unrelated ongoing changes preserved.

## Translation-label follow-up — 2026-10-14

Owner reports raw correctVehicleStatus.statuses.Available on the screen. Confirmed cause: enumKey generates exact enum member names, while both feature vocabulary blocks used lower-camel-case names. Prior EN/AR parity checked the two vocabularies against each other and did not establish agreement with the actual enum consumer; the previous translation-conformance claim is corrected by this evidence.

Changed only correctVehicleStatus.statuses and movementTypes keys in en.ts/ar.ts to match CorrectionVehicleStatus (18 members, including Available/NRM) and CorrectionMovementType (16 members, including Nrm/Nrt), preserving all translated values and enum wire numbers. statusCards now depends on a toSignal subscription to TranslateService.onLangChange, so computed current/suggested text refreshes when language changes; movement text and confirmation resolve translations from their existing owners. No fallback hiding missing keys, enum-value change, payload, route, backend, permission or domain change.

Verification: exact-case source comparison found all34 enum-generated labels in each language,0 missing; Available resolves to Available (EN) / متاحة (AR). Check-Translations -Block correctVehicleStatus:57/57 keys,0 missing,0 case-only differences. TypeScript source parsing and git diff --check passed. New imports use the same installed shared Angular rxjs-interop API already present in the application. Runtime/build/visual acceptance remains pending for the owner: open current/suggested cards and last movement, switch EN/AR, and confirm the translated target in the correction dialog. Existing in-app guide topic correctVehicleStatus.title remains accurate; no action/workflow change requires new user instructions.

No build/test/lint/browser/application/database/migration/commit/push or prohibited server/tool command ran. No migration or additional shared extraction/new canonical lesson is needed: existing UI16 enumKey, UI23 exact casing and the existing language-event signal owner apply. No subagents used for this small, coupled label fix. Suggested scoped commit: fix(correct-vehicle-status): align enum translation keys.
