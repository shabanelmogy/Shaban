# Instruction and review version-control handoff

| Item | Value |
|---|---|
| Status | Closed |
| Owner verification pending | no |
| Owner decision | Initial preparation was followed by explicit authorization on 2026-11-19 to review, commit locally and complete the transfer. |
| Contract | [Maintenance plan, decision D7 and slice S1](SIGMA_DOCUMENTATION_SYSTEM_MAINTENANCE_EVOLUTION_PLAN.md) |

## Installed layout and recovery

The Shaban repository owns `sigma-erp/workspace/`. The Sigma workspace uses
directory junctions for `.agents` and `reviews`, and file symbolic links for
`AGENTS.md`, `GEMINI.md` and `PROJECT_MAP.md`. Each pair resolves to the same
filesystem object. Run Git commands in the owning repository.

The documentation baseline is `1dea05ceba9e8043fe55e98593e782ef401be72c`.
The transfer is `c008a2a84f2b0b8b5de47eac8285ee457d647b39`. All 2,203
transfer blobs were read back from that commit and matched their original
SHA-256 values, including the entry, companion and approval contract.
The live and original trees also matched before the closure records were edited.
The previously empty `reviews/Workshop/` has a tracked placeholder so a fresh
checkout recreates all 238 directory paths.
The original files and directories are retained locally under
`F:\My Work\Sigma\.codex-build\documentation-handoff-20261119\originals`.

## Original preparation record

The pre-cutover transfer snapshot is in
`F:\My Work\Sigma\.codex-build\documentation-handoff-20261119\workspace`.
The adjacent `manifest.csv` records each workspace-relative file path, length
and SHA-256. The package contains exactly the three entry files
(`AGENTS.md`, `GEMINI.md`, `PROJECT_MAP.md`) and the complete `.agents` and
`reviews` directories, including historical evidence. Filesystem timestamps
are outside the content comparison.

The selected destination was `sigma-erp/workspace/` inside the Shaban repository.
This keeps the three files and both directories together and preserves their
relative layout. The repository's existing top-level personal `AGENTS.md`
remains a separate file.

## Original cutover checklist (completed)

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
