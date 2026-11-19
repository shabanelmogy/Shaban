# Account type initialization — explainable result

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date2026-10-23. Owner says Start after the proposed next step of improving
automatic-linking results to identify updated, already classified, review-needed
and exempt root accounts. This bounded response/UI stage makes the existing
classification action explainable; it changes no classification policy, financial
placement, ledger amounts, historical guards or database schema. Later policy
changes require their own frozen evidence. TierM, proportional phases0/1/2/4/5/6.

## Frozen producer and consumers

Keep POST AccountTypeDefinition/Initialize and its empty body, tenant/write lock,
single save, Result envelope and existing fields CreatedGroups, CreatedSubGroups,
CreatedTypes, ClassifiedAccounts, SkippedAccounts, Conflicts. ClassifiedAccounts
continues to mean rows actually assigned a type in this run, not total coverage.
SkippedAccounts retains its old semantics for compatibility; the new UI uses
explicit category counts instead of that ambiguous combined number.

Add Helpers.Enum.Accounts.AccountTypeInitializationStatus in its own enum file:
Updated=1, AlreadyClassified=2, NeedsReview=3, ExcludedRoot=4. It is response-only,
not persisted. Add AccountTypeInitializationAccountVM in its own ViewModels file,
same namespace as AccountTypeInitializationVM, fields:

- AccountId:int, AccountCode:string, AccountName:string.
- Status:AccountTypeInitializationStatus.
- AccountTypeName:string?, AccountTypeNameLocalized:string?. No new type ID is
  needed because this result displays names and does not edit type definitions.
- Reason:string, localized safe outcome/review message.

Extend AccountTypeInitializationVM with TotalAccounts:int,
AlreadyClassifiedAccounts:int, ReviewRequiredAccounts:int, ExcludedRootAccounts:int,
Accounts:List<AccountTypeInitializationAccountVM> and Warnings:string[].
Each queried live tenant account appears exactly once with its final classification
outcome. Updated/AlreadyClassified include its assigned/retained bilingual type
names; missing referenced type has no invented name. Roots are always ExcludedRoot,
even if legacy metadata exists. All existing failure branches receive NeedsReview
with the existing localized conflict; no-kind without a message receives a new
localized unresolved reason. Positive/exempt reasons also use resource keys.

TotalAccounts equals Updated + AlreadyClassified + NeedsReview + ExcludedRoot.
ReviewRequiredAccounts is the count of accounts whose classification could not be
resolved. Other warning kinds are separate: Warnings contains definition/setup
diagnostics and nonposting-reference warnings, not duplicate per-account failure
reasons. Keep all the existing messages in legacy Conflicts for old consumers.
No frontend counting/guessing replaces authoritative category counts.

## UI and action lifetime

Both Chart of Accounts and Account Setting keep the existing shared result owner
AccountClassificationResultComponent and existing confirmation, request, busy,
failure, refresh and single success-feedback owners. No new action endpoint.

The result uses the existing padded EditorDialog in View with viewport-bounded
public sizing, shared SummaryCards for total/four outcome counts and category
selection, a full-width shared FilterPanel search strip and shared locally paged
DataTable. Account columns exactly: accountCode, accountName, status,
accountTypeName (bilingual display), reason; accountId is the minimum row identity.
No extra account/domain write fields are added. Full strings wrap and remain
available; no title-only/truncated diagnostic. Search covers account code/name,
displayed type and reason. Reset returns all statuses and clears search.
Filter changes reset local paging. A warnings tab appears only when Warnings has
entries, using shared EditorTabs and the same bounded local table scroll owner;
do not duplicate legacy Conflicts below the new rows. Empty states, filters,
outcomes, summaries and new reason messages are bilingual. Optional Excel export
uses the existing shared formatted export helper and the complete filtered result.

This is a read-only action-result composite under UI13/6, not a typed action form
or a second editable account screen. Parent tree remains screen04, settings06.
No approval/permission mechanism or root edit capability is introduced.

## Conformance and ownership

| Concern | Book / actual owner | Match required |
|---|---|---|
| DTO/action boundary | BE3/5/8; existing InitializeAsync/InitializeCoreAsync and result VM | Only the frozen display response expands; retained write guards and outcome coverage |
| Result shell | UI13; actual shared EditorDialog and current result component | Same View/Close lifecycle; public dimensions and one bounded content scroll owner |
| Table/filter | UI4/5/6; FilterPanelComponent and DataTableColumn/public declarations | Full-width shared strip, local pagination, exact five display fields plus identity |
| Counts/status filter | UI24; SummaryCardsComponent/SummaryCard declarations | Shared count formatting/selection, stable identities and backend totals |
| Namespace/contracts | Master5 | Enum and VM each own file, imports/project SDK inclusion verified, matching numeric TS enum |
| Guide | Master7 | Existing /UserGuide/accounts content explains all outcomes, reasons and warnings |

Root owns contract, integration, guide, review and final source reconciliation.
Backend worker owns only status enum, initialization result VMs, the existing
initializer service and its four new EN/AR reason resources. Frontend worker owns
only account-type-definition TS models, the existing initialization-result component
TS/HTML/SCSS and account-types bilingual vocabulary. No overlapping writes.
Workers preserve all user/peer changes and use source-only checks; no generated
packets, snapshots, migrations, references, build/test/lint/browser/data commands.
Root separately reviews both repositories, new untracked sources and namespace
resolution. Deployment/runtime/actual account outcome validation stays pending.
