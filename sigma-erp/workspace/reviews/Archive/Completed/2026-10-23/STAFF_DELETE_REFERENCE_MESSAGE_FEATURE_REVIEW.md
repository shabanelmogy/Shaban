| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Staff delete reference message — implementation review, 2026-10-03

## Result and scope

Shared deletion messages now resolve the actual matched entity category for a business FK declared on an inheritance base. A Company/IndividualPartner/Supplier referencing Staff through Partner.SalesPersonId is therefore labelled companies/individual customers/suppliers instead of the opaque Partner CLR name. Partner and the concrete categories have English and Arabic resources. The implementation does not establish which saved row caused the owner's original failure; that remains owner data/runtime verification.

Contract: [STAFF_DELETE_REFERENCE_MESSAGE_CONTRACT_FREEZE.md](<../../../STAFF_DELETE_REFERENCE_MESSAGE_CONTRACT_FREEZE.md>), including the owner `كمل` continuation after the concurrent-write report. No screenshot was supplied; the quoted failure is explicit written evidence. No Missing business decision was invented. Real references remain blockers; no links/data were removed.

## Files changed by this task

- `SigmaBackend/SiGma.Business/Services/Bases/Service.cs`: InUseAsync consumes ReferencingTableAsync/ReferencingTableCoreAsync metadata; leaf types keep AnyAsync and inherited types load at most one matching row untracked, resolving FindRuntimeEntityType with declared metadata fallback.
- `SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`: eight Entity labels, Partner/MemberPartner/Company/IndividualPartner/Customer/Supplier/Driver/Contact.
- Canonical BE8 and BE0 version0.76, documentation CHANGELOG, required skill checklist/history: synchronized reusable concrete-category rule.
- Generated packets: regenerated through Generate-SigmaRecipes.ps1, not hand edited; current source fingerprints check successfully.
- This review and its separate frozen contract under `F:/My Work/Sigma/reviews`.

Concurrent CheckUnique service/resource/book/skill changes and pre-existing Staff/Sales/report work are preserved and are not claimed as this task's implementation. Existing migrations/model snapshot were not edited. No application frontend files changed.

## Decisions and final conformance

| Concern / decision | Owning block / reference | Final source evidence | Reconciliation |
|---|---|---|---|
| Backend shape | BE8/14; PurchaseOrderService.RemoveAsync | StaffService.RemoveAsync still delegates to RemoveWithChildrenAsync with address/documents/eligibilities/salary/bank accounts | Existing aggregate soft-delete behavior retained; one successful graph save, EF implicit transaction |
| Inheritance exclusion | BE8; Service.InUseAsync | IsBaseLinking/owned/composite/type/owned-model exclusions unchanged | Same row's inheritance link still excluded; Partner.SalesPersonId remains a real business reference |
| Concrete category | BE8; Service.TableName | ReferencingTableCoreAsync uses runtime EF entity metadata only for hierarchies and returns metadata, never saved row contents | Fix shared, no per-Staff reference list or bypass; leaf AnyAsync preserved |
| Translations | BE8 | Each of the eight new keys occurs exactly once with a nonempty value in both valid resx XML documents | English/Arabic parity verified; existing RecordInUse retained |
| Error ownership/recovery | UI9/22; ConfirmationDialogService/errorInterceptor | Staff deleteRecord uses deleteStaff, catches HTTP failure and finalizes busy/global loading; isSuccess false retains row | One global error dialog; successful action refreshes current applied query and moves back when deleting last row of a later page |
| Development details | UI22; ApiErrorDialogService.read | showTechnicalDetails remains !environment.production | Existing environment-controlled presentation; does not explain or alter delete eligibility |
| Contract/schema | Master4/7 | DELETE Staff?id= and Result are unchanged; no entity/configuration/DTO/map change in this task | No Add-Migration required; no grid/ListVM, form, route/provider or domain-calculation change |

Action state remains live -> soft deleted only when unused. Target lookup remains tenant-scoped; this task does not widen/narrow the existing referencing-row predicate. Authentication remains existing Authorize behavior; no permission API was introduced. There are no new service/controller overrides or AutoMapper decisions. Shared-extraction gate: existing Service.InUseAsync owns the correction for all direct callers; no feature copy was introduced.

## Source verification and limits

Repository root verified as `F:/My Work/Sigma/SigmaBackend`; complete diffs for the three affected application files reviewed separately from the documentation repository `F:/My Work/Shaban Documents/Shaban`. Concurrent uniqueness and unrelated resource hunks were inspected and preserved. Scoped diff --check passed; no merge markers or stale replaced helper names. Installed EF Core10.0.9 XML confirms FindRuntimeEntityType and IEntityType.GetDerivedTypes are available. Resource XML and key checks passed. Final canonical source/skill/history comparisons match the scoped code. Generated packets were semantically checked for the existing phase ownership/deletion/error/reference contracts after regeneration; templates/manifest were not changed by this task.

Build/runtime/browser/database verification is pending. Hierarchy matching now materializes one untracked row instead of an existential query; SQL translation, inheritance joins and query cost need owner verification. Ordinary non-hierarchy queries retain AnyAsync. Existing check-then-save race semantics are unchanged; no concurrency guarantee is claimed. The specific saved Staff relationship causing the report is Uncertain without runtime/data evidence, and this is not a claim that a referenced staff member can now be deleted.

Phases applied:0 scoped evidence,1 contract freeze,4 message correction,6 final source reconciliation. Phases2/3/5 implementation skipped because list/editor/wiring contracts are unchanged. No PLAN-00 required for this bounded correction with preserved business behavior. No agents used: one shared helper and two resources do not form independent workstreams; delegation would add coordination cost.

Prohibited commands were not run: no build, test, lint, migration, database command, browser/application verification, Sigma MCP, Graphify, commit, push or deployment.

## Owner verification

1. Compile and restart the backend, then retry the reported Staff deletion. A real Company/Individual/Supplier SalesPerson reference must still block, with the actual category shown in the selected language.
2. Confirm an unused Staff whose only rows are its owned records can be deleted; the inheritance rows themselves must not block.
3. Confirm a Staff referenced by another Staff (Reporting To), an operational/financial row or a user remains blocked, and the list retains its row after failure.
4. Check one ordinary leaf-type blocker and English/Arabic output. Development details appears only in the current non-production frontend environment.

Suggested backend commit (only this task's helper and resource hunks): `fix(delete): show concrete referencing entity labels`

Suggested documentation commit (only this task's documentation/skill/packet hunks): `docs(backend): document concrete delete reference labels`
