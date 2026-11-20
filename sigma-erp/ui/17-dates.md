## 17. Dates

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Month transport and shared month validation](17/01-month-pickers.md)
- [Date-only editing and the structured single-date recipe](17/02-single-date-entry.md)
- [Range picker, dash delimiter and caret preservation](17/03-date-ranges.md)
- [Dialogs open with the calendar overlay closed](17/04-dialog-calendars.md)

**Calendar-day difference.** Reuse
`calendarDaysBetween(from, to)` from `shared/utils/date-utils.ts` when a frozen
feature counts whole local calendar dates. Inputs are validated Date values;
the helper constructs UTC calendar stamps with setUTCFullYear, avoiding both
daylight-saving elapsed-hour shifts and Date.UTC's remapping of years0–99.
Keep the feature's own minimum-day/time-order/financial policy; the helper does
not authorize a different billing duration, timezone conversion or rounding.

**PrimeNG21 compatibility.** Import `DatePicker`/`DatePickerModule`
from `primeng/datepicker` and use `<p-datepicker appDatePicker appendTo="body">`.
The component's `appendTo` is a signal input: bind it in the consumer template;
the shared directive must not overwrite the signal or write the removed
`filled` state. Preserve the shared parser, partial numeric editing, structured
masks, local-date transport and range caret contract below. CSS targets the
actual panel/day/month hooks in UI24, not obsolete Calendar markup.
Read the disabled input's signal value, not the function object. Shared picker
guards also inspect the native input's disabled state so ControlValueAccessor
form disabling is respected without reading private widget state. Mock-data
availability checks retain the Angular control's disabled gate and read public
number/date/checkbox disabled() values.

Native text clear must not own a raw DatePicker: the publisher input handler
ignores synthetic input without preceding keydown state. Legacy raw editable
consumers use the publisher showClear action, which updates the CVA, while
GlobalInputClearService excludes raw DatePicker inputs. The appDatePicker adapter
already prepares input in capture, including when numeric restriction is off;
retain its generic-clear and mobile/drop behavior without synthetic keydown or
duplicate value accessors. Preserve readonly/disabled and explicit clear choices.
An empty adapted input delegates to publisher clear() and emits the existing
input event once, yielding null through the CVA even with keepInvalid=true.
Nonempty partial input retains its original validation/editing contract.

> **Status: Canonical**

`p-datepicker`, always appended to body with the shared panel class. **Never** use
a native `<input type="date">`. By default a Sigma calendar is typeable, carries no
icon, and keeps an invalid partial entry instead of clearing it. Editor shape:

```html
<p-datepicker
  #dateCal
  inputId="field-date"
  formControlName="date"
  dateFormat="dd/mm/yy"
  [readonlyInput]="false"
  [keepInvalid]="true"
  [showButtonBar]="true"
  [showOnFocus]="false"
  (click)="dateCal.showOverlay()"
  [maxDate]="today"
  appendTo="body"
  panelStyleClass="sigma-datepicker-panel"
  styleClass="w-100"
  [placeholder]="'feature.date' | translate"
></p-datepicker>
```

Display format is `dd/mm/yy` in the picker and `dd/MM/yyyy` (`dd/MM/yyyy HH:mm` with time) in
tables. A grid column uses `type: 'date'` or `type: 'dateTime'` (block 5); other text uses
`formatDisplayDate(value, withTime)`.

**Hydrate saved calendar dates through the shared owner.** Use
`toPickerDate(apiDate)` from `shared/utils/date-utils.ts` to turn a saved API
date or date-only filter URL value into the `Date` expected by PrimeNG's picker.
It validates the first calendar-date segment with `parseDateValue`, creates a
local year/month/day and returns null for missing/invalid values. Keep typed
editing as `Date | string | null`; restoring a saved value is a separate step
from parsing manual text or building date-only transport. Range restoration
uses two hydrated Dates after validating both endpoints. Do not patch raw ISO
strings into a masked picker or use UTC conversion/private hydration parsers.
The existing `partnerPickerDate` compatibility wrapper delegates to this same
algorithm without changing its callers. Equipment Rental adopts the neutral
helper after source review found repeated picker hydration in its editors and
route restoration. Date-time controls retain their own wall-clock contract;
this helper represents a calendar day only. Source-only; owner reload/typing/
route/visual acceptance and compilation remain pending.

Full calendar years (2026-10-09 Lease tariff follow-up): `parseMonthValue`
accepts backend-supported years 0001..9999. Shared saved-day construction uses
`setFullYear` instead of the multi-argument Date constructor, which coerces
years 00..99 to 1900..1999. `parseDateValue` validates the same actual local
year/month/day; `toPickerDate` retains it, and date transport/display pads the
year to four digits. Existing two-digit manual-year normalization stays
compatible; year zero remains invalid. No timezone conversion or business
date bound changes.

Transportation continuation (2026-10-09): the same full-year invariant applies
to month boundaries, not only saved-day hydration. `currentMonthRange(date)`
uses `setFullYear` for its local first/last days and retains midnight; it must
not reintroduce the Date constructor's 1900 offset for years 0001..0099.
TripSheet hydrates the parsed month through `toPickerDate(month + '-01')`,
shifts with `setMonth`, validates the destination with `parseMonthValue`, and
uses `currentMonthRange` for the request boundaries. Moving outside 0001..9999
does not submit a request. Current-year defaults, local transport, picker
grammar and business bounds stay unchanged. Source-only; owner compilation,
manual month/route navigation and API-date acceptance remain pending.

When the calendar is inside a canonical filter boundary from block 4, its
wrapper and input consume `--sigma-filter-control-height`. Do not add a
feature-local filter-calendar height.

**Shared date picker.** Put `appDatePicker` (`shared/directives/date-picker.directive.ts`) on
every `p-datepicker`: it applies `dd/mm/yy`, typeable with `keepInvalid`, button bar, no icon, the
`sigma-datepicker-panel` class, `appendTo="body"`, no open on focus, and open on click. The element
then carries only what differs — `inputId`, the control, `[minDate]`/`[maxDate]`, `view="month"
dateFormat="mm/yy"`. Reference: the Individual editor. The rules below are what the directive
applies; a calendar without it repeats them by hand (UI backlog 39).

**Calendars are typeable by default.** Use
`[readonlyInput]="false"` on filters **and** on detail/editor forms. The user
types `dd/mm/yy` straight into the box and opens the picker only when they want
to browse. Always pair it with `[keepInvalid]="true"`: without it, PrimeNG's
blur handler (`updateInputfield()`) clears any text that does not match its
internal format, so a half-typed or range value disappears when the user
clicks Search or Save. Type the control as `Date | string | null` (a range as
`Date[] | string | null`) and normalise it before sending with the shared
`parseDateValue(value)` / `parseDateRange(value)` from `shared/utils/date-utils.ts`
(2026-10-01). They accept a picker `Date`/`Date[]` or typed `dd/MM/yyyy`, `dd-MM-yyyy`,
`yyyy-MM-dd` (a range also `from - to`, `to`, `إلى` or a comma) and emit `yyyy-MM-dd` for
`FilterHelper.GetDate`. The private copies in Work Order and Labour Activities Report are
removed in their reviews.
Keep `dateFormat="dd/mm/yy"` everywhere, so what the user types is what the box
shows. Minimum and maximum dates, plus start/end ordering, are still validated
in the form and on the backend.

**Picker bounds reflect existing date-order rules.** When a
document already requires expiry strictly after issue, bind expiry minDate to
issue plus one local calendar day and issue maxDate to expiry minus one day.
Inclusive picker bounds therefore exclude equality as well as reversed dates.
Use existing real-date validation and shared local parser/hydration before
deriving a limit; absent/invalid/partial opposite input imposes no derived
bound. Preserve the form/group and server validators, manual editing, existing
invalid values and payloads. Do not invent today/future restrictions or apply
strict ordering to a workflow that allows equality. Shift with local setDate,
not UTC/millisecond arithmetic; keep bound Date references stable for unchanged
source days so publisher setters do not rebuild months on unrelated changes.
Company Documents and its existing Driver reuse adopt this parity. Actual
picker/typing/clear/month-boundary/RTL/theme acceptance remains owner-pending.

Reviewed screens reuse `dateValueValidator`, `dateRangeValidator` and
`dateTimeValueValidator` from `date-utils.ts`; pair optional validators with
`Validators.required` only where the frozen contract requires a date. Nonempty ranges
need two real ordered endpoints. Typed single dates/ranges need complete four-digit years;
typed local date-time is `DD/MM/YYYY HH:mm[:ss]`, never browser-dependent month-first parsing.
`toApiDateTime` normalizes that complete local text as well as picker Dates without `Z`.
The structured picker mask and business-specific bounds retain their own roles. Workshop
is the source-inspected consumer; build/input acceptance remains owner-pending.

**Explicit picker-only request.** When the owner requests selection without text
entry, keep `appDatePicker` and override `[readonlyInput]="true"` and
`[keepInvalid]="false"` on those calendars. Do not disable the control or filter text
keystrokes. The shared directive opens picker-only inputs with Enter, Space or
Arrow Down; panel keyboard navigation, clear action and date validators remain
available. Use this only while the owner's explicit picker-only decision applies.

**A calendar carries no icon.** Never set
`[showIcon]`, on filters or in editors. The global sheet hides
`.p-datepicker-dropdown` with `display: none !important` (`src/styles.scss`), so
`[showIcon]="true"` renders nothing and only leaves reserved dead padding. The
`p-datepicker` host is a full-width block, so an icon-less calendar measures
exactly like a plain text input in the same column. The input is the target: a
click opens the panel, and the user can also type straight into it.

Do **not** re-show the trigger from a feature stylesheet. A
`display: inline-flex !important` override on `.p-datepicker-dropdown` brings
back a separate `36px` button beside the input, which splits the control in two
and breaks the strip's field distribution. Backlog 32 tracks removing the
existing `[showIcon]` attributes.

**Shared transport helpers (`shared/utils/date-utils.ts`).** Sigma stores dates as local
wall-clock time and the backend converts no timezone, so **no date or date-time goes through
`toISOString()`** (it appends `Z` and shifts the value by the UTC offset: 10:00 saved in Dubai
reads back as 06:00). Use `toApiDate(value)` → `yyyy-MM-dd`,
`toApiDateTime(value)` → `yyyy-MM-ddTHH:mm:ss` (no `Z`), and `formatDisplayDate(value,
withTime)` → `dd/MM/yyyy[ HH:mm]` for grid `value` functions and exports. Do not add feature
copies of these helpers.

**Date-only values must not go through `toISOString()`.** It converts local time
to UTC, which changes the calendar date whenever the local offset is **ahead of
UTC** — exactly the region this app runs in.

`new Date(2024, 0, 15)` is local midnight. In Dubai (UTC+4) that is
`2024-01-14T20:00:00Z`, so `toISOString().split('T')[0]` yields **`2024-01-14`**
— a day early. In Cairo (UTC+2) it yields the same. A negative offset such as
UTC−5 happens to survive, which is why the bug hides in some environments and
not others.

Use the shared `toApiDate(value)` — it builds the date from local parts and keeps a
`yyyy-MM-dd` string unchanged. Do not write a private copy (`toDateInput`, `formatApiDate`).

Validate ordering in the UI as well as the backend, e.g.
`validationMessages.expiryAfterIssueDate` for issue/expiry pairs.

**Check:** single date fields use shared structured DD/MM/YYYY or MM/YYYY
editing and matching placeholders; incomplete/invalid input blocks Save ·
no native `<input type="date">` · `appendTo="body"` and
`panelStyleClass="sigma-datepicker-panel"` · `[readonlyInput]="false"` with
`[keepInvalid]="true"` on every calendar, and typed values normalised to
`yyyy-MM-dd` · no `toISOString()` on a date-only value ·
`[maxDate]`/`[minDate]` where the business requires it · issue/expiry and
start/end ordering validated · no `[showIcon]` and no feature re-showing
`.p-datepicker-dropdown` · dialogs bind `[focusOnShow]="false"` and calendars
use `[showOnFocus]="false"` plus `(click)` to open · any auto-open waits for
dialog `shown` and is limited to a confirmed date-first workflow · filter
calendars use the shared 34px height · a range is one `selectionMode="range"`
picker with `[numberOfMonths]="2"`, occupying exactly one grid column, and a
list or report range defaults to the current month · no `toISOString()` on any API date or date-time; `toApiDate`/`toApiDateTime`/`formatDisplayDate` from `date-utils.ts`.

---
