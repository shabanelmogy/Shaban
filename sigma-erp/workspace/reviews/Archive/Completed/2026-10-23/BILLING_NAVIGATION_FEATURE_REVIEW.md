# Billing — sidebar entry and business explanation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Scope and frozen decision

Owner requests a sidebar entry below Data Entry Corrections and an explanation of Billing, with `C:/Users/user/Desktop/Billings.jpg` as functional evidence. Scope is navigation to the existing screen and explanation only; not implementing the screenshot's missing financial workflow. Preserve existing user changes in the frontend repository.

Existing `SIDEBAR_MENU_ITEMS` already has Billing immediately after Data Entry Corrections, but its link is `/Bill`, which resolves to the separate `Vouchers/Bills/Bill/bill.routes.ts` feature. Reuse that entry, point it to `/BillingInvoice`, and use existing Bootstrap Icons convention `bi bi-receipt`. Keep `sideMenu.billing` (EN Billing / AR الفوترة), top-level order and leaf behavior. No new route, screen, provider, access rule or financial operation. Discovery correction: the initial scoped read of the top of routing.ts missed the `/Bill` declaration at line1327; the complete symbol check corrected the explanation before final handoff. The repair decision remains the same because `/Bill` is a different screen.

UI selection: this change uses the existing sidebar navigation leaf, not a new editor/report shape. The destination is a legacy list/detail CRUD screen, not the completed screenshot workspace. Backend shape is current pattern1 generic entity CRUD, not pattern3 accounting or payment processing; service/controller have no feature-specific posting/payment method. UI1/23/24/26 and Phase05 own the bounded wiring change. Master2/4/5/7 govern evidence, contract and handoff. Recipe Check passed all eight packets before use; no canonical/template changes or regeneration needed.

## Screenshot evidence

Evidence B1: Billings.jpg, English/LTR, wide desktop capture, empty list state. Capture date/version/user role and current-versus-historical acceptance: Unknown. No attached-document instructions are adopted.

| Evidence | Classification | Meaning / current match |
|---|---|---|
| Billing heading, Refresh | Explicit | Billing navigation label matches; screenshot refresh behavior is not established by a static image |
| Outstanding Invoices / Cleared Invoices with counts | Explicit | Two invoice groups shown; existing Angular list has neither grouping nor these counters |
| Outstanding amount | Explicit | A top outstanding total is shown; current service has no dedicated totals contract |
| Invoice Type choices Subscription / Change Request / Project | Explicit | Source InvoiceType is Standard / CreditNote / DebitNote; this is a material semantic mismatch, not approved for change by a navigation request |
| Invoice No, Invoice Type, Date, Period, Description, Amount, VAT, Total Amount, Status | Explicit | Backend ListVM contains corresponding fields; legacy frontend displays unrelated name/sku/categoryName/createdBy/createdAt columns |
| Billing for software/service subscriptions, change requests and projects | Strong inference | Suggested by screenshot categories only; no owner/company/payment relationship in current BillingInvoice source proves the full commercial workflow |
| Automatic invoice generation, payment gateway, settlement, posting or correction-request billing | Uncertain / not source-supported | Current BillingInvoice service/controller provide generic CRUD only; no such lifecycle is claimed or implemented |

## Pre-edit conformance

| Concern | Book | Reference symbol / shared owner | Target comparison |
|---|---|---|---|
| Actual lazy destination | UI1; Phase05 | `pages/routing.ts` BillingInvoice entry → `BillingInvoice_Routes` → `BillingInvoicesComponent` | Set existing menu link to exact `/BillingInvoice` casing |
| Shared menu rendering | UI1/24 | `sidebar-menu.component.html` leaf template consumes MenuItem title/link/icon | Keep `expanded:false`, same root position; adopt `bi bi-receipt`, no private markup/CSS |
| Translations | UI23 | `sideMenu.billing` in en.ts/ar.ts | Reuse both existing values, no new keys |
| Access | UI26 | `app-routing.module.ts` authenticated layout uses AuthGuard | Preserve authentication; no invented permission mechanism |

Applied phases: bounded discovery0, freeze1, integration5 and reconciliation6. Grid2, editor3, domain-action4 and PLAN-00 are not implementation scope; missing screenshot behavior is explained rather than implemented. No subagents: one sequential menu repair does not meet delegation gate. No screen implementation/refactor is performed, so Master7's screen-guide completion gate is not triggered by this navigation-only change; no new in-app Billing guide is registered or claimed.

Business explanation: existing records hold invoice number/type/date/period/description/amount/VAT/total/status. Screenshot distinguishes outstanding from cleared and classifies commercial sources; the existing destination is incomplete and does not deliver that behavior. Creating a correction request/model has no demonstrated automatic BillingInvoice relationship. Settlement, VAT calculation, posting and commercial classification require a separate frozen feature contract before implementation.

## Final reconciliation

| Check | Source result |
|---|---|
| Menu position and destination | Exactly one `sideMenu.billing` root immediately follows Data Entry Corrections; link now `/BillingInvoice`, `bi bi-receipt`, expanded=false |
| Lazy route | Existing BillingInvoice route resolves to BillingInvoice_Routes and its list component; `/Bill` is separately retained for all existing voucher consumers |
| Shared rendering and bilingual label | Existing leaf renderer handles link/icon and unchanged EN/AR Billing label. No private template, style or new translation |
| Scoped diff | Confirmed actual frontend repository root. Reviewed complete tracked menu diff plus the full before/after snapshot diff; this task changes only two lines. Existing Administration/Support/Corrections user changes preserved |
| Source checks | Whitespace and merge-marker checks clear; recipe -Check passes all eight packets before/after. Runtime navigation and visual acceptance remain pending |
| Shared-extraction gate | Existing typed MenuItem and shared leaf template own the repeated behavior; no new capability or reusable rule to extract/document |
| Financial/backend scope | No backend/API, field, mapping, total/VAT calculation, payment, settlement or schema change. No Add-Migration required |
| Screen guide | No Billing screen implementation/refactor in scope; navigation-only change does not claim guide delivery or screenshot completion. Business limitations explained in this report and final answer |

Changed source: `SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`; local artifact: this report. Suggested frontend commit: `fix(billing): link sidebar to billing invoices`. Phase5 bounded wiring and Phase6 source reconciliation complete; skipped implementation phases are recorded above. No subagents because the task is a small sequential link repair. Builds, tests, lint, database/migration commands, browser/application verification, commits/pushes and deployment were not run.

Owner acceptance: refresh the app and click Billing / الفوترة immediately below Data Entry Corrections; confirm URL `/BillingInvoice` and its existing list. Check English/Arabic label, selected item/icon and light/dark sidebar behavior. The known legacy destination deficiencies (unrelated columns/actions, stale create/exit links, missing screenshot categories and outstanding/cleared workspace) are reported, not silently repaired or certified as complete.

## 2026-10-14 follow-up — reported missing sidebar item

Owner confirms the desired placement is an independent item immediately below Data Entry Corrections, and the open application is `http://localhost:4200/`. Retain the frozen placement; do not move Billing inside the correction group.

Source trace: MenuCatalogService.tree prepares every SIDEBAR_MENU_ITEMS entry using map, with no hiding/pruning/cache. SidebarMenuComponent initially clones the complete catalog into filteredMenuItems. Its only filter is the current searchTerm against the translated title; Arabic Billing is الفوترة. The HTML renders the expanded=false root via the shared leaf template, including title/icon/routerLink. The menu is internally scrollable and Billing is its final root item. No matching feature-specific CSS hides it. The separate Corrections expanded=false/children inconsistency does not remove the following independent Billing root and is outside this report's confirmed placement.

Read-only process inspection confirms the current Angular process listening on4200 runs from `F:/My Work/Sigma/SiGmaAngularFrontEnd`; no server restart or build was issued. Source confirms both route and root menu entry, but the exact visible-state failure remains Uncertain without a current sidebar screenshot or explicitly authorized browser inspection. Possible search/scroll/stale-page explanations remain hypotheses, not diagnosed defects. No speculative source repair or duplicated menu entry was added.

Follow-up handoff: clear sidebar search, locate the final root by searching Billing in English or الفوترة in Arabic, and refresh the loaded page. If the item remains absent, obtain a screenshot including the sidebar search and final entries to identify the actual missing state. No application-source changes, builds/tests/lint/browser commands, process termination or restart were performed in this follow-up. The previous navigation source repair remains Implemented — source-only with visual verification pending.

## 2026-10-14 continued follow-up — frozen sidebar-height repair

Owner repeats that Billing is absent, explicitly authorizes browser inspection without Save/Build, then identifies the sidebar scrollbar extending below the screen. Browser connection exposes no localhost tab; Windows helper list_apps fails because the configured app-server path is missing. No successful live capture or app input occurred. This is a tooling blocker for visual acceptance, not permission to fabricate it.

Confirmed source defect: `ScrollComponent.getAutoHeight` subtracts viewport dependencies and wrapper margins/padding. SidebarMenu's dependencies contain the logo/footer but omit its fixed search panel. Thus the search height is added above a viewport-sized menu and the final root can be clipped by the existing overflow-hidden parent. Its wrapper selector `#kt_app_sidebar_menu` also names no current element. The owner observation supplies written visual evidence; final reproduction remains pending.

Frozen minimal repair: assign the search panel id `kt_app_sidebar_menu_search`, include that id in `data-kt-scroll-dependencies`, and add the existing expected `kt_app_sidebar_menu` id to the menu host. Reuse the current ScrollComponent without changing its generic algorithm, save-state, 5px offset, existing margins, menu search/disclosure/pins, route or Billing order. No screen-specific height calc/CSS or new resize timer. The one shared sidebar applies to all routes and both themes/directions.

| Concern | Owning book / actual reference | Target decision |
|---|---|---|
| Complete fixed-height dependencies | UI1; `_ScrollComponent.ts:getAutoHeight` | Declare actual logo/search/footer dependencies; hidden/missing elements remain ignored by existing owner |
| Existing wrapper contract | UI1; ScrollComponent wrapper selector + SidebarComponent template | Attach expected id to actual app-sidebar-menu host; no copied spacing |
| Scroll/viewport bounds | UI1/29; fixed sidebar SASS, existing scroll-y/my-5/offset5 | Keep current internal scroll owner and geometry; subtract the visible search's measured height |
| General guide | Master7; SHARED_SCREEN_GUIDANCE | Explain sidebar-internal scrolling and access to the final Billing item in EN/AR |

Shared-extraction/learning: reuse the existing generic ScrollComponent; no new component. Record the verified dependency completeness rule in UI1 and the skill plus history; regenerate affected packets through the generator and rerun Check. Applied scope remains Phase5 shared wiring plus Phase6 reconciliation; no backend/accounting change, migration, build/test/lint, server restart or business Save.

Sidebar-height repair reconciliation: source now declares search id/dependency and the actual host wrapper id; full scoped diffs in frontend and documentation repositories reviewed, whitespace/merge checks clear. Common guide EN/AR adds bottom-item reachability once via the existing reader; no new route/menu. UI1/skill/history synchronized. Generator refreshed the eight recipes; semantic diff changes only UI1 fingerprints in phases00/02/03/05, with reference roles and procedures retained, and final Check passes all eight. Scroll height now subtracts the measured search region; margin/offset/save-state remain existing owners. Responsive acceptance remains pending across short/normal heights, both sides992px, minimized/expanded, EN/AR and light/dark. The Windows helper remained unavailable after retry/reset; no live capture/input succeeded. No Build/test/lint/migration/database/commit/push/deploy command was run. Source changed sidebar.component.html, sidebar-menu.component.html and shared-screen-guidance.ts; docs changed UI1/skill/revision history/changelog and generated fingerprints. Suggested frontend commit: `fix(sidebar): account for search in menu scroll height`; documentation: `docs(sidebar): record measured menu scroll dependencies`. No agents were needed for this bounded repair.

Owner clarification after this repair: the Billing menu must open the screenshot's outstanding/cleared workspace, not merely expose the legacy BillingInvoice list. The earlier navigation-only interpretation is superseded; the workspace discovery/freeze and implementation are recorded separately, preserving this history and the shared scroll repair.
