# Email editor and vehicle QR compiler repair

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Scope | Three frontend file changes; owner-supplied compiler errors |

Tier S compatibility fix. Applied PHASE-05 standalone registration and PHASE-06 scoped source reconciliation under Master5 and UI1. Domain/grid/editor redesign phases are not applicable; no business/API/schema/route/translation change.

## Evidence and correction

| Consumer | Installed declaration / owner | Correction |
|---|---|---|
| Administration/emailTemplates/components/list/list.component.ts | ngx-editor17.5.4 public_api exports NgxEditorModule; editor.component and menu.component declare standalone=false; editor.module exports both ngx-editor and ngx-editor-menu | Import/register NgxEditorModule instead of direct NgxEditorComponent and nonexistent NgxEditorMenuComponent |
| Same component HTML | NgxEditorComponent public inputs are editor, outputFormat, placeholder; disabled is not a public input. Reactive forms own its disabled state through CVA | Remove unsupported constant [disabled]="false"; retain formControlName and editing behavior |
| Fleet/VehicleQRLabel/components/list/list.component.ts | angularx-qrcode17.0.1 public-api exports QRCodeModule; QRCodeComponent standalone=false; module exports qrcode | Import/register QRCodeModule instead of direct QRCodeComponent; retain QR data, dimensions, error correction and print behavior |

These installed declaration files are the implementation references for the compatibility repair; canonical visual references are unaffected. No new helper/extraction or library upgrade is needed. The established skill/UI1 rule already covers exported names, installed Angular metadata and NgModule registration; no new governance rule introduced.

Complete scoped diff reviewed in `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Preexisting Save button icon in EmailTemplates was preserved and excluded from this task's change. Frontend source syntax parsing inspected both TS files and both HTML templates: four files, zero syntax errors. Registration and public input names were compared directly with installed .d.ts files; parser checks do not certify compilation. Scoped whitespace check clear. Recipe -Check passed, no packet drift or regeneration needed. No backend changes or migration required.

Existing Fleet in-app guide describes the unchanged /VehicleQRLabel workflow; this import-only repair introduces no user-facing steps, labels or state change requiring a guide revision. No broad screen refactor or guide retrofit performed.

Owner verification: rerun the previously failing build; then open Email Templates, confirm editor/menu and manual Save work, and generate/print Vehicle QR labels. Runtime, compilation and visual acceptance remain pending. No build/test/lint/browser/database/migration/commit/push/deployment was run. No subagents used: three small dependent import/binding fixes do not meet the delegation gate.

Suggested frontend commit (only these repair hunks): `fix(ui-imports): register editor and QR modules correctly`.
