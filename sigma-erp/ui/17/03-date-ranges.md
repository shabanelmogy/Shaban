<!-- Part of UI block 17: see ../17-dates.md. Same status and authority as the block. -->

**A date range is one range picker on two months.** Never render two separate
From/To inputs. `selectionMode="range"` pairs with `[numberOfMonths]="2"`, so a
range that straddles a month boundary needs no paging. A list or report range
filter defaults to the **current month**, from the 1st to its last day:

```html
<p-datepicker
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
></p-datepicker>
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

**Range caret preservation (owner defect report, 2026-10-14).** Manual edits to
either range endpoint, including its year, retain their caret/selection.
Owner rejected the first render-based workaround and clarified selecting the
From year before typing. Shared protectRangeMarker previously blocked a year
selection overlapping the trailing delimiter space and moved insertText to
markerEnd (To start). Narrow a selection that includes one endpoint and part
or all of the delimiter to that endpoint before native replacement/deletion.
Keep the marker intact. Marker-only/cross-endpoint insertions remain blocked
with selection retained, while collapsed Backspace/Delete keep their deliberate
boundary skip. Select-all, history and noncancelable fallback keep their existing
handling. Remove the unsuccessful afterNextRender/display-binding workaround;
do not move focus, dispatch synthetic input or duplicate model/parser updates.
Single-date/month masks, partial text, range validators, bounds, picker and
clear remain with their existing owners. Source trace proves the prevented
beforeinput jump; exact browser selection/runtime acceptance is owner-pending.
Verify From/To word selection with/without adjacent spaces, paste/deletion,
navigation, RTL/theme/mobile and calendar/clear.

`numberOfMonths` is a **panel** property: it widens the overlay, not the field.
The range field still occupies exactly one column of the block 4 grid — do not
compensate for the second month by giving the field a larger `grid-column` span,
which would break the field distribution rule and narrow every other control.
The panel is appended to body, so the second month is never clipped by the
strip.
