# Topbar Profile maintenance and evolution

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-18 |
| Scope | First implement confirmed menu repairs; then implement screenshot workflows when their identity contracts are available. Freeze applies to slice 1 only. |

## Decisions and existing state

The owner explicitly selected repairing the current menu first, then requested all screenshot functions. Preserve both instructions in that order. Phase0 review is `TOPBAR_PROFILE_FEATURE_REVIEW.md`. Initial recipe drift check passed for all eight packets. The mandatory screen skill and UI1/13/23/24/25/27, Master1/2/4/7 and actual shared EditorDialog source were consulted. No builds/runtime commands are authorized.

| Area | Existing owner | Classification / target | Evidence / reason |
|---|---|---|---|
| Menu | UserInnerComponent | Refactor current menu | Invalid `/crafted` destinations, static project count/presence, literal English |
| Session details | AuthService, Login | Extend presentation only | Display existing name, email, phone, type, branch, optional company code; never infer username or surname from name |
| Profile display | TopbarComponent + shared EditorDialog | Create a read-only modal | Keep dialog outside the dismissible menu; no API write or invented profile route |
| Unavailable items | Existing menu | Keep, explicitly disabled and labelled unavailable | Preserve existing menu inventory without suggesting that placeholders are operational |
| Help | Existing Administration guide | Extend topic + menu link | Existing `/UserGuide/administration` reader/sidebar entry |
| Identity workflows | External `baseLoginUrl` | Blocked pending actual contract | Frontend calls `auth/consolelogin`; local Security route differs |
| Communication | Canonical AGENTS.md | Extend Arabic writing preference | Explicit owner instruction; no application RTL change requested |

## Alternatives and impact

Choose the shared read-only session dialog over routing to an administrative user editor: token IDs and the local integer user IDs are not a confirmed identity mapping. Keep unsupported menu entries disabled rather than navigate them to unrelated settings. No tenant/access policy, password handling, storage or remote request behavior changes. Existing menu geometry/theme owner remains; remove dead style rules for removed static indicators and use logical positioning. No new generic shell or reference-module edits.

Slice1 consumers: Topbar, UserInner, LayoutModule, English/Arabic vocabularies and Administration guide. Preserve existing unrelated purchase-request/order changes. No backend, API, database, mapping or calculation changes in this slice.

## Frozen slice 1 contract and conformance

| Concern | Book / actual reference | Shared owner / target |
|---|---|---|
| Dialog | UI13; `shared/components/editor-dialog/editor-dialog.component.ts` and `.html` | mode=view, primaryActionVisible=false, contentPadded=true, width=640px, maxHeight shared viewport bound; translated title/subtitle/Close; close and Escape same handler |
| Read content | UI1/13; `Workshop/Job/components/close-job/close-job.component.html` read fields | `sigma-editor-scroll`, `sigma-editor-grid`, `sigma-field`, `sigma-field__read`; auto-height flex-fill composition; no feature field/frame CSS |
| Dialog registration | UI1; LayoutModule imports | Import the actual standalone EditorDialogComponent into the module declaring Topbar |
| Focus | UI27; shared PrimeNG modal | Keyboard native avatar button; focus that visible trigger before opening so dialog restores to it after menu dismisses |
| Source fields | `auth/models/login.ts` | name/nameLocalized, email, phone, typeName, branchName/branchNameLocalized, optional subscriptionCode; missing shown as translated not provided; no token rendered |
| Text | UI23; existing `en.ts`/`ar.ts` composition | New `profileMenu` namespace in both; preserve unrelated edits; run scoped translation parity |
| Presentation | UI24/25; existing shared menu owner | Token styles; native disabled semantics; no static projects count or online state; branch label from current Login emission |
| Guide | Master7; existing `administration-guide.ts` | Bilingual topic describing available read-only session details and unavailable workflows; no new reader/sidebar |

Route contract: no profile route added. My Profile emits an event from UserInner to Topbar and opens a modal. Help navigates `/UserGuide/administration`. Settings/projects/subscription/statements remain labelled disabled until implemented. Logout keeps the existing auth method.

## Full screenshot workflow blocker

| Workflow | Needed source / unresolved contract |
|---|---|
| Linked accounts | Authoritative identity API list/link/switch/unlink, verified ownership, group/session rules and tenant context |
| Change password | Actual deployed identity password-change contract and session revocation semantics |
| Login attempts | Authoritative audit producer, current-user scope, pagination, retention and browser/IP/timestamp fields |
| Profile picture / My Settings | Current-user identity mapping and authoritative read/write/upload contract; local User editor alone does not prove which identity is signed in |

The owner has been asked for the source path or API contract of the deployed login service. The reply concerned Arabic response direction and did not provide that dependency. Do not invent an identity backend or silently redirect credential writes to the nonmatching local Security API. These workflows remain blocked while slice1 proceeds.

## Execution / acceptance

Slice1: phases1/3/5/6 scoped to presentation, registration, translations and guide. Phase2 grid and phase4 domain transitions are not applicable. Verification: source/diff, exact shared exports/inputs, template bindings, paired translation keys, route references and absence of fake indicators; owner verifies keyboard/focus, Arabic/English, light/dark, narrow viewport, dialog scrolling and logout. No migration/commit required or run. No new reusable implementation rule established; no book/skill change needed.

## Owner scope change — 2026-10-18

Owner instruction **"طبق المتاح واجلها مع نقطة الصلاحيات"** confirms delivery of slice1 and explicitly defers the identity-dependent screenshot workflows to `Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`, section **Topbar Profile and account lifecycle follow-up — owner deferral (2026-10-18)**. The earlier API-blocker section is retained as historical evidence and as a future resume gate, not as an open dependency for the narrowed current deliverable.

The authorization plan already records the owner's2026-10-16 confirmation of subscriber-only current authentication and absence of a confirmed independent tenant-user session. Current-user photo/settings writes must therefore wait for the same stable actor mapping as account linking/password/audit work. Keep the existing administrative User editor for explicitly selected records; do not convert it into a self-profile endpoint by matching unverified fields.

Slice1 is source-complete with runtime acceptance pending. The only additional application change is the Administration guide note explaining the owner-approved deferral. No domain/API/schema/security contract changes, no new plan implementation authorization and no automatic resumption of authorization work.
