# Rental Tariff authorization handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Rental Tariff list, dialog editor, and service write outcomes |

## Applied authorization mapping

| Surface or request | Requirement and behavior |
|---|---|
| Vehicle-type list | `VehicleType.View` and `Tariff.GetEditor` |
| Tariff-card option read | `TariffCard.GetEditorOptions` alongside editor read access |
| `Tariff.GetEditor` | `Tariff.GetEditor` and `TariffCard.GetEditorOptions`; type/card changes remain reads, including in dialog view mode |
| Save | The editor response resolves create versus update: create requires `Tariff.Create`; an existing selection requires `Tariff.Update`, in each case with the read requirements |
| Branch settings | Receives the parent list requirement so its mounted draft and access state stay under the list contract |

## Source reconciliation

The list hides and cancels its reads on revoked list access. The editor preserves its mounted draft while revocation blocks its body portal, cancels reader and confirmation lifetimes, closes appended selects, and restores eligible reads after regrant. Read-only users may change the type/card selector to load another authorized tariff, while tariff fields and editable collection actions remain disabled. Sent writes retain their own outcome lifetime and do not publish after the write requirement expires.

Only source inspection and scoped static checks are authorized for this slice. Build, tests, lint, browser validation, and backend/runtime authorization enforcement verification remain pending owner acceptance.
