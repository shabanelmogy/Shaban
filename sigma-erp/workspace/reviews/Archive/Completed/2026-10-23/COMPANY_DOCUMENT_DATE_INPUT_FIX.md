# Company document date input fallback

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

2026-10-02: Owner confirms letters remain typeable in Company document dates.
The preceding source inspection proved directive wiring, not runtime behavior;
its confirmation did not establish that all input paths were protected.

## Decision and implementation

Company Issue/Expiry Date and Driver Documents share DocumentsComponent and
DatePickerDirective. Existing key/beforeinput/paste guards prevent ordinary
text insertion but had no fallback for an actual changed input value. The exact
owner entry path is not reproduced. Keep numeric manual editing and the picker.

The shared directive now captures native input on the calendar host before
PrimeNG's target input handler executes. It checks the actual calendar input,
strips disallowed characters and restores adjusted selection offsets. Enabled,
typeable numeric inputs set Calendar.isKeydown=true so its normal onUserInput
handler parses once; installed PrimeNG source otherwise ignores input without
a preceding keydown. No manual form writes, synthetic input, parser copy or
feature handlers. DestroyRef removes the listener. Disabled/picker-only and
non-calendar inputs are skipped; existing picker/date validators remain.

## Scope and verification

Source change: shared/directives/date-picker.directive.ts. UI 1.29 block 17,
skill rule/history and changelog updated. No backend/API/schema changes or
migration. Scoped source/whitespace and book-reference checks passed.

Owner: reload the updated frontend, try Latin/Arabic letters and text paste in
Company and Driver Issue/Expiry dates; edit and paste a valid dd/MM/yyyy date,
select from the picker, clear, and confirm invalid numeric dates/order block
Save. Also check Individual dates because they consume the same directive.
No build, tests, browser automation, database commands or commits run. Generated
packets are stale; owner regeneration/semantic review pending. No agents used
for this single shared-input fix. Suggested frontend commit: fix date input
filtering before calendar parsing.

## Structured date follow-up (2026-10-02)

Owner clarified that allowing arbitrary digits still does not meet date-only
entry. Shared DatePickerDirective now offers dateInputMask for single
dd/mm/yy inputs. Both document dates opt in and show dd/mm/yyyy placeholders;
Driver Documents renders the same template. This constrains the shape, not
merely the character set: two day/month digits, four year digits, slash
separators, complete day 1–31 and month 1–12. Partial segments are editable.

The directive also provides NG_VALIDATORS: partial text is invalid, full text
must parse to a real selectable date, and invalid Date objects fail. Partial
masked input is sent once as a string through Calendar.updateModel, with its
target handler's keydown gate closed for that event; this avoids PrimeNG
interpreting a two-digit partial year as a complete date. Full input still uses
its normal parser. The existing required/date/order validators remain.

UI 1.30 block 17, skill rule/history and changelog updated. Scoped source/diff,
whitespace and book-reference checks passed; runtime remains owner-owned.
Owner should check typing 123 as unseparated day text, valid 02/10/2026,
partial 02/10/20 (Save blocked), 00/99/2026, 31/02/2026, paste/replacement,
deleting/retyping date segments, clear, picker selection and the Driver tab.
No new dependency, feature-local guard, backend contract or migration.

## All Individual/Company dates and future recipe (2026-10-02)

Owner requested the same shared component for every date in these screens, then
requested the documentation rule for future date boxes. Extend the existing
directive to MM/YYYY with the same partial-input gate and validator; require
the structured single-date binding in the recipe for future fields. Existing
consumers retain opt-in until reviewed. No new component, library or parser.

| Active field | Shared input format |
|---|---|
| Individual Birth Date, Document Issue/Expiry, Card Active Date | DD/MM/YYYY |
| Individual Card Expiry | MM/YYYY, existing month view |
| Company Document Issue/Expiry and Card Active/Expiry | DD/MM/YYYY |
| Company Driver Birth Date and reused Document Issue/Expiry | DD/MM/YYYY |

All active fields now show matching placeholders. Existing business limits,
required/order validators, clear/picker selection and date transport remain.
Month-view expiry keeps its existing first-day representation. All scoped
single fields bind dateInputMask=true without template handlers;
time/range masks are outside this change. Native PersonBase date input found
in the source inventory has no route/module import and is a legacy screen,
outside the active Individual editor. No legacy resurrection or bulk rewrite.

UI 1.31 block 17, skill checklist/history and changelog reconciled. Scoped source
and whitespace inspection completed; book-reference check passed. Generated
packets remain stale; owner regeneration and semantic review pending. No build,
test, browser, database commands or backend changes. Runtime acceptance pending.
Owner checks: type/paste valid DD/MM/YYYY and MM/YYYY; incomplete years and
invalid dates must block Save; clear/select/edit in both editors and Drivers.
Other existing consumers retain their opt-in behavior and date formats.
