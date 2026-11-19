| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-18 |
| Scope | Persisted topbar working branch and eligible screen defaults; permissions deferred |
| Plan / handoff | CURRENT_BRANCH_DEFAULTS_MAINTENANCE_EVOLUTION_PLAN.md / CURRENT_BRANCH_DEFAULTS_API_CONTRACT_FREEZE.md |

# Current branch defaults — final source review

## Outcome and owner decisions

The topbar now reads/saves its working branch through the existing CurrentBranch API instead of sessionStorage. Active tenant choices are loaded separately. The server preference, then a matching valid login branch, then no selection determine the initial value; no arbitrary first branch. The initial content outlet waits for these reads to settle. Failed reads have visible Retry, failed writes retain the previous selection, and responses cannot cross authenticated-session replacement/logout boundaries. No page reload is used.

The owner clarified that the selection is a default in any eligible screen, and explicitly deferred View/Save/Update restrictions with comprehensive permissions. The owner also selected save/close-before-switching for open editors. These final instructions supersede the earlier consideration of immediately activating allowed-branch security. Existing permissions configuration, authentication/claims, tenant/soft-delete scope and financial behavior remain unchanged.

New forms and initial real branch filters receive the shared current default. Existing record/parent/manual/route-restored values win. Switching does not rewrite an already mounted screen. Filter clearing remains available, and saved list URLs retain deliberately cleared values. Stock transfers default source rows only, preserving destination semantics. The scope is a default and UI safety mechanism, not an authorization boundary.

## Evidence and boundaries

The supplied HAR is behavioral data, not instructions. It contains 60 requests for a single initial `/Application` load. Zero-based entry24 reads login context; entry26 loads22 locations; entry31 loads the header binding. There are **zero captured UpdateUserLocation invocations** and no switch-attributable reload. A downloaded generated proxy defines that request, which proves only its static shape. No request was replayed, reference website contacted, or personal/token/cookie data reproduced. The historical 2026-10-01 plan's claim of an implemented Angular service disagreed with current source; the historical artifact was preserved and this dated work records the correction.

Repositories were clean at discovery. Application changes are limited to the directly related working-branch owners and branch-selector consumers. No screenshots were supplied. No new permission, allowed-branch relation, token mapping, financial calculation or schema was inferred from the reference product.

## Files and actual consumers

Full per-file statements and line references are in [CURRENT_BRANCH_DEFAULTS_CONSUMER_INVENTORY.md](<CURRENT_BRANCH_DEFAULTS_CONSUMER_INVENTORY.md>); source parser/inventory details are in `CURRENT_BRANCH_DEFAULTS_SOURCE_REVIEW.json` with its reproducible read-only `.cjs` helper.

| Area | Changed owners / behavior |
|---|---|
| Backend | CurrentBranchController, ICurrentBranchService, CurrentBranchService, new CurrentBranchOptionVM |
| Shared frontend | new shared/models/current-branch.ts and shared/service/current-branch.service.ts |
| Shell | Navbar TS/HTML; Content TS/HTML; Layout TS/HTML/Module; explicit LinkAccounts data-branch-editor marker |
| Consumers | 94 branch-default component files across Accounts, Administration PaymentMethods, Banking, Customers, Equipment Rental, Fleet, HRM Payroll disbursement, Lease, Limousine, Movements, Rental, Reports, Sales, Staff, Stock, Suppliers, Vouchers and Workshop |
| Language/guide | current-branch.ts vocabulary imported into en.ts/ar.ts; shared-screen-guidance.ts EN/AR common guidance |
| Documentation | this review, plan/handoff/consumer inventory; dated authorization deferral appendix; UI1/UI16, skill/digest/revision row, changelog and regenerated packets |

### Representative mode/role coverage

| Consumer role | Rule / compared source |
|---|---|
| Routed Create | Payment, Receipt, JV, Bill, GRN, PurchaseOrder/Request/Return, Credit/Debit Note, Individual/Company, Vehicle, Staff, Sales equipment, WorkOrder: create mode determined before filling empty branch |
| Reused dialog Create | CashDeposit/CardTransfer create-only reset includes branch even if controls were disabled in the previous session; quotation/custody resets fill only the new draft |
| Parent-first actions | Rental/Lease deposits use the agreement branch first; Booking deposit uses booking branch first; fallback only when absent |
| StockTransfer | Captured current branch/name supplies source-row default; destination stays separate and no saved transfer is rewritten |
| Branch In actions | CollectionMovement, Lease closing and vehicle replacement keep source context, fill empty new action inputs only, and preserve dirty manual choices |
| Opening balances | New Account/CostCenter row factories default branch; loaded rows, including stored nulls, keep their saved data |
| Branch-keyed configuration | LinkAccounts PaymentMethods keeps its existing selected mapping branch, falls back to a valid current branch, and removes arbitrary first-branch fallback |
| Lists with route state | Shared filterBranchId distinguishes explicit positive id, explicit invalid/empty, restored clear with pageNo, and fresh default; Invoice keeps its existing `_invoiceList` full-state marker |
| Account/report descriptors | Existing branchId select initialValue gets the current branch before form construction; existing report Reset returns to its descriptor defaults |
| Legacy voucher lists | Eight actual selectors use exact numeric branchId and numeric lookup options; first query includes initialized values, Search preserves the selected id, Reset retains its previous clear behavior |

### Intentional exclusions / existing defects

- Administration Users.currentBranchId and branch-access fields are identity/assignment configuration, explicitly deferred with permissions; the Branch entity editor/list is branch maintenance, not working context.
- Existing branch-tariff/Common payment mappings keep their persisted assignment semantics. They are not silently repointed by the working default.
- Bank branch text in Lease payment instructions and legacy Customers/PDCReceivable is not a Branch id selector; source/destination location ids are not inferred to be Branch ids.
- Edit/View-only Workshop invoice uses its saved document branch. Payload-only branch fields without a selector are not fabricated. Disabled depreciation branch controls remain disabled.
- ProfitAndLoss legacy template advertises branch controls absent from its form; this pre-existing screen-contract defect was not expanded into new report work. No claim that a nonexistent selector is defaulted.
- Existing screens with no branch filter do not acquire one implicitly. No request interceptor injects a hidden branch scope.

## Domain/API/action reconciliation

| Contract | Final source comparison |
|---|---|
| Current preference | Existing authenticated GET/PUT CurrentBranch/Mine retained; request only branchId; username/tenant server-owned |
| Options | New authenticated GET CurrentBranch/Options returns Results<CurrentBranchOptionVM>: id/name/branchCode/branchCode2; no-tracking tenant/nondeleted active projection ordered Name/Id |
| Save ownership | Existing IServiceHelper.UpsertByKeyAsync plus one SaveChangesAsync; no extra transaction, map or database write |
| UI state transition | Previous branch -> pending single-flight -> server-confirmed branch; same branch no-op; failed/ended-session result cannot commit |
| Switch safety | Visible canonical routed/step/mock form/dialog/modal boundaries block; LinkAccounts explicit marker covers its workspace. Wrapper is inert during save. Existing close/discard owners remain responsible for closing forms |
| Initial reads | Options and Mine are separate HTTP requests and server scopes; no parallel EF work in one DbContext |
| Read failure | Inline error/retry; content proceeds after read settlement with only a validated available login fallback or none. User can inspect a screen choice manually |
| Mutation failure | Existing interceptor owns HTTP and isSuccess:false feedback; old branch retained and busy released. Unexpected success envelope gets explicit reload/retry feedback |
| Session lifetime | Subscription is root-lifetime-owned; nonempty replacement sessions trigger fresh reads; monotonically increasing session version rejects old results even on same-account re-login |
| Default helper | Empty/enabled/pristine only; caller supplies Create/initial-filter context. No dirty/touched mutation, value/payload forcing or persistent-record rewrite |
| Exact voucher filtering | Generic BranchId equality instead of mislabeled branch.name/branchName/id mismatches or name Contains. Credit/Debit Search mapper now reads event.branchId. JV/PR branch select uses actual Results.entities; joined PR supplier envelope corrected to avoid aborting lookup hydration |

No grid columns/ListVMs/detail DTOs were changed. Existing displayed columns and row action state remain unchanged; options DTO is a select contract, not ListVM. Add/Update document payload ownership, mappings/calculations/posting remain unchanged. The existing CurrentBranch helper map remains one-way; Options uses direct projection and adds no AutoMapper map. No service/controller overrides were added. No approval/delete/domain-transition lifecycle was introduced.

Authorization candidates for the separate project: changing allowed branch scope, selecting a branch, accessing another branch's document/detail/count/report/export/lookup, Create/Update/Delete and cross-branch actions, plus administering branch grants. This task does not claim to enforce any of these beyond existing authenticated tenant isolation. The dated appendix in `Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md` records their combined follow-up.

## Reference conformance / phases

| Concern | Owning block / inspected owner | Final match |
|---|---|---|
| Shell/service wiring | UI1/2; AppModule root HttpClient, Layout/Content, existing BaseService Mine shape | Root injectable service uses environment.baseUrl and current interceptors; no manual token/feature client |
| Persistence/select | BE3/5/6/16/18; CurrentBranch and helper owners | Existing authenticated settings transition preserved; direct lean typed Options read |
| Defaults/lookup identity | UI16; actual DropdownDto, typed screen controls and backend BranchId predicate | Numeric branch choices compared with producer and query; mode/record/route precedence preserved |
| Errors/loading | UI22/28; StateMessage/interceptors | Shared bootstrap progress; inline retry and one mutation feedback owner; stale responses guarded |
| Editor safety | UI10/13; existing canonical shells/modal portals | Prevent switch while open; no silent discard or form traversal mutation |
| Translation/guide | UI23, Master7; existing guide reader/common guidance |12 matching EN/AR vocabulary keys; two common explanatory guide items |

Applied: PLAN-00, phase0 evidence, phase1 API freeze, phase2 initial-filter adoption, phase3 Create/action draft defaults, phase5 shell/provider/async wiring, phase6 source reconciliation. Phase4 new domain transitions skipped because none were requested. No screen layout, generic CRUD or financial system refactor was undertaken.

Shared extraction: one CurrentBranchService owns remembered branch, choices, default helper and common numeric URL interpretation; consumers do not copy HTTP/storage/state logic. UI1/UI16 and the skill plus revision entry were updated together. All eight packets were regenerated through the generator and semantically reconciled: UI1 bootstrap/one-client rules and UI16 identity/default rules feed their existing dependencies; approved reference roles/phase ownership remain unchanged. Final generator -Check passed all eight.

## Verification and owner checks

- Complete scoped source diff inspected separately in both real repositories. git diff --check passed both; no migrations/snapshots changed. Initial clean trees mean no unrelated user changes were swept into the scope.
- Read-only TypeScript AST parsing, changed Angular template parsing, current-branch import resolution, duplicate class member/field initialization order scan:104 TS files and12 templates, no reported syntax/import/order issue. This is **not compilation or typechecking**.
- New imported vocabulary AST comparison:12 EN/AR keys match. Standard Check-Translations -Block currentBranch returned zero keys because this block is imported from a separate vocabulary file; it is not counted as translation coverage. Direct source comparison supplies the12-key evidence.
- Source inventories reconcile94 component consumers and exact use statements. Targeted form/option/template/initial-query/Search/Reset comparison covers the eight legacy voucher selectors. Source scans preserve record/parent/manual choice precedence and deferred permission boundaries.
- No builds, tests, lint, browser/app verification, database commands, migrations, commits, pushes or deployment were run. Runtime/visual/DB acceptance remains pending.

Owner verification journeys:

1. Confirm the existing UserBranchPreferences table is deployed; choose a branch and reload/login again, verifying saved choice and no arbitrary fallback.
2. Exercise failed Options/Mine reads and Retry; failed switch/offline/isSuccess:false retains old branch. Retry after an existing open editor is closed.
3. Open routed/modal/action/step editor and verify switch remains unavailable until closing; check save/upload/confirmation periods and keyboard explanation. Check LinkAccounts and opening-balances workspaces specifically.
4. Visit every inventoried screen, inspect the visible initial branch and first query, change/clear it, Search, Reset, return from editor, and verify explicit/cleared route state wins. Include eight voucher filters and fresh/return Lease URLs.
5. Verify Edit/View retains stored branch, agreement/booking deposits keep parent branch, transfer source/destination remain distinct, and no save payload is forced to the topbar branch.
6. Exercise logout/account replacement during reads/save; verify old response does not seed the new session and replacement bootstrap resolves.
7. Compile/run the changed frontend/backend; review English/Arabic, keyboard, RTL, light/dark, narrow layout and guide reading/print.

### Schema / deployment / suggested commits

No entity/EF schema changes in this task: **no new migration required by this diff**. Existing preference entity/configuration is already source-present, but the checked source migrations contain no UserBranchPreferences creation. Database state was not inspected. If the table is absent, the owner must reconcile migration history then run the historical `Add-Migration AddUserBranchPreference` as appropriate, inspect its scope and apply it; no duplicate/blind migration is generated here. Deploy the backward-compatible Options API before the frontend.

Suggested commits (only scoped files; never executed):

- SigmaBackend: `feat(current-branch): expose active branch choices`
- SiGmaAngularFrontEnd: `feat(current-branch): persist branch and apply screen defaults`
- Documentation owner: `docs(current-branch): record defaults and deferred permissions`

### User guide handoff

Content: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/shared-screen-guidance.ts`. Existing GuideReader imports this common overview content; the Administration guide is `/UserGuide/administration`, already linked in `sidebar-menu-data.ts`, and other module overviews inherit the same common guidance. Covered: selecting/persisting/restoring branch, screen/parent/saved/manual precedence, no page reload, editor save/close gate, pending/failed operations, Retry and deferred restrictions. Both English and Arabic are authored. Runtime navigation/RTL/theme/print acceptance remains pending.

### Agent utilization / integration

`luna_explorer` (gpt-5.6-luna) extracted sanitized HAR and identity evidence, then owned list/report default adoption after shared freeze. `sol_worker` editor (gpt-5.6-sol) owned non-list editor/action/default consumers; a separate bounded backend sol worker owned the four backend files, then performed read-only shared/editor/voucher audits. Independent ownership reduced elapsed time across94 consumers without concurrent file writers. Root retained contracts, shared shell/service, guide/vocab/docs, integration and full diff review. Findings were corrected before handoff: replacement-session bootstrap, numeric CreditNote default, route hydration precedence, exact-id voucher selectors, select response envelopes and stale Credit/Debit Search members. No agent declared overall completion independently.

## Compiler-feedback repair — 2026-10-18

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Evidence | Owner's Pasted text.txt under attachment 0f43bf7a-8a85-4576-9ab2-7ed420726610; TS2339 and TS2322/TS2345 |
| Scope | Six reported Angular components plus the existing Rental user guide; no backend changes |

The prior syntax/import/order scan did not validate member existence, DTO properties or assignability. The owner compiler output establishes concrete errors that were missed in the original source review. This repair follows existing UI1 standalone-consumer/source limits, UI16 typed lookup identity and UI29 verification guidance; it creates no new general pattern.

| Reported issue | Corrected source / verified contract |
|---|---|
| Individual `isCreateMode()` does not exist | Existing `mode()` signal is set by `readRoute`; check `mode() === 'create'` immediately after it. Edit/View unchanged |
| BookingListDTO has no `branchId` | Remove unsupported list-row access. No fabricated optional property, cast, widened DTO or extra API request. New deposit uses the current working branch only, since the existing parent contract supplies no branch FK |
| Booking payment-method context | Apply the default after registering branch valueChanges, so selectedBranchId and eligible methods reflect the initial branch as well as subsequent changes |
| CreditNote and DebitNote branch signal uses string-only SelectedItem | Branch-only signals use `{key:string,value:number}[]`; numeric FormControl and Number(id) mapping match actual Branch ids. Customer/supplier SelectedItem imports and string contracts remain unchanged |
| PurchaseOrder and Receipt branch value declared string | Change only branch option value to number and branch control to FormControl<number|null>; Number(id) normalizes the reusable string-or-number select carrier. Other option types remain unchanged |

This dated correction supersedes the earlier review's unsupported assertion that Booking deposit reads a branch from its booking list row. Parent-first behavior still applies where the actual parent DTO provides a branch (Rental/Lease agreement deposits). No persisted schema, backend shape, AutoMapper, calculation, permissions, layout or user translation-key contract changed. No migration is required.

Guide handoff: `UserGuide/content/rental-guide.ts`, existing `/UserGuide/rental` and Rental sidebar guide entry, Add-deposit step EN/AR now explains working-branch initialization and immediate payment-method filtering. Common guidance remains applicable to the unchanged Individual/voucher UI behavior. Phase3 consumer repair and phase6 scoped source reconciliation applied; other phases not reopened because shared API/domain contracts remain unchanged.

Verification: re-read actual class members, BookingListDTO, BookingDepositCreateDTO, four option signal declarations, numeric option producers, filter controls/template optionValue and search serializer. Existing read-only syntax/inventory helper and scoped git diff --check run after repair. No claim of compilation: builds/tests/lint/browser/DB/migrations/commits/push/deploy remain unrun. Owner reruns Angular compilation and verifies Create/Edit/View Individual behavior, fresh deposit method filtering and four initial/manual branch filters. No subagents: this small linked compiler-repair scope does not meet the delegation gate.

Suggested frontend commit: `fix(current-branch): align defaults with consumer types`

## Owner runtime repair — navbar NG0100 on editor mount, 2026-10-20

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Evidence | Owner Console: NavbarComponent disabled false→true and true→false NG0100 at navbar.component.html:10, plus missing assets/media/patterns/header-bg.jpg404 |
| Scope | Root CurrentBranchService, Navbar TS/HTML, ThemeModeService, shared bilingual screen guidance; no business/backend changes |

Before-edit conformance: UI1's existing rendered-editor switch boundary is owned by CurrentBranchService.hasOpenEditor and the navbar's disabled/title/aria/reason bindings. The live query changes when a later outlet/dialog mounts in the same Angular render; reading it in a template is not a stable view value. Installed Angular17 exports afterRender/AfterRenderPhase.Read; inspected ApplicationRef runs user render callbacks before dev verification, so publication is deferred to a coalesced microtask rather than performed directly inside afterRender. The final root readonly editorOpen is published through NgZone only when the freshly re-read rendered predicate differs; DestroyRef guards a pending callback. Navbar now reads only that signal for its editor state. Existing synchronous hasOpenEditor checks in change()/Retry remain, preserving open-editor safety even before the display snapshot updates. No detectChanges, polling, weakened guard or Bill-only workaround.

ThemeModeService's generated light and dark pattern URLs do not exist. Removed those failed assignments and clear the body's legacy inline background-image when applying a theme; shared CSS retains its existing light/dark surfaces and saved/System selection behavior. Existing misc/layout/header-bg.jpg was inspected as a blue banner and was not substituted as an arbitrary body background. No asset files or stylesheet/theme tokens changed.

Final files: modules/shared/service/current-branch.service.ts; _metronic/layout/components/header/navbar/navbar.component.ts/html; _metronic/partials/layout/theme-mode-switcher/theme-mode.service.ts; modules/UserGuide/content/shared-screen-guidance.ts. Common EN/AR guide now explicitly explains disabled-while-open and re-enabled-after-close in each existing module guide overview; no new menu/route. UI1 and sigma-screen-refactor working-branch rule plus revision-history row updated together, as required for reusable verified source guidance. Generated affected packets phase00/02/03/05 through the generator; semantically checked the updated UI1 provenance and unchanged approved reference roles. All eight final -Check results pass.

Source verification: four TypeScript files and one Angular template parsed with zero syntax errors; no live hasOpenEditor call remains in navbar template, synchronous change guard retained, deferred Read-phase/destruction gate present, missing background reference gone. Complete scoped frontend Git diff reviewed and diff --check passed (LF/CRLF notices only). No migration/schema, API/DTO, mapping, default precedence, authorization or accounting change. No agent used: shared predicate/state/consumer repair is tightly sequential. No builds/tests/lint/browser/database/commits/deployments run.

Owner acceptance remains pending: open/close Bill Create/View, another routed editor and a body-appended dialog; disabled/title/reason transitions without NG0100; attempted branch change while an editor exists; re-enable after closure; list navigation; Light/Dark/System switches without header-bg404; reload and responsive/RTL behavior. The reported binding error is corrected in source; a resolved blank-screen runtime is not asserted without owner replay. Suggested frontend commit: fix(shell): stabilize branch editor guard and clear missing theme backgrounds.
