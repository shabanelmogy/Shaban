<!-- Part of Master block 5: see ../05-continuous-quality-gates.md. Same status and authority as the block. -->

### Loading performance, query and index evidence (owner2026-10-25)

- Every new or reviewed screen includes a proportional performance review in
  its existing artifact: actual route/trigger, HTTP and database boundaries,
  required versus auxiliary reads, serial dependencies, duplicate requests,
  round trips, page/response size and rendered rows. Include initial open,
  search/paging, detail, relevant actions and complete report/export paths.
  A correct visible loader is UI22 evidence; actual loading speed is separate
  evidence owned here and in UI29/BE7/BE2.
- Inspect source first and correct confirmed bottlenecks within authorized
  implementation scope: repeated per-row queries, unnecessary full entities or
  Includes, unbounded premature materialization, duplicate calls and avoidable
  serial waits. Preserve count/filter/order/page, tenant/history/soft-delete,
  ledger/financial/state guards and authoritative write-time checks. Do not
  parallelize EF operations on one DbContext or add a cache for excluded reads.
- Record a reproducible before/after measurement plan under UI29: environment,
  data volume, filters/page size, cache state, sample count and timing/SQL/network
  evidence available. Establish a feature-specific target with its evidence;
  do not invent a universal duration, timeout or acceptable regression. Without
  authorized runtime evidence, mark timing and SQL-plan acceptance pending for
  the owner, even when a source query count improves. A source-only task still
  performs the source audit and supplies measurement steps; this gate does not
  authorize builds/tests/browser/database commands or production profiling.
- For each materially expensive query, evaluate existing and candidate indexes
  under BE2. Name the actual predicate/join/order/projection and table/mapping,
  key order, optional included columns/filter, overlap with existing indexes,
  expected benefit, write/storage cost and required verification. Record a
  supported proposal or why no extra index is justified; do not propose an
  index for every filter by habit or treat a missing production plan as proof.
  Proposals are separate from authorized EF configuration implementation and
  owner migration/application. Unique/filter semantics never change for speed.
- Reconcile each path at handoff: source findings and fixes, measured results or
  explicit pending owner measurement, index proposals/rejections and remaining
  risks. Reuse the current feature artifact; no separate benchmark framework,
  full-solution scan or mandatory artifact proliferation. Do not describe the
  screen as fast or performance-tested without actual supporting measurements.

### Loading conformance evidence (UI22; clarification2026-10-25)

- Apply UI22's mandatory loading conformance gate during discovery and final
  reconciliation. Trace the actual route import and component; a matching
  feature folder or separate legacy route does not prove active-path adoption.
- In the existing review, classify each request/operation's visible owner and
  trace real producer/consumer symbols: subscribed start/finalize release,
  success/business failure/HTTP error/cancel/destroy, effective showPageLoading
  and actual host, retained busy/disabled/aria-busy and error/Retry. A shared
  import or startLoading call alone cannot earn Matched.
- Keep UI22's ownership boundaries: global page/list/detail/save/domain/delete
  and report/export data reads, plus required routed initial/filter lookup
  bootstrap through the shared page owner (owner clarification2026-10-26),
  local dialog lookups/reads hidden by a body-appended overlay, silent retained cache refresh and explicitly scoped
  Dashboard policy. One visible progress owner means no duplicate StateMessage/
  table/button indicator for that request; it never means removing busy guards.
- Reconcile query/fragment-only list URL updates with pending request lifetime:
  they do not reset the loader when the parsed route-path tree is unchanged.
  Actual path departure retains reset; independent write safety remains intact.
  Do not add per-feature delay/timer workarounds for a shared lifecycle mismatch.
- Correct confirmed authorized mismatches before claiming completion, and keep
  missing visibility evidence explicit. Source comparison does not establish
  runtime visibility, response duration or overlapping/cancelled-request behavior;
  record owner verification separately and preserve execution boundaries.

### Screen cache adoption evidence (UI2; clarification2026-10-25)

- Apply UI2's mandatory screen cache gate during discovery and again before
  handoff for every new or reviewed screen, including editor lookups and
  list/report filters. Reuse the existing review/contract; do not create another
  artifact solely for this gate.
- Inventory each actual consumed URL/envelope and consumer symbol; classify
  approved reference cache, explicit singleton, direct reference with no source
  opt-in or direct operational/policy read,
  or unresolved eligibility. Name the owning source service, successful
  writers/import outcomes and invalidation, watch/tenant-topic coverage, and
  the source-supported reason for a direct-read exception. Do not widen source
  eligibility, financial precision, availability or other business rules.
- Reconcile the final source path, rather than shared imports or earlier report
  claims: finite successful bootstrap before a separate once-bound watch;
  selected-ID/current-option label retention; unchanged draft/dirty state;
  context clearing without old-label restoration; both failure channels and
  Retry; teardown; actual writer/notification coverage. A known unapproved
  mismatch is a finding to correct within authorized scope, not a completed
  implementation. A missing source classification is missing review evidence.
- Record source conformance separately from owner network/runtime acceptance
  for expiry, coalescing, tab return/rejoin, context isolation and visible
  recovery. Existing execution boundaries still apply. UI2 owns the complete
  cache contract; this gate makes its application and evidence unavoidable.
