# App shell — TopBar and Footer — Feature Review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Scope | `_metronic/layout/components/{header,header/navbar,footer}`, `_metronic/partials/layout/{extras/dropdown-inner/{user-inner,notifications-inner},theme-mode-switcher}`, `layout.module.ts`, `extras.module.ts`, `theme-mode.module.ts`, `topbar` / `appFooter` blocks in `en.ts` / `ar.ts` |
| Repository / branch | `SiGmaAngularFrontEnd`, applied to `review-movements` working tree (uncommitted) |
| Guides | Master Guide; UI blocks 1 (*Shell vertical insets*), 22, 23, 24, 25, 27, 30; `sigma-screen-refactor` skill |
| Packet drift | All generated packets stale (see `DASHBOARD_FEATURE_REVIEW.md`); canonical books used directly |

## Owner decisions (2026-10-01)

| # | Decision | Answer |
|---|---|---|
| D1 | Scope | The bar and its menus (branch, language, theme, notifications, account) plus the footer |
| D2 | Notifications (Metronic demo data, permanent red dot) | Keep the bell with an honest empty state |
| D3 | Languages (7 listed, 2 maintained) | English and Arabic only |
| D4 | Footer content | One brand line plus one support link |

## Findings and resolution

| # | Before | Rule | Resolution |
|---|---|---|---|
| F1 | All bar and menu text was English literals | UI 23 | `topbar.*` and `appFooter.*` keys in en/ar (32 keys); parity check 0/0/0 |
| F2 | Feature palette of hex colours with a hand-copied dark block in four stylesheets | UI 24, 25 | Only `--sigma-*` tokens (plus `--bs-danger` for sign-out); no dark copies needed |
| F3 | 7–9px text | UI 27 | ≥ 0.7rem |
| F4 | Physical `left`/`right` with RTL overrides; dead `[isRtl]="false"` input | UI 25 | Logical properties; input removed |
| F5 | 7 languages listed; 5 are stub vocabularies | UI 23 | en/ar only; a stored stub language displays as English |
| F6 | Always-on red notification dot; demo alerts/logs | Correctness | Dot and demo data removed; `app-state-message` empty state; settings link kept (`/Settings/notificationsSettingsModel` exists) |
| F7 | Account menu linked to `/crafted/pages/profile` and `/crafted/account/settings` (no such routes → 404); "My Projects 3", "Subscription", "My Statements" placeholders; fake "Online" status | UI 3 (no non-functional placeholders) | Reviewer decision (owner standing rule): the menu shows identity (initials, name, role, email), current branch and Sign out only |
| F8 | Branch list had no error/loading handling | UI 22 | `branchState` loading/ready/error with `app-state-message`; both failure channels handled |
| F9 | Font Awesome icons in the bar | Backlog 15 | Bootstrap Icons |
| F10 | Sidebar toggles were `div`s with English `title`; dev size badge used inline styles and an unlabeled button | UI 27, 24 | `<button>` with translated `aria-label`; badge styled in SCSS, hidden under 992px |
| F11 | Footer: three links to one WhatsApp URL, "Purchase", no `rel` | UI 23, 27 | Brand line + one Support link, `rel="noopener noreferrer"`, new-tab hint for screen readers |

## Invariants kept

- **Header and footer heights unchanged.** About 34 legacy screens still reserve `--bs-app-header-height` / `--bs-app-footer-height` in page calcs (UI 1, backlog 35). The footer keeps `py-3` and a 36px action row, and uses an inset shadow line instead of a border.
- The user-menu trigger is always rendered, because Metronic binds menu triggers once at header init.
- `toolbar.component.ts` (being edited by the Customers session) was not touched.

## Doc-worthy rules for the owner

1. UI block 1 *Shell vertical insets*: a header/footer restyle must not change their rendered height while legacy calcs exist; use inset shadows, not borders.
2. UI block 23: the language switcher lists only maintained vocabularies (en, ar).
3. UI block 30: add "Metronic demo content in the shell (notifications, account menu)" as resolved, or record remaining demo partials (`quick-links-inner`, `search-result-inner`, legacy `topbar` component).

## Owner change after implementation (2026-10-01)

The owner preferred the previous TopBar ("the first was better") and kept the new footer.
Everything under F1–F10 that touched the header, navbar, theme switcher, user menu,
notifications menu, `layout.module.ts`, `extras.module.ts`, `theme-mode.module.ts` and the
`topbar` translation block was **reverted** to `HEAD` (reverse patch). Only F11 remains
applied: `footer.component.{html,scss,ts,spec.ts}` and the `appFooter` block in en/ar.
The TopBar findings stay valid as a backlog for a later pass with a design the owner approves.

## Header background (2026-10-01, owner option A)

Header surface only, in `src/styles.scss` after the toolbar band override. Metronic's header
variables (`--bs-app-header-{base,minimize,sticky}-{bg-color,box-shadow}`) are set to
`--sigma-surface`, with an inset `--sigma-border` hairline and a soft shadow, in light and dark.
Before, the header used `$body-bg`, the page colour, so it blended into the page. No
header markup, button or height change.

## Verification

Source-only. Build, tests, lint and browser verification were not run and remain pending for the owner.
