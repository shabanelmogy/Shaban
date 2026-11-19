# Company Contact Person — empty-row validation

2026-10-01. Owner reported that adding an empty Contact Person row does not block
forward navigation. Scope: CompanyPartner contact rows; frozen source-supported
minimum identity rule chosen for this fix: every supplied contact needs First
Name. No contact rows is still allowed; last name, designation and communication
fields remain optional. No silent removal of blank rows.

Cause: createContactRow applied only maximum length to First Name. All remaining
fields also allowed empty values, so contacts FormArray was valid. Existing
validateCurrentStep/goToStep and whole-form Save gates already read that array;
their row field specs and inline error renderer already include First Name.

Fix: require First Name and reject whitespace-only values in the row factory;
mark its shared column header required. ContactAddVM and ContactUpdateVM now
apply Required to FirstName, covering Company nested requests and the existing
standalone Contact API (these are the only DTO consumers found). This is request
validation, with no entity/schema change. Existing unnamed contacts must receive
a name before their next update. New rows, detail seeds and create/edit forms
all use the same factory; frontend and backend reject empty/whitespace names.

UI type 03; existing shared row, step validation and field-error patterns (UI
12/14/19); backend VM attributes (BE 3) and existing aggregate write pattern.
No new shared abstraction, translation, payload field or business transition.
Reusable rules already exist in those canonical blocks; this is a feature
requirement correction. Prior changes preserved. No subagents needed.

Source checks: reviewed Next/header-forward navigation, row field-error/badge
specs, whole-form Save gate, payload mapping and DTO consumers. Scoped diff and
whitespace review passed. Owner should check Add empty row → Next/header/Save
blocked; spaces-only name blocked; a supplied name succeeds; deleting the row
permits an empty collection; Create/Edit and direct API validation. No build,
tests, browser/runtime, SQL, migration or deployment performed.

Suggested commit: `fix(company): validate contact person names`.
