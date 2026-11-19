# Instruction and review version-control handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Owner decision | Prepare locally on 2026-11-19. Install after the owner records the existing documentation changes. |
| Contract | [Maintenance plan, decision D7 and slice S1](SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md) |

## Prepared layout

The workspace remains the live writer. The transfer snapshot is in
`F:\My Work\Sigma\.codex-build\documentation-handoff-20261119\workspace`.
The adjacent `manifest.csv` records each workspace-relative file path, length
and SHA-256. The package contains exactly the three entry files
(`AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`) and the complete `.agents` and
`reviews` directories, including historical evidence. Filesystem timestamps
are outside the content comparison.

The proposed destination is `sigma-erp/workspace/` inside the Shaban repository.
This keeps the three files and both directories together and preserves their
relative layout. The repository's existing top-level personal `AGENTS.md`
remains a separate file.

## After the owner records the documentation baseline

1. Record the baseline commit and confirm the destination is free. Compare the
   live five entries with the snapshot again by relative path, size and SHA-256.
   Refresh in a new empty staging directory if anything has changed, including
   added or removed files. Keep the original live paths authoritative through this step.
2. Copy the verified set to the destination. Compare directory paths, counts
   and hashes. Review ignored paths and historical evidence before the initial
   commit, particularly generated binaries and machine-specific files.
   Resolve intended exclusions explicitly in the transfer record.
3. Keep recoverable originals during cutover. Use workspace directory junctions
   for the two directories and file links for the three entry files so updates
   through either supported path reach the same content. Test link creation on
   the host first. If link setup fails, restore the original entries.
4. Verify the usual workspace entry path reaches the companion, the review
   index and a recent frozen contract. Run both documentation checks from the
   live environment. Inspect the scoped Git diff and update the ownership
   paragraph in `.agents/workflow/artifacts-and-report.md` in the same change.
5. After the owner records the transfer commit, retrieve the entry, companion
   and contract from that revision and compare them with their live files.
   Record the revision and results in the audit before retiring the backup.
