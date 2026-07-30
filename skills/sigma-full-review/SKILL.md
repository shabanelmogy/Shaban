---
name: sigma-full-review
description: Perform an evidence-based, professional full-stack review of a Sigma Angular/.NET feature, including bidirectional frontend/backend field parity, API contracts, validation, business rules, tenant security, queries, database mappings, UI behavior, edge cases, and prioritized findings. Use when the user invokes `$sigma-full-review`, says `SIGMA FULL REVIEW`, asks for a complete Sigma module review, or asks whether frontend fields and backend DTOs match.
---

# Sigma Full Review

Review one Sigma feature from Angular UI to database and produce a traceable,
prioritized report. Treat frontend and backend as one contract.

## Start

1. Announce that `$sigma-full-review` is being used and name the feature.
2. Locate and read `PROJECT_MAP.md` from the active Sigma workspace. The
   current workstation uses `F:\Sigma\PROJECT_MAP.md`; on another computer,
   search the workspace instead of assuming that drive.
3. Read `references/review-checklist.md` completely.
4. Resolve the target feature in the frontend and backend repositories named
   by the project map. Current workstation fallbacks are
   `F:\Sigma\SiGmaAngularFrontEnd` and `F:\Sigma\SigmaBackend`.
5. Locate the `Shaban` guide repository and inspect its `sigma front`
   directory before judging frontend or backend behavior. The current
   workstation fallback is `F:\Shaban Documents\Shaban\sigma front`. If no
   local clone exists, read the public `shabanelmogy/Shaban` repository on
   GitHub and state that the review used the GitHub copy.
6. Inspect applicable `AGENTS.md` files before any edits.

Accept these trigger forms:

```text
$sigma-full-review Staff
SIGMA FULL REVIEW Staff
$sigma-full-review Staff backend
$sigma-full-review Staff fix critical
```

If the feature is named, do not ask for its paths until repository search fails.
If scope is not named, ask for the feature or service name.

## Review mode

Default to review-only:

- read source and configuration;
- create or update the review report;
- do not change application code;
- do not build or run tests;
- clearly label all owner verification scenarios as not run.

Implement findings only when the same request explicitly asks to fix them.
Even then, do not build or test Sigma unless the user explicitly overrides the
standing owner-run verification rule.

## Trace the complete slice

Inspect the smallest complete end-to-end slice.

Frontend:

- route and permission configuration;
- list/grid component, template, styles, columns, filters, paging, actions;
- create/view/edit form, steps, controls, validators, nested rows and uploads;
- request, response, list, detail and lookup models;
- feature and shared HTTP services;
- translations, notifications, loading/error states and shared UI components.

Backend:

- controller and inherited base endpoints;
- service interface and implementation;
- Add, Update, Detail, List, filter, report and child ViewModels;
- AutoMapper profiles;
- entities, enums and directly related models;
- EF configuration, current model snapshot and relevant migrations;
- repository/base service tenant, soft-delete, paging and update behavior;
- every overridden base method and the security/data invariants it replaces;
- authorization, file handling, reports and exports used by the feature.

Trace shared/base behavior before concluding that feature code is correct or
incorrect.

## Sigma standards directory

Treat the resolved `Shaban/sigma front` directory as the project
review-standard directory. Enumerate it at the start of every review so newly
added standards are not missed. Prefer the local clone so code and standards
can be reviewed together. Use
`https://github.com/shabanelmogy/Shaban/tree/main/sigma%20front` only when a
local clone is unavailable. Read every applicable guide completely:

| Feature shape | Required guide |
|---|---|
| Any API/service review | `GENERIC_DOTNET_BACKEND_SERVICE_REVIEW_GUIDE.md` |
| Grid/list screen | `GENERIC_ANGULAR_GRID_SCREEN_GUIDE_REVIEWED.md` |
| Compatibility link to grid guidance | `GENERIC_GRID_SCREEN_GUIDE.md` redirects to the reviewed guide |
| Multi-step or nested form | `GENERIC_STEP_FORM_GUIDE.md` |
| Report or export screen | `GENERIC_REPORT_SCREEN_GUIDE.md` |
| Location feature | Read the concise `LOCATION_GRID_SCREEN_GUIDE.md` after the canonical grid/backend guides |
| Theme, colors or dark mode | `color_system.md` |

The reviewed Angular grid guide is the only canonical grid guide. The shorter
`GENERIC_GRID_SCREEN_GUIDE.md` exists only to preserve old links. When a grid
pattern is missing, add the corrected rule to the reviewed guide instead of
creating another generic standard. Do not invent a visual, form, report,
accessibility, responsive, RTL, upload, or pagination rule while an applicable
standard exists.

### Security precedence

Tenant isolation, authorization, server-owned fields, and data-integrity rules
override frontend examples and feature-specific case studies. A legacy request
may contain `SubscriptionId` or `No`, but the backend must treat it as an
untrusted assertion, scope the target independently, reject mismatches, and
preserve the persisted value.

For every custom CRUD override:

- compare it with the current base method before judging it;
- confirm tenant and soft-delete target scope;
- confirm it preserves server-owned values after mapping;
- confirm nested/bulk items receive the same protection;
- reject ID-only `DbContext.Set<T>()` lookups unless explicit tenant and
  soft-delete predicates are present.

A secure generic base service does not protect a feature that overrides the
method and omits those invariants.

### Theme and color contract

When the feature has forms, validation, themed surfaces, or shared UI:

- read `color_system.md` completely;
- treat validation that blocks Save/Next as an error state using the red
  validation palette;
- reserve amber for non-blocking warnings or temporary invalid-field navigation
  highlighting;
- review light, dark, and `system` modes with `data-bs-theme` on `<html>`;
- review success, information, warning, error, disabled, selected, hover, and
  focus-visible states without relying on color alone;
- distinguish feature-scoped styles from global `src/styles.scss` ownership of
  shared `table-list` and body-appended PrimeNG overlays;
- check dropdown, select, calendar, datepicker, dialog, menu, toast, table, and
  paginator surfaces, including `appendTo="body"` overlays;
- check contrast, keyboard focus, RTL, responsive layout, and
  `prefers-reduced-motion`.

### Search, date, export, file, and card invariants

- Database-backed server-paged grids use server search/filtering. PrimeNG
  `filterGlobal` over the current page is not a database search.
- Date-only business fields preserve `yyyy-MM-dd` calendar components and do
  not pass through UTC `toISOString`; timestamp fields follow the explicit UTC
  contract.
- Export uses the same approved filters and authorization as the screen, fails
  as a whole when any page/request fails, and never silently exports only the
  visible page.
- Uploads require backend authorization, tenant/parent ownership, size,
  extension, MIME/signature, safe naming, replacement, orphan cleanup, and
  deletion review.
- CVV may be collected only for immediate authorization and must never be
  persisted after authorization, returned in Detail, logged, routed, or
  exported.

## Build the contract ledger first

Before writing findings, inventory every operation and field.

For every route/operation record:

- UI action;
- frontend service method and URL;
- HTTP verb, path, route/query parameters and body;
- backend controller action;
- request and response wrapper;
- business service method.

For every field record:

- UI control/grid/filter name;
- frontend request/response property and TypeScript type;
- backend Add/Update/Detail/List property and C# type;
- entity property or computed source;
- required/optional/null/default behavior;
- length, range, precision, regex, date and enum rules;
- serialization format and direction;
- whether it is sent, accepted, persisted, returned and displayed.

Classify every field as one of:

```text
MATCHED
FRONTEND_ONLY
BACKEND_ONLY
TYPE_MISMATCH
NULLABILITY_MISMATCH
NAME_OR_CASING_MISMATCH
ENUM_OR_DATE_MISMATCH
DIRECTION_MISMATCH
UNUSED
INTENTIONAL_UI_ONLY
SERVER_OWNED
```

Never treat a field mismatch as harmless without tracing runtime behavior.
Explicitly report:

- frontend fields sent but absent from the backend DTO;
- backend required fields not collected or sent by the frontend;
- frontend fields displayed but absent from backend responses;
- backend response fields never represented or consumed by the frontend;
- fields accepted by a DTO but ignored by mapping/service persistence;
- entity fields exposed unintentionally;
- renamed, differently cased, or differently typed nested fields;
- unsupported frontend filters, sorts, actions, reports or exports.

## Review and evidence rules

- Use `references/review-checklist.md` as the coverage ledger.
- Cite exact file paths and tight line numbers for each finding.
- Confirm actual behavior through controller/base service/repository/mapper
  source; do not infer it from names.
- Distinguish defects from intentional UI-only, computed or server-owned fields.
- Trace Add, Update, Detail and List separately; they need not share one model.
- Review nested objects and collections in both directions.
- Review tenant ownership before general validation or performance.
- Recommend the smallest fix consistent with existing Sigma patterns.
- Do not introduce a new architecture during a review.
- Do not claim runtime verification.

## Report

Create or update:

```text
<Sigma workspace>\reviews\<FEATURE>_FULL_STACK_REVIEW.md
```

Create the workspace `reviews` directory if needed. Preserve unrelated existing
report content.

The report must contain:

1. scope and files inspected;
2. architecture/request-flow trace;
3. endpoint contract matrix;
4. bidirectional field parity matrix;
5. validation and business-rule matrix;
6. findings ordered by Critical, High, Medium and Low;
7. query/database observations;
8. edge cases and owner-run acceptance scenarios;
9. unresolved contract decisions and review limitations;
10. a coverage summary showing what was reviewed and what was out of scope.

Use stable finding IDs such as `STAFF-FS-01`. For every finding include:

- severity;
- layer and operation;
- evidence;
- impact;
- smallest safe fix;
- frontend files affected;
- backend files affected;
- owner verification scenario.

If no defect exists in an area, mark it reviewed with no finding instead of
silently omitting it.

## Severity

- **Critical:** cross-tenant/security breach, privilege bypass, data loss,
  ownership change or corrupting save.
- **High:** missing/ignored required field, incompatible contract, incorrect
  business/FK/delete rule, partial save or broken primary workflow.
- **Medium:** incorrect paging/filtering/response, avoidable expensive query,
  incomplete UX/error handling or significant edge case.
- **Low:** maintainability, accessibility, consistency, naming or documentation
  issue without incorrect business data.

## Completion

Summarize:

- report path;
- counts by severity;
- most urgent contract mismatch;
- whether code was changed;
- that builds/tests were not run;
- exact next owner verification actions.
