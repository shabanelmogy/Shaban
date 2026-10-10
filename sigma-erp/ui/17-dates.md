## 17. Dates

> **Status: Canonical**

`p-calendar`, always appended to body with the shared panel class. **Never** use
a native `<input type="date">`. By default a Sigma calendar is typeable, carries no
icon, and keeps an invalid partial entry instead of clearing it. Editor shape:

```html
<p-calendar
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
></p-calendar>
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
date bound changes. Source-only; owner input/reload acceptance pending.

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

**Shared date picker (2026-10-01).** Put `appDatePicker` (`shared/directives/date-picker.directive.ts`) on
every `p-calendar`: it applies `dd/mm/yy`, typeable with `keepInvalid`, button bar, no icon, the
`sigma-datepicker-panel` class, `appendTo="body"`, no open on focus, and open on click. The element
then carries only what differs — `inputId`, the control, `[minDate]`/`[maxDate]`, `view="month"
dateFormat="mm/yy"`. Reference: the Individual editor. The rules below are what the directive
applies; a calendar without it repeats them by hand (UI backlog 39).

**Calendars are typeable by default (owner decision, 2026-09-28).** Use
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

Reviewed screens reuse `dateValueValidator`, `dateRangeValidator` and
`dateTimeValueValidator` from `date-utils.ts`; pair optional validators with
`Validators.required` only where the frozen contract requires a date. Nonempty ranges
need two real ordered endpoints. Typed single dates/ranges need complete four-digit years;
typed local date-time is `DD/MM/YYYY HH:mm[:ss]`, never browser-dependent month-first parsing.
`toApiDateTime` normalizes that complete local text as well as picker Dates without `Z`.
The structured picker mask and business-specific bounds retain their own roles. Workshop
is the source-inspected consumer; build/input acceptance remains owner-pending.

**Month transport.** A reviewed month picker uses `Date | string | null`,
`view="month"`, `dateFormat="mm/yy"`, the shared structured mask and
`placeholder="mm/yyyy"`. Normalize with `parseMonthValue` from
`shared/utils/date-utils.ts`: a valid local picker Date, complete `MM/YYYY`, or
complete API `yyyy-MM` becomes `yyyy-MM`. Empty, partial, malformed and out-of-range
values return null; month is 1–12 and year is 1–9999. Never coerce a short year or
copy a month parser into a feature. Use `currentMonthRange()[0]` for a current-month
picker default. Staff Overtime, Duty Schedule and Timesheet are source-inspected
consumers; their payroll and sparse-write contracts remain feature-owned.

**Shared month validation (2026-10-06, Master5 extraction gate).** Reviewed month
controls use `monthValueValidator` from `date-utils.ts`, with `Validators.required`
only when mandatory. It delegates to `parseMonthValue`, accepts an empty optional
control and returns the existing `date` validation error for invalid or partial
months and non-date/non-string values. Depreciation adopts it. Accounts report
family and Staff Timesheet retain two source-inspected local validator copies
until their own review (UI30/39); this addition does not authorize a bulk change.
The shared picker mask, current-month default, business bounds and transport
remain separate owners. Source-only; owner input/runtime acceptance pending.

**Explicit picker-only request.** When the owner requests selection without text
entry, keep `appDatePicker` and override `[readonlyInput]="true"` and
`[keepInvalid]="false"` on those calendars. Do not disable the control or filter text
keystrokes. The shared directive opens picker-only inputs with Enter, Space or
Arrow Down; panel keyboard navigation, clear action and date validators remain
available. Use this only while the owner's explicit picker-only decision applies.

**Date-only editing (owner standing decision, 2026-10-01).** Every date field
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

**Required structured single-date recipe (owner decision, 2026-10-02).** Character
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

**A date range is one range picker on two months.** Never render two separate
From/To inputs. `selectionMode="range"` pairs with `[numberOfMonths]="2"`, so a
range that straddles a month boundary needs no paging. A list or report range
filter defaults to the **current month**, from the 1st to its last day:

```html
<p-calendar
  inputId="featureDateRange"
  formControlName="dateRange"
  selectionMode="range"
  [numberOfMonths]="2"
  [readonlyInput]="false"
  [keepInvalid]="true"
  [showButtonBar]="true"
  dateFormat="dd/mm/yy"
  appendTo="body"
  panelStyleClass="sigma-datepicker-panel"
  styleClass="w-100"
></p-calendar>
```

```ts
readonly filterForm = this.fb.group({
  dateRange: this.fb.control<Date[] | string | null>(currentMonthRange()),
});
```

`currentMonthRange()` is shared (`date-utils.ts`); the rule is the owner's (2026-09-24,
"الشهر الحالي") and applies to lists **and** reports (block 20).

**Fixed dash-range delimiter (owner request, 2026-10-03).** For enabled,
typeable numeric `appDatePicker` range fields with the default dash separator,
keep the exact ` - ` delimiter (one space on each side). The shared directive
protects an existing marker from partial deletion/replacement; Backspace/Delete
at it move to the adjacent date boundary. Select-all replacement/deletion and
clear remain available. Normalize missing/excess spaces before PrimeNG's native
input parser, preserving selection offsets; slash-based date formats make an
unspaced dash unambiguous. If the date format itself uses a dash, protect its
existing spaced delimiter without guessing compact pasted boundaries. A
pre-edit snapshot restores the range and selection when a noncancelable partial
edit destroys its marker; history/select-all/empty edits remain allowed.
Single/multiple/custom-separator/disabled/picker-only fields keep their existing
behavior. Do not add local masks, synthetic input, another parser or an extra
form write: the existing capture-input guard corrects text before PrimeNG parses
once. Partial dates, validators/bounds/order, picker/clear and API transport
remain with their existing owners. Source conformance is not runtime acceptance.

`numberOfMonths` is a **panel** property: it widens the overlay, not the field.
The range field still occupies exactly one column of the block 4 grid — do not
compensate for the second month by giving the field a larger `grid-column` span,
which would break the field distribution rule and narrow every other control.
The panel is appended to body, so the second month is never clipped by the
strip.

**A calendar carries no icon (owner decision, 2026-09-28).** Never set
`[showIcon]`, on filters or in editors. The global sheet hides
`.p-datepicker-trigger` with `display: none !important` (`src/styles.scss`), so
`[showIcon]="true"` renders nothing and only leaves reserved dead padding. The
`p-calendar` host is a full-width block, so an icon-less calendar measures
exactly like a plain text input in the same column. The input is the target: a
click opens the panel, and the user can also type straight into it.

Do **not** re-show the trigger from a feature stylesheet. A
`display: inline-flex !important` override on `.p-datepicker-trigger` brings
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

**A dialog opens with its calendar overlay closed.** Bind the shell's
`[focusOnShow]="false"` on `app-editor-dialog`, and on each calendar use
`[showOnFocus]="false"` with `(click)="dateCal.showOverlay()"` (editor snippet
above). The panel then opens only on an intentional click on the input, never
while the dialog is being displayed or when focus lands on the field. Keyboard
users type the date directly, because every calendar is typeable. Do not call
the calendar input's `focus()` from `ngOnInit`, `onEditorShown`, or another
lifecycle hook. If initial focus is required in View mode, focus the shared
dialog close control instead of a calendar.

When a small dialog's first required action is choosing a date, it may open the
calendar overlay after the shared editor shell emits `shown`. Keep this opt-in
and local to that workflow; do not auto-open every calendar in the app:

```ts
@ViewChild('effectiveDateCalendar')
private effectiveDateCalendar?: Calendar;

openDatePicker(): void {
  queueMicrotask(() => {
    const calendar = this.effectiveDateCalendar;
    if (!calendar) return;
    calendar.inputfieldViewChild?.nativeElement.focus();
    calendar.showOverlay();
  });
}
```

```html
<app-editor-dialog (shown)="openDatePicker()">
  <p-calendar
    #effectiveDateCalendar
    [showOnFocus]="false"
    appendTo="body"
    ...
  ></p-calendar>
</app-editor-dialog>
```

**Check:** single date fields use shared structured DD/MM/YYYY or MM/YYYY
editing and matching placeholders; incomplete/invalid input blocks Save ·
no native `<input type="date">` · `appendTo="body"` and
`panelStyleClass="sigma-datepicker-panel"` · `[readonlyInput]="false"` with
`[keepInvalid]="true"` on every calendar, and typed values normalised to
`yyyy-MM-dd` · no `toISOString()` on a date-only value ·
`[maxDate]`/`[minDate]` where the business requires it · issue/expiry and
start/end ordering validated · no `[showIcon]` and no feature re-showing
`.p-datepicker-trigger` · dialogs bind `[focusOnShow]="false"` and calendars
use `[showOnFocus]="false"` plus `(click)` to open · any auto-open waits for
dialog `shown` and is limited to a confirmed date-first workflow · filter
calendars use the shared 34px height · a range is one `selectionMode="range"`
picker with `[numberOfMonths]="2"`, occupying exactly one grid column, and a
list or report range defaults to the current month · no `toISOString()` on any API date or date-time; `toApiDate`/`toApiDateTime`/`formatDisplayDate` from `date-utils.ts`.

---
