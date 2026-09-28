# Sigma Feature Review Master Guide — Canonical

| | |
|---|---|
| Status | **Canonical.** Binding for Sigma feature review and implementation orchestration |
| Version | 1.9 |
| Last verified against documentation system | 2026-09-28 |
| Verification | Documentation structure and source inspection only |

This guide defines how a Sigma feature is scoped, reviewed, implemented, and
reconciled across Angular and .NET. It owns global review rules and contract
invariants. It does not duplicate platform implementation recipes.

The following canonical pattern books are incorporated into authority level 1:

- `SIGMA_UI_PATTERNS.md` — Angular implementation patterns.
- `SIGMA_BACKEND_PATTERNS.md` — .NET, persistence, and API patterns.

When this guide states a global invariant and a pattern book supplies the
implementation, both apply. Generated phase and task packets are derivative
artifacts selected from these authorities.

## Authority order

Use this order for every decision:

1. This Master Guide and the applicable canonical pattern-book blocks.
2. The applicable generated phase or task packet.
3. The `sigma-screen-refactor` skill, the operational digest of level 1. Each
   skill rule cites its owning book block, and the skill may not introduce a
   rule level 1 lacks.
4. The approved project reference named for the specific UI or backend shape.
5. Screenshots, for functional requirements and visible content only.
6. Reviewer inference, only when labelled and supported by evidence.

If a generated packet conflicts with a canonical source, stop using the packet,
report drift, and use the canonical source. If a canonical snippet conflicts
with current source, current source wins for factual behavior; report the guide
drift instead of silently changing the rule.

## Document roles

| Document | Role | May define new authority? |
|---|---|---|
| This Master Guide | Global review process and contract invariants | Yes |
| UI and backend pattern books | Platform implementation patterns | Yes |
| Generated phase packets | Bounded review procedures and required outputs | No |
| `sigma-screen-refactor` skill | Operational checklist digest of the books for screen work; new lessons are written to the owning book block in the same task | No |
| Generated task recipes | Linear implementation procedures for a task shape | No |
| Approved project references | Concrete examples of an approved pattern | No |
| Screenshots and videos | Functional evidence | No |
| Review artifacts | Feature-specific decisions and traceability | No |

## Contents

1. [Governance and review principles](01-governance-and-review-principles.md)
2. [Screenshot and visual evidence policy](02-screenshot-and-visual-evidence-policy.md)
3. [Phase model, ownership, and dependencies](03-phase-model-ownership-and-dependencies.md)
4. [Required decisions, artifacts, and contract invariants](04-required-decisions-artifacts-and-contract-invariants.md)
5. [Continuous quality gates](05-continuous-quality-gates.md)
6. [Human and AI review protocol](06-human-and-ai-review-protocol.md)
7. [End-to-end reconciliation and final report](07-end-to-end-reconciliation-and-final-report.md)
8. [Packet generation and governance](08-packet-generation-and-governance.md)

---

