# Current working branch — Maintenance / Evolution Plan

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Owner instruction | "Make a plan, implement it, and record what is deferred with the permissions" |
| Reference product | Speed (app.speedautosystems.com), observed in the owner's demo tenant 2026-10-01 |
| Guides | Master Guide (PLAN-00 content, blocks 4 and 7); backend blocks 1–6 and 16; UI blocks 1, 2, 16, 22, 23, 26; `sigma-screen-refactor` skill. Generated packets are stale (drift check), so the books were used directly |
| Contract | `CURRENT_BRANCH_API_CONTRACT_FREEZE.md` |

## 1. Evidence: what Speed does

| Step | Observed |
|---|---|
| Change | `POST /api/services/app/user/UpdateUserLocation?locationId=…` stores the branch **on the user, on the server**, then the page reloads |
| Read | `session/GetCurrentLoginInformations` returns `user.locationId` and `user.branchAccess`; screens read `appSession.user.locationId` (381 uses) |
| Uses | Default branch of new documents; forced list filter when the user may not view other branches; edit/delete lock on another branch's rows; branch forced on save without "all actions on other branch" |
| Access | `branchAccess` 3 = all branches, 2 = selected branches, other = own branch only (no dropdown); permissions per document (`ViewOtherBranchInvoices`, `AllActionsOnOtherBranchAgreements`, …) |

## 2. Existing state in Sigma (Existing-State Audit)

| Area | Today |
|---|---|
| Top-bar dropdown (`navbar.component.ts`) | Stores the choice in `sessionStorage` and in the in-memory user only; **no screen reads it**, nothing is sent to the API |
| Login | External login server (`environment.baseLoginUrl`, `auth/consolelogin`, not in this workspace) returns `branchId`/`branchName` of the user; stored in `localStorage` (`AuthService`) |
| ServerAPI token | `ClaimTypes.Name` = user, `ClaimTypes.NameIdentifier` = tenant (subscription); **no branch claim** |
| Backend use of branch | Only explicit per request (document `BranchId`, list/report filter `branchId`) |
| Editors with a branch field | 23 create/edit editors; none defaults the branch |
| Authorization | None beyond authentication (deferred plan `Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`) |

## 3. Impact map and classification

| Item | Class | Notes |
|---|---|---|
| Per-user current branch stored on the server | **Create** | New entity `UserBranchPreference` (tenant + user name → branch), settings pattern (backend block 16, several rows keyed by user, persisted through `IServiceHelper.UpsertByKeyAsync`) |
| `CurrentBranch` API (`GET/PUT CurrentBranch/Mine`) | **Create** | Same route shape as single-row settings (`getMine`/`saveMine`, UI block 2) |
| Login branch | **Keep** | Owned by the external login server; it is the fallback until the user picks a branch |
| Top-bar dropdown | **Refactor** | Reads and writes through a shared `CurrentBranchService`; no `sessionStorage`; failure restores the previous branch |
| New-document default branch | **Extend** | 18 transactional editors fill an empty branch field with the current branch on create (list below) |
| List/report filter default | **Deferred** | In Speed it is forced only for users who may not see other branches: an authorization rule |
| Branch access, permissions, server enforcement | **Deferred** | Recorded in the authorization plan (section 6) |
| Customers editors, `Fleet/Vehicle` editor | **Deferred (scope)** | Being edited by other sessions; same one-line adoption later |

### Editors adopting the default (create mode only, empty field only)

Equipment Quotation · Rental Quotation · Custody Movement · Stock Transfer · Bill · Credit Note · Debit Note · Goods Received Note · Limousine bulk invoice · Journal Voucher · Payment · Purchase Order · Purchase Request · Purchase Return · Receipt · Work Order · Rental Booking deposit · Rental and Lease agreement deposits (fallback only when the agreement gives no branch).

Not adopted, with the reason: Payment Methods and Vehicle QR Label (configuration/printing, not documents), Staff and Sales Fleet (master data, where the branch is an assignment rather than a working context), and reports and lists (deferred filter rule).

## 4. Decisions (reviewer decisions under the owner standing rule, Master block 2 rule 6)

| # | Decision | Evidence / rejected alternative |
|---|---|---|
| R1 | Store the choice in the **Sigma DB**, keyed by tenant + `ClaimTypes.Name`, not on the login server | The login server is outside this workspace; ServerAPI identifies the user only by `ClaimTypes.Name` (audit `CreatedBy`, agreement services). A login-server field was rejected (cannot be changed here) |
| R2 | No page reload after a change (Speed reloads) | Angular reads the branch when an editor opens; open lists keep their filters. A reload would discard unsaved work |
| R3 | Default fills only an **empty** field in **create** mode; the user can change it | Never overrides an agreement's branch or a value the user chose; no effect on edit/view |
| R4 | Validation: the branch must exist, be active and belong to the tenant | Tenant scope comes from the repository query filter; inactive or deleted → `NotFound` |
| R5 | Existing localization keys only (`NotFound`, `SuccessedToSave`) | `GeneralMessage.resx` has uncommitted edits by another session |
| R6 | No `DbSet` edit: the sealed EF configuration registers the entity (`ApplyConfigurationsFromAssembly(…, IsSealed)`) | Keeps `SiGmaDbContext.cs` untouched |

## 5. Migration

New table `UserBranchPreferences`. The owner runs `Add-Migration AddUserBranchPreference` and updates the database (Master block 7). Until then `GET/PUT CurrentBranch/Mine` fail and the UI falls back to the login branch. That failure is handled; it does not block the dropdown.

## 6. Deferred: recorded in the authorization plan

Branch access level per user (all / selected / own), a selectable-branches list per user, a forced list/report filter for restricted users, "view / all actions on other branch" permissions per document, server-side enforcement on read and write, hiding the dropdown for own-branch users, and an optional confirmation when changing branch. See `Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`, section *Branch access*.

## 7. Phases

| Phase | Scope | Status |
|---|---|---|
| P1 | Backend entity, configuration, VMs, profile, service, controller | Implemented — source-only (this task) |
| P2 | Angular `CurrentBranchService`, top-bar dropdown, 18 editors | Implemented — source-only (this task) |
| P3 | Customers editors and `Fleet/Vehicle` (other sessions) | Pending |
| P4 | Branch access and permissions | Deferred with authorization |
