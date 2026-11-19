# Checklist Item — feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Manifest and findings

Frontend review and confirmed implementation authorized by user. Frozen handoff: CHECKLIST_ITEM_FRONTEND_CONTRACT_FREEZE.md. Source scope: SiGmaAngularFrontEnd/src/app/modules/Administration/ChecklistItem, feature vocabulary blocks, administration guide topic. API evidence inspected only in SigmaBackend; no backend edits. UI type01/BE pattern1. Existing changes preserved. No supplied screenshot/video; all decisions from canonical/source evidence. Phases00–06 apply, only frontend implementation; no PLAN-00/new workflow/schema.

Confirmed findings: legacy ms-lib table; nonexistent No column; stale string identity/nonnullable order types; oversized write model and tenant payload; untyped form; separate routed editor contrary to UI13; no field validation or dirty/delete confirmation; incomplete failure/finalize handling; no cancellation of overlapping list queries; absent screen guide/translations; scaffold styles empty.

## Pre-edit reference conformance

| Concern | Book | Reference symbol/file | Shared owner | Target decision |
|---|---|---|---|---|
| Container/layout | UI1/3 | Job list metadata/template | styles.scss sigma-route-host/list-*; FeatureTitle | Replace card with same fill chain/title in primary panel; no feature CSS |
| Filters | UI4 | Job list filter form | FilterPanelComponent/directives | One Name field, stableLayout=true, mandatory Reset, Search/Export; no advanced filters needed |
| Grid/paging | UI5/6 | Job list onLazyLoad/bindListQueries | DataTable/resolveListPaging | Actions then Name/Order; lazy/fill, API total,15 rows; switchMap/defer |
| Export | UI8 | Job exportExcel | fetchAllPages/dataTableExportRows | All applied pages/current headers; no manual mapper |
| Dialog | UI13/15 | EditorDialog TS/HTML/SCSS | EditorDialog/FormSection/styles.scss | Controlled, padded, content-sized flex-fill form/body/scroll; View no primary action |
| Validation | UI19/27 | shared FieldError/scalar-validators/focusField | Same owners | Name required/mode max; optional signed Int32 order; focus invalid field |
| States/close | UI10/22/28 | EditorDialog outputs, ConfirmationDialogService | StateMessage/freezeFormState/confirmation | Inline read Retry, global mutation feedback; deferred guarded dirty exits |
| Responsive/theme | UI1/4/13/24/25/29 | shared layout/filter/dialog styles | Existing shared owners | No local breakpoint/palette/viewport calculations; visual acceptance pending |

## Final source reconciliation

| Path/decision | Final producer and consumer evidence | Result |
|---|---|---|
| Shape and routes | UI13 fields-only rule; ChecklistItem_Routes only list with canDeactivate; list.editorSession remounts details with mode/id | Source matched; old create/details URLs retired |
| Grid/DTO | Shared Actions then name/text link and order/number; client DTO id:number/name:string/order:number|null; backend Id/Name/Order | Required fields matched; inherited backend extra fields explicitly deferred |
| Filter | filterForm.name → activeFilters snapshot → toListParams Filters[name] → Service.BuildFilterPredicate string Contains | Confirmed; empty trimmed Name omitted |
| Paging |15 default,10/15/20/50/100 options, resolveListPaging before writes, cap100; inherited NormalizePaging/CountAsync/Skip/Take/ListResult | Source matched; no local paging of a partial result; out-of-range page recovers from totalCount |
| Sorting | sortableFields derives from name/order columns; inherited SortKey/SortBy then Id descending tie-breaker | Source matched; initial no sortField preserves newest-first |
| Reads | bindListQueries switchMap/defer/catchError/finalize; getList skip header; detail id/session guards and teardown | Both failure channels/retry/cancellation source matched |
| Export | getAllList uses fetchAllPages, query captures applied filters/sort; exportExcel uses dataTableExportRows | Complete-page collection/translated columns/no partial export; independent export error/retry |
| Detail and writes | details form has Name and optional nullable Int32 Order; service.getDetails/createItem/updateItem | Add name/order, Update id/name/order; no tenant/audit/GUID/flags; detail client only id/name/order |
| Validation | Required trimmed Name, current Add250/Update50 limits; shared int32ValueValidator; FieldError under both controls; focusField on invalid Save | API-compatible; no invented nonnegative/unique order or name duplicate guarantee |
| View | entire loaded form remains disabled, shell primaryActionVisible false in View | Read-only/Close only; Edit provided in row actions |
| Save/feedback | form frozen before write; Result checked; restoreDraft on declared and HTTP failures; true closed event on success | One global mutation feedback owner; failures retain draft; finalizers balance loader |
| Delete | confirmation record includes name and translated numeric identifier; guarded deleteItem → inherited RemoveAsync/DELETE | One confirmed mutation; failures retain row; last-row page fallback and applied refresh |
| Dirty exits | list deferred canDeactivate delegates to details; defer identity/busy check; freezeFormState; shared confirmDiscard; X/Cancel/Escape share requestClose | Source matched, accepted close ignores its own pending flag until finalize; mock generation blocks exits while form frozen |
| Root client | ChecklistItemService providedIn root; redundant LayoutModule registration removed; BaseService HttpClient → AppModule token/error interceptors | No feature client fork or manual header; URLs environment.baseUrl |
| Header | FeatureTitle in primary card; toolbar.showPageTitle excludes /ChecklistItem | No duplicate shared toolbar title; unrelated exclusions preserved |
| Controls/styles | exact EditorDialog/FieldError/FormSection/StateMessage/NumericFocus imports exported and registered; no feature stylesheet | Shared shell/controls own geometry/theme/RTL/focus; parsed templates alone do not prove compilation |
| Guide | CHECKLIST_ITEMS_TOPIC added to ADMINISTRATION_GUIDE, already in GuideReaderComponent.guides | Bilingual operational source-conformant explanation; no duplicate viewer/menu |

### Final conformance evidence

The pre-edit table is reconciled: list metadata uses sigma-route-host, template uses sigma-list-page/panel/header/table, and DataTable fill=true gives the row region the remaining height. FeatureTitle and FilterPanel retain shared insets; mainColumns1/full-span Name uses ordinary toolbar layout. The dialog uses contentPadded=true and the public default width/maxHeight, content-sized flex-fill on form/body/scroll, one sigma-editor-scroll owner, and two shared field tracks. No local palette, table/paginator/filter overrides or viewport subtraction. Shared Save/Cancel/Delete/Edit owners preserve the semantic icons already added in the user's detail file.

Root reviewed actual shared FilterPanel cascade after delegation and removed inlineActions for this screen: default inline CSS retains minmax(0,1fr)/auto outer columns below720px, contrary to the generic stacking description. Normal shared layout avoids squeezing Name beside three actions. This source/documentation discrepancy is recorded for follow-up; no shared stylesheet or canonical decision was changed.

### Responsive source matrix

| Interval/boundary | Expected arrangement and source owner | Finding / acceptance |
|---|---|---|
| >1250px / 1250±1 | Full-span Name across FilterPanel mainColumns1 or3 tracks; fixed title/filter/toolbar/pager, grid rows scroll | Shared full-span selector reconciled with breakpoint cascade; visual pending |
|1200 /1199px | Shared Filters disclosure appears below1200; collapsing retains mounted form/values/actions | Shared FilterPanel existing owner; visual/interaction pending |
|1024/1023,992/991px | Editor retains two field tracks; outer shell gap changes20→12px below992 | styles.scss inspected; visual pending |
|720/719px | Filter fields stack; toolbar/actions remain wrapping and reachable, full-span Name remains full width | Normal shared layout selected; visual pending |
|700/699px | Shared editor grid changes2→1 track; bounded dialog scroll/header/footer remain | styles.scss and EditorDialog inspected; visual pending |
|650/649,620/619px and narrow/short heights | Shared title actions wrap/smaller controls; editor footer/header wrapping; one internal form/grid row scroll | Shared component owners; Arabic/long names/theme/keyboard/print acceptance pending |

## Backend boundary and remaining risks

Backend was inspected read-only. No entity, EF, DTO, service, controller, AutoMapper, domain calculation or transaction change was made. Existing CRUD uses generic inherited methods; target overrides are none, so no redundant override introduced. Single entity persistence keeps the existing implicit EF transaction behavior. No child/upload/financial work applies.

Confirmed backend follow-ups outside the requested Angular source scope:

- ChecklistItemListVM and DetailVM inherit unused tenant/audit/status/GUID/No fields. Client interfaces now expose only consumed data; server response narrowing is deferred.
- AddBaseVmWithName permits250 characters while UpdateBaseVmWithName permits50. Frontend enforces these actual limits and guide explains editing longer names. A backend decision can harmonize limits later; no truncation was introduced.
- ChecklistItemService declares no UniqueColumns and ChecklistItemConfig declares no matching unique index. The frontend does not claim uniqueness or add an unsupported preflight rule.
- Generic RemoveAsync does not call InUseAsync/RemoveWithChildrenAsync for this target; no feature-specific inbound reference blockers are implemented. The guide describes removal from the current catalog, without promising dependency protection or rewriting historical checks.
- ChecklistItemProfiler read maps still use ReverseMap. This task does not modify backend mappings; unnecessary mapping directions remain backend cleanup debt.

No unresolved Missing/Conflicting/Uncertain requirement blocks the confirmed frontend contract. Runtime/compiler acceptance remains pending. Authentication is retained; no permission API exists. Authorization candidate: DELETE ChecklistItem?id={id}, for future permission inventory; hidden/busy controls are not security.

## Changes and phase ownership

Frontend changed: ChecklistItem route; list TS/HTML; details TS/HTML; create/details/list models; service. Deleted two empty stylesheets and two broken scaffold specs (one tested the unrelated widgets ListsComponent; the other imported nonexistent DetailsComponent). No meaningful feature test was removed or replacement mirror test added. Scoped shared edits: ChecklistItem provider cleanup in LayoutModule, ChecklistItem toolbar-title suppression,20 matching keys in each vocabulary, guide topic/import/registration/overview. No tsconfig roots were added preemptively.

Phases00 discovery and01 freeze completed;02 list/read/export,03 editor/write,04 frontend Delete,05 wiring and06 source reconciliation applied. Backend implementation, schema/migration, attachments, child rows, approval/posting/activation and report printing skipped: outside frontend scope or unsupported target workflow. Screenshots/video N/A; no evidence-derived business fields invented. PLAN-00 N/A for this bounded canonical screen adoption.

Shared extraction result: none warranted; all presentation, paging/export, validation, numeric focus, errors, confirmations and form freezing reuse existing owners. Learning protocol: no new reusable rule established, no skill-only amendment or pending promotion. Generated packets00–06 used after successful Check; final Check passed all8. No packet regeneration required because canonical/template/manifest sources unchanged.

## Verification and owner handoff

Repository root confirmed F:/My Work/Sigma/SiGmaAngularFrontEnd. Complete ChecklistItem diff reviewed in sections; relevant shared-file hunks and new topic reviewed separately from unrelated pending changes. Backend scoped diff unchanged. git diff --check passed scoped application/shared files. Source scan found no legacy table/ms-lib/any/tenant payload/stale style refs/merge markers/silent undefined handlers. Direct consumers searched: logsMovement check-card reader and LayoutModule; no source references to retired ChecklistItem/create or details URLs remain. Existing getChecklistItems reader preserves route/suppression and logsMovement handles numeric id with String(id), nullable Order with fallback; its source unchanged.

Final installed TypeScript/Angular parser inspection covered11 TS files (feature and touched guide/wiring) and2 feature templates with0 syntax findings;27 referenced feature/shared translation keys resolved in EN and AR (source inspection only; no compilation or tests). Check-Translations -Block checklistItem:20 EN/20 AR keys,0 missing/case-only differences. Standalone symbols/inputs verified against actual shared declarations; es2018 compatibility retained. Final vocabulary/guide/runtime wiring inspected. User's unrelated pending edits, including concurrent shared wiring changes, were preserved.

Owner checks: compile Angular; Create with required/blank/250-character Name, Edit with50-character limit/long saved name; optional Order/null/zero/negative/fraction/out-of-range; View read-only; Save business and HTTP failures retain values; cancel/confirm dirty exits via X/Cancel/Escape/navigation; cancel/save during mock-data generation; list retry and delayed paging/sorting; page-size-only change; full multi-page Excel and failed export page; delete confirmation identity/cancel/failed mutation/last-page fallback; exactly one mutation toast and authenticated GET/mutation without recording token; keyboard focus trap/return; matrix above in EN/AR/light/dark/short height. Existing external bookmarks to retired create/details URLs are compatibility risk: use /ChecklistItem and row actions.

User guide content: src/app/modules/UserGuide/content/checklist-items-topic.ts; owning reader route /UserGuide/administration, existing Administration sidebar userGuide.title entry. Covers purpose/prerequisite, Name search/reset, sort/paging/full export, Create/View/Edit/Delete, dirty exit/retry, actual Name/Order limits and manual mock Save. Source conformance checked; reading/navigation/RTL/theme/print acceptance pending for owner.

Migration: no Add-Migration required, no schema changes. Suggested frontend commit (scope only, excluding other pending shared hunks): `refactor(checklist-item): adopt shared list and modal editor`. No backend/documentation-repository commit required; review artifacts are local/unversioned under current instruction-layer ownership.

Agent utilization: one list_worker with inherited parent model (routine terra mapping unavailable), owned only list TS/HTML after root freeze. Root owned API evidence, contracts, models/service/editor/routes/translations/guide/shared wiring/integration/diff/report. Independent list/editor streams reduced elapsed implementation time without overlap; agent output integrated, root corrected final filter layout after source cascade review. No subagent declared overall completion.

Not run: builds, tests, lint, browser/application verification, database commands, migrations, Graphify, Sigma MCP, commits/pushes or deployment.

## Owner compiler-feedback follow-up — 2026-10-14

Owner supplied Pasted text.txt with NG8001/NG8002 and TS2339 cascades for the new details HTML, plus the old details payload `id: this.id(), subscriptionId: this.subscriptionId` and missing parent canDeactivate/event contracts. The diagnostics identify details templateUrl at TS line20; current source identifies it at25 and includes the complete new editor class. All16 reported editor members exist now, all5 shared exports are imported and registered, mode/id are Inputs, closed is EventEmitter<boolean>, and both parent/child canDeactivate return Observable<boolean>. Current Save sends Create name/order or Update id/name/order; the reported old payload is absent.

Source comparison therefore establishes the pasted diagnostics describe an older details TS paired with the newer templates/models; a retained development compiler/watch snapshot or different checkout is an inference, not a verified runtime cause. No schema/config/import workaround is justified, and no compiler roots/schemas were added. Re-saved the current details TS byte-for-byte to notify an active watcher, without changing behavior. Parsed7 feature TS files and2 templates:0 syntax findings; git diff --check passed. Owner should restart the current development compilation from F:/My Work/Sigma/SiGmaAngularFrontEnd if the same old-source diagnostics persist. Fresh compilation outcome is pending; agent did not run build/test/runtime commands. Existing guide/business contracts unchanged; no delegation needed for this small diagnostic follow-up.
