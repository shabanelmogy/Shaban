| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-05 |

# Bank feature review manifest

Scope: Banking/Bank plus directly owned Bank backend, currency lookup, local translations/provider wiring; frozen plan and full-stack handoff alongside this file. UI screen01, backend Pattern1. References: Workshop Job list, Fleet VehicleService details, shared DataTable/EditorDialog/FilterPanel and BranchService. Phases0–6 apply; no uploads/child rows/posting/report print. Existing Bank scoped files were clean; other large unrelated frontend changes and shared translations/styles exist and are preserved. Backend Bank scoped files were clean. Artifacts are local/unversioned under Sigma/reviews.

## Functional evidence

Screenshot metadata: E1=1.PNG list, E2=2.PNG settings, E3=3.PNG create; attached paths C:/Users/user/Desktop/Banking/BankAccounts. English/LTR desktop; capture date/version/role Unknown; treated as functional reference. User request approves implementing the shown Bank business within Guide patterns, reinforced by the later broad implementation instruction.

### E1

| Evidence | Classification | Required behavior | Phase | Representation |
|---|---|---|---|---|
| Bank Accounts title, manage subtitle, create button | Explicit | title/create | 2/3 | FeatureTitle, PrimaryActionButton, modal |
| Search, name/account/TRN, pager | Explicit | filter/display/paging | 2 | shared FilterPanel/DataTable, confirmed stored fields |
| View/Edit/Delete/Cheque Printing Setting | Explicit | record workflows | 3/4 | shared editors/confirmation; dedicated settings subresource |
| Sort chevrons | Strong inference | sortable stored columns supported by base | 2 | allowlisted Name/AccountNo/TRN/status |

### E2

| Evidence | Classification | Required behavior | Phase | Representation |
|---|---|---|---|---|
| Cheque width/height, date/payee/amount/words left/top margins, font size/color | Explicit | all twelve configuration fields | 1/3 | nullable Bank settings DTO and typed dialog |
| All measurements in MM | Explicit | unit labels | 3 | translated hint; no screenshot CSS copying |
| Save/Cancel | Explicit | persistence/discard | 3 | shared dialog footer and dirty confirmation |
| Printed output/layout engine | Uncertain | not shown | — | no print execution invented; settings persistence only |

### E3

| Evidence | Classification | Required behavior | Phase | Representation |
|---|---|---|---|---|
| Bank name/account/TRN | Explicit | create/edit | 1/3 | existing inputs and aligned max100 validators |
| Attach currency | Explicit | optional currency association | 1/3 | nullable existing Currency FK, checkbox + selector |
| Save/Cancel | Explicit | save/dirty close | 3 | shared dialog actions |
| Localized name absent | absence is not deletion evidence | preserve existing input | 3 | retained optional localizedName |

Grid contract: Actions, name/Name, accountNo/AccountNo, trn/TRN, isActive/IsActive; id/Id action identity. Filter search serialized Filters[search] searches confirmed Bank string fields; sort uses Filters[sortField/sortOrder]; export uses same applied query. Migration/default/concurrency and all write/action decisions are frozen in BANK_FULL_STACK_CONTRACT_FREEZE.md.

## Final reconciliation

Implementation follows the Frozen plan and contract. Phases 0 (discovery/evidence), 1 (domain/API), 2 (read/grid), 3 (detail/write), 4 (delete/activation), 5 (wiring) and 6 (source reconciliation) were applied. Uploads, children, posting, approvals and print execution are not applicable to this Bank metadata/settings scope. Runtime acceptance remains pending; this report is not Closed.

### Decisions and final evidence

| Concern | Decision and actual source evidence | Reconciliation |
|---|---|---|
| List shape and columns | `BanksComponent.columns`: Name, AccountNo, TRN, IsActive; shared action column. `BankListVM`: Id, Name, AccountNo, TRN, IsActive. Id is row identity; no editor-only or tenant/audit fields | Match |
| Search/paging/export | `BankService.SearchColumns`: Name/LocalizedName/AccountNo/TRN. Angular `query()` uses applied filters; `toListParams` serializes shared paging/sort; `getAllList` uses `fetchAllPages` with pageSize100; `dataTableExportRows` uses displayed columns and translated status | Match; runtime export pending |
| Detail and payloads | `BankDetailVM`/`BankDetailsDTO` contain Id and editable strings plus CurrencyId/CurrencyName. Angular Save explicitly constructs editable inputs; Add/Update name required/max100; Update alone adds Id | Match |
| Currency | Nullable Bank.CurrencyId to existing Currency with Restrict. `InvalidInputAsync` inspects this EF FK and checks live tenant references. UI checkbox derives from id, clears to null when unchecked and requires a current lookup choice when checked. View uses detail CurrencyName | Match; metadata only, no conversion/ledger calculation |
| Cheque settings | Separate GET/PUT `{id}/ChequePrintingSettings`, matching twelve nullable fields. Eleven measurements have invariant range0..9999.99 and EF precision18,2; server rounds AwayFromZero to two places. FontColor uses max7/#RRGGBB. New/historical settings remain null rather than invented defaults | Match |
| Mapping and independent writes | Directional Bank Add/Update/List/Detail maps; CurrencyName explicit flattening; separate settings read/write maps. No ReverseMap or defensive Ignore chains. `UpdateCoreAsync` and `SaveChequePrintingSettingsAsync` map onto tracked Bank and save changed fields | Match; editor/settings/status do not replace one another |
| Creation and uniqueness | Add calls shared input validation and `ExecuteUniqueWriteAsync<Bank>` around two saves for Bank plus polymorphic LinkAccounts stub. Existing live tenant Name and nonblank TRN uniqueness preserved; filtered EF indexes added | Match; migration/legacy duplicate check pending |
| Delete | `RemoveAsync` rejects legacy Value/configured AccountId links and generic EF usages for Bank and each stub before marking any deletion; bank and unconfigured mappings saved together | Match; historical links are not backfilled/removed |
| Activation | Existing inherited handleActivate used; current status displayed and appropriate activate/deactivate action offered, with shared confirmation and refresh | Match; no invented permission model |
| Routes/providers | Only Bank list route remains; editor/settings are parent-owned conditional modal instances. Targeted searches found no internal links requiring old create/details routes. Root BankService retained; only its redundant LayoutModule import/two provider entries removed | Match; old external bookmarks may need updating |
| Failure/cancellation | Inline read errors use skip-interceptor header and apiErrorMessage; mutations keep interceptor feedback and drafts on both failure channels. takeUntilDestroyed/finalize, switchMap list cancellation, loaded identity guards, shared dirty-close and synchronous form locks during Save/discard confirmation | Match; owner exercises network failures |
| Screenshot ambiguity | E1–E3 visible business implemented in canonical layout. Sort behavior is a strong inference. Missing localizedName in image does not justify deleting it. Actual print engine and transaction-currency accounting are not demonstrated | No unresolved requirement blocks the implemented scope; these broader workflows remain separate |

### Reference conformance after implementation

| Concern and authority | Actual producer/reference | Actual target comparison | Result |
|---|---|---|---|
| UI1/3 page/title | Job list/shared styles: route host → list page/panel → fixed header/table region; FeatureTitle inside panel | BanksComponent host `sigma-route-host`, same page/panel/header/table chain, title and Create in FeatureTitle; no local stylesheet | Source matched; responsive/theme acceptance pending |
| UI4 filters | FilterPanelComponent stable layout, shared Reset and actions | Bank form uses stableLayout=true, inlineActions=true, mainColumns=1, appFilterActions and shared Search; no manual control geometry | Source matched |
| UI5/6/28 table | DataTableComponent fill/paginator and Job list query lifecycle | fill=true, dataKey=id, shared DEFAULT_PAGE_SIZE/resolveListPaging, switchMap/defer/finalize and allowlisted stored columns | Source matched |
| UI13/15 modals | VehicleService fields-only editor; shared EditorDialog public dimensions, header/footer and padded content | Both Bank dialogs use width680px/height560px/contentPadded=true, separate translated title/subtitle, shared footer, sigma-editor-form/body/scroll/grid with public columns2 | Source matched; one dialog body scroll; visual acceptance pending |
| UI10/19/27 form/focus | FieldErrorComponent, ConfirmationDialogService.confirmDiscard, focusField, NumericFocusDirective/shared numeric owner | Typed forms, explicit labels/ids and aria-invalid; shared invalid-field focus and discard; numeric settings use native number/appNumericFocus/min/max/step | Source matched |
| BE3/4/8/13 normal entity | BranchService/Service validation and tracked-save helpers | Bank uses inherited generic list/detail/select/activation; overrides only search/unique declarations and justified multi-save creation, tracked update and polymorphic delete; settings are a feature-specific subresource | Source matched |

### Files changed

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Banking/Bank/bank.routes.ts`
- `src/app/modules/Banking/Bank/components/list/list.component.ts` and `.html`
- `src/app/modules/Banking/Bank/components/details/details.component.ts` and `.html`
- New `src/app/modules/Banking/Bank/components/cheque-settings/cheque-settings.component.ts` and `.html`
- `src/app/modules/Banking/Bank/models/create.ts`, `details.ts`, `list.ts` and new `cheque-settings.ts`
- `src/app/modules/Banking/Bank/services/bank.service.ts`
- Bank-only additions to `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`
- Bank-only provider cleanup in `src/app/_metronic/layout/layout.module.ts`

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Helpers/Models/Banking/Bank.cs`
- `SiGma.DataAccess/Configuration/BankConfig.cs`
- `SiGma.ViewModels/ViewModels/Bank/BankAddVm.cs`, `BankUpdateVm.cs`, `BankDetailVm.cs`, `BankListVm.cs` and new `BankChequePrintingSettingsVM.cs`
- `SiGma.Business/MapperConfig/BankProfiler.cs`
- `SiGma.Business/IServices/IBankService.cs`
- `SiGma.Business/Services/BanksServices/BankService.cs`
- `SiGma.ServerAPI/Controller/BankController.cs`
- Six Bank-only keys in `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`

Other dirty source, shared translations/provider edits and unrelated Banking changes predated this work and were preserved. Approved references, global styles, currency owner, financial writers, migrations, snapshots and tsconfig were not edited by this task. Review artifacts are the existing plan, freeze and this report outside both repositories.

### Verification performed and remaining limits

Recipe drift check passed. Root reviewed complete Bank scoped diffs separately in each repository, read the new files, and reviewed the Bank-owned shared-file additions. Scoped git diff --check passed. Translation parity: 50 EN/50 AR keys, zero missing/case-only differences. Both backend resource XML files parsed; each of the six Bank keys occurs once. Targeted checks found no stale legacy table imports, any types, client tenant fields, old TRN spelling or merge markers in the Bank module. Direct inherited Bank select consumers remain supported. Foreign-key validation and tracked-save ownership were checked against actual generic Service source.

No build, test, lint, browser/application verification, database command, migration, snapshot edit, commit, push, deployment, Sigma MCP or Graphify was run. The final independent audit request had no delivered result on continuation; root performed the final source audit and integration. Source checks do not establish compilation, runtime, RTL/theme or visual acceptance.

### Owner migration and manual verification

The owner must create and review `Add-Migration AddBankCurrencyAndChequePrintingSettings` using the existing backend startup/data projects. The suggested name was checked against the migration directory and is unused. Review nullable CurrencyId/layout columns, Restrict FK, decimal18,2 fields, max7 color and live filtered unique indexes. Before applying, inspect existing live Name/nonblank TRN duplicates and resolve them under owner policy; no automatic data repair is supplied. Apply schema before API/UI. Existing ids and historical null configuration are retained.

After schema update, build both repositories and verify:

1. Search/Reset, sorting, paging/query restore, empty/error/Retry states and export beyond one page in EN/AR.
2. Create/View/Edit, name/max100 validation, dirty X/Cancel/Escape, failed-save draft recovery and repeated-click locking.
3. Attach/select/save/reload/uncheck currency; empty/failed lookup; deleted/foreign-tenant/invalid currency rejected at API boundary.
4. Read/save/reload all twelve cheque fields, blank/zero values, invalid negative/too-large measurements and color, two-place rounding; ordinary Bank edits preserve settings and vice versa.
5. Duplicate Name/TRN and self-update; atomic Bank/stub creation failure; referenced/configured/legacy-link delete rejected; unreferenced bank/stub cleanup; activate/deactivate refresh.
6. Narrow screens, long names, keyboard focus, RTL, light/dark themes and fixed page/footer with internal grid/dialog scrolling.

No preemptive tsconfig files entry was added; if owner compilation reports a missing runtime file, follow the existing explicit-files convention for that exact entry. Narrowed nested Bank detail contracts and retired external create/details bookmarks are compatibility points to include in owner acceptance. Same-form concurrent edits retain current last-write behavior; there is no new row-version contract. Saving configuration does not verify a physical cheque print.

Suggested commits (not executed):

- Frontend: `refactor(bank): align account list and editors with Sigma patterns`
- Backend: `feat(bank): persist currency and cheque settings with validated writes`

### Follow-up: reduced Create height

User requested less unused height in the new-bank dialog. `DetailsComponent` template now binds the shared public height input to 440px in Create and 560px in Edit/View; width remains680px. The shared EditorDialog max-height and internal body-scroll chain preserve fixed footer controls when space is limited. Only that feature template and review/freeze amendments change; API, validation, mapping and domain contracts are unaffected. Phases3/6 apply as a presentation-only follow-up; other phases need no source changes. No worker delegation was needed for this one-binding edit. Complete template diff and scoped whitespace check reviewed; no build/test/lint/browser/database/migration/commit/push/deploy commands run. Owner visual acceptance remains pending. Suggested frontend commit: `fix(bank): reduce new account dialog height`.

The follow-up recipe drift check reports PLAN00 and phases00/02/03/04/05/06 stale (phase01 OK), superseding only the earlier check's current validity. Canonical UI13/15 and actual shared EditorDialog source were used; stale generated packets were neither used nor edited. Regeneration and semantic review remain with the documentation owner.

### Follow-up: GET Bank returns 500 (2026-10-06)

Observed evidence: user supplied GET `/Bank?pageNo=1&pageSize=15&Filters[sortField]=id&Filters[sortOrder]=-1`, status500; no response body or server exception supplied. App terminal is not attached, and no stored server log was found in the targeted source inventory. Requested Response/server exception asynchronously. Cause is Uncertain, not declared fixed from source alone.

Confirmed source finding: inherited `Service.MaterializeListAsync` uses `query.ToListAsync()` then maps, which selects all Bank scalar columns. Bank now declares CurrencyId and twelve cheque configuration fields; the currently checked migration snapshot's Bank block still lacks these fields, and no migration named for the Bank currency/settings change was found. A missing database schema is a strong hypothesis, but snapshot state does not establish the running database state. Supplied paging/sort values match the inherited supported contract.

Implemented scope: only `SiGma.Business/Services/BanksServices/BankService.cs` gained a `MaterializeListAsync` projection through existing `ProjectTo<BankListVM>`; entity-only settings/currency columns are no longer required for list rows. This is a justified Bank-specific projection exception using BE7/13 and actual base hook evidence; contract amendment recorded before edit. Grid/list fields still match: Name/AccountNo/TRN/IsActive plus identity Id. Count/filter/tenant/soft-delete/order/paging owners remain inherited; no API, mapping, calculation or schema change was made in this follow-up. No catch-and-empty fallback hides failures.

Phases0/2/6 apply to trace, read projection and source reconciliation; other phases unchanged. Recipe fingerprints all passed on this follow-up, superseding the preceding follow-up drift condition. Complete scoped BankService diff and whitespace reviewed; owner must rerun GET after rebuilding/restarting their API. No build/test/lint/browser/application request/database/migration/snapshot/commit/push/deployment commands were run. No subagents: one tightly bounded read-path fix. Suggested backend commit: `fix(bank): project only account list columns`.

Schema rollout still requires the previously suggested `Add-Migration AddBankCurrencyAndChequePrintingSettings` and owner application to the database configured for the running API. Full editor/settings writes continue to require that schema. If Response contains `Invalid column name` for CurrencyId/cheque fields, that confirms the migration hypothesis; other exception types require their own evidence-led fix. Runtime resolution and visual acceptance remain pending. Project AGENTS.md Migration boundary and Prohibited tools and actions prohibit creating/running this migration or database commands in this task without an explicit overriding instruction.

### Original worker record

After root froze the shared contracts, two bounded workers used inherited models: bank_backend owned only the thirteen Bank backend/resource files; bank_cheque_dialog owned the new settings dialog/DTO. Backend and cheque UI work proceeded independently while root implemented list/editor/service/translations and owned integration, source review and artifacts. This reduced serial implementation time without overlapping file ownership; no measured cost or elapsed-time claim is made. Root added the final OnPush and synchronous form-lock refinements after worker ownership ended. No agent declared overall closure.
