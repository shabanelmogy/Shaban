<!-- Part of Master block 5: see ../05-continuous-quality-gates.md. Same status and authority as the block. -->

### Scoped build and specification checks

The owner authorizes local builds of affected projects (2026-11-13). Select
an application target for changed application code and the test project when
its specifications change. Compare test calls to the actual signatures and
member visibility, and check project references and source inclusion. Seed
fixtures independently of the restricted actor, then assert against that actor's
observable result. Report build and executed test results independently.

**Scoped tests and lint.** An authorized
implementation, fix or refactor includes running the specifications that cover
the changed code and linting the changed files, without a separate request:

- Angular: `ng test --watch=false --include=<affected spec paths>` and
  `ng lint --lint-file-patterns=<changed files>` (or `npx eslint <changed files>`).
- .NET: `dotnet test <affected test project> --filter <affected classes>`.

Fix failures caused by the change; report pre-existing failures as findings
without widening scope. This does not authorize full-suite runs, end-to-end or
browser/application execution, review-only or plan-only tasks, or fixes for
unrelated lint debt. Report the exact command, count and outcome; a test that
was not executed stays explicitly pending.

Match the fixture to the behavior it claims to verify. EF InMemory is useful
for suitable isolated queries. Use SQL Server for behavior that depends on its
transactions, application locks or query translation. A test double can verify
code on its side of the boundary and should identify the boundary it replaces.
A filter test with a stub continuation checks the filter decision. Cover the
actual filter and service together when the filter changes the service's query
scope. Compare table-driven cases with the named grants and expected outcome.
For deferred UI behavior, control response and access-change order and assert
at the point where the decision is consumed.

For authorization regressions, assert the exact rejection and its layer.
Use independent requests for an invalid direct filter and an invalid grid
field so an early rejection cannot mask the second case. Construct the actual
actor, tenant, branch snapshot and transaction/read mode that the invoked path
uses. A changed principal after service construction may leave cached scope
unchanged. To exercise an activity guard, use a fixture that passes the
preceding grant and branch checks. In catalogue tests, a linked copy of an
internal type belongs to the test assembly. Use the actual type or verify
reflected properties from the owner assembly without casting to the copy.

### Scenario evidence for an authorization change

Choose applicable cases from the frozen feature contract in the existing review.
Trace a generated document into its next affected action, including the actual
filter, service and persistence scope of that action. For example, after a
conversion from a readable source into a writable destination, verify whether
the resulting document can be read, approved and reversed by the actors the
contract allows. Include each touched producer and consumer in the source
comparison.

For a mounted editor, vary View and the operation grant independently. Cover
withdrawal and restoration with a dirty draft, and a sent request resolving
before and after restoration. Assert the entered values and row identities,
the number of writes and the resulting Close/Back destination. For output,
include the separate grant for a generated document and its deferred print.
Choose relevant cases for administrator, minimum operation grants and branch
capabilities from the contract.

Trace each required regression fixture from setup through the intended
assertion. Establish all valid inputs, current currency state, effective
document statuses, actor context and the provider needed to reach that guard.
Then vary the condition under test and assert its exact outcome. A test that
never reaches its named operation leaves that case unverified. When execution
is unavailable, record the source defect or pending execution explicitly.
