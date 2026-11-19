| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-08 |

# Lightweight detail identity inheritance

Owner-approved plan/contract: LIGHTWEIGHT_DETAIL_BASE_CONTRACT_FREEZE.md. Reuse existing Helpers Detail namespace; add Id-only and nullable-number bases; adapt the 48 exact standalone DetailVM consumers without changing their flattened contracts. Preserve the legacy hierarchy and unrelated source edits. Update owning BE3 and required skill together.

| Concern | Owning block/reference/shared owner | Target decision before edits |
|---|---|---|
| Repeated identity | BE3, SalesQuotationDetailVM/SupplierDetailVM/SupplierAddressDetailVM, existing Helpers/ViewModelsBases/Detail | Extract exact public Id and optional nullable No, selected by actual member contract |
| Mapping | BE4, actual BranchProfiler and existing convention read maps | Inherited public properties remain map targets; no new ForMember/Ignore/ReverseMap/base type map |
| Compilation wiring | Helpers/ViewModels SDK csproj and existing project reference | New single-class source files included by SDK default; no csproj/generic constraint edit |
| Compatibility | Existing DetailBaseVm, scoped GetProperties consumers | Legacy type unchanged; no response member/default/collection/formula removed or added |
| Documentation | BE3 + skill §8.1/history | Replace explicit-only recommendation with lean inheritance; record owner-approved technical evolution and unchanged field-only contract |

Phases0/1 freeze above, Phase3 technical read-DTO refactor, Phase5 source/project integration, Phase6 full scoped diffs and flattened property comparison. UI grid/filter/actions, financial writes, migrations and user-visible guide content are not applicable. Execution remains source-only.

## Final reconciliation

Source implementation complete: two new abstract Helpers files, LeanDetailBaseVm.cs and NumberedDetailBaseVm.cs, and the 48 existing detail VMs inventoried in the frozen contract. Seventeen use NumberedDetailBaseVm; thirty-one use LeanDetailBaseVm. SalesQuotationDetailVM now inherits NumberedDetailBaseVm without declaring Id/No locally; SalesQuotationItemDetailVM inherits LeanDetailBaseVm. TaxAdvanceDetailVm preserves its initialized nonnullable string No over the Id-only base. Existing heavy bases, Delete/List/Add/Update VMs, mapper profiles, services/controllers, generic constraints, domain formulas, EF and schema are unchanged by this pass. Prior dirty Supplier DTO changes and unrelated source/documentation changes preserved.

Owning documentation updated together: canonical backend/03-step-3-viewmodels.md, backend/00-preamble.md (version0.77), CHANGELOG.md (Backend0.77 row); sigma-screen-refactor/SKILL.md §8.1 and its revision-history row. The earlier explicit-only identity recommendation is superseded by lean identity inheritance without adding response fields. Documents retain existing unrelated history/validation rules. Generated packets are not edited. Initial recipe check reported PLAN00/Phase00–05 stale and Phase06 current; final check after the canonical update reports PLAN00 and all Phase00–06 stale. Owner regeneration and semantic review remain pending.

Source-only evidence: all 48 transformed files were compared against their pre-edit source snapshot. Differences are exactly the shared namespace import, matching base declaration and removed local matching Id/nullable No declarations; all other content, formulas and initializers retained. Flattening the chosen bases preserves all 529 public auto-property signatures/nullability/defaults in the current 48 DTO contracts. Full scoped backend diffs and both newly added files reviewed; documentation implementation hunks reviewed separately in the real Shaban repository and the local skill. git diff --check passes for backend and touched book files; ordinary line-ending conversion warnings only. New files follow SDK default source inclusion, and ViewModels already references Helpers. No new base map, runtime registration, polymorphic metadata, JSON discriminator, translation or dependency is needed.

No source finding remains. Compilation and actual mapping/serialization acceptance remain owner-pending: build Helpers/ViewModels/Business/API; inspect representative SalesQuotation, SalesAgreement, Supplier/address, Staff/Timesheet, root/child Limousine and TaxAdvance detail results; confirm Id/No and all other members/defaults are present with no added tenant/audit flags. JSON declaration order can differ after inheritance; consumers should use member names. No migration/Add-Migration is needed. No screen/user-visible behavior changed, so existing in-app guides stay accurate and require no artificial new topic or text change.

Suggested commits only: backend `refactor(viewmodels): reuse lightweight detail identity bases`; documentation repository `docs(backend): adopt lightweight detail identity inheritance`. No build, test, lint/typecheck, runtime/browser verification, database/migration, commit/push/deploy or prohibited tool was run. No subagents used: one mechanical extraction with a shared contract and sequential integration is below the useful delegation gate. Status remains Implemented — source-only with owner verification pending yes.
