# Limousine Tariff Report access handoff

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Frozen mapping

| Surface | Requirement |
|---|---|
| Report route, base report read, section display, print and export | `LimousineTariff.GenerateReport` |
| Optional customer filter and customer lookup/watch | `Customer.Lookup` |
| Report with a selected customer in the UI | both requirements above |

Print and Excel export are local output of the permitted report response; no
new print/export grant was introduced. The UI requirement for a selected
customer does not change the server authorization of `GenerateReport`, which
remains independently enforced by its existing report permission.

## Source reconciliation

- `limousine-tariff-report-access.ts` exposes the report-read and optional
  customer-lookup requirements and constructs the applied-report requirement.
- Report access is captured against the current access context. The ReportPage
  host becomes hidden/inert on expiry and report/filter/section/print/export
  handlers synchronously recheck current access.
- Every report read is cancelled for context, changed filter and the captured
  report requirement. A response must also match its initiating context,
  requirement and customer identity before publication.
- `canPresentReport` independently checks the applied filter's captured context
  and requirement before rendering report sections or enabling section change,
  print or export. This closes the synchronous interval before an invalidation
  effect flushes after `Customer.Lookup` is withdrawn.
- Customer bootstrap and cache watch run only with the optional lookup grant.
  Without it, no customer request is sent, the filter is removed, and old
  customer identity/options/applied report are cleared. The base report stays
  available under the report permission alone.
- Customer and report invalidation close the body-appended Select, stop lookup
  watches, cancel a queued print, and clear output. `ReportPrintSession.print`
  receives the captured output `denied$` notifier so fast revoke/regrant also
  cancels pending print preparation.
- Access effects invalidate state without tracking loading/printing state;
  regrant performs only the missing bootstrap and avoids report loops.
- A cache-context change schedules one revision-guarded bootstrap after existing
  read/lookup finalizers complete, so it neither reuses the old customer nor
  loses the permitted base/customer bootstrap to a still-finalizing request.
- The pending bootstrap retains its captured context and `denied$` lifetime
  while a browser-owned print dialog is active. Its single consumption resumes
  only from `afterPrint` when still permitted; failed bootstrap reads do not
  replay and remain manual-Retry work.

## Reference evidence

Read the Speed snapshot dated 2026-10-28:

- `sidebar/16-limousine/screens/04-tariff-report.md` identifies the Limousine
  Tariff Report and direct controller `C0902`.
- `data/controllers.json`, `C0902`, lines 244536–244656, records customer
  selection plus tariff/trip-type sections and their declared services.

This supports customer and section shape only. It does not define Sigma
permission keys, backend authorization, report transport or accounting rules.
The original 2026-10-27 library search exposes no dedicated Tariff Report
explanation; that absence is recorded as a reference gap. Odoo was not needed:
the frozen local authorization contract resolves the scoped behavior.

## Verification and pending acceptance

Added unexecuted component regression specifications for missing customer
lookup (no customer request or leaked raw id), synchronous corporate-output
suppression on lookup revocation, and same-grant actor replacement. Source-only
checks completed: TypeScript syntax parsing and scoped `git diff --check`.
Build, test, lint, browser, database, migration, commit and deployment
execution remain pending owner authorization.
Runtime acceptance must cover report expiry/regrant, optional lookup denial,
stale-response suppression, body portal closure, and queued-print cancellation.
