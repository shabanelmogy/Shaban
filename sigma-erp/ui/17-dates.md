## 17. Dates

> **Status: Canonical**

`p-calendar`, always appended to body with the shared panel class. **Never** use
a native `<input type="date">`. Every Sigma calendar is typeable, carries no
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

Display format is `dd/mm/yy` in the picker and `dd/MM/yyyy` in tables:

```html
{{ agreement.startDate | date: 'dd/MM/yyyy HH:mm' }}
```

When the calendar is inside a canonical filter boundary from block 4, its
wrapper and input consume `--sigma-filter-control-height`. Do not add a
feature-local filter-calendar height.

**Every calendar is typeable (owner decision, 2026-09-28).** Use
`[readonlyInput]="false"` on filters **and** on detail/editor forms. The user
types `dd/mm/yy` straight into the box and opens the picker only when they want
to browse. Always pair it with `[keepInvalid]="true"`: without it, PrimeNG's
blur handler (`updateInputfield()`) clears any text that does not match its
internal format, so a half-typed or range value disappears when the user
clicks Search or Save. Type the control as `Date | string | null` (a range as
`Date[] | string | null`) and normalise it before sending, through
`parseDateValue()` / `parseRangeString()` helpers that accept `dd/MM/yyyy`,
`dd-MM-yyyy`, and `yyyy-MM-dd` and emit `yyyy-MM-dd` for `FilterHelper.GetDate`.
Keep `dateFormat="dd/mm/yy"` everywhere, so what the user types is what the box
shows. Minimum and maximum dates, plus start/end ordering, are still validated
in the form and on the backend.

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
private getDefaultDateRange(): Date[] {
  const now = new Date();
  return [
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  ];
}
```

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

**Date-only values must not go through `toISOString()`.** It converts local time
to UTC, which changes the calendar date whenever the local offset is **ahead of
UTC** — exactly the region this app runs in.

`new Date(2024, 0, 15)` is local midnight. In Dubai (UTC+4) that is
`2024-01-14T20:00:00Z`, so `toISOString().split('T')[0]` yields **`2024-01-14`**
— a day early. In Cairo (UTC+2) it yields the same. A negative offset such as
UTC−5 happens to survive, which is why the bug hides in some environments and
not others.

Build from local parts instead:

```ts
private toDateInput(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') {
    const dateOnly = /^(\d{4}-\d{2}-\d{2})/.exec(value);
    if (dateOnly) return dateOnly[1];
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

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

**Check:** no native `<input type="date">` · `appendTo="body"` and
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
list or report range defaults to the current month.

---

