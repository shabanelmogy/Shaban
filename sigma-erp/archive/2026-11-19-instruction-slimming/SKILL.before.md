---
name: sigma-screen-refactor
description: Review, create, fix, or refactor Sigma Angular screens and their directly related .NET APIs using the current canonical books, shared owners, and frozen feature contracts. Use for Sigma screen work; unrelated application or artifact tasks use their own skills.
---

# Sigma screen review and implementation

This is a compact router, not another implementation manual. Read the workspace
[AGENTS.md](../../../AGENTS.md) and its mandatory live
[SIGMA_WORKFLOW_RULES.md](../../SIGMA_WORKFLOW_RULES.md) completely first. They
own authorization, prohibited operations, controlled delegation and reporting.
Direct user instructions and frozen contracts retain their existing precedence.
(Master1/3/4/8)

Documentation root: `F:\My Work\Shaban Documents\Shaban\sigma-erp`.
Start at its [README](<F:/My Work/Shaban Documents/Shaban/sigma-erp/README.md>)
and the current [review index](../../../reviews/INDEX.md). Paths to numbered
blocks below are relative to the documentation root. Read the selected current
block itself and the real shared/reference owner; a recent similar feature is
not automatically canonical. Historical snapshots are not current instructions.
(Master1/8)

## Select the task and contracts

Use Master1's opening disclosure before application-source investigation: state
scope/mode and books; list Speed guide/explanations and Speed code separately,
then available relevant Odoo documents for gaps remaining after Speed. Name the
Sigma skill and relevant process skills; verify and disclose Superpowers
availability or its inapplicability, without installing it. State verification
boundaries and distinguish planned sources from those actually read. The live
rules own this disclosure; it adds no approval gate. (Master1/2/7)

| Request | Route and stop condition | Owner |
|---|---|---|
| Review/audit | Source-read-only unless fixes or an implementing phase were requested; report findings | Workspace live rules; Master1/3/4/7 |
| Plan/shared ambiguous change | PLAN-00; inventory existing owners and open decisions; stop at the plan when that is the request | Master1/4 |
| Create or authorized fix/refactor | Discover, freeze consumed contracts, implement confirmed scope and reconcile; do not stop at a plan with resolved authorization | Master1/3/4/7 |
| One bounded element | Tier S; applicable rule and existing review, no unrelated full-screen artifact set | Master1/5 |
| Named phase or deferred decision | Execute only that phase or resolve the exact recorded condition; a deferred record grants no implementation authority | Workspace live rules; Master3/4 |

Choose the proportional tier before copying a template. Select the actual UI
shape from [the screen catalog](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/screens/00-catalog.md>),
then the simplest valid backend pattern from `backend/00-preamble.md` and
blocks13–17. A report's transport paging does not turn it into a CRUD list.
Freeze shared API/domain contracts before splitting dependent work. Missing
material financial/API/permission/state rules block only their dependent slice;
apply the existing screenshot standing decision within its actual limits.
(Master1/2/3/4; UI20; BE13–18)

Before using generated packets, run:

```powershell
& 'F:\My Work\Shaban Documents\Shaban\sigma-erp\recipe-system\Generate-SigmaRecipes.ps1' -Check
```

Reconcile derivative drift and regenerate only through the generator, then
review semantics and approved-reference roles and recheck. Hash equality is
not semantic correctness. (Master8)

Inline report/filter feedback can use `StateMessage.compact` without the
panel state's reserved height; retain one feedback owner and an existing
action for retry. Loading retains its normal presentation. (UI22)

## Reviewed access contracts

Apply the ERP TenantAdminOnly catalogue exclusion and PermissionPrerequisites
metadata when adopting another screen. Show fixed and conditional requirements
from their existing owner; let the administrator review additions to the draft.
Use full translation-key maps for condition identifiers. Share screen-package
requirements with actual route/editor/list owners and record coverage remaining.
Capture readAuthSessionKey/observeAuthSession for stateful ownership across
credential renewal; HTTP and SignalR use actual credentials. Runtime acceptance
of renewal and remaining H1 work stay explicit. (UI26 with UI23/28)

Follow Master1/7 for migrations required by authorized implementation on a verified
Sigma experimental database. Check the EF diff and
target baseline, verify the resulting database schema and rows, and link the
recorded migration ID from affected reviews.

## Mandatory evidence gates

Use the existing report-read-state lifecycle for reviewed collection-family
reports with different filter contracts. Keep typed forms and validation with
the report, and preserve the existing collection facade for its consumers.
Trace session, loading and full-output cancellation through that owner. (UI20/21/22/28)

For the shell drawer, capture the current navigation ID when opening and close
on a later completed page-path change. Reuse parsed UrlTree root identity for
query/fragment updates and navigation already underway at opening. (UI1/28)

Trace company-wide structural exclusion queries through the final published
read and options. Keep `IgnoreQueryFilters` inside separately executed bounded
ID reads, or use the existing explicit preservation owner. Retain the branch
boundary on rows, labels, totals and output. (BE9)

Use AgreementReturnReportQueries.LatestIdsAsync for a report's already-authorized
agreement candidates before reading actual return fields through normal scope.
Keep the feature's row-exclusion or date-redaction decision explicit; expected
return dates do not establish actual closure. (BE9)

For a document Approval Status action, route through UI7's shared document
approval owner and its real `injectApprovalStatusAction`/workflow panel. Verify
the catalog type, saved root identifier, native read grant and explicit workflow
write notification before reconciling each screen. (UI7; UI22/26/28)
Display stage rows through DataTable/ActionList with server-wide and per-row
eligibility. Apply the workflow write response, and use semantic native refresh
keys to avoid reloading stages after unchanged native reads. The first decision
uses the approval feature's preview/version contract without a separate Start
step; reading remains side-effect free. Feature-authorized reversal uses the same
row owner and server canUnapprove capability; bind its reason to the selected row
and version, recheck access, and clear invalidated native capabilities after the
response. Reversal business guards stay in the feature contract. (UI7; UI22/26/28)

- Before freezing/changing a screen contract, start at
  [the local analysis entry](<F:/My Work/Shaban Documents/Shaban/sigma-erp/references/speed-analysis/README.md>).
  Read the relevant chapter/original explanation and dated sidebar/code cycle,
  using Speed's guide and code first. For scoped concepts/details still missing
  or unclear, consult the pinned official [Odoo complement](<F:/My Work/Shaban Documents/Shaban/sigma-erp/references/odoo-rental/README.md>)
  and record the precise gap and its evidence; do not start from Odoo merely for similarity.
  Then compare actual Sigma source, contract and in-app topic. Record dates,
  source IDs/file:line/hash, evidence kind and matched/partial/missing/blocked/
  excluded details. Reference functional detail is the target; frontend evidence
  does not establish unknown server, accounting or permission rules. No external
  collection or execution is authorized. (Master1/2/4/7)
- Trace the active route/import to its real consumer. Inventory request triggers,
  subscribed start/finalize/cancel, effective route metadata and the rendered
  progress host: one visible owner plus busy/error/Retry. Required routed initial
  and filter lookup bootstrap uses the page owner; dialog scope stays local and
  retained-data refresh silent. Query/fragment-only navigation preserves pending
  progress; departing reads release through finalize without resetting target
  requests or changing write safety (UI22 correction2026-11-05).
  Runtime visibility remains separate evidence. (Master5/7; UI1/22/28)
- Classify every consumed URL/service as opted-in reference cache, explicit
  singleton exception, direct reference without opt-in, direct operational/policy
  read, or unresolved eligibility. Trace successful writers/imports/invalidation/
  tenant topics and actual finite bootstrap → separate watch → selected-label/
  draft preservation → context clearing → failure/Retry → teardown. Keep excluded
  financial, capacity and availability reads on their existing contracts. A changed
  shared access revision invalidates opted-in lookup reads even when identity and
  working branch stay unchanged, through the existing retained refresh owner and
  without resetting drafts or sent writes (UI2). Names
  or imports alone do not prove cache adoption. (Master5/7; UI2/22/28)
- Trace bounded request/query/data/page scope, serial/duplicate/per-row work and
  existing index coverage. Record comparable before/after evidence or pending
  owner timing/SQL-plan checks; justify exact index proposals or no new index.
  Fewer source calls and loader/cache adoption do not prove speed. Do not run
  prohibited verification or change schema for this gate. (Master5/7; UI29; BE2/7)

## Read only applicable implementation owners

Read the full selected blocks, including their current source-backed refinements;
this table routes to them instead of copying their component APIs or incident history.

| Concern present in scope | Blocks and contracts to read |
|---|---|
| Route, shell, Angular adoption, width/scroll and layout composition | UI1/3/27/29; Master5. Fixed workspace tools sit outside their bounded scroll content; use PermissionTree.fixedToolbar only where the parent supplies its bounded flex region, retaining dialog-owned scroll elsewhere |
| Shared service/envelopes, lookup eligibility/cache, input/output ownership | UI2/16/28; BE3/5/6/8/10 |
| List, filters, grid menus, action eligibility and complete export | UI4/5/6/7/8/10; BE7/9 |
| Dialogs, routed/step/tab editors, draft exit and child completion | UI10/11/12/13/15/28; selected shape. Compact action forms keep status/copy/multiline inputs full-span; content-sized flex chains use the actual sigma-u-flex-fill owner (UI13) |
| Shared mock generation dates | UI13 current-year candidate limits and explicit mockDataIgnore for derived inputs; existing field bounds and backend strict validation, without changing real controls or manual Save |
| Editable collections, source-line pickers/provenance and document children | UI13/14/18; BE8/14/15/18 |
| Dates, uploads, typed validation, numeric fields and calculated previews | UI14/17/18/19/27. BE2/3/8/15/18. For the shared document table, pass its reviewed uploadFolder and file lifetime/access inputs into existing FileField; selecting a folder is not authorization. Adopt tracker requirements and FileField permission for stored attachments, uploadPermission for replacement-specific grants, and operationAllowed for picker/clear events on expiring documents. Fence returned-path publication separately and retain the editor's sent uploads and cleanup paths. On teardown cancel idle cleanup waits while preserving sent DELETEs. Share row removal eligibility between the table and EditableRows. Private image/document reads use FileLink's closed resource and optionally bind contextAllowed and contextCancelled$ to the mounted document lifetime. |
| Exact money strings, dated-rate text, currency display/export, ratios and document VAT allocation | UI19 and BE15; reuse FinancialNumberPolicy.Currency and financial-number.util exact ratio/once-per-rate allocators; adopted approval amounts carry document precision/code and amountTextInWords keeps text amounts exact; document full producer/consumer adoption before opening foreign posting |
| Explicit document currency selection, current-input conversion, date/rate preview and source-currency locks | UI19/22; extend DocumentCurrencyComponent with its connected document DTO/snapshot owner; capture page/dialog read scope and release preview loading before confirmation; keep Preview/Reset available during pending selection |
| Source-base display and session-scoped row confirmations | UI19/14/28; require DocumentCurrency base-policy readiness without partner defaults where the source owns base amounts; cancel EditableRows decisions on context expiry while preserving independent sent writes |
| Whole local-calendar day differences | UI17; reuse calendarDaysBetween for validated dates, retaining the feature's time-order and minimum-day policy |
| Reports, summary controls, incremental/paged/complete data, printing | UI6/8/20/21/22/28/29; BE2/7/17; adopted Accounts report/filter accessRequirement uses the existing page owner, sanitized snapshots and per-read/deferred cancellation, with required route dependencies; canActivateRow checks current section-object membership, details view and nonbusy output while consumers retain destination/route/business guards  backend-owned complete-result footer rows use DataTable.footerRows in the same scroll frame, outside filtering/paging/counts/selection; label their applied-filter scope; never repeat an active tab caption or selected inner side-list item title inside its panel on screen — keep section/group headings print-only via the shared `.sigma-print-only` utility in `src/styles.scss` (never retired Bootstrap `d-none d-print-block`) with accessible region labels (UI20/21) |
| Reports with opening/totals but no movement rows, or currency sections | UI20/19; shared AccountReportConfig.hasOutput gates controls and handlers together; keep original currencies separate and source-owned opening/totals exact; use BE15 SumCurrencyReadAmounts for read aggregates only |
| Mounted report context changes and opted-in reference filters | UI2/20/21/22/28; clear ReferenceLookupBindings between contexts, cancel old reads and queued print, use the shared canPrint guard for its final frame, clear stale results and bootstrap through the page owner. Optional watchOptions keeps direct-read sources excluded |
| Currency settlement / bank carrying-value calculations | BE15; reuse FinancialNumberPolicy.Settlement under the frozen feature contract; pure arithmetic does not open foreign posting or replace dated events/contribution persistence |
| Domain actions, approval, journal/log readers and linked document lifecycle | Master4; UI7/9/13/22; BE8/11/12/14/15/18 |
| Authorization regressions in write invariants and mounted surfaces | BE6/8/9, UI21/28, Master5/7. Verify the actual HTTP action and rejection layer. Authorize the target, then calculate its complete branch effects or shared-source usage within the write boundary. Check required activity and retained-row identity. Cover nested dirty exit, permission-dependent query copies and print row identity. |
| Entity/EF/DTO/mapping/service/controller and transaction boundaries | BE1–6/8/13–18; Master4/5 |
| Custom MVC route discriminators | BE6; avoid reserved route values for business parameters, bind renamed route values explicitly, and distinguish literal-path matching from Swagger presence and downstream authorization |
| Static-folder and API-root name collisions | BE6; distinguish the real upload-folder position through the existing PrivateUploadPath owner, retain normalization and private-file denial, and cover API roots/actions alongside encoded nested media paths |
| Exact financial request lexemes and JSON converters | BE3; keep raw dated-rate/quote/snapshot text through the existing TrimIncomingStrings owner before strict validation |
| Owned generated draft journal currency | BE15; preflight the source-owned unposted journal and account resolution before tracked mutation, then persist source evidence and rebuild through SaveCurrencyDraftJVAsync inside the same transaction |
| Exact monetary list/journal reads, comparisons and read aggregates | UI5/6/19 and BE9; opt in decimal-string DTO consumers together, preserve raw grid filters and private BigInt units, and keep aggregate output separate from single-amount input bounds |
| Conditional grants, shared catalog references, and concurrent writers | BE8 and Master4/5; trace branch view versus transaction scope, tenant-wide delete integrity, and conditional field checks at the final write boundary. For participating writers, reuse TransactionWriteLock with the same owner/subscription and preserve its transaction/error contract. Verify the actual filter/service path |
| Loading/feedback, authentication, session and independent write lifetime | UI1/2/13/22/26/28/29; shared MockData binds its mounted actor context, rechecks after replace confirmation and cancels generation candidates on denial while retaining the editor draft; editors with an expiring document also supply its publication predicate and cancellation notifier for pending generation and completed preview |
| Disposable document-journal dialog access | UI22/26/27/28; use DocumentJournal's optional accessRequirement and existing localReadProgress=true dialog default; expiry cancels/clears/closes the viewer and its deferred focus, while false captures one page-progress lease; existing consumers without requirements retain their own contracts |
| Current-session route/action visibility and backend permission enforcement | UI26/7, Master4/7 and BE9; trace real route/action keys, prerequisites and endpoint policy through shared access owners. Check persisted row-branch capability and recheck after confirmation. Trace custom and inherited read endpoints independently, including their actual grant, projection, filter/grid/sort allow-lists and count. Keep lookup failures within the actions that require the lookup, including optional field changes, and close body-appended filters when access or context expires (UI16/26). Reconcile sent settlement, result visibility and refresh for the original session that can still read. Link latest findings, schema and runtime status from coverage |
| Mounted document approval reads, decisions and reason portals | UI7/13/26/28; use DocumentApprovalCycle's separate optional accessRequirement/decisionRequirement and parent accessBlocked; the decision also needs the read grant, the panel recovers revision/regrant reads without a loop, retains reason drafts, expires old contexts and preserves sent writes; modal reads use localReadProgress and stage actions use the shared table |
| Permission changes while an editor or nested overlay is mounted | UI13/26/28; use EditorDialog's explicit access requirement/state for body portals, retain draft/sent-write lifetime and flex ownership, and cover nested selects/previews; keep draft identity separate from read cancellation revisions so successful sent Create remains consumed after regrant; separate access-output invalidation from busy effects and restore required lookups on regrant; commit pending blur input before deciding whether the draft is pristine. Cancel expired dirty-exit decisions while retaining a new local discard after denial, with lazy confirmation and cleanup outside the decision notifier; a cancelled route-guard confirmation emits false (UI10/28); no-preview generation denied at completion releases its form freeze without applying values |
| Shared presentation, translations, RTL/themes, icons and keyboard/focus | Master5; UI3/4/6/13/14/19/23/24/25/27; PermissionTree owns the wrapping search/actions and filters/count toolbar with shared native control geometry (UI24); protected editor deferred focus uses focusField cancelOn/destroyRef/allowed with captured actor/document identity and permanent cancellation of frames/overlay timers |
| Settings affected screens, single/keyed saves and internal vertical groups | BE16; UI1/13; dated `references/settings/README.md` and field catalog: trace actual consumption, retain owning Save and mounted draft; use shared settings allocation and invalid-section focus |

Use Sigma's real shared PrimeNG-based owners and public contracts first; extend
an existing owner or extract genuinely shared behavior in scope rather than
copy wrappers/styles. Preserve model-owned business rules, working composition
and current user/peer changes. Backend calculation and validation remain
authoritative. Numeric quantities/fractional hours/meters use the shared policy;
true counts/identities and financial values retain their own domains. Reject
excess input scale and round only at the approved calculated boundary; do not
preserve accidental precision for experimental data. (Master5; UI14/19; BE18)

Current local/hosted Sigma data is experimental. Apply Master1's clean-start
baseline across modules: use the correct required relationships and permissions,
and do not add compatibility paths, fallbacks or weakened validation to preserve
old experimental rows. Within the requested task, directly read/write/repair
the project's experimental local/hosted development/test databases and remove
experimental duplicates under the owner's standing permission, without repeated
permission questions. Verify the actual target and bounded tenant/record scope;
preserve financial, reference and permission correctness and record operations,
affected rows and resulting checks. Production/out-of-project databases, schema/
full reset/drop are outside this grant. Scoped experimental migrations follow
Master1/7; existing tests/lint/
browser/commit/deploy boundaries remain unchanged. (Master1/7; workspace live
rules, owner2026-11-09 and2026-11-16)

## Reconcile and hand off

Compare the final source with the frozen requirements, relevant functional
reference coverage and every applicable evidence gate above. Reconcile producer
and consumer types/filters/counts, shared-owner conformance, action/state and
persistence/namespace boundaries. Review the complete scoped diff in each actual
repository; preserve unrelated work. Source checks do not prove build/runtime/
visual/data results. An authorized screen implementation includes the owning
module's bilingual in-app guide through the existing reader. Report remaining
material decisions and owner checks precisely. (Master4/5/7; UI23/29)

For authorization changes, apply Master5/7's scenario evidence to the affected
producer and its next consumer. Cover dirty withdrawal/restoration, sent
outcomes and the final exit destination where applicable. Trace fixture setup
to the intended assertion. Reconcile each case against final symbols and
report mapping, source conformance, build, behavioral execution and runtime
acceptance separately in the existing artifact.

## Maintain this router

Promote a verified reusable rule into its owning canonical block and update
only the necessary routing/check plus a dated revision here in the same task.
Feature-specific decisions stay in feature contracts; label superseded history
in the documentation archive. Regenerate affected packets after canonical
changes, review their meaning and recheck. Process skills such as Superpowers
supplement this domain router within project authority and execution permissions.
(Master8; workspace live rules)

| Date | Revision | Owning blocks and evidence |
| 2026-11-19 | Add shared `.sigma-print-only` utility in `src/styles.scss` (replacing retired Bootstrap `d-none d-print-block`) and keep every active tab and inner side-list selector title print-only rather than repeating it inside panels on screen | UI20/21; owner instruction on Detailed Vehicle Utilization Report (all tabs + `Branch Wise Rented` split pane); runtime/visual pending |
| 2026-11-18 | Share bounded latest actual-return identity probes while retaining each report's membership and date-redaction policy | BE9; Daily Business and Sale Report source reconciliation; SQL/runtime pending |
|---|---|---|
| 2026-11-18 | Reuse report read lifetime across customer and voucher collection filters | UI20/21/22/28; Customer Wise Collection implementation and collection facade reconciliation; runtime pending |
| 2026-11-18 | Mark exactly one sidebar row as the current page (most specific route, then the user's chosen entry, then catalog order); groups on its path show colour only | UI1; SidebarMenuComponent selection source and regression specification; runtime pending |
| 2026-11-18 | Retain newly opened shell drawer across earlier navigation and same-page query changes | UI1/28; LayoutComponent navigation lifetime source and regression specifications; runtime pending |
| 2026-11-18 | Preserve report branch scope across company-wide exclusion reads and selector composition | BE9; existing purchase-request preservation owner and collection report source audit; runtime pending |
| 2026-11-17 | Include required migrations in authorized implementation on confirmed experimental Sigma databases | Master1/7; verified target, reviewed SQL, scoped application and post-apply evidence |
| 2026-11-16 | Route compact report/filter feedback through StateMessage.compact, retaining shared semantics and existing recovery actions | UI22; chassis profit/loss feedback owner request and source reconciliation; visual acceptance pending |
| 2026-11-16 | Apply the clean-start model without old experimental-data compatibility paths; use standing scoped Sigma experimental database read/write/repair/duplicate-deletion permission and record verified target/results | Master1/7; direct owner instruction, with migration/schema/full-reset/drop and other execution boundaries retained |
| 2026-11-16 | Route authorized stage reversal through row capability, version-bound reason and authoritative response; invalidate native capabilities when reopening | UI7 with UI22/26/28; ERP_APPROVAL_UNAPPROVE_CONTRACT_FREEZE and source reconciliation; runtime acceptance pending |
| 2026-11-16 | Present approval stages as shared rows with per-stage actions, consume mutation output and use semantic native refresh keys; no separate start in status viewers | UI7 with UI22/26/28; inline decision contract and source reconciliation; runtime acceptance pending |
| 2026-11-15 | Route document Approval Status to the shared row action and workflow panel, using persisted root identifiers, actual read grants, dialog-local reads and separate successful-write refresh | UI7 with UI22/26/28; ERP approval cycle implementation and per-screen coverage; runtime acceptance pending |
| 2026-11-15 | Distinguish a legacy tenant photo directory from the same-named API root while retaining shared normalization and canonical-folder guards | BE6; IndividualPartner 404 source trace, FileStore storage prefix and added path regression specifications; execution acceptance pending |
| 2026-11-15 | Route custom MVC business parameters through nonreserved names with explicit binding; preserve public paths and distinguish endpoint matching from Swagger inventory | BE6; identity action 404 versus Execute 401, controller source and official ASP.NET Core routing documentation; post-reload acceptance pending |
| 2026-11-15 | Keep compact action-dialog content full-span and use current prefixed auto-basis utilities; correct the retired flex-fill name in the content-sized recipe | UI13/1/27; owner qwe.PNG, identity action template and native utility source; visual acceptance pending |
| 2026-11-15 | Keep permission search, checks, count and actions in one bottom-aligned flex row, wrapping only when the pane is narrow; supersedes the same-day two-row presentation | UI24/1; explicit owner correction and PermissionTree source; visual acceptance pending |
| 2026-11-15 | Group permission catalogue tools in two wrapping rows with shared controls and a separate selection count; preserve fixed/body scroll ownership and trailing space | UI24/1/27; owner screenshot1.PNG and PermissionTree source; visual acceptance pending |
| 2026-11-15 | Keep fixed workspace search/actions outside scroll content through the shared PermissionTree option; preserve existing dialog scroll ownership | UI1; Roles owner correction, Angular/Sass and source layout checks; visual acceptance pending |
| 2026-11-13 | Route producer/consumer scenario evidence, dirty restoration, fixture reachability and accurate completion wording | Master5/7; authorization review 161 |
| 2026-11-13 | Route Item Issue review lessons into reusable authorization regression checks and the phase packets | BE6/8/9, UI21/28, Master5/7; review 159 |
| 2026-11-13 | Route the final queued print permission check through ReportPrintSession.canPrint options | UI21; authorization remediation 158 |
| 2026-11-13 | Route catalog branch and write integrity, optional lookup recovery, dirty exit, deferred print and specification fidelity | BE6/8/9, UI10/16/21/28 and Master4/5; authorization review 158 |
| 2026-11-13 | Route explicitly requested EF migration creation and application through target, SQL and post-apply evidence | Master7; employee execution branches migration and owner authorization |
| 2026-11-13 | Trace inherited reads, keep write-only lookup errors off search, close expired filter overlays, and build affected specifications | BE9, UI10/16/26/28 and Master5/7; review 157 and owner-scoped build authorization |
| 2026-11-13 | Reconcile actual permission contracts, protected list inputs, persisted branch actions and sent-write refresh | UI26/7, BE9, Master4/7; general documentation review and source review 154–155 |
| 2026-11-12 | Route private document table storage/lifetime inputs to FileField and separate sent-save draft consumption from read cancellation | UI18/28; movement authorization review140–144 and frozen remediation contract; source-only acceptance pending |
| 2026-11-11 | Route backend-owned report footer rows through the shared DataTable tfoot, preserving column alignment and excluding totals from data/filter/page/selection | UI6 with UI20/21; Vehicle Rental Details adoption and source-written footer specifications; runtime pending |
| 2026-11-11 | Route H3 administrative exclusions, H4 published dependencies and packages, literal condition labels and stable session ownership during H1 renewal | UI26 with UI23/28. Approved H3/H4 source reconciliation and H1 first-slice implementation; runtime pending |
| 2026-11-10 | Route protected rental agreement documents through the closed FileLink resource and mounted document lifetime. Use optional FileField operationAllowed for picker and clear events that can outlive the editor context | UI18 with UI22/26/28. RentalAgreement scoped source and lifecycle specifications. Runtime and storage acceptance pending |
| 2026-11-10 | Route MockData document expiry through optional parent publication predicate and cancellation notifier; cancel confirmation/generation/completed preview and release the original draft freeze independently of route grants | UI13 with UI26/28; LeaseQuotation route-reuse finding and source-written lifecycle specifications, execution pending |
| 2026-11-10 | Route sent attachment POST lifetime independently of field/editor destruction; retain success/error outcomes without resetting the shared operation, reject new uploads after tracker destruction, cancel idle cleanup waits and preserve already sent DELETEs; expire field publication separately | UI18 with UI26/28; LeaseQuotation source-order frozen contract, local RxJS shareReplay error-reset evidence and tracker regression specifications, source-only execution pending |
| 2026-11-10 | Route source-order private JPEG/PNG/PDF reads through the existing FileLink closed resource and recognize their canonical saved paths without a static fallback; retain actor/path cancellation and local dialog progress | UI18 with UI22/26/28; LeaseQuotation source-order frozen contract and source specifications, execution pending |
| 2026-11-10 | Route adopted DocumentJournal access, disposable-viewer expiry and cancellable focus through its existing shared owner; retain local dialog progress by default and captured page-progress opt-in | UI22 with UI26/27/28; Provision Transactions integration and source-written specifications, execution pending |
| 2026-11-09 | Extend closed FileLink resources to correction attachments and capture local dialog read progress at subscription for presentation and finalization | UI18 with UI22; correction attachment access contract and FileLink source specification; runtime/storage acceptance pending |
| 2026-11-09 | Separate FileField selection/replacement grants from clearing, and permanently expire saved replacement publication when cleanup is withdrawn during upload | UI18; Vehicle editor and shared FileField source specifications plus independent follow-up source audit; execution pending |
| 2026-11-09 | Fence queued EditableRows add focus with its existing context cancellation, actual row and mutation owner | UI27; shared focus source specification and Vehicle tariff adoption; execution pending |
| 2026-11-09 | Extend the existing private FileLink owner to vehicle-document PDF/image reads and fence FileField response publication while retaining sent tracker outcomes | UI18; Vehicle scoped adoption and shared source specifications; runtime/storage acceptance pending |
| 2026-11-09 | Bind protected-editor deferred focus to its actor/document and access lifetime through the existing shared focusField owner | UI27; Accidents editor integration and frame/timer cancellation source specifications; runtime/keyboard acceptance pending |
| 2026-11-09 | Route private authenticated image preview/link reads through FileLink's optional blob/access/context inputs and object-URL cleanup | UI18; AccidentImages private endpoint adoption and scoped source specifications, runtime/storage acceptance pending |
| 2026-11-09 | Route the project-wide experimental-data and clean-start baseline; avoid compatibility workarounds solely for test records while retaining execution boundaries | Master1; direct owner instruction to record that current Sigma data is experimental |
| 2026-11-09 | Keep attachment cleanup teardown on its pending idle wait, protect against teardown starting new cleanup, and preserve already sent DELETE outcomes | UI18 with UI28; VehicleType integration and tracker source specifications; runtime/test acceptance pending |
| 2026-11-09 | Bind the shared MockData preview and Apply to the mounted actor, recheck replacement decisions and cancel expired generation without applying candidates | UI26 with UI28; source owner trace and actor-switch regression specifications, execution pending |
| 2026-11-08 | Carry the sent mutation owner callback through HTTP context to guard global result notifications alongside local publication | UI26; Fleet/Workshop/HRM definitions source reconciliation and interceptor specifications, runtime pending |
| 2026-11-07 | Route Accounts section-row links through the existing page's canActivateRow for exact current object membership, transformed rows, details view and current nonbusy output; retain feature source/destination/route rules | UI20 with UI26/28; twelve-statement access contract and source specs, not executed under the source-only boundary |
| 2026-11-07 | Keep hidden/inert protected mounted list/table/editor/form/report hosts visually hidden through their shared style owners despite flex/block declarations | UI26 and UI20; source specificity trace and computed-style specifications including the nested month table, not executed in this source-only slice |
| 2026-11-07 | Route explicit Accounts report/filter access through its existing page owner, sanitize denied sources and fence queued actions and immediate events against access/context expiry | UI20 with UI26/28; Ledger/TrialBalance contract and source reconciliation; specifications written but not executed under the current source-only boundary |
| 2026-11-07 | Route mounted approval access through the shared panel with separate read/decision grants, revision recovery, retained reason portals and independent sent outcomes | UI7 with UI13/26/28; Payment source reconciliation and shared behavioral specs; tests/build/runtime not executed in this source-only slice |
| 2026-11-07 | Keep local dirty exit available after denial while cancelling an expired open decision; use lazy confirmation and preserve independent sent cleanup | UI28; Fleet decision/cleanup RED then151/151GREEN; application visual acceptance pending |
| 2026-11-07 | Adopt optional attachment upload/cleanup requirements in existing tracker/FileField and row-specific guarded removal/visibility; retain sent uploads in the editor owner across field teardown | UI14/18; Media/FileField/EditableRows RED then shared route/layout suite 29/29 GREEN; row visibility RED then Fleet62 GREEN; upload-owner RED then 7/7 GREEN; full adoption has separate acceptance |
| 2026-11-07 | Keep access/context output invalidation independent of busy/form effects; verify response retention after finalize and lookup recovery on mounted revoke/regrant | UI26; Assets four-screen RED/GREEN and Asset list regrant RED/GREEN within 76-test UI suite; application visual acceptance pending |
| 2026-11-06 | Fence each adopted read with the shared denied notifier and dataContext; retain stateful CSV drafts/sent outcomes through permission input rather than structural destruction; recheck after confirmation | UI26/28; read-owner and CSV RED/GREEN cases, including actor/branch context expiry; mounted application acceptance pending |
| 2026-11-06 | Revalidate opted-in lookups after the shared permission/branch revision changes within the same actor/working-branch context; preserve refresh, draft and sent-write ownership | UI2; branch cache regression RED/GREEN and focused 18-test suite |
| 2026-11-06 | Preserve editor drafts and independent writes while hiding access-revoked body portals, including nested MockData previews and publisher select cleanup | UI13/26/28; EditorDialog/Branch/Role/Users source review, portal RED/GREEN browser case and focused tests |
| 2026-11-06 | Route the owner-authorized self-access API, fail-closed session views and explicit route/action adoption through shared owners; retain bootstrap/write/session lifetimes and separate field/data-scope contracts | UI26/7/30; CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE and current source/targeted acceptance; broad screen adoption remains tracked |
| 2026-11-06 | Distinguish source-implemented ERP permission enforcement from frontend authentication-only routes; administrative role snapshots are not a current-session permission evaluator | UI26; frozen endpoint-enforcement contract and resolver/filter source reconciliation; runtime acceptance pending |
| 2026-11-05 | Route exact ledger currency sections/read aggregates, opening-only report output, mounted context cleanup and settlement arithmetic through their current shared owners; retain foreign writer adoption gates | UI2/19/20/22; BE15; CURRENCY_LEDGER_SETTLEMENT_CONTRACT_FREEZE and source reconciliation; runtime acceptance pending |
| 2026-11-05 | Route source-base deposit readiness and context-cancelled row decisions through existing DocumentCurrency/EditableRows owners; preserve temporary-tab readiness, invalidate old sessions and keep sent writes independent | UI19/14/28; currency cycle completion contract and source audit; runtime acceptance pending |
| 2026-11-05 | Route snapshot-owned money precision through shared DataTable and SummaryCards owners; default legacy callers to two decimals and preserve the producer's DecimalPlaces in HRM lists, reports, detail and export | UI5/6/24; HRM implementation source audit; source-only acceptance pending |
| 2026-11-05 | Reconcile currency backlog routing with implemented dated-rate/snapshot/draft owners and the approved foreign-accounting plan; preserve pending posting, settlement, revaluation, bank and reader adoption | BE19; CURRENCY_FULL_STACK_REVIEW and CURRENCY_REVIEW_FIXES_CONTRACT_FREEZE; factual status correction, no new financial policy; source-only acceptance pending |
| 2026-11-05 | Route safe stored-user recovery and internal login return URLs; retain unavailable account actions as explicit states; release loading per request and discard failed/cancelled policy memo | UI2/22/26/28; ANGULAR_REVIEW_FIXES_FEATURE_REVIEW; source-only, regression execution and runtime pending |
| 2026-11-05 | Make the opening name Speed guide/explanations, Speed code, available relevant Odoo documents and verified Superpowers availability; distinguish planned from completed reading | Master1/2/7; explicit owner clarification during the HRM review; live workflow opening gate |
| 2026-11-04 | Route eligible source/generated-journal currency changes through shared preflight and atomic source-snapshot rebuild | BE15; generated draft contract, resolver and document writers; foreign posting remains gated, runtime pending |
| 2026-11-04 | Route exact amount wording and approval precision through shared presentation owners; separate document-currency read progress from confirmation lifetime in page/dialog scope | UI19/22; Receipt and purchasing adoption plus shared source review; runtime pending |
| 2026-11-04 | Route exact ratio and once-per-rate VAT previews through existing financial owners with unbounded intermediates and the established positive remainder policy | UI19; BE15; purchasing currency contract and shared source arithmetic review, runtime pending |
| 2026-11-04 | Route connected document selection through DocumentCurrencyComponent, exact current amounts and owning snapshot persistence; retain source/date locks and initial-failure correction | UI19; document-selection contract and Bill integration source audit; runtime pending |
| 2026-11-04 | Route exact money columns, raw filter serialization, decimal SQL opt-in and unbounded read totals through existing DataTable/GridFilter/financial owners | UI5/6/19; BE9; journal-read contract and scoped source audit, runtime pending |
| 2026-11-04 | Route exact financial lexemes through BE3's narrow TrimIncomingStrings exceptions and raw-token money converters | BE3; dated-rate/JV preview HTTP source trace; runtime acceptance pending |
| 2026-11-04 | Route exact monetary text, BigInteger/BigInt intermediates, positive allocation remainder and precision-aware display/export through existing financial owners; retain legacy adoption boundaries | UI19; BE15; currency exact-money contract and source review, runtime acceptance pending |
| 2026-11-04 | Route participating service/persistence locks through TransactionWriteLock; retain resource identity and outer transaction ownership | BE8; dated currency implementation, source-only; runtime races pending |
| 2026-11-03 | Route Settings tab-name search through TabSearch and EditorTabs searchLabel; preserve panel selection while filtering and reveal excluded programmatic selections | UI13 with UI1/4/27; Settings tab search follow-up; source-only, runtime pending |
| 2026-11-02 | Route repeated settings groups through the EditorTabs companion and projected persistent templates; activate both section/group before shared invalid-field focus | UI13 with UI1/27/29; owner internal-tab request and Settings review; source-only acceptance pending |
| 2026-11-02 | Route settings inner groups through compact FormSection, content-width field/choice grids and vertically centered wrapping checkbox labels; preserve mounted forms and owning Save | UI1/13/24/25/29; Settings layout follow-up and current shared style/section sources; visual/runtime pending |
| 2026-11-02 | Route full-year local-calendar day differences to shared date-utils owner, retaining feature billing policy | UI17; Rental editable-day review and .NET date bound; source-only acceptance pending |
| 2026-11-02 | Route Speed guide/code as primary functional evidence and pinned Odoo docs only for missing or unclear scoped concepts; retain Sigma contracts and source-only boundaries | Master2/4/7; owner's final priority instruction, Odoo collection and comparison matrix |
| 2026-11-02 | Route explicit opt-out of dependent editable fields from mock generation, preserving their manual owner and source-date limits | UI13; Rental day-count/date synchronization and MockDataFieldDirective; runtime pending |
| 2026-11-02 | Route shared current-year mock date/date-time/month bounds, intersection with existing eligibility and unchanged time-only/manual-entry behavior | UI13; owner request, MockDataFieldDirective and strict server metadata-bound validation; runtime pending |
| 2026-11-01 | Route settings usage evidence and shared24-page parent/child composition; internal vertical groups preserve one owning Save and activate invalid fields through shared focus | BE16; UI1/13; Settings layout plan/contract/review and dated settings reference; source-only, runtime pending |
| 2026-11-01 | Restore compact routing; mandatory live workflow companion, full evidence gates and conditional block map; historical detail retained outside skill discovery | Master8; owner-authorized documentation Audit8 remediation; pre-router snapshot and reconciliation in documentation archive |
