| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Read-only DeliveryMovement and CustodyMovement discovery for root-owned Movements review |
| Date | 2026-10-07 |

# Delivery and Custody discovery

Canonical authority: `F:/My Work/Sigma/AGENTS.md`, screen-refactor skill, Master 4/5, UI screen01 and UI1/2/3/4/5/6/8/10/13/15/16/17/19/21/22/28; BE7/9/13. Root reports recipe drift except Phase01; canonical blocks prevail. Both records have fields only and no child collection/totals/posting, selecting UI01 modal editor and BE1 normal entity. Approved list reference is `Workshop/Job/components/list`; modal reference is shared `EditorDialogComponent` plus UI13 controlled composition, not Fleet routed editors. Discovery changes no source.

## Exact existing contracts

| Concern | DeliveryMovement | CustodyMovement |
|---|---|---|
| Columns in source order, Actions first automatically | no, typeName, agreementNo, plateNo, location, dateOut, fuelLevelOutName, kmOut, dateIn, fuelLevelInName, kmIn, status | custodyMovementNo, movementDate, branchName, plateNo, makeAndModel, agreementNo, fuelLevelName, kMs, notes |
| Minimal frontend row needs | Column fields + id; type and fuelLevel useful for translated enum display | Column fields + id and fuelLevel useful for translated enum display |
| Existing actions | Create, View | Create, View, Print (currently calls window.print and ignores row) |
| Filters used by UI | movementNo, agreementNo, plateNo, type, fromDate, toDate | movementNo, plateNo, branchId, fromDate, toDate |
| Filter serializers | pageNo/pageSize + Filters[key]; current private HttpParams; ISO timestamps currently sent for dates | same |
| Backend filter parsing | trimmed Contains text; type int >=0 preserves0; date-only exact formats on DateAndTime with inclusive end-day | trimmed Contains text; branchId>0; date-only exact formats on MovementDate with inclusive end-day |
| Backend-only unused filters | none | agreementId>0, fuelLevel>=0; do not add controls without a requirement |
| Current defaults | empty text, null range/type, page1, DEFAULT_PAGE_SIZE15, dateAndTime/-1 | null text/range/branch, page1, DEFAULT_PAGE_SIZE15, movementDate/-1 |
| Canonical range default | currentMonthRange() (UI4/17) | currentMonthRange() (UI4/17) |
| Backend list paging | pageNo>=1; pageSize defaults10, clamp1..100; totalCount from same filtered CountAsync; pageNo/pageSize returned; TotalPages omitted | same |
| Actual backend sorting | fixed DateAndTime desc then Id desc; incoming sortField/sortOrder ignored | fixed MovementDate desc; incoming sortField/sortOrder ignored; no unique tie-breaker |
| Endpoints | GET/POST DeliveryMovement, GET DeliveryMovement/GetByWithNavigationsId/{id}; inherited PUT/DELETE/handleActivate exist but no UI action/state contract | equivalent CustodyMovement routes |
| Select endpoints | RentalAgreement/GetSelect, Driver/GetSelect; agreement context RentalAgreement/GetByWithNavigationsId/{id} | Branch/GetSelect, Vehicle/GetSelect, RentalAgreement/GetSelect |
| Routes currently | list '', create, details/:id; details also self-detects routed mode | same |
| Canonical routes | modal list route only (Master4 route-count decision) | same |

Delivery backend ListVM declares: inherited Id/No/audit fields; DeliveryMovementNo, Type, TypeName, AgreementId, AgreementNo, VehicleId, PlateNo, Location, CustomerId, CustomerName, DriverId, DriverName, DateAndTime, DateOut, FuelLevel, FuelLevelName, FuelLevelOutName, KMs, KmOut, DateIn, FuelLevelInName, KmIn, Status, BranchOutId, BranchOutName, Agreement, Customer, Driver, BranchOut. The list service always returns DateIn/FuelLevelInName/KmIn null and Status="Delivered". These columns have no return transition behind them; no frontend workflow may be inferred. Backend remains read-only, so over-scope fields and includes are reported rather than narrowed.

Custody backend ListVM declares inherited Id/No/audit fields; CustodyMovementNo, MovementDate, BranchId, BranchName, VehicleId, PlateNo, MakeAndModel, AgreementId, AgreementNo, FuelLevel, FuelLevelName, KMs, Notes, Branch, Vehicle. List producer looks up RentalAgreements for AgreementNo. Over-scope FK/navigation/audit members are backend-only findings.

| Delivery editor control | Exact API/domain shape and ownership |
|---|---|
| type | nullable DeliveryMovementType API enum0/1; current UI required/default0 |
| agreementId | nullable int API; current UI required; selector intentionally RentalAgreement subtype |
| vehicleId/customerId | nullable int from typed RentalAgreement context; not user editable; backend fills missing values from Agreement |
| customerName | detail/context display only |
| driverId | nullable int selectable |
| dateAndTime | required DateTime API; current UI required/new Date default; local wall-clock transport |
| fuelLevel | nullable FuelLevel enum0..8; Delivery current options accidentally omit5; backend enum and producer FormatFuelLevel support all nine values |
| kMs | string nullable API/entity; current native number UI has min0 |
| branchOutId/branchOutName | nullable int write + display text; RentalAgreementDetailVM exposes Branch:string but NO BranchId/BranchOutId; keep absent ID null, never fabricate |

Delivery detail producer returns Id, No, DeliveryMovementNo, Type, TypeName, AgreementId, AgreementNo, VehicleId, PlateNo, CustomerId, CustomerName, DriverId, DriverName, BranchOutId, BranchOutName, DateAndTime, DateOut, FuelLevel, FuelLevelName, KMs, KmOut, Status, CreatedAt. No API update is used by current editor. RentalAgreement inherits Agreement, confirming IDs are compatible; its exact context is Customer:string?, Branch:string?, CustomerId/VehicleId/DriverId:int?, FuelLevel:enum?, KMs:string?. Current any/object fallback is unnecessary and wrong.

| Custody editor control | Exact API/domain shape and ownership |
|---|---|
| movementDate | required DateTime API; current UI required/new Date default |
| branchId/vehicleId | nonnullable int API/entity; current UI required |
| agreementId | nullable int Add API, int entity/detail (absence becomes0); current UI optional |
| fuelLevel | nullable FuelLevel API; existing UI choices0/2/4/6/8 retained pending root freeze |
| kMs | nullable int API/entity; current native number UI min0; integer contract |
| notes | nullable string API/entity; current save trims to null |

Custody detail producer returns Id, No, CustodyMovementNo, MovementDate, BranchId, BranchName, VehicleId, PlateNo, MakeAndModel, AgreementId, AgreementNo, FuelLevel, FuelLevelName, KMs, Notes, CreatedAt. Custody AddVM also exposes CustodyMovementNo but UI never edits or sends it; retain server-owned number exclusion. No API update used by current editor.

## Findings and conformance evidence

| Concern | Canonical/reference owner | Actual target source evidence | Finding |
|---|---|---|---|
| Container fill and card edges | UI1/3/6; Job list metadata/template; styles.scss | both list.scss calculate viewport height, copy panel paint, and change host/page/panel to auto/overflow visible at <=768px; neither metadata has sigma-route-host | replace with shared shell and sigma-list-table; remove local shell/filter/button/theme copies |
| Filter layout/actions | UI4; Job list form appFilterPanel stableLayout=true, resetRequested; FilterPanelComponent | both filters use Bootstrap row/local dm/cm strip and Refresh, no Reset | use shared panel, mandatory Reset, stable alignment, labelled inputId, shared Search/export |
| Dates | UI17; DatePickerDirective/date-utils; Job range | lists use readonly/icon/single-month calendars and ISO timestamps; FilterHelper.GetDate accepts only date-only exact formats | date filters currently ignored; use currentMonthRange/dateRangeValidator/parseDateRange; editor local-time toApiDateTime |
| Paging/sort | UI5/6; resolveListPaging; exact backend list producers | all non-notes target columns advertise sorting; services ignore sort; private paging conversion | disable unsupported sorts; authoritative count and shared paging; backend missing TotalPages and Custody tie-breaker remain reported |
| Grid formatting/localization | UI5/16/23; DataTableColumn.type/status, enumOptions/translateOptions | date templates/DatePipe copies; Delivery English TypeName/Delivered text; Custody FuelLevelName is enum ToString | shared dateTime/number/status formatting and neutral fuel-level text; preserve raw values/unknown fallback |
| Export | UI8; Job dataTableExportRows; list-query.fetchAllPages; utilities.onExportToExcel | both export current data page only into CSV; Delivery English headers; handwritten escaping/value fallbacks | fetch full filtered results; use click-time translated grid columns/shared Excel helper; fail loudly on any page |
| Modal composition | UI13/10; shared EditorDialog public inputs/output + controlled composition | both no contentPadded/closeDisabled/Escape/discard handling; direct requestClose hides and emits | shared padded form/field shell, dirty confirmation and busy guards; close view label should be Close |
| Validation/lookup/errors | UI19/22/28; FieldError/StateMessage/apiErrorMessage | broad FormGroup declarations; required controls have no field errors; lookup next-only or catchError->null; X-Skip-Error-Interceptor suppresses fallback presentation | typed controls/contracts; display both failure channels + explicit recovery for required lookups; stale request cancellation |
| View mode | UI15/22; DTO display names | editors fetch every dropdown even in View and rely on disabled options; Custody has no record subtitle | render DTO labels and skip edit-only lookups; shared translated record subtitle; Save hidden |
| Primary loading/save consistency | UI22; BaseComponentService/LoadingService | details components do not extend base or drive global loader; save has no repeated-call guard and form stays editable | pair global/local state and finalize, protect submitted snapshot/repeat execution |
| Print | UI21; ReportPrintService/createSession and dialog print isolation | Custody printRow(row) ignores row, calls window.print | root must freeze corrected row-detail output; no fabricated report endpoint or fields |
| Provider wiring | UI1/2; root HttpClient + providedIn root | feature services correct root/environment; LayoutModule redundantly imports/provides both at lines365/374/507/514 | root-owned integration cleanup, no feature HttpClient or manual token |

Material backend observations (report only): AddAsync overrides both bypass the generic base Add validation path; Add/Update feature VMs have no field validation attributes; Delivery owns bespoke max-id number generation; Custody reverse-maps every DTO including read models; both list/detail payloads exceed rendered needs; both GET list overrides return Ok regardless of failed Result. Existing source determines behavior; no backend fixes or schema changes authorized in this discovery.

No supplied screenshot evidence belongs to this bounded discovery. No business lifecycle/delete/edit/access rules inferred. No build, test, lint, browser, database, migration, snapshot, commit, push, deployment, Graphify or Sigma MCP was run. Runtime/visual/compile verification remains owner-pending. This Draft is discovery evidence for the root; only the root freezes implementation contracts.

## ترتيب نافذة فتح حركة العهدة — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ تحقق المالك المتبقي yes. الشريحة الحالية S مجمّدة بطلب المالك: ثلاثة حقول في الصف الأول، ثلاثة في الثاني، والملاحظات بعرض الصف الثالث. لا تمثل إغلاقًا للمراجعة التاريخية الأوسع أعلاه.

المسار الفعلي pages/routing.ts:402 → CustodyMovement_Routes → القائمة → CustodyMovementDetailsComponent. النمط UI01 list/modal وUI13 EditorDialog/FormSection، بلا تغيير backend/API؛ نُفذت PHASE03 فقط بعد Check ناجح للحزم الثماني. المالك المشترك styles.scss يتيح --sigma-editor-columns وsigma-field--full؛ استُعملت القيمة3 على الشبكة وعلامة full للملاحظات بدل CSS محلي أو تعديل عام على كل النوافذ. الصف الأول التاريخ/الفرع/المركبة؛ الثاني الاتفاقية/الوقود/العداد؛ الثالث الملاحظات. تسري البنية نفسها على Create/View مع fallback المشترك عمودين تحت1024px وعمود تحت700px، وتبقى سلسلة auto-basis الحالية دون تغيير ارتفاع أو تمرير.

دليل التحليل المرجعي: المدخل الموحد المقروء سابقًا في هذه المتابعة، ثم ملف 2026-10-28/sidebar/13-movements/screens/03-custody-movements.md، R0297 وC0753 للإنشاء. هذا تعديل هندسة حقول سيجما بطلب صريح؛ توزيع3 ليس عقدًا خلفيًا من مرجع Speed، ولم يُستنتج edit/close أو حقل أعمال جديد. لا صورة مرفقة لهذه الشريحة، والحقول والعقود كما في الجرد السابق.

القراءات الحقيقية دون تغيير: Branch/GetSelect عبر getBranchesSelect وBranchService وVehicle/GetSelect عبر getVehiclesSelect وVehicleService كلاهما source cacheSelect=true؛ RentalAgreement/GetSelect عبر getAgreementsSelect direct بلا opt-in. يظل bootstrap forkJoin الحالي عند الإنشاء وdetail GET CustodyMovement/GetByWithNavigationsId/{id} عند العرض وPOST CustodyMovement للحفظ؛ لا قراءات لكل صف/حقل ولا ذاكرة جديدة. consumers الحاليون finite بلا watch/tenant binding صريح؛ هذه فجوة lifecycle الأوسع مسجلة ولا تُدّعى مطابقة كاش شاملة من ترتيب الحقول. لم يتغير writers/invalidation/selected-label أو retry/error/cancel/finalize؛ StateMessage المحلي لقراءة الحوار وsaving overlay كما كانا.

الأداء: نفس عدد الطلبات والحقول والردود والعمليات SQL؛ لا سبب لتعديل فهرس أو migration في تغيير العرض. قياس cold/warm/زمن الرسم والشبكة وقبول RTL/theme والعرض الضيق متبقٍ عند السماح بالتشغيل؛ لا ادعاء تحسن سرعة مقاس. لم يتغير DTO/Mapper أو domain/financial/state rules. حدّث موضوع العهدة في UserGuide/content/movements-guide.ts عبر /UserGuide/movements بالعربية والإنجليزية لشرح الصفوف والتجاوب.

فحوص المصدر: parser قالب Angular والدليل وdiff --check ومراجعة فرق HTML الكامل؛ لا build/test/lint/browser/DB/migration/commit/push. لا وكلاء لأن التغيير عنصران مرتبطان في ملف واحد. لا قاعدة مشتركة جديدة، فلا تعديل كتب/مهارة أو توليد غير لازم؛ الحزم متسقة. قبول المالك المتبقي: فتح الإنشاء والعرض والتأكد من3+3+ملاحظات كاملة في العرض المكتبي، والتجاوب والتمرير والطباعة. رسالة commit مقترحة فقط: fix(custody): arrange editor fields in three columns.
