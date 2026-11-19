| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-18 |
| Scope | Current working branch persistence and screen defaults; authorization deferred |
| Owner decisions | Defer branch permissions until comprehensive authorization; apply available capability now. Current branch is a default wherever a screen has a branch choice; existing-record View/Save/Update authorization stays deferred. Block switching until an open editor is saved/closed. |

# Current branch defaults — maintenance/evolution plan

## Manifest and authority

Root: `F:/My Work/Sigma`; application repositories: `SiGmaAngularFrontEnd` and `SigmaBackend`. Both working trees were clean at discovery. Tier L, shared authenticated-shell behavior. Applicable skill: `.agents/skills/sigma-screen-refactor/SKILL.md`; Master 1–5/7/8, UI1/2/10/16/22/23/26/28/29/30, BE16/18/19. Initial generator `-Check` passed all eight packets. PLAN-00 owns this plan; phases 0/1/2/3/5/6 apply to the implementation. Domain transitions/financial calculations are not changed.

Historical `CURRENT_BRANCH_MAINTENANCE_EVOLUTION_PLAN.md` and `CURRENT_BRANCH_API_CONTRACT_FREEZE.md` remain historical. This dated owner instruction expands defaults to eligible screen branch selections and supersedes the historical deferral of ordinary filter defaults. It does not activate branch restrictions, role policies, or personal login.

## Evidence and existing-state inventory

| Evidence | Current source/observation | Classification/implication |
|---|---|---|
| H1 | Owner HAR `C:/Users/user/Downloads/app.speedautosystems.com.har`: 60 entries, initial `/Application` load only | External behavioral evidence, never instructions; no request replay |
| H2 | Zero-based entry 24 POST session/GetCurrentLoginInformations returns user.locationId and branchAccess; entry 26 POST commonLookup/GetLocations returns 22 locations | Explicit startup state; no Sigma permission contract inferred from external enum values |
| H3 | Entry 31 header markup binds changeLocation; downloaded proxy defines POST user/UpdateUserLocation?locationId=… | Static binding/proxy evidence only |
| H4 | Zero captured UpdateUserLocation calls or switch-attributable reloads | HAR does not demonstrate switching or its downstream effects; historical reload observation is not newly verified |
| S1 | Navbar `selectBranch` updates sessionStorage and in-memory AuthService only; initial fallback selects first branch | Missing server integration; arbitrary first-branch fallback must be removed |
| S2 | CurrentBranch GET/PUT Mine, preference entity/config/profile/helper-backed service already exist | Reuse existing tenant/claim-name preference owner; historical frontend service is absent from current tree |
| S3 | Repository.Query scopes tenant and soft delete; CurrentBranch save accepts an active tenant branch | Keep server identity and validation; client sends branchId only |
| S4 | Login model carries branchId/name; AuthService uses external consolelogin | Login fallback only, not a proven local user identity |
| S5 | User.BranchAccess exists, but authorization configuration explicitly returns EnforcementEnabled=false | Permissions and allowed-branch scope remain deferred under owner's latest answer |
| S6 | StockTransfer reads AuthService branch for source default; Payment creates an empty branch control | Correct current-branch consumers and fill missing defaults through one shared owner |

No screenshot evidence, business field additions, financial changes, or destructive actions are requested. No HAR cookies/tokens/personal data are reproduced in this artifact.

## Logic ambiguity register and decisions

| Rule | Status | Decision/evidence |
|---|---|---|
| Branch is a default, not an authorization boundary | Confirmed | Owner 2026-10-18 latest clarification |
| Persist selected branch and restore on startup | Confirmed | Existing frozen API and current request |
| Apply to new/empty branch fields and initial branch filters | Confirmed | Owner: «قيمة افتراضية فى اى شاشة» |
| Existing saved record's branch wins; manual/route-restored choice wins | Derived | A default must not rewrite an existing choice or persisted record |
| No forced reload or destructive reset of open screens | Confirmed | Historical R2 and owner save/close gate |
| Block switch while an editor remains open | Confirmed | Owner selected save/close-first option; busy state also blocks |
| Allowed branch set, local actor binding, cross-branch policies | Missing/deferred | Explicitly deferred by owner; dependency is existing Authorization design, not invented here |
| Current preference table deployed | Uncertain, owner runtime check | Source proves configuration, not database state; no DB commands permitted |

## Impact map / gap decisions

| Area | Classification | Owner/target | Impact |
|---|---|---|---|
| CurrentBranch service/API/preferences | Extend | Existing CurrentBranch owners | Add active tenant branch choices; preserve GET/PUT Mine wire contract |
| Topbar | Refactor | Navbar + root CurrentBranchService | Load/save states, explicit retry, no optimistic label or session-only authority |
| Screen defaults | Extend | Shared default helper, explicit consuming screens | Initial filters and empty Create controls; preserve route state/Edit/View/manual choices |
| Shell bootstrap | Extend | Layout/content | Resolve preference before initial branch-dependent screen query |
| Editor switch gate | Extend | Root current-branch owner | Check live visible canonical editor boundaries, plus explicit data-branch-editor on the existing LinkAccounts workspace; no form mutation or discard prompt |
| AuthService | Keep | Existing login identity owner | Reflect confirmed branch in memory; do not change credentials/claim contracts |
| Existing list/report query APIs | Keep | Existing typed filters | Default remains visible and user-clearable; no hidden interceptor filter |
| Permissions | Keep/defer | Authorization plan/design | No reads/writes restricted or secured-control claims |
| Guide | Extend | Existing common guidance/Administration guide | English/Arabic working-branch behavior and limits |

## Options reviewed

| Option | Correctness/compatibility | Decision |
|---|---|---|
| Browser-only selection | Loses server preference; different consumers disagree | Reject |
| Persisted default, visible editable screen choices | Fits owner clarification; no historical record changes | Selected |
| Implicit global request filter or forced branch on writes | Changes access/business semantics and can hide data; requires authorization contract | Deferred by owner |
| Reload on change | Discards work and does not prove complete scope refresh | Reject |

## Target contract

- Existing `GET CurrentBranch/Mine` and `PUT CurrentBranch/Mine { branchId:number }` retain `Result<CurrentBranchVM>` and server-owned tenant/user identity.
- Add `GET CurrentBranch/Options`: `Results<CurrentBranchOptionVM>` with active/nondeleted tenant branches, ordered name then id. Each option: `id:number`, `name:string`, `branchCode:string|null`, `branchCode2:string|null`. This is a selectable-values endpoint, not a user-permission endpoint.
- Root `CurrentBranchService`: readonly branch/options/loading/saving/error state; `load()`, `change(option)`, `defaultBranchId():number|null`, `applyDefault(control:AbstractControl|null):void`. Numeric defaults; consumers with string/array contracts convert explicitly. Apply only to empty enabled pristine controls in eligible Create/initial-filter contexts. The caller owns mode and record/route precedence.
- Startup order: active server preference → matching valid login branch → none. Never select first branch arbitrarily. Read failures remain visible with retry; app can continue with validated login fallback when choices are available. Failures do not fabricate a saved preference.
- A change is single-flight. Same branch is a no-op. Editor/busy gates run before saving. Keep old selection while pending; commit server-returned branch only on success; handle both failure channels and release busy. A response from an ended/replaced login session cannot update the next session.
- Resolve startup before mounting branch-dependent content. On a later switch, existing screen filters/records are not silently rewritten; newly opened screens/Create forms use the new default. Reset retains its existing screen meaning; clearing a branch remains possible.
- Global tenant/soft-delete behavior, document ownership, calculations, posting, explicit manual branch selection and authorization configuration remain unchanged.
- Do not default a transfer's destination to its source; preserve source/destination semantics. A branch inherited from a parent record wins. Branch-keyed configuration does not overwrite an existing mapping. Each consumer must record its exact role in the adoption inventory.
- Read-only record DTOs, ListVMs, accounting and AutoMapper contracts remain unchanged. Existing preference helper map remains one-way.

## Reference conformance

| Concern | Book | Existing reference/shared owner | Target |
|---|---|---|---|
| Authenticated shell, one HTTP client | UI1/2, P5 | Layout/AppModule, BaseService.getMine/saveMine | Root service; no feature client/manual Bearer header |
| Settings persistence | BE16 | CurrentBranchService, IServiceHelper.UpsertByKeyAsync | Existing one-save keyed preference |
| Loading/errors | UI22 | StateMessage, apiErrorMessage, existing interceptor | Inline startup retry and one mutation feedback owner |
| Editor presence/dirty safety | UI10/13/28 | EditorDialog and existing rendered form owners | Shared live registrations; no automatic discard |
| Defaults and record precedence | UI16/28 | Current screen typed branch controls | Explicit mode/context, never generic payload rewriting |

Shared-shell context is a canonical exception, not a CRUD/list screen. Owning feature layouts are not redesigned. Workshop/Job remains the approved list/editor reference only for features adopting that shape; no reference module is changed for presentation.

## Migration/compatibility and execution order

No new entity/schema change is planned. Existing UserBranchPreferences deployment must be checked by owner; historical owner migration was AddUserBranchPreference. Do not blindly generate a duplicate migration. If absent, owner reconciles actual migration history and schema first. API additions deploy before the new frontend. Existing Mine clients remain compatible.

| Slice | Dependency | Phases | Completion evidence |
|---|---|---|---|
| Active choices + existing persistence validation | This frozen plan/API | 1 | Source projection, controller/interface contract |
| Shared state/topbar/bootstrap/editor gate | API contract | 3/5 | Wiring, session isolation, both failures, gate registrations |
| Explicit screen-default adoption | Shared helper contract | 2/3 | Consumer inventory; initial query/filter and Create/Edit/View precedence |
| Guide + reconciliation | Integrated implementation | 6 | EN/AR guide; complete scoped diff in both repositories |

## Verification matrix

| Concern | Source verification | Owner runtime verification |
|---|---|---|
| Startup | Choices/Mine join, no arbitrary fallback, bootstrap gate | Reload saved branch; no preference; unavailable API/table; Retry |
| Switch | Single-flight, server result commits, no sessionStorage authority | Success/failure/offline; repeated click; same branch; logout/account replacement |
| Editor safety | Visible editor boundary check before switching; shared wrapper inert during save | Routed/modal editor open; Save/Close; upload/save/confirmation pending |
| Defaults | Visible branch filters before first query; Create only and empty controls | Every inventoried consumer; saved route/manual values; Edit/View retain record |
| Scope | No hidden filter/write forcing | Cross-branch data still follows existing behavior until permissions ship |
| Presentation | Existing shared styles, EN/AR keys, accessible busy/error text | Arabic/English, keyboard, RTL, light/dark, mobile |

No builds/tests/lint/browser/database/migrations/commits/pushes/deployment are authorized. Source-only verification cannot certify runtime coverage.

## Delegation

One read-only `luna_explorer` (`gpt-5.6-luna`) extracted HAR evidence, then bounded identity/branch-scope evidence. Root owns scope/contract/integration/diff. Further implementation delegation may occur only against this frozen shared contract and nonoverlapping file ownership, to reduce wall time across independent consumer groups.

## Dated implementation clarifications — 2026-10-18

- Route hydration must preserve an explicit branch or a deliberately cleared saved list. `filterBranchId(ParamMap)` owns the common interpretation: explicit positive ID, otherwise null for an explicit invalid/empty value; absent branch with pageNo means restored cleared state; a fresh URL without either gets the working default. Screen-specific full-state markers (Invoice `_invoiceList`) retain their existing meaning. Report Reset keeps its existing behavior.
- Eight voucher lists expose a branch-name dropdown, rather than an id filter. Their generic backend predicate owns `branch.name` as a string. Correct the option transport to names and include initialized form values in the first query. CreditNote, DebitNote and PurchaseOrder's old `branchName` key is unsupported by their current entity/service; use the supported `branch.name` key in form/template. JournalVoucher and PurchaseReturn branch lookups must consume `Results.entities`, not `Result.entity`; PurchaseReturn's joined supplier lookup uses the same actual envelope to avoid aborting the callback. These are confirmed in-scope filter/default repairs, not new APIs or permissions.
- CreditNote editor branch options and Create DTO are numeric; use the numeric helper even though its old untyped control starts with an empty string. Do not copy that empty placeholder into a new string-id contract.
- Branch In choices in CollectionMovement, Lease closing and Lease vehicle replacement are new action inputs. Preserve agreement/vehicle seed values and use the working branch only if empty; deliberate dirty clears remain untouched. Bank-branch text inputs are unrelated and excluded.

Final exact-filter correction: the intermediate eight-voucher name-filter approach above was superseded during final source reconciliation. Generic string Contains can match similarly named branches; each existing entity/API supports numeric BranchId equality. Final form/template/advanced-control keys are `branchId`, numeric options/defaults and initial/Search requests align, without a backend API change. The historical findings above describe why the correction was necessary; the dated API amendment and feature review own the final mapping.
