# Topbar Profile menu contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-18 |
| Frozen handoff | Current-menu presentation repairs only |

The owner selected current-menu repairs first, then requested the screenshot functions. The latter are a separate blocked identity integration slice, not part of this frozen handoff. See `TOPBAR_PROFILE_MAINTENANCE_EVOLUTION_PLAN.md` for discovery, alternatives, impact and source conformance evidence; `TOPBAR_PROFILE_FEATURE_REVIEW.md` preserves screenshot classification and initial findings.

Frozen inputs: existing `Login` name/nameLocalized, email, phone, typeName, branchName/branchNameLocalized and optional subscriptionCode. No secrets displayed, inferred username/surname, derived counts, API calls or editable fields. Missing data has translated text. Name and branch follow existing language selection.

Frozen interaction: native keyboard-operable avatar trigger; My Profile emits from UserInner to Topbar, opens shared EditorDialog in read-only mode outside the dismissed menu; title/subtitle/Close translated; Close/X/Escape close without mutations. Move focus to the visible avatar before opening so PrimeNG can restore it. No new profile route. Existing invalid `/crafted` links removed. Settings/projects/subscription/statements retained disabled with explicit unavailable text. Existing logout retained. Help opens existing Administration guide.

Frozen composition: actual EditorDialog standalone export registered in LayoutModule; view mode, contentPadded=true, primaryActionVisible=false, width640px, shared viewport bounds and responsive breakpoints. Shared `sigma-editor-scroll flex-fill`, `sigma-editor-grid` with2columns and `sigma-field__read` own content presentation. Menu uses current shared owner/token styles with logical placement and bounded internal scrolling; no fake online state or count.

Translations: `profileMenu` namespace in en/ar, matching26keys. Guide: bilingual topic in `administration-guide.ts`, existing reader `/UserGuide/administration` and existing sidebar entry. No permission/tenant contract, API, mapping, calculation, entity or schema changes. No migration required.

Verification gate: exact public shared exports/inputs and NgModule registration; scoped source diff; translation parity; references to removed destinations and indicators absent; owner browser/keyboard/RTL/theme/scroll/logout verification pending. No build/test/lint/database/browser commands permitted or run.

## Owner disposition update — 2026-10-18

After this freeze, the owner explicitly instructed delivery of the available behavior and deferral of identity-dependent screenshot functions with permissions: **"طبق المتاح واجلها مع نقطة الصلاحيات"**. This preserves the frozen menu contracts and narrows the current completion scope. The in-app guide now states that deferral; the combined future owner is `Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`. The historical screenshot requirements remain recorded, not removed or claimed complete.
