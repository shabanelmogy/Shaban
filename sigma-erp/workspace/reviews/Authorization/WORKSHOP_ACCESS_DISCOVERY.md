# اكتشاف صلاحيات Workshop — تعريف الورش (2026-11-11)

| البند | النتيجة |
|---|---|
| Status | Discovery — source-only |
| جرد البداية | `Workshop` resource-only؛ 142/263 operation-confirmed بعد إقفال NRM |
| نطاق هذا الصف | `/Workshop` لتعريف **أسماء الورش**، لا `/WorkshopMovement` لحركات المركبات |

## المراجع وأولوية الفصل

1. دليل Speed `references/speed-analysis/2026-10-27/Speed_Analysis_Guide.md`، القسم التاسع، يذكر حركات الورشة، فتحها وإغلاقها وصيانتها؛ لا يثبت حقول تعريف `Workshop` في Sigma.
2. شرح Speed `references/speed-analysis/2026-10-28/sidebar/13-movements/screens/02-workshop-movements.md` يحدد المسار `tenant.crs_workshopMovements` وcontrollers `C1459` (القائمة)، `C1457` (الفتح/التحرير)، `C1456` (الإغلاق)، `C1461` (العرض). هذا **مرجع لحركة الورشة** وليس تعاريف أسماء الورش؛ لا تُستنسخ منه أزرار الإغلاق/المستندات/المورد إلى `Workshop`.
3. Sigma Angular `Movements/Workshop/workshop.routes.ts` و`components/list`, `components/details`, `services/workshop.service.ts`: قائمة ومرشحات الاسم والرقم وExcel، إنشاء باسم، عرض وتعديل اسم عبر GET/POST/PUT فقط؛ يوجد مسار إنشاء وتفاصيل مباشر. دليل التطبيق الحالي `UserGuide/content/movements-guide.ts` يصف الفصل بين Workshop master وWorkshopMovement.
4. Sigma Backend `WorkshopController.cs`, `WorkShopServices/WorkshopService.cs`, `WorkshopProfiler.cs` و`ViewModels/Workshop`: تعريف `Workshop : EntityBaseWithName` بلا `BranchId`، متطلب الاسم 250 عند الإضافة و50 عند التعديل؛ العمليات العامة مورثة من Service وController. استعلام المستودع يطبق الاشتراك تلقائيًا على كيان التعريف المشترك داخل الشركة عبر `BranchScopeRegistry` (Workshop غير مسجل ككيان مالك فرع).

## خريطة المستهلكين المؤكدين

| مستهلك Sigma الحالي | الطلب/العملية | حد المنحة المقترح |
|---|---|---|
| `Workshop/components/list/list.component.ts` | `GET /Workshop` للبحث والصفحات، وجمع الصفحات لExcel | `Workshop.View` |
| `Workshop/components/details/details.component.ts` | `GET /Workshop/GetById/{id}` للعرض والتعديل | `Workshop.View` |
| نفس المحرر | `POST /Workshop` باسم مطلوب | `Workshop.Create` مستقل عن View |
| نفس المحرر | `PUT /Workshop` لتغيير اسم سجل محمل | `Workshop.View` مع `Workshop.Update` |
| `Fleet/ServiceLog/services/servicelogs.service.ts:73-75` و`Workshop/Job/components/editor/editor.component.ts` | `/Workshop/GetSelect` من `WorkshopService.getSelectList` | `Workshop.Lookup` مستقل، لا تحوّله إلى View ولا تلغِ API |
| `WorkshopController.cs:15-24` | `GET /Workshop/vehicles/{id}` و`POST /Workshop/vehicles` | `Workshop.GetVehicleDetails` و`Workshop.SearchVehicles` مستقلتان ضمن `ReviewedPermissionOperations.cs:594-595`؛ ليسا أزرار شاشة التعريف الحالية |

## النطاق والأخطاء القائمة قبل التبني

- `Workshop` تعريف tenant-wide بلا فرع تاريخي؛ `WorkshopMovement` وحدة أخرى تسجل `BranchId` وتُرشّح بنطاق الفرع في `BranchScopeRegistry.cs:56`. لا تستنتج ملكية التعريف من فرع مركبة أو حركة.
- القائمة الحالية تطلق GET عند الدخول حتى في `create`/`details`، وتُظهر بيانات القائمة والطباعة/Excel دون فحص منحة أو جلسة/سياق. أزرار View/Edit/Create لا تعلن requirements؛ والـPOST/PUT القديم مربوطان بعمر النافذة، مما قد يلغي mutation بعد إغلاقها.
- API العامة الموروثة قد تعلن `Remove`, `HandleActivate`, `CheckUnique`, `GetAllWithNavigations`, `GetByIdWithNavigations` دون مستهلك مثبت في شاشة التعريف؛ يجب إرجاع 405 واستبعاد المنح غير المؤيدة بالمصدر، مع الاحتفاظ بقراءة `GetSelect` الحقيقية.
- `SearchWorkshopVehiclesAsync` يعتمد `Repository.Query<WorkshopMovement>` و`Repository.Query<Vehicle>` مع filter للفروع؛ لا يُستنتج نجاح EF translation/SQL أو اكتمال حماية ملفات المركبة من مراجعة المصدر فقط. تفويض استعماله مستقل عن `Workshop.View`.
- لم يُشغَّل build أو tests أو browser أو DB؛ الحالة التحليلية لا تعني إقفال الجرد.
