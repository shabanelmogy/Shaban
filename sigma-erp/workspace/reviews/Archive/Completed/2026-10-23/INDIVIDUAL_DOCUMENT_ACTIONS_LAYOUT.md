# Individual Documents — International beside Remove

| Field | Value |
|---|---|
| Date | 2026-10-01 |
| Contract | Frozen: Is International in the row action group; wider Attachment |
| Implementation | Complete; source-only |
| Owner verification pending | yes |

Individual projects Is International beside Remove through the existing action
directive/group and removes the standalone International column. Attachment grows
from 220px to 280px; Document Type stays 240px. The same checkbox control remains
in the document FormGroup/payload, with translated accessible name and title.
Remove still calls EditableRows.requestRemove (existing confirmation rules).

Owner follow-up: reduce Document No slightly. Its existing shared column width
option now sets 140px. Other widths and row behavior remain as above; visual
acceptance is pending. This is a feature sizing choice, not a new shared rule.

Owner follow-up: narrow Issued By to 120px and increase checkbox/Remove spacing.
Individual sets action width 100px and row-action gap 12px using shared host CSS
variables; existing consumers keep 74px/5px defaults. UI 1.19/block 14, changelog
and skill document this sizing extension. Source diff/whitespace review and book
reference check passed; visual acceptance remains pending.

Latest owner follow-up: dates use fixed 130px columns and picker-only entry
(`readonlyInput=true`, `keepInvalid=false`). Issued By is now 150px. The visible
translated International caption wraps its checkbox in the shared row-check label;
Actions grows to 210px with the existing 12px button gap. The table minimum is
1280px (sum of declared columns), preserving shared internal horizontal overflow.
UI 1.20/blocks 14 and 17 and the skill record the labelled checkbox and explicit
picker-only exception. Date validators, file handling and row mutation stay intact.
Shared appDatePicker also opens picker-only inputs with Enter, Space or Arrow Down;
the installed PrimeNG input key handler alone does not open a closed panel.
Source diff/whitespace and book-reference checks passed; owner visual/keyboard
acceptance remains pending. No build or browser verification run.

Final owner clarification supersedes the combined action group: Is International
is its own 136px column heading above the checkbox, after Attachment; Actions
heads the delete button alone at the shared 74px default. View keeps the data
column and hides Actions. Table minimum stays 1280px, matching the declared widths;
date/Issued By/Attachment choices are unchanged. UI 1.21/block 14 and the skill
record the separate-heading rule. Source reconciliation and whitespace/reference
checks passed; browser/build acceptance remains owner-pending.

Card layout follow-up: owner requested fixed Card Type dropdown width. The
Individual card column now uses the existing shared `width: '180px'` option;
the table owns fixed layout/colgroup and label clipping (UI 14). Other card
columns remain flexible within the existing 1280px table minimum. Source-only;
scoped diff/whitespace review passed, visual acceptance pending. No new shared
rule, payload or validation change.

Card date follow-up: Active Date and Expiry remain manually editable and keep
their calendar picker. Both opt into shared appDatePicker dateNumericInput,
which rejects inserted/pasted non-digit/non-slash text before Calendar changes
the value; partial numeric dates remain visible for editing and existing date
validators reject invalid dates. Formats stay dd/mm/yyyy and mm/yyyy respectively.
Document dates retain the owner's separate picker-only decision. Shared guard is
opt-in; other calendars keep their existing entry behavior. Source-only review;
owner typing/paste/picker acceptance pending.
Scoped source diff/whitespace checks and Check-BookReferences passed. Installed
TypeScript DOM types support InputEvent.dataTransfer. No build, tests or browser
run; no backend, API, schema or payload changes.

Latest owner decision supersedes picker-only Documents: Issue Date and Expiry
Date now use the same shared dateNumericInput as Cards. Removed readonlyInput
and keepInvalid overrides, restoring shared manual editing/partial-entry defaults.
Digits/slashes and picker selection are allowed; text insertion/paste is rejected.
The minimum expiry and all validators remain. UI 1.23/block 17 and skill history
reconcile the reference; source-only, owner browser acceptance pending.

Shared actionsVisibleInView is opt-in: colgroup/header/body/empty colspan agree,
and row data remains visible in View. The checkbox inherits the disabled form;
Remove is hidden in View. Default Remove always requires editable. Existing
consumers retain the default behavior. Shared checkbox size/accent now cover the
row-actions group while standalone checkbox cells retain their vertical margin.

Files: Individual details template/TypeScript and shared editable-table
template/TypeScript/SCSS. UI 1.18/block 14, changelog and skill updated together.
No new translation, backend/API, validation, calculation, schema or migration.
Existing UI type 03/Backend Pattern 2; phases discovery/contract, detail layout,
shared integration and source reconciliation; backend/domain-action phases N/A.

Generated packets remain stale; canonical books used, regeneration/semantic
review pending. Prior user edits preserved; no subagents for this small change.
No build, test, lint, browser/runtime, SQL, migration, commit or deployment run.
Owner checks populated/empty Create/Edit/View, checkbox persistence, confirmed
Remove, attachment width and narrow/RTL layout.

Suggested frontend commit: `style(individual): group document flag with actions`.
Suggested documentation commit: `docs(ui): preserve projected row data in view`.
