# Trip grid customization — frozen source contract

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

Frozen 2026-10-07 from TripGridCustomization entity/VMs/controller/generic service and actual TripGridColumn enum. This scope repairs the existing preference CRUD screen, not a new preference consumer in TripBooking. No live trip-grid reader or user-level preference contract was found; applying these records to a grid remains Uncertain and is not invented.

## Source contracts and decisions

- List GET TripGridCustomization with generic pageNo/pageSize and exact total; no unsupported search/filter. List columns Column (translated enum), Hide; identity Id only for row actions. Initial15, server clamp1–100. Shared bounded list/title/DataTable; explicit URL paging state.
- Detail GET GetById/{id}: id/column/hide consumed; title screen name, subtitle record identity.
- Add POST editable column/hide; Update PUT id/column/hide. Actual enum Actions0,TripNo1,TripType2,Customer3,Guest4,Pickup5,DropOff6,From7; no tenant/no/audit payload. Existing false Hide and Actions default preserved. Required enum and range boundary validation, no invented unique key or extra settings fields.
- Delete generic DELETE ?id supported, server generic dependency checks remain. Shared record confirmation; final-row page fallback. Generic CRUD is authentication-protected; no permission mechanism exists.
- UI shape normal list/modal editor (no totals/collections/workflow). Only list route; controlled modal Create/View/Edit and CanDeactivate deferred dirty confirmation using existing shared owners. Old scaffold product/loyalty columns/actions/routes removed after confirming no business API for them.
- Conformance: UI1/3/5–7 Workshop Job list + DataTable; UI10/13 shared EditorDialog with Fleet modal shape; UI16 enumOptions/TranslateOptions; UI19 FieldError; UI22 interceptor mutation owner/inline read skip; UI28 switchMap; BE3/4/7/9 generic service+minimal VM and one-way maps.
- Phases0–3 and confirmed generic delete4, integration5 and source reconciliation6 apply. No schema/accounting/domain-calculation change or migration. Build/tests/lint/runtime/database/browser/commits remain prohibited and owner-pending.

## Historical reference correction — 2026-10-07

The earlier phrase “Fleet modal shape” is incorrect: Fleet/Vehicle is routed in actual source. UI13 and the actual shared EditorDialog declarations own this controlled modal composition; Fleet is not used as a modal authority. The implementation uses the documented content-sized dialog alternative with a complete flex-fill body/scroll chain. This correction records factual reference drift, not a new design rule. Unused declaration-only FullListVM is removed during root reconciliation. Server page metadata controls the pager and URL; restored/event sizes cap100 before offset calculation.
