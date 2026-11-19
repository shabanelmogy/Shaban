| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Owner-pasted Angular Users template errors, 2026-10-17 |

The pasted compiler output authorizes correction of the existing User editor integration. Preserve the frozen authorization configuration contract: profile and access save separately; permission enforcement remains deferred. No API, DTO, database or layout redesign.

| Concern | Book | Reference / shared owner | Planned match |
|---|---|---|---|
| Alias scope | UI29; installed Angular17 compiler diagnostic | access-editor workspace nullable signal | Nested primary @if inside final @else |
| Image field | UI18 | FileFieldComponent; DocumentUploadTracker; IndividualPartner details finishAttachments | Register component and editor tracker; store path directly; remove obsolete local upload |
| Save/cleanup | UI18/22 | DocumentUploadTracker.finishSave/discard | Block repeated committed Save, retain failed cleanup and retry cleanup only |
| Exit | UI10/28 | existing User canDeactivate; freezeFormState | Deferred confirmation then discard cleanup; preserve access dirty gate and list query |

PHASE03 packet checked current (all eight packets green). Phases0/1 narrowed to existing contracts,3 and6 applicable; backend/list/domain-action redesign skipped. No subagents: small, coupled editor repair. Source-only checks; owner compilation/runtime pending.

## Final reconciliation

All four conformance rows above now match the inspected owners. The nullable workspace alias belongs to a nested primary @if, which removes the invalid @else-if alias and its cascading data-property errors. FileFieldComponent is registered in the standalone imports and receives an editor-scoped DocumentUploadTracker. The unused local File control, legacy uploadFile path and onFileChange handler were removed from the component only; existing wire DTOs remain unchanged.

The real cleanupFailed/profileCommitted signals and retryCleanup now own the existing template bindings. Successful profile save commits the submitted image reference before cleanup. Failed cleanup keeps the form frozen and blocks Save/exit/access changes; Retry repeats finishSave or discard only. Accepted cleanup closes without treating the cleanup operation's still-pending signal as a new blocker. A successful profile save with dirty access selections keeps the editor available for the independent access Save. Discard waits for unsaved-image cleanup and preserves saved images. Cleanup failure selects the visible profile tab for feedback. Uploads and cleanup participate in complete busy gates.

Changed application files (repository F:/My Work/Sigma/SiGmaAngularFrontEnd):
- src/app/modules/Administration/Users/components/access-editor/access-editor.component.html
- src/app/modules/Administration/Users/components/details/details.component.ts
- src/app/modules/Administration/Users/components/details/details.component.html
- src/app/modules/i18n/vocabs/authorization.ts (new cleanup key in both languages)
- src/app/modules/UserGuide/content/administration-guide.ts (bilingual image, independent saves and cleanup Retry topic)

Existing user/role changes were present before this repair and retained. Complete tracked scoped diff reviewed against the repository root; untracked access template and bilingual vocabulary inspected directly. Source parser review-users-source.cjs parsed three TypeScript files and two Angular templates with zero syntax errors. Scoped git diff --check passed; no stale local upload members or merge markers in the two component directories. Vocabulary en/ar imports confirmed. These checks do not certify template type checking or application compilation.

Backend/API/AutoMapper/domain-calculation changes: none. Migration: none. Screenshot interpretation: not applicable, owner supplied compiler diagnostics. No unresolved contract choices in this repair; runtime and visual acceptance remain pending.

Owner checks: rebuild the frontend; open an existing user's profile and access tabs; replace/remove an image and Save; preserve dirty access selections across profile Save; cancel a draft image; simulate failed cleanup and Retry, observing that no second user POST/PUT is sent; verify busy/disabled feedback and EN/AR guide at /UserGuide/administration. Browser, build, tests, lint, database/migration commands, commits, pushes and deployment were not run.

Suggested frontend commit: fix(users): complete profile upload cleanup and template integration.
