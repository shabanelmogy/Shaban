# Topbar Profile — initial read-only review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-18 |
| Scope | Explain Linked accounts first; initial comparison of the Profile menu with the supplied screenshots. No implementation requested. |

## Manifest and authority

- Authority: Sigma AGENTS.md; Master blocks 1, 2, 4, 7; UI screen catalog, UI26 and UI30; backend preamble and backlog. Phase 0 packet drift check passed for all eight generated packets; no refresh necessary.
- Source repositories: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and `F:/My Work/Sigma/SigmaBackend`.
- Direct frontend owners: `src/app/_metronic/layout/components/topbar/`, `src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/`, `src/app/modules/auth/services/auth.service.ts`, `src/app/modules/auth/models/login.ts`, `src/app/pages/routing.ts`, `src/environments/environment.ts`.
- Direct backend inspection: `SiGma.Security/Controllers/AuthenticateController.cs`, user/application-user models, services and controllers. Searches also covered SubscriptionAPI and API controllers for linked-account terminology. No matching linked-login implementation found in that bounded search; this is not proof about the separate deployed identity service.
- Existing unrelated changes: purchase-request/order work in both repositories plus frontend translations/user guide. Ownership unknown; preserved. The inspected menu/auth files have no existing scoped diff.
- Shape: shared identity/session menu with potential identity action dialogs. This is an authentication concern, outside the ordinary five CRUD/settings/report backend patterns. It is not the accounting mapping screen named LinkAccounts. No implementation reference selected or contract frozen for a new identity feature.
- Future presentation references, if implementation is requested: UI13 shared editor dialog composition and UI22/23/25/27/28 for states, translations, theme/RTL, keyboard and cancellation. The screenshot does not select the layout.
- Existing login consumer: POST `${environment.baseLoginUrl}auth/consolelogin`, payload `{ subscriptionCode, email, password }`, response `Result<Login>`. `baseLoginUrl` points to a separate remote service. The local Security controller instead exposes `api/Authenticate/Console_login`; equivalence to the deployed service is unverified.
- Phase 0 discovery only. Contract freeze and phases 2–6 implementation are not requested. The reconciliation below covers only this initial review.
- Exclusions: code edits, adding identity contracts, full review of all security/profile operations, remote-service inspection, runtime/browser/database use.

## Screenshot metadata

Evidence E1–E8 is `C:/Users/user/Desktop/Profile/1.jpg` through `8.jpg`. English/LTR, cropped desktop UI. Product identity, role, capture date, version and current acceptance status are Unknown. Images are functional references, not source implementation or instruction authority.

### E1 — Profile menu

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Linked accounts, Change password, Login attempts, Change profile picture, My Settings, Logout | Explicit | Account-operation inventory | Discovery only; compare with current menu |

### E2 — Linked accounts submenu

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Manage accounts under Linked accounts | Explicit | Entry point to linked-account management | Discovery only |

### E3 — Linked accounts list

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Empty list; Actions, User Name, Delete; Link new account; pager and Close | Explicit | Browse/manage link records and open add dialog | Read/write contracts not present in reviewed menu/auth source |
| Switching to a linked account from Actions | Strong inference | Expected purpose of a linked-login list | Exact action and transition unproven by empty list |
| Delete removes only a link | Uncertain | Likely unlink behavior | Do not treat as proven deletion contract |

### E4 — Link new account

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Company Code, User Name, Password; Cancel and Save | Explicit | Enter credentials for another company/user identity | Future identity contract; no implementation authorized |
| Credentials verify ownership of the target account | Strong inference | Prevent linking an account the person cannot authenticate | Recommendation, not observed backend behavior |
| Account switch without retyping credentials every time | Strong inference | Convenience purpose | Reauthentication/session policy remains Uncertain |

### E5 — Password

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Current password, new password and repeat, Cancel/Save | Explicit | Password change | Catalogued only; complete vertical-slice audit deferred |

### E6 — Login attempts

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Success status, IP address, browser and timestamp | Explicit | Review login history | Catalogued only; retention/failure states unproven |

### E7 — Profile image

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| File selection; JPG/JPEG/PNG and maximum 1 MB; Cancel/Save | Explicit | Change personal image | Catalogued only; no upload contract assumed |

### E8 — Personal settings

| Evidence | Classification | Behavior | Phase / disposition |
|---|---|---|---|
| Name, Surname, Email Address, User Name; Cancel/Save | Explicit | Edit personal identity details | Catalogued only; validation and uniqueness unproven |

## Linked-account candidate contract

| Visible column | Candidate binding | Confirmed source DTO | Filter / sort / export | Status |
|---|---|---|---|---|
| Actions | Unknown action list | None found in scoped auth code | N/A | Missing; switching is an inference |
| User Name | Target user name | None found for a linked-identity list | Unknown / Unknown / Unknown | Missing |
| Delete | Link-removal action | None found | N/A | Exact semantics Uncertain |

Company Code, User Name and Password are explicit screenshot inputs. Their types, validation, tenant lookup, API endpoint, verification, link-group ownership and unlink rules are not frozen. Sigma's current login uses email rather than the screenshot's user-name field; do not silently equate the two.

## Explanation and business decisions

The supported interpretation is a person connecting multiple existing login identities, potentially across companies/tenants, so they can select a linked identity more conveniently. Example: Khaled has one account in company A and a second in company B. The reference dialog asks for the second company's code and credentials to add that identity. Successful add and actual switching were not shown.

Recommended semantics if this feature is later approved: linking does not merge company data or combine permissions; each selected identity retains its own tenant context and access. Unlink should remove the association rather than delete the underlying user. These are proposals, not verified reference behavior or approved implementation contracts. Linking should verify target-account control and session changes should be enforced by the identity backend. Password-storage or token mechanisms cannot be inferred from these images.

This is distinct from `Accounts/Link Accounts/LinkAccounts`, which owns accounting mappings, and from choosing a branch inside the current session. Do not reuse an accounting API for linked login identities because the labels resemble each other.

## Findings in current Sigma source

1. **Menu/reference gap — confirmed.** `topbar.component.html` renders `app-user-inner`. Its current template has My Profile, Account Settings, My Projects, Subscription, My Statements and Sign Out. There is no Linked accounts entry or link-management dialog wired here.
2. **Unresolved menu destinations — confirmed from routes.** `user-inner.component.html:37` links `/crafted/pages/profile`; line 52 links `/crafted/account/settings`. Neither destination nor a `crafted` parent exists in `pages/routing.ts`; the route tree ends with a wildcard to `error/404`. Runtime verification remains pending.
3. **Placeholder content — confirmed.** My Projects/Subscription/My Statements show Coming soon tooltips. Project count `3`, Online status and profile-menu text are literal template values; they do not establish working backend behavior or translated Arabic support.
4. **Separate identity boundary — confirmed.** `AuthService` holds one active `Login` subject and stores one auth user/token pair. It invokes a separate login service. No linked-account operation exists in this reviewed frontend service. The remote identity service's linked-account capability remains Unknown.

## Unresolved requirements / authorization candidates

Before implementation, confirm whether multiple identities across companies are actually needed; the identity service that owns those users; verified link/list/switch/unlink contracts; same-company linking policy; session reauthentication/revocation; company isolation; and audit requirements. Linking, switching and unlinking require backend identity/ownership checks, not just hidden menu controls. Their endpoints are currently Missing.

The canonical UI26 statement about authentication-only access is historical and does not establish current authorization behavior: current source contains authorization-related owners outside this review. No authorization mechanism was changed or claimed audited here.

## Initial reconciliation and handoff

- Source changes: none. Only this local review artifact was created.
- Scope decisions: explain Linked accounts first; keep E5–E8 as evidence inventory without claiming a full security/profile review.
- Contract, mapping, calculation, schema, migration, commit and in-app user-guide changes: none; no implementation handoff claimed.
- Both repository scoped diffs reviewed; empty for inspected feature files. Unrelated working changes preserved.
- Owner checks pending: current-menu destinations and actual behavior; remote identity-service capability; reference switching/unlink behavior.
- No subagents: the initial explanation and narrow sequential trace did not meet the independent-workstream gate.
- No builds, tests, lint, migrations, database commands, browser automation, Sigma MCP, Graphify, commits, pushes or deployments ran.

## 2026-10-18 implementation continuation

The initial review above remains the historical evidence. The owner then authorized changes, selected **current-menu repairs first**, and subsequently requested all screenshot functions. The menu slice is now **Implemented — source-only**. The overall expanded feature remains **Blocked** on the external identity API/source, not on user approval to make changes. The owner's later direction request applies to Arabic chat replies only and has been recorded in canonical `F:/My Work/Sigma/AGENTS.md`.

Frozen handoff: `TOPBAR_PROFILE_MENU_CONTRACT_FREEZE.md`. Impact/options and implementation boundaries: `TOPBAR_PROFILE_MAINTENANCE_EVOLUTION_PLAN.md`.

### Files changed by this continuation

Paths below are relative to the frontend repository:

- `src/app/_metronic/layout/components/topbar/topbar.component.ts` and `.html`: native labelled avatar trigger; current-session profile dialog; known fields only; visible trigger focused before open.
- `src/app/_metronic/layout/layout.module.ts`: register existing standalone EditorDialog.
- `src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component.ts`, `.html`, `.scss`: emit profile request, remove invalid links, preserve unavailable inventory with disabled semantics, remove static count/presence and dead CSS, translate labels, localize branch, add help link and bound menu scroll.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts`: paired `profileMenu` namespace only; unrelated existing purchase-request translation changes preserved.
- `src/app/modules/UserGuide/content/administration-guide.ts`: bilingual account-menu topic in the existing module guide.

Outside the frontend repository: canonical AGENTS communication preference plus this report and the two review/contract artifacts. No backend source changed.

### Final conformance / reconciliation for the menu slice

| Comparison | Source result |
|---|---|
| My Profile action / integration | UserInner.profileRequested output consumed by Topbar.openProfile; dialog is outside the dismissible menu |
| Shared shell public contract | Actual EditorDialog export imported by LayoutModule; visible/title/subtitle/icon/view/width/contentPadded/primaryActionVisible/closeLabel and close/Escape bindings match declarations |
| Field contract |6known Login fields shown; localized name/branch variants, translated missing values; no token, refreshToken or guessed username/surname |
| Body / bounds | Shared flex-fill scroll/grid/read-field classes; no custom modal frame; current menu has one internal scroll owner |
| Unavailable inventory | Settings/projects/subscription/statements preserved as disabled controls with translated unavailable text |
| Fake data / invalid routes | Static3project count, Online state/status dot and both `/crafted` destinations removed from scoped menu |
| Guide / route | Existing Administration guide has bilingual topic; existing sidebar and new menu help reach `/UserGuide/administration`; dashboard topic link intentionally reaches shared top bar |
| Translations | Scoped parity script:26EN/26AR,0missing in either direction,0case-only differences |
| API / security | No API/storage/session/tenant/permission changes; remote identity capability remains unverified |
| Shared extraction | Reused existing EditorDialog and editor-field owners. No new generally reusable implementation capability established; no book/skill rule added |

Phases applied:0discovery,1menu contract freeze,3read-only dialog composition,5module/menu integration,6scoped source reconciliation. Phase2grid and4domain transitions are not applicable to this slice. Screenshot-specific new write/security functions remain unimplemented, as explicitly stated in the guide.

Source verification covers exact shared declarations, current source bindings, scoped diffs, translation parity, stale menu-route/indicator references and whitespace/merge-marker checks. No compilation/runtime success is claimed. Backend scoped diff remains empty for inspected identity files; unrelated changes in both repositories preserved.

Owner checks: open avatar by keyboard/mouse; open and close profile with footer/X/Escape and confirm focus returns; view missing/long data in EN/AR and narrow/short viewport, light/dark; change working branch and reopen; help navigation and logout. No migration required. Suggested frontend commit message: `fix(profile-menu): replace broken links with session details and localize account menu`. No backend commit suggested because this task has no backend diff.

### Remaining blocker for all screenshot functions

The frontend calls a separately deployed `auth/consolelogin` service through `baseLoginUrl`. Local `SiGma.Security` instead exposes `api/Authenticate/Console_login`, and the reviewed SubscriptionAPI does not own the matching endpoint. The exact external identity source path or authoritative API contract is still needed for verified linking/switching/unlinking, password changes, login audit, current-user edits and picture ownership. The source/API question was asked; the owner's reply clarified Arabic chat formatting rather than supplying that dependency. Do not infer source equivalence from similar method names, or implement account linking by saving passwords/tokens in another browser-side account list.

No subagents were used: confirmed menu work was a small coherent slice; the remaining identity work has unresolved shared contracts and does not pass the delegation gate. All prohibited execution commands remain unrun.

## 2026-10-18 owner-approved deferral and available-scope handoff

Owner instruction: **"طبق المتاح واجلها مع نقطة الصلاحيات"**. This changes the active completion boundary: deliver the confirmed current-menu capabilities and defer identity-dependent screenshot workflows with the existing authorization work. It does not authorize implementing a new identity/session/permission model now. The earlier Blocked statements above are historical; the current scoped deliverable is **Implemented — source-only**, with owner runtime verification pending. The complete screenshot feature is not claimed implemented.

| Requested behavior | Current disposition | Evidence / owning follow-up |
|---|---|---|
| Profile menu, valid My Profile interaction | Implemented — source-only | UserInner emits to Topbar's shared read-only dialog; invalid destinations removed |
| Current account data, localized branch/name | Implemented — source-only | Existing `Login` fields only; no local-user identity inferred |
| Arabic/English menu, unavailable states, help and logout | Implemented — source-only | Paired26keys, explicit disabled placeholders, existing reader and auth logout |
| Link/manage/switch/unlink login accounts | Deferred by owner | Existing authorization plan, profile/identity follow-up section |
| Password change and login attempts | Deferred by owner | Actual identity authority plus individual actor/audit/session lifecycle |
| Profile image and My Settings editing | Deferred by owner | Resolve current account versus local tenant-user mapping first |

The owning deferred record is `Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`, section **Topbar Profile and account lifecycle follow-up — owner deferral (2026-10-18)**. The plan already preserves the owner's 2026-10-16 clarification: current authentication uses a subscriber/tenant account token, with no confirmed independently authenticated employee session. This is stronger evidence than assuming `Login.id` selects the local User record. `UserController` exposes inherited administrative record operations; it supplies no confirmed self-profile endpoint. The local User model's image/name/password fields are not proof of a current-user ownership contract. No administrative user record is selected or mutated by guessing an email/name/id match.

No additional source-supported self-edit workflow was found in the directly related contracts. All currently confirmed available menu work is delivered; no request for external service information is needed to complete this narrowed scope. The full identity API and individual-user contract remain entry gates when the owner resumes the combined deferred work.

The existing Administration user-guide topic now explicitly explains that the five screenshot functions are deferred with sign-in/permissions and that the menu shows the account used to sign in rather than a separate employee identity. Existing guide route, sidebar and help link are unchanged. No new in-app permission API or menu action was invented.

This follow-up changes only that guide note and the linked review/planning records. The previously recorded frontend implementation files remain the available deliverable. Source-only verification: generator check passed for all eight packets; no packet/source-rule changes required regeneration; scoped translations remain26EN/26AR with0missing/case-only differences; guide wording and deferred cross-links reconciled; scoped frontend diff/whitespace checked. No backend, schema, migration, mapping or calculation changes. Owner checks remain the menu/dialog/keyboard/RTL/theme/viewport/help/logout journeys above. No subagents were used for this single connected follow-up; no prohibited commands were run.
