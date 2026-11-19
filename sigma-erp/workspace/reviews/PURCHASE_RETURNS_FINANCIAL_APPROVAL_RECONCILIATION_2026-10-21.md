# Purchase Returns — financial approval source reconciliation

| Field | Result |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Authority | `PURCHASING_SUPPLIERS_CYCLE_CONTRACT_FREEZE.md` dated owner amendments; Master 2/4/7, backend 12/15, UI 7/13, PHASE-00–06 |
| Evidence | Historical screenshots prove a supplier movement allocation table and Journal action; their unbalanced one-line journal is not accepted as accounting behavior. Owner confirmed balanced approval posting, actual eligible movements, tab plus modal, and flag-only financial Void. |

## Frozen result and source evidence

| Concern | Contract | Source result |
|---|---|---|
| Draft | Supplier, branch, date, currency, positive amount and explicit counter account; server number; no posting on Save | `PurchaseReturnService.AddCore/UpdateCore/Validate`, entity/config, typed Add/Update VMs |
| Selection | Only posted, effective, unvoided credit AP lines with supplier/account/branch/currency match and remaining capacity; no label allowlist | `GetEligibleMovementsAsync`; approval re-runs `Validate` inside unique-write transaction |
| Approve | Balanced Dr supplier AP / Cr validated asset-or-expense counter; selected allocations persist atomically against stable JV detail IDs | `PurchaseReturnService.Decide`, `JournalVoucherResolver.SaveAndPostJVAsync`, `JournalVoucherAllocation` |
| Reject and legacy | Rejection has no posting; nullable historical approval has no assumed state and cannot be approved automatically | `PurchaseReturn.ApprovalStatus`, `RecordApprovalDecision`, approval GET, list/editor legacy display |
| Void | Only approved financial return; source and owned JV flagged void, no reverse journal; period and active-allocation guards | `PurchaseReturnService.VoidCore`, source model `Void`, server `CanVoid` estimate |
| Approval presentation | Saved editor tab and separate list action/modal read one status/history, with server-eligible Approve/Reject controls | Return approval GET/POST, list/editor components and service |
| Editor readiness | Create/Edit controls re-enable after the latest eligible-movement read finishes; stale responses from an older supplier/branch selection cannot replace the current list | `details.component.ts` eligibility version and `applyState` completion |
| Journal | Action only for a valid source-owned posted JV; history retained after Void | `PurchaseReturnProfiler.CanViewJournal`, list/editor action |
| Guide | New in-app topic for list, creation, allocation, approval, legacy and Void | `src/app/modules/UserGuide/content/purchase-returns-topic.ts`, registered in record-list topics |
| Historical Print/Report/Export controls | Screenshots show these actions | No Print, Report, or Export action is implemented in the current PurchaseReturn list/editor source. These remain a known scope gap rather than runtime-only verification. |

Grid: Purchase Return No, Date, Branch, Supplier, Supplier Code, Detail, Amount, Approval Status and actions. ListVM: `PurchaseReturnNo`, `PurchaseReturnDate`, `BranchName`, `SupplierName`, `SupplierCode`, `Detail`, `Amount`, `ApprovalStatus`, plus server action flags. Additional read fields support the editor and status modal.

No inferred tax reversal or stock return was added. Calculations and capacity checks are server-owned; Angular totals are previews. Existing legacy scalar rows are displayed read-only rather than converted into allocation identities. Input child maps are not used to assert legacy source links.

## Verification and handoff

Scoped source diffs, translation keys, RESX duplicate-name checks, TypeScript syntax transpilation and Angular template syntax parsing were reviewed. `git diff --check` found no whitespace errors in the scoped tracked files. Build, tests, browser, database and runtime acceptance were not run under `AGENTS.md`. The owner must create and apply an EF migration, suggested name `AddPurchaseReturnFinancialLifecycle`, for the new status/log, financial fields and stable source links; no migration or snapshot was edited here.

Manual owner check after migration: save a draft with and without allocation; confirm only open eligible movements appear; approve once and inspect balanced owned journal plus allocations; confirm stale or over-capacity allocations fail without partial posting; reject a second draft without journal; verify legacy records stay unproven; verify Void is blocked by active allocations or closed period and otherwise retains an ineffective historical journal. Print, Report and Export require separate implementation before the historical screen scope can be called complete; runtime acceptance cannot verify actions absent from source.

## Compiler-error follow-up, 2026-10-21

The owner supplied an active-error list dominated by missing members in `SiGma.Business` and `SiGma.ServerAPI`. Source inspection confirms those members in the current Helpers entities/enums, Business interfaces and ViewModels. The Helpers reference assembly in `obj/Debug/net10.0/ref` predates the changed Helpers source by several hours, and the Business reference assembly likewise predates changed Business interfaces. Those diagnostics therefore need a full dependency-ordered owner build before they can be treated as current source failures. One independent source error was confirmed at `PurchaseReturnService.GetEligibleMovementsAsync`: nullable `Account.IsActive` was used as a non-nullable boolean in an `&&` chain. It now explicitly requires `== true`. Scoped whitespace review passed; no build or cache deletion was run by the agent.

## Editor presentation follow-up, 2026-10-21

The owner requested the Basic Information layout be corrected and Allocation placed as the second vertical column of the same editor. The source-owned document and allocation fields, saved approval tab/modal, draft validation and financial rules remain unchanged. Screen type 08 Financial document applies. The previous separate Allocation tab is replaced by one document workspace; saved approvals remain a separate tab. The create route needs no single-tab strip. On narrow widths the two panes stack inside the bounded editor body.

| Concern | Book block | Reference/source symbol | Shared owner | Target match |
|---|---|---|---|---|
| Routed editor shell and bounded pane scrolling | UI 1/13, type 08 | `Workshop/Job/components/editor`; `sigma-editor-form/body/scroll` | Shared editor shell | Two panes each own one scroll region; fixed title/footer and no page scroll |
| Two-column financial detail composition | UI 13/14 | `Bills/Bill/components/loan-plan` split; current PurchaseReturn form/table | Feature layout + shared controls | Compact header fields left, eligible and selected movement tables right; stack at narrow width |
| Editable allocation tables | UI 14 | `EditableCollectionTableComponent` | Shared table | Retain columns, row actions, validation and horizontal table overflow |
| Totals | UI 14/24 | `SummaryCardsComponent` | Shared summary cards | Replace duplicate in-form amount labels with compact allocation/remaining previews |
| Language and direction | UI 23/25 | `vocabs/en.ts`, `vocabs/ar.ts`; logical layout | Shared translation owner | Workspace label and guide updated in both languages; owner visual check pending |

Source result: the create route shows the document form and allocation workspace together without a redundant one-tab strip. Saved records use a workspace tab and a separate Approval tab; the Approval Status modal still reads the same approval state. The workspace uses a narrow Basic Information pane and a flexible allocation pane with eligible movements, selected allocations and read-only legacy rows. The allocated and unallocated preview uses the shared summary cards below both panes, with a fixed editor footer. At narrow container widths the panes stack inside the bounded editor scroll region. Form values, allocation capacity checks, server requests and approval behavior were not changed.

Scoped source review: checked shared input contracts for editor tabs, editable collection table, form section and summary cards; checked old `basic`/`details` tab references were removed; `git diff --check` passed for the changed frontend files. No build, lint, browser, test or runtime action was run under `AGENTS.md`. Owner visual acceptance remains pending for wide and narrow layouts in both directions.

## List date-range filter follow-up — 2026-10-21

Owner requested searching Purchase Returns between two dates. The list now uses the shared two-month range calendar (UI4/17, reference: Purchase Orders list) with optional, complete ordered endpoints and the canonical current-month default. The client sends `dateFrom`/`dateTo` as date-only filter keys; clearing the range searches all dates. The backend uses `FilterHelper.GetDate` and filters `PurchaseReturnDate` inclusively before count and paging (BE9, Phase 2). Its list route now delegates to the existing projected `GetManyAsync` path so feature filters and the existing `MaterializeListAsync` projection/CanVoid calculation actually run. An inverted direct API range returns `InvalidDateRange`; the list displays declared and transport errors.

| Concern | Book block | Reference / shared owner | Target result |
|---|---|---|---|
| Range control | UI4/17 | Purchase Orders list; shared DatePicker/FilterPanel | One typeable two-month range with shared validator and field error |
| Transport and list semantics | BE9, UI2/6 | `FilterHelper`, list service, `Service.GetManyAsync` | Date-only keys; inclusive date comparison before count/page; existing number/branch/supplier filters retained |
| User help | Master7 | Existing Purchase Returns topic | Explains inclusive range and clear-for-all behavior in both languages |

This follow-up changes no schema, posting, approval or allocation contract. Source-only review and owner build/runtime/RTL acceptance remain pending.

Owner layout follow-up: the return-date range spans two of six shared filter-grid columns, with another two allocated to the supplier selector so no track is wasted. This narrows the range relative to the initial five-track layout while keeping both dates readable. The existing Reset/Search toolbar uses the shared inline-actions and aligned-caption option beside the fields. The shared panel owns narrow-screen stacking; no local widths or duplicated buttons were introduced. Visual acceptance remains pending.

Owner refinement: use seven equal shared tracks. The number consumes one; the date range, branch and supplier each consume two. This slightly reduces the date-range width, increases branch width, and keeps all four fields plus Reset/Search on the same desktop row without custom CSS. Narrow-screen behavior remains owned by FilterPanel; visual acceptance pending.
