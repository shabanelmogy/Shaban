## 6. Human and AI review protocol

### Packet input contract

Every phase task must receive:

- the Frozen Maintenance / Evolution Plan when block 1 requires one;
- the Feature Review Manifest;
- applicable evidence rows;
- confirmed upstream contract artifacts;
- files in scope;
- the applicable generated packet;
- approved reference paths;
- unresolved requirements;
- explicit permissions to review or implement.

A weak model must not be expected to discover rules owned only by another packet.
Each packet therefore repeats a compact authority capsule, required upstream
artifacts, continuous gates, and escalation conditions.

### Reviewer boundaries

A phase reviewer may:

- inspect directly related producers and consumers;
- identify a cross-phase mismatch;
- propose a contract change to the owning phase;
- implement an authorized change inside its scope.

A phase reviewer may not:

- invent a missing API or field;
- silently change an upstream contract;
- infer authorization from visibility;
- mark a feature complete;
- implement an Uncertain requirement;
- modify an approved reference outside scope.

### Finding format

Every material finding records:

| Field | Required content |
|---|---|
| Finding | Concrete defect or contract mismatch |
| Evidence | Source path, contract row, evidence ID, or authoritative rule |
| Owner | Primary phase responsible for resolution |
| Consumers | Phases or files affected downstream |
| Severity | Correctness, security, contract, behavior, accessibility, or consistency impact |
| Confidence | Confirmed, strong inference, or uncertain |
| Resolution | Required change or exact unresolved decision |

### Handoff rules

- Phase outputs are artifacts, not prose-only summaries.
- Downstream reviewers consume frozen tables rather than rediscovering fields.
- A changed upstream contract invalidates affected downstream reviews.
- Mark the affected artifacts stale and rerun their checks.
- Contradictions go to Phase 6; they are not resolved by whichever reviewer ran
  last.

### Calling the Contract-First Split Review

Use one of the following invocation methods. Replace the placeholders and state
whether the task is `review only` or `review and implement confirmed changes`.

#### One-task orchestration

Use this when one accountable reviewer will coordinate the complete workflow:

```text
Run a Contract-First Split Review for <Feature>.

Scope:
- Frontend: <Angular feature path>
- Backend: <directly related .NET feature paths>
- Mode: <review only | review and implement confirmed changes>

1. Perform shared Phase 0 discovery once and produce the Feature Review
   Manifest, evidence tables, scoped files, approved shapes, and unresolved
   requirements.
2. Complete Phase 1 and freeze one Frontend/Backend Contract Handoff before
   splitting the review.
3. Review the backend and frontend independently against that frozen handoff.
   Parallelize only when ownership is non-overlapping and the guide's delegation
   gate is satisfied.
4. If either side finds a contract conflict, reopen Phase 1 and refreeze before
   continuing affected work.
5. Run one combined Phase 6 reconciliation and provide the required final
   report. Neither layer may be declared complete by itself.
```

The short form is:

```text
Run a Contract-First Split Review for <Feature> in <review only | review and
implement confirmed changes> mode. Frontend: <path>. Backend: <paths>.
```

#### Separate-task orchestration

Use four ordered tasks when frontend and backend reviews must be performed in
separate conversations or assigned to separate owners. Do not start Tasks 2 and
3 until Task 1 returns a `Frozen` handoff.

**Task 1 — shared discovery and contract freeze**

```text
For <Feature>, run shared Phase 0 discovery and Phase 1 contract freeze only.
Scope frontend <path> and backend <paths>. Produce the Feature Review Manifest,
evidence tables, approved shape selections, unresolved requirements, and one
Frontend/Backend Contract Handoff. Mark it Frozen or Blocked. Do not start the
layer implementation reviews.
```

**Task 2 — backend review**

```text
Review <or review and implement> the backend of <Feature> at <paths> against the
attached Frozen Frontend/Backend Contract Handoff. Own backend files only. Do
not redefine the contract; report any conflict that requires Phase 1 to reopen.
Return backend findings, changes, risks, and the contract checks needed by final
reconciliation.
```

**Task 3 — frontend review**

```text
Review <or review and implement> the frontend of <Feature> at <path> against the
attached Frozen Frontend/Backend Contract Handoff. Own frontend files only. Do
not redefine the contract; report any conflict that requires Phase 1 to reopen.
Return frontend findings, changes, risks, and the contract checks needed by
final reconciliation.
```

**Task 4 — combined final reconciliation**

```text
Run Phase 6 combined final reconciliation for <Feature> using the Frozen
Frontend/Backend Contract Handoff and the completed backend and frontend
outputs. Resolve or classify every mismatch, review the complete scoped diff,
and provide the Master Guide final report. Do not treat either layer's report as
overall completion.
```

### Human review

Human reviewers may combine phases, but they must still produce the same
contract artifacts and final reconciliation. Combining attention does not remove
ownership or evidence requirements.

---

