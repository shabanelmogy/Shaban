# Limousine Tariff access handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Limousine/limousineTariff/**` |
| Frozen contract | `reviews/Authorization/LIMOUSINE_TARIFF_ACCESS_CONTRACT_FREEZE.md` |

## Request and permission mapping

| Surface or request | Requirement | Source classification |
|---|---|---|
| Base scope and `LimousineTariff.GetTariffs` | `LimousineTariff.GetTariffs`, `Location.Lookup`, `VehicleType.Lookup`, `Currency.GetFinancialNumberPolicy` | Direct operational/policy reads; no new tariff cache |
| Corporate scope and `Customer.Lookup` | Base requirements plus `Customer.Lookup` | Customer uses its existing `ReferenceLookupBindings` bootstrap/watch owner |
| Snapshot save (`LimousineTariff.EditList`) | Current-scope read requirements plus `LimousineTariff.EditList` | Complete-scope snapshot writer; no fabricated create/update/delete grants |

`GetTariffs`, the routed required lookup bootstrap, and `EditList` retain the
page-level loading owner. `ReferenceLookupStatusComponent` remains the lookup
bootstrap/watch feedback owner. Existing lookup/policy cache and invalidation
owners are retained; the tariff read remains direct.

## Access and lifetime behavior

- The mounted editor stays present on denied access or context replacement, but
  is hidden and inert; its existing draft is retained and fields are disabled.
- Base and Corporate reads are separately checked. A view-only user may move to
  either authorized destination scope, while edits, row changes, and save need
  the current-scope write requirement.
- In-flight reads, lookup bootstrap/watch work, and row/discard confirmations
  cancel on denied access or context replacement. All open PrimeNG Select
  overlays are closed when access/context is revoked.
- A clean editor can bootstrap again after permission regrant. A dirty draft is
  not overwritten. Scope changes capture the access context and recheck the
  destination requirement after the discard decision.
- Failed or empty protected reads settle into their existing Retry state; they
  are never replayed merely because a loading signal finalizes. Only an
  interrupted read is restored once after same-context regrant, and explicit
  scope changes or Retry remain the other read initiators.
- A sent `EditList` write is not cancelled. Its local result handling and global
  interceptor publication use `CAN_PRESENT_API_OUTCOME`, so a revoked/context-
  expired write cannot publish stale UI output. A permitted successful save
  refreshes the complete-scope snapshot before returning to editable state.

## Pending owner verification

No build, tests, lint, browser/application checks, database work, migrations,
or measured performance checks were run under the source-only boundary. Owner
verification should exercise base/corporate read-only navigation, write revoke
during an open Select/confirmation, regrant with clean versus dirty drafts,
and a sent save whose permission or context expires before completion. The
source regression specification at
`limousine-tariff-editor.access.spec.ts` covers a failed `GetTariffs` request
that settles without an automatic replay; execution remains pending.

## Root integration follow-up

Root restored cancelled lookup bootstrap even for a dirty retained draft, while
keeping tariff data reload blocked for that draft. Sent-save finalization also
resumes genuinely missing bootstrap. The Corporate tab is hidden without its
read requirements, and global write outcomes include the working-context
revision. A second unexecuted behavioral specification covers dirty regrant.
Final integrated source/template parsing covered 43 files with zero syntax
diagnostics; no compilation, tests or runtime acceptance is claimed.
