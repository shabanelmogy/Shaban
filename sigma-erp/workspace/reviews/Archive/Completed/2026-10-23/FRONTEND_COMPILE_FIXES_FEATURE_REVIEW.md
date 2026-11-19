# Reported frontend compiler errors

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Date | 2026-10-04 |

Scope is the two compiler diagnostics supplied by the user, continued by «كمل». Frontend repository root verified: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Existing SalesQuotation changes preserved. This is a bounded integration correction, not a new screen review or domain contract.

| File | Evidence and correction |
|---|---|
| `src/app/modules/Sales/SalesQuotation/components/list/list.component.ts:5` | TS2304: actionsBusy uses computed without import. Add computed to the existing @angular/core named import. |
| `src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.ts:48` | TS2739: injected JobService was annotated ItemService. Change annotation to JobService; retain its existing injection and jobs GetSelect call. JobService extends BaseService, which owns getSelectList. |

Decisions: preserve actual injected service identity and existing runtime requests; no casts, dummy ItemService methods, payload, endpoint, mapping, calculation, translation, permission or schema changes. No migration required. Shared extraction and learning update do not apply: existing imports/types suffice. No subagents used because these are two small local corrections.

Applied Phase5 integration and Phase6 scoped source reconciliation under Master7/UI1/UI29 and the previously read sigma-screen-refactor skill. Other phases skipped: no new API/business/UI contract. Recipe check confirms Phase5/6 current; Phase1/3/4 remain stale and need owner regeneration/semantic review, but are unrelated to these fixes. Generated files untouched.

Complete scoped diffs read before and after changes; unrelated existing SalesQuotation hunks preserved. Source verifies computed import/use, JobService annotation/injection and inherited getSelectList call. Merge-marker scan found none; scoped git diff --check exits0 (LF/CRLF notices only).

No build/tests/lint/runtime/browser/database/migration/commit/push/deployment/Graphify/Sigma MCP commands run. Owner must rerun the frontend compilation to confirm both diagnostics disappear; whole-project success is unverified. This fix adds no standalone component or service registration.

Suggested frontend commit, covering only these corrections: `fix(frontend): correct computed import and GRN job service type`.
