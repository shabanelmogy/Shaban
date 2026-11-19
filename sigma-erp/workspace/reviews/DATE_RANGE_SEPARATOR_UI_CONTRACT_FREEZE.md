# Shared date-range separator

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Authorization | Owner asks to keep the dash between two picker dates fixed because spaces disappear during manual editing. |
| Scope | DatePickerDirective on enabled typeable numeric dash-range p-calendar inputs; shared UI17 guidance. |

Before-edit evidence: UI17 owns appDatePicker, default dd/mm/yy and Date[]/string/null range values. Workshop/Job and Customers/StatementOfAccount templates demonstrate the existing single dual-month range; shared directive owns capture-input sanitation, numeric guards and PrimeNG keydown gate. Installed PrimeNG Calendar.updateInputfield formats rangeSeparator='-' as ' - '; parseValueFromString splits on that exact string. Current directive allows deleting these spaces/dash and never normalizes them before the parser. UI27 owns editing/navigation; UI19/form and existing parseDateRange own real-date/order validation, not this separator repair.

Frozen behavior: preserve ' - ' during partial deletion/replacement of an existing range separator. Backspace/Delete at the separator skip to the adjacent date boundary; select-all replacement/deletion and an empty input remain allowed. Normalize absent/excess separator spaces before PrimeNG consumes a native input, keeping selection offsets; only the default dash range is affected. Numeric slash date formats can normalize an unspaced dash unambiguously; formats whose date punctuation also contains a dash retain the existing canonical marker and protection, without guessing compact pasted date boundaries. Capture the pre-edit range for noncancelable marker destruction and restore it if a partial edit removes the dash. Keep disabled/picker-only/single/multiple/custom-separator behavior, partial date text, form validators, min/max/order, clear/picker, API normalization and open/focus unchanged. No synthetic input, copied parser or extra form update; PrimeNG parses once after capture correction.

Root owns the small sequential shared behavior; no subagents. Applicable PHASE02 shared filter-control behavior and focused source reconciliation; no backend/domain/schema/migration/route/translation change. All eight packet drift checks passed before use. Source-only acceptance; no build/test/lint/browser/runtime/DB/migration/commit/push/deployment. No screenshot, new business rule or unresolved decision.
