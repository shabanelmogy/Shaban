# Mandatory screen user-guide handoff — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | no |
| Scope | Documentation rule only; no application source edits |
| Authority | Explicit user instruction: "ثبت الخطوة فى Guide ان بعد الانتهاء من الشاشة يتم انشاء guide لها" |

The standing rule is now owned by Master7, **Screen user guide completion gate**: after implementing/refactoring a screen, create or update its explanation in the owning module's in-app guide before final handoff. Missing or outdated guide content prevents declaring that screen source-complete. The explanation covers purpose, prerequisites, task steps, actions/states and relevant validation/financial limits, based on the final implemented source, in English and Arabic.

Reuse the existing UserGuide models/reader/journey/topic components and shared UI; register a module guide and its sidebar entry once when needed. Update existing topics rather than duplicating pages. Child dialogs and Create/Edit/View modes stay with their parent workflow. Future in-scope screens adopt the rule; no unrelated bulk retrofit was performed. Read-only, backend-only and intermediate phase commands retain their existing source/scope boundaries. Runtime/visual acceptance is distinct from source conformance.

Changed instruction files:

- F:/My Work/Sigma/AGENTS.md: standing mandatory handoff and final-report pointer to Master7.
- F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md: checklist item and synchronized revision-history row.
- F:/My Work/Shaban Documents/Shaban/sigma-erp/master/07-end-to-end-reconciliation-and-final-report.md: full owning rule, mandatory comparison, diff-review and report items.
- F:/My Work/Shaban Documents/Shaban/sigma-erp/master/00-preamble.md: Master1.27 and dated change metadata.
- F:/My Work/Shaban Documents/Shaban/sigma-erp/CHANGELOG.md: history row; pre-existing changes retained.
- F:/My Work/Shaban Documents/Shaban/sigma-erp/recipe-system/templates/PHASE-06-final-reconciliation.template.md: explicit comparisons, outputs and completion gate.
- F:/My Work/Shaban Documents/Shaban/sigma-erp/recipe-system/templates/FEATURE-REVIEW-ARTIFACTS.template.md: screen-guide evidence table.
- F:/My Work/Shaban Documents/Shaban/sigma-erp/recipe-system/generated/PHASE-06-final-reconciliation.md: regenerated through Generate-SigmaRecipes.ps1 -Recipe phase-06-final-reconciliation; never edited manually.

Verification: scoped documentation diff/whitespace review passed; new source references exist; no merge markers/trailing whitespace in touched instruction/template files. Phase06 Check passed. Its generated comparisons, required evidence and completion gate were semantically compared with Master7 and scope boundaries. Existing generated Phase06 changes were fingerprints only; regeneration retained its prior semantic content and added the approved guide rule. Initial global recipe check already reported PLAN00 and Phase00/02–06 drift; only the relevant Phase06 packet was regenerated. Other packets still require separate regeneration/semantic review and should use canonical sources until current.

AGENTS/skill/reviews remain local instruction artifacts under the existing ownership arrangement; the books/templates/generated packet belong to the Shaban documentation repository. No frontend/backend code, calculations, AutoMapper or database changes; no migration needed. No subagents: this small sequential rule synchronization did not meet the delegation gate. No builds/tests/lint/browser/database/migrations/commits/push/deployment/Graphify/Sigma MCP. Suggested owner commit: `docs(master): require in-app guides before screen handoff`.
