# Inline feedback row presentation contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Shared owner: src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.scss. All existing consumers inherit the change without a new input. Predicate for the established first-control-line exception becomes `tbody tr:has(app-field-error, .sigma-field-error, app-file-field)` in all three rules: td vertical-align top!important, generated Remove height/min-height --sigma-editor-control-height with34px fallback, and direct standalone checkbox logical block offset centered against that control height. Existing wrappers, table/cell display, padding, fonts, horizontal alignment, row identity, action guards and scroll owner stay unchanged. Errors retain natural multiline height below controls; no hiding/truncation/fixed error height or detached feedback.

UI14 owns this exact shared row geometry. UI19 keeps app-field-error as the canonical new markup; compatibility detection does not authorize new handwritten errors. Ordinary rows/headers/empty cells keep UI6/global middle default. No domain/form/DTO/API/data change, permissions or migration. Existing Settings UI06/financial collection consumers keep their owning fields and actions. Shared guide EN/AR wording must match the exception. No tests/build/lint/browser/database commands; only source and diff checks. Final reconciliation in SHARED_INLINE_VALIDATION_ALIGNMENT_FEATURE_REVIEW.md.
