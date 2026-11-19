# Individual frontend review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |
| Contract | `INDIVIDUAL_FRONTEND_CONTRACT_FREEZE.md` (Frozen) |

Manifest, source boundaries, selected screen/backend patterns, field/filter/action/route contracts and pre-edit conformance evidence are recorded in the frozen handoff. The bounded shared corrections and dormant-root retirement were Frozen in `INDIVIDUAL_FRONTEND_MAINTENANCE_EVOLUTION_PLAN.md` before their implementation. Historical review artifacts remain unchanged.

## Result and confirmed findings

The requested Individual frontend review is implemented. Seven live/shared files were corrected; 39 unused scaffold files were retired. Runtime and visual acceptance remain pending. Existing unrelated working-tree changes were preserved, including the earlier list paging correction and ContactGroupService's optional skip-error argument.

| Finding | Before | Source correction / reason |
|---|---|---|
| Required customer text | Whitespace passed required validation, then payload trimming produced an API-invalid empty value | First/last name and mobile reject blank text through existing Angular validators, keeping current length limits |
| Required card text | Shared card factory accepted whitespace that cardPayload trims empty | Existing shared createCardRow validates number/CVV/holder/bank text before trim; Individual and Company consumers share the same rules |
| Numeric API types | Cleared number inputs could send null for nonnullable API values; CreditPeriod accepted fractional/out-of-int values | Required credit/discount/Darb inputs; CreditPeriod integer 0..2147483647; four already-nullable rental/lease Salik/Fine controls and payload types allow null |
| Save snapshot | User could change controls/files/rows after payload creation, then success marked the different state pristine | Disable parent form after payload capture; restore on declared/transport failure; successful cleanup stays read-only; collection actions and validation navigation share existing busy gates |
| File validation | FileField showed only upload rejection and hid bound path-length errors | Pass the existing control and message to FieldError; one shared error presentation |
| Applied list state | Editor handoff or successful group/delete actions could apply changed draft filters without Search | Serialize activeFilters; refresh currentQuery after actions; retain page/sort and previous-page fallback on deleting the last row |
| Group action | Save lacked global loader/input disable; current saved group could be absent from fetched options | Guard ready/pristine/repeated execution, disable input with finalize recovery, reuse saved label through mergeSelectOptions and refresh applied query |
| Lookup recovery | Local warning could accompany an interceptor popup and offered no retry | Existing skip-error option, one localized inline warning and guarded Retry; auxiliary requests do not start global loading |
| Restored query / empty state | Unknown sort/enum and fractional paging values could reach the list; failed reads also displayed empty content | Whitelist restored sort, accept only enum 0/1, floor/clamp paging, suppress empty presentation while a read error exists |
| Duplicate helpers | Local date transport and option merging repeated existing shared ownership | Reuse partnerApiDate and mergeSelectOptions; no new parallel utility or API |
| Dormant roots | PersonBase/Partner/PartnerAddress held copied product actions, wrong inventory URLs, stale audit/tenant DTOs and nonfunctional discount-field enabling | Remove their 39 tracked files under Master 5 G12. Exact path/route/service/DTO/selector searches found no external consumers; no menu/provider/config migration or backend removal |

## Files changed and ownership

Application repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

| File(s), relative to application repository | Change |
|---|---|
| `src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts` | Validation, shared helpers, guarded lookup recovery and stable save |
| `src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.html` | Retry, complete collection busy gate and credit-day input bounds |
| `src/app/modules/Customers/Individual/IndividualPartner/components/list/list.component.ts` | Applied list state, query validation, group/delete state recovery and shared saved-option merge |
| `src/app/modules/Customers/Individual/IndividualPartner/components/list/list.component.html` | Retry, error-aware empty visibility, group action availability and code subtitle |
| `src/app/modules/Customers/Individual/IndividualPartner/models/create.ts` | Four surcharge properties match existing nullable backend VMs |
| `src/app/modules/shared/utils/partner-editor-forms.ts` | Nonblank required card text in the existing factory |
| `src/app/modules/shared/components/file-field/file-field.component.ts` | Existing bound-control validation displayed |
| `src/app/modules/Customers/Individual/{PersonBase,Partner,PartnerAddress}/` | 13 files per root deleted: list/details TS/HTML/SCSS/spec, three models, route, service. Every tracked deletion reviewed |

Documentation repository: `F:/My Work/Shaban Documents/Shaban`. Task edits: `sigma-erp/ui/{00-preamble,10-confirm-discard,12-step-form,18-documents-and-upload,30-backlog-by-priority}.md`, `sigma-erp/CHANGELOG.md`, and eight regenerated phase/plan packets. UI 1.43 records reusable fixes; 1.45 records retirement/conformance. UI 16/18 and mergeSelectOptions were supplied by another authorized screen review and reused, preserving that work. No generated file was edited directly.

Coordination files outside the application repositories: the three `reviews/INDIVIDUAL_FRONTEND_*.md` artifacts and `.agents/skills/sigma-screen-refactor/SKILL.md` under `F:/My Work/Sigma`. Skill checklist and revision rows mirror the owning books. No backend, migration, snapshot, application configuration or translation file was edited by this task.

## Decisions taken and final source conformance

| Master decision / concern | Decision and evidence |
|---|---|
| 1/2/3 — references, shape, routes | UI screen 03: live Individual list plus routed three-step editor because documents/cards are separate collections. Shared list/filter/request reference is Workshop Job; shared step/summary/rows/file owners remain. List/create/view/edit and existing details/:id compatibility routes retained |
| 4/5 — columns/ListVM | Actions first via DataTable; fields beside VMs below. No backend DTO narrowed because this frontend fix preserves the existing API |
| 6/7 — writes/details | Current editable fields, child identities and full snapshots preserved; no tenant/No/audit/delete/approval/calculated-total controls. Existing loaded IsInactive and address label/privacy semantics retained. Detail display labels are not write inputs |
| 8 — styles | Target host sigma-route-host; sigma-list/editor shells, appFilterPanel, app-data-table fill=true, StepForm fill=true, FormSection and EditableCollectionTable. No new stylesheet, feature palette, paginator override or deep shared-component override |
| 9/10 — confirmation/discard | Shared delete/discard confirmation. Saved/dirty child removal still confirms; pristine/view close remains silent. Existing upload discard/cleanup lifecycle retained |
| 11/12 — backend/entity | Existing BE Pattern 2, owned address/billing/documents/cards with no financial posting. Source compared to the pattern/PurchaseOrder reference; no entity or persistence-base change |
| 13/14 — duplicates/FKs/delete | Existing MobileNo/Email unique declarations; InvalidInputAsync and owned-reference/child checks; dependency-aware RemoveWithChildrenAsync retained. Frontend does not invent a second persistence validator |
| 15 — filters | branchId/search/agreementStatus/isInactive; search trims, missing optional values omitted, agreementStatus=0 preserved, unchecked inactive means all. Backend ApplyListFilters uses AgreementStatusFilter; shared paging max100 and current default10 retained |
| 16/17 — translation/service | Existing English/Arabic keys, root services on environment.baseUrl through the AppModule interceptor client. Inline reads/lookups skip interceptor presentation; mutations keep global feedback. No new providers or manual auth headers |
| 18 — migration | No entity/EF/schema change, so Add-Migration is not required; no migration name or backend commit is suggested |
| 19 — reference actions | Create/View/Edit/Delete supported; agreement history and group update are existing domain additions. Job purchase/billing/approval/post/void actions are Not Applicable: customer record has no job or financial-document lifecycle |
| 20 — overrides/maps | Existing search/unique/filter/projection, Customer group resolution, tracked aggregate UpdateCoreAsync and owned delete overrides retain their documented purposes. No service/controller/AutoMapper change |
| 21/22 — plan/children | Bounded shared plan Frozen before edits; all documents/cards sent, saved IDs retained and new update rows use 0. Missing children follow existing snapshot reconciliation |
| 23 — calculations | Age is display-only; no client-owned accounting total/tax calculation or persisted preview introduced |
| 24 — authorization | Candidates: POST/PUT IndividualPartner, DELETE IndividualPartner, PUT {id}/contact-group and sensitive-card detail access. AuthGuard is authentication; no new permission mechanism or hidden-control security claim |
| 25 — correctness | Reject what existing required/int VMs reject, preserve applied user query and stable submitted values, keep failure recovery, and retire unreachable incorrect copies instead of building unsupported screens |

| Grid column/action, in order | Frontend field / type | Existing backend ListVM property |
|---|---|---|
| Actions | id / shared action cell | Id |
| Code | no / text | No |
| Name | name / text | Name |
| Contact group | contactGroup / text | ContactGroup |
| Mobile | mobileNo / text | MobileNo |
| Contact number | contactNo / derived text, not sortable | PhoneHome, otherwise PhoneWork |
| Email | email / text | Email |
| Branch | branch / text | Branch |
| Status | isInactive / status | IsInactive |
| Group action selection | contactGroupId / hidden identity | ContactGroupId |

| Concern / exact source comparison | Final result |
|---|---|
| Individual template app-data-table producer: fill/rows/count/lazy event; TS columns/actions → API Results/ListVM | Matched in source: 10/20/50/100 sizes, actual totalCount, one request stream, error-aware empty, sortable-field whitelist and existing resolveListPaging |
| returnQueryParams/currentQuery/saveContactGroup/deleteRecord → readListRoute/writeListRoute | Matched in source: applied snapshot, unchanged sort/page, explicit one-row delete fallback |
| Details save/buildPayload/form → existing Add/Update VMs | Matched in source: blank/int/null validation, same wire fields, disabled submitted form, both failure channels finalized |
| Details EditableRows/CardRow/DocumentRow/FileField → shared factories, collection and upload tracker | Matched in source: typed rows, current required set, structured dates and ordering, complete busy mutation gate, shared file errors, post-save/discard cleanup-only retry |
| Details saved/fetched selects → existing mergeSelectOptions(incoming,saved) | Matched in source: fetched labels win, missing saved IDs append without changing form IDs |
| pages/routing/IndividualPartner_Routes → AppModule/HttpClient/interceptors | Matched in source; live routes unchanged and retired roots have no consumers or explicit compilation roots |
| Theme/RTL/keyboard/responsive | Shared owners retained, no new styling. Visual/runtime acceptance pending; source inspection does not prove appearance |

## Phases, evidence and verification

| Phase | Result |
|---|---|
| PLAN-00 | Frozen bounded shared correction and retirement plan implemented |
| 0/1 | Current-source discovery and contract freeze; no screenshots/video supplied, so visual evidence classification is Not Applicable |
| 2 | List/filter/paging/export source review and applied-query corrections |
| 3 | Detail/create/edit/view/children/files source review and validation/save recovery corrections |
| 4 | Existing group-update and delete UI state/refresh checked; approval/posting/void skipped as Not Applicable |
| 5 | Existing route/provider/client/feedback wiring reconciled; no wiring fork added |
| 6 | Complete application scoped diff, including every legacy deletion, reviewed; documentation task hunks and generated semantic changes reviewed. Fingerprints independently checked by generator |

Source-only checks passed: scoped git diff --check in both repositories; no merge markers, any, console, ms-lib or toISOString in remaining Individual source; no retired path/route/service/DTO/selector consumers; current tsconfig/angular configuration has no retired root entries. Translation check for individualPartners/individualForm/partnerForm: English 191, Arabic 191, no missing/case-only keys. Literal-key inspection across live Individual source also found no missing referenced English/Arabic keys. All eight generated packets passed Generate-SigmaRecipes.ps1 -Check; Check-BookReferences.ps1 reported every checked reference resolves after final source retirement.

No build, test, lint, browser/runtime/database command, migration, commit, push, deployment, Sigma MCP or Graphify was run. Shared factory consumers (Individual/Company), bound FileField consumers and inherited lookup signatures were source-checked. These are source findings, not compiled/runtime passes.

## Remaining decisions and owner acceptance

No new Missing/Conflicting/Uncertain business/API requirement blocks the implemented frontend fixes. Sensitive card storage/access policy and the application authorization work remain their separately deferred owner decisions; this task does not establish production approval for either. Backend contract evidence was read, not modified.

Documentation drift observed separately: Phase-05's existing template still describes the old LayoutModule interceptor injector, while canonical UI 1 requires the AppModule root chain. The canonical book was followed for this screen. Generator freshness and reference resolution do not establish semantic equality; this pre-existing packet wording needs a documentation-system follow-up. No provider change was introduced from that stale wording.

Owner verification is required before closing this artifact:

1. Run the approved Angular build. Existing ContactGroupService skip-error argument and mergeSelectOptions utility are shared working-tree dependencies; include their owners' changes in the build/review.
2. In Create/Edit, check whitespace-only required customer/card text, cleared required numbers versus nullable Salik/Fine numbers, fractional/overflow credit days, invalid/long file paths, document date order and future birth date. View must remain disabled with saved option labels.
3. Delay and fail save through declared failure and HTTP failure: controls/rows stay frozen while saving, re-enable with values retained after failure, and successful cleanup remains read-only. Fail cleanup and Retry without a second customer save; discard retains saved files.
4. While a file uploads, try Add/Remove and step/error-badge navigation; verify controls are not torn down. Check successful/rejected upload feedback and simultaneous uploads through the existing tracker.
5. Apply filters/page/sort, edit a filter without Search, then open/return from an editor, change group or delete. Applied result must stay unchanged until Search; deleting the last row on page >1 goes back one page. Check page-size-only changes, rapid paging, list errors, lookup Retry and all-page Excel in both languages.
6. Check Arabic/English, RTL/light/dark, keyboard focus, narrow layout and internal scrolling. Historical route details/:id must still open View.

Suggested commits (do not run here): frontend `fix(individual): validate editor inputs and preserve list state`; documentation `docs(ui): record Individual validation and legacy retirement`. No backend commit or migration is needed.

Agent utilization: root owned discovery, frozen decisions, all implementation, documentation and final integration. A bounded read-only luna_explorer (gpt-5.6-luna) was attempted after freeze to audit the independent list/legacy stream at lower cost; it did not initialize and was interrupted without source edits or output. The root completed that audit, so there is no unreviewed delegated result.
