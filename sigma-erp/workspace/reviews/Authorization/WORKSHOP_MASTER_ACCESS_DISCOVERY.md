# اكتشاف صلاحيات تعريف الورش — Workshop master

| البند | الحالة |
|---|---|
| Status | Discovery completed; contract frozen |
| التاريخ | 2026-11-11 |
| الجرد قبل التنفيذ | 141/263؛ صف `Workshop` ما زال `resource-only` حتى المطابقة |

## مرجع Speed والتمييز الوظيفي

قُرئ مدخل المرجع `references/speed-analysis/README.md`، ثم دليل Speed النصي المؤرخ 2026-10-27 الفصل 13 «الموارد البشرية وعلاقات العملاء والورش» الأسطر 277–285؛ يصف برنامج الورشة العام ولا يثبت شاشة تعريف الورش كجدول أسماء مستقلة. وقُرئ فهرس الشاشات `references/speed-analysis/2026-10-28/sidebar/13-movements/screens/02-workshop-movements.md`، الذي يوثق **حركات الورشة** ودورة المركبات والفتح والإغلاق، وليس شاشة `Workshop` الرئيسية للتعريف بالاسم. لا تُستورد وظائف الحركات أو الفوترة أو الإغلاق إلى تعريف الورش لمجرد تشابه التسمية؛ `WorkshopMovement` صف تالٍ مستقل في الجرد. لا توجد تفاصيل خادم Speed تثبت فريدة اسم الورشة أو تحويلها إلى مورد ذي فرع مستقل.

## مصدر Sigma الحي

| المجال | دليل المصدر الحالي | الاستنتاج |
|---|---|---|
| المسارات | `Movements/Workshop/workshop.routes.ts:4-8` و`pages/routing.ts` | `/Workshop` و`/Workshop/create` و`/Workshop/details/:id`، قائمة مشتركة ونافذة |
| القراءة والإخراج | `components/list/list.component.ts:57-105,234-255` و`services/workshop.service.ts:19-26` | فلتر الاسم/الرقم، جدول الاسم والرقم والمنشئ والتاريخ، Excel بكل الصفحات، عرض التفاصيل |
| الكتابة | `components/details/details.component.ts:46-54,133-197` و`workshop.service.ts:28-33` | إنشاء اسم حقيقي وتعديل اسم محفوظ؛ واجهة تعرض حد 250 للإنشاء و50 للتعديل؛ لا حذف في الواجهة |
| الخادم | `WorkshopController.cs:8-25` و`WorkShopServices/WorkshopService.cs:6-13` | CRUD الأساسي موروث؛ منفذا مركبات الورشة `GET/POST /Workshop/vehicles` مستقلان ومستهلكان في شاشة أخرى |
| الملكية | `Helpers/Models/Workshops/WorkShops/Workshop.cs` و`WorkshopConfig.cs` | `EntityBaseWithName` داخل الاشتراك، لا `BranchId` لهذا التعريف؛ لا يُختلق فرع ملكية |
| صلاحيات المركبات | `ReviewedPermissionOperations.cs:594-595` | `Workshop.GetVehicleDetails` و`Workshop.SearchVehicles` موجودتان كمفاتيح مستقلة لمستهلكي مركبات الورشة؛ لا يُعاد ربطهما بإنشاء/عرض تعريف الورش دون عقد شاشتهما |
| المستهلكون للـLookup | `Fleet/ServiceLog/services/servicelogs.service.ts` و`Workshop/Job/components/editor/editor.component.ts` | يحتاج `Workshop.GetSelect` إلى إبقاء `Workshop.Lookup` متاحًا حسب عقد المستهلك |

## فجوات التنفيذ عند الاكتشاف

لا توجد في سياسة المسارات الحالية قاعدة لـ`/Workshop` أو `/create` أو `/details`. تبدأ القائمة GET حتى عند فتح إنشاء مستقل، وتفتقر أفعال الصفوف والتحرير والتصدير إلى حراس الجلسة/المنحة؛ POST وPUT مرتبطان خطأً بتدمير نافذة المحرر. لا تُستنبط من هذا كشف بيانات خارج الاشتراك؛ المستودع هو مصدر نطاق الاشتراك وتحتاج المداخل إلى فحص مستقل. تتطلب المطابقة النهائية تحديد ردود عمليات Delete/Activate/CheckUnique/unbounded GetAll غير المستعملة، وإبقاء اختيار الورش العام ومنافذ المركبات المستقلة، والالتزام بالتقدم UI22 والقراءات الملغاة وإكسل.
