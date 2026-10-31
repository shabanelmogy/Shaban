---
name: sigma-screen-refactor
description: Comprehensive guide, checklists, and invariants for reviewing, refactoring, and implementing frontend (Angular) and backend (.NET) screens in the Sigma ERP application. Activate this skill whenever refactoring or creating a screen to enforce canonical UI layout (page/panel, compact filter strip alignment, data-table, modals) and backend pagination contracts.
---

# Sigma Screen Refactor & Implementation Skill

This skill is the operational playbook for refactoring and implementing screens in the Sigma ERP system (Angular 21 standalone root, interoperable feature NgModules and .NET backend). It is the **checklist digest** of the canonical books `SIGMA_UI_PATTERNS.md` (UI) and `SIGMA_BACKEND_PATTERNS.md` (BE), and it was verified against real implementations (`Movements/collectionMovement`, `Movements/logsMovement`, `Fleet/Vehicle`, `Workshop/JobEstimation`).

**How to use it**

- Reports menu starts closed *(UI1; owner2026-10-23)*: the existing shared sidebar adapter honors optional autoExpandOnActive (true default); the main Reports catalogue group sets false so duplicate active report links cannot open it on startup/route rebuild. Preserve manual publisher disclosure, search expansion, other groups, pin identities and active leaf styles; catalogue expanded is a group marker, not open state.

- Sign-in completion gate *(UI22, with UI1/2/26/28/29; source correction2026-10-23)*: keep one typed form/submit pending owner through credential HTTP and router completion, with translated checking/opening states. Validate successful session data, persist token/user/subscription before synchronous user publication, and recover partial storage writes without publishing the new user. On false/rejected navigation, retry opening through the same authenticated session without a second credential POST; teardown releases pending state. Preserve auth-origin, branch/default and realtime freshness contracts; source review does not measure login latency.

- Stable row-action popup models *(UI7/27/29; source correction2026-10-23)*: retain each actual popup's model/item identities across unrelated checks using weak ownership. Refresh mutable-row visibility/disabled predicates, translated labels and icons; replace only changed entries/model, retaining row/action identity and execution-time guards. Never map fresh MenuItems on every focus/blur check or execute on pointer-down. Preserve the pressed link through focus before first click in regression coverage; actual pointer/browser acceptance remains owner-pending.

- Selective reference lookup caching *(UI2/16/28; owner2026-10-23)*: use the root ReferenceLookupCacheService only through explicitly opted-in data services (initial Country/UOM); CompanyDriver reuses CountryService. Defer acquisition, bound success-only deep-copied snapshots (pilot5minutes/64LRU), separate feedback modes, share pending reads with final-consumer teardown, and evict cancelled/error/empty-completion entries. Fence context/source invalidation and stale observable reuse; reuse auth-token/session/language owners without credential keys. Successful typed/inherited writes invalidate before callbacks. Focus return evicts settled values but preserves pending bootstrap; never alter open form values, hidden branch filters, settings or document availability. No blanket HTTP/service-worker data cache. UI2 owns the full contract; guide and measured/runtime evidence remain separate.

- Complete vendor retirement *(UI1/24/25/29; owner2026-10-22)*: this later instruction supersedes earlier staged retention of Metronic/Bootstrap Sass, KT and Popper below. Move the live shell/theme to app/layout, domain enums to modules/shared/enums and helpers to modules/shared/utils/form-export; update all direct consumers, routes, explicit compile roots and retained tests before deleting the old tree and unused Builder/demo/plugin roots. Preserve enum values, business state, API payloads and existing shared public contracts. Native migrated fields and secondary/danger buttons register PrimeNG directives at their real owning imports; primary actions compose PrimaryActionButton, preserving submit/click, loading/disabled and IDs without a second primary paint owner. Sigma base/status/native-control/utility modules own presentation; exact class tokens, selectors, conditional bindings and DOM queries migrate together without rewriting semantic HTML tags or domain properties. Keep used independent icon fonts and data-bs-theme; Sigma owns theme image/transition/event hooks and preserves storage keys. Native logical insets replace the old generated RTL end-0 patch. Compare final source/dependencies, test controls and actual linked RTL geometry, rebuild and check deterministic RTL. Compilation does not establish visual/print acceptance.

- Supported platform *(UI1/16/17/24/27; 2026-10-22)*: Angular21 uses a standalone root, `app.config.ts`, `app.routes.ts` and the application builder while preserving the existing hash routes, one API client, auth startup, Zone compatibility and flat hosting output. Feature NgModules remain interoperable; do not infer a complete zoneless or signals migration. PrimeNG21 uses Select/DatePicker and the root PrimeUIX preset with Sigma tokens. Bind `appendTo="body"` in picker templates, never overwrite its signal input or removed `filled` state. Numeric InputNumber limits/precision use number bindings, and shared consumers read min()/max() signal values while retaining original bounds and validators. Free-token AutoComplete sets multiple/typeahead/separator and explicit unique behavior matching the old duplicates contract. Native checkbox/radio labels require matching unique inputId/for, including loops. Match actual publisher selected/disabled/focus/overlay hooks; compiling CSS is not visual evidence. Preserve date/form/API behavior and retain owner runtime acceptance.

- PrimeNG authenticated shell *(UI1/27; owner2026-10-22)*: replace active Metronic initialization through existing LayoutComponent and new ShellHeader, preserving route/provider/auth/branch/session/print contracts. One catalog and one responsive menu; desktop280px visible/hidden from992px, mobile Prime Drawer. Typed branch/language controls display confirmed service state through async failures; native theme retains stored preference keys and owns Sigma event/image/transition hooks. Prime PanelMenu custom templates own one anchor (no duplicate root routerLink), publisher keyboard focus, independent Pin and bounded opened-group reveal. Shared overlay focus helpers handle entry and conditional return without stealing a new dialog/field; shell body overlays are hidden in print. Complete vendor retirement now includes the former global feature Sass boundary (see the later complete-retirement rule above). Canonical UI1 and UI27 own full behavior; interactive acceptance stays distinct from rendered tests.
- Appbar presentation *(UI24; owner2026-10-22)*: framework replacement retains established visual hierarchy through publisher templates instead of plain default controls. ShellHeader owns42px branch/language cards,30px icon/two-line copy,40px/11px icon controls and structured themed account menus; feature fields remain34px. Use stored flags/fallback language icon and current-name initials, no invented presence. Narrow language stays48x42px with full accessible selected name; keep branch text, confirmed selection/guards/focus/print and RTL/theme. Rendered checks and subjective visual acceptance remain separate.
- Shell alignment *(UI1/24; owner2026-10-22)*: brand and aside inherit one280px width including borders; desktop32px/9px toggle is centered on their logical-end boundary, mobile40px button remains in flow. Group rows end with the arrow and place independent Pin before it. Shared rows own8px padding; publisher wrappers add none; every nested root/submenu adds14px logical-start and zero logical-end padding, bounded against legacy global ul!important. Keep shortcut labels compact992–1400px and wide direct labels100px with full accessible names/actions. Verify actual publisher geometry in both directions.
- Third-level Pin inset *(UI1; owner2026-10-22)*: add8px logical-end margin only to the third navigation level Pin. Publisher aria-level2 represents application level3 because top-level groups are outside its tree. Keep other levels, arrow alignment and Pin behavior unchanged.
- Shared navigation policy *(UI10/22/28; owner2026-10-22)*: reads allow departure; subscribed Sigma writes have an independent idempotent counter, released before response/error callbacks. Shell CanDeactivate(always) owns one registered-draft fallback; child activation checks write state only, and existing feature guards retain richer exit decisions. appMockData registers actual lazy reactive forms even with mock generation disabled; freeze root subtrees once, restore same live owners on cancel, preserve disabled controls and pending beforeunload, never globally mark pristine. Cancel page reads only on a different successful NavigationEnd with a different parsed page path using Router navigation signals; preserve path/matrix/outlet identity while ignoring query/fragment changes so list URL synchronization keeps bootstrap lookups alive; serialize the whole UrlTree without query/fragment, never the empty root segment group alone; same-page races retain switchMap ownership; target-navigation and explicit session-owned branch/language/preferences reads survive. No endpoint-name guessing, write cancellation/retry/server rollback claim or fabricated timeout. Global policy does not prove unregistered legacy forms are covered.
- Native layout and RTL asset *(UI1/25; owner2026-10-22)*: Sigma shell owns route/content overflow, padding and gutter, and retains historical IDs only for live print consumers. Routed Receipt fills the route box; embedded/dialog sizing keeps its existing owner. Retire unused measured-header/dimension bridges after the final consumer migrates. Generate native logical-property RTL styles through scripts/build-rtl.mjs and style.rtl.scss, write only the known asset with its LF Git attribute and run rtl:check; no output-directory deletion, Webpack loader or obsolete physical end-inset patch.
- Interactive vendor retirement *(UI1/24; owner2026-10-22)*: migrate commands through shared owners and retire source/test/compiler edges before deleting unused plugins and package dependencies. The complete-retirement instruction now removes KT, Popper and vendor Sass as well; keep only used independent icon fonts and the established data-bs-theme selector. Error Return Home uses Router only, without delayed KT initialization.
- Direct shared row commands *(UI7/27; owner2026-10-22)*: existing native/PrimeNG table cells may bind optional row on app-action-button and typed moreActions, rendering the same menu template; DataTable omits row and retains template export. Never copy feature-owned menus or dispatch by visual index. Dialog actions capture the lasting trigger through popup ID/aria-controls via resolveActionMenuTrigger; restoreOverlayFocus uses the actual closing container and preserves new external focus.
- Shared vendor cleanup *(UI1/7/24/27/29; owner2026-10-22)*: keep shared selectors/contracts; row action templates use body-appended Prime Menu with current row predicates and guarded commands; compact CSV uses Popover with enabled-command keyboard navigation and synchronous file-picker gesture. Replace the old Bootstrap portal only after both consumers migrate. Dynamic Buttons composes PrimaryActionButton for primary intent (optional native ID/title/class inputs), PrimeNG buttons for other intents; never copy a primary palette. Sigma owns semantic status tokens and visually-hidden utility in both themes. Popover onHide precedes DOM removal: pass closingContainer to conditional focus return, preserving a new external field/dialog. The bounded shell Drawer cleanup uses its own publisher destroyModal if a mask survives destroy-after-close; no global mask sweeps or vendor patches. Delete vendor CSS/JS/packages only after their remaining consumers retire; rendered tests await real CSS motion and detachment outside Angular's stability tracking.

- Each section heading names the book block that owns the full rule and its rationale, for example *(UI 1)* or *(BE 9)*. Open that block when you need the reason, an edge case, or a reference path.
- Sass theme *(UI24/29; 2026-10-22)*: use module APIs and namespaced built-ins. Sigma base/status/native-control/utilities replace retired vendor Sass and configuration bridges. Do not restore vendor CSS, patch node_modules, suppress warnings or downgrade Sass. Compare actual consumers, cascade, responsive/RTL/theme/print and retained form/action contracts, then run authorized checks. Compilation does not establish visual acceptance.
- Shared Angular21 controls *(UI1/6/16/24/29; 2026-10-22)*: audit component and owning-module metadata cycles after standalone conversion; remove unused backedges and verify lazy bootstrap within authorization. Select/DatePicker roots are on their host, with a shared full-height Select label track and direct DatePicker icon/clear hooks using logical space. DataTable owns the actual p-datatable-table-container in all modes; never re-enable disabled paginator controls. Read disabled() signals in shared lookup/mock adapters and retain form guards. Common rendered-control tests preserve CVA, option values, dirty/disabled state, scroll/paginator and dialog/action contracts; actual screen/theme/RTL acceptance remains distinct.

- Shared dropdown search *(UI24/27/29; 2026-10-22)*: global clear buttons remain outside publisher IconField children because search placement uses structural selectors, even when the added button is hidden. Reserve measured logical-end space for search and clear separately, restore owned padding on unbind, and target actual header `.p-inputicon` hooks. Verify empty/typed/cleared filters in light/dark and LTR/RTL while preserving selection.

- Shared paginator sizing *(UI6/24/29; 2026-10-22)*: row-count Select (`.p-paginator-rpp-dropdown`) retains intrinsic width and no flex growth through shared root styles, overriding full-width form sizing. Keep count/report/navigation together when space fits and allow genuine narrow-width wrapping without overflow; never add screen-specific footer rules or alter page/query contracts.

- Stable filter hosts *(UI4/16/24/29; 2026-10-22)*: stable list/report wrappers retain shared flex Select and inline-flex DatePicker hosts. An old display:block override prevents the publisher width1% Select label from growing and clips its trigger/clear. Medium main/advanced grids cap their three-track target at the explicit configured count, avoiding empty tracks for one/two fields. Test stable as well as ordinary consumers; feature field widths use existing grid spans, never local widget layout copies.

- DatePicker clear/disabled ownership *(UI17/24/27/29; 2026-10-22)*: raw DatePicker uses publisher showClear/CVA and is excluded from generic native clear. The appDatePicker capture adapter prepares input even with numeric restriction off, retaining native-clear/mobile/drop semantics. Actual native-disabled state owns shared disabled colors and hover exclusion through :has; never infer a host p-disabled class or change readonly/explicit clear contracts.

- Native element queries *(UI1/27/29; 2026-10-22)*: references on custom component hosts, including form[appMockData], return component instances. Native focus/scroll queries use explicit read:ElementRef; a type annotation alone does not select that runtime token. Keep component-API queries typed as components and never add a fake nativeElement alias to the shared owner.

- Runtime template gate *(UI24/29; 2026-10-22)*: unknown template properties/elements throw in the shared TestBed; inspect console diagnostics alongside counts. Trace duplicate keys before editing: Keenicon's empty decorative slots use positional $index, while record collections retain stable identities. Temporary reporters retain original warnings and stay out of normal bootstrap. Wait for declared CSS transitions when comparing disabled/theme states.

- Stable effect options *(UI1/29; 2026-10-22)*: Angular21 signal writes are already permitted in effects; remove the inert deprecated allowSignalWrites option while retaining callback behavior and scheduling. This does not authorize changing business state or forcing an inject/signals rewrite.
- Authority, from `AGENTS.md`: `AGENTS.md` and frozen contracts, then the Master and books, then the packets, then this skill. The skill may not hold a rule the books lack. If you find one, report it.
- Reference evidence gate *(Master 5; AGENTS.md)*: before edits, read the owning blocks and actual reference source; record concern → block → reference file/symbol → shared owner → match/deviation in the existing plan/review. Reconcile it against final source before handoff. Shared class names are insufficient; updating a book cannot retroactively authorize a deviation. Source review never implies runtime/visual acceptance.
- Continuous packet maintenance *(Master 8; AGENTS.md)*: run recipe `-Check` before use; resolve initial drift from canonical evidence and regenerate affected packets through the generator. After book/template/manifest changes, regenerate in the same task, semantically reconcile source rules and approved-reference roles, rerun `-Check`, and record packet IDs/evidence before handoff. Standing authorization includes derivative maintenance in source-read-only reviews, without application-source edits or new canonical decisions. Preserve unrelated changes; never edit generated files directly. A missing source or unresolved semantic conflict keeps its packet out of use and is reported precisely; routine refresh is not left owner-pending.
- Learning protocol: a verified, reusable lesson goes into the owning book block **and** this skill in the same task, with a row in §11. If the book cannot be updated in that task, mark the row `pending promotion`.
- General presentation preference *(Master5; owner2026-10-11)*: reusable presentation requests belong to their existing shared owner and apply to current consumers by default. Do not infer a screen-only scope or add per-screen opt-ins unless explicitly scoped or a recorded source-supported compatibility conflict requires an exception. Preserve business contracts and freeze the general decision before edits.
- A conformance claim names actual target consumer/producer symbols and compared values; a shared import/reference path or earlier "Matched" row is insufficient. Missing evidence is Uncertain; known mismatches remain findings, separately from pending runtime acceptance (Master 5).
- Rules marked **Transitional** are workarounds for a missing shared capability. Follow them exactly until the capability ships, and do not generalise them.

---

### Positive VAT allocation remainder *(BE15)*

Use `VatPolicy.AllocateDocumentTax` for persisted source taxes. Positive tiny
lines must not yield a negative remainder: the shared owner retains ordinary
rounded shares, and only an exceptional negative remainder on all-positive
sources floors non-remainder shares and assigns the exact balance to the largest
line. Document VAT remains once-rounded per rate; do not invent tax adjustments.
Source arithmetic review does not replace owner compilation/runtime validation.
Preserve normal arithmetic; use ratio-first allocation only when the intermediate
decimal product overflows, and validate document storage bounds before allocation.

### Derived source-use states *(Master4, BE14/9, UI4/5; 2026-10-22)*

Freeze each document's source lines, downstream link and capacity unit. Server
derives No Quantity, Open, Partially Used, Closed and a line-wise percentage;
do not sum mixed UOMs or accept client-written progress. Filter every status
before count/page/export, show a translated badge and percentage in the list
and saved details, and keep approval/billing separate. Purchase Request → live
Pending/Approved Purchase Orders is the first example; rejected orders retain
their history but release request quantity and allocated discount. Use the same
effective-state condition in capacity, status/percentage, filters, picker and
conversion writes; other documents need their own contract.

Revision 2026-10-22: source-use axis and first Purchase Request consumer;
Master4, BE14/9 and UI4/5 synchronized, source-only owner acceptance pending.

### Loan down payments and retained draft identity *(BE14/15, 2026-10-21)*

Financing terms do not prove cash. For the approved Bills downpayment action,
pay the full saved amount with zero interest against the original supplier
payable and saved recovery bank; atomically retain the real PV/JV/source link
and paired allocation under the existing loan locks. Require an exact reliable
capacity gap equal to that whole amount; existing external allocations may
cover it without a dedicated PV. Never invent payment, synthetic EMI, partial
difference or a history backfill. Include retained downpayment proof in replay,
cross-operation keys, dates/version and Payment/JV/Bill correction guards; a
next-EMI interest-account lookup must not gate a zero-interest downpayment.

Soft-deleting an owned one-to-one row retains its unique parent-FK slot. Reuse
the editable retained draft identity and reconcile children through the domain,
including supported off/on, only when no financial history blocks correction.
Root repository filters do not prove Include filters: live source readers exclude
deleted child rows but still reject live foreign/invalid rows; actual historical
cash proof stays strict. Preserve posted/paid/revision history and owner migration
boundaries. Source-only; owner compilation/runtime acceptance stays pending.

Revision 2026-10-21: owner-approved Bills downpayment cash ownership and source-
verified retained one-to-one/live-navigation lessons; BE14/15 and digest updated
together. Feature contract and comprehensive review record exact scope/evidence.

Angular preview parity *(UI19, 2026-10-15)*: shared `allocateDocumentTax` mirrors
the same exceptional all-positive negative-remainder fallback: floor only the
non-remainder shares at currency precision, then assign the exact balance to
the largest source. Ordinary rounded, signed and zero-net allocations remain.
Purchase Requests found the mismatch; existing helper consumers inherit it.
Document tax/rates/payload ownership are unchanged; owner runtime acceptance pending.

## 1. Golden Invariants & Zero-Bespoke-Code Rule *(UI preamble, 24, 30)*

Production style budgets (UI29): anyComponentStyle measures emitted per-component
CSS. Owner build sizes support current10KB warning/20KB error and initial
2MB warning/6MB error after the reported5.22MB initial bundle exceeded5MB.
Retain optimizations. Source JSON/schema review does not certify compilation
or bundle/CSS reduction. Record size evidence and keep enforcement bounded.
For Angular 17 `browser-esbuild` warnings, distinguish Critters' critical-CSS
selector matching from emitted CSS validity (UI29): it strips pseudo-classes
before matching and may report valid floating-label/table selectors as skipped.
Copied stylesheets linked from `index.html` can miss its Windows in-memory
asset lookup; keep tiny startup-only splash CSS inline in the index when needed.
Do not change valid selectors, budgets, or critical-CSS optimization merely to
silence those warnings; owner build and visual acceptance remain pending.

1. **No Bespoke Patterns:** Never invent custom HTML wrappers, bespoke CSS cards, or local alternatives to shared controls.
2. **Canonical Shared Components Only:**
   - Table: `app-data-table` (`shared/components/data-table`)
   - Header: `app-feature-title` (`shared/components/feature-title`)
   - Summary/KPI/total cards: `app-summary-cards` (`shared/components/summary-cards`) on lists, reports, dashboards, routed editors and dialogs
   - Actions / Submit: `app-primary-action-button` (`shared/components/primary-action-button`)
   - Modal Shell: `app-editor-dialog` (`shared/components/editor-dialog`)
   - Modal Tabs: `app-editor-tabs` (`shared/components/editor-tabs`)
3. **No Legacy Libraries:** Never import or retain `ms-lib`, raw PrimeNG `p-table` wrappers, or deprecated `ListCol[]` definitions.
4. **Zero Rogue Colors:** Never use ad-hoc or deprecated colour hexes: the teal forks (`#20b2aa`, `#1a7f82`, `#146264`, `#17a8aa`) and the blue forks (`#2497d4`, `#1478b5`). The Sigma primary is `--sigma-primary` (`#3498db`). Consume canonical CSS tokens (`--sigma-primary`, `--sigma-border`, `--sigma-surface`, `--sigma-data-table-*`).

5. **One summary-card owner:** Any new or reviewed summary, KPI or total-card
   region uses `app-summary-cards` with a readonly typed `SummaryCard[]`. The
   shared component owns card geometry, palette, typography, icon tiles, focus,
   selection semantics and print; features own authoritative values, labels,
   placement and host bounds. Pass only its public density, layout,
   `columns`, `equalHeight`, `verticalPadding`, `minCardWidth`, `maxHeight` and selection inputs; never reproduce card
   internals in feature SCSS. Existing
   compact accounting bars remain compatibility-only for out-of-scope legacy
   consumers, and legacy migration is scoped to review.

Shared summary-card sizing (UI 24): all screen types select public
comfortable/compact/dense/slim density, grid/row layout, minCardWidth and optional
numeric maxHeight; opt-in positive columns fixes track count and equalHeight
uses equal fractional rows (defaults null/false preserve other consumers).
Optional verticalPadding adjusts only vertical padding (nonnegative pixels,
null retains each density's existing value); Leave keeps comfortable font/icon
sizes and selects10px instead of14px after the owner's second small reduction.
No local card-internal styles. Row fits the actual count into
equal columns on containers wider than 1100px and wraps below that threshold,
with no off-screen horizontal rail. Dense uses shared 8px/10px padding, 24px icon,
1.05rem figures and vertical copy; a bounded/row list owns keyboard focus and its
internal scroll, static cards have no card-level action. Print releases bounds
and wraps every card. Keep 12px separation before the following grid via existing
parent gap or component-host placement only; DebtCollection and Aging use host
margin. Aging selects dense/row/min140/max180 and 12px host bottom separation;
other consumers keep their approved public sizes. Master-detail totals needing
more room for rows use slim/row/min140/max80 (UI14/24): 6px/10px padding, 20px
horizontal icon, 6px gaps, 1rem figures and 0.6875rem labels. Workshop
Job/Estimate/WorkOrder adopt it on the owner's 2026-10-04 instruction. Wrapped
totals retain shared keyboard scroll and print releases the bound; visual
acceptance remains pending. Authoritative financial values
use the existing formatMoney/MoneyPipe owner; preserve absolute magnitude and a
translated Dr/Cr suffix only where the existing feature contract uses them.
Shared presentation adds no formula.

Shared three-pane routed editor (UI1/13, owner request 2026-10-04): Job and
JobEstimation select `sigma-editor-form--three-pane` /
`sigma-editor-body--three-pane`, with master/jobs/detail `sigma-editor-pane`
siblings. The shared stylesheet owns 240–280px / 170–200px / remainder widths,
10px gaps, container-responsive 900/620px placement and print release. Master
uses `sigma-editor-pane-fields` inside `sigma-editor-scroll`; `ng-container
formArrayName` preserves group context without another DOM grid. Retain
internal pane scroll, fixed slim totals/footer, fields and business behavior
across Create/Edit/View. No feature layout copies; visual acceptance pending.

General numeric-entry rule (UI27, explicit owner instruction 2026-10-04):
every numeric field selects its current value on entry for immediate replacement.
The owner's application-wide extension supersedes adoption-on-review: root
`GlobalNumericFocusService` starts/stops in AppComponent and delegates document
focusin/first primary left pointer click for native number and PrimeNG numeric
spinbutton inputs, including dynamic rows and dialog portals. Bubble-phase
selection follows widget cursor handling; later clicks keep caret editing,
read-only/disabled fields are excluded, and listeners are removed on root destroy.
Ordinary text/tel/inputmode-only fields are not inferred to be numeric. Native
`input type="number"` may still import `NumericFocusDirective` and add
`appNumericFocus` for appearance only; the directive adds no selection listeners.
Never clear zero, write/dirty controls, dispatch input or change precision,
validators or formulas on focus. Shared `sigma-numeric-input` owns LTR/right
tabular digits and spinner-free appearance. Custom numeric controls implement
the same rule in their shared owner without changing parsing/formatting.
Numeric read/derived table text uses shared
`app-editable-collection-table__value` (UI14): 34px line, 9px inset, 12px digits,
without editable chrome. Workshop is first adoption; runtime acceptance pending.
Quantity entry performance *(UI27; verified2026-10-22)*: cache real step-button
references after rendering and rebuild on input/button structure or layout changes;
translate names on creation and language/translation/default-language changes,
never per-row DoCheck while typing. Keep cheap invalid+touched/dirty synchronization,
including newly created inputs. An excluded numeric input without a generic-clear
binding must not schedule whole-form clear geometry. Verify multi-row entry with
both root services plus CVA/null/limits/stepping, translated/recreated buttons and
disabled/read-only state. Count removed work; do not claim owner latency acceptance
from headless timing or debounce values/totals to disguise lag.

Quantity host geometry *(UI24/27; verified2026-10-22)*: PrimeNG21 places
sigma-quantity-input-host/sigma-quantity-input/p-inputnumber on the same host.
Use the combined root selector, inline-flex and a static22px button rail so
the right-aligned number and clickable input are not covered. Invalid borders
target that host too. Test input width, non-overlap and element hit-testing;
synthetic key/CVA success alone can conceal an unusable input. Exercise actual
async create loading/enable and failure guards separately from lookup stubs.

General editable numeric rule (UI14/24/27, owner expansion2026-10-23):
every editable numeric field uses the existing Purchase Order Details
`p-inputnumber appQuantityInput` composition and direct standalone `QuantityInputDirective`
plus `InputNumberModule` imports. Shared defaults are stacked increase/decrease
buttons, no grouping/formatting, en-US parsing and a 20-digit fraction ceiling
for unconstrained decimal input; this is not a business precision rule. Preserve
existing min/max/step and validators, set maxFractionDigits=0 for integer
contracts, and retain a constrained decimal contract's precision. Shared styles
own width100%/min-width0, 34px line and 22px button rail with theme tokens and
LTR/right tabular figures. Use inputId/ariaLabel for actual input labels/focus;
shared invalid+touched/dirty aria-invalid matches FieldError. Native calculation
input callbacks become onInput after the widget's CVA update, including stepping.
PrimeNG owns clearing/parsing/disabled/number-null transport; data-no-clear avoids
a generic text-clear overlay. No extra CVA/control graph/focus handlers or local
widget CSS. Read-only numbers retain existing text/badges or spinner-free
readonly displays. This supersedes the former quantity-only adoption boundary.
Keep explicit old widget format/grouping/precision, making implicit defaults
explicit when shared defaults differ. Preserve signed/unbounded roles; no
global min0. Customer credit/discount/surcharge min0 is already confirmed by
forms and backend Range. Shared NG_VALIDATORS preserves native min/max form
validity for loaded/programmatic values and dynamic-bound changes, without
value writes or replacing business validators. Retrieve optional NgControl at
OnInit to avoid a validator construction cycle. Shared invalid-state forwarding
also honors explicit host/group errors and publisher invalid signals; use
ariaRequired/ariaDescribedBy for the actual input. Numeric unit-width/flex
selectors include the InputNumber host, retaining existing fixed unit rails.
The shared directive labels both actual stepping buttons in EN/AR and removes
their widget aria-hidden, retaining the existing PrimeNG button handlers (UI27).
The former36-control/28-template quantity inventory is historical; all current
editable numeric consumers now adopt the existing shared owner;
source-only, owner build/runtime/RTL/theme/visual acceptance pending.
Read-only numeric blue badge (UI14, owner generalization 2026-10-04): new or
reviewed editable collection rows pair public column `numeric:true, align:'center'`
with `app-editable-collection-table__value app-editable-collection-table__value--highlight`
for every non-editable numeric value, including Remaining Quantity, derived
Amount/Tax/Gross and numeric View text. Shared centered figures, themed title
text, 12% primary/surface tint, 700 weight, 6px radius and 34px control line own
the appearance. Keep editable inputs as controls, badges as noninteractive text,
zero/null handling, formatting and formulas/payloads unchanged; no feature badge
CSS. DataTable/report and SummaryCards retain their owners; unrelated legacy
consumers migrate on review. Requisition Create PR adopts the existing Workshop
Price/Charges variant; source-only, visual acceptance pending.
Heading/value alignment (UI14, owner general instruction 2026-10-04): shared
numeric headers/plain numeric cells and shared value text default to center,
placing View Quantity beneath its heading. Use the existing blue highlight for
every numeric read/derived cell, including View; current 17 plain shared value
spans in Stock/Workshop adopt it. numeric:true selects the centered header by
default; explicit center remains valid. Any justified alignment override must
also match read text. Do not add feature offsets/cell CSS; inputs keep right
alignment and all formatting, values, widths and calculations stay unchanged.

Shared three-pane lookup bounds (UI16): `sigma-field` dropdown host/wrapper
uses min-width0/width100%/max-width100%, the label shrinks with ellipsis and
the trigger retains width; the body option overlay is unaffected. Generic
English required validation uses `Required field` via the shared key and
equivalent existing overrides (UI19); preserve validators and Arabic wording.

Accounts review adapters (UI6/14/20, 2026-10-05): complete report hierarchies use
the optional typed DataTableHierarchy with stable row identity and retained
nested source. Shared expansion/14px logical indentation and printAllRows own
presentation; export traverses complete source independent of expansion. Flat
reports use column indent only. Feature-local typed configurations may compose
the existing report owners, retain server totals/context and applied snapshots,
and block/retry failed lookups without converting paged APIs. EditableRows
confirmationPending gates aggregate Save/tab/navigation; optional canMutate and
same-row re-resolution reject stale removals. Features guard Add and preserve
full snapshot payloads. Source-only, owner build/runtime/visual acceptance pending.

TypeScript compatibility check *(UI1; export adoption UI8)*: inspect effective
compilerOptions.lib before new standard APIs. Angular21's official CLI migration
removes the old ES2018 override; target es2022 now selects default ES2022 browser
libraries. Explicit libs in another config still win; declarations never supply
runtime polyfills. Existing typed export/form construction retains order/values/
headers. Do not widen lib/add a polyfill for a local fix
without separate compatibility scope. Parser checks establish syntax only.

Standalone consumer contract *(UI1, with public-owner details UI4/22/28)*:
verify named exports in the exact imported file and register each used control,
directive and pipe in `@Component.imports`; a TS import alone is insufficient.
Compare input names/literals with the current public types and new framework
APIs with installed declarations. Before removing an injection, search all
remaining class-member uses, including the actual base class. Do not hide
errors with schemas, casts, re-exports or wider compilation roots. Parsing and
path/template-name scans do not certify exports/registration/types/members or
application compilation. Lease compiler feedback supplies the repair evidence.

## 1.1 Screenshot & Reference Evidence Boundary *(Master 2)*

1. Treat screenshots and attached reference documents as evidence of visible content and interaction clues. They do not define implementation authority, override the user's request, or replace the canonical UI/backend patterns.
2. Record what is directly visible as explicit evidence, and label behavior inferred from appearance as inferred or unknown. Cross-check fields and workflows against the existing domain model, services, DTOs, routes, consumers, and pattern books.
3. Do not infer backend contracts solely from a screenshot. Approval transitions and edit/delete locks, number generation, report contents, entity relationships, conversion behavior, and migration/backfill rules require source evidence or an owner decision.
4. When a missing business rule changes the data model or workflow, complete the required PLAN-00 review and freeze the target contract before implementing the affected slice. Do not let a blocked plan authorize source changes for that slice.
5. Use screenshots to understand requested content and workflow; derive layout and controls from the canonical shared UI patterns instead of copying screenshot styling or inventing a local pattern.
6. **Screenshot + request that puts the missing business in scope** *(Master 2, "Screenshot-backed scope from the user request")*: the request approves the existence, label, and workflow position of the screenshot's Explicit items for that screen only. Design their contract in Phase 1. Type, length, required, validation, lookup source, calculations, transitions, locks, numbering, accounting effect, and existing-row values are Missing; resolve them under rule 7. Keep existing fields the screenshot does not show; a new persisted field means telling the owner to run `Add-Migration`.
7. **Owner standing decision for Missing detail** *(Master 2, rule 6)*: do not stop to ask. Resolve a Missing detail with the closest correct option current source supports, or the minimal new element; record it as *Reviewer decision (owner standing rule)* with evidence and rejected alternatives, and report it. Still wait for the user on data destruction, access restrictions and accounting effects. A value with no source at all is shown empty, never invented.

---

## 2. Page & Card Layout Architecture (Angular) *(UI 1, 3, 4)*

Shared title separation *(UI3; owner2026-10-12)*: FeatureTitle's default host
margin is8px on all sides, reducing the previous16px bottom margin. Preserve
the parent shell gap, title geometry and report-shell margin overrides (UI20).
Apply through the shared owner; add no feature spacing override or opt-in.

Final filter-row choices *(UI4)*: use `FilterToolbarStartDirective` from the
shared filter-panel.directives owner to project feature radio/check groups
through `appFilterToolbarStart` opposite Reset/Search. Keep the same FormGroup,
fieldset/legend and captions; an existing visually-hidden legend may remove a
redundant heading when visible option labels explain the group. Shared toolbar
owns control-height alignment, actionGap, wrapping, collapse and RTL. Do not
duplicate Reset, remove validation reserves, shrink controls or copy toolbar CSS.
Empty projection preserves existing consumers; Rental generation is the first
adoption under the owner's explicit last-row layout correction.
For explicit vertical field-row density use shared `rowGap` (default7px);
Rental generation selects1px after the owner's further reduction. Keep label/control gaps, validation reserves,
control height and responsive stacking; add no feature spacing CSS (UI4).

### 2.1 Page & Panel Hierarchy
Never wrap a page in legacy Metronic `.card` or `.card-body` HTML divs. A list uses the shared shell classes (reference: Job list) and writes no page/panel/header/alert/table SCSS *(UI 1, 3, 6)*:
```html
<!-- component metadata: host: { class: 'sigma-route-host' } -->
<section class="sigma-list-page">
  <div class="sigma-list-panel">
    <header class="sigma-list-header">
      <app-feature-title [title]="'feature.title' | translate" [subtitle]="'feature.subtitle' | translate" icon="bi bi-...">
        <app-primary-action-button [label]="'feature.addNew' | translate" (pressed)="openCreate()" />
      </app-feature-title>
    </header>

    <form class="feature-filters" appFilterPanel [formGroup]="filterForm" (ngSubmit)="search()" (resetRequested)="resetFilters()">…</form>

    @if (errorMessage()) {
      <div class="sigma-alert" role="alert"><i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i><span>{{ errorMessage() | translate }}</span></div>
    }

    <div class="sigma-list-table">
      <app-data-table [fill]="true" …></app-data-table>
    </div>
  </div>
</section>
```

### 2.2 Container-Fill Host and Primary Card *(UI 1)*
* The route host fills the box the shell already sized: `host: { class: 'sigma-route-host' }` (`height: 100%`, `min-height: 0`, `overflow: hidden`). Never compute a page height (`calc(100dvh - …)`).
* The primary card is `sigma-list-panel` inside `sigma-list-page`. Their padding, border, surface, shadow, gap and dark values live in `src/styles.scss`; do not restate or override them.

### 2.3 No Page Scroll — One Scroll Owner Per Region *(UI 1)*
The page (`.app-content`) never scrolls, at any breakpoint. Only components scroll inside themselves:
```
.sigma-route-host        height: 100%; overflow: hidden
 └ .sigma-list-page      flex column; min-height: 0; overflow: hidden
    └ .sigma-list-panel  flex column; min-height: 0; overflow: hidden
       ├ .sigma-list-header / app-feature-title   fixed
       ├ form[appFilterPanel]                      fixed
       └ .sigma-list-table   flex: 1 1 auto; min-height: 0
          └ app-data-table [fill]   rows scroll; paginator fixed (§4.1)
```
* A region has exactly **one** vertical scroll owner: the grid rows, a form pane, or the dialog body. Never nest two scroll owners for the same content.
* Narrow widths rearrange the panes (stacking, fewer filter columns) but never hand scrolling back to the page. Do not switch outer containers to `overflow: visible` and do not add content-sized minimum heights.

### 2.4 The 8px Alignment Rule *(UI 3, 4, 6)*
Responsive header actions (UI3/24, owner generalization2026-10-11): every FeatureTitle at <=650px uses a wrapping row with flexible120px title basis and bounded wrapping action group; keep Add alongside while space permits. Every projected PrimaryActionButton selects32px minimum height/10px inline padding/10px text/4px icon gap, preserving labels/icons/handlers/focus/loading/RTL/theme. No responsiveActions input, per-screen opt-in or feature styling; UI29 matrix and owner visual acceptance apply.
Optional shared sigma-list-summary on SummaryCards supplies ordinary-list 8px logical inline margins; direct sigma-list-panel--workspace children use zero. Budget adopts this placement owner. Card internals/values and other summary placements retain their owners; visual acceptance pending (UI3).
Title (`app-feature-title`), filter panel and `sigma-list-table` all carry the same 8px inline margin, owned by the shared pieces, so the three cards share both edges. A feature adds no margin of its own.

Reports follow UI20 instead: canonical sigma-report-panel titles align with the filter's zero inline margins by default; the earlier aligned-title modifier is compatible but unnecessary. Do not copy the list inset or add local margin rules.

Report result/table frames also share title/filter/summary logical edges (UI20,
owner clarification2026-10-05). The global direct sigma-report-panel >
sigma-list-table rule removes the list8px inline inset in report context.
Preserve section columns within their own containers and existing internal
scroll owners; no feature fixed widths, duplicate padding or deep grid overrides.
Check both edges at desktop/narrow sizes and LTR/RTL; visual acceptance stays pending.

Equal card widths (UI3, owner general rule 2026-10-05): full-width sibling
title/filter/summary/content/footer cards and region frames share the same
available width and logical edges, supplied by their shared layout owner.
Full-width tree/settings workspaces opt into `sigma-list-panel--workspace`;
shared styles remove title and workspace filter inline margins to match the
workspace, tabs and content frames. Full-width tabbed editors use the shared
`sigma-editor-panel--workspace` counterpart (direct title and nested filters).
Account, LinkAccounts and all OpeningBalances tabs adopt this owner.
Ordinary lists keep their shared 8px inset; reports keep their shared default.
Intentional columns/nested cards align within their own container and stacked
cards share that container's width; individual summary tiles retain their shared
layout. Compare both edges across desktop/narrow widths and LTR/RTL. Do not add
feature fixed widths, local title offsets or duplicate wrapper padding. Apply
in new/subsequent reviews.

Tabbed workspace alignment *(UI3, 2026-10-15)*: existing
`sigma-editor-panel--workspace` also removes editor-body inline padding in the
shared stylesheet. Adopt that modifier and remove `mx-*` from a width100%
FormSection host; type/title/tab/active-content/whole-summary/footer regions
share logical edges. Preserve vertical spacing/bounds/scroll/print, ordinary
editor8px body inset and intentional nested layouts/summary tiles. Purchase
Requests supplies the missing consumer/shared-body evidence; current workspace
consumers inherit the correction. Verify every tab at narrow/intermediate widths,
LTR/RTL/themes; source-only work retains owner visual acceptance.

The owner's general title/filter-card request (2026-10-03) makes app-feature-title reuse the filter background/border/shadow, 8px radius, 3px logical-start accent and 8px/10px padding (UI3/4). Keep its 64px minimum height and text/icon/action layout. The shared background token is defined in root and dark scopes so inherited paint matches the active theme; the component owns white readable print without shadow. No feature card palette.

### 2.5 Full-Page Master-Detail Editors *(UI 1, 12, 14)*

**Comparable routed document baseline (owner generalization, 2026-10-15;
UI13 "Routed document editor baseline", with UI1/3/14/16/24 and BE8).**
Apply the complete baseline in every new/reviewed comparable document editor:
shared peer tabs with separate Documents when present; compact type choices
beside their heading; one readable wide row of short header fields including
Discount when present, with Notes full-width separately; equal sibling card
edges; complete bounded table scroll chain; feature-specific conditional
requiredness in UI/server/CSV; fixed totals/footer with a small host gap;
invalid-section activation, pending-work/dirty/upload guards; all-section saved
print; responsive/RTL/theme and in-app guide handoff. Record actual shared
producer/target evidence and Match/Not Applicable-with-reason/governing exception
for each UI13 baseline row. Phase3's packet now routes this reconciliation.
This promotes the applicable Purchase Requests presentation choices to the
default for similar screens; it does not authorize a bulk legacy migration,
replace ordered steps/special shapes or copy its business rules/PO deferral.

Dense header placement *(UI1)* uses public --sigma-editor-columns based on
visible fields, shared1024/700 fallback and Notes full span. Purchase Requests6/5
is evidence only. Footer separation *(UI24)* uses existing mb-2 on SummaryCards
host or an equivalent parent gap, never both; keep the12px summary-to-grid rule
separate. Type-driven controls *(UI16/BE8)* retain real enum IDs/cardinality and
draft values, revalidate every retained/new/imported row immediately and enforce
the feature's own matrix before backend mutation in ordinary/batch/direct writes.
Never promote General/Stock/Asset requirements, schema nonnullability, tax/discount
formulas, accounting/permission rules, linked locks or workflow deferrals to
unrelated domains. Source-only reconciliation keeps runtime/visual acceptance pending.

Special repeated-group workspace (UI1/13; existing Workshop shape): the following
group-selector placement remains for that shape, rather than replacing the
comparable peer-section tab baseline above.

* For dense aggregate forms with a small header and multiple repeated detail groups, use a full-page create/edit/view route when the detail tables need room; follow existing route and `app-feature-title` patterns.
* Keep the aggregate's identifying and vehicle/customer fields together in a full-width top section. Place the repeated group selector and the selected group's fields/rows in a two-column master-detail workspace below it. Stack these regions at narrow widths.
* Use the shared `app-form-section` for form sections, with `[fill]="true"` for bounded master/detail panes. Keep Save/Cancel in a non-shrinking footer outside the clipped form body.
* For `[fill]="true"` to occupy a bounded pane, the shared `app-form-section` host must be a `min-height: 0` column flex container, and its fill section must use `flex: 1 1 auto`; otherwise the inner card can collapse to its content height even when the routed pane has free space. Fix this in the shared component rather than adding per-screen deep selectors for the section shell.
* Keep routed editors bounded at every responsive width with the container-fill host (§2.2), and keep the outer host/page/panel/form/workspace overflow clipped (§2.3). Do not switch outer containers to `overflow: visible` or add content-sized minimum heights at narrow breakpoints, since that transfers scrolling to the main page.
* Put overflow on the pane that owns long content: for example, allow the estimate/header section to scroll internally when its fields cannot fit, the group selector to scroll within its pane, and the selected group's detail rows to scroll within the detail pane. Keep primary actions in the fixed, non-shrinking footer. At narrow widths, change the pane arrangement (such as stacked selector/detail rows) while retaining bounded heights and pane-level scrolling.
* Keep the existing typed `FormArray` as the single source of truth. Selection is view state only; adding, removing, or switching groups must not copy or detach the form controls.
* When the screen supports printing, render all groups in the print layout even if the screen editor shows only the selected group.
* Preserve list filters, page, page size, and sort in route query parameters when opening the editor and returning to the list.

### 2.6 Existing Screen Alignment & User-Directed UI Choices *(UI preamble, Master 1)*
* When the user asks a screen to match an existing Sigma screen, compare the actual page shell and card surface, border, padding, corner treatment, and shadow, along with the filter strip, error/empty states, table scrolling, and paginator behavior. Reuse those established patterns while keeping the target feature's domain-specific fields and actions. Do not copy the reference's domain behavior or create a parallel UI pattern.
* When a screen reference includes a button for a separate workflow, inspect its existing frontend route and backend entity/API before deferring it. If the user adds that workflow to scope and its domain/API already exist, build it with established Sigma shared components and contracts; do not invent a list, state machine, or schema beyond the supplied evidence. Show labels from the selected related entity instead of persisting duplicates.
* Match filter/title card edges through their shared shape: ordinary lists use the 8px inset from §2.4; full-width workspaces use UI3's workspace modifier; reports use UI20. Add no feature-local margin override.
* Visual choices the user requests for one feature are **scoped preferences**. Record them in that feature's review artifact, not here, and do not generalise them to other screens unless asked. Examples: the Workshop Job and Job Estimation choices, now in `reviews\JOB_ESTIMATION_FEATURE_REVIEW.md` and `reviews\JOB_FEATURE_REVIEW.md`.

---

## 3. Filters *(UI 4, 17, 20)*

Same-row alignment is mandatory in new/subsequently reviewed filter forms (UI4,
owner instruction 2026-10-04): bind shared `[stableLayout]="true"`, keep consistent
label/control markup and verify the actual control start line, not just equal
34px heights. Validated fields use shared FieldError reserveMessage to retain
space below controls while messages appear; never use feature alignment CSS or
bottom-align a tall error field against its neighbors. Item Issue adopts the
existing Workshop Job reference with three fields and reserved date feedback.
Owner explicitly starts adoption at Item Issue; previously adjusted screens
remain untouched. Shared default/breakpoints/widths/query behavior stay intact.

### 3.1 One presentation — the shared filter panel
A list filter strip is `form[appFilterPanel]` (§3.4). The old feature-owned "compact strip" (accent border, gradient, `repeat(N, 1fr)` grid in feature SCSS) and the "flat 12-column grid" are **legacy**: replaced by the panel in the screen's review, and their filter SCSS is deleted. A report uses the global `sigma-report-filter-*` strip (UI 20). A routed financial editor uses the panel.

### 3.2 Heights and fields
* **General filter collapse (UI4; owner2026-10-11):** every form[appFilterPanel] gets an initially expanded native translated disclosure below1200px (screen max1199.98), with unique aria-controls/aria-expanded and shared theme/focus/busy treatment. Hide main/advanced grids and toolbar together only on narrow screens; retain mounted controls, values/dirty state and independent advancedOpen without Search/Reset/disable/submit. Desktop always exposes normal content, narrowing restores local state, print ignores collapse. Keep direct-child layout contracts; no feature opt-in/CSS. Common bilingual UserGuide guidance is shown once through the existing module overview. Visual/keyboard/form-state/RTL/theme acceptance remains pending.
* **Action spacing (UI4):** shared numeric actionGap owns the action flex gap in pixels (default8). Select a different value only for an explicit owner spacing request; use ng-container[appFilterActions] for direct button projection. Preserve Reset/wrapping/RTL and other consumers' defaults; no feature margins or copied toolbar CSS. Visual acceptance remains pending.
* **Field spacing (UI4):** shared numeric columnGap owns horizontal spacing (default16px), and rowGap owns vertical main/advanced field-row spacing (default7px). Select a smaller value only for an explicit owner density request; retain label/control spacing, validation reserves, responsive stacking and RTL. Do not add feature grid or margin overrides.
* **Intermediate inline filters (UI4):** optional responsiveColumns (default null) moves actions below the full-width grid at <=1365px and selects intermediate tracks, then one field track at <=720px. Leave selects6 for three span2 fields; Holiday selects2. Shared sigma-filter-checks retains three equal checkbox columns on a desktop span3 item and full-row intermediate/mobile group; remove the empty heading track when the group stands alone and allow labels to wrap within columns. Retain34px controls, reserved date feedback, button wrapping, RTL/theme and other consumers' defaults. No feature responsive CSS; actual visual acceptance pending.
* **Filter action height (UI4):** PrimaryActionButton owns its sigma-filter-panel__actions context: height/min-height use the existing 34px control token, border-box and zero block padding to match Reset/Export. No feature button-height CSS; defaults outside filter actions stay unchanged. Budget Search adopts the owner height correction; visual acceptance pending.
* **Validated inline placement (UI4):** explicit owner placement may combine inlineActions/stableLayout with inlineActionCaption="general.actions". Shared invisible aria-hidden caption matches single-line field labels/4px gap and top-aligns actions independent of FieldError feedback. Budget opts in with2cols; <=720px stacks actions below fields and hides caption. Existing empty-caption consumers/advanced layout retain defaults. Preserve validators, reserved feedback, Reset/busy/actions and34px/theme/RTL; no feature offset or copied toolbar.
* **Compact search actions (UI4):** a short, simple unvalidated strip may bind shared `[inlineActions]="true"` (default false) to align its existing Reset/actions beside the main grid. The modifier applies only without advanced filters, uses configured mainColumns above 720px and stacks fields below it with actions beside the last input line; hides the empty toolbar-start placeholder. LinkAccounts uses one search field or two with its tab selector; OpeningBalances uses 1/2/3 for Suppliers, Customers/Deposit and Prepaid. Retain stableLayout, mandatory Reset/busy/resetRequested, 34px height, labels/theme/RTL; no feature toolbar CSS or duplicate button. Dense/validated strips keep the normal responsive layout.
* **Control Height Invariant:** every single-line control resolves to `--sigma-filter-control-height` (34px); keep a `*-filters` class on the form.
* **Fields:** `sigma-filter-field` with `--wide`, `--full`, `--check` (checkbox before its label) and `--choice` (radio `fieldset` + `legend` + `.sigma-filter-choice-options`).
* **Checkbox vertical centering (UI4; owner instruction 2026-10-10):** centre the native 15px checkbox square and its adjacent label against the neighbouring 34px input/dropdown/date-control boxes, not their headings or entire field/error height. Reserved feedback must not move it; wrapped standalone rows must not retain a neighbouring label's empty space. Shared filter-panel geometry owns the rule; never propagate feature padding/offsets/transforms/`!important`. Leave adopts stable inline actions with inlineActionCaption: the shared --check grid reserves the common 0.72rem/1.5 heading and 4px gap, then centres the pair in the control-height track; <=720px removes the heading reservation. Other layouts retain defaults. ProcessedPayrolls' local 24px padding remains implementation debt. Source-only; owner visual/RTL/narrow acceptance pending.
* **Requests:** `toListParams(query)` from `shared/utils/list-query.ts` sends non-empty values only; an unpaged report/read uses `toFilterParams(filters)` from the same shared serializer *(UI 2, 20)*.

### 3.3 Date Range Filter Standard (Dual Calendar & Manual Typing)

* **Range caret preservation (UI17):** owner rejected the render workaround and clarified selected From-year replacement. Shared protectRangeMarker narrows a selected endpoint overlapping the delimiter to that endpoint before native replacement/deletion; otherwise the old insertText prevention moves to To start. Marker-only/cross-endpoint insertions stay blocked with selection retained; collapsed Backspace/Delete keep their boundary skip. Remove afterNextRender/display mutation; no focus move, synthetic input, extra form write or feature handler. Preserve select-all/history/noncancelable fallback, single/month masks, partial input, bounds/order, picker/clear. Source-only; exact browser selection/owner reproduction/paste/mobile/RTL acceptance pending.

* **Saved calendar hydration (UI17):** use shared toPickerDate(apiDate) for saved API date-only values and URL filters; it validates the calendar segment and returns a local Date or null. Restore a range with two hydrated Dates, not raw ISO strings. Keep manual Date|string|null validation/transport separate; no UTC conversion or private hydration parser. partnerPickerDate delegates compatibly; date-time controls keep their own contract. Equipment Rental adopts it; owner reload/route/input/visual acceptance pending.
* **Full-year month boundaries (UI17):** `currentMonthRange(date)` retains local years0001..0099 with `setFullYear`, midnight and four-digit transport. Hydrate a parsed month with `toPickerDate(month + '-01')`, shift via `setMonth`, validate the destination through `parseMonthValue`, and reuse the shared range for requests. Do not use the multi-argument Date constructor for month/year transport or submit years outside0001..9999. TripSheet is the scoped consumer; business bounds remain feature-owned and owner input/route acceptance pending.

* **Fixed dash-range delimiter (UI17):** shared appDatePicker protects the exact ` - ` during partial deletion/replacement, skips it on Backspace/Delete and normalizes missing/excess spaces before PrimeNG's input parser with adjusted caret offsets. Select-all/clear/history remain available; a snapshot restores noncancelable marker destruction. Unspaced dash normalization is unambiguous for slash formats; dash-date formats retain protection without guessed compact boundaries. Preserve partial dates/validation, single/multiple/custom separators and disabled/picker-only behavior. No feature guard, synthetic input, parser copy or extra form write; runtime acceptance pending.
* **Strict Invariant — Zero Native HTML Date Inputs:** Never use `<input type="date">` anywhere in the application.
* **Dual Month Range Control (datepicker مزدوج):** Whenever filtering by a date range (Date From / Date To), NEVER render two separate date inputs. Always use a single PrimeNG date picker with `selectionMode="range"` and `[numberOfMonths]="2"` to display both months side-by-side in the overlay:
  ```html
  <div class="sigma-filter-field">
    <label for="filter-date-range">{{ 'feature.dateRange' | translate }}</label>
    <p-datepicker
      inputId="filter-date-range"
      formControlName="dateRange"
      selectionMode="range"
      [numberOfMonths]="2"
      [readonlyInput]="false"
      [keepInvalid]="true"
      [showButtonBar]="true"
      dateFormat="dd/mm/yy"
      [placeholder]="'feature.dateRange' | translate"
      panelStyleClass="sigma-datepicker-panel"
      styleClass="w-100"
      appendTo="body"
    />
  </div>
  ```
* **No Calendar Icon:** Sigma calendars carry no trigger icon; the input itself opens the panel. Never set `[showIcon]`: `styles.scss` hides `.p-datepicker-dropdown` with `display: none !important`, so `showIcon` renders nothing and only leaves dead padding. The `numberOfMonths` value widens the overlay, not the field, so the range field still takes exactly one grid column.
* **Manual Date Editing Invariant (`[readonlyInput]="false"` and `[keepInvalid]="true"`):**
  - Allow the user to type or modify the date manually by default (`[readonlyInput]="false"`). An explicit owner request for picker-only entry overrides this on the affected calendars with `[readonlyInput]="true"` and `[keepInvalid]="false"`; keep `appDatePicker` and existing date validation *(UI 17)*.
  - Every date box allows date editing or picker selection and rejects arbitrary text. Use `p-datepicker appDatePicker`: `dateNumericInput` is enabled by default, accepting digits and configured numeric date/range/time separators (AM/PM characters only for 12-hour time). Retain `keepInvalid=true` and real-date validators; no feature-local guards or text-permitting override. Legacy calendars adopt the shared directive during their screen review *(UI 17)*.
  - Input fallback belongs in the shared directive: capture native `input` before PrimeNG parses it, clean disallowed characters while preserving the caret, and let its normal parser update the form once (including input without keydown). Scope to the actual calendar input and dispose the listener on destroy; never clean only the displayed text after model update *(UI 17)*.
  - Every new or reviewed date field uses `appDatePicker` with `[dateInputMask]="true"` for single `dd/mm/yy` or `mm/yy` calendars without time: two day/month digits, four year digits and typed slash separators. This is the required future recipe; the directive stays opt-in for other existing consumers until their screen review. Use the matching `dd/mm/yyyy` or `mm/yyyy` placeholder. Partial edits remain invalid until a real complete date; shared validation prevents partial short-year parsing. Picker, bounds, date order and transport semantics remain. Individual/Company/Driver dates share it; time/range fields retain their existing shared guards/validation. No local masks or native date inputs *(UI 17)*.
  - **For typeable calendars, always add `[keepInvalid]="true"`:** Without it, PrimeNG's internal blur event clears text that does not match its format, losing a partial or range entry on Search/Save. Picker-only inputs keep keyboard opening through `appDatePicker` (Enter, Space or Arrow Down) *(UI 17)*.
* **Resilient Reactive Form & Request Contract:**
  - Form control binds to: `dateRange: this.fb.control<Date[] | string | null>(currentMonthRange())`.
  - Normalise with the shared `parseDateRange(value)` from `shared/utils/date-utils.ts`: it accepts the picker's `Date[]`, a `Date` or typed text (`dd/MM/yyyy`, `dd-MM-yyyy`, `yyyy-MM-dd`, separated by ` - `, `to`, `إلى` or a comma) and returns `[from, to]` as `yyyy-MM-dd` (null when invalid) for `FilterHelper.GetDate`. Never write private `parseRangeString`/`parseDateValue`/`formatApiDate` copies:
    ```ts
    const [dateFrom, dateTo] = parseDateRange(this.filterForm.getRawValue().dateRange);
    ```
* **Default Value Invariant (الشهر الحالي):** list **and** report date ranges default to the **current month**, 1st to last day: `currentMonthRange()` from `date-utils.ts` *(UI 17, 20)*.
* **Month transport (UI 17):** reviewed month controls use `Date | string | null`, shared `appDatePicker` structured mask, `view="month"`, `dateFormat="mm/yy"` and `mm/yyyy` placeholder. Normalize through shared `parseMonthValue`: valid local Date or complete MM/YYYY/yyyy-MM only, month1–12/year1–9999, otherwise null. Validate through shared `monthValueValidator` plus `Validators.required` only when mandatory; empty optional values pass and invalid/partial months use the shared date error. Use `currentMonthRange()[0]` for current-month defaults; no feature copies or short-year coercion. Depreciation adopts the validator; two existing Accounts-family/Timesheet copies remain for their own review (UI30/39). Staff monthly operations and Timesheet are source-inspected consumers; payroll rules remain feature-owned.

---

* **Clock transport (UI17):** use shared parseTimeValue/toTimePickerDate/timeValueValidator for clock-only TimeSpan controls; local fields, optional empties, complete ranges, no UTC/duration inference. Preserve unchanged saved precision by supplying the original API value; unsupported saved text stays invalid rather than midnight. Required stays separate; timeOnly has no single-date mask.

### 3.4 Shared Filter Panel *(UI 4, Master 5)*

Every list filter strip is `<form class="<feature>-filters" appFilterPanel [formGroup] (ngSubmit)>` (reference: Job list):
- Import `FilterPanelComponent` from `filter-panel.component.ts`; import `FilterActionsDirective`/optional `FilterAdvancedDirective` from `filter-panel.directives.ts`, then register used symbols in `@Component.imports`. The component file is not a barrel; wrong-path TS2305 can cascade into NG1010 *(UI4/1)*.
- Fields are `div.sigma-filter-field` (`--wide`, `--full`, `--check`, `--choice`); ≤ 6 in the main row; the rest in `ng-template[appFilterAdvanced]`; Export/Search in `[appFilterActions]` (Export uses `sigma-secondary-button`).
- Pass `[advancedControls]` (names), `[(advancedOpen)]`, `moreFiltersLabel`, `[busy]`; handle the **mandatory** `(resetRequested)` with the screen defaults, then search page 1.
- For frozen filter-stability work, opt into `[stableLayout]="true"`: shared top alignment, field-bounded PrimeNG hosts/roots and an invisible zero-count badge slot keep editing geometry stable. Validated filters use `app-field-error reserveMessage="existing.translationKey"` to reserve the longest expected translated feedback in the same grid cell, without duplicate alerts or clipping. One host selects mutually exclusive child/group errors. No feature width/error-height CSS. Three Balance Summary consumers adopt it; report-main-form exceptions stay in their frozen contract *(UI4/19/20)*.
- No filter colour, border, dark or responsive rule in the feature SCSS — the panel and the `--sigma-filter-*` tokens own them; never reference an undefined `var()` token.
- The rest of the list page is shared too *(UI 1, 6)*: `host: { class: 'sigma-route-host' }`, `sigma-list-page` › `sigma-list-panel` › `sigma-list-header`, `sigma-alert` (`--warning`), `sigma-secondary-button`, `sigma-list-table` › `app-data-table [fill]="true"` — no `::ng-deep` table fill, no page/panel copies; a list screen normally has no stylesheet.

## 4. Data Table & Pagination (`app-data-table`) *(UI 5, 6, 30 items 33–34)*

Stable text edits *(UI6, 2026-10-17)*: typed canonical complete row snapshots
may update visible matching keys without a new count/page only for the same
All/no-search/immutable-key-order query and session/page. Preserve count/order,
accumulate Save-and-Next and require authoritative Reset detail. Filter/search/
value-order/incomplete or mismatched results retain the server refresh; never
guess server collation or filtered counts. Explicit Refresh remains available.

### 4.1 Grounded Pagination & Flex Height *(UI 6, backlog 34 resolved)*
* Shared `DEFAULT_PAGE_SIZE` is 15 after the owner's 2026-10-03 decision, superseding 20. Standard choices are 10/15/20/50/100; DataTable also normalizes the former standard choices. New/reviewed controlled lists and local report pagers use this shared initial size, preserving explicit user sizes, the 10-row minimum and complete print/export/totals scope. All four Suppliers screens consume it *(UI 6)*.
* Before writing page/size signals, call `resolveListPaging(event, { pageNo: this.pageNo(), pageSize: this.pageSize() })` from `shared/utils/list-query.ts`. Its `changed` compares the previous state: a size-only change on page 1 fetches again, an unchanged page/size does not. No copied paging conversion in new/reviewed screens; existing consumers adopt during their review. Sorting remains backend-confirmed and feature-owned. Do not mutate pager state then drop the request while loading; use §6's `switchMap` flow *(UI 6, 28)*.
* Put the grid in `div.sigma-list-table` and pass `[fill]="true"` to `app-data-table`: the rows become the single scroll owner (§2.3), the paginator is grounded at the card's bottom with compact spacing, and `scrollHeight` is ignored.
* Customize only through inputs (`fill`, `scrollHeight` for a grid nested inside another scroll owner, `rows`, `paginator`) and the `--sigma-data-table-*` variables. **No** `::ng-deep` into `.sigma-data-table`, `.p-datatable-*` or `.p-paginator`; the former Transitional deep fill block is removed in the screen's review.
* **Direction & RTL Safety:** Never add ad-hoc `margin-inline-start: auto` on shared paginator sub-elements (`.p-paginator-current`), as this breaks standard RTL Arabic mirroring.

* **Unknown item counts (UI6):** explicit totalRecordsKnown=false with lazy=true and actual totalPages selects shared Previous/Next/page-size navigation. Never fabricate totalRecords or load all pages to simulate list paging. Ordinary defaults stay; output alone loads all pages. Producer sparse/count defects remain reported.

### 4.2 Empty State Translation (`general.noDataFound`) *(UI 6, 23)*
* `DataTableComponent` defaults `@Input() emptyMessage = 'general.noDataFound';`.
* Always ensure `general.noDataFound` exists in both dictionaries (`en.ts`: `'No data found'`, `ar.ts`: `'لا توجد بيانات'`).
* If overriding with a feature key (e.g. `emptyMessage="feature.empty"`), verify both language entries exist.

### 4.3 Column Templates & Status Translation Invariant *(UI 5)*
* **Loose/nested response projections:** feature-owned grid-row mappers may reuse `shared/utils/grid-row-values.ts` for scalar path reading and explicit booleans. Missing paths remain empty; keep field/fallback choices in the feature, infer no domain aliases or financial values, and never weaken typed DataTable fields or copy the reader per screen *(UI5)*.
* **Column identity:** DataTable header/body loops track the unique field + stable header-translation-key pair. Retained numeric and derived status presentations may reuse a real row field with distinct headers; language changes keep identity, sorting keeps its real field, and no DTO member is added solely for DOM keys. Stock Reports adopts this shared capability; source-only, runtime acceptance pending *(UI5)*.
* **Static ViewChild Invariant:** For custom cell templates (`#statusTemplate`, `#noTemplate`, `#dateTemplate`), always declare `@ViewChild('statusTemplate', { static: true }) protected statusTemplate!: TemplateRef<unknown>;`.
* **Explicit Columns Initialization in `ngOnInit()`:** Initialize the `columns` signal inside `ngOnInit()` via `this.initColumns()` so `TemplateRef` handles are guaranteed resolved before the data table renders.
* **Dual-Layer Fail-Safe Translation:**
  - Supply both `cellTemplate: this.statusTemplate` AND `value: (row) => this.getStatusText(row.status)` in the column definition.
  - If the cell template is bypassed during fast rendering or export, the table's `displayValue` falls back to `value(row)`:
    ```ts
    getStatusText(status: StatusEnum | number | string | null | undefined): string {
      if (status === StatusEnum.Open || status === 0 || status === 'Open') {
        return this.translate.instant('feature.open');
      }
      if (status === StatusEnum.Closed || status === 1 || status === 'Closed') {
        return this.translate.instant('feature.closed');
      }
      return '—';
    }
    ```
  - In the template, use standard `$implicit` binding (`let-row`) rather than binding property names: `<ng-template #statusTemplate let-row>`.

### 4.4 Grids Combining Distinct Record Sources *(UI 6, BE 9)*
When one screen intentionally lists different entity types in a shared grid:
* Give each row an explicit record discriminator, and use a composite table key such as `RecordType:Id` because primary keys can overlap across source tables.
* Keep the source filter and visible record-type column aligned. Apply shared filters to every source that supports them; when a source cannot support a source-specific filter, exclude that source while the filter is active and document that behavior.
* Project both sources to the same scalar row shape before a server-side set operation. Assign every projected member in every selector, using explicitly typed nulls/defaults for fields that do not apply to a source. EF Core requires compatible nominal projection members and types on both sides of `Concat`/`Union`.
* Apply the combined count, allowlisted sort, deterministic tie-breakers, and page window on the server. Do not load both full result sets and merge/page in memory.
* Make row actions source-aware: only expose an action when it is valid for that record type; do not route one entity through another entity's detail/edit contract.
* For collection-backed display values, preserve correct filter semantics and avoid multiplying parent rows. If a row summarizes multiple related values, calculate the display summary without changing parent count or page cardinality.

### 4.5 Approval Lifecycle Invariants *(Master 4, BE 12, UI 7)*

**Shared approval presentation (Master4; UI7/13, owner2026-10-21).** For
models with a frozen persisted approval lifecycle, the saved routed editor's
Approval tab and a separate list Approval Status action/modal show the same
server-owned current step, complete/incomplete/rejected state and actual
history. Both surfaces offer the model's eligible Approve/Reject actions through
the same typed endpoint, confirmation, busy/error and refresh contract; never
calculate divergent local approval state. No approval controls on unsaved
records, duplicate internal tab heading, fabricated history or inferred
multi-step policy. A model without approval state/endpoints does not inherit
them merely from presentation. Future configurable approval rules belong to
Settings **per model**, not to each form; freeze that model's transition and
financial effects separately before implementation.
Owner scope 2026-10-21 extends eventual approval to all ERP documents, including
nonfinancial ones. Inventory and freeze each model's operational effects first.
Use Pending/Approved/Rejected as the common vocabulary (Master4; UI7):
Approve is eligible Pending→Approved; UnApprove is guarded Approved→Pending;
Reject is eligible Pending→Rejected. Approved→Rejected is a separate per-model
correction only where explicitly frozen. Both approval surfaces share server
eligibility and history; a typed reason is required where the transition
contract says so. Never expose UnApprove when effective financial, stock,
settlement or downstream work cannot safely be undone. Use the model's guarded
Void/Cancel instead; do not relabel status without canceling its real effect.
Financial Save remains draft, Approve posts the real source-owned journal and
Void flag-cancels its effective ledger impact without a reversing journal,
subject to domain guards. Nonfinancial Approve changes validated state or
releases a defined operational effect; ordinary Reject/Cancel suffices when
there is no material effect to undo. Nonfinancial Void exists only to cancel
a real released operational effect with audit, and never invents accounting.
Do not expose an action before its complete model
contract and history handling exist; use PLAN-00 for the broad rollout.

**General financial Void rule (BE15, explicit owner2026-10-20).** Apply to new
financial screens and reviews of existing screens. Void atomically flags the
source and its existing source-owned JV canceled, retaining number/lines/amounts
and posting history; create no reversing JV or cancellation allocation and do
not reset/unpost/delete the posted history. Check source/tenant/state ownership,
the original posting period, live allocations and feature settlement locks
under the shared write boundary. Server audit owns reason/date/actor. Effective
ledger/capacity readers exclude canceled journals on both endpoints; historical
views retain a clear cancellation flag and the readable original. Review menus,
write guards, linkage, filters/reports and concurrency together. Do not invent
UnVoid during review. The instruction supersedes J-1's reversing-entry rule;
known unrelated legacy violations are findings, not a reason to copy them or
silently refactor other screens.

**Bills draft and settlement exception (BE15, owner2026-10-20).** Save retains a
validated Bill draft with no new JV; explicit Approve revalidates the saved
financial/loan/source snapshot and posts atomically. Latest owner decision adds
conditional UnApprove for explicit Approved, nonvoided Bills with an open
original year/month and no allocations, retained payments, paid EMI history or
retained positive debit-note target history, including voided/deleted notes or
details whose proportional source credits must stay immutable. Batch list period checks and expose a
server canUnapprove flag; recheck under allocation-then-PurchaseRequest locks,
unpost the retained original JV and append an audited NotApproved decision in
the same boundary. No journal deletion/reversal or fabricated legacy approval.
Edit and explicit reapproval reuse the owned unposted source journal; linked
zero-total journal histories require review instead of stale journal amounts.
This supersedes the prior Bills-only ban on UnApprove. Independent terminal
flag-only Void still marks Bill and existing JV voided in
one save, retaining its posted history and recording date/reason/authenticated
actor. No new or reversing JV or cancellation allocation. Guard source ownership,
the original posting period, active allocations and paid EMIs; during Void do not unpost
the original or reprice saved tax. Canceled Bills cannot edit,
delete, reapprove or allocate; eligible GRN billing claims are released without
stock effects and direct Bill target consumers check Bill.IsVoided. Display
Voided separately from payment Open/Closed; retain historical report values with
a visible flag. Keep unknown legacy approval
nullable, never infer it from a posted JV or fabricate a backfill. Lock lifecycle
and allocation through allocation-then-PurchaseRequest tenant boundaries.
Offered source writers also share the allocation lock through save (including
unpost/void/replace/bulk); DebitNote retains its Serializable boundary and bulk
calls the same guarded domain cores, never raw generic mapping writes.
All BillTypes and IsLoan use eligible posted supplier payable capacity, with
same account/branch/currency and opposite debit sources, positive precision-valid
unique inputs and current two-sided capacity checked again under lock. Normalize
implicit/explicit base currency; reserve legacy source-JV amounts only once and
fail closed for ambiguous target history. Closed follows zero effective payable
balance, not approval or scheduled installments; draft/missing ledger evidence
remains unknown and approved zero totals close. Allocation creates no cash or
interest journal and does not mark EMI Paid. Supplier-debit direction (BE15,
owner2026-10-20): identify an optional General line supplier by explicit FK,
validate its existing control-account match without draft configuration writes,
and stamp PartnerId on the net posted debit. Never infer identity from text or
eligibility from General type alone. Select the actual supplier debit, auto-skip
only one available source, then distribute to matching open Bill credits under
the same capacity/lock owner as ordinary payable allocation. Posted source net
debit excludes separate tax;8000 cannot allocate8400. Legacy source-header
reservations consume each supplier/account debit pool once, both directions
share capacities, and source/target Bill settlement stays independent. Settings-owned approval configuration
stays deferred. Owner migration/runtime acceptance remains pending.

Source-owned installment payment *(BE15, owner2026-10-20)*: a plan/allocation is
not a payment. After the financial contract is approved, commit the real PV,
posted source journal, immutable installment/request link, required principal
allocation and Paid status together under the competing source/allocation locks.
Snapshot bank/interest account roles for historical proof rather than using a
later mapping; reject shared payment journals and malformed allocation
header/detail ownership before effective filtering. Guard generic Payment/JV
bulk/active and any exposed child writes, not only the source button. Keep orphan
Paid history readable without a fabricated PV and block fresh cash on ambiguity.
Bills full saved-value payment debits original supplier principal plus linked
interest expense, credits recovery bank and allocates principal only; no implied
partial payment, lender transfer, interest amendment, settlement or restructure.
Source-only; owner migration/accounting/concurrency acceptance pending.

Audited loan revision *(BE15, owner2026-10-21)*: separate Pay, Reschedule and
Early Settlement. Preserve Paid/PV history; archive replaced Unpaid generations
with actual source-owned revision FKs and audited before/after terms. Active
summaries, Pay and reports exclude archived rows. Freeze conservation/interest
and accounting first; current Bills reschedule conserves remaining principal
and interest, settlement pays full principal plus explicit bounded agreed
interest through the same source-payment engine. Require exact scheduled
principal versus effective payable capacity; never use min or invent an asset
split/writeoff/fee. Server preview/version recheck, request fingerprint replay,
same locks and atomic revision/archive/replacement/cash boundary prevent stale
or duplicate effects. Validate precision, positive rows, exact remainders and
dates; protect generic corrections. Loan Settled requires proven paid history
and reconciled remaining amounts, independently from Bill Closed.

For an entity with a pending-then-terminal approval model (reference implementation: Workshop Job Estimation; feature details in its review artifact):
* Keep approval state backend-owned. New records start at `NotApproved`; accept only `NotApproved -> Approved` or `NotApproved -> Rejected` transitions unless the owner explicitly defines another transition.
* Enforce lifecycle rules in every backend write path, not only by hiding frontend actions: only pending records can be edited, approved/rejected records are terminal and cannot be deleted, and status-change requests accept only `Approved` or `Rejected` from the pending state.
* Guard approval state against concurrent aggregate writes. Treat the current approval status as an optimistic concurrency value and force the root-row check when updates may otherwise touch child rows only, so an editor loaded while pending cannot save after a concurrent approval/rejection.
* Keep View available across states; expose Edit/Approve/Reject only while pending. Do not add unapprove/reopen, rejection-reason, or audit-log behavior unless the entity's existing contract or owner request requires it.
* If a participating entity lacks persisted approval state, identify the required nullable/default/backfill behavior and migration owner before using the shared grid filter or actions. Do not change a client DTO alone and treat that as persistence.
* In a mixed-source grid, dispatch View/Edit/Approve/Reject by the row's record discriminator to that source's route and API. Each aggregate must return its persisted approval status; keep each source's write validation in its backend service rather than routing one entity through another entity's update contract.

### 4.6 Paginator Page Report Standard (`currentPageReport`) *(UI 6 "Current page report format", backlog 37)*
* **Binding:** Every new or refactored list that pages through `app-data-table` binds `currentPageReport` to a feature key. Name a new key `<feature>.showingEntries`; an existing `<feature>.pageReport` key with the placeholders below is compliant and is not renamed.
* **Both languages:** Define the key in `en.ts` and `ar.ts`:
  - `en.ts`: `'Showing {first} to {last} of {totalRecords} entries'`
  - `ar.ts`: `'عرض {first} إلى {last} من {totalRecords} إدخال'`
* **Never omit it:** unbound, the table falls back to `{first} - {last} / {totalRecords}` and shows only numbers (`1 - 10 / 16`).
* **Placeholders:** inside `currentPageReport`, PrimeNG replaces only `{first}`, `{last}`, `{rows}`, `{totalRecords}`, `{currentPage}`, `{totalPages}`; `{total}` and `{{total}}` show as literal text. A hand-built pager that uses `'key' | translate: { from, to, total }` correctly uses `{{…}}`; do not "fix" it.
* **Do not bind `general.showingEntries`** until backlog 37 is resolved (it still uses `{total}`, and `Limousine/Location` depends on that).

---

## 5. Angular 17+ Control Flow & Templates (`@for`) *(UI 14)*

### 5.1 The `@for` Tracking Invariant
* **Do not track by `$index`:** tracking by position re-creates rows and their form state when a row is inserted or removed. Track by a stable identity instead.
* **For `FormArray.controls` (Editable Rows / Child Collections):**
  Always use `track row` or `track control`:
  ```html
  @for (row of itemsArray.controls; track row; let i = $index) {
    <tr [formGroupName]="i">
      ...
    </tr>
  }
  ```
  Each `FormGroup` reference is a stable, unique object in memory.
* **For Entity Arrays / DTOs:**
  Always use `track item.id` (or primary business key):
  ```html
  @for (item of items(); track item.id; let i = $index)
  ```

### 5.2 Typed Template Inputs *(UI 14, 16)*

Bounded row scrolling *(UI1/13/14, 2026-10-15)*: for every new/reviewed similar
routed editor, trace allocated height through remaining-space FormSection fill,
shared content, each intervening `sigma-editor-pane`, and EditableCollectionTable
fillHeight/stickyHeader host/root/frame. `flex:1` on a display:block table-area
wrapper does not constrain its child; increasing rows can be clipped without a
vertical scrollbar. Reuse the shared bounded column, not pixel height/page
scroll/another sigma-editor-scroll or deep frame overrides. Frame owns both axes
and sticky headers; section title/Add and totals/footer stay outside row scroll.
Owner acceptance adds rows past the bound and reaches last row/column across
Create/Edit/View, short heights, responsive/RTL/themes and complete print.
Source inspection cannot establish visible runtime scrolling; legacy adoption
remains review-scoped. Purchase Requests is the missing-wrapper evidence.
For stacked header/details workspaces, keep the bounded header allocation
non-shrinking and remaining details host/wrapper at flex1 1 0/min-height0.
An auto row-content basis can squeeze Basic Information away when rows grow;
verify both panes together. Features retain their own header share, never a
universal pixel height/ratio (UI14).

Generalized full-height record tabs *(UI13, 2026-10-15)*: shared workspace
EditorTabs plus remaining-space active Basic/Details/Documents panels replace
stacked percentage allocations. Preserve one parent form/control graph and
values; switching never saves/discards. Guard switches during Save/uploads/
cleanup/child confirmations. Select the invalid owning tab before field focus;
empty required rows select Details. Keep totals/footer fixed, UI14 row frame
scroll intact, typed keys/ARIA IDs matched. Shared print session mounts all
saved sections regardless of active tab and hides the strip. Purchase Requests
adopts this owner choice; it is now the default for comparable peer-section
documents under the owner's generalization. Other shapes and governing
exceptions retain their own architecture; there is no bulk legacy conversion.

Compact heading-only choices *(UI13, 2026-10-15)*: project a small choice group
through existing FormSection form-section-actions. Shared headings wrap to
available width, actions stay max-width100%, and :empty/:has removes an empty
content region plus heading bottom divider/spacing. Populated sections retain
their styling; no feature deep override/new input. Purchase Requests type radios
adopt this beside-title placement; preserve labels/control graph/busy/View/print
and verify long EN/AR/intermediate/narrow layouts. Owner visual acceptance pending.

For reviewed collection editors, opt into `EditableRows.freezeParentOnConfirmation: true` when controls remain visible during removal. Shared UI14 mechanics use UI10's `freezeFormState`, restore before the existing row/`canMutate` recheck and release idempotently; default false preserves other consumers. Features keep identity/read-only/busy gates and full-snapshot behavior. Source-only acceptance pending.

For persisted GUID/string child keys, provide `EditableRows.isSavedRow` from the typed identity (UI14); a pristine saved row still requires confirmation. Numeric `savedId()` keeps its existing return contract and default classification. LeaseClause adopts it; source-only acceptance pending.
* Table alignment and stable validation rows *(UI6/14; owner2026-10-23 correction to2026-10-15)*: global table th/td middle!important still owns ordinary tables, headers and non-form rows. Shared EditableCollectionTable body rows containing FieldError or FileField top-align every cell through one scoped important override so wrapped errors stay below the first34px control track without lowering neighboring fields/files/actions. Shared Remove is34px; direct standalone15px checkboxes use block display and half the track/checkbox height difference as logical top margin; captioned checks keep their34px wrapper. No consumer opt-in, feature offsets, detached/clipped errors or cell display changes. Preserve horizontal alignment, spans/columns/wrap/scroll/sticky/print, controls/payloads and ordinary non-table form layout. This generalizes the file/action-only exception; source-only owner visual/RTL/theme/print acceptance pending.

* Picker/date-order parity *(UI17;2026-10-23)*: for an existing strict document expiry>issue rule, bind expiry minDate=issue+1 local day and issue maxDate=expiry-1 day. Validate complete opposite dates through the shared validator/parser/hydration; missing/invalid/partial input yields no derived bound. Keep stable Date references for unchanged source days, local setDate across boundaries, form/server validation, manual editing and values/payloads. Do not invent today/future limits or impose strictness where equality is allowed. Company Documents and its existing Driver reuse consume this rule; owner interaction acceptance pending.
* Optional equal numeric widths *(UI14)*: use shared EditableCollectionTable `__number` on inputs inside `__input-unit` and on read badges, with consumer-local `--sigma-editable-number-width`. `__input-unit--fixed` centers a number-width/54px unit grid; units stay outside the numeric box and different unit labels never move its line. Fit the smallest numeric column after shared padding; keep table scroll/default consumers/formatting/formulas intact. Rental Booking selects96px; no feature input/badge sizing CSS, source-only visual acceptance pending.
* Optional numeric units *(UI14)*: project numeric input and `__unit` span through shared EditableCollectionTable `__input-unit` (shrinking input,6px gap, existing34px line). Read badges use `__value--with-unit`; neutral10px muted units isolate LTR text and do not use red validation `small`. FieldError stays below the group. Native reactive row checkboxes reuse existing15px primary accent and34px `__row-check` label; preserve conditional visibility, native disabled state and existing handlers. Rental Booking adopts it; unrelated consumers remain unchanged, visual/runtime acceptance pending.
* PrimeNG dropdown options need a mutable `T[]`. Freshly filtered getters return `T[]`; copy readonly sources before binding rather than casting away the mismatch. Logs Movement's owner-reported TS4104 confirms this current input contract *(UI16)*.
* When an attribute directive uses an input as its selector (for example, `ng-template[appEditableCollectionRow]`), bind that input once with its typed value: `<ng-template [appEditableCollectionRow]="rows">`.
* Do not combine the bare selector attribute with its property binding. The bare attribute also supplies an empty string to the same input and can fail strict template checking when the input expects an array or object.

---

## 6. Component Lifecycle & Data Loading *(UI 1, 22, 28)*

Shared real-time invalidation *(UI2/28; BE17, 2026-10-19)*: consume root
`RealtimeService.watch(topic)` and its joined/rejoined `connected` or `changed`
signals, not feature hubs. Shared transport owns ref-count/session/token/retry/
membership/teardown; `readAuthToken` is shared with HTTP interception. Keep
session-bound consumers on shared `observeAuthToken` (distinct auth/storage,
guarded post-login-storage microtask and subscription cleanup). Keep
typed HTTP snapshots authoritative, coalesce events, cancel stale filters and
sessions, show connection/stale/error/Retry and reconcile periodically for
missed messages/date boundaries. Server topics/dependency registry, claim-owned
tenant groups, authenticated hub/snapshot, path-scoped query JWT, expiry closure
and postcommit EF save/transaction tracking have one owner in ServerAPI/Realtime.
Explicit multi-save transactions notify on commit; failed saves/full rollback
do not. Bounded best-effort topic/time delivery never fails committed writes.
Ambient/interceptor-bypassing writes use reconciliation; multi-instance needs
configured backplane. Null source facts stay unavailable. Dashboard is first
consumer; source-only, owner compilation/isolation/reconnect acceptance pending.

**Working-branch defaults (UI1/16, owner2026-10-18):** root CurrentBranchService
loads preference/active tenant choices before the content outlet mounts. Use
defaultBranchId for initial typed filters and applyDefault only in eligible
empty/enabled/pristine Create contexts; preserve route/manual/cleared/parent and
saved-record values, explicit string/array types and transfer roles. Never infer
an id filter from branch-name text or force query/payload values. Topbar saves
single-flight, commits after success, retains old state on failure and rejects
ended/replaced-session responses, including same-account re-login. Its shared
rendered canonical editor boundary blocks switching until closure; hidden roots
do not block, wrapper is inert while saving. This is UI safety/default behavior,
not branch/operation authorization (UI26 remains deferred). EN/AR common guide
and consumer inventory are required; source-only owner runtime acceptance pending.
For an actual branch dropdown backed by existing BranchId, match numeric option,
form/template key and backend equality together; name Contains can match several
branches. URL filterBranchId preserves explicit values/restored clears and
fresh defaults. The eight legacy voucher selectors are the scoped correction;
other text searches are unchanged (UI16).

Working-branch editor guard stability *(UI1, owner2026-10-20)*: navbar templates
read CurrentBranchService.editorOpen, not the live DOM predicate. Installed
Angular21 afterEveryRender(read) schedules one coalesced deferred refresh, re-reads
the rendered boundaries and publishes in NgZone only on a changed state, with
DestroyRef teardown guard. Keep synchronous hasOpenEditor checks on switch/Retry
actions; do not poll, force detectChanges or add per-feature guards. This avoids
NG0100 as routed/dialog editors mount after the navbar was checked and retains
the open-editor switch boundary. Shared bilingual guide and owner runtime
acceptance remain required.

**Opened sidebar group reveal (UI1, owner2026-10-14):** root/nested explicit
opening uses the shared disclosure owner to align its header with the existing
menu viewport top after rendering and sibling collapse, clamped to native
scroll range. Consume one pending header in ngAfterViewChecked, check viewport
containment/current show state and clear it on search rebuild. Change only
viewport scrollTop; preserve focus/page/horizontal position. Closing, Pin and
route/search defaults do not reveal. No scrollIntoView, timer or opt-in;
long groups stay internally scrollable. Bilingual common guide and owner
runtime/keyboard/mobile/RTL/theme acceptance required.

**Sidebar scroll bounds (UI1, owner2026-10-14):** retain ScrollComponent's
measured auto height and save-state. Declare logo, the actual search panel
`#kt_app_sidebar_menu_search`, and optional footer as dependencies; give the
menu host the existing wrapper id `kt_app_sidebar_menu`. Omitting the search
height clips final entries. No hard-coded search offset, duplicate resize
owner or feature viewport CSS. Shared EN/AR guidance and owner visual checks
cover bottom-item reachability, short height, mobile, RTL and themes.

1. **Base Component Extension** *(UI 1)*: feature list and details components extend `BaseComponentService`:
   ```ts
   export class FeatureListComponent extends BaseComponentService implements OnInit { ... }
   ```
2. **Avoid Duplicate Router Injection:** `BaseComponentService` already provides `protected router`, `activatedRoute`, and `loading`. Do not declare a private `router = inject(Router)` in subclasses. It also exposes `subscriptionId` read from `localStorage`: never send it in a payload, because the tenant is server-owned (§8.2 item 5; UI backlog 8 and 19).
3. **Two-Tier Loading Architecture (Global Loader vs. Local Signals):**
   - **One visible progress owner (UI22, 2026-10-17):** shared DataTable,
     PrimaryActionButton and EditorDialog suppress local spin/overlay only
     while LoadingService is active, observed through lifecycle-owned toSignal.
     Keep loading/saving, disabled/aria-busy/empty/navigation guards; local-only
     work still spins. Global-only screens remove duplicate loading messages,
     pair each global start with finalize-end and preserve errors/empty states.
       DataTable's default-true showLoadingIndicator maps to PrimeNG showLoader;
       global-only consumers may set false independently of loading. Keep the
       actual loading input/guards even when global counter state changes (UI22).
   Sigma uses a two-tier loading pattern that must be maintained across all screens:
   - **Tier 1: Global Application Backdrop Loader (`LoadingService`):**
     - Managed by `BaseComponentService.loading` (`LoadingService.isLoading$`), which drives the global Metronic backdrop spinner and `"Please wait..."` overlay in `app-content`.
     - **Mandatory Trigger Operations:**
       1. Screen-level data loads / pagination fetches (`loadData()`, `loadWorkOrders()`).
       2. Destructive or domain row actions (`confirmAccept()`, `confirmReject()`, `confirmDelete()`, `confirmVoid()`).
       3. Editor dialog entity loading (`loadDetails(id)`).
       4. Editor dialog saving / submission (`save()`).
     - **In-flight Cleanup:** ALWAYS wrap with RxJS `finalize(() => this.loading.endLoading())` so failure callbacks or unexpected errors do not leave the global overlay stuck on screen.
     - **Global Loader Counter:** `LoadingService` counts start/end pairs, floors at zero and resets on navigation; pair every `startLoading()` with one `endLoading()` in `finalize`. Auxiliary lookups (`loadLookups()`) still do not drive the global loader *(UI 22)*.
     - **Mode-Specific Editor Lookups:** Request option lists only for controls rendered in the active editor mode. In read-only View, use display names from the detail DTO and skip edit-only dropdown lookups; do not show lookup warnings for controls that are not rendered. Load ancillary display metadata separately and report its failure only when it materially affects the visible details.
     - **Saved select options:** Reuse `mergeSelectOptions(incoming, saved)` from `shared/utils/select-options.ts` for detail-derived selected IDs/names missing from a lookup. Incoming order/labels win; number/string IDs compare through `String(id)`. Never invent labels/change stored IDs; backend reference validation remains. Company/Driver adopt it; other copies move in their own review. Inline lookup failure has one feedback owner and explicit Retry *(UI 16, 22)*.
     - **Selectable IDs versus historical labels:** Ordinary entity choices read the owning select endpoint (or confirmed typed domain lookup), not related document graphs. When a historical reference is no longer selectable, display its detail-derived name as View text and keep it out of current choices; missing names stay empty. Do not use saved-option merging to reintroduce forbidden choices. The write validator remains authoritative *(UI 16, 15)*.
     - **Lookup Failure Diagnosis:** Keep failures for required Create/Edit dropdown data visible; do not suppress them by returning empty options or making protected endpoints anonymous. Diagnose the failed request by HTTP status before changing the UI: `401` means authentication rejected the request (check that a bearer token is attached and valid, and compare the shared auth configuration); `403` means authorization policy/permission; `404` means route mismatch; status `0` indicates transport/CORS/connectivity; `5xx` indicates a server failure. Standard controllers inherit `[Authorize]` from `SiGmaControllerBase`, so compare the failing route and request headers with sibling lookup requests. In local development, verify that the configured login/auth server and API validate the same token signing configuration; a local API paired with a remote login server can reject a freshly issued token. Compare configuration securely without printing or copying secret values. Never copy bearer tokens into logs, screenshots, or messages. Only change endpoint authorization when the feature contract explicitly calls for public access.
     - **One HttpClient:** standalone `app.config.ts` provides the application client with token, error and navigation-activity interceptors; services are `providedIn: 'root'`, API URLs start with `environment.baseUrl`, and no feature adds `provideHttpClient`, `HttpClientModule` or a manual Bearer header. The token interceptor also sends `Accept-Language` from the UI language. Retained lazy-module/provider interoperability does not recreate `AppModule` or the retired Metronic shell *(UI 1)*.
     - **Error Presentation Owner:** the error interceptor shows every API failure (`isSuccess: false` and HTTP errors). The feature restores its state and shows no second toast/dialog; only inline messages use `X-Skip-Error-Interceptor` + `apiErrorMessage` *(UI 22, Master 5)*. Composed reads reuse `composedReadErrorMessage` for declared safe ordinary Error messages and HTTP Result bodies; do not duplicate that branch or expose arbitrary exception diagnostics.
   - **Tier 2: Component-Level Local Signals (`loadingList()`, `saving()`):**
     - Local signals bind directly to UI components for contextual feedback:
       - `[loading]="loadingList()"` on `app-data-table` and search buttons.
       - `[saving]="saving()"` on `app-editor-dialog`.
4. **Primary Action Busy State:** Use `[loading]` (NOT `[busy]`) for button spinner states:
   ```html
   <app-primary-action-button
     type="submit"
     [label]="'general.search' | translate"
     icon="bi bi-search"
     [loading]="loadingList()"
   />
   ```
5. **One live list request** *(UI 28)*: list search, paging and refresh go through one trigger stream with `switchMap`, so a new query cancels the previous request and a late response never overwrites a newer one. Dependent lookups (vehicle → card, customer → contracts) use a `Subject` + `switchMap` too.
   Independent editor bootstrap HTTP reads (UI28) may use forkJoin for navigation
   keys and fresh detail; validate both envelopes/identities before opening and
   hydrate the typed initial detail once. Preserve frozen keys, limits, Retry,
   navigation and cancellation; never parallelize same-DbContext queries or use
   stale list fields as detail. BE5 allows read-only text identity validation to
   share successful same-request options; writes still validate freshly.
   Deferred print/UI work also uses `timer(0).pipe(takeUntilDestroyed(destroyRef))`, or native timer/frame cancellation registered with `onDestroy`; retain detail/readiness/identity guards. Installed Angular17.3.12 has no `DestroyRef.destroyed` property; verify installed declarations rather than assuming a newer API *(UI28)*.
6. **Sidebar disclosure has one owner** *(UI 1, Authenticated-shell sidebar disclosure)*: SidebarMenuComponent owns both group levels through isGroupOpen/toggleGroup and the common groupHeader template. Route highlighting never writes show; remove sidebar Metronic group triggers and stop disclosure/pin propagation. User overrides win over route/search defaults until node rebuild; opening closes siblings. Keep native buttons/aria-expanded, existing menu classes and theme tokens. Other menus/drawer/minimize/storage keep their owners. Runtime acceptance remains owner-pending.
7. **Persistent desktop sidebar minimize** *(UI1, Desktop sidebar minimize — explicit control; owner2026-10-14)*: SidebarComponent clears the legacy desktop hover attribute, including cached hover=true configs; Light/Dark sidebar defaults use hoverable=false. SidebarLogo uses one native button to toggle the existing body minimize/collapse attribute, with translated labels, aria-expanded/controls and icon state from that same state. Remove its data-kt-toggle registration to prevent double toggling; retain other plugins, widths/RTL offset/transition, mobile drawer, menu disclosure/pins and storage. No Import-only opt-in, per-screen margins, width/z-index or resize-timer workaround. Check pointer-left-over-button, Enter/Space, route changes, wide previews and both sides992px in themes/directions; source-only owner acceptance pending.

---

Inline detail feedback *(UI2/22, 2026-10-06)*: use optional `BaseService.getById<T>(id, { skipErrorInterceptor: true })` when the feature owns inline detail feedback. Reuse `apiErrorMessage` and handle both failure channels; omitted options preserve global feedback. Lease Deposit payment-method context adopts this shared owner. Source-only, owner failure/retry acceptance pending.

Common settings inline feedback *(UI2/22, 2026-10-09)*: optional
`CommonSettingsService.getMySetting<T>({ skipErrorInterceptor: true })` reuses
the existing error-suppression header when a lookup batch owns inline failures
and Retry. Omitted options preserve global feedback. Rental Agreement Deposit
passes settings-owned currency labels/decimals to shared `amountInWords`,
retaining entered values on failure; no currency or financial default is added.

Feedback public contract *(UI22/1)*: `StateMessageKind` is loading/empty/error,
so a failed lookup uses error; a real advisory retains the shared warning alert.
Register StateMessage/FieldError in each standalone consumer. Removing duplicate
API success toasts does not remove existing non-API info notices: retain their
one global info toast and explicit MessageService injection if still used.

Currency policy cache *(UI2)*: successful typed CurrencyService Create/Update/Delete
calls the existing FinancialNumberPolicyService.invalidate(); the next load reads
the authoritative server policy. Existing load(force) callers keep their semantics.
Do not copy invalidation into editors/interceptors, reload policy during Save, or
alter rounding/precision. Failure retains cached policy and the draft; source-only,
owner before/after read acceptance pending.

### 6.1 Read-only reports *(UI 2, 5, 6, 8, 13, 16, 20, 21, 22; BE 17)*
Accounts report selectors cache translated mutable options by source-array identity/current language (UI16). Large descriptors may opt into public virtualScroll with shared38px body-overlay rows matching scroller size; full filtering/selection/clear remains, other selectors stay nonvirtual. Optional inlineFilterActions (UI20, false default) reuses Journal's shared grid/caption with existing actions; non-adopters retain direct toolbar. BudgetVariance adopts both under owner correction. No feature CSS/private widget calls or financial changes; actual dropdown runtime cause/visual acceptance pending.

- Shared output actions (UI20/24): Export and Print use one global light-blue style through `sigma-output-action`/report output selectors: 34px height, centered inline-flex, 6px gap, 10px padding, 1px solid 4px-radius border, 0.75rem/700 text and no shadow. Reuse primary/surface, primary/strong-border and balance-text tokens with theme-aware hover/focus; keep labels, loading, disabled state, RTL and print behavior unchanged. Native output glyph matching is a compatibility path; features declare no output palette.
- Every real tree report exposes shared Expand All / Collapse All (UI6/20). ReportTreeActions uses ReportActions/native translated secondary buttons, wrapping/RTL/themes and no-print. DataTable shows it automatically for hierarchy, disables during loading/no branches, omits during print; bulk commands visit all supplied descendants, initialize identities before collapse and rebuild once/scroll to start. Per-row toggles and printAllRows screen state remain; complete print/export never follow screen collapse. Existing shared dynamic Reports adapter recursively clones existing TreeNodes for the same controls, repeated actions work after manual toggles and new source arrays reset override; its tree body remains compatibility-only for this bounded action addition. No flat/indent-only toolbar, API call, confirmation, source-row mutation or UI financial calculation. Source-only acceptance pending.

- Final-column width (UI6/20): report panels provide public --sigma-data-table-scrollbar-gutter:auto and document frames use auto; shared row wrappers retain stable fallback elsewhere. Remove permanently reserved empty scrollbar strips while preserving native scrollbars on actual overflow, column minima, fill/flow/paging/print owners. Frame/card edges match; actual classic scrollbars still consume their required viewport space. No hidden scrollbar, negative margin or fixed pixel width compensation. Source-only visual acceptance pending.

- Report table/result frames fill the same available width and logical edges as title/filter/summary regions (UI20, §2.4). Existing direct sigma-list-table wrappers use the global report-context zero inset; independent section columns keep their own container width and wide rows scroll internally. Accounts family already stretches its regions; Journal uses this shared correction. Preserve paging, totals, print/export scope; source-only visual acceptance pending.

- Owner-requested inline report actions use global `sigma-report-filter-panel--inline` with the stable modifier (UI20), feature-owned filter column count plus auto actions, three columns below1250px/one below640px. Shrinking fields/native inputs and single-line accessible labels retain bounds; an action field with aria-hidden invisible shared caption reserves label geometry. Existing ReportActions/action-group and exact34px control-height token align buttons to inputs; FieldError reserves validated feedback (UI19). Journal opts in with five filters/four actions, other strips keep defaults. No feature CSS; source-only visual acceptance pending.
- Wide inline report fields use shared `sigma-report-filter-field--wide` (UI20): span2, count the extra track in `--sigma-report-filter-columns`, reset to auto below640px. Report1250/640 breakpoints and auto actions remain. Reuse shared owner rather than feature widths; source-only visual/RTL/input acceptance pending.
- Inline report strips needing content-sized choices/checkboxes can set the shared `--sigma-report-filter-template` (UI20), including a dedicated action track when actions stay inline. Default count-based columns and1250/640 fallbacks remain. Use max-content for short groups and minmax(0, weighted-fr) for editable fields/wrapping actions; remove span2 when the template owns date width. StaffStatement uses Date2.5/Staff1.5/ReportType-content/SubLedger1.5/inactive-content; later owner instruction spans all six actions on a separate row using existing sigma-field--full and removes their inline-only caption. No feature CSS or non-adopter change; source-only visual/RTL acceptance pending.

- Stable report filters opt into global `sigma-report-filter-panel--stable` (UI20): top-align field wrappers and bound dropdown/calendar hosts/roots/labels to their existing field width. Accounts `stableFilterLayout` selects it and reserves date/required feedback through existing FieldError string translation keys (UI19). Preserve report flex basis/bounds/wrapping/narrow breakpoint, checkbox/actions, overlays and business behavior; Ledger adopts it, other consumers retain defaults. Source-only, visual/runtime acceptance pending.

- Accounts-local report composition defaults to bounded panes; optional document mode remains UI20's complete-flow alternative. The owner's CashFlow accounting/Tree View requests supersede its tab/card experiment: one full-width fill table with three default-expanded activity roots, complete account/subtotal children, a root-level final total and common78%/22% columns. Roots show authoritative net amounts when collapsed; children reflect response sections, not invented account relationships. UI6 optional hierarchy.activateEnabled limits ledger links to real accounts while shared expansion/14px logical indent/printAllRows retain keyboard/RTL and complete descendants. rowTone/column width/shared numeric class own accounting appearance. Five figures remain backend-owned; NetIncome uses its producer line/fallback. Explicit ES2018-compatible Excel traversal retains original complete arrays/headers independently of collapse. Other reports keep defaults. Source-only; owner visual acceptance pending.

- Repeated report families may share a typed feature-family lifecycle/template while each consumer owns columns, filters, lookups and totals (UI20). Reuse canonical visual owners and prove the frozen complete-response flag/count before output. Adapt DataTable pagination `pageSize` to `resolveListPaging`'s `rows` input before state writes. StockReports adopts this composition for eight consumers; formulas/proxies remain feature-owned and runtime/visual acceptance stays pending.

- Dialog reports opt into `sigma-report-print-dialog` and shared session `print({bodyClasses:['sigma-dialog-print']})`; shared styles isolate portal content and release bounds, `sigma-print-flow` remains on bounded report layers, and Print uses the fixed `editorDialogHint` footer. Session options preserve no-argument consumers and restore the signal before caller afterPrint. No private body lifecycle *(UI21)*.

- In new/reviewed tabbed reports, the Tab caption is the sole on-screen section title when it identifies the table. Keep repeated headings only for print using existing `d-none d-print-block` utilities, preserve the main feature/column headings and panel aria-labelledby, and keep all applicable panels mounted for full print. Supplier Statement adopts this; no out-of-scope bulk rewrite *(UI20)*.

- Complete the required report evidence table (UI 20) from actual request/backend source before and after implementation. Record page-size clamp/slicing, returned counts and totals scope; Result<T> can contain paged rows. Use server counts for server paging, or prove all rows collected before local paging. Print/Excel cover the same frozen applied-filter scope, not just the first response page. Use one confirmed complete-response request/opt-in when available, preserving other callers' paged defaults; otherwise adapt confirmed paged wrappers to fetchAllPages rather than increasing a clamped size or copying a loop (UI 6/8/21; BE 17).
- Trace conditional/expanded formControlName fields to their actual FormGroup and typed controls; keep one Search submit contract. Disable/enable reactive filters through the form API with emitEvent=false, invalidate stale output on edits (or explicitly identify retained applied filters), and reject invalid controls including the required single-date mask recipe. Verify one inline/global failure owner and its header, both failure channels, lookup recovery and current-language labels (UI 17/20/22/23/28).
- For custom aging buckets, freeze off/default and on/custom semantics; require positive strictly increasing integer end-days on both frontend/API boundaries. The applied effective boundaries label grid, totals, print and Excel consistently; do not keep default labels or hidden custom thresholds when off. Exact defaults/formulas stay feature-owned (UI 20; BE 17).
- For allocation-based aging, trace actual ledger writers and matching links. Reconcile eligible opposite-signed target/source capacities before bucketing, preserving ledger net; never subtract informational matching again from debit-credit net. Apply one cutoff to allocation dates and both actual live/posted/non-voided AR sides, resolve header sources deterministically, and fail closed when control-account mapping is missing. Exact column meanings and materialization deviations stay in the feature contract; source arithmetic does not replace owner accounting/runtime acceptance (BE 17).
- Use the shared opt-in bounded report shell (`sigma-route-host`, `section[appReportPage].sigma-report-page--fill`, `sigma-report-panel`) and mark bounded layers `sigma-print-flow`. Every report table in new or reviewed work uses typed `app-data-table` columns; existing reports migrate when their report is in scope. Preserve transport: complete responses use `lazy=false`, while frozen paged responses keep `lazy=true`, server paging and authoritative counts. For a complete response, full-document flow may use one outer `sigma-report-table-frame` with each grid `scrollable=false`; bounded reports with independently visible sections give each section an overflow-hidden layout boundary and a shared grid row viewport (`fill=true`, `scrollable=true`). This includes complete all-row panes with `paginator=false` and complete panes with local pagination; summary/detail panes may own separate row scroll regions. Do not introduce CRUD paging or a feature viewport-height subtraction.
- Canonical sigma-report-panel titles match filter card paint and width by default after the owner's general request (2026-10-03, UI3/4/20). Direct title margin is -8px 0 16px; filter inline margins are zero, preserving block spacing and responsive panel padding. Existing sigma-report-panel--aligned-title remains a compatible alias; no per-screen opt-in, fixed width or feature-local card/margin override is needed. This supersedes the earlier three-report scoped alignment rule.
- If a report needs a capability the shared grid does not yet provide, extend the shared component in that report's scoped implementation while preserving the report's hierarchy and semantics. Do not flatten hierarchical data or silently authorize a feature-owned table. The former native report table classes remain compatibility styles for out-of-scope consumers until their review; new/reviewed reports use shared inputs and tokens. Shared global styles own themed sticky heads, dense rows, print release/surfaces and the documented table variables (UI 6/20).
- Follow Up's owner-approved Details/Summary tabs reuse the workspace report-tab contract below (UI 20/21), with both sections stretched to the report panel's full content width through the existing public `sigma-route-host--full-width` placement. This supersedes the earlier feature-owned 520px and 960px Summary limits; the public shared-grid minimum width owns internal horizontal overflow without page scroll. Summary remains unpaginated; Details binds its complete array to the shared controlled local paginator with the shared default 15 rows and 10/15/20/50/100 options (UI6 owner amendment supersedes 20). Details retains page and size across tabs; valid Search, filter edits, Reset and drill-down reset its offset while preserving size. The shared `app-summary-cards` component presents four server-owned additive operational KPI cards in equal auto-fit columns with `[minCardWidth]="220"`: four columns when the container permits, then three, two or one as it narrows. Use the comfortable Dashboard KPI shape (14px/16px padding, 44px icon with 14% accent wash, 10px radius, 12px gap, 1.6rem value, 9% accent wash and 3px logical-start stripe) through global Sigma/Bootstrap tokens; compact density remains available for content-constrained screens. The approved primary accent is passed through the typed descriptor; no feature-only emphasis variant is introduced. The shared `sigma-report-user-action` owns the quiet secondary user action and inherited hover/focus/busy behavior; null/blank groups remain label-only. Comparison bars remain custom shared-grid cells; feature placement uses only public 88px/7px bar dimensions and a public 175px Summary count column. A translated scope/reference-date row and balanced caption row sit above the grid. Both complete arrays stay mounted; ordinary Excel follows the active complete section/current columns and exports all filtered Details rows, while full print keeps KPI values/captions/reference text and both arrays, hides decorative icon tiles, releases pagination/scrolling, then restores page, size, selected tab and form state. Follow Up opts into `sigma-report-panel--aligned-title`. Keep busy, printing and filter-invalidation gates. Metric formulas, scopes and reference-date semantics remain in the frozen Follow Up contract/review and are not universal report defaults. No shared disclosure or feature tab/card palette is introduced.
- Use typed `app-data-table` columns with `lazy=false` for proven complete report responses; a frozen paged response keeps `lazy=true` and its server counts (UI 5/6/20). Use `scrollable=false` for complete full-document flow, or `fill=true`/`scrollable=true` with an overflow-hidden section boundary when independent bounded panes own their row viewports. Customer Statement uses fill=true/scrollable=!printing(); Follow Up uses an unpaginated complete Summary pane and a complete Details pane with controlled local pagination. Keep complete arrays only where proven; no new requests/sort/actions/selection. Local paging uses independent controlled first/rows and counts, shared default size/options and resolveListPaging before writes. Tabs keep pages/sizes; filters/valid Search/Refresh reset offsets and retain sizes. Shared flow/print rules own internal wrappers/surfaces (UI 21); widths use public variables. Existing list defaults remain.
- For reviewed locally paginated reports, use ReportPrintService.createSession(DestroyRef) and its readonly printing signal (UI 21): bind every applicable grid paginator/scrollable to !printing, disable filters during preparation and ignore paging events. The shared owner guards repeat clicks, schedules one render frame, restores afterPrint/false result and cancels a pending frame on destroy. Preserve controlled page/size and complete response arrays for totals/export; CSS alone cannot print sliced-out rows. Existing print(options) callers remain compatible.
- Shared DataTable consumes changed PrimeNG firstChange offsets for local sorting and emits its typed pagination event (UI 6). Local sorts can reset the first page without onPage; controlled consumer state must follow that reset. Lazy/server grids and paginator=false print preparation keep their existing owners. Consumers reconcile through resolveListPaging; no feature PrimeNG access.
- Ordinary Excel in a tabbed report follows the selected section's complete array/current grid columns through dataTableExportRows with click-time translation (UI 8/20). Availability uses that section's count, not ledger length; file name identifies section/mode. Local paging never limits rows. Specialized grouped exports use the selected applicable collection and its confirmed formula; hide/disable where required fields do not exist, never silently fall back to the first tab. Full-report print remains independent of selection (UI 21).
- Owner-approved section tabs reuse `app-editor-tabs appearance="workspace"` outside the results area (UI 13/20). Preserve mode controls/section conditions; filter changes select the primary section and same-filter Refresh retains selection. Tab selection resets the actual row viewport without moving keyboard focus or making requests: flow reports use their frame; a filling grid uses public DataTableComponent.scrollToStart() (UI 6), never PrimeNG internals. Keep mode-applicable panels rendered and hide inactive ones only in screen-media CSS; mark tabs no-print and return print panels to document flow so UI 21 prints every applicable section.
- If the owner removes a duplicate section heading already supplied by the tab label, hide the heading only in screen media, retain the panel's tab-based accessible name and preserve that heading in full-report print where navigation is hidden (UI 20/21).
- Match Trial Balance for panel/title spacing, header text/surface/rules, density and accounting values. The shared `app-data-table` owns row surfaces and hover/focus treatment, including any shared zebra behavior; do not add, remove or override that palette per report. Use existing report action variants for Refresh/Reset/Print/Excel; shared primary Search retains real submit semantics with compact report context. `sigma-report-action-group` wraps like the reference button group.
- Report export buttons use the shared neutral secondary variant, global text/strong-border/soft-surface tokens and quiet primary hover/focus (UI 20/24/25). Icons inherit the foreground. Do not add Excel-green or feature palettes; theme tokens must preserve interactive states without a later dark base overriding them.
- Report PrimeNG radio groups opt into `sigma-report-filter-choice` on their labelled radiogroup when adopting Sigma's shared accent (UI20/24). Global styles own selected/hover/focus through primary/primary-hover/control-focus-ring tokens; retain existing controls, associated labels, disabled states and form values. No feature palette/deep selectors or bulk recolouring of other groups. Row grouping/spacing choices stay in the feature contract.
- A required lookup with inline recovery reuses `getSelectList({ skipErrorInterceptor: true })`, local loading, both failure channels and a retry action; ordinary lookups retain the global interceptor owner.
- Default dates through `currentMonthRange` unless an explicit owner contract requires empty defaults (UI 20: Customer Statement exception). Validate/serialize through `parseDateRange`. An owner-requested empty preview shows structural headers/empty messages without fake response values or an automatic report request; print/export stay success-gated. Disable the reactive form during the report request; invalidate output when filters change. Use the existing shared `formatMoney`/MoneyPipe monetary owner and build translated export headers at click time.

### 6.2 Shared step validation *(UI12,19,28; BE8)*

- Unique fields use `updateOn:'blur'` and shared `uniqueFieldValidator` with the existing save normalization/edit identity. Configure only source-supported business keys; View skips checks and initial silent hydration must not start pending checks. Cache completed available/taken answers, invalidate changed values, share pending checks, cancel stale/destruction work, and block/retry failures using shared FieldError checking/uniqueCheckFailed feedback.
- Every forward route and Save awaits `settleStepValidation`: commit focused blur edits (including Enter), await pending children, reuse unchanged checks and retry failures. A local validating busy state blocks duplicate actions/content mutation without disabling pending controls, then releases before touched/spec/focus feedback. Next checks the step, Save the whole form; Back/View skip. Keep validation suppressed during silent failed-save form restore.
- Typed CheckUnique is an authenticated advisory query with no success/error toast; final backend Save remains authoritative. Legacy step consumers may adopt the gate in a scoped compatibility fix; full reviews still adopt the canonical shell.

* **Scalar and custom-query helpers (UI19/2):** consume shared finiteNumberValidator/guidValueValidator/int32ValueValidator for optional transport syntax, keeping required/business bounds separate and preserving signed decimals/Guid.Empty. Actual Int32 values use optional signed bounds -2147483648..2147483647 with shared number feedback; string mileage remains text, never Number-coerced. Use toQueryParams for actual top-level custom controller parameters; toListParams remains generic Filters serialization. No invented GUID/TimeSpan generic filters.

## 7. Modal Dialogs & Editors (`app-editor-dialog`) *(UI 1, 3, 13, 15, 17, 24)*

Conditional footer projection *(UI13, 2026-10-22)*: a conditional
`editorDialogHint` is the only root of its own `@if`, outside multi-root body
branches. Preserve visibility; never project the form into the hint slot or
suppress NG8011. Fleet/ServiceLog is the Angular18 repair example.

Optional workflow footer actions *(UI13/24, 2026-10-17)*: pass readonly typed
`EditorDialogFooterAction[]` through `footerActions` (default empty) and handle
stable ids from `footerActionRequested`. Shared shell places translated
label/icon/disabled actions before Cancel/Close with existing secondary styling
and Save disabling. Features own Previous/Save-and-Next behavior, validation,
dirty-discard and independent busy guards. Never repurpose Save-and-Print or copy
footer markup/CSS. Existing consumers keep their empty default; owner
keyboard/responsive/RTL/theme acceptance remains pending.
Shared actions wrap with min-width0/end alignment and existing8px gap. Mirror
Previous/Next chevrons through the global app-editor-dialog body-overlay owner,
not host ancestry, because the shell appends to body (UI13/24/25).

- **Pending discard gate (UI10):** return a deferred confirmation Observable; at subscription, recheck captured identity, visibility and busy state, returning of(false) for stale/duplicate decisions. Freeze editable reactive controls without value emissions; finalize releases the pending flag and restores the prior editable state only for the same visible editor outside save/upload cleanup. Cancel preserves values/dirty state and intentionally disabled controls. Calling the guard without subscription opens nothing. Reuse the existing confirmation service/local identity for route/X/Cancel/Escape; no new state framework.
- **Pending form-state owner (UI10):** use `freezeFormState(form, destroyRef)` from `shared/utils/form-state.ts`; its idempotent callback restores originally disabled subtrees without value emissions and skips a destroyed editor. The consumer retains identity/pending/save/upload cleanup gates. Reviewed routed exits share one deferred CanDeactivate decision; successful Save bypasses discard. Source-only, owner interaction/compilation pending.
- **Accepted discard ordering (UI10, "Accepted decision ordering"):** confirmation emits before finalize clears its pending flag. After an accepted decision, the same visible editor's close subscriber checks independent save/load/parsing gates, not its own still-pending confirmation flag; deferred entry still rejects duplicates and finalize still restores cancellation state. Deduction record/import adopt it; no bulk change to other consumers, interaction acceptance pending.

- Atomic multipart attachment actions reuse `app-file-field [selectionOnly]="true"` with `FormControl<File|null>` and shared FileUploadService validation; the endpoint retains storage/persistence/rollback ownership, with no Media/tracker mutation. Stored-path mode keeps its editor tracker. Saved-file actions reuse `app-file-link [path]`, same API-origin HTTP(S) resolution and no action for invalid/missing paths. Read DTOs carry actual paths and historical files remain separate from upload eligibility *(UI18)*.

0. **Modal or routed page (D4-2)** *(UI 13)*: fields only, or one small child list without totals → modal; two or more child collections, totals, or approval/posting → routed page with the shared editor shell (§2.5). Job, quotations, invoices, bills, purchase orders, GRNs and vouchers are routed pages.
1. **Shell Standard:** Use `app-editor-dialog` for Add/Edit/View modals.
2. **View-Only Mode Invariant:** When a dialog is strictly a read-only viewer (`mode="view"`), always bind `[primaryActionVisible]="false"`. Otherwise, `app-editor-dialog` defaults to `true` and renders an unwanted `Edit` action button in the footer.
3. **Tab Navigation (`app-editor-tabs`):**
   - Header actions (e.g. `[PRINT DOCUMENTS]`) share the horizontal row with `<app-editor-tabs>` via flex layout (`justify-content: space-between`).
   - Use `appearance="workspace"` for dense, rounded tab strips. The shared component owns the tile colours (inactive and active) in light **and dark** *(UI 13)*; do not restyle tabs or add page tokens only to darken them.
   - Optional `EditorTab.count` carries a feature-owned nonnegative row count; zero is visible, omission preserves existing tabs. Use computed tabs for live counts; the shared component owns badge presentation (UI 13).
   - **Theme selectors in an encapsulated component** *(UI 25)*: use `:host-context([data-bs-theme='dark'])`. A plain `[data-bs-theme='dark'] .x` prefix gets the component attribute and never matches (the cause of the light tab strip, UI backlog 38).
4. **Dialog Body Scroll:** the dialog body is the dialog's single scroll owner (§2.3). The header and footer stay fixed; `app-editor-dialog` already bounds the dialog to `calc(100dvh - 24px)`.
   The shared content layers pass a shrinking flex column (`min-height: 0`) to `sigma-editor-form` → `sigma-editor-body` → `sigma-editor-scroll`; fix a broken chain in the shared shell, never add feature viewport arithmetic *(UI 13)*.
4a. **Dialog Body Padding** *(UI 13, "Body padding")*: set `[contentPadded]="true"` on every new or refactored `app-editor-dialog` so the body lines up with the header and footer. Do not pad the feature content wrapper or restate the value in feature SCSS. Leave it off only for a full-bleed body (tab strip or edge-to-edge table). When touching an older editor that pads its own wrapper, switch it to `[contentPadded]` and remove that padding (UI backlog 36).
4b. **Addressable close focus** *(UI13, "Addressable initial close focus"; UI27)*: optional default-empty `closeButtonId` targets the shared header close button. With `focusOnShow=false`, a visible modal session may handle `shown` through shared `focusField(id, { openOverlay:false })` to enter the dialog without opening a calendar. Use a unique id, preserve trap/Escape/closeDisabled/dirty gates, and add no feature DOM query or private button. Deduction record/import dialogs adopt it; existing consumers remain unchanged and keyboard/runtime acceptance stays owner-pending.
5. **Solid-button glyphs** *(UI 3, 20)*: a solid action button (Create, the dialog primary action, a report action) shows a white glyph in light and dark. The shared button components own it; a feature adds no icon colour rule.
7. **Date Controls in Editors & Modals:**
   - Prohibit native `<input type="date">`. Use `<p-datepicker>` with no icon (§3.3), typeable, with `keepInvalid`:
     ```html
     <p-datepicker
       #dateCal
       inputId="field-date"
       formControlName="date"
       dateFormat="dd/mm/yy"
       [readonlyInput]="false"
       [keepInvalid]="true"
       [showButtonBar]="true"
       [showOnFocus]="false"
       (click)="dateCal.showOverlay()"
       placeholder="{{ 'feature.date' | translate }}"
       panelStyleClass="sigma-datepicker-panel"
       styleClass="w-100"
       appendTo="body"
     />
     ```
   - **Modal Auto-open Prevention Invariant:**
     - On `<app-editor-dialog>`: set `[focusOnShow]="false"` so the dialog does not automatically force-focus the first element upon opening.
     - On `<p-datepicker>`: set `[showOnFocus]="false"` and `(click)="dateCal.showOverlay()"`. This prevents the calendar popup from jumping open in the user's face immediately when the dialog appears, ensuring it opens ONLY when the user clicks the field. Keyboard users can type the date directly because the input is typeable; the owner verifies this in the acceptance pass.
   - Form control typed as `Date | string | null`: `date: this.fb.control<Date | string | null>(new Date(), [Validators.required])`.
   - In `populateForm`, hydrate saved calendar days with `toPickerDate(dto.date)`; keep date-time controls on their wall-clock contract (UI17). Shared local construction uses `setFullYear` to retain years0001..0099, with four-digit transport/display; do not reintroduce the multi-argument Date constructor's1900 offset. Existing two-digit manual-year compatibility and year-zero rejection remain.
   - In `save()`: send `toApiDate(val.date)` (`yyyy-MM-dd`) or `toApiDateTime(val.date)` (`yyyy-MM-ddTHH:mm:ss`, no `Z`) from `shared/utils/date-utils.ts`; never `toISOString()`, which shifts the value by the UTC offset *(UI 17)*. `parseDateValue()` returns a normalized date string; `toPickerDate()` supplies the picker `Date`.

---

* **Modal reference accuracy (UI13/catalog01):** current Fleet Vehicle/VehicleService editors are routed. Use shared EditorDialog/EditorTabs declarations and UI13 controlled composition for type01; Job remains the list reference. Verify the selected reference's actual shape before claiming conformance.

* **Shared branch settings consumer (UI13; Master5):** RentalTariff, LeaseTariff
  and TariffCard reuse BranchTariffSettingsComponent for the existing tenant-wide
  branch/percentage workflow. Keep the public 720px width/bounded560px height,
  padded flex body, fill/sticky UI14 table and Add toolbar even with zero saved
  rows. Failed reads block partial Save and offer Retry; invalid inputs retain
  Save for validation. Delegate route/X/Cancel/Escape to its deferred discard
  decision, with read/Save/confirmation gates and frozen draft state. Do not
  duplicate its API/form implementation or infer per-module settings. Current
  consumer evidence only; business/API invariants remain in the feature freeze.

**Shared mock form assistance (UI13; owner instruction, 2026-10-13):** reuse
`MockDataFormsModule`/`appMockData` on supported editable reactive form roots.
Keep screen controls, handlers, child Add actions and manual Save. Exclude
filters/search/reports/authentication/secrets/View/disabled forms and unsupported
widgets. Send metadata/route patterns/opaque choices only; never current values,
record ids, secrets or lookup labels. Shared confirmation + frozen prior state +
bounded dialog preview own the pending decision. Cancel/teardown releases it;
Apply rechecks form/control/value identities, live options and validators, uses
public events and marks dirty/touched, with skipped-field feedback. Preserve
native temporal strings vs PrimeNG local Date values (UI17). Source-only adoption
inventory and the API Key parent-shell compatibility exception remain in the
feature artifacts; runtime/visual checks are owner-pending.

**Mock presentation preferences (UI13/BE16):** global tenant Settings flags
default true; nullable omitted flags/blank key preserve existing settings, and
prefs-only Save is allowed. True database Boolean defaults require the installed
EF HasSentinel(true) to retain explicit false inserts. FormSection's shared header
action generates only its scoped rendered controls; one fallback heading remains
without visible shared sections. Preserve projected actions, responsive wrapping,
overwrite confirmation/pending cancellation/stale checks/manual Save. Preview
off applies to draft after generation without a loading/preview modal. The shared
heading action shows loading and Cancel; readiness is separate from visibility.
Frozen controls and root capture click/submit gates preserve pending Save/row
behavior, exempting mock Cancel and removing listeners on destruction (UI13).
Load/cache per auth-token session with
inline Retry and stale-read cancellation; failed-read key recovery omits unknown
flags before reloading. No new permission or screen-specific action copies.
The third default-true ShowConfirmation flag controls only the mock generator's
overwrite confirmation, captured at Generate start independently of preview.
False bypasses it; pending cancel/stale/manual Save and all discard/domain
confirmations stay owned by their existing flows. Nullable omitted writes and
old reads default/preserve it, including failed-read key replacement (UI13/BE16).
EditableCollectionTable also registers a visible heading scope and composes the
same action (UI14). Add rows using the existing Add Credit Card/Add Document path
before generation; empty collections expose no mock action. Show it only for
supported rendered controls and hide it after removing the last row. Generate
never creates rows; owner clarification removes preparation callbacks/empty-row
bypasses. Preserve View/prerequisite/pending gates and Cancel/failure values/row
count. Owner-requested mockDataPaymentField marks native cardNumber/cvv inputs
only; matching named/direct controls permit test digit strings16/3, including a
masked cvv input. Unmarked payment inputs and ordinary secrets/passwords stay
excluded. Metadata-only strings preserve leading zeros; manual validators and
Save remain. BE18 schema/example/prompt/strict digits validation keeps bounded
repair/no partial apply; no new DTO/schema (UI13/14/BE18).
Credit Cards width adjustments use existing UI14 column width inputs, not cell
CSS: Individual/Company select CVV76/IsDefault80/NameOnCard240/BankName220px with
1280px shared scroll frame, retaining controls/order/validation/theme/RTL.

## 8. Backend Contracts & API Conventions (.NET) *(BE 5–9, 12–18)*

Cross-namespace compiler gate *(BE1/18, owner evidence2026-10-21)*: for each
new entity/navigation type, check its declaring namespace and the **referencing
project's** own using/global-using set; add a file-level `using` at the top when
absent. Do not repeat fully qualified names beside properties; qualify a type
only for a genuine name collision. Triage compiler lists from the first failing project, fix its
`CS0246` roots, then reassess downstream `CS1061`/`CS0117` after the owner
rebuilds. Business/DataAccess global usings do not reach Helpers. Source-only
checks never certify a successful compile.

Safe read-failure context *(BE18, 2026-10-19)*: existing HTTP error diagnostics
may add numeric SQL Number/State/Class and an explicitly typed/defined server
read-stage enum from exception metadata. Never append arbitrary Data strings,
provider messages, SQL, values or credentials. Stamp/rethrow preserves the same
exception/stack; cancellation propagates. Dashboard covers24 read boundaries.
The owner's observed500 remains unresolved until its next code/stage evidence;
source diagnostics are not a verified root-cause fix.

Automatic HTTP error history *(BE18)*: when owner-requested, use an append-only
operational event and explicit authenticated read contracts, separate from CRUD
and successful-save auditing. Capture authenticated positive-tenant unexpected
exceptions/returned5xx once, excluding known business conflicts, aborted requests
and reader recursion. Save in a fresh scoped context with ambient transaction
suppression, bounded timeout and one implicit EF save; persistence failure
preserves the original response/error and fallback logs type-only metadata.
Store UTC/backend Stopwatch duration and bounded trusted request metadata;
missing client name stays null. Method/route-template/status/trace context and
type/method-only diagnostics exclude raw messages/stacks/source paths/SQL/body/
query/credentials. Safe localized500 before response start, otherwise rethrow.
Use tenant QueryReport, lean projections and stable cutoff paging/full export.
No claim of background/global/history coverage; owner migration/build/runtime
acceptance remains pending.

Lookup identity provenance (UI16/BE8): inspect the actual select query and allowed
entity subtypes, then match picker ids, typed payload, EF principal and backend
validation. Generic live/tenant FK checks do not enforce subtype eligibility.
Customer/GetSelect returns Individual/Company Partner ids despite its controller
name; legacy CustomerRequest used Customer:PersonBase. Never cast/relabel ids to
hide a mismatch. Persisted FK changes require recorded owner legacy-data evidence
and a reported migration; no bulk consumer change follows from this example.

### 8.1 Backend Service Patterns *(BE "The five patterns", 13–17)*
* **Lean detail responses (BE3/5):** `IService`, `Service` and `SiGmaControllerBase` accept `TDetailVm : class`. Reuse `LeanDetailBaseVm` for matching int Id and `NumberedDetailBaseVm` for Id + nullable string No, in Helpers/ViewModelsBases/Detail; keep feature-specific defaults/attributes and incompatible No (such as TaxAdvance's nonnullable initialized No) local over the Id-only base. Neither base carries Name/tenant/audit/GUID/flags. Keep displayed state, labels, owned children and formulas; compare the entire flattened property contract. Do not shadow inherited members, add polymorphic JSON metadata/base maps or tighten generic constraints. Existing heavy detail hierarchy and specialized invoice/settings constraints remain compatible; owner's shared-reuse approval is applied to 48 current standalone DTOs, future adoption remains scoped. No duplicated generic read method or endpoint/entity/write change. This supersedes explicit-only identity declarations (BE3, 2026-10-08).
Every backend service follows one of the five patterns in `SIGMA_BACKEND_PATTERNS.md`: four write patterns below plus Pattern 5 for read-only reports. Pick the simplest one that fits. Bespoke persistence logic, manual diffing loops, and ad-hoc patterns are prohibited.

1. **Pattern 1 — Normal Entity (الكيان العادي):**
   - **Canonical Reference:** `Services/BranchService.cs`
   - **Applicability:** Single independent entity performing standard CRUD (`Add`, `Update`, `Detail`, `GetManyAsync` / `List`, `Select`, `Delete`).
   - **Strict Rules:** Inherits `Service<TAdd, TUpdate, TDetail, TList, DbContext, TEntity>`. Overrides strictly limited to: duplicate checks in `Add`/`Update` (`ExistsAsync`, on the trimmed key), reference checks before `RemoveAsync`, and the list hooks `ApplyListFilters` / `ApplyListOrder` (D5-1, no `GetManyAsync` override). Failures through `BusinessFailure(key, statusCode?)` with en/ar resx keys. Add, Update and Remove otherwise come from the base; owned children are deleted with `RemoveWithChildrenAsync` *(BE 5, 8, 13)*.

2. **Pattern 2 — Master-Detail, No Financial Effect (رئيسي - تفاصيل بدون أثر مالي):**
   - **Canonical Reference:** `Services/VouchersServices/PurchaseOrderService.cs` (e.g. Work Order, Purchase Order; FK checks and delete fixed 2026-10-01).
   - **Applicability:** Parent header owning child detail rows saved as a single aggregate graph; no journal vouchers, no payment allocations.
   - **Strict Execution Order in `AddAsync` and `UpdateAsync`:**
     1. Enforce minimum child details (`vm.Items?.Any() != true`).
     2. Validate all header FKs via `ExistsAsync`.
     3. Validate every child reference with the base `AllExistAsync<T>(ids)` (distinct ids, tenant-scoped; never `ExistsAsync(x => ids.Contains(x.Id))`, which passes when one id exists).
     4. Load existing aggregate with children tracked: `Query<T>(e => e.Id == vm.Id, null, true, false, e => e.Items).FirstOrDefaultAsync()`.
     5. Map graph via AutoMapper: `Mapper.Map(vm, entity)`.
     6. Authoritative server-side calculation: line totals (`AmountPlusTax`) and header totals (`TotalAmount`, `NetAmount`). Never trust client totals.
     7. Single save via `UnitOfWork.Repository.Update(entity)` and `UnitOfWork.SaveChangesAsync()`. Never touch `SubscriptionId`.
   - **Child collections are a full snapshot (D4-3)** *(BE 14)*: the client sends every row; saved rows keep their id, new rows have none, rows not sent are removed.
   - **Delete** with `RemoveWithChildrenAsync(id, ct, x => x.Lines)` so the lines are soft-deleted with the header *(BE 8)*.

3. **Pattern 3 — Master-Detail With Financial Effect (رئيسي - تفاصيل مع أثر مالي):**
   - **Canonical Reference:** `Services/VouchersServices/InvoiceService.cs` (e.g. Invoices, Vouchers, Credit Notes).
   - **Applicability:** Documents that create accounting entries (Journal Vouchers) or financial allocations upon saving.
   - **Strict Rules:**
     - Enforces all checks from Pattern 2.
     - **Transaction boundary *(BE 14, "Explicit transaction boundary")*:** decide from the number of `SaveChangesAsync` calls on **one execution path**. When a path saves more than once (document, then journal voucher, then allocations), open one explicit transaction before the first mutation (`using var transaction = await UnitOfWork.Context.Database.BeginTransactionAsync()`), commit after the last save, and roll back on any failure. When a path performs one save of the tracked graph, rely on EF Core's implicit transaction. A conditional workflow may open the transaction on its multi-save branch only; `MiscellaneousInvoiceService.AddAsync` is the reference.
     - Sequential consistency boundary on the multi-save path: (1) save document and line items -> (2) generate and persist the balanced Journal Voucher (Debit = Credit) -> (3) persist allocations and recompute accounting flags -> (4) `transaction.CommitAsync()`.
     - Document state locks: update and delete strictly prohibited once posted, approved, or allocated.
     - **Posted documents are voided, never deleted** *(BE15, owner2026-10-20 supersedes J-1's reversal)*: full cancellation retains source/JV history and marks both voided atomically, without a reversing entry or cancellation allocation. Guard the original period and settlements; effective balances exclude canceled journals. Apply on new screens and existing-screen reviews; delete only unposted drafts. Existing `InvoiceService` posted-delete remains a scoped backlog finding; separate credit/debit-note workflows keep their confirmed contracts.
     - **Sales invoice journal direction** *(BE 15)*: debit the customer with the total, credit each charge/revenue account with its amount, credit VAT (TaxCollected) with the tax; resolve every account before the first save and return a failure instead of throwing.
     - **Link Accounts completeness** *(BE 15)*: every account a journal resolves must be linked to a posting account. Link Accounts > *Complete missing links* links the seed default posting account, else reuses a same-name posting account (under the target group, or the only one in the category), else creates a posting account named after the slot under the seed parent or the group found by name then category/sub-group (never by code), else leaves it Manual; creation only through `AccountService.AddAsync`, one transaction, existing links untouched.
     - **Journal posting policy** *(BE 15)*: no-approval documents use `SaveAndPostJVAsync`; approval documents save a draft and post/unpost through `PostAsync`/`UnpostAsync` on approve; generated vouchers (`IsGenerated`) are changed only from their source; edit of a posted no-approval document calls `UnpostAsync` then rebuilds the journal in the same transaction (delete: the J-1 rule above); every ledger change needs an open fiscal year and month (`EnsurePeriodOpenAsync`); resolver lookups are `int?`. Round every computed amount with `GetMoneyDecimalPlacesAsync` and derive the balancing line from rounded parts; lines inherit the voucher branch; JV numbers come from the counter; inject `ILinkAccountLookup`/`IAccountingPeriodService` in new code. VAT is calculated **per tax rate on the document, rounded once** (D4-4): `VatPolicy.CalculateDocumentTax(lines, decimals)`, and `AllocateDocumentTax` when a line needs its share (the largest line takes the remainder); never sum rounded per-line taxes. The rate is a percentage, never 0.05 in a /100 formula; total = amount + tax. The Angular preview uses `documentTax(lines)` *(UI 19)*. The rate comes only from `ITaxPolicyService` (Settings › Common): resolve any client rate with `ResolveRateAsync` (settings rate, or 0 when optional), snapshot it on the document/line, never hard-code 5, 0.05 or 15; frontend defaults via `TaxSettingsService`. Purchase tax follows the supplier (`ResolveSupplierRateAsync`: settings rate when tax-registered, else 0); bills accept only a ±0.05 `TaxAdjustment`; a non-tax document (GRN) has no tax input.

4. **Pattern 4 — Settings (شاشات الإعدادات والتهيئات)** *(BE 16, owner decision 2026-10-01)*:
   - **Shared owner:** `IServiceHelper` (`Services/HelperServices/ServiceHelper.cs`); references `FieldsSettingsService` (single rows), `NotificationsSettingsModelService` and `EmailTemplateService` (several rows by key). Interface does NOT inherit `IService`; no own save loop; one `SaveChangesAsync`.
   - **Single row** (one row of settings for the tenant): service derives from `SingleRowSettingsService`, controller from `SingleRowSettingsControllerBase` (`GET`/`PUT {controller}/Mine`); Angular `getMine`/`saveMine`. Underneath: `GetSingleAsync` / `UpsertSingleAsync` — update the row, or create it when missing. The read never inserts; the row is the latest by `Id`. Only get/save endpoints; Angular never lists rows, takes "the last one" or POSTs a new row per save. The list-shaped `GetSingleAsListAsync`/`UpsertAsync(list)` stay for the Fields contract.
   - **Several rows** (same subject, each row has a business key): `UpsertByKeyAsync(list, vmKey, entityKey, ct, scope?)` — add or update by key, rows not sent stay; last row wins on a repeated key; an undefined enum key fails the call (`SettingsInvalidKey`) and the caller returns that `Result` before saving; `scope` limits a partition (Labour Rate per vehicle type).
   - **No delete by omission.** Removing a settings row is an explicit row Delete with confirmation. `SyncByKeyAsync` was removed (2026-10-01).
   - Duplicate legacy rows: the owner removes them; the helper reads/writes the latest meanwhile. Add the unique index (`SubscriptionId` for a single row, the key for several rows) when the screen is reviewed.
   - Other services read a setting through its owner (e.g. `ITaxPolicyService`), never their own `Query<T>().FirstOrDefault()`.

5. **Pattern 5 — Reports:** read-only `QueryReport<T>()` plus a feature service. No CRUD and no `ListVM` (BE 17).

### 8.2 Architectural Invariants & API Rules *(BE 5, 6, 9, 18)*

Assembly-scan data carriers *(BE5)*: inspect the actual broad Business
AddClasses/AsImplementedInterfaces scan. A public record synthesizes
IEquatable<T> and can be activated as a service with enum/string dependencies.
For construct/read-only carriers, use a sealed getter-only class without
service interfaces (InvoiceAccountingMetadata). If equality is needed, keep
the record outside the scan explicitly; do not widen this into an unreviewed
global registration change, register primitive values or disable validation.
Check that real service interfaces remain registered; owner startup pending.
Query-bound dictionary identity *(BE9, 2026-10-10)*: retain the actual MVC-bound
Filters dictionary with an initialized auto-property; never clone it in the
setter. DictionaryModelBinder registers bracket-key validation by object
identity, and replacing the object can cause automatic400 with empty errors.
Normalize case-insensitive service snapshots after model validation, assigning
pairs into an OrdinalIgnoreCase dictionary to retain last-value semantics.
Keep validation enabled. DriverTimeSheetReport is the corrected consumer;
SpecificationRequestDto is the existing property reference. Legacy copying
setters migrate only in their own scope. Source-supported; owner build/replay
acceptance pending.
ListSmBase adopts the initialized nullable auto-property during the2026-10-13
Invoice load correction; keep its request names/types and post-binding private
normalization. Active error diagnosis still requires HTTP evidence.

1. **Pagination Invariant:** `NormalizePaging(searchModel)` in the base gives `pageNo = PageNo ?? 1` and `pageSize = Math.Clamp(PageSize ?? 10, 1, 100)` *(BE 9)*. Backend services return `Task<Results<TListDto>>` with authoritative `TotalCount`, `TotalPages`, `PageNo`, and `PageSize`.
2. **Detail Endpoint Route Convention (`SiGmaControllerBase`):**
   - Controllers inheriting from `SiGmaControllerBase` (like `VehicleController`, `WorkOrderController`) have no root `/{id}` endpoint. The base exposes `GetById/{id}` (plain detail) and `GetByWithNavigationsId/{id}` (detail with relations).
   - Always call `GetByWithNavigationsId/{id}` to load the entity with relations.
3. **Master-Detail Calculation (Pattern 2):**
   - Calculate line totals and header totals (`TotalAmount`, `NetAmount`) authoritatively on the backend, rounded with the money decimals (`GetMoneyDecimalPlacesAsync` + `FinancialNumberPolicy.RoundMoney`, BE 15), never a literal `2`.
   - Reconcile aggregate children explicitly before persistence.
   - Client-side calculations serve only as live preview.
4. **Repository Fetch Convention (`IRepository`):**
   - In `SiGma.Repos`, the method to retrieve an entity by integer ID is strictly `FindByIdAsync<T>(id, cancellationToken)`.
   - `GetByIdAsync` does NOT exist on `IRepository`. Never call `UnitOfWork.Repository.GetByIdAsync<T>()`.
   - For queries with relations: use `GetByIdWithNavigationsAsync<T>(id, cancellationToken)` or `GetByIdDeepAsync<T>(id, cancellationToken)` for read-only trees.
   - Read-only detail loading must not attach copies, detach entries or clear the write context's tracker. The shared deep loader uses a separate DI-scoped context, disposed on every exit; it reads persisted data, without the write context's pending changes or local transaction. Updates keep their tracked write context *(BE 5, 14)*.
5. **Subscription Ownership Invariant (`SubscriptionId`):**
   - `SubscriptionId` is completely server-owned and stamped automatically by `SiGmaDbContext.SaveChangesAsync` from authenticated user claims.
   - NEVER manually assign or update `SubscriptionId` (e.g. `item.SubscriptionId = entity.SubscriptionId;`) in services, loops, or payloads.
   - For existing rows, `SubscriptionId` is strictly immutable in EF Core. Modifying it triggers an `InvalidOperationException`.
   - Ordinary EntityBase Repository reads/writes reject missing, nonnumeric or nonpositive subscription claims before querying or mutating. UOW checks pending tenant writes before numbering; DbContext checks them before audit/SQL in every sync/async save overload. `SubscriptionRequiredException` becomes localized `FailToAuth`/HTTP401 in existing middleware. No constructor guard, entity/payload/default tenant fallback or System bypass; unchanged/global-only saves remain allowed. Reports preserve their empty fail-closed/global contract, and background tenant writes require a trusted explicit context *(BE 5, 8, 17, 18; owner-approved R2, 2026-10-03)*.
   - **Update contract carries `Id` only** *(BE 3, 4)*: `UpdateBaseVm` no longer declares `SubscriptionId` or `No` (2026-09-30), so `Mapper.Map(vm, entity)` cannot overwrite them and Update maps need no ignore for them. A user-entered reference called `No` is declared explicitly on the feature's Add and Update VMs.
6. **Standard Paging & Filtering Convention (`GetManyAsync` vs. Custom `Search`):**
   - Do not create new `Search...Async` methods or `[HttpPost("search")]` endpoints for standard screen listing.
   - An additional read endpoint is allowed only when the feature contract records the reason, for example a mixed-source grid (§4.4, such as `GET Job/workshop-grid`) or an existing endpoint kept for external compatibility (such as `POST JobEstimation/search`). It still takes `[FromQuery] ListSmBase` on `GET` and returns `Results<T>` with the same paging contract.
   - Standard screen listing uses the base `GetManyAsync` and overrides only the hooks *(BE 13, D5-1)*: `ApplyListFilters(query, filters)` for the feature keys and `ApplyListOrder(query, filters)` for a business order (default `Id` descending; the base adds the `Id` tie-breaker, counts, pages and maps). Override `GetManyAsync` itself only for a recorded projection or mixed-source case.
   - `SiGmaControllerBase` automatically supplies `[HttpGet] GetListAsync([FromQuery] ListSmBase searchModel)` which delegates directly to `Service.GetManyAsync(searchModel)`.
   - Use `FilterHelper` (`SiGma.Helpers.Filters`) to safely parse values from `searchModel.Filters` (`GetString`, `GetInt`, `GetDate`, etc.).
   - Always return `Results<TListVm>` with both `TotalCount` (from `await query.CountAsync()`) and `TotalPages`.
   - Angular services consume it via `GET /<Controller>?PageNo=...&PageSize=...&Filters[key]=value`.
   - `ListSmBase` only binds `PageNo`, `PageSize`, and `Filters`. If a list supports sorting, send `sortField` and `sortOrder` inside `Filters[...]`. The base sorts by any stored column and by a reference navigation's `Name`; override `ApplyListOrder` only for a computed column. The search box is `SearchColumns => [x => …]`; `ApplyListFilters` holds business filters only. An export reuses `ListQuery(filters)` *(BE 13)*. Top-level sort query parameters are ignored by this request model.
   - For append-only history or log actions, freeze whether new entries remain allowed after the parent reaches a terminal state. Keep that decision independent of the parent editor's read-only mode, and do not expose mutation or deletion of persisted audit rows.
7. **Detail Mapping Shape:** Keep each detail DTO member's type and cardinality aligned with the entity/navigation and the data the editor consumes. A singular navigation mapped to a collection-shaped DTO member can fail at runtime in AutoMapper; use the actual relation or omit unused navigation data from the detail contract.
8. **Removing or renaming a member** *(BE 18)*: in the same change, search the whole backend for the removed symbol (object initializers such as `new Job { ApprovalStatus = … }`, LINQ, `ForMember`, EF configuration, other services that create or read the entity such as the estimate → job conversion, controllers, seeds). Read each hit to separate same-named members of other types (`JobEstimation.ApprovalStatus` stays). Search the Angular app too (models, services, columns, filters, action visibility, editor locks, export, translations): a check on a field the API no longer returns reads `undefined` silently. Fix every real hit, list them in the report, and suggest `Add-Migration` when the member was persisted. When the owner pastes build errors, fix the first failing upstream project first: a downstream `CS1061` for a member that exists in source is a cascade from a stale reference assembly.
9. **Combined projections** *(BE 18)*: a member added to a DTO that is projected from several sources and joined with `Concat`/`Union` is assigned on every side (`Status = (Status?)null` where a source lacks it); otherwise EF throws "Unable to translate set operations" at run time, not at build.
10. **Tracked bulk activation** *(BE 12)*: validate every target before mutating, load rows tracked in the write context, change IsActive and save directly. Do not force Update/UpdateRange on these tracked rows: unrelated values from the earlier snapshot can overwrite concurrent edits. Preserve tenant scope, the original SubscriptionId concurrency value, localized results and successful unchanged-state saves. No new version/lock policy is implied.
11. **Field-only soft delete** *(BE 8, 18)*: shared HandleAudit restores a Deleted entry's scalar current values from OriginalValues, sets Unchanged, then assigns and explicitly marks only IsDeleted/DeletedBy/DeletedAt modified. This discards preceding scalar edits on that deleted row and prevents DetectChanges from widening the write. Preserve original tenant/concurrency values and other tracked entities' edits; no tracker clear, full-row Modified or extra save/transaction for the conversion. Apply the same boundary to every Deleted owned row; existing ownership/usage checks remain. Owner-approved R1, 2026-10-03; runtime verification pending.

---

### 8.3 Settings-Backed Financial Preview Inputs *(BE 16, Master 4)*
- For taxes, fees, commissions, and other configurable rates, keep the effective value backend-owned.
- Expose the current effective rate through a typed read-only options response for live UI previews, then use the same input for authoritative server recalculation.
- Preserve the existing domain value until an owner selects the actual settings source; do not bind to an unrelated setting because its name looks similar.

### 8.4 Aggregate Write Checks *(BE 3, 8, 11, 14)*

- Read-only CheckUnique preflight whitelists declared UniqueColumns and returns Result entity.isAvailable, excluding the edited row through tenant/live Repository.ExistsAsync. Reuse the final-write UniqueValueExistsAsync predicate/normalization; reject unsupported fields/nonpositive ids. No mutation, lock, numbering or schema change; participating writes keep their authoritative duplicate/concurrency protections (BE8).

- Resolve reusable master data that may save the scoped context (default contact groups) outside the aggregate transaction and before any tracked mutation or child removal. A helper save flushes unrelated pending changes in that context too.
- Declared `UniqueColumns` writes use the shared UnitOfWork entity/authenticated-tenant Exclusive application lock inside ReadCommitted; base Add/Update apply it, aggregate overrides use protected `UpdateCoreAsync`, and custom imports use the same boundary with live-key rechecks. Preserve partial chunks. Ten-second lock wait; stop on failure, localize 409, no blind retry or claim of zero deadlocks. Commit only an owned successful transaction; never commit an outer transaction. Temporal-overlap isolation remains separate (BE 5, 8, 14).
- Cross-service collection/lifecycle concurrency *(BE 15)*: one tenant lock `ExecuteUniqueWriteAsync<TOwner>` for every writer of the owner and of rows linked to it (e.g. receipts of a sales agreement); re-read eligibility inside it; a writer with its own transaction opens it first and takes the lock inside; multi-save actions use the lock's transaction. State columns are concurrency tokens; child-only edits mark the root modified. A cancellation that reopens a balance moves a closed document back in the same transaction; an explicitly supported un-void re-runs add eligibility. Equal installments round down; the last takes the remainder.
- Shared FK validation skips absent/null optional references and EF `IsBaseLinking()` inheritance keys; inherited `Id` is row identity, not a selected reference. Reject supplied business FK IDs <= 0. New owned-row identity 0 remains valid; saved row ownership is checked separately. Company/Individual CRUD, group actions and imports use `IContactGroupAccountService.CustomerGroupIdAsync` for default resolution and Customer type; reject absent authentication before saving defaults (BE 8, 14).
- UnitOfWork numbers Added EntityBase rows with empty No before sync/async saves; CodeCreateService reserves configured automatic numbers from the same tracked tenant/type DocumentNumberCounter across a batch. CurrentValue is a concurrency token; the existing counter unique index protects first creation, and conflicts return 409 through existing middleware. Seed from the largest issued trailing number including deleted rows; save counter and graph together. Preserve nonempty No, existing formats and early-root numbering. JournalVoucher keeps its dedicated generator without a generic preliminary reservation. Formatting/fallback and generic update mapping gaps remain separate (BE 11).
- Keep Company ownership in private `OwnsEveryRow`; use base `RemoveDroppedAsync` for dropped children and `SaveUpdateAsync` for the standard one-save result (BE 5, 14).
- Reviewed owned collections/references use a tracked `UpdateCoreAsync`: check `OwnsAll`/`OwnsReference` before mapping; reconcile retained instances directly from VMs and ignore manually reconciled navigations. UnitOfWork sync/async save succeeds when SaveChanges completes even with zero rows; errors/conflicts still fail. `SaveUpdateAsync` reuses that rule; do not force graph-wide writes. Individual adopts tracked reconciliation; the legacy generic engine stays deferred (BE 5, 14, 19).
- VM `DateAfter`/`NotFutureDate` own API date checks; imports bypassing VMs validate them at their boundary. DateAfter supports DateTime calendar days and DateOnly, strict by default; a frozen same-day rule explicitly sets AllowEqual=true with localized on-or-after wording and matching Angular comparison/picker minimum. Date-only VMs reuse this owner. Do not repeat VM checks in Add/Update services (BE 3).
- Alternate import writers reuse the ordinary write constraints, reject undefined enum numbers and missing required dates, persist advertised address/country fields, and log exceptions server-side while returning safe localized errors (BE 3).
- Match Angular numeric minimums on shared Add/Update VMs. Nonnegative decimal bounds use decimal-typed invariant `Range` limits; keep nullable inputs optional. Callers bypassing API model validation need equivalent boundary checks.

**Independent scalar settings sections (BE16):** canonical helper upsert plus
one Save; restrict full-row modified flags to the section's changed scalars so
concurrent unrelated section changes survive. A legacy tracked-row override must
retain tenant/id/validation contracts and justify why the generic full-row update
cannot preserve that boundary. Keys have write-only public DTOs, blank-preserve,
replacement after failed status reads and no client echo. The owner explicitly
selected current development plaintext storage for DeepSeek (2026-10-13),
superseding this task's initial protection decision; that is feature-specific.
ApiKeySetting is the verified consumer; filtered tenant uniqueness, owner legacy
duplicate cleanup and migration remain explicit.
Provider-only metadata generation owns no entity CRUD or domain calculation.

**AI candidate output boundary (BE18):** JSON mode is syntax, not form-schema
enforcement. Build shared MockDataService's prompt schema/example from requested
keys/types, retaining opaque choice strings and all output keys (optional values
may be null). Strict validation stays authoritative. At most one repair after
invalid JSON/envelope/candidates shares the original deadline/cancellation/cap;
no HTTP/auth retry, partial Apply or deterministic fallback. Diagnostics contain
only fixed reason codes and bounded sanitized requested identifiers, never
response bodies/values/keys. Owner HTTP400 reports prove rejection, not its exact
field cause without the provider response; source fixes still need owner replay.

### Generic audit capture and document log *(BE18; UI7)*

For the owner's all-entity Audit Trail interceptor request, preserve
HandleAudit and use the shared Capture<TEntity> service over tracked EntityBase
entries. Stage standalone events in the same SaveChanges batch; no
second save/commit or source FK. The owner's 2026-10-22 decision extends the
earlier metadata-only rows with bounded reason and scalar change JSON, excluding
navigation graphs and redacting sensitive/oversized values. A caller may label
a tracked domain action; changed tracked approval/void fields can be inferred
when no explicit label exists. Current inference recognizes only changed
ApprovalStatus/ApprovedStatus and false-to-true IsVoided; annotate other
semantic actions on the tracked root before Save. A detached update's before
value needs proven database-original provenance: the current CaptureChanges
inequality check is insufficient and requires source correction/acceptance
before claiming accurate prior values. Similar document screens reuse the
shared read-only action-log component with a typed feature loader; the feature
endpoint checks tenant-owned identity and view access and passes only verified
root/retained-child GUIDs. Inventory SQL/bulk exclusions, state/effect guards,
reason, old metadata-only rows, translations, failure/retry and in-app help
per model (Master4, BE18, UI7). Log never changes approval or replaces its
history. Historical metadata-only rows remain valid.
Classify pending writes
from scalar IsModified flags, not original/current equality: detached
Update/UpdateRange originals are not a database baseline. Modified entries with
write flags become Modified; IsDeleted marked for writing true becomes Deleted
after HandleAudit's field-only conversion, as do physical Deleted entries.
Unchanged tracked saves stay excluded; explicitly forced updates/repeated true
deletion-marker writes count without extra database reads or original-value
rewrites. This supersedes the initial value/transition comparison. Failure/cancellation removes staged
events before retry, success detaches events and preserves affected-count and
caller transaction/acceptAllChangesOnSuccess semantics. No/GUID are pre-save
source identity; missing No/date stays empty. Tenant reads use QueryReport;
NameIdentifier is the subscription, Name is the actor. Explicit nvarchar(max)
for existing unbounded source numbers/claims avoids narrowing another writer;
ordinary BE2 input bounds remain. Global entities, unconfigured contexts and
SQL/bulk/external auth are outside coverage. New table starts with future events;
owner migration precedes enabling the interceptor. Stable Id/cutoff paging and
full Excel abort on any page failure; no database snapshot-isolation claim.
Source evidence does not replace owner build/save/rollback/retry acceptance.

Revision 2026-10-22: the owner requested detailed central logging for create,
edit, approval and comparable tracked actions, with a reusable document Log
viewer. BE18/UI7 and this digest were updated together; direct SQL/bulk and
pre-deployment details remain outside capture, owner migration/runtime pending.

### Outbound message outcomes *(BE18)*

Operational message logs are append-only events with authenticated tenant-scoped
QueryReport reads, lean rows, stable Id ties and applied event cutoffs (not SQL
snapshot isolation). Explicit strict read contracts validate supplied dates/enums
and sort/page values; optional raw values reuse FilterHelper. Actual email producers
reuse MessageDeliveryService's typed internal request/outcome; validate normalized
actual addresses/subject before sending, never truncate sent addresses or persist
body/password/provider exceptions. Missing context/CC stays empty; current shared
transport does not send CC. Check cancellation before each attempt, then isolate
outcome append and complete it independently of request cancellation. Tenant is
server-owned. SMTP acceptance remains accepted if logging fails: expose accepted-
but-log-unavailable, rejected-and-log-unavailable and partial-batch accepted counts
without automatic resend. Persist safe translation keys, log append failures
internally, and do not treat simulations as delivery. Owner migration/build/SMTP/
tenant/failure/output acceptance stays pending.

## 9. Translations & i18n Protocol *(UI 23)*

Runtime switch latency *(UI23; BE5, 2026-10-17)*: TopBar selection uses its
loaded active option and reads a fresh UI dictionary; bootstrap, explicit
Retry and management completion still refresh options/default. No-op an
already applied language only outside loading/errors. Index original key
paths on registration, retain literal paths/validation, latest-intent
cancellation, active-only DB snapshot and logout reset. Backend batches API
sources and reuses successful runtime-only options within one scoped request;
no cross-tenant/global dictionary cache or cached write validation, and no
parallel queries on the same DbContext. Source read counts are not timings.

Committed text application *(UI23, 2026-10-17)*: a canonical nonblank active
language override may merge one validated key only when the captured auth
context still matches and no switch/error is pending. Preserve other overrides;
never patch from a draft or original-filled dictionary. Empty/Reset/other
language values read authoritative fallback directly without reloading options;
API-only edits need no UI dictionary reload. Retry never repeats the write.

Resource-key conversion *(BE5, owner compiler evidence2026-10-17)*: apply nameof
only to actual generated string message properties passed as key identities.
ResourceManager/Culture remain infrastructure; never turn the receiver of
ResourceManager.GetString into nameof/string. Check generated member types and
the whole receiver expression. Verify Business declarations/project references
before treating downstream ServerAPI namespace errors as missing contracts;
source checks do not prove an owner rebuild clears them.

Database localization runtime *(UI25; BE3, 2026-10-17)*: TranslationService owns
catalog-direction metadata, html/body dir and the existing RTL stylesheet after
authentication; shipped Arabic metadata covers pre-login. Restore original
dictionaries at session exit and reject stale reads. Translation Value preserves
meaningful whitespace through an exact LanguageTextSaveVM.Value exception in
shared TrimIncomingStrings; other Value/identity fields keep trimming. Empty
direct text and placeholder/markup/length validation keep their frozen contract.

Journal source string display (UI16/23): reuse shared `voucherTypeText` and
neutral `voucherTypeNames.*` keys for the backend `VoucherTypeName.ToString()`
contract. Unknown names retain source text, null stays empty; grid/export share
click-time/current-language translation, with no enum ID/query/payload changes.
Bank Reconciliation adopts it; Customer Statement's existing local mapping stays
for its own review (backlog39).

1. **Duplicate Property Prevention (`TS1117`):** Large dictionary files (`en.ts` and `ar.ts`) exceed thousands of lines. Always search for existing keys before inserting new ones.
2. **Parity Requirement:** Every newly introduced key in `en.ts` must have an exact matching key and appropriate translation in `ar.ts`.
3. **Shared Keys:** reuse `general.*`, `mangeDetails.*` (legacy spelling, kept for existing keys) and `validationMessages.*` before adding a feature key; feature keys go in the feature's own block.
   Shared partner enum and attachment keys belong to `partnerForm`, not another customer feature's namespace (UI 23).
4. **Fallback and casing:** `en` is the fallback language, so a key missing from `ar.ts` shows English; the two files drift in casing and block, so compare the exact path.
5. **Parity check (read-only):** `recipe-system/Check-Translations.ps1 -Block <touched blocks>` reports nothing before the screen is reported complete.

---

## 10. Pre-Flight Verification Checklist *(UI 29, Master 7)*

Rich-text invalid focus (UI27, 2026-10-17): give the real contenteditable its
stable id and translated accessible label using the editor's public attributes,
then reuse shared focusField(id, { openOverlay: false }). The shared owner
accepts contenteditable alongside native inputs and reveals actual scroll
regions with preventScroll focus. Do not focus a toolbar or copy feature focus.

Exact email-template text (BE3, 2026-10-17): shared TrimIncomingStrings excludes
only EmailTemplateAddVM.EmailBody (preserve authored HTML/whitespace) and Subject
(validate raw CR/LF before service-owned trim). CC/BCC and ordinary strings keep
normal trimming; never exempt all properties by those names. Runtime pending.

- [ ] After completing the screen implementation/refactor, create or update its
  topic in the owning module's in-app user guide before final handoff. Reuse
  `modules/UserGuide` models/reader/journey/topic components and the shared UI;
  register a new module guide once when needed. Cover purpose, prerequisites,
  user steps, actions/states and relevant validation/financial limits from the
  final source in EN/AR. Record content file, guide route/menu entry, topic
  coverage and source evidence in the existing review. Existing guides are
  updated, not duplicated; child dialogs/modes stay with their parent workflow.
  Read-only/backend-only and intermediate phase boundaries remain unchanged;
  owner runtime/visual acceptance stays pending *(Master 7, "Screen user guide
  completion gate"; UI23/29)*.

Before reporting any screen complete:
- [ ] **Responsive consistency (UI29; Master5):** record a matrix covering the supported size ranges, both sides of every viewport/container breakpoint and representative intermediate sizes, including owner-supplied widths. Trace the full CSS cascade; verify usable field widths, aligned heights/edges/spacing, unclipped labels/values, coherent button/check groups, feedback/states, LTR/RTL/theme and fixed actions/internal scrolling. Known inconsistencies remain findings. Authorized visual acceptance resizes through the ranges; source-only work keeps visual acceptance pending and does not claim all-size verification.
- [ ] Outer wrapper is `<section class="*-page"><div class="*-panel">` with full primary card styling (border, radius, shadow, background).
- [ ] Host is container-fill: `:host { height: 100%; overflow: hidden }`, with no `calc(100dvh - …)` anywhere in the feature.
- [ ] **The page never scrolls** at desktop or narrow widths. Each region has exactly one scroll owner (grid rows, form pane, or dialog body); title, filters, paginator, and action footer stay visible.
- [ ] Filter strip `margin: 0 8px 6px` (same edges as the title card); single-line controls resolve to 34px; no `[showIcon]` on any calendar.
- [ ] A filling `app-data-table` uses `[fill]="true"` as in §4.1; the retired Transitional deep-fill block is removed. Nested grids use only public inputs/tokens, with no feature `.p-datatable-*` or `.p-paginator` rule (UI 6).
- [ ] Paginator maintains natural RTL flex flow (no rogue `margin-inline-start: auto`).
- [ ] Loops track stable identity: `track row` for `FormArray.controls`, `track item.id` for DTO arrays (not `track $index`).
- [ ] Empty table displays translated `"لا توجد بيانات"` / `"No data found"` via `general.noDataFound`.
- [ ] View-only dialogs bind `[primaryActionVisible]="false"`.
- [ ] Every new or refactored `app-editor-dialog` sets `[contentPadded]="true"` (unless its body is full-bleed by design), and the feature content wrapper has no padding of its own.
- [ ] Solid buttons enforce white icons (`color: #fff !important`).
- [ ] Base service calls use `GetByWithNavigationsId/{id}` for entity details.
- [ ] Backend list returns `Results<T>` with valid `TotalCount`, `TotalPages`, `PageNo`, and `PageSize`; page size defaults to 10, clamped 1–100.
- [ ] Component extends `BaseComponentService` with two-tier loading: `this.loading.startLoading()` wrapped in `finalize(() => this.loading.endLoading())` for primary fetches, actions, dialog save/details, plus local signals for controls.
- [ ] Backend service follows one of the five patterns (§8.1) without bespoke loops or manual `SubscriptionId` mutation; an explicit transaction exists only on multi-save paths.
- [ ] No Update VM or map reintroduces `SubscriptionId` or the server-owned `No` (BE 3, 4), and no profile uses `ReverseMap()`.
- [ ] The reviewed screen's write payloads, child rows, dialogs and write interfaces no longer contain `subscriptionId` (form control, payload, `localStorage` read), the server-owned `no`, audit values, delete/active flags, status or totals; a user-typed reference `no` stays only where the backend VM declares it *(UI 2, backlog 8, 19)*.
- [ ] Actions that clearly need a permission (delete/void posted data, approve, post, close period, change settings/accounts) are listed with their endpoints under *Authorization candidates* in the review artifact; nothing is hidden for that reason *(UI 26)*.
- [ ] Shared pieces instead of feature copies *(UI 2, 8, 14, 16, 17, 19, 20, 21, 22, 24)*: `app-field-error` under validated controls; `app-state-message` for loading/empty/error; `enumOptions`/`enumKey` (no `EnumToArrayPipe`); `parseDateRange`/`parseDateValue`/`currentMonthRange`; `toListParams`/`fetchAllPages`; `| money` for totals and report amounts; `sigma-secondary-button`/`sigma-danger-button`; `sigma-print-flow` on report scroll containers; editable table `[stickyHeader]` (no rule on its frame); global `--sigma-*` colour tokens and no feature palette.
- [ ] Master-detail *(UI 1, 13, 14, 15, 18; BE 2, 8, 14)*: modal vs routed page by the D4-2 rule (several collections, totals or posting → page); routed editors use the shared editor shell (`sigma-editor-*`, `sigma-field`, `sigma-editor-totals`, `sigma-editor-footer`); child rows through `EditableRows` (untouched new rows removed directly, others confirmed); full-snapshot update payload (D4-3) from `getRawValue()`; uploads through `DocumentUploadTracker`; backend detail FKs with `AllExistAsync`, delete with `RemoveWithChildrenAsync`, unique indexes filtered to `[IsDeleted] = 0`.
- [ ] Backend list: `ApplyListFilters`/`ApplyListOrder` hooks instead of a rewritten `GetManyAsync`; messages via `BusinessFailure(key)`; verify retained source/JV flag-only Void without a reversing entry, original-period/settlement guards, effective-reader exclusions and historical status (BE13/15, owner2026-10-20); no posted deletion.
- [ ] A ListVM that shows navigation names overrides `MaterializeListAsync` with `ProjectTo`; an editor uses `sigma-editor-scroll`, `sigma-field--check`, `sigma-file-field` and `app-field-error [message]` for a rejected file; exports carry no secrets and mask card numbers (BE 13; UI 1, 8, 18, 19).
- [ ] **Shared-extraction gate (Master 5, owner rule):** before reporting any phase or task, repeated patterns in the touched code become shared pieces (or reuse one), adopted in scope, recorded in book + skill + changelog; the report lists them. Current pieces: `app-agreement-history-dialog`, `appDatePicker`, `translateOptions`, `app-file-field`, `confirmDiscard`/`confirmDelete`, `readListRoute`/`writeListRoute`, `invalidStepFields`, `InvalidInputAsync`/`UniqueColumns`, `InUseAsync`.
- [ ] Partner collections use typed rows/factories/mappers in `shared/models/partner-editor.ts` and `shared/utils/partner-editor-forms.ts`; numeric document wire IDs are explicit. A nested draft owns its upload tracker, discards only its pending uploads, and transfers ownership with `transferTo(parentUploads)` only on draft Save. Only successful aggregate persistence calls `finishSave`; compare original/saved nested paths for whole-row removals *(UI 14, 18)*.
- [ ] Reviewed owned collections/references update on a tracked load through protected `UpdateCoreAsync` (§8.4), with `OwnsAll`/`OwnsReference` before mapping and the existing reconciliation helpers. Grandchildren also check `InUseAsync<TChild>` for dropped rows. Public Update keeps the base write guard. Customer services reuse `AgreementStatusFilter` and `CustomerContactGroupUpdateVM`; document dates are VM validation; agreement history reads `AgreementHistory` and opens `app-agreement-history-dialog` *(BE 3, 5, 14; UI 11)*.
- [ ] Delete = `RemoveWithChildrenAsync` with every owned row: it returns 404, checks usages from the EF model (`InUseAsync`) and soft-deletes. Exclude EF `IsBaseLinking()` inheritance keys: derived/base rows represent the same entity, not an external usage; keep business self-references checked. Grandchildren first, and `InUseAsync<TChild>` for a child dropped from a snapshot. No hand-written reference lists *(BE 8)*.
- [ ] Shared delete blockers name the actual matched EF entity category, not a foreign key's inheritance-base declaring table. `ReferencingTableCoreAsync` keeps `AnyAsync` for types without subtypes; hierarchies resolve one untracked matching row through `FindRuntimeEntityType`, falling back to declared metadata. Partner and its concrete subtype labels exist in both GeneralMessage resources. Keep real base-declared business FKs checked; return no row identity/content *(BE 8)*.
- [ ] **Companies review rules G1–G19** *(Master 4–7; BE 1, 2, 3, 5, 14; UI 1, 4, 8, 12, 14, 18, 23, 29)*:
  - **Data and backend:** one status flag per entity, the one its consumers read (partners: `Partner.IsInactive`); any schema change gets an `Add-Migration` report line; server-owned values are set by the backend, enum defaults written by name; `[EnumDataType]`/`[Required]` sit on the VM, not in hand checks; every partner aggregate gets snapshot reconciliation with ownership checks; no transaction around the default contact group.
  - **Shared rules:** one partner document rule set (type, number, issue and expiry required; folder `CustomerDocuments`); neutral shared message keys and DTOs; card exports come from the backend.
  - **Screen behaviour:** an unchecked *inactive only* box shows all rows; the step header and *Next* both validate forward; badge specs are declared with existing keys and never built.
  - **Markup and code:** one row binding style; one `sigma-field--check` per check box; one statement per line.
  - **Process:** status table and closure artifacts; dead roots are removed, not rebuilt; remove their obsolete explicit `tsconfig` roots too; new entries only after the compiler reports a file missing; stop if another tool changed scoped files; build only what the contract uses.
- [ ] Edit requires a successfully loaded snapshot; load failure keeps Save blocked and offers Retry. Submit checks `form.invalid` and complete explicit specs with real field IDs. Step header and Next share forward validation; navigation and Save are gated during load/upload/cleanup *(UI 12)*.
- [ ] Keep the submitted snapshot stable: disable the form without emitting changes during save, disable collection mutations, restore on failure, and retain read-only state during successful-save cleanup. Validation-summary navigation shares the busy/ready gate *(UI 12)*.
- [ ] Shared file fields pass their bound control plus rejection message to `app-field-error`; required card strings reject whitespace before their shared mapper trims them. No local card/file validation fork *(UI 18, 19)*.
- [ ] Lists with explicit Search serialize the applied filters for paging/editor return and row-action refresh; unapplied control edits do not silently become a query *(UI 10)*.
- [ ] Full-width step distribution uses `app-step-form [fill]="true"`: shared equal columns, centred marker/label and aligned progress track; no feature navigation CSS. Narrow overflow stays inside the shared navigation *(UI 12)*.
- [ ] Fixed editable-table columns declare `width` in `EditableCollectionTableColumn`; the shared colgroup/layout owns sizing and long dropdown-label containment. Keep horizontal overflow inside the frame, without feature cell/dropdown width CSS *(UI 14)*.
- [ ] Editable-table checkbox cells reuse the editor's 15px box and `--sigma-primary` accent through shared table styling; no browser-default accent or feature colour override *(UI 1, 14)*.
- [ ] Row data placed beside buttons uses `appEditableCollectionActions` and the shared row-actions group. Retain data in View with `actionsVisibleInView`, hide mutation buttons, and keep the field read-only with its translated accessible name/title *(UI 14)*.
- [ ] Size projected action groups through host `--sigma-editable-actions-width` and `--sigma-editable-row-actions-gap`; defaults are 74px/5px. Do not override shared action-cell selectors *(UI 14)*.
- [ ] Every dropdown width is defined by its field/column layout, never the selected label. Forms/filters fill their responsive grid field; each editable-table dropdown column declares `width` through the shared column option. Choose widths per field, clip long labels through shared styling and keep overflow inside the table; no feature width selectors or universal pixel size *(UI 14, 16)*.
- [ ] Added-row focus uses shared `focusField(focusId, { openOverlay: false })` through `EditableRows`; wait for rendering, reveal within content scroll owners and prevent browser focus scrolling. Do not call native `.focus()` for new rows or open pickers automatically on Add *(UI 14, 27)*.
- [ ] For a dialog's zero-basis editor chain, supply shared shell `height`; for content-sized auto height, set shell `maxHeight` and use `flex-fill` on every form/body/scroll link. Avoid zero-basis children under auto height and keep one inner scroll owner; no feature selectors on `.p-dialog-content` *(UI 13)*.
- [ ] A visibly labelled action-cell checkbox uses `label.app-editable-collection-table__row-check` around its input/translated caption; allocate action width for caption and buttons *(UI 14)*.
- [ ] If a checkbox and buttons require separate column headings, project the checkbox as a data cell with its own translated column header/accessibility label and keep Actions for buttons; data then remains visible in View without `actionsVisibleInView` *(UI 14)*.
- [ ] Upload busy lasts until every subscribed upload ends. Cleanup waits for uploads, retains failed paths for retry, and keeps the editor open on failure. A cleanup retry never repeats a successful aggregate save. Saved original paths cover whole-row removals. View uses saved labels; Edit merges selected options *(UI 18, 22)*.
- [ ] During upload/cleanup, nested tabs bind shared `app-editor-tabs.disabled` and document collection mutations are unavailable; teardown must not cancel a file control before its upload path reaches the tracker *(UI 18)*.
- [ ] CSV pages reuse the existing parser and shared title/fill grid. Validate cells before typed DTO construction, preserve partial-success diagnostics, finalize loading, and use one feedback owner. Long diagnostics scroll inside `sigma-alert-list`, never the page *(UI 22)*.
- [ ] Filter boxes are one height through `form[appFilterPanel]` (no `-filters` class needed); a step-form error badge calls `focusField` (it opens a dropdown or a date picker). Reveal clipped fields only inside actual scroll regions; leave visible fields stationary, never scroll clipped shells/page roots, and do not scroll the step to the top (UI 4, 12, 27).
- [ ] Vouchers follow the decided journal rules (BE 15 table): counter-type notes reverse the allocated document line by line with `AddProportionalReversal`; the partner decides the side of an On Account note; deposits stay *Customer Deposits Payable*.
- [ ] Editors return to the list with its query parameters; a delete of the last row of a page goes back one page; a list load error shows inline with `X-Skip-Error-Interceptor` + `apiErrorMessage` (UI 9, 10, 22, 28).
- [ ] Changed translation blocks pass `recipe-system/Check-Translations.ps1 -Block <blocks>` *(UI 23)*.
- [ ] Every `<form>` binds `[formGroup]` (no bare `<form (ngSubmit)>`: without `NgForm` it submits natively and reloads the page) *(UI 19)*.
- [ ] New APIs match effective TypeScript libraries and browser support; Angular21 now uses ES2022 defaults, while explicit per-config libs still win. No local compiler/polyfill workaround *(UI1/29)*.
- [ ] Every dropdown control starts at `null` (never `''`) and text-valued option lists drop blank values, so `[showClear]` shows no icon on an empty field *(UI 16)*.
- [ ] Services are `providedIn: 'root'` and use `environment.baseUrl`; no feature `provideHttpClient`/`HttpClientModule`/manual Bearer header *(UI 1)*.
- [ ] No feature error toast or dialog for an API failure the interceptor already shows; failure callbacks restore state (inline messages only with `X-Skip-Error-Interceptor`) *(UI 22)*.
- [ ] Backend failures use `BusinessFailure(key)` with the key in both `GeneralMessage` `.resx` files; list overrides call `NormalizePaging` and set `TotalCount`/`TotalPages` *(BE 5, 7, 9)*.
- [ ] Dates to the API use `toApiDate`/`toApiDateTime` (never `toISOString()`), grid/export dates `formatDisplayDate`; errors read with `apiErrorMessage`; status cells `sigma-status-badge`; enum options built from the enum; field-triggered lookups `Subject` + `switchMap`; money previews `roundMoney` where the backend rounds *(UI 5, 16, 17, 19, 22, 28)*.
- [ ] Grid columns use `type` (`date`/`dateTime`/`money`/`number`/`status` + `status(row)`) and the export uses `dataTableExportRows`; no `::ng-deep` into `app-data-table` — only its inputs and the `--sigma-data-table-*` variables *(UI 5, 6, 8)*.
- [ ] A list page uses the shared shell classes and `app-data-table [fill]="true"`; no page/panel/alert/button copy or table/paginator override in its SCSS *(UI 1, 6, Master 5)*.
- [ ] A list filter strip is `form[appFilterPanel]` with `sigma-filter-field` fields and a handled `resetRequested`; the feature SCSS has no filter colour/border/dark rule and no undefined `var()` token *(UI 4, Master 5)*.
- [ ] Any tax (rate, amount, total with tax) comes from `ITaxPolicyService` in the backend and `TaxSettingsService` in the frontend; a client rate goes through `ResolveRateAsync`; the tax-rate control is `readonly` (a settings-rate/0 select only when tax is optional); searching the changed files finds no `0.05m`, `15m`, `* 5 / 100`, `* 0.05` or numeric tax default *(BE 5, UI 19, Master 5)*.
- [ ] Document VAT is per tax rate, rounded once (`VatPolicy.CalculateDocumentTax`/`AllocateDocumentTax`; preview `documentTax`), never a sum of independently rounded line taxes. Row tax/gross previews reuse shared `allocateDocumentTax(lines, decimalPlaces)`: proportional allocation per rate, largest absolute line takes the remainder, first tie wins, zero-net group stays zero; rows reconcile to the document total. Use backend ledger precision (Job context moneyDecimalPlaces from base Currency), distinct from Common display precision *(BE 15 rule 8, UI 19, D4-4)*.
- [ ] A scoped amount-in-words preview reuses shared `amountInWords` with CommonDTO currency/decimal-currency labels and display precision. It follows existing English voucher wording, never hardcodes screenshot currency or enters the derived-total payload; Arabic number words need a separately confirmed capability. Existing feature converters migrate only in their own scope *(UI 19)*.
- [ ] Every recommendation follows *Business correctness first*: the correct business/accounting answer, not the easiest or the existing behaviour *(Master 1)*.
- [ ] Every removed or renamed property, DTO member, method, or type was searched across the whole backend as a symbol, each real consumer fixed and listed, and a migration suggested when it was persisted *(BE 18)*.
- [ ] Both Arabic (`ar.ts`) and English (`en.ts`) dictionaries updated with no duplicate keys.
- [ ] Zero native `<input type="date">` used across list filters and modal editors; all date pickers consume `<p-datepicker>`.
- [ ] Date ranges use single `<p-datepicker selectionMode="range">` displaying both dates together (`26/08/2026 - 24/09/2026`).
- [ ] Date range filter defaults to the current month (first day to last day of current month).
- [ ] Column templates use `@ViewChild(..., { static: true })` with `initColumns()` in `ngOnInit()` and dual-layer `value` translation fallbacks.
- [ ] A new or refactored paged `app-data-table` binds `currentPageReport` to a feature key (`<feature>.showingEntries` for a new key) defined in `en.ts` and `ar.ts` with `{first}`, `{last}`, `{totalRecords}` only; never `general.showingEntries` while backlog 37 is open *(UI 6)*.
- [ ] Final report suggests names *(Master 7, "Suggested migration name and commit messages")*: a PascalCase, verb-first, unique migration name with its `Add-Migration <Name>` command when a migration is needed, and one `<type>(<scope>): <summary>` commit message per affected repository. Suggest only; never create a migration or commit.
- [ ] For production-preparation reviews, consult the Production notes register *(Master 5)*. Record concrete evidence, proposed action and deferred/verified status; distinguish configuration concerns from proven defects. PROD-01/02 concern Repos warning suppression and disabled analyzers; PROD-03 concerns coordinated Repos/Helpers HTTP framework-reference review, including consumers and deployment; PROD-04 records duplicate CS8669 cleanup. Notes do not authorize execution, certify readiness or become release blockers without evidence/owner decision.

---

* **CSV preview lifetime (UI22):** reviewed preview consumers reuse shared ImportCsvComponent
  parsingChanged/fileFailed/reset, clear stale rows on replacement, freeze their input context and
  block submission while parsing or invalid. The shared parser disables repeat selection and
  ignores destruction; controlled dialogs remount per session. Keep existing fileImported
  compatibility and feature-owned atomicity/replacement rules. Overtime adopts this source-only;
  owner parser/dialog acceptance pending.

Shared atomic storage cleanup *(UI18)*: FileStore.Upload's optional request token
is passed by new atomic multipart consumers. Its copy failure/cancellation removes
only the attempt's newly created file after stream disposal; failed CreateNew never
deletes an existing file. Log cleanup failures and preserve the original exception.
The caller rolls back earlier successful uploads on later upload/persistence failure,
leaving historical paths alone. Media/old calls retain normal validation and optional
signature compatibility. Source-only; owner disk/cancellation/crash acceptance pending.

## 11. Revision History

Historical attachment-only refinement (generalized by the2026-10-23 stable validation-row rule above).
Shared attachment row alignment *(UI18/14; owner2026-10-22)*: project an existing
same-path FileLink inside FileField's shared file/action row rather than placing
it below. Preserve existing path/folder/print/security/cleanup semantics; no new
View action for consumers without one. The shrinking file box and intrinsic View
use one34px track/8px gap, no phantom gap for an empty link; full-width errors
stay below. Shared table attachment-row Remove aligns to the first track at34px,
including validation. Keep td semantics; verify long/empty names, narrow widths,
RTL/theme and disabled state without per-feature CSS or duplicate actions.
UI6 records this as the bounded exception to whole-group centering: existing
important middle alignment requires a scoped shared important override for
file/action cells. Fixed attachment-table layout keeps long unbroken names in
their existing columns without changing explicit colgroups/min-width scrolling.

| Date | Learning | Owning blocks | Evidence / verification |
|---|---|---|---|
| 2026-10-23 | Closed initial main Reports menu | UI1 | Owner requests Reports closed. Duplicate /Account, /Vehicle and agreement links caused active-descendant expansion. Optional catalogue flag suppresses only main Reports route expansion in the shared adapter; manual/search and other groups retained. Book/digest/common EN-AR guide synchronized; source-only, owner interaction/RTL/theme acceptance pending. |
| 2026-10-23 | Documentation cleanup after standalone/vendor retirement | UI1/30 | Local app.config/main/layout/source styles confirm the current root and native shell. Removed superseded toolbar-band instructions from UI1, refreshed its interceptor snippet and backlog17, and corrected the digest's AppModule owner. Existing routing catalog remains live through LayoutModule. No application behavior changed; packet regeneration and source-only reconciliation recorded in the documentation-system audit. |
| 2026-10-23 | Sign-in session publication and completion lifetime | UI22, UI1/2/26/28/29 | Login source review confirms user-before-storage race, failed-Result dereference and busy ending before navigation. Owner authorizes confirmed fixes: typed form, success validation, persisted session before publication, best-effort storage rollback and one submit gate through navigation with opening-only Retry. Existing EN/AR/shared guide updated; regression sources added but not run. Owning UI22/digest synchronized; actual auth-server timing, build/tests/runtime acceptance pending. |
| 2026-10-23 | Stable shared row-action popup items | UI7/27/29 | Owner reports second-click execution across screens and authorizes correction. Per-popup weak cache retains row/action/item/array identity across focus checks while refreshing predicates and translations; execution guards and publisher click/keyboard remain. Regression sources cover pressed-link focus, mutable disabled state, translation/membership and existing row switching/direct embedding. UI7 and common EN/AR guide synchronized; source-only, owner build/tests/actual pointer acceptance pending. |
| 2026-10-23 | Shared numeric stepping for every editable numeric role | UI14/24/27 | Owner explicitly generalizes the Purchase Order Details control, including Customers. Reuse InputNumber/QuantityInputDirective with original bounds, signed roles, integer/decimal precision, labels, CVA/events and implicit old-widget formatting made explicit. Shared native min/max validator parity and lazy NgControl preserve validity without dependency cycles; explicit group invalidity reaches the inner input. Books/digest/common guide synchronized; source-only, owner compilation/input/RTL/theme/visual acceptance pending. |
| 2026-10-23 | Stable validation control track and document picker bounds | UI6/14/17 | Owner Company Documents screenshot/request identifies downward field movement and selectable invalid dates. Shared validation-capable rows align all cells to the first34px track; flags/actions retain track alignment and errors remain inline. Company/Driver Documents picker bounds mirror existing strict form/server date ordering through complete local dates and stable bound references. Books and digest synchronized; source-only, owner visual/typing/calendar acceptance pending. |
| 2026-10-23 | Selective reference lookup data cache | UI2/16/28 | Owner approves Country/UOM pilot after inventory. Root memory cache owns subscription-time context, bounded successful snapshots, defensive copies, shared pending lifetime and invalidation fences; existing services opt in and CompanyDriver reuses Country. Typed/inherited success writers invalidate; failure/empty completion/old context do not populate. Feedback modes remain distinct and focus return preserves pending bootstrap. No broad interceptor/settings/document cache. Book, digest and common EN/AR guide synchronized; actual verification remains in feature reconciliation. |
| 2026-10-22 | Complete vendor component and dependent-screen retirement | UI1/24/25/29 | Owner authorizes all old components and every dependent screen. Live shell/domain helpers move to native shared owners; exact presentation consumers migrate before deleting old KT/demo/Sass and unused dependencies. Native PrimeNG directives preserve forms/events; Sigma base/status/control/utilities own theme/RTL and deterministic assets. Stored preference keys and business/API contracts retained; visual/print acceptance remains distinct. Books and digest synchronized. |
| 2026-10-22 | Aligned attachment field and existing actions | UI6/18/14 | Owner PurchaseRequest Documents screenshot shows View below the file and misaligned row Delete. Existing FileField owns projected same-path FileLink with shared34px/8px track; bounded shared exception to important whole-group centering aligns attachment Remove above errors; fixed attachment tables contain long names. Four adjacent existing consumers preserve bindings/actions. Books and digest synchronized; runtime evidence in architecture review. |
| 2026-10-22 | Quantity host geometry and actual startup | UI24/27 | Owner new PurchaseRequest shows blank/unclickable Quantity. Real bounded-table geometry reproduces block host and30px button overlap despite value0/enabled. Correct same-host root and static22px rail; add visible-input/hit-testing and real HTTP startup checks. Books and digest synchronized; exact runtime results remain in architecture review. |
| 2026-10-22 | Quantity entry avoids redundant shared DOM work | UI27 | Enabled real PurchaseRequest20-row draft with three digits:60 button queries and40 unrelated clear-geometry reads become0/0, preserving numeric123 and amount246. Cache button structure/translation and skip geometry scheduling for unbound numeric targets. Book and digest synchronized; full regression and owner latency acceptance recorded in the architecture review. |
| 2026-10-22 | Stable Angular21 effect options | UI1/29 | Installed compiler/runtime declares allowSignalWrites deprecated and inert. Remove three obsolete true options with unchanged callbacks. Book and digest synchronized; actual checks belong to the architecture review. |
| 2026-10-22 | Runtime diagnostics and decorative layer identity | UI24/29 | Full console tracing identifies all duplicate-key warnings in Keenicon's empty-slot loop and four interpolated removed Invoice radio labels. Correct layer identity/native labels and make unknown TestBed bindings throw. Books and digest synchronized; no suppression or changed business values. |
| 2026-10-22 | Native form query interoperability | UI1/27/29 | Full regression suite exposes LeaseAgreement focus querying a custom form component as ElementRef. Explicit read:ElementRef restores the native query without changing validation or shared form APIs. Book and digest synchronized; unused unrelated query cleanup stays outside this bounded repair. |
| 2026-10-22 | DatePicker native clear and disabled contracts | UI17/24/27/29 | Final audit finds five raw Settings dates susceptible to DOM/CVA divergence and disabled input colors overridden by normal styles. Retain publisher clear for raw consumers, adapter capture for Sigma dates, and native-disabled CSS hooks. Book and digest synchronized; regression/build evidence belongs to the architecture review. |
| 2026-10-22 | Stable list/report Select host consistency | UI4/16/24/29 | Owner screenshot333.png exposes stable wrappers overriding the new flex host and clipping label/trigger. Remove both shared block-display overrides; preserve field grid ownership and verify stable/ordinary consumers. Book and digest synchronized. |
| 2026-10-22 | Shared paginator row-count width | UI6/24/29 | Owner screenshot123.PNG exposes full-width host sizing leaking into the paginator Select. Shared intrinsic-width/no-grow exception retains desktop row alignment and narrow wrapping; before/after rendered evidence belongs to the architecture review. Book and digest synchronized. |
| 2026-10-22 | Shared dropdown search and native clear coexistence | UI24/27/29 | Reproduced IconField structural-selector break when the generic clear button became its last child. Preserve publisher children, measure logical-end adornments and restore owned padding; theme/direction and filter-selection regression evidence belongs to the architecture review. Book and digest synchronized. |
| 2026-10-22 | Shared PrimeNG21 hosts, scroll ownership and standalone cycle gate | UI1/6/16/24/29 | Owner Company/NG0919 feedback exposed host-root and owning-module backedges. Root/login/lazy metadata and rendered shared controls now have regression coverage; table scroll container and disabled() lookup signals use actual publisher21 contracts. Books and digest synchronized; exact test/build/visual evidence remains in the architecture review. |
| 2026-10-22 | Sass module theme compatibility | UI24/29 | Licensed Bootstrap5.3.2 source extraction and configuration bridges replace deprecated imports without patching dependencies. Full parsed CSS selector/declaration/cascade comparison is equivalent; module extend aliases and repeated layers are preserved. Build evidence and pending visual acceptance belong to the Sass feature review. |
| 2026-10-22 | Shared shell brand and navigation alignment | UI1/24 | Owner confirms brand width equals sidebar and toggle sits at upper boundary. Shared width includes borders; Pin precedes terminal arrow and nested lists use logical14px increments. Books/digest synchronized; actual rendered geometry remains distinct from owner visual acceptance. |
| 2026-10-22 | Preserve page lookups during query synchronization | UI28 | Individual Edit contact group stayed disabled because a query-only navigation cancelled joined bootstrap lookups before readiness. Compare parsed page paths as well as navigation IDs; query/fragment updates retain reads, real path/record/matrix/outlet changes cancel. Book and digest synchronized; regression evidence in the shared navigation plan. |
| 2026-10-22 | Shared draft/write/read navigation policy | UI10/22/28 | Owner approves navigation during viewing/reads, discard decisions for dirty forms and blocked writes. Existing shell guard reruns once per transition, shared actual form registry retains state/lifetime, and HTTP cancellation distinguishes page and session reads. Books/digest synchronized; source reachability and runtime acceptance remain explicit. |
| 2026-10-22 | Retire legacy shell geometry and repair RTL generation | UI1/25 | Owner continues vendor cleanup. Shared shell uses native classes and owns overflow/gutter; keep configured legacy dimensions and typography while omitting old chrome. Deterministic Sass/rtlcss writes one RTL asset with a drift check instead of deleting its output directory; books and digest synchronized. |
| 2026-10-22 | Retire interactive vendor root edges | UI1/24 | Owner starts runtime retirement after shared cleanup. Source/route/spec graph gates Ngb/provider/script/package removal while vendored Sass/icons/theme remain; error routes stop reinitializing KT plugins after navigation. Book and digest synchronized. |
| 2026-10-22 | Shared direct-row command compatibility | UI7/27 | Settings native table dropdown retirement reuses the existing shared menu via optional row; callbacks keep actual IDs. Dialog return focus resolves the lasting aria-controls trigger rather than a detached popup; books and digest synchronized. |
| 2026-10-22 | Shared command and semantic-token independence | UI1/7/24/27/29 | Owner authorizes shared dependency cleanup. Menu/Popover replace Bootstrap action/CSV portal while retaining contracts; dynamic primary composes the existing owner; semantic status/accessibility owners become Sigma. Rendered tests exposed Popover focus-before-detach, Drawer mask-on-destroy and untracked CSS motion; scoped compatibility cleanup and matching canonical guidance synchronized. |
| 2026-10-22 | Third-level navigation Pin inset | UI1 | Owner requests a small inward adjustment only at level3; use8px logical-end margin and verified publisher aria-level mapping. Book/digest synchronized; other levels and arrow position retained. |
| 2026-10-22 | Preserve Appbar presentation during framework replacement | UI24 | Owner rejects plain shell controls and prefers former Appbar. PrimeNG templates retain branch/icon/copy/flag/account hierarchy using existing Sigma tokens; behavior and feature-field sizing preserved. Book/digest synchronized; scoped geometry and interaction evidence recorded separately from owner visual acceptance. |
| 2026-10-22 | PrimeNG authenticated shell | UI1/27 | Owner approves replacing Metronic starting with shell. Native flex frame, PrimeNG header/menu/drawer/overlays preserve catalog/providers/auth/branch/theme/print contracts, confirmed selection rollback and shared overlay focus. Existing feature Sass retained. Books and digest synchronized; evidence in PRIMENG_SHELL_MAINTENANCE_EVOLUTION_PLAN. |
| 2026-10-22 | Conditional dialog-footer projection | UI13 | ServiceLog upgrade diagnostic NG8011: isolate the create-only hint in a single-root conditional, retain shared footer ownership and original visibility. Book and digest synchronized; compiler/visual evidence is recorded in the Angular18 review. |
| 2026-10-22 | Angular21 platform and PrimeNG control compatibility | UI1/16/17/24/27 | Sequential supported upgrade: standalone root/config, application builder with flat hosting, Zone/interceptor/startup compatibility, PrimeUIX preset, public Select/DatePicker APIs, signal-input boundary, token duplicate contract and native labels. Actual publisher state/overlay hooks replace obsolete selectors. Books and digest synchronized; build evidence and pending manual acceptance belong to the supported-platform review. |
| 2026-10-22 | Effective ES2022 libraries and disabled signals | UI1/8/17/29 | Official CLI21 removes the old lib override; update current guidance without rewriting historical review rows. Read public disabled() values and the native picker disabled state for CVA compatibility; a function truthiness check silently blocks normal controls. Books and digest synchronized; final build/source evidence belongs to the supported-platform review. |
| 2026-10-22 | Angular21 Jasmine bootstrap | UI29 | The application Karma builder discovers specs without require.context. A custom bootstrap pairs BrowserTestingModule with an explicit provideZoneChangeDetection test module; zone.js/testing alone does not preserve Angular21 change-detection mode. Spec typing remains isolated; source checks are not test execution. Book and digest synchronized. |
| 2026-10-22 | Rejected PO releases PR source capacity | Master4; BE14/9; UI4/5 | Owner supersedes the earlier live-PO reservation rule: Pending/Approved reserve, Rejected retains history but releases quantity and allocated discount. Read, filter and write predicates align; canonical books and digest synchronized. Source-only; owner SQL/browser verification pending. |
| 2026-10-22 | Common approval states and reusable document-log adoption | Master4; BE18; UI7 | Owner requires Approve, UnApprove and Rejected across comparable ERP documents, with guarded per-model effects and future Settings policy. Every Log consumer proves tracked coverage, semantic action/reason, root/child ownership and view endpoint. Source review found detached-update before-value provenance is not proven by current inequality check; record it as an acceptance gap. Canonical blocks and digest synchronized; owner source correction and runtime verification pending. |
| 2026-10-22 | Detailed central document log and shared viewer | BE18; UI7 | Owner requests create/edit/approval/all comparable actions for similar documents. Same-save tracked events now carry safe scalar details and optional reason/action; shared typed Log viewer is first used by Purchase Order. Existing metadata history remains. Books/digest synchronized; owner migration/build/runtime acceptance pending. |
| 2026-10-21 | File-level namespace import style | BE1 | Owner requires namespace imports at the top of source files, not repeated beside properties. The four currency navigations use explicit file-level imports; qualified types are reserved for real name collisions. Source-only verification; owner rebuild pending. |
| 2026-10-21 | Cross-namespace member and compiler-cascade gate | BE1/18 | Owner's currency error list has four unresolved `Currency` navigation types in Helpers and 139 downstream member errors. Import the declaring namespace at the top of each referencing file; only qualify for a genuine collision. Triage upstream first, then read a fresh owner build; source-only namespace repair is not build acceptance. Book and skill synchronized; owner rebuild pending. |
| 2026-10-21 | Audited loan schedule revisions and explicit settlement | BE15; UI7/13 | Owner approves separate loan actions and prioritizes logical validation over reference data. Preserve Paid/PV history, archive unpaid generations with revision ownership, conserve principal, require exact payable capacity and explicit bounded settlement interest, preview/version recheck and atomic idempotent source cash. Backend/frontend source and runtime acceptance tracked in BILLS_LOAN_LIFECYCLE_FEATURE_REVIEW. |
| 2026-10-21 | Source-owned loan down payment and retained draft identity | BE14/15 | Owner approves full saved downpayment as a separate zero-interest bank payment and Bill allocation. Exact reliable capacity gap, durable PV proof/replay/correction guards and existing external-settlement distinction prevent duplicate cash. Comprehensive Bill audit proves unique-FK softdelete replacement and deleted Include-row pitfalls; preserve editable one-to-one identity and filter live source rows without relaxing historical cash proof. Canonical books and digest synchronized; source-only and owner schema/runtime pending. |
| 2026-10-21 | Per-model approval tab and action modal | §4.5; Master4, UI7/13 | Owner wants the saved editor's Approval tab and a separate Approval Status action/modal, both displaying one server status/history and both offering eligible Approve/Reject. Current manual steps must be honest; future configurable approval policy belongs to Settings per model. The pattern applies only where the model has a frozen approval lifecycle. Books and digest synchronized; PurchaseReturn source-only, owner runtime acceptance pending. |
| 2026-10-21 | ERP-wide approval rollout with nonfinancial documents | §4.5; Master4, UI7 | Owner extends eventual approval to every ERP document. Financial approval posts, Void flag-cancels without reversal; nonfinancial documents transition state or release actual operational effects, using Reject/Cancel without Void when nothing material needs undoing. Never create synthetic journals. Per-model contracts and PLAN-00 impact map gate rollout. Books and digest synchronized; source-only owner runtime acceptance pending. |
| 2026-10-20 | Conditional Bill UnApprove restored by owner | BE15; UI7 | Owner accepts state-dependent UnApprove. Explicit Approved/no dependencies/open original period permits source-owned unposting and audited return to NotApproved under existing allocation/PR locks; retained positive debit-note target history also blocks correction because restoring its proportional credits after editing the Bill would reuse obsolete source lines. List uses authoritative canUnapprove with batched period checks. Void stays independent, terminal and flag-only. Supersedes prior Bills-only no-UnApprove rule without changing global Void semantics; source-only, owner runtime pending. |
| 2026-10-20 | Source-owned installment payments and historical account roles | BE15 | Owner approves full saved-value Bill installment payment. Durable unique PV/request links, bank/interest role snapshots, exclusive generated Payment journal, same allocation locks, actual principal-only pairing and generic mutation guards preserve paid history. Source audit corrected bank/interest proof and shared JV ambiguity; books/digest synchronized, owner migration/accounting/concurrency runtime pending. |
| 2026-10-20 | Supplier-debit Bill allocation direction | BE15 | Owner accepts screenshot-backed source supplier debit→open supplier Bills, independent of ordinary payable-credit allocation. Explicit optional line SupplierId maps to net posted PartnerId after read-only existing-link validation; no text-derived identity/backfill. Shared effective two-sided capacity/locking, once-only legacy pool reservations and8000-vs8400 rejection apply. Book/digest synchronized; owner migration/runtime pending. |
| 2026-10-20 | General flag-only financial Void and Bill terminal cancellation | BE15; Master3; UI screen08; BE19 | Latest owner instruction explicitly forbids a reversing journal and applies this rule to new financial screens and existing-screen reviews, superseding J-1's reversal and the temporary Bill design. Retain source/JV history, mark voided atomically, guard original period/settlements, exclude effective balances, and keep Journal readable. Bills replaces UnApprove with terminal cancellation and audited flags. Books/digest synchronized; owner migration/runtime acceptance pending. |
| 2026-10-20 | Bills draft/approve posting and payable allocation | BE15 | Owner moves journal creation from Save to explicit Approve. Nullable legacy approval provenance, guarded source-owned reset, immutable posted records, append-only audit and locked opposite-side supplier capacity govern Bills. IsLoan does not prohibit allocation or prove payment. Book/digest synchronized; owner migration/runtime acceptance pending. |
| 2026-10-20 | Stable topbar rendered-editor guard | UI1 | Owner Bill Console reports Navbar disabled false↔true NG0100. Readonly post-render state replaces live DOM template reads; deferred/coalesced NgZone publication and destruction guards match installed Angular17. Synchronous switch/Retry DOM guards retain safety. Book, digest and common EN/AR guide synchronized; owner runtime open/close/navigation verification pending. |
| 2026-10-19 | Safe SQL category and composed-read stage diagnostics | BE18 | Owner's Dashboard500 exposes only a truncated provider stack. Add numeric SQL code/state/class and allowlisted enum stage before frames; preserve exception/cancellation, exclude raw messages/SQL/values. Diagnostic correction source-reviewed; underlying fault awaiting owner reproduction. |
| 2026-10-19 | Reusable authenticated real-time read invalidation | UI2/28, BE17 | Dashboard uses one session-bound/ref-counted SignalR owner plus authoritative typed HTTP snapshot; topic dependency registry and scoped EF postcommit tracking preserve transaction boundaries. Bounded delivery/reconnect/reconciliation and null-source semantics documented; source-only, owner runtime acceptance pending. |
| 2026-10-18 | Persisted working-branch defaults and editor-safe switching | UI1/16 | Owner defers permissions and selects defaults in every eligible screen; one root owner, pre-query bootstrap, value/mode/session precedence and no hidden filter. Books/digest synchronized; CURRENT_BRANCH_DEFAULTS plan/API/review record actual consumers and pending owner runtime acceptance. |

Revision 2026-10-17 — FormSection heading grouping (UI13): icon/copy share one
nonwrapping flex group, copy shrinks and actions wrap separately using existing
12px/compact9px gaps. showMockDataAction defaults true; explicit false hides only
that section's generated mock action. Email Templates Data Fields adopts the
read-only exception; other actions/registration/preferences remain. Book and
digest synchronized; source-only, owner visual/RTL/theme acceptance pending.

Revision 2026-10-17 — Email Templates source conformance: UI27/shared focusField
accepts actual contenteditable; BE3/TrimIncomingStrings preserves exact template
HTML and validates raw subject before trim. Existing shared owners reused, no
parallel focus/text-normalization owner. Books and digest updated together;
owner compilation/keyboard/editor/theme/runtime acceptance remains pending.

Shared backend exact decimal inputs reuse `NonnegativeStoredDecimalAttribute`
and its bulk preflight before mutation (BE8); reject excess input precision
without changing calculated-money rounding. Nullable clock bounds reuse
`ClockTimePolicy`, and December9999 monthly ranges use `CalendarMonthBounds`
with first-day midnight (BE18). Preserve each feature's requiredness, calendar,
overnight and transport decisions; source-only consumer verification is distinct
from runtime acceptance.

Reviewed Workshop adopts additive shared adapters: `dateValueValidator`/`dateRangeValidator`/
`dateTimeValueValidator` reject partial real dates and unordered ranges while local typed
date-times use shared transport (UI17); `EditableRows.canMutate` rechecks confirmed removal
and `removeDisabled` gates the default table action (UI14); `FileField.storedFile` preserves
original-name/path metadata for existing log APIs (UI18); an opt-in FormSection
`sigma-print-flow` releases internal fill bounds through its shared owner (UI21).
Full notes/attachment columns select public `cellClass: 'sigma-data-table__cell--wrap'`;
the shared table owns wrapping rather than feature cell overrides (UI5).

| Date | Topic | Sections Affected | Summary |
|---|---|---|---|
| 2026-10-17 | Explicit table indicator suppression | §6; UI22 | Repeated table-spinner report leads to independent default-true showLoadingIndicator mapped to PrimeNG showLoader. Languages lists select false; actual vendor loading and wrapper guards preserved. Global state changes cannot enable these table masks; source-only visual/build acceptance pending. |
| 2026-10-17 | Text-editor bootstrap read latency | §6; UI28/BE5 | Owner narrows slowness to text list/editor. Join independent Keys/Detail HTTP reads, hydrate fresh typed initial detail once and reuse successful options only for same-request read validation; mutations stay fresh. Navigation snapshot/errors/global loader retained; actual timing and compilation pending. |
| 2026-10-17 | One visible shared progress indicator | §6; UI22 | Owner still sees multiple loaders after requesting application loader. Shared DataTable/button/dialog observe global state and suppress only local visuals, preserving busy semantics and local-only spinners. Languages options/keys and refresh use global owner; duplicate state spinners removed. Source-only owner compiler/visual acceptance pending. |
| 2026-10-17 | Stable text-list update after committed Save | §4; UI6 | Owner places delay after Stored. Existing editor emits complete typed saved snapshots; same All/no-search/key-order page merges canonical visible keys and preserves count. Search/Empty/value-order/incomplete Reset snapshots retain server reload. Global application loader remains per owner's clarification; source-only timing/runtime acceptance pending. |
| 2026-10-20 | Compact import options for dense editors | CSV import workspace; UI6 | Owner scopes Loan Payment Plan to a small Import options button. Shared ImportCsv compact=true reuses the native input/parser/events and DropdownPortal menu, preserves default cards, exact headers and valid-filename/error/reset semantics; FormSection header combines Prepare/Import/Add. Book/digest synchronized; source-only popup/focus/RTL/visual acceptance pending. |
| 2026-10-17 | Committed text application and fallback reads | §9; UI23 | Owner reports slow text Save with duplicate progress. Canonical active-language nonblank overrides merge one key under captured session generation; other cases read fresh fallback, API edits skip UI reload. Scoped text-dialog progress exception is recorded in its review; no global loader change. Source-only owner timing/compiler/visual acceptance pending. |
| 2026-10-17 | Runtime localization request cost | §9; UI23/BE5 | Owner reports slow TopBar language switching. Direct fresh dictionary reads reuse loaded choices; explicit catalog refresh remains authoritative. Immutable path indexing replaces repeated walks; backend batches API sources and reuses only successful request-scoped runtime options without caching mutation validation. No shared tenant dictionary or transport/schema change; source-only timings and build acceptance owner-pending. |
| 2026-10-17 | Resource-key conversion receiver boundary | §9; BE5 | Owner CS1929 identifies an accidental nameof(ResourceManager) receiver in OpeningBalanceResetService. Restore the receiver; audit all converted symbols against generated string properties. Source declarations/references distinguish likely dependent ServerAPI errors; build acceptance remains owner work. |
| 2026-10-17 | Catalog direction and exact translation content | §9; UI25/BE3 | TranslationService uses authenticated catalog RTL metadata and restores source dictionaries on session exit. Exact LanguageTextSaveVM.Value bypasses trimming while ordinary Value/identity inputs retain it. Source-only owner runtime acceptance pending. |
| 2026-10-17 | Controlled dialog workflow footer actions | §7; UI13/24 | Languages uses optional typed footerActions and stable-id footerActionRequested for Previous/Save-and-Next. Shared EditorDialog owns secondary styling, order and Save disabling; features retain translated labels, validation, dirty-discard and busy guards. Empty defaults preserve existing consumers. Books/digest synchronized; source-only owner runtime/visual acceptance pending. |
| 2026-10-15 | Universal table vertical centering | §5.2; UI6/14 | Owner explicitly requests middle alignment in any table. Global native cell rule plus shared DataTable/EditableCollectionTable changes replace prior top/opt-in behavior for current consumers; remove RentalPlanner group top/8px bias. Keep field/error group, horizontal alignment and layout/business contracts. Books/digest/help synchronized; source-only owner runtime/print acceptance pending. |
| 2026-10-15 | Consolidated comparable document editor baseline | §2.5/5.2; UI1/3/13/14/16/24, BE8 | Owner asks to generalize the full refinement set. UI13 owns the combined applicability/conformance checklist; UI1 owns dense header/Notes placement, UI24 totals/footer gap, UI16/BE8 conditional input agreement. Phase3 template and screen02 route implementers to it. Comparable peer sections default to shared tabs; preserve special shapes and feature-specific business contracts. Books/digest synchronized, generated packets refreshed/check required; no application-source migration. |
| 2026-10-15 | Compact heading-only choice groups | §5.2; UI13 | Owner moves Purchase Request Type choices beside section title. Existing projection/flex utilities compose controls; shared FormSection wraps heading/actions within bounds at every width and removes bottom divider/spacing when content is empty. Normal content/control behavior preserved; book/digest/guide synchronized, source-only owner acceptance pending. |
| 2026-10-15 | Equal workspace card edges through editor body | §2.4; UI3 | Owner reiterates existing equal-width rule. Purchase Requests adopts workspace modifier and removes type FormSection mx-2; shared workspace owner removes nested editor-body inline padding, aligning title/type/tabs/content/summary/footer region edges for current consumers. Ordinary editors, vertical bounds and individual summary layouts remain. Book/digest/guide synchronized; source-only owner visual acceptance pending. |
| 2026-10-15 | Full-height document editor tabs | §5.2; UI13/14 | Owner replaces Purchase Requests stacked allocation with Basic Information/Details and separate Documents tabs. Reuse typed workspace EditorTabs, persistent parent controls, guarded switching, invalid-section selection and all-section print. UI13 owns the variant, UI14 distinguishes prior stacked guidance; skill/guide synchronized. No automatic bulk conversion; source-only owner runtime acceptance pending. |
| 2026-10-15 | Complete details-table height chain | §5.2; UI1/13/14 | Owner reports missing vertical scrollbar after adding rows and Basic Information disappearing. Adopt existing sigma-editor-pane on the table-area, reserve the bounded header share without shrink and allocate remaining details with zero basis. UI14 owns the full host/content/wrapper/table/frame rule and combined header/row-overflow acceptance; UI13 example and digest align. No new shared styles, business contract or bulk migration. Source-only; owner runtime/visual acceptance pending. |
| 2026-10-15 | Positive VAT preview allocation parity | Positive VAT remainder; UI19 | Purchase Requests source audit finds shared Angular allocation can give a negative remainder for many tiny positive rows. Mirror backend's exceptional floor/remainder branch; ordinary allocations, signed/zero groups, document totals/rates/payloads remain. UI19 synchronized; source-only, owner numeric/runtime acceptance pending. |
| 2026-10-15 | Shared grid response value readers | §4.3; UI5 | ms-lib removal extracts identical defensive scalar-path/explicit-boolean readers from23 feature mappers into shared grid-row-values. Typed row fields, source paths/fallbacks and missing-value behavior retained; no legacy wrapper or domain inference. Book/digest synchronized; source-only, owner compilation/runtime acceptance pending. |
| 2026-10-14 | Atomic storage failure cleanup | Uploads; UI18 | Shared FileStore accepts optional copy cancellation and removes only newly created incomplete attempts after stream disposal, preserving CreateNew collisions. Atomic callers roll back earlier uploads on later upload/persistence failure; historical files stay. Cleanup failure logs preserve the original error. Book/digest synchronized; source-only owner disk/cancellation/crash acceptance pending. |
| 2026-10-14 | Opened sidebar group reveal | §6; UI1 | Owner requests opened groups move upward to expose contents. Shared main/nested disclosure measures after Angular rendering and sibling collapse, then changes only menu scrollTop within native limits. One pending header, containment/show and search-reset guards; focus/page/horizontal position and close/Pin/default disclosure retained. Bilingual common guide/book synchronized; source-only runtime acceptance pending. |
| 2026-10-14 | Automatic HTTP error history | §8; BE18 | Owner selected native ErrorLogs after missing API discovery. Fresh-context append, ambient suppression/timeout, tenant read boundary, safe type/method diagnostics and capture exclusions promoted with the book. Source-only; owner AddAutomaticErrorLogs/build/runtime/visual acceptance pending. |
| 2026-10-14 | Shared outbound message outcomes | §8; BE18 | Real SMTP test and Fleet reminders reuse typed MessageDeliveryService; append-only tenant read/snapshot/outputs, validated actual send values and safe error keys match final source. Isolated outcome append preserves accepted delivery across log failure/cancellation and reports partial accepted counts without automatic resend. SMS simulation/CC remain outside actual-send coverage. Book/digest synchronized; owner AddMessageLogs/build/SMTP/tenant/failure/output acceptance pending. |
| 2026-10-14 | Audit Trail Update/Delete capture | §8; BE18 | Owner reports only Created across several screens. Disconnected Update/UpdateRange has no database-original baseline; generic capture now follows scalar IsModified writes and the true deletion-marker write after HandleAudit soft-delete conversion. Unchanged tracked saves excluded, explicit forced writes count; no original-value/business-write/schema changes. Book/digest synchronized; source-only owner build/update/delete/retry acceptance pending. |
| 2026-10-14 | Generic Audit Trail interceptor | §8; BE18 | Owner authorizes missing full-stack audit and reusable generic capture via interceptor. Same-save metadata events preserve HandleAudit, tenant scope, nullable No/date, retry/cancel cleanup and affected-count semantics; source-bound strings stay unbounded where needed. Read API freezes stable server pages/cutoff and complete Excel. Owning book and digest synchronized; owner migration/build/save/rollback/UI acceptance pending. |
| 2026-10-14 | Currency policy cache invalidation | §6; UI2 | Currency screen review finds cached precision survives successful writes. Owning typed CurrencyService invalidates the existing policy cache only after successful Create/Update/Delete; next load reads server policy, preserving failure/manual Save/load(force) and formulas. Book/digest synchronized; source-only owner compilation/policy-read acceptance pending. |
| 2026-10-14 | Lookup identity provenance | §8; UI16/BE8 | Customer Requests discovery proves Customer/GetSelect returns Individual/Company Partner ids while legacy FK targets Customer:PersonBase. Reconcile select principal/subtypes/payload/validation together; owner confirms empty/test data before FK retarget. Report owner migration, no data commands. Books/digest synchronized; source-only runtime pending. |
| 2026-10-12 | Shared stored decimal and calendar/clock boundaries | §11; BE8/18 | Exact input scale/magnitude preflight reused by Timesheet/Deduction; safe upper month and nullable clock helpers reused by Staff Duty/OT/Attendance. No schema or runtime claim. |
| 2026-10-11 | Leave summary small padding adjustment | §1; UI24 | Owner still sees small overflow; existing public verticalPadding12→10 saves4px/card,16px over four rows. Two columns/equal heights, original comfortable fonts/icons/text/values retained. Current consumer evidence synchronized; visual fit remains owner-pending. |
| 2026-10-11 | Fixed summary columns and equal heights | §1; UI24 | Owner requests two Leave summary cards per row, equal heights and a very small reduction. Shared optional columns/equalHeight/verticalPadding own tracks/rows/padding; defaults preserve other consumers and print. Leave retains values/order/hints and original comfortable fonts/icons with12px instead of14px vertical padding. No scrollbar hiding or content clipping; visual/no-scroll acceptance pending. |
| 2026-10-10 | CSV preview lifetime | §10; UI22 | Overtime reuses additive shared parsingChanged/fileFailed/reset events, clears previous rows on replacement, freezes month context, blocks invalid/pending submission and remounts the parser per dialog session. Existing fileImported consumers remain compatible; Angular17 destruction uses onDestroy with a local flag. Book UI22 and digest synchronized; source-only, owner parser/dialog acceptance pending. |
| 2026-10-10 | Leave inline filters and checkbox alignment | §3.2; UI4 | Leave adopts stable inline actions/caption, `mainColumns=7`, date `--wide` and shared `columnGap=8`; shared checkbox heading/control tracks replace field-bottom alignment for this combination. Intrinsic 15px square, 34px control track, 4px gap and 720px heading-release reuse the shared owners. No feature offsets; other layouts unchanged. Source-only, owner visual acceptance pending. |
| 2026-10-10 | Accepted discard emission order | §7; UI10 | Deduction source review fixes accepted X/Cancel/Escape close being blocked by the confirmation flag that is cleared only in finalize. Accepted exits retain visible-session/save/load/parsing gates; duplicate defer guards and cancellation restoration stay. UI10 and skill synchronized; source-only owner interaction acceptance pending. |
| 2026-10-10 | Optional initial close-button focus | §7; UI13/27 | Deduction review restores in-dialog focus while keeping calendars shut: shared EditorDialog optional closeButtonId is default-empty, consumers call shared focusField with openOverlay=false after shown for their visible session. Existing consumers and trap/Escape/closeDisabled/discard semantics unchanged. Owning UI13/book1.96 and skill synchronized; source-only owner keyboard/runtime acceptance pending. |
| 2026-10-10 | Checkbox filter control-line centering | §3.2; UI4 | Owner requests documentation of ProcessedPayrolls checkbox centering: match neighbouring control-box centres independently of headings/error height, preserve intrinsic checkbox size and wrapped/RTL/theme behaviour. UI4 owns the desired rule; local 24px padding is implementation debt and must not become a copied global constant. Documentation only; shared implementation/visual verification pending. |
| 2026-10-10 | Shared date-only ordering validation | §8.4; BE3 | Leave uses DateOnly and inclusive duration. DateAfter adds DateOnly handling with the same strict default and explicit AllowEqual opt-in as DateTime; requiredness stays separate. Owning BE3 and digest synchronized; source-only, owner compilation/runtime acceptance pending. |
| 2026-10-09 | Shared branch-settings editor | §7; UI13 | Owner restores Rental and Lease entries. Existing TariffCard branch editor becomes one shared business owner adopted by all three lists, preserving tenant-wide replacement API, empty Add, validation-on-Save, public modal/collection bounds and deferred route/modal discard. Owning UI13 and skill synchronized; source-only, owner compiler/runtime/visual acceptance pending. |
| 2026-10-09 | Continuous generated-packet maintenance | How to use; Master8 | Owner requires ongoing refresh: initial drift and canonical/template/manifest changes trigger generator-only regeneration, semantic source/reference-role review and final Check in the same task. Derivative maintenance is authorized in source-read-only reviews without source scope expansion; unresolved conflicts remain explicit. Master1.28, AGENTS, templates/manifest and packets synchronized. |
| 2026-10-08 | Mandatory screen user guide | §10; Master7 | Owner requires an in-app guide after each completed screen. Create/update the owning module topic before final handoff, reuse the existing UserGuide components, author EN/AR purpose/steps/actions/constraints from final source, and record route/menu/content evidence. Existing guides are maintained without duplicates; scope and owner acceptance boundaries retained. Master1.27, AGENTS and Phase06/artifact templates synchronized; Phase06 regenerated and semantically reviewed, with pre-existing unrelated packet drift retained for its owner. |
| 2026-10-06 | Standalone and Angular17 consumer contracts | §1, §3.4, §6; UI1/4/22/28 | Lease compiler feedback: verify exact export paths, standalone imports, public input literals and remaining injected/base members. Filter directives come from their directives file; StateMessage supports loading/empty/error; non-API info retains its injection; timer plus takeUntilDestroyed cancels deferred print without unsupported DestroyRef.destroyed. Book/skill synchronized (1.88); source checks do not certify compilation, owner build/runtime and packet regeneration pending. |
| 2026-10-06 | Inline detail feedback options | §6 | UI2/22; BaseService.getById optional skip-error header, Lease Deposit payment-method context adoption; default feedback preserved, source-only |
| 2026-10-05 | Shared column presentation identity | §4.3; UI5 | DataTable header/body keys combine the real field and stable header translation key, supporting an approved numeric column plus derived status presentation of the same field. Sorting, row identity, formatting, statuses and exports remain unchanged; each pair is unique. Stock Reports first adoption. UI1.74; source-only, runtime/visual acceptance and packet regeneration/semantic review pending. |
| 2026-10-04 | Typed report-family composition | §6.1; UI20 | StockReports eight consumers reuse canonical visual owners through typed family lifecycle/template composition and complete-response flag/count proof. Adapt DataTable pageSize to resolver rows before local state writes. Formulas/proxies remain feature-owned. UI1.73; source-only, owner acceptance and packet regeneration/semantic review pending. |
| 2026-10-04 | Read-only numeric blue badges | §1; UI14 | Owner generalizes the existing Workshop Price/Charges highlight to every non-editable numeric cell in new/reviewed collection editors. Public numeric/center headers and shared value/highlight spans retain 34px, 12% primary tint, 700 weight and 6px radius; Requisition Create PR adopts Remaining Quantity/Amount/Tax/Gross. Editable controls, formatting, calculations, payloads and other presentation owners unchanged. UI1.69; source-only, visual/RTL/theme/print acceptance pending. |
| 2026-10-04 | General numeric entry and price cells | §1; UI14/16/19/27 | Owner explicitly generalizes select-on-entry for numeric fields. Shared standalone NumericFocusDirective selects values without control mutation; native inputs opt in during scoped reviews. Nine Workshop consumers adopt it, and Job/Estimate numeric read text uses the shared 34px alignment treatment. Three-pane lookup labels shrink inside their column; required English wording becomes Required field. UI1.67; source-only, owner pointer/keyboard/RTL/theme/visual acceptance pending. |
| 2026-10-04 | Shared three-pane editor | §1 | Owner requests Job/JobEstimation columns Details → Jobs → selected Job details. Shared form/body/pane/grid classes own column widths, container-responsive placement and print release; both consume them with one-column master fields and ng-container formArrayName. Existing scroll, summary/footer and business behavior retained. UI1/13 (1.66); source-only, owner visual/RTL/narrow/print acceptance pending. |
| 2026-10-04 | Smaller master-detail totals | §1 | Owner requests smaller total cards to preserve detail visibility. Shared SummaryCards adds opt-in slim horizontal density (6px/10px padding, 20px icon, 6px gaps, 1rem values); Workshop Job/Estimate/WorkOrder use slim/row/min140/max80. UI14/24 (1.65); source-only, owner visual acceptance pending. |
| 2026-10-03 | Workshop shared recovery adapters | §3.3, §5.2, §6.1, §10 | Shared real-date/range/time validators and local typed datetime transport; confirmation removal rechecks busy state; table removeDisabled; optional successful FileField metadata; opt-in FormSection print release; public wrapped cells for full notes/attachments. Books UI5/14/17/18/21; existing defaults and feature business contracts retained. Source-only, owner input/print/runtime verification pending. |
| 2026-10-03 | Atomic file selection and dialog print isolation | §5.2, §6.1, §7 | Logs Movement/Agreement documents reuse FileField selectionOnly with typed File controls and shared validation; FileLink opens actual persisted paths using existing API origin. Check Card uses shared opt-in dialog print scope and ReportPrintSession options; existing no-argument callers retain behavior. Owner-reported TS4104 corrected with mutable dropdown options. Books UI16/18/21 (1.63); source-only, owner build/runtime/RTL/theme/print acceptance pending. |
| 2026-10-03 | Shared invoice line-tax allocation and currency wording | §10 | Job Invoice on Customer and the affected Close invoice preview adopt shared allocateDocumentTax, matching VatPolicy proportional per-rate allocation, largest absolute remainder/first tie and zero-net behavior with backend ledger precision. Shared settings-based English amountInWords preserves currency display ownership. Workshop-linked MiscellaneousInvoice rows/header/journal reconcile; previews remain out of write payloads. Book UI19 (1.62); source-only, owner build/runtime/visual/ledger acceptance pending. |
| 2026-10-03 | Concrete delete-reference labels | §10 | Staff delete reports used in Partner although the FK can belong to a derived company/customer/supplier. Shared usage checks resolve the matched runtime entity only for inheritance hierarchies, retain ordinary AnyAsync and business/inheritance/owned-row predicates, and translate Partner subtype categories in en/ar without returning saved contents. Book BE8 (0.76); source-only, owner actual-reference/runtime acceptance pending. |
| 2026-10-03 | Shared early step-form duplicate validation | §6.2, §8.4 | Owner applies blur checks to all real step forms. Shared validator caches normalized value/edit identity, cancels stale requests and retries failures; shared gate commits focused edits and awaits pending checks for every forward/Save route. Individual/Company/Staff use existing unique keys, Lease only its existing validation. Authenticated CheckUnique whitelists UniqueColumns and shares final-write comparison; no schema/write protections changed. Books UI12/19 (1.61), BE8 (0.75); source-only, owner runtime acceptance pending. |
| 2026-10-03 | Explicit same-day date ordering | §8.4 | Staff owner permits Confirmation on Joining day. DateAfter adds AllowEqual=false default; Staff Add/Update opt in, while document expiry remains strict. UI comparison/minimum and localized messages match the frozen rule; optional dates stay optional. Book: BE3 (0.74). Source-only; owner compilation/runtime acceptance pending. |
| 2026-10-03 | Fixed range delimiter and one tab section title | §3.3, §6.1 | Owner requests a fixed dash separator and spaces during date-range editing, plus removing SupplierStatement repeated table titles and documenting the rule. DatePickerDirective protects/capture-normalizes the marker before PrimeNG parses once, preserving clear/history/single-date and validators. Reviewed tabbed reports use the Tab caption on screen and utility-hidden print headings; Supplier Statement adopts it. Books: UI17/20 (1.60). Source-only; input/visual/runtime acceptance pending. |
| 2026-10-03 | Stable filter editing and feedback reservation | §3.4 | Owner extends moving-filter repair to Customers/Suppliers/Staff Balance Summary. Shared FilterPanel stableLayout bounds control widths, top-aligns fields and reserves a zero-count badge slot. FieldError reserveMessage reserves the actual translated wrapped geometry in the same cell as the active alert, without clipping or duplicate alerts; default consumers retain previous behavior. Supplier uses the frozen More Filters shape. Books: UI4/19/20 (1.59). Source-only; visual/runtime acceptance pending. |
| 2026-10-03 | Sidebar disclosure ownership | §6 | Owner reports groups cannot close after selecting a leaf. SidebarMenuComponent separates route highlight from disclosure at both levels, reuses one groupHeader and one sibling-state helper, and isolates native disclosure/Pin clicks from Metronic. UI1 owns the rule; source-only, owner runtime/visual acceptance pending. |
| 2026-10-03 | Shared 15-row table default | §4.1, §6.1 | Owner requests default 15 rows, explicitly superseding 20. DEFAULT_PAGE_SIZE drives shared initial/fallback rows and all Suppliers pagers; standard choices include 15 and normalize the former standard. Explicit user sizes, minimum 10 and report completeness/print/export/totals stay with existing owners. Books: UI6/20 (1.55). Source-only; owner runtime acceptance pending. |
| 2026-10-03 | General title/filter card match | §2.4, §6.1 | Owner requests general title styling like the filter card. FeatureTitle, list filters and report filters reuse one theme-scoped background and border/shadow/accent/radius; title retains its layout with filter-like padding. Canonical report title edges align by default; former modifier remains compatible. Shared title print is white/readable without shadow. Books: UI3/4/20 (1.54). Source-only; owner visual/runtime acceptance pending. |
| 2026-10-03 | Shared report print session and local-sort paging | §6.1, §10 | Suppliers reports consume ReportPrintService.createSession(DestroyRef) for one-frame full-row preparation and restore/cancellation; DataTable forwards local firstChange offsets so PrimeNG sorting and controlled page state agree. Lazy requests and print paging owners remain unchanged. Reconcile the obsolete §10 Transitional deep-fill check with the existing UI6 fill input rule. Books: UI6/21 (1.53); source-only, owner runtime/visual acceptance pending. |
| 2026-10-02 | Follow Up Details paging and title alignment | §6.1 | Follow Up keeps an unpaginated Summary and adds the existing complete-array controlled Details paginator with default 20 rows and shared options; tab selection retains page/size, Search/filter/reset/drill-down reset offset, and print/Excel preserve complete scope while print restores state. The existing `sigma-report-panel--aligned-title` modifier aligns title/filter cards. Book: UI 6/20 (1.51); source-only, owner visual/runtime acceptance pending. |
| 2026-10-02 | Follow Up professional summary tabs | §6.1 | Follow Up adopts the frozen professional summary within the existing Details/Summary workspace tabs: responsive 960px Summary maximum supersedes the provisional 520px example, shared totals cards present server-owned additive metrics, comparison bars remain shared-grid custom cells, and the user action drills into the raw username. Active-section Excel and full print of KPI cards plus both arrays restore state; formulas remain in the frozen contract/review. Book: UI 20 (1.51), existing UI 13/21 contracts; source-only, owner visual/runtime acceptance pending. |
| 2026-10-02 | Compact summary with report tabs | §6.1 | Owner chooses Details and Summary tabs in Follow Up. Existing shared workspace tabs and typed grids retain mounted complete arrays, feature-owned responsive summary width, active-section Excel and full print irrespective of selection. Book: UI 20 (1.50), existing UI 13/21 contracts; source-only, owner visual/runtime acceptance pending. |
| 2026-10-02 | Report transport and bounded panes | §6.1 | Complete report responses use `lazy=false`; frozen paged responses retain `lazy=true`, server paging and authoritative counts. Independently visible bounded panes cover complete `paginator=false` sections and complete local-paginator sections, while full-document flow uses `scrollable=false` only for proven complete arrays. Books: UI 6/20; documentation only. |
| 2026-10-02 | Mandatory shared report tables | §6.1 | Owner requires every report table in new or reviewed work to use typed `app-data-table` columns. Full-document flow may use one outer frame with `scrollable=false`; independently visible bounded sections use separate overflow-hidden boundaries and shared row viewports. Existing native report classes remain compatibility-only until scoped review, and the shared grid owns row palette/hover treatment. Complete-array proof, backend totals, print flow and hierarchy remain required; missing shared hierarchy capability is solved in the shared component within the report task. Books: UI 6/20 and report navigation; documentation only. |
| 2026-10-02 | Aligned report title/filter cards | §2.4, §6.1 | Owner requests matching widths in Customer Statement and Receivable Age Analysis. Shared opt-in sigma-report-panel--aligned-title removes title inline expansion only; both cards share the panel content edges across responsive padding and directions. Other report defaults and block spacing retained. Books: UI 3/20 (1.46); source-only, owner visual acceptance pending. |
| 2026-10-02 | Individual dead-root reconciliation | §6, §10 | Existing Master 5 G12 applied to unused Individual PersonBase/Partner/PartnerAddress roots; 39 source files retired with no consumers or config migration. UI backlog 43 records evidence; existing mergeSelectOptions and complete collection busy gate adopted under UI 16/18. No new policy or backend/data deletion. Source-only; owner acceptance pending. |
| 2026-10-02 | Saved lookup options and upload-safe navigation | §6, §10 | Company and nested Driver reuse pure mergeSelectOptions with incoming-first labels and number/string ID comparison; inline lookups retain explicit Retry and one feedback owner. Nested tabs/document mutations use existing tracker busy signals to prevent file-control teardown mid-upload. Books: UI 16/18. Source-only; owner delayed lookup/upload acceptance pending. |
| 2026-10-02 | Individual review recovery and validation | §10 | Preserve applied filter state on editor/action return, freeze the submitted form while saving, guard badge navigation, show shared file control errors and reject blank required card text in the existing factory. Owning books UI 10/12/18; source-only, owner delayed/failing-save and input acceptance pending. |
| 2026-10-02 | Evidence-based report prevention | How to use; §6.1 | Owner asks to prevent ReceivableAgeAnalysis review failures recurring. Actual consumer/producer evidence; paged Result vs complete arrays; conditional FormGroup, reactive filter lifetime/date validity, conditional aging meaning/labels, one error owner and above-cap acceptance. Master 5, UI 6/8/20/29, BE 17 and report catalog; Phase-02/06 templates/dependencies and generated packets reconciled. Documentation only; seven application findings remain open. |
| 2026-10-02 | Neutral shared export buttons | §6.1 | Owner rejects green Customer Statement exports. Shared variant uses global neutral tokens and quiet primary hover/focus for both themes; no later dark export base or feature palette. Existing export actions/guards retained. UI 20/24/25; owning UI 20 and packets updated, source-only. |
| 2026-10-02 | Tab labels without duplicate headings | §6.1 | Owner removes Customer Statement's extra headings on screen. Screen-media hiding removes the layout gap; panel accessible names and full-report print headings remain. UI 20/21 and packets updated, source-only. |
| 2026-10-02 | Active report section exports | §6.1 | Customer Statement ordinary Excel dispatches to selected full-array/grid columns through shared formatter and current translations. Selected count controls availability; voucher-type grouping uses active ledger/advance lines and is unavailable on incompatible sections. Existing formula, full-print and paging retained. UI 8/20 and packets updated; source-only. |
| 2026-10-02 | Bottom-pinned report paginators | §6.1 | Customer Statement reuses shared fill mode like BalancesSummary; shrinking flex layers bound the active row viewport and keep pager at card bottom. Shared scrollToStart wraps public PrimeNG Table.scrollTo for tab resets. Print selects flow and normal section layout; UI 6/20/21 and packets updated, source-only. |
| 2026-10-02 | Report local pagination and print | §6.1 | Owner approves per-section local pagination in Customer Statement. Shared default size/options and resolveListPaging; independent controlled offsets/sizes, filter/search reset to first page. Print preparation disables pagination for full rows and restores it on print/cancel/failure, with scheduled-frame cleanup; exports/totals unchanged. UI 6/20/21 and packets updated; source-only. |
| 2026-10-02 | Shared report grids | §6.1 | Owner chooses BalancesSummary presentation for every Customer Statement section. Typed shared grid columns preserve fields and conditional due amount; scrollable=false/lazy=false/paginator=false retains full data and one external frame. Shared flow owns print wrappers/surfaces; default lists unchanged. UI 6/20/21 and packets updated, source-only. |
| 2026-10-02 | Shared tab counts and report sections | §6.1, §7 | Customer Statement adopts four workspace tabs per mode while retaining Ledger/Outstanding radios and existing section conditions. Shared optional count badge; tabs outside one frame; screen-only panel hiding preserves full-report print. Owning UI 13/20/21 and generated packets updated; source-only, owner acceptance pending. |
| 2026-10-02 | Shared paging comparison | §4.1 | Owner approved prevention after BalancesSummary assigned pageSize before comparing it. Shared resolveListPaging compares the previous state before writes; size-only page-1 changes fetch, identical state skips. BalancesSummary adopts helper and switchMap/defer requests; other screens adopt in their review. Owner also aligns the main total card with filter width. Books UI 6/28; source-only, runtime pending. Generated packets regenerated from the owning sources. |
| 2026-10-02 | Empty report preview and reference move | §6.1 | Owner requests Customer Statement null date/customer defaults and visible empty tables; valid search and response-only values/actions remain. Trial Balance reference moves byte-for-byte to Accounts; current book paths and imports follow, URL preserved. UI 20/catalog updated; source-only. |
| 2026-10-02 | Reference conformance evidence | How to use it | Owner identified a documented-reference mismatch in Customer Statement. Require a proportional before-edit and final source conformance table in existing artifacts; book changes cannot retroactively authorize deviations. Master 5 and AGENTS.md updated together; source-only does not certify visuals. |
| 2026-10-02 | Shared bounded statement report | §3.2, §6.1 | Customer Statement refactor reuses report strip/totals/date/money/buttons/states and adds opt-in bounded report shell/table styles, shared toFilterParams and inline lookup suppression option. Other report consumers adopt when reviewed. Books: UI 2, 16, 20, 21, 22. Source-only; owner build/print/RTL/theme acceptance pending. |
| 2026-09-23 | i18n & Router | §6, §9 | TS1117 duplicate key prevention; Avoid duplicate `Router` injection |
| 2026-09-23 | Layout & Styling | §2, §3, §7 | 8px filter alignment; Workspace tabs; White icons on solid buttons |
| 2026-09-23 | Endpoints & Modals | §7, §8 | `GetByWithNavigationsId` route convention; `primaryActionVisible` view-only invariant |
| 2026-09-24 | Layout & Table | §2, §4 | Bounded route frame; Bottom-pinned paginator; RTL paginator safety |
| 2026-09-24 | Templates & Cards | §2, §5 | `.feature-panel` as Primary Card; `@for` tracking `track row` fix |
| 2026-09-24 | Table Empty State | §4, §9 | `general.noDataFound` shared translation invariant |
| 2026-09-24 | Skill Restructuring | All | Reorganized 14 chronological edge cases into structured topical sections |
| 2026-09-24 | Global Loader Architecture | §6, §10 | Two-tier loading (Global Metronic overlay via LoadingService + local UI signals); Lookup race prevention |
| 2026-09-24 | Backend IRepository Convention | §8 | Standardize FindByIdAsync<T> convention; prohibit non-existent GetByIdAsync |
| 2026-09-24 | Subscription Ownership Invariant | §8 | Enforce server-owned SubscriptionId; prohibit manual assignment or mutation |
| 2026-09-24 | Canonical Backend Patterns | §8.1 | Codify 4 strictly binding backend service patterns (Normal, Master-Detail no financial effect, Master-Detail with financial effect, Settings) |
| 2026-09-24 | Query Convention | §8.2 | Prohibit bespoke Search...Async methods; enforce GetManyAsync(ListSmBase) override with FilterHelper |
| 2026-09-24 | Datepicker & Status Standards | §3.3, §4.3, §7.6, §10 | Strictly prohibit native `<input type="date">`; mandate `p-datepicker` (`selectionMode="range"` for date ranges); mandate `@ViewChild(..., { static: true })` + `initColumns()` in `ngOnInit()` + fallback `value` for status translation |
| 2026-09-24 | Current Month Default Date Range | §3.3, §10 | Mandate default value of date range filters to current month (first day to last day: `[1st, lastDay]`) |
| 2026-09-24 | Screenshot & Reference Evidence Boundary | §1.1 | Separate visible content evidence from implementation authority; require source checks and frozen owner contracts for backend semantics before coding |
| 2026-09-24 | Financial Preview Configuration | §8.3 | Keep configurable rates backend-owned; expose effective values for live preview and avoid duplicating constants in the frontend |
| 2026-09-24 | List Sorting & Audit Actions | §8.2 | Bind sort fields inside `ListSmBase.Filters` with allowlisted stable ordering; keep append-only log permissions explicit across terminal states |
| 2026-09-24 | Typed Directive Inputs | §5.2 | Avoid pairing a bare attribute selector with a property binding for the same typed directive input |
| 2026-09-24 | Full-Page Master-Detail Editors | §2.4 | Keep aggregate header fields above a group selector/detail workspace, preserve typed `FormArray` ownership, render all groups when printing, and retain list query state on route round trips |
| 2026-09-25 | Routed Form Sections | §2.4 | Use shared `app-form-section` for bounded editor panes and keep Save/Cancel in the footer outside the clipped form body |
| 2026-09-25 | Pane-Level Scrolling | §2.4, §10 | Keep routed editors viewport-bounded at every responsive width; scroll long sections and master/detail panes internally while leaving the action footer visible |
| 2026-09-25 | Reference Screen Alignment | §2.5 | Compare card surface, border, padding, corners, shadow, error/empty, table, and paginator behavior against the requested Sigma reference; align filter width with the visible title bounds |
| 2026-09-25 | Job Estimation UI Preferences | §2.5 | Keep Job Estimation outer panels square with visible shadows and hide the Job Details section heading; scope these choices to this feature |
| 2026-09-25 | Job UI Reference | §2.5 | Use Job Estimation as the Workshop Job layout/interaction reference while preserving Job-specific fields and domain rules; defer row-action workflows until specified by the user |
| 2026-09-25 | Lubrication Job Workflow | §2.5 | Inspect separate workflow buttons against existing frontend/backend capabilities; implement the confirmed Lubrication Job create flow through its existing contract and shared Sigma components without inventing unrelated list/schema behavior |
| 2026-09-25 | Mode-Specific Editor Lookups | §6, §7 | Load only option lists used by controls in the active mode; use detail DTO labels in View and avoid warnings from unused edit-only lookups |
| 2026-09-25 | Lookup Failure Diagnosis | §6 | Keep required option failures visible; use HTTP status and shared authentication/route configuration to locate the cause; check local/remote login-to-API signing alignment without exposing secrets, and never weaken authorization to hide a warning |
| 2026-09-25 | Lazy HTTP Interceptor Scope | §6 | Ensure services used by the lazy layout resolve from its configured HttpClient injector so bearer-token interceptors are applied; diagnose isolated 401s through provider scope |
| 2026-09-25 | Mixed-Source Data Grids | §4 | Use a record discriminator and composite key, identical typed projections on both EF set-operation branches, server-side combined count/sort/page, and source-valid row actions |
| 2026-09-25 | Approval Lifecycle | §4 | Keep status server-owned; allow pending-to-approved/rejected only; enforce terminal edit/delete locks in backend and mirror action visibility in the UI |
| 2026-09-25 | Mixed Job Approval Actions | §4 | Dispatch unified-grid row actions by record type to Job or Lubrication Job routes/services; show View always and Edit/Approve/Reject only while pending |
| 2026-09-25 | Filled Form Section Sizing | §2.4 | Ensure the shared form-section host and `[fill]` section propagate bounded pane height so master/detail content does not collapse to intrinsic height |
| 2026-09-25 | Detail DTO Navigation Shape | §8.2 | Check navigation cardinality against detail DTO types and omit unused navigation members to prevent runtime AutoMapper failures |
| 2026-09-28 | Documentation-system unification | All | Skill made the digest of the canonical books: every section cites its owning block, and the learning protocol writes the book and the skill together. Decisions from `reviews\SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md` applied: container-fill host plus no-page-scroll chain (§2.2–2.3); filter margin `0 8px 6px` (§2.4, §3.1); no calendar icon (§3.3, §7 item 7); §4.1 labelled Transitional pending the `app-data-table` fill mode; `track $index` rationale corrected; typed range snippet; tab colours left to the shared component; five backend patterns with Pattern 2's reference flagged; multi-save transaction rule (verified against `MiscellaneousInvoiceService`); page size 10 clamped 1–100; recorded exceptions for extra read endpoints; Job-specific preferences moved to the Job review artifacts. All rules promoted to UI 0.69 and BE 0.17 in the same change. New §2.3 (no page scroll) shifted §2.3–2.5 to §2.4–2.6; section numbers in earlier rows use the old numbering |
| 2026-09-28 | Screenshot-backed scope | §1.1 | Rule 6: a user request that puts a screenshot's missing business in scope approves existence and labels only; details stay Missing. Book: Master block 2 |
| 2026-09-28 | Suggested names in the report | §10 | Checklist item: suggest a migration name and one commit message per affected repository; never create either. Book: Master block 7 |
| 2026-09-28 | Dialog body padding | §7 (4a), §10 | `[contentPadded]="true"` on new/refactored editors; no feature wrapper padding. Found on Labour Activities (fields touched the dialog edge). Book: UI block 13 "Body padding", backlog 36 |
| 2026-09-28 | Update map tenant ignore | §8.2 (5), §10 | Update maps must ignore `SubscriptionId` and `No` from `UpdateBaseVm`; missing it made Labour Activities Edit throw "SubscriptionId cannot be changed". Book: backend block 4 (already canonical; this row closes the digest gap) |
| 2026-09-28 | Paginator Page Report | §4.6, §10 | Mandate `currentPageReport="<feature>.showingEntries"` with `{first}`, `{last}`, `{totalRecords}` placeholders in `en.ts` and `ar.ts`. Book: UI block 6 |
| 2026-09-28 | Paginator Page Report (review) | §4.6, §10 | Scoped to new/refactored lists; existing `pageReport` keys stay compliant; full PrimeNG placeholder list (verified in PrimeNG 17.18 source); `{{…}}` allowed in hand-built ngx-translate pagers; `general.showingEntries` banned until backlog 37. Book: UI block 6, backlog 37 |
| 2026-09-28 | Settings reconciliation scope | §8.1 (4) | `SyncByKeyAsync` loads and delete-by-omits the whole tenant table, and the reference `ChargeSettingsService` no longer uses it; reconcile by key inside the set's scoped query; duplicate policy may be reject. Found on Labour Tariff. Book: backend block 16 |
| 2026-09-28 | Removing a member | §8.2 (8), §10 | Symbol-wide consumer search when a member is removed or renamed; cascade build errors fixed upstream first. Found when `Job.ApprovalStatus` was removed but `JobEstimationService` still set it. Book: backend block 18 |
| 2026-09-28 | Tabs dark theme | §7 (3) | `app-editor-tabs` owns its dark theme via `:host-context`; plain `[data-bs-theme='dark']` never matches in an encapsulated stylesheet. Found on Opening Balances and Labour Tariff. Book: UI blocks 13, 25, backlog 38 |
| 2026-09-28 | Borrowed services need a layout provider | §6 (3), §10 | Lookup services borrowed from other features also need a `LayoutModule.providers` entry; Labour Tariff showed its lookup error because `StaffProfileService` had none. Book: UI block 1 |
| 2026-09-29 | Missing detail standing rule | §1.1 (7) | Owner: resolve missing business with the closest correct existing option or a minimal new element, record and report; no stop-to-ask except destruction, access and accounting. Found on Labour Activities Report. Book: Master block 2 rule 6 |
| 2026-09-29 | Removing a member — frontend consumers | §8.2 (8) | Consumer search includes the Angular app. Found when `Job.ApprovalStatus` was removed: Jobs lost Edit, the Lubrication Job editor opened locked. Book: backend block 18 item 5 |
| 2026-09-29 | Dropdown empty value | §10 | Dropdown controls start at `null`; blank text options removed. Found on the Jobs Insurance Company filter (clear icon on an empty field). Book: UI block 16 |
| 2026-09-29 | TypeScript lib level | §10 | `tsconfig.json` `lib` is es2018; avoid ES2019+ APIs because agents cannot build. Found when `flatMap` failed with TS2550 in the Job Labour Time dialog. Book: UI block 29 |
| 2026-09-29 | Bare form reloads | §10 | Every `<form>` binds `[formGroup]`. Found when Add in the Job Time Logs dialog reloaded the app. Book: UI block 19 |
| 2026-09-29 | Sales invoice journal direction | §8.1 (3) | Customer debit, revenue and VAT credits, accounts resolved before saving. Found while adding Close Job, which raises a workshop Miscellaneous Invoice. Book: backend block 15 |
| 2026-09-29 | Link Accounts completeness | §8.1 (3) | Placement rule for auto-created link accounts (seed default → name/category group → Manual). Found when invoices failed on unlinked charge types. Book: backend block 15 |
| 2026-09-29 | Combined projections | §8.2 (9) | Assign every DTO member on every `Concat`/`Union` side. Found when the Jobs grid failed after `Status` was added to Job rows only. Book: backend block 18 |
| 2026-09-29 | Journal posting policy | §8.1 (3) | Source-owned journals, post on save vs on approve, period lock incl. Month Close, cost-center defaults, `JournalPostingException`. Found in the journal posting review (`reviews/JOURNAL_VOUCHER_POSTING_FEATURE_REVIEW.md`). Book: backend block 15 |
| 2026-09-29 | Link Accounts completeness — reuse | §8.1 (3) | Reuse the only same-name posting account in the category before creating one. Found when the owner asked whether unlinked existing accounts are proposed. Book: backend block 15 |
| 2026-09-29 | Journal engine foundation | §8.1 (3) | Money rounding by base currency, line branch default, counter-based JV numbers, resolver split behind interfaces. Found in the resolver review (`reviews/JOURNAL_VOUCHER_RESOLVER_FEATURE_REVIEW.md`). Book: backend block 15 |
| 2026-09-29 | VAT and totals rounding | §8.1 (3) | Round in the domain at computation; VAT per line via `VatPolicy` (rate is a percentage, 5); total = amount + tax; bill discount spread over expense lines. Found: invoices and bills charged 0.05 % VAT. Book: backend block 15 rule 8 |
| 2026-09-29 | Engine never rounds | §8.1 (3) | Money scale is validated, not fixed, for every voucher (`FinancialNumberPolicy`); round at the source. Owner correction of the 0.26 safety net. Book: backend block 15 rule 8 |
| 2026-09-29 | Deferred work folder | §8.1 (3) | Deferred plans live in `reviews/Deferred/` (index README); tax rate to be read from settings. Book: backend block 15 rule 8, backlog 19–20 |
| 2026-09-29 | Tax rate from settings | §8.1 (3) | `ITaxPolicyService` everywhere; client rate = settings or 0 when optional; snapshot per document; frontend `TaxSettingsService`. Found: fixed 5, 0.05 and 15 % rates across agreements, workshop, sales, purchases, vouchers and limousine. Book: backend block 15 rule 8 |
| 2026-09-29 | Tax rule for every screen | §10 | Pre-flight item: tax only from `ITaxPolicyService`/`TaxSettingsService`, literal-rate search before handoff. Owner asked that any new screen with tax applies it. Book: backend block 5, UI block 19, Master block 5 |
| 2026-09-29 | Tax rate read-only | §10 | The rate control is `readonly`; when tax is optional a select of settings rate / 0. Owner: "طالما الضريبة غير قابلة للتعديل يبقى خليها readonly". Book: UI block 19 |
| 2026-09-29 | Sales vs purchase tax | §8.1 (3) | Purchase tax follows the supplier (TRN/VAT, not exempt → settings rate, else 0) in PO/GRN/bills; bill `TaxAdjustment` ±0.05; trip tax calculated unless `AllowTaxEditingInLimoTrip`. Owner: "اعمل المناسب" / "عدلهم الوقتى". Book: backend block 15 rule 8, UI block 19 |
| 2026-09-29 | Default contact group | §8.1 (3) | Customers/suppliers always belong to a contact group (default *General Customer* / *General Supplier*); a partner journal falls back to it and an empty group slot gets its own sub-account (`IContactGroupAccountService`) — never the main receivable. Owner: Close Job invoice error for customer 499. Book: backend block 15 |
| 2026-09-29 | Convert account to group | §8.1 (3) | `ConvertToGroupAsync` moves every account reference to a new posting sub-account (closed months included, logged); a new FK to Account must be added to its move list. Owner: "ننشئ حساب تحت Account Receivable وننقل القيود". Book: backend block 15 |
| 2026-09-30 | More filters toggle | §3.4 | Long filter sets: one main row, the rest under *More filters* (chevron, aria-expanded/controls, active-count badge) in the same form. Owner: Job list "صف واحد فلتر والباقى collapse". Book: UI block 4 |
| 2026-09-30 | More filters — canonical steps | §3.4 | Pill toggle with icon chip (light: deep-blue icon on soft tint; dark: white on primary), rotating chevron, active-count badge, dashed advanced panel, reduced motion; every filter token defined for light and dark on the page (undefined `var()` keeps the light fallback in dark); dark inputs/dropdowns/calendars. Reference Job list. Book: UI block 4 |
| 2026-09-30 | Shared filter panel | §3.4, §10 | Filter strips use `form[appFilterPanel]` (shared look, tokens, More filters, mandatory Reset); feature owns fields only; pre-flight item. Owner: "shared components … التخصيص فى اضيق الحدود", "خلى زر reset اجبارى". Book: UI block 4, Master block 5 |
| 2026-09-30 | Shared list page shell + grid fill | §3.4, §10 | Global `sigma-route-host`/`sigma-list-page`/`-panel`/`-header`/`-table`/`sigma-alert`/`sigma-secondary-button`; `app-data-table [fill]` (backlog 34); Job list has no stylesheet. Owner: "فى styles ممكن تكون shared من ملف css الخاص ب job". Book: UI blocks 1, 4, 6, Master 5 |
| 2026-09-30 | Job reference review | §10 | Shared `date-utils` transport/display, `apiErrorMessage`, `sigma-status-badge`, sort whitelist from columns, enum options from enums, dependent lookup streams, backend-matching preview rounding. Found: Job editor sent UTC (4h shift). Book: UI blocks 5, 16, 17, 19, 22, 28 |
| 2026-09-30 | app-data-table closed | §4, §10 | Column `type` + `status(row)`, `dataTableExportRows`, customization only via inputs and `--sigma-data-table-*`; 12 screens moved to `[fill]`. Owner: "خلص الاول الجزء ده عشان نقفل النقطة". Book: UI blocks 5, 6, 8, Master 5 |
| 2026-09-30 | Foundation F1–F2 | §6, §10 | One root `HttpClient` (LayoutModule provider rule retired), `Accept-Language`, interceptor owns error presentation, loader counter, `BusinessFailure(key)`, base totals/paging, case-insensitive filters, validated activate. Owner: "أبدأ في F1 لحد F4". Book: UI 1, 7, 22, 28; BE 5, 7, 9, 10, 12, 17; Master 5 |
| 2026-09-30 | Foundation F5 | §8.2, §10 | `UpdateBaseVm` carries `Id` only; the tenant/`No` ignore rule is retired; user-entered reference `No` declared per feature. Owner: "ابدأ في F5". Book: BE 3, 4, 19 |
| 2026-10-01 | Frontend server-owned fields | §10 | Remove `subscriptionId`/server-owned `no`/audit/flags/status/totals from write payloads screen by screen during review, with a build; no bulk edit or interceptor strip. Owner: "نسيبها مع مراجعة كل شاشة … هتسجل فى Guide". Book: UI 2, backlog 8, 19 |
| 2026-10-01 | Authorization deferred | §10 | Record *Authorization candidates* per screen review until the deferred authorization plan resumes. Owner: "خلى الصلاحيات مع المؤجلات حاليا". Book: UI 26, backlog 20 |
| 2026-10-01 | Shared-first rewrite (step 2) | §2.1, §3, §10 | List shell snippet; filter panel is the only list strip (compact strip/flat grid legacy); shared date/enum/list/field-error/state/money/print/danger pieces; global tokens; translation parity script. Owner: "موافق" on `reviews/Archive/SIGMA_SHARED_FIRST_MAINTENANCE_EVOLUTION_PLAN.md`. Book: UI 1–4, 6–8, 12–14, 16, 17, 19–25, 30; BE 1, 3, 4, 7, 16, 17 |
| 2026-10-01 | Settings: two shapes | §8.1 (4) | Single row = update or create; several rows = add or update by key; no delete by omission; everything through `IServiceHelper`; `SyncByKeyAsync` removed; `EmailTemplateService` fixed (was overwriting another template type). Owner: "لو الشاشة سطر واحد يتعدل فقط او ينشئ لو مش موجود … اكثر من سطر … هيضيف اكثر من سطر او يعدليهم". Book: BE 16, 8 |
| 2026-10-01 | Master-detail step | §10 | Editor shell, `EditableRows`, `DocumentUploadTracker`, D4-2 modal/page rule, D4-3 full snapshot, `AllExistAsync`/`RemoveWithChildrenAsync`, filtered unique indexes; Job editor is the routed-editor reference. Owner: "موافق نفذ". Book: UI 1, 13, 14, 15, 18; BE 2, 8, 14 |
| 2026-10-01 | Generic FormArray typing | §10 | A generic helper reads `FormArray<TRow>` rows through one casting getter; `.controls`/`.at()` resolve to Angular's `ɵTypedOrUntyped` union (TS2322/TS2345 at the owner build). Book: UI 29 |
| 2026-10-01 | Business correctness first; D4-4 | §10 | Owner rule: the business-correct option over the easy or existing one. VAT per tax rate on the document, rounded once; shared `VatPolicy.CalculateDocumentTax`/`AllocateDocumentTax` and frontend `documentTax`. Book: Master 1, 5; BE 5, 15; UI 19 |
| 2026-10-01 | Single-row settings bases | §8.1 (4) | `SingleRowSettingsService`/`SingleRowSettingsControllerBase` + `getMine`/`saveMine`; six screens moved. Book: BE 16, UI 2 |
| 2026-10-01 | Backend patterns 1 and 3 | §8.1, §10 | Base list hooks (D5-1) with `BranchService` as reference; Pattern 3 refreshed (VAT per rate, AllExistAsync, void-not-delete pending J-1); journal decision sheet `reviews/JOURNAL_ENTRIES_DECISION_SHEET.md`. Book: BE 5, 6, 11, 13, 15 |
| 2026-10-01 | UI blocks 2, 9, 10, 11, 27, 28 | §10 | Typed results (D5-4); after-delete page rule; return with list state; parent dirty on child removal; Job list load error inline only. Book: UI 2, 9, 10, 11, 27, 28 |
| 2026-10-01 | Shared-extraction gate + 8 shared pieces | §1, §10 | Owner standing rule; date picker directive, options pipe, file field, confirmation presets, list URL state, step-form field specs, two base reference helpers. Book: Master 5, 7; UI 9, 10, 12, 16, 17, 18, 30; BE 5, 8 |
| 2026-10-01 | One control height | §7, §10 | Exact 34px controls in editor fields and editable tables; top-aligned cells so errors never move neighbours. Book: UI 1, 14 |
| 2026-10-01 | Step field grouping | §7 | One form section per business group; a value beside its calculation type; one row per rental/lease variant. Book: UI 12 |
| 2026-10-01 | Filter height, error-badge focus | §3, §10 | Panel-owned 34px controls; `focusField` for validation-summary items. Book: UI 4, 12 |
| 2026-10-01 | IndividualPartner review | §8.2, §10 | `MaterializeListAsync` + `ProjectTo` for navigation names; shared one-pane scroll, checkbox and file field; field-error `message`; no secrets in exports; type 03 reference is Individual. Book: BE 5, 13, 19; UI 1, 8, 18, 19, 30, catalog |
| 2026-10-01 | Documentation clean-up | §1 | Screen references: `ui/screens/00-catalog.md` only (UI preamble now lists shared owners). Command reference §30 follows Master 2 rule 6. Book: UI 0, catalog |
| 2026-10-01 | Decided journal rules | §8.1 (3) | J-1, F2, F4, F8, I1, I2 decided by the owner (Speed Auto Systems reference); proportional reversal helper. Book: BE 5, 15 |
| 2026-10-01 | Closing checks (R8) | §10 | `Check-BookReferences.ps1` runs clean over the books and this skill (paths, types, `sigma-*` classes, block numbers, links). Run it after any skill or book change. Book: Master 8 |
| 2026-10-01 | Skill re-digest §5–9 (R7) | §5–9 | Every rule re-checked against its block: §6 `switchMap` list stream (UI 28); §7 D4-2 modal-or-page, white glyphs owned by shared buttons (UI 3, 20), `toApiDate` in save (UI 17); the *Key-Value Summaries* rule removed — no owning book block and hard-coded colours (defect reported); §8.1 hooks, `AllExistAsync`, full snapshot, `RemoveWithChildrenAsync`, void-not-delete (J-1), VAT per rate (D4-4); §8.2 `NormalizePaging`, money decimals, hooks instead of a `GetManyAsync` override; §9 namespaces, fallback, `Check-Translations.ps1`. Book: UI 1, 3, 13, 17, 19, 20, 23, 28; BE 5, 8, 9, 13, 14, 15 |
| 2026-10-01 | A4-54 narratives (R6) | — | Books keep the rule and a one-line reason; incidents live in `CHANGELOG.md`. No skill rule changed. Book: BE 5, 18; UI 5, 16, 17, 19, 22, 29 |
| 2026-10-01 | Master blocks 1–8 (R5) | §1, §10 | Proportional tiers S/M/L (D4-5); whole-application review order with the per-screen checklist; required decisions 22–25 (full snapshot, VAT per rate, authorization candidates, business reasoning); quotation register now in UI 7. Book: Master 1, 3, 4, 6, 7, 8; UI 7 |
| 2026-10-01 | Companies shared extraction | §7, §10 | Typed partner rows and mappers; isolated upload transfer; bounded dialog flex chain; tracked customer snapshots and shared agreement history. Source review only; owner build/runtime pending. Book: UI 13, 14, 18; BE 14 |
| 2026-10-01 | Companies review rules G1–G19 | §10 | Review of the parallel Companies implementation (`reviews/COMPANIES_PARALLEL_IMPLEMENTATION_FEATURE_REVIEW.md`), owner: "ضيف القواعد G1–G19 للكتب والـ skill". Replaces two 0.50/1.09 notes: the Company default-group transaction (now none, G16) and "document rules match the backend VM" (now one decided set, G5). Book: Master 4, 5, 6, 7; BE 1, 2, 3, 5, 14, 19; UI 1, 4, 8, 12, 14, 18, 23, 29, 30 |
| 2026-10-01 | Base snapshot engine | §10 | `CustomerAggregateSnapshot` moved into the base service (`OwnsAll`, `OwnsReference`, `ReconcileOwned`, `ReconcileReference`); Individual, Company and Driver adopt it; shared customer helpers adopted by Individual. Owner: "موافق نفذ الخطة". Book: BE 5, 14, 19 |
| 2026-10-01 | One agreement history | §10 | Backend `AgreementHistory` (customer, vehicle or driver) and the shared `app-agreement-history-dialog`; Individual, Company and Vehicle adopt both (Vehicle gained leases and translated status). Owner: "تمام". Book: BE 5, 14; UI 11 |
| 2026-10-01 | Delete-reference list location | §10 | Inline for one service, `<Entity>DeleteReferences` for two or more. Owner: "عايز امشى على نمط واحد". Book: BE 8 |
| 2026-10-01 | One delete pattern | §10 | `RemoveWithChildrenAsync` takes one-to-one owned rows and returns 404; Individual, Driver and Company follow blockers → grandchildren → helper. Owner: "بلاش كود زيادة". Book: BE 5, 8 |
| 2026-10-01 | Company cleanup | §10 | Contact-person checks with the real references (private `ContactReferences`, one caller); VM attributes instead of service enum and required checks; server-owned contact type; unused endpoint removed. Owner: "عدل company". Book: BE 8, 19 |
| 2026-10-01 | Automatic delete check, base sort | §8.2, §10 | `InUseAsync` from the EF model inside `RemoveWithChildrenAsync`; reference lists removed; base sort by stored column, `SortField`/`SortBy`, `ListQuery`. Owner: "نفذ … filters والترتيب موجود فى Base". Book: BE 5, 8, 13, 14, 19 |
| 2026-10-01 | Declared search, navigation sort | §8.2 | `SearchColumns` in the base; navigation `Name` sort by convention; Individual and Company adopt both. Owner: "نفذ الحل على Individual - company". Book: BE 5, 13 |
| 2026-10-01 | Detail read through the base | §8.2 | No `DetailWithNavigationsAsync` override: the base deep load skips deleted rows and loops. Owner: "كنت ظابطها فى baseservice - repository". Book: BE 5 |
| 2026-10-01 | Update: base for one level | §10 | Base `UpdateAsync` checks child ownership for every screen; Individual back on it; Company keeps the explicit override for grandchildren. Owner: "طبق الحل". Book: BE 14, 19 |
| 2026-10-01 | Card exports removed | §10 | Individual and Company lists export no cards (button, endpoint, models, keys removed); a future card export is backend-masked only. Owner: "شيل الزرار وشيل endpoint". Book: UI 8, 30; BE 19 |
| 2026-10-01 | Trim on read | §8.2, §10 | `TrimIncomingStrings` trims request strings (empty → null on `string?`, passwords excluded); services write no `Trim`/`Normalize`/`Optional`; server-owned values in the profile. Owner: "تمام". Book: BE 3 |
| 2026-10-01 | Automatic input checks | §8.2, §10 | Base Add/Update check `UniqueColumns` and every request foreign key (EF model); services keep only business rules; `ExistsOrNullAsync` removed; Company on one inactive flag. Owner: "ValidateAsync … Base". Book: BE 5, 8, 19 |
| 2026-10-01 | No save try/catch | §8.2 | A unique-index violation is answered by the middleware (409 `RecordAlreadyExists`); services do not catch `DbUpdateException`. Owner: "فى داعى ل try catch". Book: BE 8 |
| 2026-10-01 | Company service findings | §8.4 | Resolve saving master-data helpers before aggregate mutations; Serializable check/save covers Company API and import chunks; central conflict handling; positive supplied FKs, Customer group type, billing minimums; number only new tracked children. Owner: "عدل جميع الملاحظات". Book: BE 3, 8, 11, 14; source-only report `reviews/COMPANY_SERVICE_FINDINGS_FIX.md` |
| 2026-10-01 | Company transaction simplification | §8.4 | Owner's final decision: transaction is the simplest adequate option. Cancel indexed-view proposal; keep Serializable before duplicate reads in Company Add/Update and every import chunk, commit success only; remove wrapper/helper and UpdateSnapshot indirection. Book: BE 8, 14; reconciliation `reviews/COMPANY_UNIQUENESS_INDEXES_PLAN.md` |
| 2026-10-01 | Customer shared write fixes | §8.4 | Owner: "نفذ الملاحظات". Supersedes the preceding Company Serializable decision: shared UnitOfWork application lock for participating UniqueColumns writes and both customer imports; one Customer-group resolver; Added-row empty-only numbering at save with early-root compatibility; VM date checks; smaller snapshot/save helpers. Source-only; full customer review records separate legacy mapping/ownership and frontend findings. Book: BE 3, 5, 8, 11, 14, 19 |
| 2026-10-01 | Comprehensive customer fixes | §8.4, §9, §10 | Owner: "نفذ كل الملاحظات". Tracked Individual ownership/mapping supersedes the earlier one-level base-update note; unchanged snapshots succeed. Successful-load/form-validity gates, concurrent upload cleanup/retry, shared document contract, neutral partner keys, explicit CSV boundaries/feedback, and retired runtime/config roots. Books: BE 3, 14, 19; UI 12, 18, 22, 23, 29, 30. Source-only; owner acceptance pending; card data decision remains separate. |
| 2026-10-01 | Unchanged save result | §8.4 | Owner confirmed Individual saves changes but unchanged saves failed, then confirmed "جربت اشتغل تمام" after the shared fix. UnitOfWork sync/async save reports completion rather than `affectedRows > 0`; Supplier reuses SaveUpdateAsync. No extra SubscriptionId/No inputs or forced graph writes. Books: BE 5, 14. Remaining customer acceptance is separate from this verified scenario. |
| 2026-10-01 | Individual step width | §10 | Owner requested Individual steps across the full width. Shared StepFormComponent fill option owns equal columns, centred markers/labels and track alignment; Individual opts in, default consumers retain their presentation. Book: UI 12. Source-only; visual verification pending. |
| 2026-10-01 | Error focus scroll boundary | §10 | Individual Documents error badges exposed unrestricted scrollIntoView moving clipped layout ancestors. Shared focusField now scrolls actual overflowing regions only, preserves visible fields and RTL horizontal reveal, skips page roots and retains preventScroll focus/overlay opening. Books: UI 12, 27. Source-only; owner runtime verification pending. |
| 2026-10-01 | Fixed editable column width | §10 | Owner requested fixed Individual Document Type width, then a slightly wider control. Optional shared column width drives fixed layout/colgroup; Individual uses 240px, flexible siblings and internal overflow remain shared. Book: UI 14. Source-only; visual acceptance pending. |
| 2026-10-01 | Editable checkbox accent | §10 | Individual Is International exposed a table checkbox with only margin styling. Shared editable-table checkbox cells now match the editor's 15px box and sigma-primary accent. Books: UI 1, 14. Source-only; visual acceptance pending. |
| 2026-10-01 | Document row actions | §10 | Owner moved Individual Is International beside Remove and widened Attachment to 280px. Existing shared action projection owns the group; optional actionsVisibleInView preserves row data without mutations. Shared checkbox styling covers grouped controls. Book: UI 14. Source-only; visual acceptance pending. |
| 2026-10-01 | Projected action spacing | §10 | Configure a wider action group through shared host variables `--sigma-editable-actions-width` and `--sigma-editable-row-actions-gap`, retaining 74px/5px defaults; never override shared cell selectors. Individual Documents uses 100px/12px with Issued By at 120px. Book: UI 14. Source-only; visual acceptance pending. |
| 2026-10-01 | Labelled document flag, picker-only dates | §3.3, §10 | Owner requested narrower date boxes without text entry, a visible International caption, and wider Issued By. Shared row-check label owns presentation; explicit readonlyInput/keepInvalid bindings provide the scoped date exception. Individual widths: dates 130px, Issued By 150px, Actions 210px. Books: UI 14, 17. Source-only; visual acceptance pending. |
| 2026-10-01 | Separate flag/action headings | §10 | Owner clarified that Is International heads the checkbox and Actions heads the button. Individual flag is now a separate 136px data column after Attachment, then shared 74px Actions. Supersedes its combined flag/button presentation; shared projection options remain available elsewhere. Book: UI 14. Source-only; visual acceptance pending. |
| 2026-10-01 | Numeric editable card dates | §3.3 | Owner requested Active Date/Expiry reject arbitrary text but allow editing dates or picker selection. Shared appDatePicker dateNumericInput rejects non-digit/non-slash insertion/paste; partial numeric text and real-date validators remain. Individual card fields opt in; document picker-only fields unchanged. Book: UI 17. Source-only; runtime acceptance pending. |
| 2026-10-01 | Numeric editable document dates | §3.3 | Owner extended numeric date editing to Individual document Issue/Expiry Date, superseding their picker-only decision. Both reuse dateNumericInput with the shared typeable/keepInvalid defaults and existing date validation. Book: UI 17. Source-only; runtime acceptance pending. |
| 2026-10-01 | Stable dropdown width | §10 | Owner requested every dropdown have a fixed width. Width is layout-defined and independent of text: responsive field width in forms/filters, declared column width in editable tables; sizes chosen per field. Company Contact Designation uses 180px. Apply during new work/reviews, no bulk rewrite. Books: UI 14, 16. Source-only; visual acceptance pending. |
| 2026-10-01 | Numeric date key guard, added-row focus | §3.3, §10 | Owner reiterated date-only entry and reported Companies Documents moving upward. Shared numeric date input guards printable keys alongside insertion/paste. Added-row focus now reuses focusField with openOverlay=false, avoiding native focus scrolling and waiting for rendered rows. Books: UI 14, 17, 27. Source-only; owner reproduction/acceptance pending. |
| 2026-10-01 | Driver draft dialog height | §10 | Owner confirmed Add Driver inside Companies opens blank. Shared dialog height input supplies definite available space to its zero-basis editor flex chain; draft uses min(720px, viewport minus 24px). Other dialogs retain auto-height defaults. Book: UI 13. Source-only; owner runtime verification pending. |
| 2026-10-01 | Content-sized driver dialog | §10 | Owner requested removal of unused space after the height increase. Driver draft now uses auto height capped at 90dvh and existing flex-fill on every projected form/body/scroll link, replacing its fixed-height presentation. Shared fixed-height option remains for editors needing a workspace. Book: UI 13. Source-only; visual acceptance pending. |
| 2026-10-01 | Date-only editing default | §3.3 | Owner requested every date box allow dates only or picker selection. Shared appDatePicker now guards manual entry by default, with format/range/time separators and existing date validation. Companies/Driver and Individual consume it; legacy calendar adoption remains per screen review. Supersedes the opt-in-only rule. Book: UI 17. Source-only; runtime acceptance pending. |
| 2026-10-01 | Inheritance delete references | §10 | Company deletion reported used in Company. Shared InUseAsync skips EF IsBaseLinking keys so TPT derived/base rows do not block themselves; ordinary usages still block. No feature-specific table exclusion or schema change. Book: BE 8. Source-only; owner runtime acceptance pending. |
| 2026-10-02 | Inherited input identity | §8.4 | PUT Company reported Partner reference not found. MissingReferenceAsync now skips IsBaseLinking inheritance keys, preserving new nested Update identity 0 and separate saved-row ownership checks. Genuine business FKs still require live tenant rows. Book: BE 8. Source-only; owner payload reproduction/acceptance pending. |
| 2026-10-02 | Date input fallback | §3.3 | Owner still entered letters in Company Documents. Shared directive captures and cleans native input before PrimeNG parses, preserving caret and enabling its keydown-gated handler for non-keyboard input. Applies to Company and nested Driver Documents with no feature-local handlers. Book: UI 17. Source-only; exact entry-path reproduction and owner runtime acceptance pending. |
| 2026-10-02 | Structured document dates | §3.3 | Owner clarified arbitrary digits are insufficient. Shared dateInputMask enforces DD/MM/YYYY shape and complete-date validation; Company Issue/Expiry and nested Driver Documents opt in. Partial edits stay strings/invalid, preventing short-year coercion. Other date formats keep their behavior. Book: UI 17. Source-only; owner runtime acceptance pending. |
| 2026-10-02 | Required shared structured date recipe | §3.3 | Owner extended the same component to every Individual/Company date and requested the rule for future date boxes. All future/reviewed single dates bind dateInputMask=true; shared mask supports MM/YYYY alongside DD/MM/YYYY, preserving bounds/order/transport. All active customer date fields including Drivers opt in with matching placeholders; Individual Card Expiry retains month view. Supersedes document-only scope; other existing consumers adopt during review. Book: UI 17. Source-only; owner runtime acceptance pending. |
| 2026-10-02 | Production notes register | §10 | Owner requested a Guide section for production notes. Master 5 records deferred compiler-warning/analyzer recommendations with scoped evidence and verification status; no concrete null failure was established in inspected Repos examples. Consult for production-preparation reviews, preserving execution permissions and distinguishing recommendations from release blockers. Documentation only. |
| 2026-10-02 | HTTP production note | §10 | Owner added PROD-03 to Master 5: review Repos and Helpers HTTP references together, then verify consumers/shared-framework deployment before accepting a change. No present compatibility failure or vulnerability established. Deferred recommendation, documentation only. |
| 2026-10-02 | Duplicate warning production note | §10 | Owner added PROD-04 to Master 5: duplicate CS8669 is deferred low-priority cleanup when Repos csproj is next edited. No behavior change or release blocker; necessity of suppression remains a separate review. Documentation only. |
| 2026-10-02 | Deep-read context isolation | §8.2 | Owner requested L3 fix: generic GetByIdDeepAsync uses an independent DI scope/context instead of attaching read copies and detaching every write-tracker entry. Disposal covers all exits; pending write changes and local transactions stay with the write context. Book: BE 5, 14. Source-only; runtime acceptance pending. |
| 2026-10-02 | Shared batch numbering counter | §8.4 | Owner approved L4: existing CodeCreateService replaces Count + 1 for configured types with tenant/type tracked counters, max-issued seeding including deleted rows, CurrentValue concurrency protection and existing unique counter key. Counter and graph share the save; a conflict returns 409. Journal vouchers keep their owning generator without preliminary reservation. Book: BE 11, backlog 14. Source-only; DB index/concurrency/rollback verification pending. |
| 2026-10-02 | Field-only bulk activation | §8.2 (10) | Owner approved the activation part of R1: base HandleActiveAsync saves tracked IsActive changes directly instead of UpdateRange, retaining target validation, tenant scope and no-change success. The soft-delete audit path remains a separate pending part of R1. Book: BE 12, 5. Source-only; concurrent activation/unrelated-edit verification pending. |
| 2026-10-03 | Reject invalid tenant context | §8.2 (5) | Owner approved R2: ordinary tenant repository operations reject invalid subscription before work; UOW guards before numbering and all DbContext save overloads guard before tenant persistence. Typed exception uses existing localized 401 Result middleware. No constructor/global/no-change restriction; QueryReport policy and current claim key preserved. Books: BE 5, 8, 17, 18. Source-only; owner runtime acceptance pending. |
| 2026-10-03 | Field-only soft delete | §8.2 (11) | Owner approved the remaining R1 deletion fix: HandleAudit resets the deleted row's scalar differences, marks only three deletion fields, preserves original tenant/concurrency predicates and changes on other entities. No new helper/service/schema or transaction. Books: BE 8, 18. Source-only; tracked/detached/owned/concurrent delete acceptance pending. |
| 2026-10-03 | Selectable IDs and historical labels | §6 | Closed Lease Agreements uses the existing ClauseType/GetSelect for Create/Edit; View reads the detail-derived ClauseTypeName, including same-tenant soft-deleted references. Historical labels never repopulate current choices; save validation stays authoritative. Books: UI 16,15. Source-only; owner runtime acceptance pending. |
| 2026-10-02 | Allocation-based report reconciliation | §6.1 | ReceivableAgeAnalysis: match both eligible AR sides with capacity guards before aging, preserve ledger net, apply allocation/source/target cutoff parity and fail closed on missing AR mapping. Explicit complete-response opt-in preserves paged callers and avoids repeated calculation. Exact formulas/deviations remain feature-owned. Book: BE 17 (0.72). Source-only; owner accounting/runtime acceptance pending. |
| 2026-10-03 | One shared summary card owner | §1, §6.1 | Owner requested one Dashboard-shaped component for every screen type, with flexible size, and adoption in Dashboard/FollowUpReport/DebtCollection/Customers Alerts/BalancesSummary/ReceivableAgeAnalysis. Public density/layout/minimum-width/maxHeight own appearance and sizing; Aging fits/wraps all cards with smaller figures and bottom separation. Follow Up is full width; existing totals/formulas/DrCr/selection/tabs/paging/print/Excel semantics retained. Books: UI 0,14,20,24 and screen catalog (1.52). Source-only; owner visual/runtime acceptance pending. |
| 2026-10-03 | Strict shared month transport | §3.3 | Staff review replaces feature month parsers with parseMonthValue, accepting valid local picker Dates or complete MM/YYYY/yyyy-MM and rejecting partial text/out-of-range month/year without timezone conversion or short-year coercion. Monthly operations and Timesheet share currentMonthRange()[0] defaults. Book: UI17 (1.56). Source-only; owner runtime acceptance pending. |
| 2026-10-03 | Shared report radio accent | §6.1 | Customer Statement owner requests the usual blue for Report Type. Opt-in sigma-report-filter-choice owns PrimeNG selected/hover/focus states with existing Sigma tokens; reactive/disabled/label semantics retained and other groups unchanged. Book: UI20/24 (1.57). Source-only; visual acceptance pending. |
| 2026-10-03 | Lean generic detail responses | §8.1 | Staff review verified generic service/interface/controller only map and return detail responses. Widening their constraints to class allows explicit Staff/Designation/Timesheet detail VMs without unused tenant/audit/flags, preserving required fields, legacy derived DTOs and specialized constraints. Books: BE3/5 (0.73). Source-only; owner compilation/runtime acceptance pending. |
| 2026-10-04 | Application-wide numeric replacement | §1 | Owner explicitly extends numeric replacement across the application. Root GlobalNumericFocusService delegates native/PrimeNG focus and first pointer entry after widget cursor handlers; later clicks retain caret editing, disabled/readOnly inputs are excluded, and stop removes all listeners. Existing NumericFocusDirective keeps appearance only. No value writes or parse/precision changes. Book: UI27 (1.68). Source-only; owner keyboard/pointer/runtime acceptance pending. |
| 2026-10-04 | Shared Quantity stepping widget | §1 | Owner requests Quantity numeric inputs with increase/decrease buttons as a general application solution. QuantityInputDirective configures PrimeNG's existing CVA and shared 34px/22px rail styling; 36 controls/28 templates adopt it, retaining integer/decimal contracts, bounds, validators, calculation callbacks, number/null transport and readonly text. UI14/27 (1.70) and skill synchronized; derivative packet regeneration/semantic review pending. Source-only; owner build/input/step/RTL/theme/visual acceptance pending. |
| 2026-10-04 | Filter row alignment from Item Issue | §3 | Owner requests controls on the same row level and emphasizes it in Guide, then excludes earlier owner-adjusted screens. Item Issue uses existing stableLayout and date reserveMessage matching Workshop Job; UI4 (1.71)/skill require that recipe in new/subsequent reviews without changing shared defaults, widths, queries or breakpoints. Source-only; owner visual/feedback/RTL acceptance and packet regeneration/semantic review pending. |
| 2026-10-04 | Numeric heading/value alignment | §1 | Owner reports View Quantity at the edge and requests the same consideration across screens. Shared numeric headings/cells/value text now default to center; 17 plain read numeric spans adopt existing highlight. Explicit header overrides remain supported, inputs keep right-aligned digits and transport/format/formulas are unchanged. UI14 (1.72)/skill synchronized; source-only, owner visual/RTL/theme acceptance and packet regeneration/semantic review pending. |
| 2026-10-04 | Cross-service collection concurrency | §8 | Sales review fixes (S01/S04/S05/S11): one owner tenant lock for agreement and linked receipt writers, eligibility re-read inside it, state concurrency tokens, closed-document reopen on reversal, un-void re-check, floor-rounded installments. Book: BE 15 "Collection and lifecycle concurrency across services". Source-only; runtime race verification pending. |
| 2026-10-05 | Accounts report and editable-row adapters | §1, §6.1 | Accounts guide fixes preserve nested report source through optional DataTableHierarchy, stable expansion/14px logical depth, complete export/print and flat FY2 indentation. Typed local report configuration retains server totals/context, lookup retry and applied filters. EditableRows pending confirmation plus canMutate and same-object re-resolution block stale removals/submitted snapshots. Books UI6/14/20 (1.75); source-only, owner acceptance pending. |
| 2026-10-05 | Equal page-card widths | §2.4 | Owner requests Account title match its workspace and adds a general Guide rule. UI3 requires sibling full-width card/frame edges to align, with column/nested/summary-tile boundaries preserved. Shared sigma-list-panel--workspace removes only title inline inset; Account adopts it. Book/skill synchronized (1.76); source-only, visual acceptance pending. |
| 2026-10-05 | Compact workspace search and full card alignment | §2.4, §3.2 | Owner requests LinkAccounts Reset beside search and every card aligned. Shared default-off inlineActions keeps the existing Reset beside simple non-advanced filters; workspace modifier removes filter inline inset as well as title inset. LinkAccounts opts in; UI3/4/skill synchronized (1.77), source-only visual acceptance pending. |
| 2026-10-05 | All-tab editor card widths | §2.4, §3.2 | Owner extends OpeningBalances inline Search/Reset to every existing filter and requires equal card edges in all tabs. Shared sigma-editor-panel--workspace aligns direct title/nested filters with tabs/table frames; all eight tabs share the same shell. Prepaid/Deposit adopt inline actions alongside Customers/Suppliers; shared narrow fields stack at720px beside the actions. UI3/4/skill synchronized (1.78); source-only, visual acceptance pending. |
| 2026-10-05 | Accounts complete document layout | §6.1 | Owner CashFlowStatement design feedback adopts UI20's existing complete-document alternative through optional sectionLayout=document. Full-width source-ordered sections use one accessible shared frame, flow grids and compact empty states; figures/links/full output remain and other reports retain bounded panes. UI20 (1.79)/skill synchronized; source-only, owner visual acceptance pending. |
| 2026-10-05 | CashFlow activity workspace tabs | §6.1 | Further owner layout feedback supersedes CashFlow document adoption with shared workspace tabs/counts, one full-width fill grid, print-only headings and slim bounded summary. All sections remain mounted; frozen all-section print/Excel retained, other reports keep defaults. UI20/24 (1.80)/skill synchronized; source-only, owner visual acceptance pending. |
| 2026-10-05 | Single accounting CashFlow statement | §6.1 | Owner explicitly rejects activity tabs and requests one accounting view. UI6 shared optional rowTone/column width/link.enabled present headings/subtotals/final double rule in a single fill grid, retaining five backend figures, all source lines, ledger links and complete original Excel shape. Unconsumed family tab adapter retired. UI6/20/24 (1.81)/skill synchronized; source-only, owner visual acceptance pending. |
| 2026-10-05 | TypeScript lib compatibility | §1.1 | Owner requests Guide coverage after CashFlow flatMap TS2550, following Budget fromEntries feedback. UI1/8 (1.82) require checking effective lib separately from target, typed ES2018 alternatives and no local compiler-option/polyfill workaround. Parser-only limits explicit. CashFlow export repaired without changing content/order; owner compilation pending. |
| 2026-10-05 | CashFlow activity Tree View | §6.1 | Owner requests Tree View within the accounting statement. Existing complete activity arrays become default-expanded shared hierarchy roots with visible server nets/account/subtotal children; shared activateEnabled limits ledger links to real accounts. Full print and ES2018-compatible original Excel stay independent of collapse. UI6/20 (1.83)/skill synchronized; owner compilation/visual acceptance pending. |
| 2026-10-05 | Stable Ledger report filters | §6.1 | Owner account-field movement report: opt-in shared report field top alignment, bounded lookup labels and existing reserved date/required feedback. Ledger alone enables the family config; controls/queries/outputs/default consumers retained. Book UI20 and skill synchronized; source-only, visual acceptance pending. |
| 2026-10-05 | Journal inline action line and height | §6.1 | Owner requests actions at filter level and equal height: optional global report grid, shared invisible action caption, reserved feedback, bounded single-line labels/inputs and exact34px buttons. Journal opts in, shared1250/640 responsive rules and default strips retained. Book UI20 synchronized; source-only visual acceptance pending. |
| 2026-10-05 | Report table/card width | §2.4, §6.1 | Owner requests Accounts report tables to share card edges and documentation. UI20 requires result/table frames to match title/filter/summary width; global report context removes the ordinary-list 8px inset from direct sigma-list-table wrappers. Journal corrected; fourteen family reports already stretch within section containers. Internal scroll/paging/totals/print/export retained. Source-only; visual acceptance pending. |
| 2026-10-05 | Report final-column gutter | §6.1 | Owner reports final column still inset after outer-frame fix. UI6 adds shared public scrollbar-gutter token with stable fallback; UI20 report panel supplies auto and document frame uses auto, avoiding empty reserved strips. Native overflow scrollbar space and paging/print remain. Source-only; visual causality/acceptance pending. |
| 2026-10-05 | All report tree bulk actions | §6.1 | Owner requires Expand All / Collapse All on every tree report and documentation. One ReportTreeActions toolbar is adopted automatically by shared DataTable hierarchy and existing dynamic TreeNode adapter. Recursive initialized-key updates/local clones preserve hidden descendant state and source values; flat reports stay unchanged and complete print/Excel remain independent. UI6/20 synchronized; source-only owner acceptance pending. |
| 2026-10-05 | Validated inline filter actions | §3.2 | Owner puts Budget actions beside its two filter controls. UI4 optional inlineActionCaption reserves common invisible label geometry and top-aligns actions independently of required feedback; <=720px stacks actions below fields, existing empty-caption/advanced consumers stay unchanged. Shared Reset/loading/gates retained; source-only visual acceptance pending. |
| 2026-10-05 | Shared journal source text | §9 | Bank Reconciliation reuses voucherTypeText with neutral EN/AR voucherTypeNames labels for backend string names. Grid/Excel use current translation; unknown names/null retain source/empty semantics, no enum/query/payload change. UI16/23 synchronized; one Customer Statement local mapping remains in backlog39 for its own review. Source-only; owner runtime/language acceptance pending. |
| 2026-10-05 | Budget Search height | §3.2; UI4 | Shared PrimaryActionButton filter-actions context consumes the existing34px control token with border-box/zero block padding to match Reset/Export. Defaults outside filter actions and all loading/handlers/theme remain; source-only, visual acceptance pending. |
| 2026-10-06 | Budget summary row alignment | §2.4; UI3 | Optional shared sigma-list-summary host placement matches ordinary-list8px logical edges, with zero for direct workspace children. Budget removes owner-rejected Fiscal Period content and aligns existing total/month cards without changing their internals/calculations; visual acceptance pending. |
| 2026-10-06 | Report lookup stability and inline actions | §6.1; UI16/20 | Accounts report options retain array identity until source/language changes. Optional virtual report selectors use matched38px shared rows; optional inlineFilterActions reuses shared grid/caption/existing handlers, defaults preserved. BudgetVariance adoption; source-only runtime/visual acceptance pending. |

| 2026-10-06 | Composed read error formatting | §6; UI22 | Master5 gate extracts ordinary declared Error vs HTTP Result formatting into shared composedReadErrorMessage, delegating HTTP messages to apiErrorMessage. Card Transfers list/export/report adopt; no feature copy or mutation-feedback change. CashDeposit list retains one known copy for its own review (UI30/39). Source-only; owner compilation/failure-path acceptance pending. |
| 2026-10-06 | Shared month validation | §3.3; UI17 | Depreciation extracts monthValueValidator over parseMonthValue, with optional empties and date error semantics; required remains a separate validator. UI17 and skill synchronized; two existing Accounts-family/Timesheet copies listed in UI30/39 for their own review. Source-only; owner compilation/input acceptance pending. |
| 2026-10-06 | Shared optional filter action spacing | §3.2; UI4 | FilterPanel actionGap owns the flex gap in pixels with default8. Owner-requested LeaseInquiry/Quotation spacing selects12 in scope, preserving other consumers and Reset/wrapping/RTL; no feature CSS. Source-only, owner visual/compilation acceptance and packet regeneration/semantic review pending. |
| 2026-10-06 | Saved calendar-date hydration | §3.3; UI17 | Shared toPickerDate extracts the existing local-day partnerPickerDate algorithm; compatibility wrapper delegates unchanged. Equipment Rental editors/restored filters use actual Dates for PrimeNG; manual parsing/transport and date-time contracts stay separate. No private parser/UTC conversion. Source-only, owner compilation/input/route/visual acceptance and packet regeneration/semantic review pending. |
| 2026-10-07 | Transportation reusable frontend contracts | §3.3/4.1/6/7; UI2/6/13/17/19 | Shared clock transport preserves unchanged saved precision, optional scalar validators preserve signed numbers/Guid.Empty, custom top-level params retain producer names, and explicit unknown-count lazy grids use actual server page metadata without fake totals/all-pages list simulation. Modal reference corrected against routed Fleet source. Owning books/catalog/history synchronized (1.91); source-only owner compilation/runtime/visual and packet regeneration/semantic review pending. |

| 2026-10-07 | Shared signed Int32 validation | §6.2; UI19 | Movements extracts int32ValueValidator into the existing scalar owner for actual nullable C# Int32 transport, optional empties, signed bounds and shared number feedback. Custody/Workshop mileage and Logs threshold adopt it; Collection/Delivery/NRM string mileage stays text. Book and skill synchronized1.92; no business sign/range or server change. Source-only owner compiler/input acceptance and packet regeneration/semantic review pending. |
| 2026-10-07 | Deferred discard decision and form freeze | §7; UI10 | Movements continuation completes Delivery/Custody control freezes and Collection deferred identity/busy recheck. Confirmation opens at subscription, Cancel preserves values/dirty state, and only the same visible editor restores its prior editable state after finalize. Book/skill synchronized1.93; no service/API change. Source-only owner compiler/navigation/interaction acceptance and packet regeneration/semantic review pending. |
| 2026-10-07 | Editable row neutral numeric units | §5.2; UI14 | Rental Booking owner reports checkbox colour/spacing and supplies charge elements. Existing native15px primary/34px row labels replace PrimeNG charge checks; opt-in shared input-unit/value-unit geometry owns6px gap and muted10px isolated units instead of validation red. Existing formulas/locks/payloads and other consumers retained. Book/skill synchronized; source-only, owner visual/input/RTL/theme and packet regeneration/semantic review pending. |
| 2026-10-07 | Equal numeric charge boxes | §5.2; UI14 | Owner requests equal number boxes in Booking Charges. Shared opt-in number width/token and fixed input/unit group supply matching input/read badge widths with external units and bounded shrinking, no default-consumer change. Booking selects96px fitting its620px table and retains source financial behavior; catalogue row-order decisions remain feature-owned. Book/skill synchronized; source-only owner visual/input/RTL/theme and packet regeneration/semantic review pending. |
| 2026-10-08 | Lightweight shared detail identity | §8.1; BE3 | Owner approves LeanDetailBaseVm (int Id) and NumberedDetailBaseVm (nullable No) instead of repeated explicit identity. Forty-eight standalone detail DTOs reuse the matching base; nonnullable initialized No stays local over Id-only. Flattened fields/defaults/formulas, legacy heavy hierarchy, maps/generic constraints/endpoints/writes/schema retained. BE3 (0.77) and skill synchronized; source-only, owner compilation/mapping/serialization acceptance and packet regeneration/semantic review pending. |
| 2026-10-08 | Wide inline report fields | §6.1; UI20 | StaffStatement owner enlarges Date Range. Shared report wide-field modifier uses span2 and auto reset at640px; feature counts the extra track (six for five fields), retains auto actions/report1250/640 breakpoints and non-adopter defaults. Mechanical FilterPanel wide-field reference reused; source-only visual/RTL/input acceptance and packet regeneration/semantic review pending. |
| 2026-10-08 | Content-sized inline report tracks | §6.1; UI20 | StaffStatement owner reports clipped Outstanding and wasted inactive space. Shared opt-in full template supports max-content groups and weighted minmax(0,fr) date/editable/action tracks; defaults/report1250/640 fallbacks remain. Replaces this consumer's span2 date; shared action wrap and no feature CSS. Book/skill synchronized; source-only visual/RTL acceptance and packet refresh pending. |
| 2026-10-08 | Staff statement action row | §6.1; UI20 | Latest owner instruction moves all StaffStatement actions below filters. Reuse sigma-field--full grid-column1/-1 with five weighted/content tracks, remove inline-only action caption/track, preserve responsive fallbacks and shared wrapping. No new CSS/API; guide/book/skill current-consumer evidence synchronized, source-only visual/RTL acceptance pending. |
| 2026-10-08 | Optional centered editable cells | §5.2; UI14 | Sales Quotation owner requests vertical centering of Items. Shared opt-in body-cell alignment token includes projected fields and the generated action cell, with top-aligned headers and defaults preserved. Field/error groups center together. Book and skill synchronized; source-only visual/validation/RTL acceptance and packet regeneration/semantic review pending. |
| 2026-10-09 | Shared pending form-state snapshot and child identity | §5.2/7; UI10/14 | Lease follow-up extracts freezeFormState with no-event disable, idempotent restoration of intentionally disabled subtrees and destruction guard. Optional EditableRows.freezeParentOnConfirmation defaults false and restores before row/canMutate recheck; isSavedRow preserves confirmation for saved GUID/string children without changing numeric savedId. Consumers retain record/pending/cleanup gates; routed exits defer one decision and successful Save bypasses discard. Owning UI10/14 blocks and skill synchronized. Also correct §7 calendar hydration wording against existing UI17: parseDateValue returns a string, toPickerDate returns a Date. Source-only; owner compilation/interaction acceptance and packet regeneration/semantic review pending. |
| 2026-10-09 | Preserve full saved calendar years | §3.3/7; UI17 | Tariff shared hydration exposes JavaScript's 00..99 constructor coercion. Shared parseDateValue/toPickerDate construct local dates with setFullYear, and transport/display pads four-digit years. Existing month years0001..9999 and two-digit manual-year compatibility are retained, zero remains invalid, no timezone/business-bound change. UI17/skill synchronized; source-only, owner compiler/input/reload acceptance and packet refresh pending. |
| 2026-10-09 | Preserve full month boundary years | §3.3; UI17 | Transportation continuation reuses toPickerDate/currentMonthRange for TripSheet query/month shift, and the shared range uses setFullYear instead of constructor year coercion. Destination parsing retains0001..9999, no current-year/business/timezone change. Book/skill synchronized; source-only owner compilation/input/route acceptance pending; affected packets regenerated and semantically reviewed in the renewed Transportation review. |
| 2026-10-09 | Common settings inline lookup feedback | §6; UI2/22 | Optional getMySetting skip-error option supports Rental Agreement Deposit's inline settings/options batch; defaults/global feedback and existing endpoint remain. Shared amountInWords consumes CommonDTO currency labels/decimals, retaining entered values on failure. Books/skill synchronized; source-only owner compiler/failure/Retry acceptance and packet regeneration/semantic review pending. |
| 2026-10-10 | Query dictionary validation identity | §8.2; BE9 | DriverTimeSheetReport400 with empty errors exposes a copying setter that loses MVC's object-keyed bracket validation strategy. Preserve the auto-property instance and normalize after model validation; query keys/types/casing semantics retained. BE9 and skill synchronized; legacy copying setters remain scope-bound. Source-supported; owner build/request replay pending; affected packets regenerated in the report follow-up. |


### 2026-10-09 continuation lessons (UI10/14/2/19/22)
- Use the shared plural form-state snapshot for routed editors and workflow dialogs with separate draft/filter/context forms. Gate restoration by identity, mode, disposed state and pending work; keep the default `EditableRows` behavior unchanged.
- Required settings reads that gate Save or Finish must use an opt-in strict cache that does not cache failures; callers join it with lookup readiness and expose translated Retry while preserving values.
- Evidence: Limousine TripBooking, LimousineInvoice, tariff context and quotation continuation. Source-only; owner compiler/runtime/visual/RTL/financial acceptance pending.

| 2026-10-10 | Shared export/print light-blue output palette | §6.1; UI20/24 | Owner clarified output buttons should use light blue from the existing Sigma palette and affect the whole application. Global sigma-output-action and report output selectors share primary/surface wash, primary/strong-border mix, balance text and theme-aware hover/focus; native output icon buttons are covered for compatibility. Geometry is unified to the shared 34px/inline-flex/6px-gap/10px-padding/1px-border/4px-radius/0.75rem-700/no-shadow style; ordering, labels, loading, disabled state, RTL and print behavior remain unchanged. Book and skill synchronized; source-only owner visual/theme acceptance pending. |
| 2026-10-11 | Intermediate inline filter layout and grouped checks | §3.2; UI4 | Owner reports1365-to720 compression and wants checks on one mobile row. Optional responsiveColumns moves actions below fields at1365 and selects intermediate tracks, then single fields at720. Shared three-track check group retains the row and removes standalone heading reservation. Leave6/Holiday2 opt in; default consumers preserved. UI4/skill synchronized; source-only owner visual/RTL acceptance pending. |
| 2026-10-11 | Responsive consistency across screen sizes | §10; UI29, Master5 | Owner requires explicit confirmation of element consistency at every screen size. Review all supported layout intervals, breakpoint boundaries and intermediate sizes; record responsive matrix, trace cascade, preserve usable widths/alignment/groups/scroll and cover long values/feedback/Arabic/themes. Known findings prevent acceptance; source-only work retains pending visual verification. Owning books and skill synchronized. |
| 2026-10-11 | Responsive title Create action | §2.4; UI3/24 | Owner wants Add beside title while space permits and slightly smaller on small screens. Default-off responsiveActions enables natural650px wrapping and shared32px/10px/10px/4px primary sizing. Leave/Holiday adopt; accessible text/action behavior and other consumer defaults remain. Books and skill synchronized; source-only visual acceptance pending. |
| 2026-10-11 | General shared presentation, filter collapse and title actions | §2.4/3.2; Master5, UI3/4/24 | Owner explicitly generalizes reusable ideas and title Add behavior. Every shared filter panel gains an initially expanded screen-only below1200 disclosure preserving form/advanced state; every FeatureTitle adopts natural small-screen wrapping and shared primary sizing, superseding the prior opt-in. Authoritative instructions, books, skill and common EN/AR in-app guide synchronized; source-only owner acceptance pending. |
| 2026-10-12 | Positive VAT allocation remainder and numeric bounds | BE15 | Rental source review proves many tiny rounded proportional taxes can exceed the document tax. Shared VatPolicy preserves normal allocation; only a negative remainder with nonnegative sources floors other shares and gives the largest line the exact balance. Intermediate decimal overflow uses ratio-first arithmetic only on that boundary; consumers validate aggregate storage bounds first. Document VAT unchanged; owner compilation/runtime pending. |
| 2026-10-12 | Shared last-row filter choices and row spacing | §2; UI4 | Rental owner asks for a shorter card, raised actions and smaller vertical field spacing. Shared appFilterToolbarStart projection keeps feature-owned merge choices opposite mandatory Reset/Search and removes a redundant full-width field/action row. Shared rowGap defaults7px; Rental selects3px. Existing fieldset semantics, validation reserves,34px controls, default-empty/advanced/inline behavior, wrapping/collapse/RTL remain. Book/guide synchronized; source-only owner visual/keyboard/runtime acceptance pending. |
| 2026-10-12 | Further Rental field-row reduction | §2/3; UI4 | Owner reduces Rental rowGap3→1px through the existing public input. Shared default7px and validation/control geometry retained. Field-spacing digest reconciled with the public rowGap rule; no new capability. Source-only owner visual acceptance pending. |
| 2026-10-12 | Shared title/filter separation | §2; UI3 | Owner requests slightly less title/filter space. FeatureTitle default bottom margin16→8px through the shared owner, retaining top/inline8px, parent gaps, card geometry and report overrides. Book/guide synchronized; source-only owner visual/RTL acceptance pending. |
| 2026-10-13 | DI scan data carriers | §8.2; BE5 | InvoiceAccountingMetadata record implicitly implements IEquatable and was registered by the broad Business scan, failing activation on enum/string arguments. Construct/read-only metadata becomes a sealed getter-only class with no interfaces; global scan and real service registration preserved. Owning book synchronized; source-only owner rebuild/start confirmation pending. |
| 2026-10-13 | List query identity correction | §8.2; BE9 | Invoice load review finds the same copying-setter defect already documented in BE9. ListSmBase preserves MVC's bound Filters instance with an initialized nullable auto-property; endpoint names/types and service normalization retained. Source correction complete; actual request status/replay pending. |
| 2026-10-13 | Shared DeepSeek mock forms and scalar key settings | §7/8; UI13, BE16 | Owner requests shared mock data in all editable screens, preview/manual Save and Settings key; then explicitly chooses unencrypted storage for current development. Shared adapter preserves field/event/save owners, stale identity/options checks and metadata-only privacy; 254 roots. ApiKeySetting moves to Mine with independent scalar writes, write-only plaintext key and filtered tenant index. Parent Settings bounds have a scoped legacy compatibility exception. Books/digest synchronized; owner migration/build/runtime/visual acceptance pending. |
| 2026-10-13 | Mock candidate mismatch recovery | §8/9; BE18 | Owner reports rejected DeepSeek results in IndividualPartner/Companies and supplies metadata request/HTTP400. Actual-key schema/example replaces generic prompt example; explicit string choices, one repair within45s total and safe reason/field diagnostics preserve strict validation/manual Save. Exact original provider mismatch is unproven without its output. Shared bilingual guide updated; source-only owner build/replay pending. |
| 2026-10-13 | Global mock display preferences and section actions | §7/8; UI13/BE16 | Owner wants Settings options for button/preview visibility and action in section title. Default-true tenant flags preserve omitted values and prefs-only save; EF true sentinel retains false first insert. Shared FormSection action scopes fields, fallback avoids duplication, preview-off fills draft with same confirmation/cancel/stale/manual Save; session cache/recovery and bilingual guide updated. Source-only owner AddMockDataDisplayPreferences/build/runtime/visual pending. |
| 2026-10-13 | Optional mock overwrite confirmation | §7/8; UI13/BE16 | Owner adds Settings option for confirmation visibility. ShowConfirmation defaults true, nullable writes preserve it, and false bypasses only mock overwrite confirmation. Captured preview/cancel/stale/manual Save and discard/domain confirmations retain their owners. Lean DTO/map/cache/recovery/EN-AR guide synchronized; owner AddMockDataConfirmationPreference/runtime pending. |
| 2026-10-13 | Mock generation without a modal | §7; UI13 | Owner clarifies disabled preview must not mount a loading dialog. Candidate readiness is independent of visibility; shared heading loading/Cancel and root pending click/submit gates retain cancellation and manual Save. Confirmation stays independent; both options off opens no mock modal. Guide synchronized; source-only owner interaction/visual acceptance pending. |
| 2026-10-13 | Credit Cards mock action | §7; UI14/13 | Owner reports missing action in customer creation. Shared EditableCollectionTable gains section scope/action and wrapping; optional owner callback prepares an empty draft through existing Add then renders/registers fields. Individual/Company cards adopt; Cancel/failure retains prepared draft, sensitive cardNumber/CVV remain excluded, payload/manual Save unchanged. Source-only owner interaction/visual acceptance pending. |
| 2026-10-13 | Manual Add before mock rows | §7; UI14 | Owner supersedes automatic card preparation: show Generate only after Add Credit Card/Add Document creates rendered supported controls; final Remove hides it. Shared preparation callbacks/empty-row bypass removed; Add and cancel/values/row counts/manual Save stay owners. Guide synchronized; source-only interaction/visual acceptance pending. |
| 2026-10-13 | Synthetic Card Number/CVV inputs | §7/8; UI13/14/BE18 | Owner requests test values for excluded card inputs. Typed native-input marker and matching control names permit text digit strings16/3, including masked cvv, in Individual/Company. Provider schema/example/prompt/strict validation align; current values never sent, ordinary secret exclusions/manual validators/Add-first/Save retained. No new DTO/schema; source-only owner replay pending. |
| 2026-10-13 | Card input column widths | §5/7; UI14 | Owner wants compact CVV/default gap and wider Name on Card/Bank Name. Both consumers use existing76/80/240/220px column widths and1280px frame minimum, leaving other tracks flexible. Shared cell/control geometry and frame scroll retained; no feature CSS/payload change. Guide synchronized; source-only visual/RTL/theme acceptance pending. |
| 2026-10-13 | Production component CSS budgets | §1; UI29 | Owner supplies4KB failures, largest16.44KB. Existing Angular budget changes warning2→10KB/error4→20KB; initial2MB/5MB and optimization retained. Book/digest synchronized; JSON/schema/diff source verification only, owner production build pending. |
| 2026-10-13 | Production initial bundle budget | §1; UI29 | Owner subsequently supplies initial5.22MB failure against5MB. Only initial maximumError changes5→6MB; warning2MB, component10/20KB, builder and optimizations retained. Book/digest synchronized; source JSON/schema/diff verification only, owner build pending. |
| 2026-10-21 | Critical-CSS build warnings | §1; UI29 | Source inspection of Angular 17/Critters explains skipped pseudo-class selectors as critical-inlining limitations, while emitted rules remain; a copied splash stylesheet linked from the index misses the Windows in-memory asset lookup. Splash styles move inline in the index; documented warning distinction retains budgets and optimization. Source-only; owner production build and first-paint acceptance pending. |
| 2026-10-14 | Shared CSV import workspace and transport | §4; UI2/6/18/22/24 | Eleven Administration imports share preview/manual Import, typed cell preparation, complete-array paging, partial counters and declared/HTTP feedback. Root CsvImportService owns the repeated environment URL/header/typed-envelope transport; features own route/body/fields. Four missing contracts stay deferred by owner instruction. Book/digest synchronized; source-only owner compiler/runtime/visual pending. |
| 2026-10-14 | Shared CSV template and local-file cards | CSV import workspace; UI6/18/23/24/29, Master7/8 | Owner requests a more attractive Import Data presentation. Existing ImportCsv owns token-based template/file cards,14px inset/12px gaps/44px icon tiles/12px radius and580px container stacking, native ordered-column disclosure and shared Choose/Change action. Filename appears only after valid parsing and clears on replacement/failure/reset. Workspace bounds setup/feedback at45%, keeping Import/Reset/preview/pager fixed; displayed count and backend result counters remain distinct. EN/AR guide and keys synchronized; existing local preview/no-save and partial-attempt guards preserved. Book/digest synchronized; owner visual/runtime acceptance pending. |
| 2026-10-14 | Persistent explicit desktop sidebar minimize | §6; UI1 | Owner reports Import Data under an apparently unclosed sidebar. Current hoverable state expands the minimized rail over the wrapper after its animation guard. Sidebar owner clears legacy desktop hover, Light/Dark defaults use false and one native logo button toggles the same body attribute without the Metronic double listener. Shared guide/labels synchronized; widths/RTL/mobile/storage unchanged. Source-only owner keyboard/visual/runtime acceptance pending. |
| 2026-10-14 | Range year caret preservation | §3.3; UI17 | Owner reports From year typing moves caret to To. Shared directive retains guarded range text in Calendar.inputFieldValue and snapshots selection after normalization, restoring only an unintended end collapse after render with same-text/focus/editable guards and superseded/destroy cleanup. Installed API declarations checked; no parser/form duplication or single-date changes. Book/common bilingual guide synchronized; exact runtime trigger and owner reproduction remain pending. |
| 2026-10-14 | Selected range-year boundary correction | §3.3; UI17 | Owner reports previous repair failed and clarifies selecting From year before typing. Supersedes the render workaround above: protectRangeMarker branch was blocking a year plus trailing space and moving insertText to To. Trim selected endpoint overlaps before native edits; rejected marker-only/cross-endpoint insertions retain selection. Remove render callback/display mutation; keep parser, deliberate boundary deletes and noncancelable fallback. Book/common EN-AR guide synchronized; source-only, owner reproduction pending. |
| 2026-10-14 | Correction record family and accepted cleanup | UI13; BE18 | Both correction APIs reuse one feature-family list/editor/transport and static input policy. Historical IDs/paths stay compatible; batches validate before one save. Accepted tracker cleanup closes before finalize releases its flag; failed cleanup retries only cleanup. Books and contract synchronized; source-only owner migration/runtime/orphan-expiry acceptance pending. |
| 2026-10-14 | Sidebar search height dependency | §6; UI1 | Owner reports final Billing item missing and sidebar scroll extending below viewport. Existing auto-height calculation omitted fixed search height and referenced a missing wrapper id. Search becomes an explicit measured dependency and host supplies wrapper id; geometry, save-state, navigation, disclosure/pins retained. Shared EN/AR guide synchronized; browser/Windows helper unavailable, owner short-height/mobile/RTL/theme acceptance pending. |

### Correction-record family composition *(UI13; BE18)*

Reuse feature-family CorrectionWorkspace/Editor/ApiService for the two correction
record APIs; existing shared visual controls keep their owners and each API keeps
its persistence/lifecycle. Their internal static CorrectionInputPolicy reuses VM
validation, complete SLA eligibility and stored-path ownership; batches validate
before mutation and save once. Unchanged historical IDs/paths remain compatible.
On accepted tracker cleanup, close checks independent load/save/upload/session
gates: the success value precedes finalize releasing cleaning. Failed cleanup
offers cleanup-only Retry and never repeats a successful Save. The correction
write-only description cap preserves historical storage; owner migration/build/
runtime and shared orphan expiry acceptance remain pending.

Revision 2026-10-14: correction-record family composition and cleanup acceptance;
owning UI13/BE18 blocks and feature contract synchronized, source-only.

### CSV import workspace *(UI2, UI6, UI18, UI22, UI24)*

For repeated standalone CSV import routes with the confirmed ImportResult envelope and no context editor, use the shared `app-csv-import-workspace`: it owns the bounded title/file-selection/preview/result shell, local complete-array paging, explicit Import action, counters, partial results, failure channels and no-retry-after-attempt guard. Consumers own exact ordered columns, aliases, typed row builders and existing endpoint/body contracts. The root CsvImportService owns repeated HTTP transport and both feedback-suppression headers. Selecting a file is preview-only; do not fabricate a CRUD/list API or send client-calculated fields. Source-only adoption is documented in the Data Import review; owner compilation/runtime/API/visual acceptance remains pending.

Shared CSV presentation (UI6; owner2026-10-14): ImportCsv owns template/local-file
cards for all current consumers, with14px inset,12px gaps,44px icon tiles and12px
radius; two equal columns stack at container width<=580px. Expose exact ordered
headers in native details and open the hidden native input through shared
keyboard-operable Choose/Change. Filename appears only after valid parsing and
clears on replacement/failure/reset; show parsing state, without whole-card or
drag-and-drop actions. Selection reads locally and never saves. Workspace cards
and feedback share one setup region capped at45% of panel height; title/subtitle,
Import/Reset, preview heading/count and table pager stay fixed, table rows retain
their scroll owner. Count describes displayed rows, not saved rows; preserve
SummaryCards counters and partial-save guards. Use logical/theme/focus/wrapping
owners, update the existing EN/AR guide (Master7), regenerate affected packets
and check them (Master8). Source-only; both sides of580px/intermediate/short-height,
long names/Arabic, RTL/themes and direct-dialog visual/runtime acceptance pending.

Revision 2026-10-17 — Optional controlled-dialog workflow footer actions (UI13/24): existing EditorDialog owns typed actions, placement, styling and Save disabling; Languages owns navigation and dirty guards. Empty defaults preserve consumers. Books and digest updated together; source-only, owner runtime/visual acceptance pending.

Compact import options *(UI6, owner scoped2026-10-20)*: ImportCsv's optional
compact=true replaces cards with one secondary dropdown offering template
download, Choose/Change and exact ordered columns. Reuse existing
DropdownPortalDirective/Bootstrap placement/outside-close behavior; handle menu
arrows/Escape inside ImportCsv because body placement removes trigger adjacency.
Escape stops propagation and returns trigger focus, preserving the parent dialog;
one native input/parser/events/disabled/parsing/reset/error/valid filename owner
serves both modes. Shared compact host bounds and filename ellipsis keep the
full accessible/title name. Combine with Prepare/Add through existing
FormSection header actions and suppress duplicate table heading/Add. Default
false preserves current cards; the Loan Payment Plan request is screen-scoped,
not a global migration. Source-only popup/focus/RTL/short-height/theme acceptance
remains pending; opening options never parses, changes rows or saves.


