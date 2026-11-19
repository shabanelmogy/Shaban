# Rental Tariff Feature Review Manifest

## تنسيق التبويبات — ٢ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

طلب المالك تنسيق التبويبات في Rental Tariff. تعديل عرض محدود Tier S في
المحرر الحواري الحالي؛ اختيار appearance=workspace من API المالك المشترك
EditorTabs، لإطار موحد وأيقونات وحالة نشطة واضحة، بدل إضافة CSS أو تبويبات
محلية. UI13 يملك الشكلين المشتركين؛ اختيار المظهر هنا خاص بطلب تحسين هذه
التبويبات، ولا يغير الشكل الافتراضي للمحررات الأخرى.

بقيت visibleTabs والنوع اليومي/الأسبوعي/الشهري وcurrentTab والأحداث والمعرّفات
وdisabled ولوحات الأقسام ومسوداتها كما هي. يحافظ المالك على الصف المضغوط
والمقاسات وRTL/الثيم ولوحة المفاتيح. دليل التأجير باللغتين في
UserGuide/content/rental-guide.ts محدث بالقارئ الحالي `/UserGuide/rental`.

المرجع الوظيفي C1137 من لقطة سبيد٢٨ أكتوبر وسجل E08/E20 أدناه يثبتان الأقسام
واختلافها حسب النوع، ولا يقرران التصميم؛ لا عقد مالي أو بيانات جديد. لا
تغيير طلب/تحميل/كاش أو query أو خلفية أو مخطط/هجرة أو AutoMapper، ولا قياس
أداء مزعوم. اجتازت الحزم الثماني فحص الانحراف؛ التحقق مصدرّي للقالب والدليل
والـInput الفعلي ومراجعة الفروق. المعاينة بعرض ضيق والعربية والثيمين وتبديل
النوع متبقية لدى المالك. لا حاجة لوكيل في تعديل واحد مترابط، ولم تُشغل
builds/tests/lint/DB/browser أو migrations/commits/push. اقتراح التزام الواجهة:
`style(rental-tariff): use shared workspace tab appearance`.

## Scope and authority

| Item | Decision |
|---|---|
| Feature | `SiGmaAngularFrontEnd/src/app/modules/Rental/RentalTariff` and directly related Tariff/TariffSetting backend contracts |
| Review shape | Broad full-stack refactor |
| Master authority | `SIGMA_FEATURE_REVIEW_MASTER.md` |
| UI authority | Canonical UI blocks 1–7, 10–11, 13–16, 19, 22–29 |
| Backend authority | Canonical backend blocks 1–8 and 18; Pattern 2 for Tariff; Pattern 4 for TariffSetting |
| Generated packets | Phase 00, 01, 04, 05 and 06 passed drift check. Phase 02 and 03 are stale and are not used; their canonical source blocks govern this change. |
| Canonical UI references | Shared data table, editor dialog, editor tabs, editable collection table, and Fleet VehicleService integration |
| Canonical backend references | PurchaseOrder aggregate guidance and ChargeSettings settings guidance |
| Reference mutation | Approved references remain read-only |

## Screenshot capture metadata

| Evidence set | Capture date/version | Viewport and locale | Role/permissions | Classification limitation |
|---|---|---|---|---|
| `1.PNG`–`9.PNG` | Unknown | Desktop, English, LTR; dimensions vary by capture | Unknown | Functional and visible-content evidence only; not layout or component authority |
| `Untitled.mp4` | Unknown | Desktop, English, LTR, 1920×1080 | Unknown | Workflow and business-rule evidence for Type/Tariff Card selection |

## Functional evidence register

| ID | Source | Visible requirement | Classification | Implementation decision |
|---|---|---|---|---|
| E01 | 1, 7 | Rental Tariff list with search | Demonstrated | Preserve with a typed server-paged search form |
| E02 | 1, 7 | Columns are Actions, Vehicle Type, Detail, Notes | Demonstrated | Freeze this exact order; the action column is supplied by the shared table |
| E03 | 1, 7 | Every vehicle-type row exposes a Tariff workflow | Demonstrated | Open a contextual create/edit tariff dialog for the selected vehicle type |
| E04 | 1, 7, 8 | Tariff Setting opens branch-wise settings | Demonstrated | Use a controlled typed editor dialog, not a hand-built overlay |
| E05 | 8 | Settings rows contain Branch and Adjustment %, with Add/Remove, Save/Cancel | Demonstrated | Full-replacement settings collection; branch is required; duplicates are rejected |
| E06 | 8 | Negative adjustment decreases and positive adjustment increases | Demonstrated | Freeze adjustment range as -100 through 100 |
| E07 | 2–6 | Tariff title is contextual to the vehicle type and exposes In-Active | Demonstrated | Vehicle type identity/name are parent-owned; only inactive state is editable |
| E08 | 2–6 | Tabs: Rental, Weekend Rental, Protections, Mileage, Extras | Demonstrated | Use typed shared editor tabs in this order |
| E09 | 2 | Rental has day, hour and half-day rate ranges | Demonstrated | Preserve as three editable collections |
| E10 | 3 | Weekend Rental has day and hour rate ranges | Demonstrated | Preserve as two editable collections |
| E11 | 2, 3 | Rate rows contain From, To, base Rate and Young Driver Rate | Demonstrated | Preserve with non-negative numeric validation; `To = 0` remains allowed |
| E12 | 4 | Protection rows contain type, range, included, rate and excess | Demonstrated | Preserve for backend-supported CDW and PAI types |
| E13 | 5 | Mileage rows contain range, included, allowed, rate and excess | Demonstrated | Preserve as an editable collection |
| E14 | 6 | Extra rows contain charge type, range, rate and young-driver rate | Demonstrated | Preserve as an editable collection with a required backend string charge type |
| E15 | 2–6, 9, video, owner clarification | Type is an independent selector with Daily, Weekly and Monthly values | Demonstrated | Persist `RentalAgreementType Type`; do not use `TariffGroup` as the Type contract |
| E16 | 2–6, 9, video | Tariff Card selector starts at Default and selects named cards | Demonstrated | Add nullable `TariffCardId`; null is the Default tariff card |
| E17 | 4 | Roof Insurance and Theft Protection rows | Missing | Backend ProtectionType supports CDW and PAI only; do not extend the enum without a business decision |
| E18 | 6 | Fixed extra-charge names and units | Uncertain | Backend accepts arbitrary `ChargeType` text and stores no unit; preserve editable names and do not seed or persist unsupported units |
| E19 | 1–8 | Only English/LTR/light captures are supplied | Assumed | Canonical responsive, RTL and dark-theme behavior remains mandatory |
| E20 | video | Daily exposes Rental and Weekend Rental; Weekly hides Weekend Rental and shows weekly pricing | Demonstrated | Derive visible tabs and rental row shape from the selected persisted Type |
| E21 | video | Period-only tariff cards include their validity dates in the selector label | Demonstrated | Return typed card option metadata and format the date range in Angular |
| E22 | video | A card without saved rates shows "Not Saved yet" while the same Default rows remain visible | Strong inference | Return a create-mode template copied from the matching Default VehicleType+Type tariff, with all ids reset |
| E23 | owner clarification plus the demonstrated Weekly shape | Monthly is a selectable Type | Demonstrated for the option; Strong inference for row shape | Expose Monthly and use the same reduced periodic-rate editor as Weekly with a Per Month unit; exact monthly calculations remain unresolved |

## Selected shapes and phase ownership

| Concern | Selected shape | Evidence |
|---|---|---|
| Main list | Canonical list with shared data table | E01–E03 and the existing VehicleType list endpoint |
| Tariff editor | Contextual create/edit tabbed dialog with Type/Tariff Card context selectors | E03, E07–E16 and E20–E22; no independently addressable workflow is demonstrated |
| Rate/protection/mileage/extra rows | Shared editable collection tables | E09–E14 |
| Branch settings | Canonical settings collection inside an editor dialog | E04–E06 and backend Pattern 4 |
| Backend Tariff | Pattern 2 aggregate with explicit child reconciliation | Existing Tariff entity owns four child collections |
| Backend TariffSetting | Pattern 4 full-replacement settings | E04–E06 and existing collection endpoint |
| Phase 4 | Skipped | Ordinary Save and settings replacement are owning write contracts, not domain transitions |

## Frozen list contract

| Grid order | Frontend row property | Producer |
|---|---|---|
| Actions | `id`, `name` | VehicleType row action context |
| Vehicle Type | `name` | `VehicleTypeListVm.Name` |
| Detail | `detail` | `VehicleTypeListVm.Detail` |
| Notes | `notes` | `VehicleTypeListVm.Notes` |

The list query is `pageNo`, `pageSize`, and optional `Filters[search]`. Sorting is not exposed because the VehicleType endpoint has no sort contract. The endpoint supplies exact `TotalCount`.

## Frozen Tariff contracts

### Editor selection contract

| UI control | Angular control | Query key | Backend type | Default behavior |
|---|---|---|---|---|
| Type | `tariffTypeControl` | `type` | `RentalAgreementType` enum: Daily, Weekly, Monthly | Daily |
| Tariff Card | `tariffCardControl` | `tariffCardId` | nullable positive integer | UI value `0` omits the query key and maps to the Default/null card |

`GET Tariff/GetEditor` reads the exact VehicleType+Type+TariffCard selection. A missing non-default selection returns the matching Default tariff as an id-free create template and marks `isSavedForSelection = false`.

### Detail

`id`, `name`, `type`, `tariffCardId`, `isSavedForSelection`, `isInactive`, `vehicleTypeId`, `rentalRates`, `protections`, `mileage`, and `extras`. Child detail rows include their persisted `id`. Tenant, record number, audit, legacy `TariffGroup`, and delete fields are not consumed by the Angular model.

### Add

`type`, nullable `tariffCardId`, `isInactive`, `vehicleTypeId`, `rentalRates`, `protections`, `mileage`, and `extras`. The backend derives `name` from the tenant-owned VehicleType and assigns tenant/audit/identity values. `TariffGroup` remains a separate legacy/reporting property and is not accepted as editor input.

### Update

`id` plus the same editable fields as Add. Persisted child IDs are accepted only after the backend proves they belong to this tracked Tariff aggregate. Tenant, name, number, audit and delete fields are not accepted from the Angular payload.

### Child semantics

| Collection | Editable fields | Server-owned fields | Empty semantics |
|---|---|---|---|
| Rental rates | range, rate type, rental type, base rate, young-driver rate | id/tenant/audit | Clear collection |
| Protections | type, range, included, rate, excess | id/tenant/audit | Clear collection |
| Mileage | range, included, allowed per day, rate, excess rate | id/tenant/audit | Clear collection |
| Extras | charge type, range, rate, young-driver rate | id/tenant/audit | Clear collection |

All numeric rates and allowances are non-negative. Range endpoints are non-negative integer strings. Equal endpoints and a zero upper endpoint are allowed because the supplied evidence demonstrates both; the meaning of zero remains a business-rule uncertainty and the calculation service is not changed by inference.

## Frozen TariffSetting contract

| Operation | Contract |
|---|---|
| Read | Tenant-scoped, soft-delete-aware deterministic list ordered by Branch name/id; missing settings return success with an empty list |
| Save | Full replacement of `{ branchId, adjustment }[]`; BranchId is the logical key and client record ids are not accepted or trusted |
| Empty payload | Delete all active settings for the tenant |
| Duplicate branch | Reject the whole request |
| Branch FK | Required and tenant-owned |
| Adjustment | Required, -100 through 100 |
| Transaction | One tracked graph/save on one scoped DbContext; EF implicit transaction |

## Validation and invariants

| Invariant | Add | Update | Persistence support | Failure behavior |
|---|---|---|---|---|
| One active Tariff per VehicleType+Type+TariffCard per tenant | Reject duplicate | Reject duplicate excluding self | Tenant-scoped filtered composite unique index | Safe business failure |
| VehicleType exists in tenant | Required | Required | Repository-scoped lookup | Safe business failure |
| Type is a defined Daily/Weekly/Monthly enum value | Required | Required | DTO/service enum validation | Safe business failure |
| TariffCard exists in tenant when selected | Required when non-default | Required when non-default | Repository-scoped nullable FK lookup | Safe business failure |
| Child id belongs to aggregate | N/A | Required | Tracked tenant-scoped aggregate | Safe business failure |
| Duplicate child logical row | Reject exact duplicate rate/protection/mileage/extra keys | Reject exact duplicate rate/protection/mileage/extra keys | Aggregate-boundary validation | Safe business failure |
| Child numeric/string validation | Required | Required | VM annotations plus service normalization | Safe business failure |
| One active TariffSetting per Branch per tenant | Reject duplicate | Reject duplicate | Tenant-scoped filtered unique index | Safe business failure |
| Branch exists in tenant | Required | Required | Repository-scoped distinct-count lookup | Safe business failure |

## Route, provider and event contracts

| Surface | Contract |
|---|---|
| Route | `/RentalTariff` only; the list owns both dialogs |
| Tariff dialog input | Selected `VehicleTypeListDTO` |
| Tariff dialog close | Emits whether persistence changed; list data itself does not require refresh |
| Settings dialog close | Clean close immediately; dirty close uses the shared discard confirmation |
| Providers | RentalTariff, TariffCards, VehicleType, Branch and TariffSetting services resolve through LayoutModule's interceptor-enabled injector |
| Cancellation | List search uses switchMap; every subscription uses `takeUntilDestroyed`; dialogs ignore stale/closed responses |

## Transaction decisions

| Path | Saves reached | Reconciliation | Transaction owner |
|---|---:|---|---|
| Tariff Add | 1 | Full new aggregate before save | EF implicit transaction |
| Tariff Update | 1 | Explicit tracked child reconciliation before save | EF implicit transaction |
| TariffSetting Save | 1 | Full tenant-scoped replacement before save | EF implicit transaction |

## Unresolved requirements

| Requirement | Status | Required owner decision |
|---|---|---|
| Roof Insurance / Theft Protection | Missing | Extend and define ProtectionType behavior, including charge calculation mapping |
| Fixed extra types and displayed units | Uncertain | Define the master list and whether unit is persisted per extra |
| Rental range calculation, weekends, half-days and young-driver selection | Uncertain | Supply calculation rules; current calculation does not consume these range/type fields |
| Booking tariff selection | Missing | Existing booking-charge input has no Type or TariffCard; define how agreement/customer context selects them. Until then the legacy day-based calculation is constrained to Daily plus the Default card. |
| Existing Tariff Type backfill | Missing owner migration/data decision | Add and backfill the new `Type` column before enabling the new unique index. Rows whose legacy `TariffGroup` is Daily/Weekly/Monthly can be mapped directly; any other group values and duplicate VehicleType+Type+TariffCard combinations require owner reconciliation. |
| TariffGroup assignment for newly created tariffs | Missing | `TariffGroup` is separate from Type but the editor evidence supplies no group control. New rows therefore keep the entity default while updates preserve existing values; define another owner workflow if reporting requires assignment. |

## Final reconciliation

| Area | Final decision | Evidence/status |
|---|---|---|
| List | Shared server-paged data table over VehicleType with Actions, Vehicle Type, Detail and Notes | Matches E01–E03; grid fields equal `VehicleTypeListDTO` fields `id`, `name`, `detail`, `notes` |
| Tariff editor | Contextual create/edit dialog with independent Daily/Weekly/Monthly Type and Tariff Card selectors; Weekly and Monthly use the reduced periodic-rate shape | Matches E03, E07–E16 and E20–E23; unsupported persisted rental enum combinations are retained unchanged rather than reclassified |
| Tariff write | Input-only parent/child DTOs, tenant-owned lookups, duplicate checks and tracked child reconciliation | Canonical Pattern 2; one save per Add/Update path |
| Settings | Full replacement by tenant-scoped BranchId logical key; no client setting id | Matches E04–E06 and canonical Pattern 4; empty deletes all and duplicate branches reject the request |
| Mapping | Explicit Tariff aggregate maps only; settings use direct projection/reconciliation and have no AutoMapper profile | Avoids reverse maps and unused mappings |
| Runtime wiring | `/RentalTariff` list owns both dialogs; existing LayoutModule providers remain authoritative | Phase 5 source reconciliation complete |
| Calculation | Existing formulas remain unchanged; the legacy day-based booking path is constrained to Daily plus the Default card | Weekly/Monthly booking selection remains Missing; no client-side financial calculation introduced |
| Schema | Entity/configuration changes require an owner-created migration | Migration and snapshot files were not created, edited or run |
| Verification | Complete scoped source diff reviewed; translation keys, stale imports, merge markers and whitespace checked | Build, tests, lint, database, migration and browser verification remain owner-pending by workspace rule |
