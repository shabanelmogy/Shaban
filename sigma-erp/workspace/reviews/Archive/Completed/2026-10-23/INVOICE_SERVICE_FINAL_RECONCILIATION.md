# InvoiceService Final Reconciliation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Scope | `SigmaBackend/SiGma.Business/Services/VouchersServices` and direct invoice contracts |
| Date | 2026-10-12 |
| Build/test status | Not run; project instructions prohibit execution in this pass |
| Schema status | No entity, schema, or migration changes |

## Conformance

| Frozen requirement | Evidence | Result |
|---|---|---|
| Preserve old `IInvoiceService` and controller routes | `IInvoiceService` keeps legacy methods; `InvoiceService` delegates Tax Advance methods | Pass |
| Preserve `GenerateInvoiceRequest` | Existing `GenerateInvoices` entry point remains; type-specific routing is unchanged | Pass |
| Keep `InvoiceBase`/TPT | No model or mapping hierarchy change | Pass |
| Server-owned invoice type | Update rejects a mismatched `InvoiceType`; update maps ignore it | Pass |
| Shared invoice lock | `GenerateInvoices` uses `InvoiceBase` lock; Limousine keeps its type lock | Pass |
| Preflight before first save | Generated invoices validate foreign keys and accounting readiness before transaction writes | Pass |
| Safe manual merge | Group key includes customer, agreement, project, rate, agreement metadata, period, and plate | Pass |
| Single accounting writer | `InvoiceAccountingService` delegates posting to `JournalVoucherResolver` | Pass |
| No duplicate Limousine write boundary | Single-item Limousine delegates to coordinator-owned lock; batch update retains one atomic outer lock | Pass |
| No schema migration | No entity/migration files changed | Pass |

## Changed files

- `SiGma.Business/Services/VouchersServices/InvoiceService.cs`
- `SiGma.Business/Services/VouchersServices/TaxAdvanceService.cs`
- `SiGma.Business/Services/VouchersServices/InvoiceAccountingService.cs`
- `SiGma.Business/IServices/ITaxAdvanceService.cs`
- `SiGma.Business/IServices/IInvoiceAccountingService.cs`
- `SiGma.Business/IServices/InvoiceAccountingMetadata.cs`
- `SiGma.Business/MapperConfig/InvoiceProfiler.cs`
- `SiGma.Business/Services/VouchersServices/LimousineInvoiceService.cs`
- `SiGma.Business/IServices/IInvoiceService.cs`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`

## Deferred

- Rental/Lease generation and mixed invoice query logic remain in the compatibility coordinator. A later pass can move those rules to a typed `RentalLeaseInvoiceService` after consumer and regression coverage is available.
- The Agreement multiple-invoice policy remains unchanged and still requires a business decision.
- `InvoiceBaseController` remains unchanged pending proof that no external consumer depends on it.

## Source-level verification

- Recipe drift check passed for all generated plan and phase packets before implementation.
- Direct consumer search covered `InvoiceController`, `LimousineInvoiceService`, `InvoiceBaseController`, and `GenerateInvoiceRequest`.
- Working-tree changes outside the invoice scope were preserved.
