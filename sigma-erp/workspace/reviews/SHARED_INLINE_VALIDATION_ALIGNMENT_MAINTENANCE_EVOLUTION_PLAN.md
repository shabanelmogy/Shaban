# Shared inline validation alignment

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner asks to generalize the correction after screenshot123333333333333333333333333333.PNG shows Prepaid Expense controls misaligned when one cell shows a wrapped error. This is a shared presentation amendment, not new validation logic. Screenshot evidence is functional; retain approved UI14/19 owners and do not copy image layout. Initial all8 recipe checks passed; PLAN-00/PHASE-03 and applicable canonical UI14/19 read. Master1/4/5/7/8 govern proportional scope, conformance, shared reuse, guide and packet maintenance.

## Inventory / impact / decision

EditableCollectionTable stylesheet already top-aligns all cells in rows containing app-field-error or app-file-field, gives Remove the shared34px control height, and offsets standalone15px checkboxes against that first control line. Rows with existing `.sigma-field-error` markup are omitted from all three selectors. PrepaidExpense uses that existing feedback class below one dropdown, causing global middle alignment to center different-height cell contents. Global styles.scss middle!important remains the owner for ordinary tables. Shared-screen-guidance incorrectly describes all editable feedback as centered and needs reconciliation.

| Owner | Decision | Target |
|---|---|---|
| Shared editable row stylesheet | Extend | Add existing `.sigma-field-error` to the three established row predicates |
| FieldError component / UI19 | Keep | Canonical new feedback component remains preferred; no duplicated messages or feature-local styling |
| Global table defaults / reports | Keep | Ordinary rows and reports retain middle alignment |
| Feature rows and validators | Keep | No screen opt-in, form/value/translation/API/backend changes |
| UI14 + skill | Extend | Record the compatibility marker in the existing stable-row rule |
| Shared UserGuide | Correct | Explain first-control-line alignment and feedback expanding underneath |

Options: per-screen padding or fixed error space rejected because it duplicates shared geometry and clips/wastes wrapped-message space; whole-application top alignment rejected because it changes ordinary tables; extending the existing form-row exception selected. No material missing business decision. Exact contract is frozen in SHARED_INLINE_VALIDATION_ALIGNMENT_UI_CONTRACT_FREEZE.md. No schema/migration, backend or type/route/DI change. This bounded CSS + documentation path is tightly sequential, so no subagent. Source-only diff/cascade checks; owner visual verification pending for legacy and canonical errors, long messages, actions/flags, no-error rows, RTL/themes/narrow widths and scrolling.
