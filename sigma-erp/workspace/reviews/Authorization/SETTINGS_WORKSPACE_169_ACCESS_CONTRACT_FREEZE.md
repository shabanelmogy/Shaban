# 169 — Settings workspace: source-backed access boundary (2026-11-13)

Scope: `/Settings` and **all its children** in `SiGmaAngularFrontEnd/src/app/modules/Administration/Settings/settings.routes.ts`. **Final owner decision, 2026-11-13: the entire Settings workspace is TenantAdmin-only, with no ordinary-user tab delegation.** This contract distinguishes administrative workspace access and its management HTTP actions from shared operational reads. Each remains subject to its actual server/consumer contract; no individual resource grant opens a Settings tab to an ordinary user.

## Confirmed runtime ownership

- `RouteAccessPolicyRegistry` explicitly matches `/settings` by prefix with `{ tenantAdmin: true }`; this protects the parent and every child in Angular. Tenant administrator status must remain linked to the current session; a resource grant cannot substitute for it.
- The parent owns 25 child screens. The tab menu is unconditional within the administrator workspace in `settings-layout.component.ts`. Route children do not share a single read/save contract; they use different controllers. This is **not** a basis for separate ordinary-user tab grants: all children inherit the final administrator-only workspace decision.
- Examples of actual endpoints: Common: `GET SettingsCommonModel/GetMySetting` (`SettingsCommonModel.GetMySetting`), `POST/PUT SettingsCommonModel` (`SettingsCommonModel.Create/Update`), and `GET PaymentMethod/GetSettingsOptions` (`PaymentMethod.GetSettingsOptions`); Charges: `GET/POST ChargeSettings` (`ChargeSettings.Get/Update`); API key: `GET/PUT ApiKeySetting/Mine` (`ApiKeySetting.GetMine/SaveMine`); approval policies/documents use `DocumentApprovalWorkflowService` and document-type-specific permissions.
- A saved configuration belongs to its tenant (backend Pattern 4); no stock balance or source/destination branch operation is performed by the Common or Charges settings forms. These conditions are N/A for these forms rather than evidence of coverage.

## Frozen server and consumer boundary

1. Administrative mutation/actions that own a Settings-workspace configuration must reject a non-`TenantAdmin` caller **at HTTP**, even if an independently assignable permission is present. A route guard alone is insufficient.
2. Some settings-derived GET actions are consumed by ordinary operational screens (for example, tax/common configuration, payment method options, document-related lookups). Preserve necessary **shared operational reads** under their existing explicit permission/tenant/data contracts; they do not entitle the caller to open `/Settings` or to mutate its configuration. Inspect the real callers before deciding per action; controller names do not define the boundary.
3. Settings-like routes outside this workspace (including `/AccountSetting`, `/BillSettings`, `/FinancialReportSettings`) are not automatically reclassified. Approval-document operations bound to source-document rights must retain their separate source semantics; do not blindly block a normal workflow because its administrative viewer is a Settings tab.
4. The shared `SettingsCommonModel/GetMySetting` read is required by ordinary booking, sales, lease and other workflows but its current detail DTO also contains `WebBookingApiKey` and `GoogleApiKey`. Its ordinary-user projection must not disclose administrator-only secrets; restrict exclusive full-detail reads separately and preserve the fields actually consumed by operations. An administrator still needs the full editable configuration.
5. If a Settings tab reuses an HTTP action also legitimately owned by a separate operational workflow, changing the tab's access does not silently reclassify that independent workflow. Specifically, `SettingsHolidayModel` is also the write owner for `/Holiday` in HRM; `HrmSetting/Mine` is used by independent `/HrmSetting`. Document these shared endpoints and their separate operation permissions instead of blocking ordinary users solely because a Settings tab calls them.
6. Exclusive administrator detail reads must also reject ordinary users with a grant when they disclose secrets: `PaymentGateway/Mine` contains `SecretKey`, and `ApiKeySetting/Mine` exposes key configuration. The public operational map-key reader, where independently consumed, keeps its own limited contract.

## Immediate source corrections with the frozen administrator model

1. Preserve dirty Common and Charge Settings drafts when navigating among Settings tabs, with a local discard confirmation. Block navigation while a sent save is unresolved, and release the route guard when it settles.
2. Save success marks the draft clean even if permission state has since changed; a denied read does not cancel a previously sent write. Suppress a stale write's global presentation if its owner/access context expired.
3. Enforce the permanent `TenantAdmin` workspace boundary, confirm the HTTP boundary for administrative operations, and preserve consumed shared reads. Continue independent read/write lifetimes for every touched child; do not infer administrator status from a tab's ordinary resource grant.

## Final access decision and adoption evidence

**Decision resolved:** `TenantAdmin` only for the entire `/Settings` route subtree (including API keys, identity, approval policy workspace, payment gateway, numbering and other shared configuration); no per-tab delegation to ordinary users. A separate endpoint grant may legitimately serve other workflows, but does not grant Settings navigation or its exclusive administrative mutation. Inventory classification and any `operation-confirmed` claim require independent evidence that the HTTP administrative actions are protected; the business decision by itself is not a verification result.

## Reference and acceptance

- Master1, UI26, UI10/UI28, Backend Pattern 4; routed settings shape `ui/screens/06-tabbed-settings-workspace.md`.
- Speed guide `references/speed-analysis/2026-10-27/Speed_Analysis_Guide.md` section 17; dated Speed sidebar `2026-10-28/sidebar/24-administration/screens/38-settings.md` and its actual code controller C0431 (`saveAll`, `saveCommonSettings`) separately inspected. Those sources establish the settings UX, not Sigma authorization.
- Acceptance fixtures: tenant admin with a valid linked session and Common/Charge settings; a dirty draft followed by tab switch, cancel/confirm; a save in flight followed by navigation; admin access withdrawal before a read completes and after a write is sent; ordinary user holding only `ChargeSettings.Get` remains denied on `/Settings/chargeSettings` under the current route policy. Record source vs build vs runtime separately.
- Common's initial `GetMySetting` returns `entity: null` for a new tenant; creation must remain possible. Selected DDA methods are returned as detail objects and must be transformed into numeric option IDs, validated against fresh `PaymentMethod/settings-options` after a regrant, and reconstructed only from current authorized options before saving. The key-generation POST must use the active environment endpoint.
