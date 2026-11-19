# Data Entry Corrections — review and implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Root ownership | Angular, contract decisions, integration, .NET completion and reconciliation |

## Outcome and purpose

The screen registers and tracks a **request** to correct entered data. It holds a description, service agreement, evidence files, server-owned number/date/actor and Open/Closed status. Save does not alter another business document, run SQL corrections or post accounting entries. SLA means Service Level Agreement; this feature selects service coverage and expiry, without a response-time/overdue calculation. The existing `DataEntryCorrectionModel` remains a separate description/SLA/attachment record, without automatic request conversion or request lifecycle.

Authorization: the owner requested «راجع … وطبق التعديلات وفقا للوثائق» and later «كمل». Plan and API handoff are frozen in `DATA_ENTRY_CORRECTIONS_MAINTENANCE_EVOLUTION_PLAN.md` and `DATA_ENTRY_CORRECTIONS_FULL_STACK_CONTRACT_FREEZE.md`, including subsequent explicit clarifications. No runtime acceptance is claimed.

## Manifest and scope

| Concern | Evidence / decision |
|---|---|
| Application repositories | `F:/My Work/Sigma/SiGmaAngularFrontEnd`; `F:/My Work/Sigma/SigmaBackend` |
| Frontend scope | Both existing features under `src/app/modules/Data Entry Corrections`, their new family `shared/` composition, directly related module menu/title suppression/translations/guide registration |
| Backend scope | Correction entity/config, both correction services/interfaces/controllers/VMs/profiles; new static CorrectionInputPolicy; seven matching EN/AR GeneralMessage entries |
| Existing changes | Extensive unrelated changes already existed in Administration, Support, shared controls, translations and menu. They are preserved. Support catalogue and its guide were present/updated in the workspace; this task reuses its public read service and preserves its reader registration |
| UI/backend shapes | Type01 list with controlled modal; pattern1 generic service/controller, domain-specific overrides only |
| Canonical references | Workshop Job list shell/filter/fill table; actual EditorDialog declarations and UI13 composition; BranchService/current generic Service/Repository for .NET shape |
| Operational routes | `/DataEntryCorrection`, `/DataEntryCorrectionModel`; legacy create/details URLs redirect to list rather than mounting a second editor |
| Authentication | Existing AuthGuard/root HttpClient and authenticated generic controllers; no permission mechanism invented |
| Applied phases | PLAN-00, phases0–6; phase4 Close/Delete/attachment removal is applicable |
| Not applicable | Posting, approvals, totals, journal effects, stepper, peer-section tabs, nested upload dialog, report print, automatic correction executor |
| Verification boundary | Source only; no build/test/lint/migration/DB/browser/runtime/commit/push/deploy |

## Screenshot evidence

All three files are from `C:/Users/user/Desktop`. English/LTR; approximate image dimensions are visible. User role, capture date, product version and current-versus-historical acceptance status are Unknown. Screenshot styling is not implementation authority.

| E1 — DataCorrection.PNG (list, 1725×317) | Classification | Phase | Implementation |
|---|---|---|---|
| Create correction | Explicit | 3 | Shared controlled Create dialog |
| Open and recent closed groups | Explicit | 2 | One server-paged grid with status selector: starts Open, supports closed and All. No invented closure timestamp or cutoff |
| Entry No, Date & Time, By, Detail, Status | Explicit / source-confirmed | 1/2 | Exact scalar row fields, typed columns and translated status |
| Refresh and Export to Excel | Explicit | 2 | Applied snapshot refresh; all-page export with translated grid formatting |
| Gear action | Explicit icon; menu contents Uncertain | 4 | Actual View/Edit/Delete contracts plus source-supported confirmed Close; copied loyalty/product actions removed |
| Last Update creation text | Explicit display; update timeline Missing | 1/2 | Real creation date/actor are shown. No fabricated event feed or last-update timestamp |

| E2 — DataCorrection2.PNG (Create, 397×323) | Classification | Phase | Implementation |
|---|---|---|---|
| Detail textarea | Explicit | 3 | Typed required nonblank description; incoming limit10,000 characters |
| SLA checked agreement with date | Explicit | 1/3 | Existing SupportSlaAgreement/Available, current eligible choices; historical text retained |
| Attachments Add | Explicit | 3 | Shared editable scalar-path collection and FileField |
| Save / Cancel | Explicit | 3 | Shared footer, deferred dirty discard; Save sends editable fields only |

| E3 — DataCorrection3.PNG (file picker, 402×319) | Classification | Phase | Implementation |
|---|---|---|---|
| Choose file | Explicit | 3 | Shared FileField directly in the attachment row; same upload functionality without duplicating a nested shell |
| Cancel upload surface | Explicit | 3 | Native file-picker cancel leaves the draft; editor cancel discards unsaved uploads after dirty confirmation |

## Decisions and final contract comparisons

| Concern | Final source comparison |
|---|---|
| Grid/ListVM main | Actions first; grid `entryNo(text/link),dateTime(dateTime),by(text),detail(text),status(status)`. Backend ListVM exactly `Id,EntryNo,DateTime,By,Detail,Status`; identity supports actions |
| Grid/ListVM model | Actions first; `detail(text/link)`. Backend exactly `Id,Detail` |
| Removed list properties | Inherited SubscriptionId/IsActive/IsValid/IsChanged/No/GUID/CreatedAt/CreatedBy, editor-only SLA/attachments; model selected IDs removed from list. Unused FullList types remain untouched |
| Detail | Main `id,entryNo,dateTime,by,detail,status,serviceLevelAgreement,selectedSlaAgreementIds,attachments`; model `id,detail,selectedSlaAgreementIds,attachments`. LeanDetailBaseVm identity, no unused audit/tenant controls |
| Writes | Both Add: `detail,selectedSlaAgreementIds,attachments`; Update additionally `id`. No number/date/actor/status/audit/tenant/delete/active flags |
| Filters | `search`→Filters[search]→SearchColumns. `status`→Filters[status]→generic enum equality. Zero is preserved; null omitted; URL `all` is presentation state, never sent as enum. Applied snapshot governs paging/refresh/actions/export |
| Paging | DEFAULT_PAGE_SIZE15; options10/15/20/50/100; resolveListPaging before writes; generic NormalizePaging1–100, CountAsync and TotalPages; stable Id tie-breaker |
| Sort | UI allowlist derives from sortable columns; backend uses stored fields, with EntryNo/By fallback expressions matching display. Initial sort is newest Id |
| Numbering | Existing generic No producer; EntryNo assigned after Repository.AddAsync numbers the root. Existing blank EntryNo falls back to No in read mapping. No DEC prefix invented; current generic fallback uses type name/ticks |
| SLA | New Create requires eligible selection. Whole-set unchanged historical IDs, including legacy empty, are retained. Changed sets must be distinct positive currently eligible IDs. Main snapshot is server-built; unchanged legacy text is retained. Missing historical names remain IDs/text rather than fabricated labels |
| Description | API and service/internal-batch boundary reuse Required/MaxLength10,000 attributes; frontend mirrors them. Storage remains historically unconstrained, avoiding a column shrink; older longer text can be viewed but must be shortened to save an edit |
| Attachments | Full snapshot of string paths. New paths match current tenant/DataEntryCorrections/GUID/allowed extension; unchanged historical paths retained. Media validates MIME/signature/type/5MB. No new access/permission policy |
| Mapping | Four one-way maps per feature; no ReverseMap or defensive Ignore. Only EntryNo/By read fallbacks require ForMember; lists/arrays map by convention |
| Calculation | No monetary/domain calculation introduced; no client-derived metadata sent |
| Delete | Existing soft delete, now canonical usage-aware RemoveWithChildrenAsync. No new closed-state edit/delete restriction |
| Dirty/cleanup | Explicit editor modes; View skips edit-only lookup; deferred form-freezing discard guards Cancel/X/Escape/navigation. Saved removal happens after Save; discard deletes unsaved uploads. Failed cleanup stays for cleanup-only Retry. Accepted cleanup callback accounts for finalize ordering |

## Action-state and override inventory

| Action | Source→target / API | Interaction and recovery |
|---|---|---|
| Create/Edit/View | Existing list-owned modal; POST/PUT controller, GET GetByWithNavigationsId | One editor/mode, read retry, retained failed draft, successful Save closes/refreshes once |
| Close request | Open0→Closed1; POST DataEntryCorrection/{id}/Close; already Closed returns success | Confirm, guarded request; tracked Status-only write and Status concurrency token. Concurrent conflicting write uses existing concurrency handling; refresh/retry is required |
| Delete | Existing live row→soft-deleted; DELETE controller?id | Shared record confirmation, usage validation, page fallback after final-row delete |
| Attachment Add/Remove | Draft full snapshot | EditableRows confirms saved/dirty row removal; FileField/tracker owns upload/replacement; stable control identities |
| Search/Reset/Refresh/Export | Read only | Shared filter toolbar, cancellable list stream, full export or explicit error; no partial file |

Approved Job reference actions: View/Create/Edit/Delete supported with correction domain contracts. Close is correction-specific under the owner standing rule. Job delivery, internal/customer approvals/rejection, invoices/payments/gate pass/lubrication/quality/time activities/logging are Not Applicable because correction has no workshop or financial aggregate. No no-op menus remain. Model has no Close.

| Override / owner | Reason |
|---|---|
| SearchColumns (both) | Real description/identity searchable fields |
| ApplyListOrder (request) | Computed historical EntryNo/By fallbacks; stored fields delegate to base |
| AddAsync (both) | SLA/path validation; main additionally stamps metadata/snapshot |
| AddListAsync / UpdateListAsync (both) | Prevent inherited batch validation bypass; validate every item before tracking/mutation and save once |
| UpdateCoreAsync (both) | Validate current tenant-owned references/paths and map onto tracked record, retaining metadata/historical snapshot |
| RemoveAsync (both) | Canonical usage-aware deletion |
| GetMany/detail/controller overrides | None; inherited methods retain envelopes/counts/tenancy |

Each Add, Update, Close or batch execution path reaches one scoped SaveChangesAsync (Repository numbering does not save separately). EF implicit transaction is sufficient. Scalar collections are replaced by the submitted snapshot before the save; no detached full-row Update rewrites server metadata. No schema/data operation has been run.

Authorization candidates: POST/PUT/DELETE both correction controllers and POST DataEntryCorrection/{id}/Close. Current controller authentication and tenant checks are retained; visible actions are not a permission claim.

## Source conformance and responsive handoff

| Book / reference | Actual consumers and compared contract | Result |
|---|---|---|
| UI1/3; Job list / FeatureTitle | Both existing list routes delegate to CorrectionWorkspace; sigma-route-host/page/panel/header/table and in-card title; toolbar hides duplicate title for both routes | Matched in source |
| UI4/5/6; Job / FilterPanel / DataTable | Workspace projects labelled search/status and actions; mandatory shared Reset, one fill grid, typed columns/counts/lazy event | Matched in source |
| UI8; dataTableExportRows/fetchAllPages | CorrectionApiService pages with size100; Workspace exports current columns/applied query with click-time translation | Matched in source |
| UI13/15; EditorDialog public declarations | CorrectionEditor mode/title/subtitle/contentPadded/width840, standard outputs/footer, disabled View controls | Matched in source |
| UI14/18; EditableRows/FileField/tracker | Typed FormArray<path>, saved WeakSet identities, canonical child confirmation, same accepted types and folder, finishSave/discard/retry | Matched in source; server orphan expiry not established |
| UI19/22/28; FieldError/StateMessage/freezeFormState | Required feedback, first-invalid focus, single error owner for reads vs mutations, finalize and takeUntilDestroyed, switchMap list cancellation | Matched in source |
| BE3–9/13; Branch/current bases | Lean DTOs, one-way mapping, inherited tenant query/count/sort; feature-only justified overrides | Matched with recorded storage compatibility choice |

Responsive acceptance is pending at every interval: >1200 normal filter strip; below1200 shared filter disclosure; both sides1099 dialog94vw; below767 dialog viewport margin; editor grids2 columns below1024 and1 below700; FeatureTitle actions wrap/small primary below650; shared header/footer rules below620; intermediate and narrow/short-height sizes. Source inspected shared CSS cascade; no feature palette/filter/table/viewport CSS introduced. Dialog `sigma-editor-scroll` is its vertical owner, title/footer fixed; uncapped small attachment table adds no competing vertical height cap. File/grid horizontal overflow remains internal. Verify long Arabic labels/filenames, keyboard/focus, RTL and light/dark themes in the application.

## Files and guide delivery

- Both frontend correction feature folders: list/details compatibility exports/templates, routes, create/list/detail models and services.
- New family files: `shared/correction-api.service.ts`, `correction-workspace.component.{ts,html}`, `correction-editor.component.{ts,html}`.
- Direct wiring: `sidebar-menu-data.ts` correction submenu only; `toolbar.component.ts` correction title suppression only; `en.ts`/`ar.ts` dataCorrections block only; guide reader correction registration only.
- New user guide: `src/app/modules/UserGuide/content/data-entry-corrections-guide.ts`, registered at `/UserGuide/data-entry-corrections` and linked once under the correction module menu. Topics: requests/models, purpose, prerequisites, Create/View/Edit/Delete/Close, paging/search/export, SLA history, upload/discard/cleanup, manual correction distinction and useful questions. EN/AR content matches final routes/actions; reading/navigation/print/theme checks are owner-pending.
- Backend changed: correction entity/config, both service/profile/Add/Update/Detail/ListVM sets, request interface/controller, seven Correction* keys in both GeneralMessage resources; new `Services/HelperServices/CorrectionInputPolicy.cs`.
- Documentation: plan/freeze/this report; UI13, BE18, skill/revision history/changelog; generator refreshed all eight packets. Existing unrelated edits in shared files were preserved and are excluded from suggested staging scope.

Shared-extraction gate: one family workspace/editor/transport replaces duplicate screen flows; existing visual controls are reused unchanged. Static CorrectionInputPolicy centralizes repeated correction business validation. UI13/BE18 and the skill record the verified owners and cleanup accepted-value timing; no app-wide CRUD framework introduced. Packet fingerprints and canonical reference roles were reconciled after generator-only refresh.

## Verification and remaining risks

Source verification: inspected the complete scoped tracked diffs separately in both actual Git repositories and all new family/helper/guide source. TypeScript/template parse: 28 source files, zero syntax errors; import-path/named-export scan:17 TS files, zero issues. These checks do **not** certify type checking or Angular/.NET compilation. Translation parity:55 keys per language, zero missing/case differences. Scoped whitespace/merge/legacy/server-owned payload checks are clear. GeneralMessage XML and new resource keys are checked separately. Recipe -Check passed before work and after refresh.

Owner must run **Add-Migration AddDataEntryCorrectionSlaSelection** (name not found in existing migration filenames). Schema: new primitive JSON SelectedSlaAgreementIds column on DataEntryCorrection, empty-array default for existing records. Status private setter/concurrency metadata changes no stored enum values. No other property/nullability/length/index/column deletion is introduced. Inspect generated migration against current pending Support SLA migrations; preserve old SLA strings/attachments and verify old rows receive empty IDs. Do not auto-parse or overwrite historical strings.

Owner verification:

1. Apply reviewed migration, build frontend/backend, then verify authenticated GET and mutation routes with the same tenant; do not record token values.
2. Create with description/current SLA; validate blank/10,001 characters/duplicate/foreign/inactive/expired IDs. Confirm server number/date/actor/Open and unchanged historical selections on Edit.
3. Exercise Create/View/Edit/dirty Cancel/X/Escape/navigation, failed reads/Retry, failed Save retained draft, rapid paging and page-size-only changes, last-row delete and closed/all filters.
4. Check Close/repeated Close/concurrent Close and a stale editor; failed actions retain the row and permit refresh. Ensure exactly one mutation success notification.
5. Upload valid files and reject wrong type/signature/size/foreign path. Check replacement/removal followed by failed Save or Cancel; cleanup failure must Retry only cleanup. Browser crashes can leave abandoned uploads: the reused shared Media subsystem's expiry/sweeper is not established by this task and remains an operational owner follow-up. Static-file access is the existing FileStore policy, not a new security guarantee.
6. Compare filtered all-page export count/column order with server totals; verify bilingual guide/menu, keyboard, directions/themes and responsive intervals above.

Non-blocking unsupported scope: automatic data correction, SLA timers/escalation, last-update audit timeline, closure timestamps/cutoff and screenshot DEC formatting have no confirmed source workflow here and were not fabricated.

Agent utilization: one bounded `sol_backend` agent (gpt-5.6-sol, high) was dispatched after freeze to reduce frontend/backend wall time with exclusive file ownership. It stopped at the account usage limit before source changes. Root completed backend and integration; no delegated implementation was merged. No uncontrolled/overlapping agents were used.

Suggested commits, only this task's files/hunks:

- Frontend: `refactor(data-corrections): adopt shared lists and correction editor`
- Backend: `fix(data-corrections): validate requests and own lifecycle metadata`
- Documentation: `docs(data-corrections): record contracts and shared composition`

Prohibited commands were not run. Status remains **Implemented — source-only**, with migration/build/runtime/visual acceptance pending for the owner.

## 2026-10-14 follow-up: blank Add editor — frozen repair scope

Owner reports that DataEntryCorrection is blank on Add. This authorizes a bounded frontend repair. The existing API/UI handoff remains Frozen; no field, persistence, action or migration decision changes. UI shape remains type01, list with controlled modal; backend pattern1 remains unchanged and is outside this repair.

Source evidence: `CorrectionWorkspaceComponent.openEditor('create')` mounts `CorrectionEditorComponent`; its `ngOnInit` sets `ready=true` before loading the SLA catalogue, so description/attachments do not depend on that request. The projected `sigma-editor-form` and `sigma-editor-scroll` both use `flex:1 1 0`, `min-height:0`, and bounded overflow in `src/styles.scss`. The editor supplies width840 and padding but omits the shell's definite height. UI13 already documents this exact collapse under an auto-height dialog. The reported symptom is explicit written evidence; the runtime cause remains a source-supported diagnosis, with owner reproduction pending. No screenshot was supplied in this follow-up.

Pre-edit conformance and frozen decision:

| Concern | Book | Actual reference / producer | Shared owner | Target decision |
|---|---|---|---|---|
| Available height for zero-basis form | UI13, Definite height for flex editors | `EditorDialogComponent.height` and `dialogStyle` forward height to the internal `p-dialog`; `contentStyle` and `.app-editor-dialog-content` bound the flex chain | Existing EditorDialog; inner layout in `src/styles.scss` | `CorrectionEditorComponent` will set `height="min(720px, calc(100dvh - 24px))"`, the documented bounded workspace value |
| Internal scroll / fixed actions | UI1/13 | `.sigma-editor-form`, `.sigma-editor-scroll`, EditorDialog header/footer templates | Shared styles / EditorDialog | Retain one inner scroll owner, width840, contentPadded and existing footer; no new CSS or shell default |
| Both correction consumers / modes | UI13, existing frozen handoff | `CorrectionWorkspaceComponent` mounts the one editor with isModel/mode/recordId | CorrectionEditor feature-family owner | Repair both request/model Create/Edit/View through the existing template |
| User-facing instructions | Master7 | `DATA_ENTRY_CORRECTIONS_GUIDE` request/model topics | Existing UserGuide reader | Add EN/AR instruction to scroll inside the editor to reach all sections, with fixed footer actions |

Applicable phases: discovery0 and contract1 reuse the existing frozen handoff; detail3 fixes sizing; integration5 checks both consumers and modes; reconciliation6 reviews the bounded diff. Grid2, domain actions4, backend work and PLAN-00 are not needed for this existing, source-supported presentation repair. Initial recipe `-Check` passed all eight packets; phase03/05 claims were compared with owning UI1/13 and public source. No canonical change or packet refresh is needed. No subagents: one small, sequential template repair does not meet the delegation gate.

### Follow-up final reconciliation — Implemented, source-only

| Concern | Final comparison / result |
|---|---|
| Definite height | `correction-editor.component.html` now supplies `min(720px, calc(100dvh - 24px))` through the existing string `EditorDialogComponent.height` input. `dialogStyle` emits the height on the shell; the existing maxHeight retains viewport bounds. The known UI13 sizing mismatch is repaired in source |
| Shared layout | Form/scroll retain `flex:1 1 0`, min-height0 and shared overflow; shell content uses inline overflow:hidden, taking precedence over global .p-dialog-content overflow:auto. Header/footer remain flex:0 0 auto. No feature styles, private shell or shared default change |
| Direct consumers / modes | Request list projects `<app-correction-workspace />`; model list sets isModel=true. Workspace passes create/view/edit and recordId to the same editor. Both existing lazy route files still point to their list and guard unsaved exits; no routing/provider change |
| Contracts | Description/SLA/attachments, validation, reads/writes, cleanup/dirty exits and mutation feedback are unchanged. Grid/ListVM, backend, AutoMapper and domain calculations are untouched; no schema change and no additional Add-Migration for this repair. The earlier feature migration requirement above remains pending independently |
| Guide | `src/app/modules/UserGuide/content/data-entry-corrections-guide.ts` adds one EN/AR internal-scroll step in each request/model topic. Existing reader registration, `/UserGuide/data-entry-corrections` and the module sidebar entry are retained; no new translation keys |
| Scoped diff | Actual repository root confirmed as `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Both changed application files were already untracked before this task, so complete before/after Git no-index diffs against pre-edit snapshots were reviewed. Only one shell input and the two bilingual guide steps changed; previous user changes were preserved |
| Shared-extraction gate | Existing family editor and public shell height already own the repeated behavior; both consumers inherit this repair. Nothing new qualifies for extraction or a reusable rule; UI13 and the skill already state the required height rule |

Responsive source matrix (visual acceptance pending throughout):

| Size / interval | Expected arrangement and inspected source |
|---|---|
| Viewport height >=744px / <744px, including short windows | Shell height is 720px / viewport minus24px; existing12px top inset and shell maxHeight bound the workspace. Form content shrinks and scrolls internally; fixed footer stays outside it |
| Width >1099px / <=1099px / <=767px | Existing840px width, then94vw, then viewport minus16px, all subject to shared maxWidth; inspected shell public breakpoints and template |
| Editor width >1024px / <=1024px / <=700px | Existing shared grid reduces columns without changing the description's full-width span or checkbox semantics; no new field-width rule |
| Width >620px / <=620px, intermediate widths and long Arabic labels | Existing shell footer/action arrangement and narrow hint rule retained; logical/theme rules unchanged. Owner checks keyboard focus, LTR/RTL, light/dark and long translated labels/filenames |

Verification: complete bounded before/after diff review, public input-to-style trace, both list/route consumer paths, guide reader/menu registration, merge-marker and whitespace inspection. Build, tests, lint, runtime/browser/database verification, migration, commits/pushes and deployment were not run. Source review does not certify Angular compilation or actual visual reproduction. No unresolved field/API/business decision blocks this repair; owner acceptance is still pending.

Owner verification for this follow-up: reopen Add in `/DataEntryCorrection` and `/DataEntryCorrectionModel`; confirm description, SLA loading/choices or explicit empty/error state, and attachments are visible. Check View/Edit as well; resize to a short/narrow window and scroll the body with footer actions visible. Confirm Cancel/X/Escape preserve the existing dirty-discard behavior and the guide steps appear in both languages. No Save or database mutation is needed to verify the reported blank Add symptom.

Files changed in this follow-up: `shared/correction-editor.component.html`, `UserGuide/content/data-entry-corrections-guide.ts`, and this review append. Suggested frontend commit, covering only these new application hunks: `fix(data-corrections): prevent blank correction editor`. No subagents were used because this was a small sequential repair. Prohibited commands were not run.
