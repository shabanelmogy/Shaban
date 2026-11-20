<!-- Part of UI block 17: see ../17-dates.md. Same status and authority as the block. -->

**Date-only editing.** Every date field
allows manual date editing or picker selection, and rejects arbitrary text.
`appDatePicker` enables `dateNumericInput` by default; no per-field opt-in is
required. Its shared insertion/paste/key guards accept digits and the configured
numeric date separators, with the space/hyphen separator for ranges and
space/colon for time. A 12-hour time also allows its AM/PM marker characters.
Editing/navigation keys and shortcuts remain available. Keep `keepInvalid=true`
so partial numeric dates survive editing; the calendar parser and form validators
still enforce real dates, range ordering and business limits. Character filtering
does not replace date validation. The shared directive also captures native
`input` before PrimeNG's handler, strips disallowed characters and preserves the
caret if insertion bypassed the preventive guards. PrimeNG's keydown gate is
enabled for that input event so paste/drop/mobile editing reaches its normal
parser once. Scope this to the calendar's actual text input, skip disabled and
picker-only fields, and remove the listener on destroy. Do not repair only the
visible text after PrimeNG has already stored it in the form.
Use numeric date formats; never add feature-local
keyboard guards or disable filtering to allow arbitrary text. The existing
Companies/Driver and Individual date fields consume the shared directive;
legacy calendars without it adopt it during their screen review (UI backlog 39).

**Required structured single-date recipe.** Character
filtering alone does not constrain a date's shape. Every new or reviewed date
field uses `appDatePicker`; bind `[dateInputMask]="true"` for single
`dd/mm/yy` and `mm/yy` calendars without time. This is the required recipe for
future date fields; the directive retains opt-in behavior for existing consumers
until their screen review. Show `placeholder="dd/mm/yyyy"`
or `placeholder="mm/yyyy"` to match the configured format. Do not add a local
mask, native date input or per-feature input handlers.
The shared guard limits day/month to two digits and year to four, requires `/`
between parts, rejects complete day/month values outside 1–31/1–12, and restores
the prior value for invalid insertion that cannot be canceled. Separators are
typed by the user; the directive does not insert them automatically. Partial
edits remain strings and invalid until a complete real `DD/MM/YYYY` or `MM/YYYY`
value is entered. Angular validation prevents PrimeNG's short-year parsing from
turning a partial year into a valid saved date. Clear and picker selection keep
their normal behavior; month-view expiry retains its existing first-day storage.
Individual Birth/Document/Card dates and Company Card/Document/Driver dates use
this same shared implementation. Driver Documents reuses Company Documents.
Date order and other business validators remain on the form. Time/range fields
retain the shared character guard and their existing real-date/order validation;
the single-date mask does not define a time or range grammar. Legacy fields
without `appDatePicker` adopt it during their screen review, without a bulk rewrite.
