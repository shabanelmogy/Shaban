# Sigma workflow — controlled delegation

On-demand section of the live companion (`../SIGMA_WORKFLOW_RULES.md`). Read only
when considering subagents.

## Controlled multi-agent strategy

Use subagents automatically when a Sigma task contains at least two concrete,
bounded, independent workstreams and parallel execution is expected to reduce
wall-clock time without duplicating context or creating merge risk. Do not
spawn subagents for small fixes, tightly sequential work, unresolved shared
contracts, or tasks where the coordination overhead is likely to exceed the
implementation time.

The root agent remains accountable for the complete result. It owns:

- scope, evidence classification, guide and packet selection;
- Phase 0 discovery and the Phase 1 contract freeze;
- cross-layer architecture and business-rule decisions;
- integration of all agent outputs;
- complete scoped-diff review, final reconciliation, and the final report.

### Sequencing and dependency gates

1. The root agent performs initial discovery, runs the recipe drift check, and
   freezes applicable backend and API contracts before delegating implementation.
2. Phase 2 read/grid work and Phase 3 detail/write work may run in parallel only
   after Phase 1 freezes every contract they consume and only when their owned
   files do not overlap.
3. Phase 4 work starts only after its backend and owning-UI contracts are fixed.
4. Phase 5 integration and Phase 6 reconciliation remain root-owned unless a
   bounded read-only audit is delegated.
5. If an agent discovers a contract conflict or a dependency on another
   workstream, it stops that portion and reports the conflict to the root agent;
   it does not invent or independently change the shared contract.

### Agent and model routing (Codex-specific)

The model names below apply only to Codex orchestration. Other tools (Claude,
Gemini/Antigravity, Kiro, WorkBuddy) keep the roles and use their own or the
inherited model.

- The role labels in this section are descriptive task names, not model
  identifiers. Never pass a role label as a model override.
- Use a `luna_explorer` role backed by `gpt-5.6-luna`, when selectable, for
  read-only source discovery, request-flow tracing, documentation lookup, and
  log or diff analysis.
- Use a bounded `terra_worker` role backed by `gpt-5.6-terra`, when selectable,
  for routine isolated implementation where lower cost is expected to preserve
  quality.
- Use a `sol_worker` role backed by `gpt-5.6-sol`, when selectable, for complex
  business rules, aggregate persistence, concurrency, difficult debugging, or
  a focused final code audit.
- Use only model identifiers offered by the current orchestration tool. If the
  mapped model is unavailable or the fork must inherit its model, keep the role
  and use the inherited model. Use a different selectable model only when the
  user explicitly requests it.
- Keep the root agent as the final decision maker; no subagent may declare the
  overall Sigma task complete.

### Cost, concurrency, and context controls

- Use the smallest useful team. Start with one or two subagents and use at most
  three concurrently, keeping total active agents including the root within four.
- Delegate a coherent workstream, not individual tiny edits.
- Prefer the lowest-cost capable model for read-only or routine work and reserve
  the strongest model for decisions whose complexity or risk justifies it.
- Pass only the context, guide blocks, contracts, and files required by the
  assigned workstream. Do not make multiple agents repeat the same source scan.
- Reuse an existing agent for related follow-up work instead of spawning a new
  one, and stop assigning work once the bounded result is complete.
- The root agent continues useful non-overlapping work while subagents run.

### Ownership and safety

- Give every implementation agent explicit file or module ownership and a
  concrete deliverable. Two agents must never modify the same file concurrently.
- Tell every implementation agent that it is not alone in the working tree, must
  preserve user and peer changes, must not revert other edits, and must adapt to
  compatible changes already present.
- All subagents inherit the same guide authority, scope boundary, migration
  boundary, verification rules, and prohibited commands in this file.
- Subagents must not directly edit generated packets, migrations, model snapshots, or
  approved reference modules unless those files are explicitly authorized by a
  later user instruction that also changes the applicable boundary.
- If clean ownership cannot be established, the root agent performs the work
  locally instead of delegating it.
