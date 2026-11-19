| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Angular21 architecture modernization — 2026-10-22

Owner extension: use Angular21's stable development architecture now, before
production, rather than defer a second structural migration. This implements the
scope extension recorded before edits in the supported-platform frozen plan.
Frontend only; existing routes, DI lifetimes, public bindings, typed forms,
validators, service payloads and business contracts are frozen. No backend,
database, permissions, deployment or accounting changes. Existing build approval
applies; tests, lint and runtime/browser execution need separate authorization.

## Discovery and contract

Starting point: Angular21.2.25, official standalone root/application builder and
built-in template control flow already adopted. Remaining legacy declaration
inventory:21 runtime NgModules,122 standalone:false declarations,741 decorator
inputs,230 decorator outputs,167 decorator ViewChild queries and approximately660
constructors. Source snapshot before conversion is stored under ignored
`.angular/sass-modernization/before-standalone-sources.json` (3946 files).

Apply official standalone conversion, prune redundant modules, safe injection and
input/output/query migrations. Preserve compatibility cases that an official safe
migration cannot establish; document exact residuals rather than force best-effort
conversion. No experimental Signal Forms/resource/rxResource in this Angular21
production target. Keep RxJS for transport, cancellation and existing async
contracts; use stable signals for component state and binding APIs where safe.

UI shape: cross-cutting application architecture; no screen redesign. Backend
shape: not applicable. Canonical UI1 owns standalone imports/providers/routes;
UI29 and Master7 own verification. Phase5/6 follow the existing frozen platform
contract. Initial recipe drift check: all8 OK. Existing screen guides describe
unchanged workflows and require no invented architecture instructions for users.

| Concern | Owner/reference | Acceptance |
|---|---|---|
| Component registration | UI1, current NgModule declarations and templates | Same template selectors/pipes/directives with standalone imports |
| DI and routes | UI1, app.config/app.routes and existing lazy module providers | Same tokens, scopes, guards, paths and hash navigation |
| Inputs/outputs/queries | Each current public shared component API | Same names, aliases, defaults, event payloads and mutation contract |
| Forms/business | Existing typed forms/services/models | No validators, value formats, endpoints or calculations changed |
| Production gate | UI29/Master7, angular.json | Authorized dev/prod builds; no warning suppression or budget weakening |

## Zoneless compatibility gate

Source audit found shell/layout subscriptions writing ordinary template fields,
imperative Metronic plugin initialization, manual content detectChanges, and Zone
boundaries around SignalR/current-branch/chart integrations. NgZone.run itself is
not a zoneless notification guarantee. Every async view update needs a signal,
AsyncPipe, markForCheck or another documented notification. Converting component
inputs alone does not establish this contract.

Bounded source improvements belong in the shell lifecycle/state owners. Retain
the explicit Zone provider until actual async consumers and third-party behavior
can be verified. Runtime acceptance must include authentication/token restore,
navigation/layout/theme changes, branch/editor sync, SignalR reconnect/topic
events, dialogs/reactive forms, chart create/update/destroy and plugin reinitialization.
Do not claim production readiness from compilation alone.

## Implementation evidence (in progress)

Standalone conversion completed with official safe migration.164 changed files:
129 runtime TypeScript files and35 specs. AST comparison after removing only
imports/decorators found zero runtime logic differences. Development build passed
in111.154s at11:37:58UTC. It reports10 unused standalone-import warnings generated
by the migration; these will be removed, not suppressed, before final builds.
Five old standalone:false demo declarations remain outside the current application
registration graph under pages/user, pages/role and pages/permission; investigate
their owning module references before claiming a zero-legacy inventory. No extra
compiler roots will be added preemptively. Pruning runs against the converted
source snapshot; only redundant module wrappers may be removed.

## Owner regression priority — Company, 2026-10-22

Owner reports changed clear controls and styles, naming Company. Freeze shared
compatibility repair before further architecture transformations. CompanyPartner
list and five-step editor are the representative consumers; actual templates use
shared sigma-field/filter-panel/form-section and Select/DatePicker. Shape03 follows
UI12; no business/screen rewrite. Root styles and publisher21 source are the shared
owners/reference for this repair (UI1/16/17/24/25/27/29). Existing guide workflows
remain unchanged; visual acceptance must be explicit.

Confirmed source defects: DatePicker/Select now carry root classes on the host;
`p-datepicker .p-datepicker` and nested root assumptions no longer match. The old
datepicker-clearable and input-icon-right/p-icon-wrapper hooks are absent in21.
Use actual direct input/icon-container and :has(clear-icon) hooks, preserving
existing values, spacing, themes/directions and CVA clear behavior. Correct shared
ownership rather than introduce Company overrides. The Sass golden comparison
proves equivalence to the already upgraded theme, not visual equivalence of
PrimeNG17 and21; it could not detect these publisher DOM mismatches. Keep that
evidence distinction explicit.

Owner subsequently authorized all needed development verification (including browser
and tests); this supersedes the earlier task-local verification restriction. No
database/production publication or destructive business action is part of this
upgrade. Browser control inventory exposes only MCP Apps; both IAB and Chrome
creation return Browser not available, and the app browser opening is queued.
Do not substitute a fabricated visual acceptance claim. Added a focused Chrome
headless regression suite using real PrimeNG controls, reactive value accessors,
global CSS and the global clear service: text/select/date clearing, duplicate
clear exclusion, disabled state, control heights and LTR/RTL icon non-overlap.
It runs through the authorized project test runner; full Company visual acceptance
remains distinct from that isolated rendered-control coverage.

## Frozen retirement decision — unreachable prototypes

## Owner sequencing — shared components first

The owner now explicitly prioritizes completing shared components before further
architecture transformations. Pause inject/signal/route/NgModule-prune migrations
until shared control compatibility is reconciled. Keep current standalone
conversion and corrected runtime cycles; never reintroduce unused owning-module
backedges. Root owns integration and final builds. Bounded independent read-only
audits cover table/dialog/button presentation and control/directive public APIs.

Frozen shared contracts: the existing native/PrimeNG CVAs own values; one shared
owner per control/presentation concern; preserve public names/defaults/events,
validation/dirty/disabled/readOnly semantics, API payloads, keyboard focus,
translation, light/dark, RTL and compact heights. No Company-only selectors,
extra form graph or new business decisions. Actual shared owners are root styles,
FilterPanel, DataTable/EditableCollectionTable, EditorDialog, PrimaryActionButton/
ActionButton, FormSection/StepForm and existing date/quantity/mock directives.
Book owners UI4/6/13/14/16/17/24/25/27/29 and the actual shared sources are the
conformance references. Company is the first representative consumer.

Standalone smoke evidence: real root/lazy login and all three lazy owner metadata
loads now pass together with the five rendered control tests (9 tests total).
Fixed additional module backedges in Notifications/Extras, Card1/Cards,
ChatInner/ChatInnerModule and DropdownMenu2/DropdownMenusModule. Broader AST audit
now covers components and NgModules:2388 runtime files,654 metadata nodes and2994
local edges, zero SCC/self cycles. This is not a circular-DI or complete workflow
claim. Scoped test config is explicit; the default full suite is not excluded or
silenced. Stale-spec corrections plus53 source-verified unreachable prototype
retirements have restored full spec TypeScript compilation; verify command exit
before final reconciliation. Retained UserService and all active routes.

Owner subsequently confirms common control ownership across all pages: shared
fixes must propagate to existing consumers rather than require a Company-only
opt-in. Select alignment is owned by root styles against the publisher21 host and
direct label, with one full-height flex track; preserve theme padding for controls
outside compact shared fields. The Company filter reproduction checks selected
and placeholder text centers in LTR/RTL; source and test evidence are separate
from visual acceptance of the owner's exact session. Continue central ownership
for filters/tables/dialogs/buttons and audit local overrides before handoff.

The owner's full development modernization/verification authorization includes
removing confirmed obsolete code rather than inventing missing controls or hiding
broken tests. Independent read-only impact audit proves these are unreachable
prototypes: pages/role, pages/permission, pages/user/user.module.ts plus its
user-listing/user-details components, Customers/OpeningBalanceCustomer and
Customers/PDCReceivable. Remove only those exact files after saving their current
contents in the ignored upgrade snapshot. Keep pages/user/services/UserService,
which LayoutModule still provides. Preserve all active routes and services.

Current replacements: /User and /Role use Administration/Users and Roles;
/PDCReceivable uses Banking/ChequesReceivables; /openingBalances uses Accounts/
openingBalances. No external runtime imports, menu targets or explicit app roots
consume the retired files. Their stale specs account for remaining missing Crud,
CreatedBy/DiscountDTO errors after correcting117 pre-existing diagnostic references.
Do not alter financial payloads or add stub components merely to compile those
unused copies. Reconcile the two no-route legacy customer guide topics with the
actual existing Banking/Accounts guides; active workflows remain unchanged.

## Primary sources

- https://angular.dev/reference/migrations/standalone
- https://angular.dev/reference/migrations/inject-function
- https://angular.dev/reference/migrations/signal-inputs
- https://angular.dev/reference/migrations/outputs
- https://angular.dev/guide/zoneless
- Installed Angular21 schematics schemas and public/experimental declarations.

## Frozen shared dropdown search repair — 2026-10-22

Owner reports malformed search icon when opening a dropdown. Existing shared-first
scope applies to all current consumers. Shape is shared lookup overlay, not a new
screen or API. Preserve selection/filter/CVA and restore empty-filter clearing.

| Concern | Book | Actual reference | Shared owner | Required match |
|---|---|---|---|---|
| Search placement | UI16/24 | installed PrimeNG21 Select template + PrimeUIX IconField style | GlobalInputClearService | Preserve first/last-child icon structure |
| Generic clear | UI24/27 | existing native clear service | same service + root styles | Separate end adornments; restore owned styles on stop |
| Regression | UI29 | real Select in FilterPanel harness | control compatibility spec | Empty/typed/cleared, LTR/RTL and light/dark |

Confirmed source interaction: clear service appends its button inside IconField,
which displaces the publisher search icon from :last-child even when clear is
hidden. Existing six-pixel clear offset also overlaps the end search icon once
text is entered. Keep the publisher icon field children intact, anchor the
additional button in the containing region, and reserve measured logical-end
space for both actions. This is a source-supported compatibility fix, with no
new business fields or per-screen opt-in. Exact live Company session visual
acceptance remains unavailable through current browser tooling.

### Search repair verification and scoped reconciliation

The before-fix rendered regression reproduced all four IconField failures
(LTR/RTL x light/dark). After fixing shared host ownership and measured clear
spacing, compatibility test command exits0:23/23 pass in ChromeHeadless155.
Evidence: .angular/sass-modernization/dropdown-search-verified.log; bundle33.766s,
real browser tests3.476s, 2026-10-22T12:34:28Z compile. Assertions cover publisher
structural children, vertical/end search placement, clear/search non-overlap,
clear input bounds, restoring options after clear and preserving selected branch.
Post-typing measurements use the current layout after resize observation settles;
pre-typing rectangles are not reused for assertions about changed geometry.

Source diff review: no feature selector or opt-in; input accessors, translated
clear label, disabled/readonly exclusions and native input/change events retained.
The service restores its owned CSS-variable override on unbind. Root dark filter
style now reaches actual header InputIcon. Company user-guide workflow is unchanged:
this is a shared layout/filter repair, with no new screen action to document.
Exact owner-session visual acceptance remains pending because browser automation
surfaces are unavailable. The scoped real-browser tests are not full-screen proof.

Updated owning UI24 block and skill checklist plus revision-history row. Generator
refreshed all8 packets; semantic rule comparison preserves shared owner, actual
publisher hooks and verification limits; subsequent -Check reports8 OK. Complete
frontend diff --check exits0 (log final-diff-whitespace.log). Broader upgrade
closure remains open: final builds, whole-suite runtime failures and live workflow
acceptance are not replaced by the23 focused regressions.

The shared test environment's wildcard navigation smoke target initially hid
application routes in the root/login regression. That test now explicitly resets
the real router config before navigation, so it still renders the real login.
The old SVG library was removed from global test imports; otherwise its JIT
metadata defect was being imposed on every test, including non-SVG consumers.
A source-only publisher-package audit identifies20.0.2 as a candidate fix; it has
not been installed or claimed verified. Keep that work separate from this repair.

Full spec TypeScript typecheck after the search/test-bootstrap edits exits0:
.angular/sass-modernization/spec-typecheck-shared-controls.log. This validates
compilation of the full spec graph; it does not claim the full suite runtime is
green. Final scoped ESLint and production build commands are running separately.

## Frozen SVG dependency compatibility repair

Owner continued shared-first completion after successful search repair. The
production shared-controls build exits0 (109.829s, 2026-10-22T12:37:04Z), with no
Sass deprecations or Angular diagnostics. Initial5.76MB/685.39KB transfer and six
component-style warnings remain within unchanged error budgets; no suppression.
Scoped ESLint exits0 for the clear service, control/root specs and test bootstrap.

The current ng-inline-svg-2@15.0.1 publisher metadata declares its directive and
component in NgModule while omitting standalone:false in decorator metadata. Real
Angular21 JIT exposes this incompatibility. The publisher20.0.2 tarball explicitly
marks them standalone and imports them into the existing InlineSVGModule; exported
module/forRoot/directive and input/output names remain compatible. Publisher MIT
license and peer graph remain compatible. No injectComponent consumer exists in
this source. Freeze exact20.0.2 upgrade, preserve current templates/configuration,
and verify actual HTTP-fed SVG insertion and all tests. Do not patch dependencies,
change icon assets, suppress metadata validation or replace broken tests with schemas.

Conformance references: UI1/24/29, current app.config provider and the actual
installed publisher module/directive. Shared owner is the publisher adapter used
by the shell. No feature/API/translation/business change. Keep the library out of
unrelated global TestBeds; real SVG tests import its real module explicitly.

## Frozen shared paginator width repair — owner screenshot123.PNG

Owner screenshot demonstrates the rows-per-page Select taking the full paginator
width and wrapping to another line despite ample horizontal space. Functional
classification: preserve the existing row-count choice, current-page report and
paging actions. The screenshot does not replace canonical UI6/24 layout.

Cause: shared full-width p-select host sizing now reaches PrimeNG21's host-root
paginator Select too. Its actual publisher role class is p-paginator-rpp-dropdown.
Freeze a shared paginator-role width override (intrinsic width and no flex growth)
for all current consumers, while retaining full-width form/filter controls,
responsive wrapping at genuinely narrow widths, existing choices and page events.
Root styles own the generic sizing exception; DataTable owns the existing footer.
Conformance: UI6/24/29, actual publisher Paginator/Select and DataTable footer;
no per-screen opt-in, API contract or business change. Add actual rendered
same-row/bounds tests in both directions, plus narrow-width overflow check.

### Paginator screenshot repair verification

Before-fix rendered tests reproduce both LTR/RTL row-count failures; after the
shared role-width correction the compatibility command exits0:26/26 pass
(.angular/sass-modernization/paginator-width-after.log). Desktop footer uses one
row when its children fit;320px retains wrapping with no horizontal overflow.
The real publisher SVG module/directive HTTP insertion test also passes. Existing
select/date CVA, native clear, selected branch, table scroll/fixed footer and dialog
contracts remain covered. Updated the Company's existing bilingual guide topic in
UserGuide/content/customer-profile-topics.ts (existing Customers guide reader,
route and menu) with branch-filter clearing and rows-per-page instructions.
No duplicate guide/topic or new screen contract.

UI6 and skill rule/history now record the paginator-role exception. Regenerated
all8 recipe packets and checked8 OK; reviewed phase5 references against main.ts,
app.config.ts and app.routes.ts, correcting obsolete root NgModule references in
the template/manifest before regeneration. Root route/AuthGuard, hash routing and
single interceptor-enabled client ownership remain unchanged. No generated file
was hand-edited. The old no-calendar-icon rule is deliberate (UI17/backlog32),
so the audit finding about hidden .p-datepicker-dropdown is not changed here.

Full runtime suite after SVG upgrade:445 executed,402 passed/43 failed. Failures
are now actionable pre-existing fixture drift, not the old library JIT issue:
child forms/upload tracker absent, required link-account input values absent,
LoadingService mocks missing isLoading$, stale signal read/case-sensitive params,
URL string escaping and FormData object identity assumptions. Corrections retain
real templates/assertions and initialize the actual public contracts. Full suite
is being rerun rather than excluded. Three bounded agents owned disjoint spec
fixtures (six Company children, seven link-account children, five Staff mocks);
root owns all integration, targeted regressions and final review. No feature
production business code is altered to make stale tests pass.

## Frozen stable filter host repair and branch allocation — screenshot333.png

Owner now supplies Individuals filter screenshot and asks for a wider branch and
consistent Select appearance across pages. Source proves IndividualPartner uses
FilterPanel stableLayout=true, unlike the earlier nonstable control reproduction.
Both FilterPanel and shared report-filter stable variants still override PrimeNG21
host-root Select to display:block. Its publisher label width is1% with flex growth;
block layout disables that growth and sends trigger/clear onto another line. This
explains the first-letter-only value and clipped controls. Correct both shared
stable owners to flex Select roots while preserving DatePicker's inline-flex root;
remove contradictory block rules rather than add feature !important overrides.

Use the existing public field-width convention for the motivating branch filters:
Individuals and Companies branch becomes --wide, their grids allocate6 tracks
(branch2/search2/status1/check1). This is field allocation, owned by the feature
(UI4/16), not copied component styling. All stable consumers inherit the host fix
without opt-in. Retain 720px single-column/reset-span rules and existing filters,
form names, options and query/paging contracts. Verify both stable/nonstable
rendered Select label width/vertical center and trigger/clear bounds; actual
screen browser acceptance remains distinct. No broad rewrite of unrelated feature
styles or layouts is authorized by this correction.

Additional width evidence while checking the screenshot: the shared medium-width
rule forced exactly3 tracks even for explicit mainColumns=1/2 (including the
one-field reproduction at320px). Freeze capping medium main/advanced columns at
the configured count, with existing default6→3/5→3 retained. This corrects empty
tracks rather than inventing per-feature widths. Existing inlineActions contract
retains its own breakpoint; Individuals uses the already documented public
responsiveColumns=3 to avoid dense six-track fields beside actions at1365px and
below. No new responsive opt-in API or feature CSS is added.

## Frozen final shared DatePicker compatibility findings

Focused final source audit confirms two residual21 compatibility defects.
1) DatePicker disabled is on its actual native input, not p-disabled on the host.
Normal input rules currently override disabled colors and host hover still runs.
Use native-disabled :has hooks and shared disabled/theme tokens; retain semantics.
2) Generic native clear can visually empty raw DatePicker inputs while its CVA
retains the date, because the publisher input handler requires keydown state.
The appDatePicker adapter already handles mobile/drop input in capture correctly;
never bypass or duplicate it. Five editable Settings raw-date consumers have no
adapter/native clear. Exclude raw DatePicker from the native clear service and
preserve their clearing capability through the publisher [showClear]=true on those
five exact inputs. Preserve dateFormat, form binding, mode, validation and
readonly behavior. No default-clear change to readonly or deliberately nonclearable
widgets, no fake keydown/internal metadata access, no new form graph.

Owners/references: UI17/24/25/27/29, publisher DatePicker clear()/input/disabled
metadata and actual DatePickerDirective guardDateInput. Three Settings templates
are direct control consumers only; no Settings business refactor/API change.
Regression: app adapter without native showClear propagates null through its
existing capture guard; raw DatePicker uses native clear; disabled controls keep
disabled appearance and never gain generic clear. Record exact theme/direction
coverage and retain full-screen acceptance separately.

Final integration findings from full suite: the LeaseAgreement invalid-save focus
query points to a template reference on form[appMockData] (a component), so an
ElementRef type annotation alone returns the wrong instance. Freeze explicit
ViewChild read:ElementRef for that native form query; retain invalid-tab/focus
logic and all validation. This is a runtime wiring repair, not a business change.
Focused final source audit checks other similarly typed direct query consumers.

ESLint21 supports separate element/attribute component selector conventions. The
canonical form[appFilterPanel] currently fails the old element-only rule; configure
both app-kebab-case elements and appCamelCase attributes, retaining prefix/style
enforcement rather than disabling the rule or renaming the canonical selector.

Latest full suite improves to454/458; the four remaining failures are the new date
regressions, not exclusions of earlier tests. They expose empty keepInvalid input
transporting an empty string instead of null, and disabled color cascade. Empty
input in the shared capture adapter now delegates to publisher clear() and emits
its existing input event once, including dateNumericInput=false. This preserves
partial nonempty text and gives actual clearing the correct null/CVA contract.
Do not weaken the regression expectation to accept a mismatched displayed value.
Disabled appearance is being resolved against actual rendered selector/cascade.

Known dependency audit recorded separately under ignored dependency-audit.json:
14 high entries (many are dependency chains), no critical. Existing runtime XLSX
0.18.5 has no npm registry fix; current Angular21 CLI/build transitive advisories
have no publisher-compatible21 replacement reported by npm. Baseline Karma/glob
chains also remain. No force/downgrade/overrides or license changes were applied.
This task does not certify vulnerability-free production readiness; dependency
replacement/next-major decisions are a separate scope from shared UI regression
repair. Keep actual version metadata distinct from compiler-version strings in
publisher mjs files (PrimeNG is21.1.10, not its Angular compiler metadata21.2.22).

## Frozen final runtime diagnostic repairs

A diagnostic-only test bootstrap (original warnings retained, no suppression)
now identifies every NG0955 trace as the shared Keenicon decorative layer loop.
It iterates empty Array slots by value, so all layer keys are undefined/empty.
Track those positional decorative layers by $index; retain path1..N class order,
icon names/assets/classes and existing API. UI1/24/29 owns the runtime/control-
flow compatibility repair; add a rendered two-layer regression.

Console review also finds NG0303 on two remaining Invoice radio groups whose
removed label input was bound through interpolation (four radios across details
and rental-details). The prior property-binding migration missed these attribute
interpolations. Apply the already frozen UI16 native inputId/label contract, with
unique per-form ids and unchanged merge control/options. No invoice business or
financial logic changes. Strengthen TestBed unknown-element/property errors so
future runtime template failures cannot leave a green should-create suite.
Remove diagnostic-only import from normal bootstrap after tracing; keep scripts
ignored. Rebuild and rerun the whole suite after these final source repairs.

Final full-suite console audit: TestBed strict run passes460/460 with zero
NG0303/NG0955 and zero console ERROR entries. Remaining console warnings include
legacy dotted FormGroup filter keys, reactive disabled bindings, and three
allowSignalWrites options. The installed Angular21 effect implementation declares
allowSignalWrites deprecated and behaviorally inert. Freeze removal of those
three obsolete true options only (ReconciliationReport, Staff details, Account
details), preserving effect callbacks and all business behavior. Legacy filter-key
and disabled-binding remodels remain feature-owned follow-ups; never rename API
filter fields or change form state globally merely to silence their warnings.

## Final shared-first reconciliation — 2026-10-22

This handoff completes the scoped shared control stabilization and its confirmed
compatibility defects. The broader architecture contract remains Frozen, with
owner screen acceptance pending. No further inject/signal/route/NgModule-prune
transformations were started while resolving the owner's shared UI feedback.

### Functional evidence classification

| Evidence | Proven requirement | Preserved or implemented | Evidence limit |
|---|---|---|---|
|123.PNG|Rows-per-page selector is incorrectly full-width on a separate line despite space|Shared intrinsic paginator width;1100px same-row and320px no-overflow regression|Screenshot is functional content evidence, not a replacement design|
|333.png|Individuals Branch is too narrow; selected text/clear are clipped; filters/actions exist|Branch2/search2/status1/check1 in6 tracks; shared stable host repair; responsive action placement|Actual owner session visual acceptance still pending|
|Owner Company feedback|Branch selected/placeholder vertical alignment and dropdown search must work|Ordinary/stable list and report Select, LTR/RTL; search/clear separation in light/dark|Headless isolated real controls do not prove every routed screen|

### Contract-to-source reconciliation

| Concern | Owning source/reference | Final match | Evidence/status |
|---|---|---|---|
|Select root/label|UI16/24; root styles + FilterPanel/report stable wrappers|One flex host/label track; removed both contradictory block wrappers|Rendered selected/placeholder width/centering and trigger checks pass|
|Branch allocation|UI4; IndividualPartner/CompanyPartner list templates|6 tracks:2/2/1/1; no local widget stylesheet; Individuals public responsiveColumns=3|Source/template compilation; exact session visual acceptance pending|
|Medium grids|UI4; FilterPanel computed CSS variables|min(3, configured main/advanced count); default6/5 still become3|One-field rendered regression no longer acquires empty tracks|
|Paginator|UI6/24; global role rule + actual publisher rpp class|Intrinsic width/no growth; field Select full-width remains|Both directions same-row/bounded narrow layout pass|
|Native text/search clear|UI24/27; GlobalInputClearService + IconField source|Publisher children intact; measured logical-end icon reserve; owned padding restored|Clear/CVA, filtering, selected branch and disabled state regressions pass|
|DatePicker|UI17/24; shared directive + publisher clear/input/disabled|Native-disabled hooks; raw clear uses publisher in5 Settings controls; adapted empty input yields null for both numeric modes|CVA/dirty/disabled light/dark tests pass after CSS transition settles|
|Table scroll/dialog/actions|UI6/13/24; actual shared component templates/styles|Actual table-container, sticky header/fixed footer; dialog title/subtitle and busy guards|Shared rendered tests pass|
|Root/lazy metadata|UI1; app config/routes and standalone owner graph|No unused parent/owning-module backedges; existing lazy boundaries remain|654 metadata nodes/2994 local edges/0 SCC or self cycles; real root/lazy login tests pass|
|SVG publisher|UI1/24/29; module/forRoot API and package lock|Exact20.0.2, MIT, compatible graph; no dependency patch|Real module compilation and HTTP-fed SVG insertion pass|
|Native form query|UI1/27; LeaseAgreement invalid-save focus|Explicit ViewChild read:ElementRef on custom form host|Original validation/focus test passes; no shared fake nativeElement alias|
|Icons/radio labels|UI16/24; Keenicon and4 Invoice radios|Positional decorative layer identity; native associated labels; same merge values|0 NG0955/NG0303; label click/CVA regression passes|
|Stable effects|UI1/29; three existing effect callbacks|Removed inert deprecated flag only|0 obsolete effect warnings; full suite and production build pass|
|Guide|Master7; customer-profile-topics.ts -> customers-guide.ts -> existing GuideReader|EN/AR branch search/clear and row-count steps for /IndividualPartner and /CompanyPartner|Existing /UserGuide/customers sidebar/reader retained; owner visual acceptance pending|

### Verification on the final source

- Default full-suite command (no include/exclude narrowing) exits0:460/460 in
  ChromeHeadless155. Log: .angular/sass-modernization/all-tests-handoff.log;
  compile65.145s, 2026-10-22T13:39:29.395Z. TestBed now throws on unknown
  template elements/properties. Zero console ERROR, NG0303, NG0955 and obsolete
  effect warnings. Normal bootstrap contains no diagnostic reporter import.
- Production command exits0:148.421s, 2026-10-22T13:40:51.665Z. Log:
  .angular/sass-modernization/production-handoff.log. Initial5.76MB/685.37KB
  estimated transfer; flat dist/sigma retained. No Sass deprecation or Angular
  compilation warning. Seven budget warnings remain (initial plus six styles);
  unchanged6MB initial/20KB component error limits are respected.
- Scoped ESLint passes for shared sources/tests, changed list/Invoice templates,
  Keenicon, normal test bootstrap and the final effect cleanup. No rule/schema
  suppression: selector conventions now validate both app element and attribute
  component selectors used by the canonical form owner.
- Full spec typecheck was validated separately and is revalidated by the default
  final Angular test compilation. npm dependency graph exits0, framework deduped
  to21.2.25, PrimeNG21.1.10, SVG20.0.2. Final diff --check exits0.
- Machine-readable evidence: .angular/sass-modernization/final-verification.json
  (contains the final handoff counts, timestamps and warning inventory).
- Real-browser runtime/geometry tests were authorized by the owner. Browser UI
  control still exposes no usable IAB/Chrome surface; no direct owner-session
  Company/Individuals workflow, visual, responsive or print acceptance is claimed.

### Remaining risks and explicit boundaries

Legacy dotted FormGroup filter keys and reactive disabled bindings still issue
console warnings in old consumers. Their form/query-contract remodel is feature-
owned; no hidden renaming or bulk form-state rewrite was performed here. Budget
and dependency findings are retained above; this is not a claim of vulnerability-
free production readiness. Manual checks: open Individuals/Companies at normal
and narrow widths, LTR/RTL and light/dark; inspect long selected labels, branch
clear/search, row count, editor open/close and date entry/clear before accepting
all-screen appearance. No unsupported business/permission/API decision is invented.

No backend/DTO/mapping/calculation/schema changes, no migration requirement.
Authorized build/test/lint commands were run. No database commands, migration,
commit, push or deployment. Unrelated user/peer changes were preserved. Source
review combines the earlier complete official-migration/CSS semantic review with
this scoped rendered-control/metadata/diff review; reference patterns were not
silently replaced by screenshot styling.

Agents were reused with inherited models for bounded independent source audits,
fixture repairs and derivative recipe-reference correction. Disjoint ownership:
six Company child specs, seven LinkAccount specs, five Staff specs; one agent owned
only the phase5 template/manifest; root integrated/reviewed all outputs and ran
all final checks. Reuse reduced duplicated context and kept overlapping edits out.

Suggested frontend commit (owner only): chore: upgrade Angular21 and stabilize
shared controls, test bootstrap and theme compatibility.
Suggested documentation commit (owner only): docs: align Angular21 shared UI
contracts, runtime verification and generated recipes.

## Owner-requested Individuals filter layout — 2026-10-22

| Decision | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | IndividualPartner list presentation only; current validation branch |
| Authority | Owner requests all filter actions on a second row and a wider Agreement status |

Previous six-track inline allocation is superseded for Individuals only. Use four equal full-width field tracks (Branch, Search, Agreement status, Inactive only) and the existing separate action toolbar. Normal shared breakpoints remain three tracks at1250px and one at720px; all actions stay below the fields. No API, form control, query, action handler, grid, editor or business contract change. Companies is outside this request.

| Concern | Book block | Reference symbol/file | Shared owner | Target |
|---|---|---|---|---|
| Action row | UI4 | Workshop/Job/components/list/list.component.html form + appFilterActions | FilterPanelComponent default inlineActions=false; flex-direction:column; toolbar follows grid | Remove Individuals inline/responsive opt-ins; keep Reset/Export/Search projection |
| Field widths | UI4 | filter-panel.component.scss grid-template-columns + mainColumns input | FilterPanelComponent | mainColumns=4; four single-span fields; status receives one quarter of all available field width |
| Guide | Master7 | UserGuide/content/customer-profile-topics.ts Individual topic | CUSTOMERS_GUIDE existing reader | EN/AR description updated to persistent action row |

Recipe drift check: all eight packets OK; phase-02-read-grid used for the bounded presentation scope. Screen family remains step-form record; editor unchanged. No independent workstream warrants subagents for this two-file change. Verification will be proportional source/diff inspection; earlier460-test/production evidence predates this follow-up.

### Reconciliation of this follow-up

Status: Implemented — source-only. Reviewed the complete two-file diff: only public filter layout inputs/spans and Individual guide text changed. The shared default form is a column flex container, its toolbar follows the grid, mainColumns=4 gives equal single spans, and shared1250/720px media rules still apply. No feature stylesheet or shared-component changes were required. Existing form bindings, labels, handlers and Reset/Export/Search controls are unchanged. Whitespace diff check passed. Actual visual acceptance of this new arrangement remains pending; the owner's preceding successful full Individuals trial is evidence for the earlier layout/workflows, not this new geometry. No new tests/build/browser run was necessary for this reversible markup configuration change; earlier results are not represented as rerun evidence.

Updated in-app guide: src/app/modules/UserGuide/content/customer-profile-topics.ts, Individual topic in existing /UserGuide/customers, English and Arabic. No backend, DTO, mapping, calculation, schema, route or permission change; no migration needed. No commits/push/deployment/database commands. Suggested owner commit: style: move individual filter actions below fields and widen agreement status.

## Read-only residual architecture inventory — 2026-10-22

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Targeted Angular upgrade residual inventory; no application source changes |

Owner asks whether old code remains. This is not authorization to resume the paused architecture migrations. Recipe check: all8 OK. Reused existing frozen platform contracts and UI1/runtime compatibility guidance; no new workflow or API contract.

Current targeted rg counts, excluding *.spec.ts:17 @NgModule decorators,741 @Input decorators,230 @Output decorators,163 @ViewChild and5 @ViewChildren. These counts are syntax inventory, not independent defects or proof of runtime reachability. Compatibility examples inspected: AuthModule imports standalone components; MockDataFormsModule reexports standalone owners. The unreferenced/uncompiled status of any candidate requires its own reachability evidence before removal. In particular BuilderModule still declares BuilderComponent; do not infer that zero standalone:false text proves every remaining module is correctly standalone-compatible.

Old structural-template search finds19 textual matches:5 real template uses (four *ngIf in pages/builder, one in shared list-buttons),14 matches inside commented header/toolbar/page-title markup. Actual entry-point reachability of those two template owners was not established. No p-dropdown/p-calendar element matches and no explicit standalone:false entries were found. Do not report19 live template directives.

app.config.ts still intentionally provides Zone change detection and legacy animations for SplashScreenService; zoneless notification and animation migration were not performed. Decorator input/output/query APIs remain working compatibility code, not automatically bugs. Safe inject and signal APIs and module pruning remain paused by the owner's shared-first sequencing. RxJS and existing typed reactive forms are retained intentionally; adopting Angular21 does not justify an indiscriminate rewrite.

Tests remain Karma/Jasmine; optional future runner migration is distinct from application runtime modernization. Application build is @angular/build:application and dev server uses Vite; remaining webpack dependencies/script belong to the separate rtl.config.js task and must not be deleted by assuming the application still builds with webpack. Existing XLSX0.18.5 audit concern is recorded above; no new audit or publisher fix claim made in this read-only inventory. Old form filter-key/disabled-binding warnings remain previously documented feature-specific follow-ups.

Recommended order: finish acceptance of shared controls, review remaining module/provider boundaries before pruning, then migrate shared public inputs/outputs/queries and safe DI in bounded batches, then decide zoneless/animation/test-runner changes separately. Prioritize confirmed compatibility/security issues over changing supported syntax solely for novelty. No new source/build/test/lint/browser/database/commit/push/deploy commands were run for this inventory. No subagents: targeted bounded inventory was quicker without duplicated discovery. User-facing guide unchanged because there is no behavior change.

## Quantity entry latency investigation — 2026-10-22

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Shared Quantity numeric entry; motivating consumer PurchaseRequest details |

Owner reports hesitation starting to type in a numeric control with stacked step buttons and identifies PurchaseRequest Details. Preserve existing number/null CVA, integer min0/max2147483647/maxFractionDigits0 for this consumer, focus-select-on-entry, keyboard caret editing, step buttons, invalid/touched/dirty accessibility, translations and disabled/read-only behavior. Financial preview, tax allocation, validators, API and save contracts are unchanged. Do not replace the publisher CVA, debounce financial values or turn off entry selection.

| Concern | Book | Actual reference/source | Shared owner | Target/evidence |
|---|---|---|---|---|
| Numeric entry and stepping | UI27/UI14 | PurchaseRequest details Quantity markup; quantity-input.directive.ts; installed PrimeNG21.1.10 InputNumber | QuantityInputDirective | Remove only measured redundant shared work, retaining current public inputs/outputs and initial20-digit/default versus consumer integer precision |
| Entry selection | UI27 | global-numeric-focus.service.ts document listeners outside Angular | GlobalNumericFocusService | Preserve existing focusin/first-click contract; no measured defect yet |
| Clear geometry | UI24/27 | global-input-clear.service.ts observers/events | GlobalInputClearService | Measure before assigning cause; quantity remains excluded by data-no-clear |
| Guide | Master7 | purchase-requests-topic.ts | Existing purchases guide topic | Reconcile user-facing numeric entry instructions after source change |

Recipe drift check all8 OK. Applicable phase05 runtime/event integration uses canonical main/app.config/app.routes reference roles; no route/provider edits planned. Canonical numeric shape is the shared Quantity owner from UI27, not a replacement screen design. Real ChromeHeadless regression uses the PurchaseRequest template/local unsaved draft and actual publisher/CVA plus both root numeric/clear services. Direct owner-session browser tool is unavailable (CUA kernel assets path failure); do not claim visual acceptance. Prior all-tests/build evidence predates this fix.

Bounded parallel audit assigned to existing sol_final_platform_audit (inherited model), read-only ownership of QuantityInputDirective, GlobalNumericFocusService and publisher InputNumber. Root owns PurchaseRequest fixture/profile, clear service, implementation/integration and final verification. Audit identifies repeated DOM lookup + two translations per quantity per DoCheck as a confirmed redundant hot path, but its share of reported latency requires measurement. No independently invented finance contract.

### Quantity latency reconciliation — 2026-10-22

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Implemented the shared fixes in quantity-input.directive.ts and global-input-clear.service.ts. The quantity adapter now caches actual publisher button references after view rendering; input/next-sibling/showButtons/layout changes invalidate the cache. Translation happens on creation and language/translation/default-language events with destroy cleanup. Cheap invalid+touched/dirty synchronization remains in DoCheck and runs when the input structure changes. The clear service still refreshes the target first, then schedules global geometry only for an actual bound clear input. Root focus selection and publisher CVA/calculation behavior were unchanged.

Measured real enabled PurchaseRequest20-row draft, both global services, first focus plus three digit keys: baseline60 button queries/40 geometry reads; after0/0, still numeric123 and preview amount246. Raw headless frame-inclusive elapsed73.4ms versus65.3ms is noisy and is not a claimed latency percentage or proof of owner-session resolution. Initial diagnostic runs used disabled fixture state and were corrected before baseline; only numeric-entry-baseline.log is the valid enabled before-run. Tests retain zero-work regression assertions rather than wall-clock thresholds; temporary console profiling is removed from source.

Final targeted regression:28/28 ChromeHeadless155 tests pass, including four new actual PurchaseRequest template tests and24 existing real shared-control tests. Covers entry selection, digit replacement/CVA/dirty/preview, no redundant DOM work, step buttons/arrow keys, zero/largest integer bounds, no fractional entry, null clearing/required aria-invalid recovery, language and translation changes, button recreation, disabled and readonly; existing Select/DatePicker/clear/theme/RTL checks also pass. The first expanded run failed only because the test directly mutated an OnPush publisher without marking its view; corrected the test to markForCheck for intentional direct property mutation. No application bypass or suppression. Final log .angular/sass-modernization/numeric-entry-regressions-final.log; compile35.795s,2026-10-22T14:41:46.493Z; TOTAL28 SUCCESS, no Angular diagnostic/error entries. Scoped ESLint exits0, log numeric-entry-lint.log. Scoped diff whitespace check passes, numeric-entry-diff-check.log. Full460-test suite was not rerun for this bounded follow-up; previous full-suite result remains historical.

Production build completed successfully in100.263s,2026-10-22T14:43:50.398Z, output dist/sigma. Log .angular/sass-modernization/numeric-entry-production.log. Initial5.76MB; existing seven bundle/style budget warnings remain, no Angular compile error. The tool session expired before its exit status could be collected after conversation continuation; successful bundle completion and final output location are confirmed by the saved log, not a fabricated observed process exit code.

Scoped source diff reviewed for all four frontend files, including new PurchaseRequest numeric-entry.spec.ts. No feature runtime logic/formula/DTO/query/provider/route/backend/schema changes, no migration needed. Existing typed/validated Number/null values and shared focus owner remain. Guide updated EN/AR at UserGuide/content/purchase-requests-topic.ts, existing record-list topic/reader under /UserGuide/invoice and /UserGuide/vouchers-purchasing; no duplicate guide. Manual acceptance: retry the reported PurchaseRequest Details quantity, initial selection, repeated typing and buttons with the owner's actual row count; exact interactive latency remains owner-pending because direct browser control was unavailable.

Learning synchronized in canonical UI27 and sigma-screen-refactor skill plus revision row. Regenerated all8 packets through Generate-SigmaRecipes.ps1, then all8 -Check OK; semantically reviewed changed UI27 provenance and phase05 reference roles (main/app.config/app.routes) plus phase06 no-false-runtime-claim/user-guide gates. No generated packet hand edits. Agent final bounded source audit reports no confirmed new regression; root owns implementation and runtime tests. Agent was used for non-overlapping read-only publisher analysis while root measured the consumer. No commit/push/deploy/database/migration/Graphify commands. Existing unrelated work preserved on upgrade/angular-21-validation.

Suggested frontend commit (owner only): fix: remove redundant shared quantity entry DOM work.
Suggested documentation commit (owner only): docs: record quantity entry performance and verification contract.

## Owner amendment: Purchase Request quantity clears to zero — 2026-10-22

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Owner explicitly confirms that PurchaseRequest Details Quantity should return to0 after clearing, superseding the preceding null-on-user-clear expectation for this field only. Initial row factory already uses seed?.quantity??0. Use publisher public [allowEmpty]=false on this consumer; no custom key handler, valueChanges normalization, shared CVA or change to other nullable quantities. Preserve min0/max2147483647/integer precision, existing required/min/int32 validators, payload and preview formulas. Programmatic null/reset remains form-owned, not silently coerced by a new generic form rule.

| Concern | Book/reference | Shared owner | Target match |
|---|---|---|---|
| Initial/default value | UI27; PurchaseRequest createLine quantity control | Existing typed FormControl | Existing0 seed unchanged |
| User clear | UI27 public publisher boundary; installed PrimeNG updateValue allowEmpty behavior | InputNumber | Bind allowEmpty=false only on requested quantity; publisher transports0 on user deletion |
| Numeric entry | Existing numeric-entry.spec.ts real PurchaseRequest20-row harness | InputNumber + global focus/clear owners | Retain performance/selection/step contracts and verify zero clear + real validator recovery |
| Guide | Master7; purchase-requests-topic.ts | Existing GuideReader/topic | Supersede prior required-empty wording with clear-to-zero EN/AR |

Initial recipe check all8 OK. This is an explicit screen-field behavior amendment, not a global null policy. Existing UI27 documents feature-owned number/null contracts; no new reusable rule or book/skill change needed. No subagent: one binding and its existing regression/guide are tightly coupled. Targeted regression rather than repeating full suite/build is proportional to this supported scalar input change.

### Clear-to-zero amendment reconciliation

Implemented the single public allowEmpty=false binding on PurchaseRequest Details Quantity; initial0 row seed and all other numeric inputs remain unchanged. Existing real-template regression updated: Backspace and Delete send numeric0 through the actual CVA and display0; typing7 directly after Delete yields7; min/max/integer/stepping and real min-validator aria-invalid recovery still pass. All4 focused tests pass in ChromeHeadless155; compile58.766s,2026-10-22T14:51:04.406Z. Log .angular/sass-modernization/numeric-zero-clear.log. Test source's final modification precedes this compilation completion; no temporary profiling remains.

Updated EN/AR purchase-requests-topic.ts text in existing invoice/purchasing guide to state initial0 and clear-to-zero; earlier null-required-empty statement remains historical only. Complete scoped diff reviewed for template, guide and existing numeric test; whitespace check passes. Scoped lint includes one pre-existing template eqeqeq finding at details.component.html:123 (saved.consumptionPercent == null), verified identical in HEAD and untouched by this patch. It deliberately matches null/undefined; no unrelated condition change or rule suppression was performed. Other lint targets emitted no findings. No production/full-suite rerun for one supported input binding; previous build and28-test results are historical. Actual owner-session acceptance pending.

No new shared control implementation, backend/DTO/formula/schema/route changes, no migration required. No reusable canonical policy change: screen-specific user decision supersedes prior clear contract only here. No subagent needed, no prohibited unapproved actions/commit/push/deployment/database/migration/Graphify commands. Suggested frontend commit (owner only): fix: return purchase request quantity to zero when cleared.

## Owner-reported blank/uneditable new-request quantity — 2026-10-22

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

User reports no visible0 and cannot type, explicitly on a new PurchaseRequest. Prior value/event tests do not prove actual input geometry or real async startup. CUA now initializes but inventory has only empty MCPApps and IAB remains unavailable. Added a real bounded1200x800 host geometry regression: before fix host display=block,inputwidth113.34px, buttonleft749.58 while inputright780.58 (30px overlap); value is0 and disabled=false. This proves publisher buttons cover numeric text/click area in the shared styling, not that business guards should be bypassed.

| Concern | Canonical owner/reference | Frozen implementation |
|---|---|---|
| Quantity root geometry | UI24/27; actual PrimeNG21 host classes; styles.scss existing quantity rail tokens | Correct old descendant root selector to same host, restore shared inline-flex and22px separate rail; preserve34px height/minwidth/theme/digits |
| Invalid root border | UI24/27; existing ng-invalid+touched/dirty classes | Target same actual host; preserve validation contract |
| New request activation | UI1/22/27; PurchaseRequest ngOnInit/loadLookups/form enable; publisher setDisabledState | Verify real async disable/enable path, do not force-enable or remove lookup/policy failure guards |
| Clear behavior | Prior owner clear-to0 amendment | Preserve allowEmpty=false on PR Quantity only |

Recipe drift check all8 OK. Read canonical UI24/27, applicable phase03 editor reference roles and phase05 runtime. Root owns styles and geometry tests; existing agent handles bounded read-only real create lifecycle/publisher disabled audit. No parallel edits. Actual reference is existing shared quantity styling and installed publisher host/child template, not a new feature design. New confirmed lesson must be synchronized in owning UI24/27 and skill, then generated packets refreshed.

### Quantity host geometry reconciliation

Shared styles now target combined `.sigma-quantity-input-host.sigma-quantity-input.p-inputnumber` on the actual publisher21 host. This restores existing inline-flex/34px input geometry, separate22px static rail and theme tokens; invalid/touched/dirty border selector also targets that host. This is a shared fix for all existing appQuantityInput consumers, not a PR-only style patch. No PrimeNG patch, z-index workaround or input/CVA replacement. Prior PR-only clear-to0 binding is preserved.

Before/after source and rendered evidence: old host displayblock with30px button/input overlap reproduced (numeric-geometry-before.log); corrected host inline-flex and input/rail do not overlap. New regression asserts default0, visible input dimensions, separate rail and document.elementFromPoint in the actual text-entry box. An intermediate hit-test failure was a test setup problem: body flex shrinking a directly attached fixture to349px collapsed the inner table viewport. Diagnostic numeric-hit-diagnostic.log established the clipping ancestors; the fixture now has an isolated fixed1200x800 box that models the shell's bounded route allocation. This is test-only setup, not a claim of solving every short-height layout or a production page-height override. Temporary diagnostic console output removed.

Expanded tests exercise real ngOnInit/loadLookups and HttpTestingController responses, not only the synchronous loadLookups stub: disabled while10+ GET reads are pending, enabled after successful lists/settings/policy, then visible0, actual focus, typing4/ArrowUp=>5 and clear=>0; a declared Item lookup failure retains disabled/busy/error guards. No unconditional form enable or business-state bypass was introduced. Independent read-only publisher audit confirms setDisabledState handles true/false and emitEvent:false does not omit CVA disabled updates.

Final targeted ChromeHeadless155 run passes31/31 (7 PR tests plus24 existing publisher shared-control tests); numeric-host-final.log, compile33.934s,2026-10-22T15:01:24.099Z. No console Angular error/diagnostic/failure entries. Existing numeric performance assertions still pass: no per-keystroke button queries or unrelated clear geometry. Scoped source diff/whitespace review passes. Exact owner browser session remains unavailable (IAB Browser not available); this is rendered-headless evidence plus pending owner acceptance, not direct session proof.

Existing guide updated EN/AR in purchase-requests-topic.ts under existing /UserGuide/invoice and /UserGuide/vouchers-purchasing: wait for required reads/retry on failure, enter in numeric box beside step buttons, initial0/clear-to0. No new guide route. UI24 andUI27 plus skill rule/revision row synchronized; all8 packets regenerated through generator and checked OK; reviewed actual root/geometry rule against publisher stylesheet, changed provenance and phase05 wiring reference roles. No generated hand edits. No backend/API/DTO/calculation/schema changes; no migration. Root owns implementation and runtime verification; agent was bounded read-only lifecycle/publisher audit. No commits/push/database/migration/deployment/Graphify, unrelated changes preserved.

Suggested frontend commit (owner only): fix: keep quantity input visible and separate from step buttons.
Suggested docs commit (owner only): docs: verify quantity host geometry and real create loading.

Final host-fix verification: production build exit0 in108.728s at2026-10-22T15:03:47.820Z, flat dist/sigma, initial5.76MB; existing seven bundle/style budget warnings remain, no Angular compiler errors (numeric-host-production.log). Scoped TypeScript/guide ESLint exit0 (numeric-host-lint.log); prior untouched template ==null finding remains documented rather than suppressed. All8 recipe checks OK again after semantic review. Source and docs diff checks pass. No full-suite rerun beyond31 focused/shared tests for this scoped fix. Owner-session interactive/visual acceptance remains pending; final report must not imply direct UI access. All changes remain on upgrade/angular-21-validation, uncommitted by the agent.

## Attachment row alignment — owner screenshot33333333333333333.png,2026-10-22

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Owner requests matching vertical and horizontal alignment. Screenshot explicitly proves file name/upload/clear in one box, View wrapped below it, and separate row Delete. Presentation correction only: one34px file/action track with8px separation; filename shrinks/ellipsizes, error remains below full track, row Remove aligns to that first track and retains its confirmation handler. No change to path, upload, cleanup, link-origin security, save/print or deletion contract.

| Concern | Book/reference | Shared owner | Implementation match |
|---|---|---|---|
| Filename/upload/clear | UI18; FileFieldComponent and Individual document file cell | Existing FileFieldComponent | Own an internal file/action row; project existing FileLink beside field rather than creating another attachment/CVA owner |
| View | UI18; FileLinkComponent same-origin HTTP(S) URL guard | Existing FileLinkComponent | Preserve same component/path/label/target/rel; no auto-added View for consumers that do not currently render it |
| Row alignment | UI14; EditableCollectionTable | Existing shared table stylesheet | Attachment-row action cell aligns at top; existing Remove uses34px control height in attachment rows |
| Consumer integration | Master5; shared-first owner preference | Four existing immediately adjacent FileField/FileLink pairs | Nest existing link in projected slot with unchanged input values; no new opt-in flag or duplicate action |
| Guide | Master7; purchase-requests-topic.ts | Existing module guide | Document one row of file/View/Remove actions in EN/AR |

Direct-consumer search was limited to FileField/FileLink usages. Four adjacent pairs occur in PurchaseRequest, PurchaseOrder, Sales/Fleet and Fleet/Vehicle. Their integration is limited to moving the same existing link inside the shared field; no screen business implementation or reference pattern change. Other FileFields retain the same default presentation/actions. Screenshot is functional alignment evidence, not authority for a new palette. UI shape remains existing routed document editor; backend not in scope. Recipe drift check all8 OK; UI18/14 and phase03 shared owner references apply. No subagents because this small shared projection and its consumers are tightly coupled. Source snapshots/diff preserve previous upgrade/numeric edits.

### Attachment-row final source reconciliation

Implemented shared FileField internal row with projection of the already-existing FileLink. Existing filename/upload/clear remain one shrinking box, View has intrinsic width with8px gap and matching34px height; FieldError stays below the whole row. No View is auto-created for other consumers. All four previously adjacent pairs (PR, PO, Sales/Fleet, Fleet/Vehicle) now project exactly the same link/path/label/print classes. A scoped direct-consumer search finds no remaining immediate FileField/FileLink sibling pair. These are mechanical presentation integrations, not new feature business flows.

Shared table attachment cells/actions align to the first34px control track. A real validation regression exposed the existing universal table-cell middle!important declaration in styles.scss:32-35; CSSOM trace confirmed the new selector matched but lost to that important rule. The root retained the established universal rule and applied a narrowly scoped important exception in the shared table owner; UI6 records the current owner clarification and UI14/18 own implementation. Temporary CSSOM reporter removed. Fixed layout is restricted to attachment tables so long unbroken filenames do not expand the table; existing explicit widths/colgroups/min-width scroll contracts remain. No td display:flex workaround, feature offsets or local stylesheet.

Verification:13/13 ChromeHeadless155 tests pass (six new shared attachment tests plus seven existing PurchaseRequest numeric/runtime tests). Log .angular/sass-modernization/file-row-verified.log; compile38.628s at2026-10-22T15:54:46.617Z. Matrix:800/320px, LTR/RTL, light/dark, errors absent/present, long filename title/ellipsis,34px top alignment and8px horizontal gap, table fits existing wrapper, clear tracking/dirty/null, exact row removal output, hidden upload/remove on disabled control with existing View retained. Earlier failing geometry runs and CSSOM evidence are diagnostic history, not accepted results. No console Angular errors in final run. Full460-test suite not rerun for this scope; earlier full result remains historical.

Scoped TypeScript/new test/guide and Sales/Fleet + Vehicle template lint exit0 (.angular/sass-modernization/file-row-lint-final.log). Broader attempted lint also reported pre-existing PO details:142 `record.receiptPercent != null`; confirmed identical in HEAD, same intentional null/undefined guard as the already documented PR warning. No unrelated expression rewrite or rule suppression. Scoped diff whitespace check passes (file-row-final-diff-check.log). Complete shared/template/test diffs inspected; no upload, cleanup, URL security, confirmation or money formula change.

PurchaseRequest in-app guide updated EN/AR in purchase-requests-topic.ts, existing /UserGuide/invoice and /UserGuide/vouchers-purchasing: file/View/Delete share one row; upload/clear versus row removal, full filename via title and original delayed cleanup semantics. Other consumer integrations retain existing actions/workflows; no duplicate guide/route or new business explanation. Canonical UI6/14/18 and skill rule/revision synchronized; generated all8 packets, semantically reviewed changed alignment ownership/provenance and phase03 shared-owner roles, all8 -Check OK. No generated file edited directly.

Root kept ownership of all edits and tests. A bounded read-only reused sol_final_platform_audit identified the global important declaration while root traced runtime CSS; no overlapping edits. No backend/API/DTO/mapping/calculation/schema changes, no migration. No commits/push/deploy/database/migration/Graphify. User changes preserved on upgrade/angular-21-validation. Exact owner-session visual acceptance still pending because IAB was unavailable; screenshots establish functional alignment only.

Suggested frontend commit (owner only): fix: align attachment fields and existing row actions through shared components.
Suggested docs commit (owner only): docs: define attachment control-track alignment and verification.

Attachment build handoff: production exit0 in106.367s at2026-10-22T15:57:13.011Z, flat dist/sigma; existing seven warning categories remain. Initial5.76MB unchanged; shared editable table stylesheet now11.02KB versus10.60KB (10KB warning/20KB error preserved), no Angular/Sass compiler error. Evidence .angular/sass-modernization/file-row-production.log. No warning suppression/budget weakening. Final13 tests, scoped lint and diff checks above; final recipe check all8 OK. Owner visual acceptance remains pending. No further source changes after accepted checks.
