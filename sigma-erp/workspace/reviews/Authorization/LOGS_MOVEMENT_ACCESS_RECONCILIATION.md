# المطابقة المصدرية النهائية — سجل الحركات الموحّد logsMovement

| البند | الحالة |
|---|---|
| الاعتماد | Implemented, operation-confirmed **source-only**؛ Runtime/HTTP/SQL acceptance pending |
| العقد | [LOGS_MOVEMENT_ACCESS_CONTRACT_FREEZE.md](LOGS_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) |
| اكتشاف Speed/Sigma | [LOGS_MOVEMENT_ACCESS_DISCOVERY.md](LOGS_MOVEMENT_ACCESS_DISCOVERY.md) |
| الجرد | ترقية صف `logsMovement` فقط: 146/263 مؤكدًا و58 resource-only و55 unknown و2 context-only و2 alias |
| التالي | `EquipmentQuotation` وفق ترتيب الجرد، لا تُستنسخ لها grants الحركات |

## عمليات الواجهة والخادم

| الوظيفة | تنفيذ Angular | تنفيذ الخادم/المنح |
|---|---|---|
| القائمة/بحث/Excel/تقرير الصفوف | `Movements/logsMovement/components/list/list.component.ts/html`؛ `view` = `CollectionMovement.GetMovements` وحده، `switchMap/takeUntil`, صفوف `visibleRows`, منع نشر صادرات/Print بعد فقد المنحة/السياق أو تبديل الحساب؛ UI22 مؤشر صفحة | `CollectionMovementController.GetMovementsAsync` يستخدم `ToActionResult`; `CollectionMovementService.GetMovements` Reviewed reader مستقل عن `CollectionMovement.View`, يجمع خمس حركات scoped حسب مصدرها وفرعها التاريخي |
| فلتر جهة الاتصال | Customer/GetSelect cache تحت `Customer.Lookup` الاختياري، لا يُقرأ دون الحق ولا يُلزم عرض القائمة؛ `contactId` وgrid على Contact/ContactCode يختفيان عند revoke وتلغى طلبات القائمة والصادرات القديمة | `PermissionPrerequisites` يرفض `contactId` أو grid محمي دون `Customer.Lookup` بينما يجيز قائمة عادية. `MovementFiltersDto` أضيفت إليه `grid`، و`GridFilter.Apply` يعمل على `MovementDto` scalar whitelist بعد التجميع وقبل Count/Skip، ويستبعد FK/MovementKey/Source من filter |
| عرض/CheckCard صف فعلي | `logs-movement-access.ts:movementLogDetailRequirement` يمنح كل مصدر حدّ التفاصيل الخاص به، والفتح يتأكد من `data().includes(row)`, `movementKey`, `movementId`, صلاحية المصدر وactor؛ لا detail لصف مجهول أو ممنوع | Agreement يحتاج RentalAgreement.View؛ Collection يحتاج CollectionMovement.View؛ Delivery يحتاج DeliveryMovement.View؛ WorkshopMovement يحتاج WorkshopMovement.View؛ NRM يحتاج **NRM.GetMovementLogDetails** المستقلة، وكل GET scoped في مالك المصدر |
| مستندات اتفاقية | `view.component.ts/html` لا يقرأ مستندات الاتفاقية دون `RentalAgreement.GetDocuments` مع View/GetMovements؛ تُلغى قراءات المستندات عند revoke، وتظل تفاصيل المصدر الأساسية ممكنة دون المنحة | GET `/RentalAgreement/{id}/documents` يحتفظ بحارس Tenant/Branch/Permission الخادمي المستقل، دون منح media للأرشيف كله |
| رفع مستند داعم | `RentalAgreement.UploadDocument` + View/GetDocuments/GetMovements + تحقق أحقية المستند، وPOST المرسل يستمر بعد unmount، ويقيّد النشر بـ`CAN_PRESENT_API_OUTCOME`/الجلسة/الحق | RentalAgreement.UploadDocument يحمل server prerequisites لـView+GetDocuments؛ لا صلاحية upload عامة من مجرد GetMovements أو من CheckCard |
| قائمة عناصر الفحص | `ChecklistItem.View` اختياري للـGET، عند غيابه يعرض بديلًا ثابتًا دون طلب GET، ولا تُنسب إليه إجابات/أضرار محفوظة | ChecklistItem endpoint منفصل عن GetMovements؛ الـfallback أسماء ثابتة لا يفترض معها بيانات حقيقية |

## عمر القراءة والوسائط والأداء

سُجل `/logsMovement` بوضوح داخل `RouteAccessPolicyRegistry` على `CollectionMovement.GetMovements`، وشروط المصادر داخل المكونات لا تعتمد على Route Guard وحده. `AccessViewPolicyService.revision`, `dataContext`, `observeAuthSession` و`readAuthSessionKey` تبطل بيانات الحساب/الفرع القديم و`ReportPrintSession.cancelPending`، وتمنع طباعة تفاصيل/Excel/تقرير قديم بعد فقد grant أو تغيير الحساب. يتم تحديث العميل المفلتر وحده عند فقد Customer.Lookup، ولا تُغلق القائمة الأساسية عند سقوط مرشح اختياري. طلب UploadDocument المرسل يستقر حتى النهاية بلا إعادة إرسال، وتُعرض النتيجة فقط في سياق المالك الصحيح. مؤشر الصفحة العام للقائمة/التقرير/Excel/رفع المستند، ومؤشر النافذة محلي للقراءة ومستندات الاتفاقية وChecklist.

خادم GetMovements الحالي يجمع عدة مصادر ثم يفلتر/يرتب في الذاكرة بعد إسقاطها من SQL؛ أُضيف دعم grid bounded على DTO المتاح مع حظر مرشحات حقول الهوية الداخلية، ولم يُدّع تحسين plan الفعلي أو سرعة لم تُقَس. تتطلب خطط SQL وHTTP والترجمة الفعلية لمرشحات EF واختبار سحب grant أثناء الطلب قبولًا تشغيليًا لاحقًا. لا يوجد تغيير مخطط يستلزم migration جديدة لهذه الوحدة، والهجرات السابقة NRM وCollectionMovement منفذة ومثبتة في ملفاتها.

## المسارات والإثبات والمراجعة

Frontend: `Movements/logsMovement/{logs-movement-access.ts,logs-movement-routes.ts,components/list,components/view,services/logs-movement.service.ts,models/list.ts}`؛ `shared/authorization/route-access-policy.ts` جزء logsMovement؛ دليل `UserGuide/content/movements-guide.ts` AR/EN. Backend: `SiGma.Helpers/Dtos/MovementFiltersDto.cs`, `SiGma.Business/Services/CollectionMovementService.cs` جزء GetMovements، `SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs` جزء `CollectionMovement.GetMovements`. source specs: `tests/SiGma.BranchAccess.Tests/MovementLogAccessContractTests.cs` وإضافة إلى `PermissionPrerequisiteTests.cs`، و`components/list/list-access.spec.ts`. تمت مراجعة `git diff --check` للمسارات الخاصة بهذه الوحدة في المستودعين بلا أخطاء whitespace؛ LF→CRLF تنبيه لا يُعد فشلًا.

**لم تُنفذ** tests/lint/typecheck/build لهذا الجزء ولا browser/HTTP/SQL/commit/push/deploy. إثبات المسارات والمفاتيح والشروط ومصادر البيانات مصدرّي فقط، وليس اختبار ثغرات أو قبول تشغيل. مراجع Speed المعتمدة: `Speed_Analysis_Guide.md` 2026-10-27 و`sidebar/13-movements/screens/06-movements-log.md` 2026-10-28، C1631/C1630/C1632/C1636/C1638؛ لا Edit/Delete/SendSMS/DamageInvoice مدعومة في Sigma log الحالية.
