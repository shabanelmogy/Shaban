| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Administration icon maintenance

Authority: owner request “ظبط كل ايقونات src/app/modules/Administration”; Sigma AGENTS.md, Master4/5/7, UI24/25, sigma-screen-refactor skill, PLAN-00 and PHASE-06. Recipe drift check passed before packet use. Icons-only presentation scope; existing list/editor/settings/operational-log/import shapes remain. No backend, DTO, permissions, route, validation, business-action or layout change.

## Impact map and frozen contract

| Area | Classification | Contract |
|---|---|---|
| Administration TS action definitions | Extend / Refactor | Add missing ButtonModel icons for existing recognized actions; normalize glyphs without changing ids, handlers, labels, classes or disabled state. |
| Administration HTML | Refactor | Replace legacy PrimeIcons; canonical action glyphs; decorative i elements aria-hidden. Icon-only buttons get translated names describing their existing action. |
| Settings | Refactor | Same standard glyphs; Generate Key uses bi-key. Preserve existing nav and semantic feature icons. |
| Shared Buttons template | Extend | aria-hidden on the existing decorative icons; optional icon contract and emissions unchanged. |
| DataImport / canonical feature titles | Keep | Existing shared cloud-upload and semantic title icons are valid; no speculative per-import feature icon contract. |
| UserGuide Administration content | Extend | Bilingual action-icon explanation using existing guide route/menu. |
| Bootstrap icon font / API / backend / routing | Keep | Existing global import and all contracts preserved. |

Standard actions: Add/Create=bi bi-plus-lg; Save=bi bi-check2-circle; Edit/Update=bi bi-pencil-square; Delete/Remove=bi bi-trash3; Cancel/Close/Clear=bi bi-x-lg; Search=bi bi-search; Back=bi bi-arrow-left; Export Excel=bi bi-file-earmark-excel. Preserve status/feature-specific glyphs. Do not mass-replace business strings or convert screen architecture. Use installed font glyph inventory. Retain size/color utilities. Existing labeled controls keep text as accessible name; icon-only controls use EN/AR translations. Only directional arrows flip in RTL through their owning component styles.

## Alternatives and decisions

Keep inconsistent legacy icons: rejected by UI24. Full CRUD/control redesign: outside icons-only request. Chosen: bounded icon normalization and accessibility in existing owners. No Missing business decision, screenshot evidence, persisted change, migration or new reusable rule; UI24 already owns all rules applied.

## Reference conformance before implementation

| Concern | Owning block | Actual reference / shared owner | Target comparison |
|---|---|---|---|
| Standard action symbols | UI24 | PrimaryActionButton template/resolvedIcon; Buttons template and optional ButtonModel.icon | Primary owner already decorates glyph aria-hidden; existing Buttons lacks it. Explicit target strings match UI24; no replacement of existing handler IDs. |
| Row edit/delete | UI24 | Administration/Branches list action definitions | Other Administration actions adopt pencil-square/trash3; existing canonical definitions retained. |
| Accessibility | UI24/25 | PrimaryActionButton HTML; translated labels in existing Administration controls | All literal/dynamic decorative i glyphs hidden; icon-only controls explicitly named. |
| Import identity | UI24 | CsvImportWorkspace FeatureTitle cloud-upload | Keep existing symbol and shared owner. |
| RTL/theme | UI25 | PrimaryActionButton directional-arrow selectors; existing global Bootstrap Icons import | Inherit foreground and retain utilities; remaining ErrorLogs Back arrow handled by that existing component. No palette/layout forks. |

## Execution and ownership

Root: non-Settings Administration, shared Buttons, UserGuide, integration/source review and report. Bounded terra_worker: Administration/Settings only. Contracts frozen before delegation; no shared-file overlap. Both preserve current user/peer modifications and compare file content/times before writes. No builds/tests/lint/browser/DB/migrations/commits/push/deploy; source parsers and scoped diffs only. Final report will record exact changes, source-only evidence and owner verification.

## Frozen supplemental source discoveries (2026-10-14)

- Settings Fines/eDarb/eSalik use pButton but lack ButtonModule in standalone imports (neither other directly imported controls nor MockDataFormsModule export it). Extend those imports so existing footer label/icon inputs render through their actual owner; no handler, layout or business change.
- Icon-only profile removal controls receive contextual settings.profileModel.removeLetterHead/removeLogo in EN/AR. AgreementDocument's existing clickable remove icon gets an accessible name and Enter/Space activation through the same handler; its geometry stays unchanged.
- Existing ErrorLogs calendar trigger is globally hidden by the current owner. Remove its dead showIcon input according to existing UI17/UI30; no date contract changes. Back glyph stays in the existing pButton as an explicit decorative child using its existing icon classes, permitting component-scoped directional-only RTL rotation.
