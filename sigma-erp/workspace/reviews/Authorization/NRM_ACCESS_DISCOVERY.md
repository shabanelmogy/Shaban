# اكتشاف نطاق الصلاحيات لحركات NRM

| البند | الحالة |
|---|---|
| Status | Discovery completed; contract frozen |
| التاريخ | 2026-11-11 |
| العقد | [NRM_ACCESS_CONTRACT_FREEZE.md](NRM_ACCESS_CONTRACT_FREEZE.md) |
| خط أساس الجرد | 141/263؛ NRM غير مُرقّى حتى التنفيذ والمطابقة |

## مصدر Speed بالترتيب

- الدليل `references/speed-analysis/2026-10-27/Speed_Analysis_Guide.md` الفصل 9: الحركة غير الإيرادية مرتبطة بالمركبة والموظفين والتشغيل والبيع، ويذكر الفتح والإغلاق، ولا يُثبت جميع مساراتها مالكي بيانات Sigma.
- الشرح `references/speed-analysis/2026-10-28/sidebar/13-movements/screens/01-nrms.md`: شاشة staff movements مع تصدير وطباعة وإنشاء وتعديل وإغلاق وحذف وإرسال إشعارات بشروط.
- الكود `C1119--tenant.views.staffMovements.index.js`, `C1118--tenant.views.crs.staffMovement.createOrEditModal.js`, `C1117--tenant.views.crs.staffMovements.closeStaffMovement.js`: منح View/Addnew/Edit/Close/Export/Delete وحارس موقع يميز الإغلاق والتعديل؛ يعتمد تسجيل Speed على `contact.id`، وتظهر الفروع حسب نوع الحركة. لا تنقل أرقام الأنواع أو دورة Speed إلى Sigma إلا إذا أثبتت خدمة ومتحكم حاليان.

## دليل Sigma الحالي والفجوات

| المجال | المصدر | نتيجة الاكتشاف |
|---|---|---|
| الشاشة | `SiGmaAngularFrontEnd/src/app/modules/Movements/NRM/components/list` و`components/details` | قائمة بفلاتر التاريخ والنوع والرقم واللوحة والموظف، عرض وطباعة وتصدير وإنشاء فقط؛ لا تعديل/حذف/إغلاق فعلية |
| محرر الإنشاء | `models/create.ts` و`details.component.ts/html` | نوع enum 0..4، مركبة/تاريخ مطلوبان، موظف اختياري، وقود/عداد نصيان، ملاحظات اختيارية؛ `BranchId` كان غائبًا من الطلب رغم تخزينه بالكيان |
| وحدة الخدمة | `NRMService` و`NRMController` | قائمة كانت تقرأ DbContext وتضم vehicle/staff/customer مباشرة؛ تقييد الاشتراك وحده لا يكفي لنطاق الفرع، وGetList كان يرجع `Ok` لفشل الخدمة |
| مصدر الفروع | `BranchScopeRegistry.Direct<NRM>("BranchId")` | يملك الفرع التاريخي القراءة الصحيحة؛ الإضافة الجديدة تحتاج `BranchId > 0` وتحقق `AllowsWrite` لا أخذ الفرع الحالي للمركبة |
| الربط بسجل الحركات | `logsMovement/components/view/view.component.ts` و`NRMController.GetMovementLogDetails` | قراءة NRM متخصصة مشتركة مع سجل الحركات، مصنفة حاليًا باسم `NRM.GetMovementLogDetails` في ReviewedPermissionOperations، وتحتاج إعادة تأكيد اعتماد المستهلك بالمراجعة |
| مصدر الرقم والاشتراك | `Repository.AddAsync` وJWT | `ClaimTypes.NameIdentifier` يحمل الاشتراك الموقع عمدًا؛ الرقم والاشتراك من الخادم لا من DTO |
| المنافذ الموروثة | `SiGmaControllerBase` | يلزم حسم `GetById`, `GetByWithNavigationsId`, `GetAllWithNavigations`, `CheckUnique`, `GetSelect`, `Update`, `Remove`, `HandleActivate` وعدم تعيين منح لأعمال غير مدعومة |

لا تمتد هذه المهمة إلى `NonRentalMovement` القديم ذي المفتاح Guid أو إلى تنفيذ دورة Speed الكاملة. لا بناء أو اختبارات أو متصفح أو هجرة أو اتصال بقاعدة البيانات؛ القبول التشغيلي للمالك.
