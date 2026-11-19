---
name: sigma-screen-refactor
description: Review, create, fix, or refactor Sigma Angular screens and their directly related .NET APIs using the current canonical books, shared owners, and frozen feature contracts. Use for Sigma screen work; unrelated application or artifact tasks use their own skills.
---

# Sigma screen review and implementation

Use this as the execution entry for Sigma screen work. It is a digest of the
canonical books, not another rule book. Read the workspace AGENTS.md first;
it owns authorization, scope, prohibited operations, delegation and reporting.

## Current sources

Documentation root:

```text
F:\My Work\Shaban Documents\Shaban\sigma-erp
```

- Workspace instructions: `F:\My Work\Sigma\AGENTS.md`.
- Start: documentation `README.md` (new screen / existing review / deferred decisions / skills).
- Screen choice: `ui/screens/00-catalog.md` and the selected screen file.
- Workflow: `master/01-*`, `master/03-*`, `master/04-*`, `master/07-*` as applicable.
- UI and backend rules: their named numbered blocks, reached through the indexes.
- Packets: `recipe-system/generated/`; check them before use through Master8.
- Existing feature decisions: `F:\My Work\Sigma\reviews\INDEX.md`; use the current
  contract, not an archived plan from a different feature.

Relative block paths below are under the documentation root. The book owns the
complete rule and rationale. Open the actual named reference/shared owner before
editing; do not copy a recently changed feature merely because it looks similar.

## Mandatory load-speed, query and index gate

Every new/reviewed screen records Master5's performance evidence in its existing
review: actual route/request/query boundaries and serial/duplicate/per-row work,
data/page/response/render scope, confirmed authorized fixes and remaining risks.
Use BE7 to bound/batch/project queries without dropping tenant/history/financial/
action/count/page semantics, parallel EF on one DbContext or excluded-read cache.
Use BE2 to evaluate existing indexes and propose exact ordered keys, optional
INCLUDE/filter, source/plan rationale, read benefit, overlap and write/storage
cost; record a supported no-new-index outcome when appropriate. No automatic
schema/index/migration execution follows a recommendation.

UI29 owns comparable cold/warm before/after measurement conditions, samples,
request/payload/SQL and rendering breakdown and feature-specific targets. Perform
the source audit and provide reproducible owner checks when runtime is outside
scope; do not claim measured speed from source call counts or a correct loader.
Master7 requires findings, results/pending evidence and index disposition at
handoff. No broad scan, new benchmark framework or unauthorized build/test/
browser/database/migration command is implied (Master5; UI29; BE7/2).

For batch writes, follow the shared save pipeline through numbering, reference
validation and audit as well as the feature's explicit query calls. Record and
correct confirmed per-child reads within scope, preserving the frozen number
authority, tenant/history and transaction contract. A single Save call does not
prove constant query count; internal child numbers cannot replace a genuine
document sequence (BE7, Hidden per-row work in aggregate saves; Master5).

Keep CodeCreateService's single entity/document-type resolver before its settings
read: unsupported children retain the existing uppercase/ticks fallback without
unused settings queries. Supported document types keep fresh policy reads and
manual/counter/seed/concurrency authority; never introduce a number-policy cache
or a duplicate type whitelist for this optimization (BE7).

For a confirmed recursive screen-detail read, use a bounded service-owned DTO
projection and finite no-tracking child reads, preserving consumed identities,
address flags, historical labels and tenant/live child scope. Reuse keyed
in-memory matching without changing order, explicit-source authority or prior
first-match semantics. Eliminate duplicate allocation preflight materialization
only by enforcing feature partner/account constraints inside the existing shared
writer transaction before its fresh source read; retain all write-time policy,
lifecycle, reservation/capacity checks, compatible callers and failure contracts.
Never carry cached/preflight capacity into the writer (BE7).

## Mandatory loading conformance gate

Apply UI22's gate during discovery and handoff. Start at the active route/menu
import and actual component, including a distinct legacy route when in scope.
In the existing review, classify request paths as global page including required
initial/filter bootstrap, local dialog or explicitly silent; record subscribed start/finalize/cancel, effective
showPageLoading metadata, sole rendered progress owner, busy/error/Retry and
final producer/consumer evidence. A shared import or startLoading call alone
does not prove correct visible progress (Master5).

Page/list/detail/save/domain/delete and report/export data reads use the global
owner. Required routed initial/filter lookup bootstrap uses that same page host
through ReferenceLookupStatus; no inline filter loading. Dialog lookups remain
local, retained cache refresh remains silent, and
Dashboard's explicit silent route does not exempt other screens. A dialog read
behind a body-appended overlay uses one shared local StateMessage. Suppress
duplicate loading messages/table/button indicators without clearing busy/disabled/
aria-busy or error/Retry. Preserve progress on same-path query/fragment updates;
reset on actual parsed path-tree departure, including child/outlet/matrix paths.
Do not alter write safety or add feature timers/hosts/skins. Fix known authorized
source mismatches before completion; keep runtime visibility, overlap and timing
acceptance separate (UI22/28; Master5).

AgreementHistoryDialog owns one local StateMessage read indicator, suppresses the
table mask and exposes Retry for unsuccessful envelopes and transport errors.
Reuse its loadHistory action and existing source/DestroyRef; never add a parallel
feature loader or global page count behind the body-appended dialog (UI11/22).

DocumentCurrency uses the existing ReferenceLookupStatus page/dialog scope for
its base/partner read flags and host aria-busy. Cancel replaced partner reads,
retain version/destroy finalization, saved-code/base fallback precedence and
optional policy feedback/coalescing. Partner failures expose one localized Retry
without form writes, reference/financial watches or new cache eligibility (UI22).

Keep shared loading counts and imperative isLoading guards immediate, while
LoadingService coalesces visual publication after the current render verification.
Retain its synchronous false seed, latest-count/zone/destroy handling and route
lifetime; never add per-feature timers or force detection to mask NG0100 (UI22).

An aggregate lookup error does not hide its remaining pending dialog reads:
ReferenceLookupStatus renders the single local progress independently from
errors and disables Retry until the batch settles. Page scope retains its
shell lease and retained-data refresh stays silent (UI22).

## Mandatory screen cache gate

For every new or reviewed screen, read UI2's mandatory gate and adoption
checklist before source edits. This includes editor lookups, list/report filters
and explicitly opted-in singleton settings. Record one row per actual consumed
URL/service in the existing review: classification, shared source owner,
successful writers/import invalidation, watch/tenant notifications, and the
source-supported reason for a direct-read exception. No lookup is implicitly
exempt because the screen extends BaseService or imports a shared binding.

Reconcile actual producer/consumer symbols at handoff (Master5): finite successful
bootstrap precedes a separate once-bound watch; selected-ID/current-option
getters preserve selected labels and drafts; context reset clears prior options
without remerging old detail labels; both failure channels retain state and expose
Retry; teardown ends the watch. Operational/capacity/rate/posting-account and
financial-number-policy reads keep their direct contracts. Do not broaden cache
eligibility or add a local replay/cache. Report source evidence separately from
runtime/network acceptance. A missing required source row or known unapproved
adoption mismatch prevents a completion claim; fix only within authorized scope
(UI2; Master5).

For required finite lookup batches, normalize a member's empty completion after
context reset into the existing bootstrap-failure/Retry path (for example RxJS
defaultIfEmpty(null)), or retain its established cancellable context reacquisition.
Do not let forkJoin skip next while finalize enables an uninitialized form;
mount watches only after successful finite bootstrap. Empty completion is not
an empty successful option list (UI2).

For an editor whose live source excludes unavailable identities, pass the final
`disableRetainedOptions=true` to ReferenceLookupBindings.bind and use the
existing Select optionDisabled metadata. Shared DropDownSelect.disabled marks
only selected labels absent from a fresh successful source; incoming rows retain
their own eligibility. Keep the default false for historical list filters.
Never change form values or remerge old-context labels on refresh (UI2).

Dashboard's owner-approved display snapshot is UI2's explicit singleton exception:
reuse the same scoped cache with full filter URL, 60-second TTL and existing
dashboard topic. Keep finite successful bootstrap before watch, context clearing,
and cancellation/deferred reacquisition on the shared data-free contextChanges
notification, including a reset during a pending finite read. Preserve
retained-data errors/Retry, forced manual reads and shared silent refresh. Shared
expiry owns normal reconciliation; visible failure retry must not create a second
successful-read loop. Never use the display snapshot for write-time operational
or financial decisions (UI2/22; Master5).

## Choose the task first

| Request | Execution path | Owning blocks |
|---|---|---|
| Review an existing screen | Read-only unless the owner requested fixes or an authorized phase. Inventory current behavior, compare it with the approved shape and contracts, report findings and unresolved decisions | Master1/3/4/7; workspace command vocabulary |
| Create a new screen | Discover existing owners, select shape, settle consumed domain/API contracts, implement the applicable read/write/action/integration paths, reconcile and write its in-app guide | Master1/3/4/7; UI catalog |
| Fix one bounded element | Use tier S and the relevant rule/reference; short report in the existing review, no separate freeze file | Master1 proportional process; Master5 |
| Change shared behavior or ambiguous business logic | Start with PLAN-00, inventory existing writers/readers, freeze the required decisions, then implement only authorized slices | Master1/4; PLAN-00 |
| Continue a deferred decision | Read its current decision index and owner condition. A deferred record does not authorize implementation | Master4; reviews/Deferred |

For broad work use Phases0 and6 plus only applicable intermediate phases. Freeze
consumed API contracts before splitting frontend/backend work. A label change
does not require every full-screen table. Missing material business decisions
remain explicit; apply the existing screenshot standing decision only within its
limits (Master2 and AGENTS.md).

## Read only the concerns present

| Concern | Canonical blocks | What to reconcile |
|---|---|---|
| Load speed, query and index evidence — every screen | Master5/7; UI29; BE7/2 | Actual path/requests/round trips and data volume → safe query fixes → comparable measured before/after or pending owner evidence → supported index proposals/costs or justified none |
| Loading ownership and visibility — every screen | UI22/28; Master5 | Actual route/component → request owner → subscribed start/finalize/cancel → showPageLoading/host → one visible indicator with busy/error/Retry; query-only URL updates retain pending progress |
| Cache classification and adoption — every screen | UI2/22/28; Master5 | Actual URLs and source owners → successful writers/imports/topics → finite bootstrap → separate watch → selected labels/draft/context/failure/Retry/teardown; justify direct-read exceptions |
| Shape and shell | UI1/3; selected catalog type | Current shared owner, route modes, container fill and fixed title/actions; one internal scroll owner per bounded region |
| List and export | UI2/4/5/6/7/8/10; BE7/9 | Applied filters → serialized keys → query/count/page → displayed/action fields → refresh/export |
| Editor and children | UI10/12/13/14/15/18/19; BE3/8/14/15 | Detail → typed form → client-owned inputs → backend validation/reconciliation → save/recovery/exit |
| Select, dates, numeric entry | UI14/16/17/19/27; BE8/10 | Public control inputs, typed identities, validator parity, parsing/precision, lookup selectability and backend authority |
| Domain actions | Master4; UI7/9/13; BE8/11/12/14/15/18 | Exact transition and effect, dependency/period/concurrency guards, confirmation or typed input, feedback and refresh |
| Reports and print | UI2/6/8/20/21; BE17 | Frozen complete/paged response, authoritative totals, shared report/print owner and unclipped print flow |
| Wiring and lifetime | UI1/2/22/26/27/28/29 | Root client/auth, standalone imports, cancellation, loading, one feedback owner and safe focus/overlay lifetime |
| Presentation and language | UI3/4/6/13/14/19/23/24/25/27/29 | Existing shared components/tokens, translated states, accessibility, all relevant widths, RTL and themes |
| Persistence and contracts | BE1–6/8/18; selected pattern13–17 | Correct bases/DTOs/maps, tenant ownership, business keys/FKs, save boundary and schema impact |

Each row is conditional. The selected screen file identifies the needed closure;
do not preload every block, all historical examples, or every skill in the environment.

## Current implementation baseline

- Apply UI1's full-available-width gate and UI29's acceptance matrix under
  Master5: trace active route → real host → shared page/panel → bounded body.
  Compare shared declarations with all local display/flex/grid/alignment/width
  overrides and breakpoints. Standard shared routes use sigma-route-host's
  block layout with no feature host geometry; a local flex row can shrink its
  page to content width. Remove the conflict instead of adding compensating
  widths. Keep pane layout inside the workspace; an approved flex-host exception
  must grow its direct page child and preserve scroll/print release. Record exact
  winning selectors plus empty/loading/error/populated, sidebar and responsive cases.
  Class names/syntax checks do not establish layout; visual measurement remains
  explicitly pending without authorized runtime verification (UI1/29; Master5).

- Batch bounded-page action eligibility instead of repeating detail/reservation
  queries per row; preserve tenant/live/history/ledger guards and writer checks.
  Compatible scalar reference branches can use one Concat/Distinct query; no
  action-flag cache or parallel EF on one DbContext. Source query-count evidence
  is separate from owner SQL translation and latency verification (BE7).

- Shared column filtering keeps empty rules inactive and rebuilds menu defaults
  after Clear/Reset; dynamic complete flat reports reuse DataTable. GET host bounds
  must admit the approved encoded grid JSON while the parser retains its smaller
  semantic limit. Stable-choice No value is distinct from Clear and round-trips as
  JSON null; local derived badges resolve the displayed choice (UI6; BE9).
- Post-save local merges must preserve the applied result membership/order/count;
  refresh when an active column filter can change membership (UI6).
- Custom list overrides that reconstruct/normalize filter dictionaries retain
  the reserved encoded grid key before ListQuery/shared filtering; reconcile
  count, rows, corrected page and complete export against the same predicate.
  Keep the existing shared parser and scalar whitelist (BE9).
- The shared grid membership hook accepts both int and nullable-int response
  identities by lifting membership to int?; null matches no entity. Do not add
  feature overrides solely for ListBaseVm.Id nullability. Computed display aliases
  and actual scalar projections remain feature-owned (BE9).
- The shared ListQuery filter type owns optional grid for named and inline typed
  screen filters; its serializer preserves the generic filter shape rather than
  fixing it to ListQuery<object>. Keep values narrowed to valid scalars (UI6/BE9).

- Angular21/PrimeNG21: standalone root in `main.ts`, `app.config.ts` and
  `app.routes.ts`; retained lazy NgModules and `pages/routing.ts` remain valid
  interoperability boundaries. Current shell/theme is `src/app/layout` (UI1).
- Apply UI1's Angular21 adoption gate per actual routed consumer: distinguish
  declared, installed and runtime versions; remember standalone is the default;
  inspect control flow, typed signals/computed/inject, subscription and request
  cancellation, queries and typed forms with their real contracts. Decorator
  queries and reactive forms remain supported; Signal Forms are experimental.
  Keep one root provider/client and Sigma's explicit Zone setting. Treat OnPush,
  zoneless, httpResource and other migrations as audited choices, not blanket
  requirements. Record compatibility exceptions and pending runtime evidence;
  version/API presence alone does not prove full modernization (UI1).
- Root providers own the application HttpClient and its token/error/navigation
  interceptors. Do not recreate AppModule or a feature client (UI1/2/22/28).
- AuthService coalesces sign-out transitions. Ordinary departure respects existing
  guards before clearing the session; a failed departure exposes translated Retry.
  Login must not reopen the workspace during that transition. A matching-request
  401 clears the expired session immediately; stale responses cannot end a new
  session, and routing must not race a document reload. Translation cleanup is
  idempotent and restores only runtime overrides, preserving tenant isolation
  and fallback/RTL. Reuse shell/state/action feedback owners (UI22/28/29).
- AuthGuard is authentication; the current application has no permission mechanism
  to invent or call. UI visibility is not security (Master1/4; UI26).
- Current shared presentation uses Sigma owners and PrimeNG. The retired Metronic
  tree, KT and Bootstrap component styling are historical references; independently
  used icon libraries and stored theme keys retain their real contracts (UI1/24/25).
- Read the public declaration of an installed control or framework API before a
  version-sensitive change. Old-version examples do not override the current
  supported platform (UI1/16/17/27/28/29).
- Keep MultiSelect's direct label container and label as stretching flex tracks
  in the existing global control owner so placeholder and selected text center
  vertically. Preserve publisher inline-flex/chip/gap/ellipsis, clear/dropdown,
  logical padding, busy/disabled, RTL/theme and shared heights; no feature offset
  or opt-in for the common correction (UI24).
- Sidebar active-row presentation stays in the current shared SidebarMenuComponent:
  reuse its route-derived state, Sigma theme tokens and reserved logical border
  spacing for the desktop aside and mobile Drawer (UI1/24/25).
- Shell header layout and shortcut overflow membership share the actual header
  container width. Preserve all saved shortcuts when direct links collapse;
  disconnect sizing observers and close popups whose triggers disappear. Keep
  the header on one compact row: narrow captions/controls, retain full titles
  and accessible labels, and keep phone Manage inside Shortcuts. Restore focus
  to a visible trigger; keep shell popup width/scroll bounded (UI1/27).
- Keep model-specific financial effects with their frozen lifecycle. Current
  approval/void policy and historical source that has not migrated must be named
  separately; never copy an old reference's posting timing as a new policy
  (Master4; BE14/15/18).
- Approval adoption follows Pending→Approved/Rejected and guarded Approved→Pending;
  Rejected is terminal. Reject/UnApprove collect a saved reason≤500, and the saved
  tab and Approval Status dialog reuse one shared approval panel/server context.
  Undo actual stock/journal effects under model guards; do not mutate a status
  alone. Document log actions use Log/السجل consistently (Master4; UI7; BE18).
  Match PurchaseOrder's bounded tab/dialog composition: approval adapters fill
  their parent directly; the shared panel owns scrolling. No extra editor-scroll
  wrapper around a zero-basis approval adapter (UI13).

## Essential execution checks

- Separate physical return quantities and linked financial credit when the frozen
  model does. Reconcile stock, net receiving capacity, unbilled quantities and
  credited coverage; never release an original billed receipt for a second bill.
  Snapshot original posted net/tax account values onto tracked source lines;
  detached posting previews are not persistence. Derive actual server action
  flags, preserve dedicated payment/PDC owners, and retain history (BE15).
- Composite source segments use complete source keys with stable adapter IDs
  across refresh/reopen; unavailable retained rows keep zero remaining. Ensure
  projected collection actions have a rendered toolbar. Freeze parent mutation
  for modals, preserve dirty Retry and reload changed route IDs (UI13).

- Reviewed reference sources share BaseService/ReferenceLookupCacheService:
  source opt-in, full encoded custom-select URL identity, exact source-family
  invalidation after successful typed/inherited writes. Declare indirect source
  dependencies only with producer evidence. Imports invalidate on positive
  savedRows even after partial failure. Preserve fresh operational/capacity/rate
  selectors, feedback modes, session fences, clones and open drafts (UI2).
  Distinguish ordinary identity GetSelect from live searches by its actual
  producer. Visible-window focus or route changes alone do not evict snapshots;
  only an observed hidden→visible return does the tab-return invalidation once,
  retaining unfinished reads (UI2).

- Explicit source dependencies invalidate after successful typed/inherited writes
  even when the writer does not cache its own GetSelect. Preserve own-source
  opt-in, exact dependency families and failure behavior. Existing aggregate
  Customer labels depend on Company/IndividualPartner writers and positive
  persisted import outcomes; use the source service/shared operator, not a
  global mutation watcher (UI2).
- Customer Company/Individual writes and positive persisted imports can provision
  the default Customer ContactGroup. Invalidate that proven ContactGroup family
  alongside aggregate Customer labels, including typed selectors; zero-row/failed
  imports do not invalidate. Reuse the source cache/operator, without opting in
  the writer or changing draft/financial state (UI2).

- Active lookup revalidation keeps initial reads finite and mounts a separate
  shared watch/binding. Coalesce invalidations, restart waiting finite readers,
  refresh only active visible watches on TTL/source notifications, and retain
  prior options with Retry after failure. Reuse the root realtime socket and
  post-commit tenant topics; clear old-context options and preserve form IDs,
  drafts and financial calculations. No new state library/inspector is implied
  by cache adoption (UI2).
- Explicit singleton cache sources preserve Result/entity validation, scoped
  finite reads and success-only exact-URL invalidation. Derived adapters must
  not permanently replay over the scoped cache. Background revalidation keeps
  a retained snapshot usable without page/lookup loading; preserve initial
  loading without data and failed-refresh Retry (UI2/22).
- FinancialNumberPolicyService retains its direct policy contract. A caller
  with inline policy errors uses the optional skipErrorInterceptor load option;
  an explicitly required fresh load/Retry uses load(true, options), handles both
  failure channels and fences stale responses. Do not turn this into a reference
  watch or alter open-document precision/rounding from a lookup emission (UI2/28).
- Every reviewed/new screen applies UI2's cache adoption checklist: classify
  sources, reuse source services, cover all successful writers/import outcomes
  and tenant topics, retain finite bootstrap, bind open choices once with
  selected-ID/current-option getters and teardown, preserve drafts and reconcile
  failure/TTL/session behavior. Operational reads remain direct. UI22's shared
  header badge observes actual retained-data refresh after500ms; add no local
  badge/loader/timer or permanent replay cache over the shared source (UI2/22).

- Percentage read columns reuse DataTable's percentage type and installed
  ProgressBar: raw percentage points, two-decimal label, tiny decorative bar,
  dash for missing/non-finite, clamp visual fill only. Preserve numeric filters,
  callback/template precedence and percent text in export/print (UI6/8/24/25).

- Equivalent document source-line workflows reuse SourceDocumentPicker with
  finite operational reads, retained cross-document picks, explicit Apply and
  harmless Cancel. A known single source uses its compact table layout with
  inline quantities and stable row identity. Complete picker-owned source lists
  use optional documentNavigation for table → lines → retained Back within one
  shell (GRN); use FilterPanel Search/Reset and selected counts. Missing retained
  candidates remain accessible for correction; no eligibility override. Source-specific labels stay in the
  shared public contract. Preserve an explicit Back-to-sources action with the
  picker’s own discard comparison and optional caller-draft consent. Approved
  multi-source callers use retainOnBack to keep working picks, and discardBaseline
  carries original session consent across remounts. Apply stages
  editor-owned rows; only the owning editor Save persists its source command,
  preserving entered headers/files. Adapter/backend retain eligibility/capacity/lifecycle authority;
  use line FKs across allowed sources and reconcile all readers/guards. Split
  collection toolbars keep source opposite Add with validation below (UI13/14;
  BE14). Conversion provenance is detail-only, even for one source: GRN stores
  PO/source-line IDs, PO stores PR/source-line IDs, and requisition-generated PR/
  issue rows retain the actual selected item source. No persisted master source
  summary; keep aggregate ownership and document-wide context distinct. Direct
  Bills combine several compatible General orders or several compatible Job
  orders through the same picker; never mix types or direct/manual/receipt rows.
  Operational select/draft/save/preview/approve and whole-bill usage/progress
  readers share supplier/effective-currency/branch and per-line capacity rules.
  Retained edits keep source-line identity and saved order membership; approved
  invoices and pending reservations remain separate. Bill defaults sum existing
  proportional source-discount suggestions without a new consumption mechanism
  (BE14; UI13). Server
  derives/validates pairs; manual inputs cannot attach claims. Reference checks
  protect both stored and actual source parents. Requisition capacity shares
  ItemRequisitionSourceQuery's reliable proof versus historical parent+item policy;
  present inconsistent keys block new capacity. Remove master FK/DTO/form/read
  branches together. Count only reliable line proof; keep manual legacy fallback disjoint,
  and report owner migration/backfill review without executing it (BE14).
  Multiple PRs in one PO keep per-line source attribution and exact
  server-owned per-source discount shares; reservations/guards read actual lines,
  with whole-order one-source legacy monetary-discount fallback. Recalculate only edited orders under the
  existing source lock, retain pending descriptions, and report schema migration
  without creating/running it (BE14). No whole-source automatic acceptance or copied picker.

- Collection source controls reuse the existing toolbar action slot beside Add.
  Keep collection validation in shrinkable/wrapping flex flow so it cannot cover
  projected controls; preserve feature-owned source/form guards (UI14).

- Use Sigma's shared PrimeNG-based owners first for uniform appearance and
  interaction. Inspect their actual public API/imports/composition; extend a
  missing capability there. Extract reusable candidates into the right shared
  component/directive/pipe/util/service and adopt affected consumers in the
  same task under Master5's extraction gate. Preserve model business rules.
  Document the reusable inputs/events/states/usage in the owning book and skill;
  regenerate packets. Apply complete base+modifier styles, not a semantic
  modifier or shared-looking class alone (Master5; UI24).
  Shared secondary/danger styles also cover the same native element's p-button
  class, including hover/focus and explicit idle background; danger supplies
  its semantic directive severity (UI24). Verify publisher cascade, not just classes.

- Sidebar group reveal follows rendered expansion and actual motion-container
  resizing in the shared SidebarMenuComponent; a pre-motion scroll may clamp too
  early. Align only the bounded menu, and cancel frame/observer on manual input,
  search/pin, another command, navigation or destruction (UI1/27/28).

- Sidebar hide/show and desktop/Drawer remounts retain disclosure/search in
  typed Layout-owned transient state passed to the single mounted menu. Capture
  final publisher expanded state, including sibling collapse, with cached stable
  catalog IDs; keep search disclosure separate and restore normal groups on
  Clear. Preserve route active styling and Drawer lifetime (UI1).
  On remount, reveal the visible active leaf or closest visible ancestor, then
  a restored open group, through the same bounded alignment. Preserve collapsed
  groups; wait for measurable Drawer/row geometry and cancel on manual input (UI1).

- For shell sidebar fixes, preserve UI1's vertical-only menu viewport, stable
  scrollbar gutter and logical-end Pin clearance, including overlay scrollbars.
  Native group buttons keep zero margin/padding so shared row insets align their
  icons and labels with same-level page links (UI1).
  Bound motion-grid columns and shrinkable nested list hosts; labels shrink
  within their width and wrap fully, including unbroken names, beside fixed
  icons/Pin/chevron. Do not ellipsize sidebar names or clip action focus outlines (UI1/27).
- Keep list/detail/write contracts separate and minimal. Match exact grid fields,
  nullability, query keys and action-state consumers. Server-owned totals, tenant,
  document number and state do not become client inputs (Master4; UI2/5; BE3/7/9).
- Verify each new/moved .NET type's declared namespace, consumer imports or actual
  global imports, owning project reference and source inclusion. Inspect the
  producer's first error before changing correct dependent consumers; source-only
  evidence does not establish a successful build (Master5, Type and contract safety).
- Reuse shared filters, data tables, editors, child-row helpers, confirmations,
  file fields, validation, loading and feedback owners. Screen-owned fields and
  business decisions stay with the screen (Master5; UI1/4/6/9/10/12–24).
- Editable rows with canonical field errors, existing `.sigma-field-error`
  feedback or file fields use the shared first-control-line alignment, Remove
  height and standalone checkbox offset. Feedback grows below controls; no
  screen opt-in, fixed error height or private row alignment. New feedback
  remains owned by `app-field-error` (UI14/19).
- Shared read-table column menus filter the complete result: local flat arrays
  before local paging, or the existing scoped server projection through the
  approved `Filters[grid]` contract before count/page/export. Preserve applied
  snapshots for paging/refresh and clear on Reset; verify custom materializers,
  scalar aliases and enum/date types. Freeze the first rendered logical-start
  column through the shared owner; retain editable row indexes and hierarchy
  semantics, with explicit source-backed exclusions (UI6/14; BE9).
- Align direct checkbox filters in mixed stable main/advanced grids through the
  existing FilterPanel heading/control tracks, independent of inline actions.
  Keep reserved feedback outside the control track, native checkbox sizing and
  mobile standalone rows; preserve checkbox-only grids and nested groups (UI4).
- Prioritize useful field/data space: concise optional help, no duplicate selected
  labels, public summary/layout inputs and conditional empty warning columns.
  Full choices remain reachable and actionable errors/unavailable selections stay
  visible; preserve full-width search/filter strips, shared sizes and responsive
  stacking (Master5; UI3/4/6/13/16).
- Persisted bilingual lookup names keep stable IDs and supply optional localized
  metadata through the shared dropdown/report-option owner. Language switching
  changes labels without refetching or resetting drafts; retain translation-key
  precedence and base-name fallback (BE10; UI20).
- Report field proportions use the shared `wide` descriptor/modifier; inline
  column counts include its second track. A checkbox's optional `withActions`
  places its one typed control in the shared toolbar, preserving other checkbox
  placement and responsive wrapping; retain mobile full-width fields (UI20).
- Shared loading appearance stays in StateMessageComponent and the shell's
  existing content overlay; retain one visible progress owner, theme tokens,
  translated status and reduced-motion behavior, without feature copies.
  UI22's single critical stylesheet in index.html owns the JV ring/status/card
  from startup onward; reuse sigma-loading-* classes through existing shared
  controls. Remove private splash/refresh-spin/vendor loading skins in scope.
  PrimaryActionButton/table/header use that same scaled ring; EditorDialog shows
  one local shared saving status above its body mask while retaining global
  write counting. Dialog reads stay local with table/button masks suppressed.
  Required routed bootstrap contributes to the page host through identity-owned
  LoadingService.setPageLookupLoading leases in ReferenceLookupStatus; input
  changes/destruction release only that owner, never request start/end counts.
  Default LOOKUP_LOADING_SCOPE is page; EditorDialog providers (not viewProviders)
  supply dialog scope to projected/nested consumers. Keep the consumer mounted
  during bootstrap, page template error/Retry without inline loading, and
  aggregate local dialog status. Retained cache refresh stays silent,
  and ErrorInterceptor never decrements a count it did not start (UI22/24).
  Require one visible indicator, not merely the same ring: shared critical CSS
  suppresses routed loading StateMessages while the actual shell host exists;
  body-appended dialog progress takes foreground precedence, and EditorDialog
  saving suppresses covered local states. No per-screen opt-in or early busy
  reset; errors/empty/Retry remain. With no foreground owner, aggregate auxiliary
  reads into one status. Reconcile page+lookup, lookup-only, dialog read/background
  and dialog save/lookup overlap for every screen (UI22).
  Login/Registration and FileField use the same compact ring/currentColor;
  Charges uses StateMessage. Remove superseded sigma-spinner and private
  refresh-spin skins without changing request or domain contracts (UI22).
  LoadingService resets on parsed route-path departure, including child/outlet/
  matrix paths; same-path query/fragment changes preserve pending progress.
  Pair every subscribed start with finalize release; this does not own or reset
  NavigationActivityService write safety (UI22/24/25/28/29).
  Body-appended DocumentApprovalCycle/DocumentActionLog readers select local
  read progress with localReadProgress=true (default false); capture the request
  owner and release only a started global count. JVs dialogs adopt it, page tabs
  retain global, and decision/write contracts stay unchanged (UI22).
- Dashboard renders metadata with blank pending values before the operational
  snapshot arrives, using request/error/Retry state without visible Loading text,
  spinner or shell overlay. The shared pending-slot highlight follows the real
  request, then the count begins; no invented values/progress. Reuse SummaryCards valuesPending/animateValues and AnimatedCount
  for numeric presentation; preserve authoritative values, null-versus-zero,
  final accessible/printed text, reduced motion and frame cleanup. These flags
  default false for unrelated consumers under the explicitly scoped owner
  request (UI22/24/28).
- Shared pending counts use three staggered breathing strokes and a light sweep,
  then a short fade/rise and1100ms count with final-width reservation. Keep
  placeholder motion tied to real pending state, final accessible/print text,
  RTL sweep, reduced motion, forced colors and cleanup in AnimatedCount; no
  per-feature animation copies (UI24/28).
- PendingMotionComponent owns the shared decorative strokes for counts and table
  placeholders. Header branch/background-refresh request indicators use UI22's
  unified ring; preserve labels/guards/error/Retry and tiny-width visibility.
  Dashboard uses reserved hint space, stable count line boxes/metric columns and
  fixed table frames with reachable internal rows; print releases bounds. Reuse
  SummaryCards reservedHintKey rather than copying private geometry (UI1/24).
- Branch-independent read routes may explicitly opt out of the default branch
  bootstrap/page overlay through requiresBranchContext/showPageLoading metadata.
  Keep dependent-route activation gated by the existing guard and shared finite
  branch load; resume after finalize, retaining write/session/error recovery
  contracts. Dashboard is the approved consumer (UI1/22).
- Snapshot performance reuses SQL-grouped populations and compatible scalar
  count UNIONs, proven UTC boundaries and zero-contribution prefilters. Retain
  tenant/null/order/cancellation/sequential-DbContext contracts, existing table
  mappings and nullable soft-delete semantics in latest-row indexes. Owner
  migration/SQL plans/timing remain pending (BE2/17).
- Scrollbar appearance belongs to the shared Sigma scrollbar Sass owner, without
  screen opt-in. Preserve each region's overflow/gutter/sizing and the native
  touch/high-contrast fallback; do not add a private screen skin (Master5; UI24/25).
- Backend calculations and validations are authoritative. Choose the simplest
  valid pattern; justify overrides and transaction boundaries. One tracked graph
  saved once uses the existing implicit-save contract (BE5/8/13–18).
- Linked document-cycle reviews inventory source/converter/downstream writers,
  keep approval/use/invoice/reservation/settlement separate, and derive quantities
  from precise source lines. Pending invoices reserve but do not count as invoiced;
  mutation guards and report filters share the authoritative rules. Audit stock,
  finance, allocation, currency and period effects before exposing state actions
  or the shared document log (BE18; UI7).
  Type-directed source conversion reuses the destination editor and exact saved
  source-line identities. Keep server action eligibility, preview/write/approve
  capacity and downstream mutation guards consistent across every path; retained
  draft reservations cannot be bypassed by client copies or manual status toggles
  (BE18; UI7).
- For explainable bulk actions, freeze one terminal outcome/reason per scoped
  record and derive exhaustive category counts from that set. Changed counts do
  not equal coverage; keep setup warnings separate from record reasons (BE3).
- Keep classification metadata independent of operational selectability. Restrict
  grouping-only roles in every posting lookup and write predicate; a display-only
  opt-in must not widen creation or posting transitions (BE10).
- For financial tree totals, use raw own amounts plus one bottom-up direct-parent
  accumulation, or immutable raw snapshots for all-ancestor propagation. Never
  forward a mutable already-aggregated subtotal to every ancestor (BE17).
- Choose settings scope from the owner contract, not report date/year filters.
  General company definitions use a tenant singleton; only explicitly partitioned
  settings inherit detached snapshots. No read-time seeding; validate retained and
  incoming rows together before reconciling owned mapping children (BE16).
- Cash-flow attribution distinguishes accrual changes from actual cash legs.
  Keep unresolved diagnostics independent of the reconciliation difference and
  carry both through screen, print and export (BE17).
- Preserve current user/peer changes and frozen decisions. Only historical
  evidence is archived; missing material decisions are not resolved by guessing
  (Master1/2/4/8; AGENTS.md).
- Reconcile source after implementation. An authorized screen delivery includes
  the owning module's bilingual in-app UserGuide topic, using the existing reader
  and real final routes/actions (Master7; UI23/29).
- Distinguish source checks from compilation, runtime, browser and data evidence.
  The presence of a command or a regression source is not permission to run it;
  apply AGENTS.md's current execution boundary (Master7; UI29).
- For expensive independent tab reads, first activation starts the read and the
  tab instance is retained for the same record. Reset on record/reload/context
  changes while preserving busy, draft, guards, error/Retry, cancellation,
  teardown and direct tab links; hidden CSS alone does not establish lazy
  creation or lazy network work (UI13).
- Before expensive list/detail/approval action enrichment, gate from projected header facts and
  reuse authoritative helpers. Compatible source unions may be combined only
  when tenant/history/include-deleted and ambiguity semantics survive;
  candidate multiplicity and unsupported/null kinds still count toward ambiguity,
  no parallel EF runs on one context,
  and source call counts remain separate from SQL/latency evidence (BE7).
- For a document Journal action, use the neutral shared
  `DocumentJournalComponent` read dialog: approved EditorDialog size,
  table/totals and local StateMessage ownership, direct uncached Result read,
  Retry, identity/version cancellation, OnChanges reset, close abort/emission
  and shared Close focus. The feature owns endpoint, type formatting and
  eligibility; the shared reader owns no financial or allocation rules (UI13).

## Maintaining this skill

For complete collection printing, mark the existing EditableCollectionTable host
with `sigma-print-flow`, along with every bounded outer wrapper. Its shared
print rules release internal fill/frame/sticky/minimum-width constraints and
paper colors, while hiding action/validation chrome. Prepare all applicable
saved panels/rows through ReportPrintService's existing session; the class never
restores rows omitted from the DOM. The table uses ViewEncapsulation.None, so
shared rules use its real host selector, not `:host` (UI14/21).

A verified reusable lesson is written to its owning canonical block and reflected
here only when it changes execution routing or essential checks. Add a dated
revision row; feature-specific details stay in the feature contract. Regenerate
and semantically review affected packets after canonical changes (Master8).
Do not append full feature narratives or duplicate code manuals to this entry.

| Date | Revision | Owning blocks and evidence |
|---|---|---|
| 2026-10-27 | Treat required finite lookup empty completion on context reset as failed bootstrap with Retry, never initialized form readiness | UI2; TransportationAgreements list/editor and ReferenceLookupCacheService outcomes completion source audit; source-only, runtime context-switch acceptance pending |
| 2026-10-27 | Accept nullable list identities in shared column-filter membership | BE9; Equipment Rental source audit, ListBaseVm.Id and shared Service.ApplyGridFilters; EF translation/runtime pending |
| 2026-10-27 | Keep one dialog lookup progress owner during a failed-member/pending-member overlap, with independent error feedback and settled Retry | UI22; Lease Inquiry/Cost Setting final source reconciliation, shared ReferenceLookupStatus branch correction; runtime overlap pending |
| 2026-10-27 | Release EditableCollectionTable internals through its existing print-flow host contract, retaining complete prepared rows and shared paper/action rules | UI14/21; Lease Agreement routed-print correction, actual None encapsulation and shared frame/style reconciliation; source-only, multi-page/RTL/theme acceptance pending |
| 2026-10-27 | Reuse checkbox heading/control tracks for direct fields in mixed stable filter grids without inline-action opt-in; preserve grouped checks and mobile rows | UI4; owner RentalAgreement Permanent Vehicle alignment request; shared selector/control-track reconciliation, visual acceptance pending |
| 2026-10-26 | Preserve editor labels removed by active source refresh as disabled historical selections through the shared binding; keep filter defaults compatible | UI2; Rentals R06/R09, shared ReferenceLookupBindings optional final flag and DropDownSelect.disabled; source-only, selection/context/runtime pending |
| 2026-10-26 | Opt Dashboard display snapshots into the existing scoped cache with per-filter identity, 60-second expiry, shared topic/watch, pending-read context-reset recovery and forced manual Retry; retain direct write-time authority | UI2/22; explicit owner Dashboard cache request, frozen Dashboard cache plan and source reconciliation; runtime pending |
| 2026-10-26 | Center MultiSelect placeholder/selection through its actual intermediate label flex track in the shared owner | UI24; owner ServiceBookings Status alignment, installed PrimeNG21/PrimeUIX template/style; source-only visual/runtime pending |
| 2026-10-26 | Register consumed transaction-currency reads with the shared page/dialog progress owner and cancel replaced partner contexts | UI22; Sales current review and DocumentCurrency source, same display/fallback/policy authority; source-only runtime pending |
| 2026-10-26 | Preserve reserved grid rules through custom normalized filter dictionaries into shared count/page/export queries | BE9; Sales Fleet EquipmentService current review and frozen corrective contract; source-only, SQL/runtime pending |
| 2026-10-26 | Bound recursive screen details and reuse allocation writers with constraints inside their transaction; preserve keyed matching authority and first-match order | BE7; Staff F5/F6/F8 frozen fixes and scoped source reconciliation; source-only, SQL/timing and runtime acceptance pending |
| 2026-10-26 | Unify the JV ring from critical startup styles through shared page/dialog/table/button/header owners; remove duplicate request visuals and unowned interceptor count release | UI22/24; SHARED_LOADING_UNIFICATION frozen plan/UI handoff and actual Customers/Suppliers/startup source; local dialog reads, foreground dialog saves and busy/cache/error contracts preserved; runtime acceptance pending |
| 2026-10-26 | Enforce one visible progress owner for every page, including overlapping auxiliary StateMessage, with modal/save foreground precedence | UI22; owner-reported IndividualPartner duplicate traced to page + lookup status; common critical visibility rules apply without opt-in; Customers/Suppliers source reconciliation, no request/cache/count changes; runtime acceptance pending |
| 2026-10-26 | Required routed initial/filter bootstrap uses the page loader, never an inline filter status; keep dialog lookup progress local | Master5/UI22; latest owner Statement-of-Account clarification; ReferenceLookupStatus identity leases and EditorDialog providers scope, same request counts/cache/watch/error/Retry; Customers/Suppliers consumers inherit; source-only/runtime pending |
| 2026-10-26 | Skip unused settings reads for unsupported child numbering through one existing type mapping | BE7; CodeCreateService and Customers aggregate save-path evidence; same fallback, fresh supported policy and counter authority; source-only/SQL pending |
| 2026-10-26 | Trace Customer default ContactGroup dependencies through typed writes and positive persisted imports | UI2; ContactGroupAccountService and ImportDataService producer evidence; Customers module frozen contract; source-only/network pending |
| 2026-10-26 | Reconcile shared agreement-history local read progress and retry ownership | UI11/22; Customers module review, shared StateMessage and guarded source retry; source-only, runtime pending |
| 2026-10-26 | Add a per-consumer Angular21 adoption evidence gate without forcing experimental or blanket migrations | UI1 supported platform; official Angular21 component, query, forms, provider and performance documentation; IndividualPartner frozen frontend contract; runtime verification remains pending |
| 2026-10-26 | Make full-width ownership, local host override inspection and state/viewport acceptance explicit before handoff | UI1/29; Master5; repeated Monthly Posting width report traced to feature flex host overriding the shared block host; source correction, visual acceptance pending |
| 2026-10-26 | Stabilize shared progress publication after routed child initialization; retain immediate operation guards and coalesced latest-count rendering | UI22/Master5; owner NG0100 in Layout aria-busy during Amortization load; shared LoadingService microtask/NgZone and report-tree guard; regression coverage authored, execution pending |
| 2026-10-25 | Stabilize Dashboard initial card geometry; extract waiting motion for counts/table placeholders and branch select | UI1/24; owner requests final card height/width and same branch-loading animation; explicit stable table frame/reserved hint space, source-only runtime pending |
| 2026-10-25 | Trace aggregate save numbering, reference validation and audit for hidden per-child queries; preserve actual document-number authority | BE7/Master5; Amortization source evidence through UnitOfWork number preparation, derived internal child identifiers only; source-only SQL/timing acceptance pending |
| 2026-10-25 | Define the neutral shared DocumentJournal read dialog contract and record Bill's existing journal copy as UI30#39 debt until its own review | UI13/UI30; JVS frozen Journal-window appendix and maintenance plan; source-only, runtime acceptance pending |
| 2026-10-25 | Add shared route-host width/child-stretch guidance, first-activation retained tab reads, and pre-enrichment action-candidate gates with ambiguity-preserving source unions | UI1/UI13/BE7; JVS frozen editor-opening appendix; source-only, runtime/plan/timing acceptance pending |
| 2026-10-25 | Require proportional load-speed audits, reproducible before/after verification and query/index evidence for every screen, with existing coverage, exact candidate shape, cost and disposition | Master5/7; UI29; BE7/2; explicit owner general-documentation request; source-only and runtime/migration boundaries preserved |
| 2026-10-25 | Expose optional local read progress in existing approval/log owners for body-appended dialogs; page/default consumers retain global reads | UI22; JVs status/log dialog masks hide page overlay; captured per-read owner with paired release; no decision/API changes; source-only visual acceptance pending |
| 2026-10-25 | Require loading request/visibility evidence from actual route imports; distinguish query-only URL changes from path departure, retain one visible owner and scoped local/silent exceptions | UI22/28/Master5; owner reports JVs/SalaryVoucher missing loader and asks to remove documentation ambiguity; frozen loading amendment and LoadingService parsed UrlTree comparison, source-only/runtime pending |
| 2026-10-25 | Audit page query budgets and batch allocation eligibility/source references while retaining tenant/history/ledger guards and writer authority | BE7; owner reports slow JVs; 24 scalar reference branches become one materialization and per-row capacity reads become two page reads; source-only SQL/latency acceptance pending |
| 2026-10-25 | Refine shared pending/count motion: staggered strokes, transform sweep, fade/rise and stable final width | UI24/28; owner asks for better Dashboard animation; source-only visual/motion acceptance pending |
| 2026-10-25 | Silent Dashboard page, real-wait blank-slot motion, branch-independent route policy and SQL snapshot consolidation/index declarations | UI1/22/24; BE2/17; owner removes all visible loading, requests backend performance and confirms pending-slot motion then counter; 24 to12 source query boundaries, owner migration/build/runtime pending |
| 2026-10-25 | Shared pending/animated count presentation with immediate Dashboard metadata; local snapshot loading, final accessible/print values and cancellable motion | UI22/24/28; owner explicitly requests Dashboard initially without numbers then a counter; additive SummaryCards inputs preserve other consumers; source-only/runtime pending |
| 2026-10-25 | Elevate existing cache adoption requirements into a mandatory entry/discovery/handoff gate, with per-URL classification and producer/consumer evidence; document direct policy read feedback/Retry without a reference watch; preserve source-only verification | UI2/Master5/UI28; owner asks why JVs cache requirements were missed and requests clearer documentation; FinancialNumberPolicyService optional feedback signature matched to source; no expansion of source eligibility or financial policy |
| 2026-10-25 | Honor declared dependent-source invalidation independently of the writer's own cache opt-in; reconcile existing aggregate Customer labels with Company/IndividualPartner writes and positive saved-row imports | UI2; JVs cache source matrix and CustomerService.SelectAsync producer evidence; no new cache source or financial effect; source-only, owner runtime acceptance pending |
| 2026-10-25 | Reconcile separate physical returns/financial credits, tracked original posting snapshots and explicit ordinary-payment lifecycle; stable composite source picker IDs and modal/read recovery | BE15/UI13; frozen purchasing goods/payment contracts, shared public declarations and source reconciliation; owner migration/build/runtime pending |
| 2026-10-24 | Complete compatible multi-order direct Bills through the existing compact picker and whole-bill quantity/progress readers; detail-only provenance and local Apply/main Save | BE14/UI13; owner requires the same idea throughout purchasing; frozen Bill multi-order contract, source-only/runtime pending |
| 2026-10-24 | Generalize detail-only conversion provenance across PO, requisition PR/issue and GRN issue; shared source-proof capacity | BE14; owner explicitly generalizes GRN correction; preserve document context, lifecycle, exact discount and migration boundary; source-only |
| 2026-10-24 | Single-flight guarded logout, matching-request expiration and idempotent runtime-translation cleanup | UI22/28/29; owner requests fixing logout delay findings; source regression coverage, runtime timing pending |
| 2026-10-24 | Compact known-source picker table, semantic headings and stable inline quantity rows; adopt for PR to PO selection | UI13/4; owner explicit checkbox/quantity selection and table-only clarification; source-only acceptance pending |
| 2026-10-24 | Explicit compact-picker return action with selection discard ownership; editor-owned Apply stages rows and final Save preserves headers/files | UI13; owner PR-to-PO selection correction; source-only acceptance pending |
| 2026-10-24 | Retained multi-source Back/session baseline and per-request PO discount attribution | UI13; BE14; owner multiple requests for same supplier; source-only acceptance pending |
| 2026-10-24 | Compact picker-owned document navigation for GRN, local FilterPanel and retained Back; external PR navigation preserved | UI13/4; owner GRN picker to match PR compact flow; source-only acceptance pending |
| 2026-10-24 | GRN detail-only PO identity, paired server source validation and disjoint readers; no master FK | BE14; owner explicit detail-only storage correction; migration/acceptance pending |
| 2026-10-24 | Shared multi-source line picker, split source/Add toolbar and line-level source authority across capacity/billing/report guards | UI13/14; BE14; explicit GRN line/quantity picker and general reuse instruction; source-only, runtime pending |
| 2026-10-24 | Reuse collection toolbar projection for source controls; keep shared validation in normal wrapping flow to avoid overlap | UI14; GRN PO-source placement beside Add, source-only acceptance pending |
| 2026-10-24 | Supersede two-row TopBar with one compact row; collapse phone captions/logo and duplicate Manage, preserving full titles/actions and visible focus return | UI1/27; explicit owner correction; source-only, visual acceptance pending |
| 2026-10-24 | Add real shared cache-refresh Topbar badge and an end-to-end adoption checklist for reviewed/new screens | UI2/22; owner reports absent proposal and requests all cache steps in canonical docs/recipes; source-only |
| 2026-10-24 | Opt common settings into the existing source cache and keep retained-data revalidation visually silent | UI2/22; explicit endpoint opt-in and owner background-loading clarification; source-only verification |
| 2026-10-24 | Reconcile TopBar rows and shortcut overflow against actual header width, with narrow popup bounds and observer cleanup | UI1/27; owner responsive request; existing ShellHeader/AppbarShortcuts and installed PrimeNG contracts, source-only visual acceptance pending |
| 2026-10-24 | Add separate active reference watches over finite bootstrap reads, TTL/post-commit source revalidation, retained-data Retry and context fencing through existing shared owners | UI2; approved reactive cache contract, root realtime owner and reviewed source registrations; source-only/runtime pending |
| 2026-10-24 | Prevent visible-window focus from discarding reference cache; include source-verified ordinary Job/Vehicle GetSelect while keeping live searches fresh | UI2; owner reports repeated PO GetSelect, base SelectAsync/GetDropdownAsync and focus-handler source evidence; regression specs updated but execution pending |
| 2026-10-24 | Expand reviewed purchasing reference sources through the existing cache; type-family/dependency invalidation and positive persisted-row import outcomes | UI2; source opt-in contract, Supplier default-group producer and import envelope evidence; source-only/runtime pending |
| 2026-10-24 | Restore selected-row reveal after sidebar remount, with visible-ancestor fallback and geometry-aware Drawer timing | UI1; owner confirms selection retained but no upward movement; shared reveal owner source reconciliation, runtime pending |
| 2026-10-24 | Retain sidebar disclosure and search through layout-owned transient state across hide/show and desktop/Drawer remounts; keep normal/search expansion independent | UI1; owner asks to preserve selected menu elements; installed publisher expanded mutations and source-only reconciliation, runtime pending |
| 2026-10-24 | Type-directed source conversion uses precise keys, existing destination editors, retained draft capacity and all-path source guards | BE18/UI7; owner confirms PO Stock/Asset via GRN and General/Job direct partial billing; source reconciliation/runtime pending |
| 2026-10-24 | Shared percentage column with numeric text and decorative PrimeNG bar; preserve raw numeric/filter and print/export contracts | UI6; owner percentage-column appearance/documentation request; PR/PO adoption, source-only |
| 2026-10-24 | Cover publisher p-button specificity in shared secondary/danger geometry and states; explicit danger surface/severity | UI24; owner Reject screenshot shows primary background under danger text; source-only visual acceptance pending |
| 2026-10-24 | Make existing shared PrimeNG-based owners the default; extend/extract reusable candidates and adopt them with documented behavioral contracts | Master5/UI24; explicit owner uniform-app/shared-candidate instructions; documentation-only |
| 2026-10-24 | Reconcile both approval surfaces against PurchaseOrder; avoid duplicate scroll wrappers around shared approval adapters | UI13; owner blank PR status/missing tab report and explicit PO reference; shared flex/scroll source evidence, runtime pending |
| 2026-10-24 | Wrap long sidebar labels in full beside fixed Pin/chevron; supersede label truncation | UI1/27; explicit owner request for full wrapped names; source-only visual acceptance pending |
| 2026-10-24 | Bound sidebar motion-grid/list widths and truncate labels before fixed pin/icon actions at nested levels | UI1/27; owner third-level Pin overflow; installed PrimeNG/PrimeUIX grid and custom list-host source; visual acceptance pending |
| 2026-10-24 | Align opened sidebar groups after rendered disclosure and content resizing, with manual-scroll precedence and scoped cleanup | UI1/27/28; owner sidebar child-visibility request and installed PanelMenu command/motion evidence; visual acceptance pending |
| 2026-10-24 | Unify approval adoption graph, terminal rejection, reasoned guarded unapproval, shared tab/status panel and Log label | Master4/UI7/BE18; owner explicit decisions; purchasing unified approval contract; runtime pending |
| 2026-10-24 | Freeze the document-cycle log and independent progress review sequence, with line-based invoice capacities and pending reservations | BE18/UI7; owner Purchasing/Suppliers cycle request and approved partial-GRN billing contract; source-only, runtime pending |
| 2026-10-24 | Extend shared editable validation-row alignment to existing inline feedback markers, including Remove and checkbox geometry | UI14/19; owner requests general correction after Prepaid Expense dropdown mismatch; source-only, visual acceptance pending |
| 2026-10-24 | Reset native sidebar group-button margin/padding in the shared owner to align same-level group titles and links | UI1; owner Account Settings offset report; source-only reconciliation, visual acceptance pending |
| 2026-10-23 | Ledger Account uses the shared wide field in flex strips; checkbox withActions shares the toolbar as the owner clarified; inline wide counts two tracks | UI20; owner Ledger filter layout request; source conformance, responsive/RTL acceptance pending |
| 2026-10-23 | Owner approved the unified server column-filter contract and requested correcting inconsistent paths: typed scalar query projections and explicit aliases before count/page/export; local complete arrays retain original row identity; shared logical first-column freeze | UI6/14; BE9; SHARED_TABLE_REMOTE_FILTER_CONTRACT_FREEZE.md; source reconciliation and owner runtime verification pending |
| 2026-10-23 | Report period filters do not imply year-scoped configuration; an explicit general-company definition uses one tenant singleton without year-copy lifecycle | BE16; owner simplifies Financial Report Settings including cash flow; global scope contract and caller reconciliation, execution pending |
| 2026-10-23 | Classification on grouping accounts does not grant posting eligibility; display-only lookup opt-ins preserve operational predicates | BE10; AccountSelectionPolicy Apply/IsAllowed, AccountService SelectAsync and fixed-root type display; owner execution pending |
| 2026-10-23 | Bulk result coverage distinguishes updated, already-valid, unresolved and exempt records; independent setup warnings do not duplicate row reasons | BE3; owner request to explain incomplete automatic account classification; initializer/result DTO source reconciliation, owner execution pending |
| 2026-10-23 | Compact explanations without narrowing full-width search/filter strips | Master5 owner clarification and UI3 sibling-card edges; Financial Report Settings controls restored to separate full-width rows, visual acceptance pending |
| 2026-10-23 | Prioritize task content over repeated explanations and selection lists while retaining actionable warnings and full-value access | Master5 task-content-space gate; UI3 optional subtitle; owner Financial Report Settings compacting/documentation request; shared layout/selector inputs reconciled, visual acceptance pending |
| 2026-10-23 | Independent fiscal-year settings snapshots and effective-set validation; cash attribution/diagnostics do not equate zero difference with resolved allocations | BE16/17; FinancialReportSettingsService/FiscalYearService and CashFlowReportService source reconciliation, owner execution pending |
| 2026-10-23 | Reconcile hierarchical report totals without repeating descendants; retain legitimate direct parent amounts in every column/month | BE17; shared AccountReportHelper.RollUpToParents and nine income/monthwise report consumers; source arithmetic reviewed, owner runtime acceptance pending |
| 2026-10-23 | Shared report options consume optional persisted bilingual names without request/draft resets; small converted-enum lookups map numeric IDs after materialization | BE10/UI20; AccountReportGroupOptionVM, shared account-report optionsFor and Budget/BudgetVariance; owner runtime acceptance pending |
| 2026-10-23 | Check .NET namespace/import/project resolution explicitly and diagnose producer errors before dependent type errors | Master5 Type and contract safety; owner-reported CS0246 in Account classification; missing local DropdownDto import corrected, compiler verification pending |
| 2026-10-23 | Improve shared loading ring/label and shell card in place; preserve counter/busy/navigation contracts and stop decorative motion for reduced motion | UI22/24/25/29; owner loading-appearance request; SHARED_LOADING_FEATURE_REVIEW.md source reconciliation, runtime acceptance pending |
| 2026-10-23 | General scrollbar presentation uses one global Sass owner, with theme tokens, mouse hover/drag and native touch/forced-colors fallback; scroll geometry remains with existing regions | Master5; UI24/25; owner request to improve scrollbars; shared source conformance reviewed, browser acceptance pending |
| 2026-10-23 | Shared sidebar selection uses a tinted row, colored border and logical-start accent with stable spacing in both themes and navigation surfaces | UI1/24/25; owner requests restoring background and distinct border; SidebarMenuComponent row template/SCSS reconciled in SIDEBAR_ACTIVE_ITEM_FEATURE_REVIEW.md |
| 2026-10-23 | Sidebar Pin clearance check follows the existing shared menu viewport: stable gutter plus logical-end inset for overlay scrollbars | UI1 authenticated-shell sidebar disclosure; owner-reported overlap and scoped source review; visual acceptance pending |
| 2026-10-23 | Current-state execution entry for new screens and existing-state review; conditional reading map replaces accumulated duplicate examples/history | Master1/4/7/8; UI1/21/26/28; BE0/3/10–17. Owner requests useful current documentation and archival of old material. Previous full text and revision history retained in the documentation archive; source conformance and owner runtime acceptance remain distinct |
| 2026-10-23 | Shared tables freeze the first rendered logical-start column; complete flat local tables may use PrimeNG advanced menus, while remote metadata stays inert until endpoint/operator/export contracts exist; editable form rows retain indexes and are not filtered | UI6/UI14; SHARED_TABLE_FILTERS_MAINTENANCE_EVOLUTION_PLAN.md frozen first slice; owner source-only acceptance pending |
| 2026-10-23 | Unified filter completion: shared typed grid field, inactive empty rules, restored defaults/null choice, local report reuse, safe post-save refresh and bounded GET transport | UI6/BE9; owner compiler feedback source repairs; HTTP.sys/proxy and rebuild/runtime acceptance pending |
| 2026-10-23 | Shared query serializers preserve the generic screen filter shape; fixed ListQuery<object> rejects inline screen keys after the optional grid extension | UI6; six owner TS2353 diagnostics, shared toListParams signature repaired; owner rebuild pending |

The previous digest and its complete revision history are historical only:

```text
F:\My Work\Shaban Documents\Shaban\sigma-erp\archive\2026-10-23\screen-skill-before-current-state.md
```
