| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-05 |

# Bank accounts maintenance and evolution

Authority: Sigma AGENTS.md, Master 1–7, UI screen 01 and its owning blocks, backend Pattern 1. Recipe fingerprint check passed for PLAN-00 and phases 00–06 on 2026-10-05. User requested review and implementation in Banking/Bank, supplied three screenshots, then authorized reviewer judgement (“شوف الاصح وطبقه”) and all required development-stage changes (“طبق كل التعديلات المطلوبة للوصول لافضل وضع انا لسه فى مرحلة التطوير”).

## Existing-state inventory and impact map

| Concern | Current owner and consumers | Gap | Decision |
|---|---|---|---|
| Bank identity | Bank entity/configuration, BankService, BankProfiler, BankController; bank UI | name/account/TRN/localized name supported; old UI sends tenant/audit fields | Keep inputs; Refactor typed contracts and validation |
| Listing | inherited Service.GetManyAsync; legacy Banking/Bank list | no confirmed search declaration, actions are empty callbacks, old table | Replace with shared DataTable/FilterPanel; Extend SearchColumns |
| Editor | routed legacy DetailsComponent | no discard/validation/failure recovery | Replace in place with list-owned modal; only list route |
| Currency | Administration Currency and its GetSelect owner | Bank has no reference | Extend Bank with nullable CurrencyId; reuse existing lookup; metadata only |
| Cheque layout | image 2; no Bank persistence/API | configuration cannot be saved | Extend Bank with nullable layout fields; dedicated GET/PUT subresource |
| Accounting | BankService creates LinkAccounts stub; LinkAccounts readers, banking documents | static CurrencyToBaseRate is not an exchange-rate engine (BE backlog 18) | Keep accounting writers/amounts/ledger unchanged; no conversion from this metadata |
| Delete | BankService manual reference chain and special polymorphic LinkAccounts handling | EF usages can be missed; English messages | Refactor to EF usage helper plus existing linked-account blockers; retain atomic stub cleanup |
| Mapping/concurrency | generic update marks all scalars | ordinary bank edits could overwrite independently saved cheque settings/activation | Refactor tracked UpdateCoreAsync; map editable inputs only and save changed properties |

## Logic ambiguity and decision review

All selected items below are Frozen reviewer decisions under Master 2 standing rule and the user's explicit delegation of judgement. No destructive backfill, access restriction or accounting policy is introduced.

| Question | Evidence / alternatives | Decision |
|---|---|---|
| Currency semantics | Currency is existing; exchange engine deferred. Reject a bare bool with no currency and reject silently converting ledger amounts | nullable existing currency FK; checkbox reflects id presence; chosen currency required when checked; no amount/rate/posting effect |
| Historical currency | no source proving a currency for existing banks | NULL, no guessed base currency |
| Cheque ownership | settings are opened from one bank's row | one configuration on Bank; no independent settings list or duplicate bank records |
| Settings API | full bank update could overwrite unrelated data | dedicated `GET/PUT Bank/{id}/ChequePrintingSettings` |
| Measurements | image says all measurements in MM; 0 shown | nullable decimal(18,2), nonnegative up to 9999.99, round to .01 mm away from zero at save; null means unconfigured; 0 accepted |
| Font color | text field only; actual printer absent | nullable #RRGGBB, max 7; blank means unconfigured, no invented black default |
| Name validation | entity max100 vs inherited Add250/Update50 | explicit Name required/max100 on Bank AddBaseVm/UpdateBaseVm |
| Name/TRN duplicates | current service enforces both; Name index exists | retain live tenant name and nonblank TRN uniqueness with filtered indexes; no new account-number uniqueness |
| Activation | current UI declares toggle; inherited authenticated handleActivate exists | complete it and show status; use inherited field-only writer |

## Options and target

Selected minimal extension of Bank. Rejected parallel BankAccount entity (breaks existing banking FK/LinkAccounts identity), separate generic settings CRUD (adds independent identity/lifecycle), and transaction-currency accounting rollout (broader deferred owner). UI screen 01: canonical Job list and VehicleService modal/shared EditorDialog; backend Pattern 1 BranchService with justified bank-specific multi-save Add and polymorphic LinkAccounts Delete exceptions.

## Migration and compatibility

Owner runs suggested `Add-Migration AddBankCurrencyAndChequePrintingSettings`; verify name is unused before handoff. New currency/layout fields stay nullable for all historical rows. Add filtered live name/TRN unique indexes (check duplicate/blank legacy values before applying), nullable Currency FK with Restrict. Retain existing bank ids, names, bank document references and LinkAccounts mappings. Deploy schema then API then UI. Rollback UI/API first; retain new nullable columns/data until owner explicitly decides otherwise. Existing selects remain unchanged. Source-only; no migration or data operation by reviewer.

## Implementation and verification matrix

| Slice | Dependencies | Phases | Gate |
|---|---|---|---|
| Domain/API/persistence | this plan and BANK_FULL_STACK_CONTRACT_FREEZE | 1 | exact typed fields, boundary validation, mappings, tenancy and read contracts |
| List/editor | frozen API | 2/3 | shared shell, paging, applied search, failure recovery, dirty-close, currency lookup |
| Cheque dialog and row actions | API plus owning list | 3/4 | independent settings save, delete/activation confirmation, busy guard and refresh |
| Wiring/reconciliation | integrated source | 5/6 | imports/routes/providers/translations, complete scoped diff and whitespace |

Owner verification: build both repos, exercise create/view/edit, nullable currency/save/reload, negative/invalid settings, duplicate/self-update/foreign-tenant requests, referenced delete, activation, cancellation, all-page export, EN/AR, RTL/themes, narrow/long-dialog scrolling. Actual cheque rendering is a separate consumer and is not proved by saving settings.

No unresolved decision blocks these slices. Full multi-currency accounting and print execution are not demonstrated by the screenshots or the requested Bank settings scope.
