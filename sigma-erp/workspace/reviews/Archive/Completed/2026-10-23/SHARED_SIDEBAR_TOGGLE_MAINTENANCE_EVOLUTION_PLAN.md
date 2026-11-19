# Shared desktop sidebar toggle maintenance plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Owner reports Import Data content under the sidebar and a sidebar that does not remain closed; explicitly requests a professional solution. This puts the actual shared sidebar toggle/minimize owner in scope. Existing Data Import business/API contracts remain Frozen and untouched.

## Inventory, cause and target

| Owner/source | Evidence and decision | Classification |
|---|---|---|
| SidebarComponent.updateProps | Sets data-kt-app-sidebar-hoverable=true from config and never clears it when false; old stored layout can restore true | Refactor: desktop minimize is click-controlled; clear the legacy hover flag centrally on config update |
| LightSidebarConfig / DarkSidebarConfig | Desktop minimize enabled, hoverable=true | Change default hoverable to false; no mobile drawer/default-open/width change |
| core sidebar SASS / wrapper SASS / RTL CSS | Minimized --bs-app-sidebar-width75 drives wrapper offset, but hoverable sidebar expands to actual full width without moving wrapper; ToggleComponent clears animating after300ms, so a pointer still over the control opens the overlay again | Confirmed source-supported explanation for reported overlap; remove hover reopening, keep existing width/offset/transition owners |
| SidebarLogoComponent | div+Metronic data-kt-toggle direct listener; no native keyboard button or expanded state | Replace this one control with native Angular button; one state owner remains existing body minimize/collapse attribute |
| Import workspace | Fifteen thin routes reuse CsvImportWorkspace; column table is already internally scrolling within bounded shared shell | Keep; do not add sidebar margins, width calculations, resize timers or per-screen opt-ins |

Current fluid container and Metronic flex-row-fluid min-width0 were inspected; a fixed-container-width or missing root flex minimum is not the established cause. Do not apply unrelated layout workarounds. No screenshots/authorized runtime verification available; owner replay remains necessary to establish complete visual resolution.

## Options and frozen contract

Retaining hover reopening preserves the demonstrated overlay behavior (rejected). Import-only sidebar exceptions duplicate global navigation policy (rejected). A fixed explicit native toggle through the existing shared owner is selected under the owner's instruction and Master5 standing presentation rule. Desktop minimized rail remains until explicit activation; startup/default-open and all current desktop/mobile width/offset/theme/RTL contracts remain. Existing localStorage is not cleared, rewritten or migrated; the sidebar owner clears a saved legacy hover flag at application time. Other Metronic controls keep their plugin. Remove data-kt-toggle only from this control to avoid dual click listeners. Native Enter/Space and click change exactly one existing body attribute; aria-expanded/aria-controls and translated Open/Minimize labels derive from that same state. Existing menu disclosure, pin controls, route highlighting and mobile drawer remain independent.

Scope: SidebarComponent, SidebarLogo TS/HTML, Light/Dark sidebar default configs; add neutral general labels and shared bilingual UserGuide guidance. No backend/entity/EF/API/parser/import/payload/data changes. UI1 owns navigation/shell; UI24/27 own button/focus semantics; UI29 owner responsive verification. Read-only references are core sidebar/wrapper SASS, ToggleComponent, compiled RTL CSS and current shared declarations. No modification to those reference files or stylesheet workaround.

Implementation: existing Phase0/1 findings/target Frozen; Phase5 replaces toggle integration and config application; Phase6 reviews source diff, labels, lifetime and responsive contracts. Phases2–4 business paths unchanged. Single sequential shared navigation workstream; no subagent gate. Existing standard components/utilities suffice; reusable guidance must update UI1 and sigma-screen-refactor with revision row, regenerate derivative packets and rerun Check. The common guide is the existing in-app owner, no duplicate viewer/menu.

Verification: source syntax, public standalone imports, exact state attribute/toggle type and absence of plugin double-binding, EN/AR parity, complete scoped diff/whitespace, book+skill+packet match. Owner: compile; click/Enter/Space repeated open/minimize; keep mouse over logo/button/menu after minimize; navigate Import Assets/Vehicles/Customers with empty and wide populated previews; both sides992px plus intermediate widths, short height, EN/AR/LTR/RTL/light/dark; mobile drawer; legacy stored hover config; other sidebar screens. No build/test/lint/browser/database/commit/push/deployment authorized. No migration needed. Source-only result cannot claim runtime/visual acceptance.
