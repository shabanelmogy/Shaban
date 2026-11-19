| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Numeric table alignment — 2026-10-04

Owner reports Quantity in ItemRequisition View is at the edge rather than below its heading and requests the same consideration across screens. The existing shared editable-collection table is the presentation owner; no API/data/domain decision is needed. The prior owner rule already requires blue read-only numeric badges and centered numeric headings (UI14). Actual source has 17 plain value spans in five templates alongside eight existing highlight spans; this is adoption drift, not a new visual pattern.

## Frozen impact and conformance

| Concern | Classification | Owner/reference | Target |
|---|---|---|---|
| Numeric heading/plain cell | Extend existing default | UI14, shared table .is-number; numeric column flag in ItemRequisition, ItemIssue, Workshop Job/Estimate | Shared .is-number defaults to center, explicit column.align still wins |
| Numeric read-only value | Refactor existing default | UI14 value/highlight styles, actual Workshop Job/Estimate Price/Charges and requisition PR Remaining/Amount/Tax/Gross | Base value centers by default; all existing plain value consumers add existing highlight modifier |
| Editable inputs | Keep | UI27 Quantity directive/NumericFocusDirective | LTR/right numeric entry and stepping unchanged; only headings/read text centered |
| Shared dimensions/theme | Keep | 34px line, 9px inset, 12px/tabular digits, blue12% tint, weight700/radius6 highlight | Existing values, tokens, column widths and scroll ownership retained |
| Form/value/payload | Keep | Existing typed controls and read-only formatting | No new controls, value changes, calculation, API, backend or migration |
| Rule/documentation | Extend/clarify | UI14 and required skill/history | Default numeric heading/text alignment plus mandatory read-only badge adoption in every new/reviewed screen |

Scoped shared file: editable-collection-table.component.scss. Existing value consumers: Workshop Job/JobEstimation editor HTML; Stock ItemRequisition details/issue HTML; Stock ItemIssue details HTML. Headers already declare numeric:true and no numeric column with explicit start/end alignment was found in targeted application column inventory. Explicit alignment capability stays compatible; feature input styles are untouched. Shared styling changes apply automatically to all editable collection tables; unrelated DataTable/report/summary owners are excluded. Rejected alternatives: feature CSS, cell padding offsets, changing quantity values/inputs, a new badge owner.

Current dirty/shared changes are preserved. PLAN00/Phase0/1 freeze, Phase3 shared presentation and consumer adoption, Phase6 source review; backend/grid/API/action implementation skipped. Recipe drift already confirmed in this session; canonical UI14 governs; packet regeneration/semantic review pending. Source-only; owner rebuild/visual/narrow/RTL/theme acceptance pending. One bounded mechanical UI concern is simpler locally than delegation; no subagents needed.
