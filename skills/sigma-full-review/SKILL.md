---
name: sigma-full-review
description: Review a Sigma Angular/.NET feature end to end using the two canonical Sigma frontend and backend guides. Use when the user says SIGMA FULL REVIEW, asks for a complete Sigma module/service review, asks whether frontend fields match backend contracts, or asks to fix findings while preserving current project patterns.
---

# Sigma Full Review

Review one feature from Angular screen to database. Keep the work practical,
evidence-based, and inside the current Sigma patterns.

## Start

1. Announce that `$sigma-full-review` is being used and name the feature.
2. Locate and read `PROJECT_MAP.md` in the active Sigma workspace.
3. Locate the `Shaban` guide repository. Prefer a local clone; otherwise use
   the public `shabanelmogy/Shaban` GitHub repository and say so.
4. Read these two files completely:
   - `sigma front/SIGMA_FRONTEND_REVIEW_GUIDE.md`
   - `sigma front/SIGMA_BACKEND_REVIEW_GUIDE.md`
5. Read applicable `AGENTS.md` files before edits.
6. Resolve the feature paths from the project map and repository search. Do not
   ask for paths until search fails.

Current workstation fallbacks are:

- workspace: `F:\Sigma`
- frontend: `F:\Sigma\SiGmaAngularFrontEnd`
- backend: `F:\Sigma\SigmaBackend`
- guides: `F:\Shaban Documents\Shaban`

On another computer, search instead of assuming these drive letters.

Accepted triggers include:

```text
$sigma-full-review Staff
SIGMA FULL REVIEW Staff
$sigma-full-review Staff backend
$sigma-full-review Staff fix all
```

## Scope

For a full-stack review, trace the smallest complete slice.

Frontend:

- route and permission;
- grid/list, form/modal/stepper, or report screen;
- component, template, styles, models, service, translations;
- filters, paging, actions, exports, nested rows, uploads;
- light/dark/system theme, colors, responsive, RTL, keyboard, and errors.

Backend:

- controller and inherited endpoints;
- service shape: normal, settings/configuration, master-detail, or master-detail
  with voucher/allocation, selected using the backend guide's references;
- service interface, implementation, and base method;
- Add, Update, Detail, List, filter, report, and child ViewModels;
- mapper, entity, enum, EF configuration, snapshot/migration;
- repository tenant/soft-delete/query behavior;
- validation, business rules, delete references, reports, exports, and files.

Read shared/base behavior before judging a custom override.

## Review mode

Default to review-only:

- inspect source and configuration;
- create or update the review report;
- do not change application code;
- do not build, run tests, or generate migrations;
- label owner verification scenarios as not run.

Implement only when the request explicitly asks to fix findings. Even then,
preserve the owner-run verification rule unless the user explicitly overrides
it.

## Contract first

Inventory every endpoint and every field before writing findings.

For each operation record:

- UI action and frontend service call;
- HTTP verb, URL, route/query/body;
- controller and business service;
- request/response wrapper;
- persistence path.

For each field record:

- UI/grid/filter and TypeScript property/type;
- backend Add/Update/Detail/List property/type;
- entity or computed source;
- required/null/default, length, regex, range, precision, enum, and date rules;
- sent, persisted, returned, displayed, UI-only, or server-owned direction.

Use the parity statuses defined by the frontend guide. Report both directions:
frontend fields missing in the backend and backend fields missing in the
frontend.

## Evidence and fixes

- Cite exact paths and tight line numbers.
- Confirm behavior through source; do not infer from names.
- Trace Add, Update, Detail, List, filters, children, and custom operations
  separately.
- Compare every override with the current base method.
- Recommend the smallest safe fix consistent with Sigma.
- Do not introduce a new architecture or unnecessary abstraction.
- Do not claim runtime verification.

Security rules still apply, but do not duplicate a resolved global tenant issue
inside every feature. When the shared guard is present and the feature does not
bypass it, mark it `Reviewed - covered by shared guard`. Raise a feature finding
only for a custom bypass or weaker path.

## Report

Create or update:

```text
<Sigma workspace>\reviews\<FEATURE>_FULL_STACK_REVIEW.md
```

Keep the report direct:

1. scope, screen shape, and files inspected;
2. request-flow and endpoint matrix;
3. complete bidirectional field parity matrix;
4. validation and business-rule matrix;
5. findings ordered Critical, High, Medium, Low;
6. query/database observations;
7. edge cases and owner-run acceptance scenarios;
8. unresolved contract decisions and coverage summary.

Use stable IDs such as `STAFF-FS-01`. Each finding includes severity, layer and
operation, evidence, impact, smallest safe fix, affected files, and one owner
verification scenario. Mark reviewed areas with no defect as
`Reviewed - no finding`.

## Severity

- **Critical:** cross-tenant/security breach, privilege bypass, exposed secret,
  data loss, ownership change, or corrupting save.
- **High:** missing/ignored required field, incompatible contract, invalid
  business/FK/delete rule, partial save, or broken primary workflow.
- **Medium:** wrong paging/filter/report result, significant inefficient query,
  incomplete error handling, or important edge case.
- **Low:** maintainability, accessibility, consistency, naming, or
  documentation issue without incorrect business data.

## Completion

Report:

- review path;
- finding counts;
- most urgent mismatch;
- whether code was changed;
- that builds/tests/migrations were not run;
- exact owner verification actions.
