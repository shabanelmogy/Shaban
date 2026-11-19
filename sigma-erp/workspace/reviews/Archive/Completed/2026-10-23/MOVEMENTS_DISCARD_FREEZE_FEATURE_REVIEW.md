# MOVEMENTS discard-freeze continuation review

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Scope and authority

This continuation reviews the current Angular sources under
`SiGmaAngularFrontEnd/src/app/modules/Movements` against the existing frozen
Movements contract and the canonical UI 10, UI 18, UI 22 and UI 28 rules. The
recipe drift check passed for PLAN-00 and phases 00 through 06 on 2026-10-09.
The historical `MOVEMENTS_FEATURE_REVIEW.md` and
`MOVEMENTS_FRONTEND_CONTRACT_FREEZE.md` remain authoritative records; this file
records only the current discard/upload-state reconciliation.

## Confirmed findings

| Finding | Evidence | Decision |
|---|---|---|
| Editors restore controls with `form.enable()` after discard, which can enable controls intentionally disabled before the confirmation. | Collection, Delivery, Custody, Workshop, WorkshopMovement and NRM detail editors. | Use the shared `freezeFormState` owner during deferred confirmation and restore only the same visible editor when no save/upload cleanup is active. |
| Several dialog close subscriptions are not lifetime-bound. | Collection, Delivery and Custody `requestClose()` paths. | Add `takeUntilDestroyed` to the close decision subscription while preserving the existing route/list guards. |
| Check Card upload confirmation restores controls without preserving their prior state. | `logsMovement/components/view/view.component.ts` `closeUpload()`. | Freeze the file/target controls during confirmation and restore only when the same upload dialog remains visible and no upload is running. |
| Workshop Movement has an upload/cleanup lifecycle. | `documentsBusy()`, `DocumentUploadTracker`, `cleanupRequired`. | Never restore editor controls while upload or cleanup is active; preserve the existing cleanup workflow and payloads. |

No backend, API, route, DTO, translation, migration, accounting or permission
change is authorized by this continuation.

## Conformance references

| Concern | Canonical block/reference | Target |
|---|---|---|
| Deferred discard and state restoration | UI 10, `freezeFormState` in `shared/utils/form-state.ts` | All six movement editors use one deferred/rechecked decision and preserve disabled subtrees. |
| Upload confirmation and cleanup | UI 18, `DocumentUploadTracker` | Workshop Movement and Check Card retain existing upload/cleanup ownership. |
| Cancellation and stale identity | UI 28, existing `session`/`identity`/`loadGeneration` symbols | No stale response or obsolete confirmation may close or re-enable a replacement editor. |
| List/detail contract | Existing frozen Movements contract, Job list/editor reference | Lists, columns, payloads and routes remain unchanged. |

