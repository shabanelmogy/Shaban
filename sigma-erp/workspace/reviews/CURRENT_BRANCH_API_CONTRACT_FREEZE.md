# Current working branch — API contract freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Plan | `CURRENT_BRANCH_MAINTENANCE_EVOLUTION_PLAN.md` |

## Endpoints (`SiGma.ServerAPI`, `[Authorize]`)

| Method | Route | Request | Response |
|---|---|---|---|
| GET | `CurrentBranch/Mine` | — | `Result<CurrentBranchVM>`; `entity` is `null` when the user has not chosen a branch yet |
| PUT | `CurrentBranch/Mine` | `CurrentBranchSaveVM { branchId: number }` | `Result<CurrentBranchVM>` with `message = SuccessedToSave`; `isSuccess: false` + `NotFound` (404) when the branch does not exist, is inactive or deleted, or belongs to another tenant |

`CurrentBranchVM { branchId: number; branchName: string }`. It is read-only and holds only what the top bar and editors need.

`CurrentBranchSaveVM` carries client input only: `branchId`. The user and the tenant come from the token (`ClaimTypes.Name`, `ClaimTypes.NameIdentifier`), never from the payload.

## Persistence

`UserBranchPreference : EntityBase`:
- `UserName` (required, max 256): the `ClaimTypes.Name` value.
- `BranchId` (required FK → `Branch`, restrict delete).
- Unique `(SubscriptionId, UserName)` filtered `[IsDeleted] = 0`.

One row per user per tenant. The row is saved through `IServiceHelper.UpsertByKeyAsync`, keyed by `UserName` and scoped to the current user, with one `SaveChangesAsync`.

## Angular consumers

- `CurrentBranchService` (`shared/service/current-branch.service.ts`): `branch()` signal, `defaultBranchId()`, `load()`, `change(branch)`, `applyDefault(control)`.
- `NavbarComponent`: the top-bar dropdown.
- 18 editors listed in the plan, section 3.

## Invariants

- Fallback order for the current branch: server preference → login `branchId` → none.
- The default applies only in create mode and only to an empty control.
- A failed save keeps the previous branch selected. The error interceptor shows the message (UI block 22).
