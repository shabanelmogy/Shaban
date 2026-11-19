# تسليم مصدر خلفية المستخدمين والموظف وسجل التغييرات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| العقد | USERS_COMPLETION_CONTRACT_FREEZE.md |

تُستهلك القائمة عبر GET User الحالي. يحتفظ مسار الخدمة بالتصفية العامة
وتطبيع الصفحات والترتيب وحساب العدد. تضاف تصفية البحث النصي والحالة المرتبطة
بالهوية وفرع العرض، مع أسماء الاتصال والفرع والموظف القابلة للفرز. مرشح
StaffId وحالة Active والمرشحات السابقة يتبع مالك الحقول العام. يؤدي
إرسال pageNo وpageSize إلى صفحات الخادم، ويظل القارئ القديم دون معاملات
صفحات على عقده السابق.

تُحمّل الأسماء من الملاحة صراحةً، ثم تُقرأ إسنادات UserRoleAssignment
والأدوار الحية وإسنادات الفروع النشطة في دفعات تغطي معرفات الصفحة. مصدر
عدد الأدوار وأسمائها هو الإسناد الحديث. يظهر مالك النظام بجميع الفروع
النشطة. يرسل إثراء Security طلب حالة واحدًا لمعرفات الصفحة المرتبطة، ويطابق
معرّف الهوية المحلي بالرد. يبقى نجاح قائمة ERP قائمًا عند غياب الخدمة، مع
حقول metadata خالية وidentityStateAvailable=false. الدقة الزمنية وقياس
الأداء والاستعلام الفعلي معلقة على قبول المالك.

أضيف StaffId اختياري إلى User وعقود الإضافة والتعديل والتفاصيل والقائمة.
يتحقق الخادم من موظف حي نشط داخل الاشتراك. إعادة طلب إنشاء مستخدم محفوظ
لا تستبدل الموظف، بل ترفض اختلاف الملف عن الطلب الأصلي وتوجه إلى ملفه.
تبقى حماية المالك وإجراءات الهوية الحالية وعزل كلمات المرور كما في العقد.

تعيد GET User/{id}/audit نتيجة Results<AuditTrailRowDto> بصفحات. يقرأ
المسار AuditTrailEntry للمستخدم الهدف من خلال GUID داخل الاشتراك.
يحافظ التدقيق العام على تغييرات ملف User، ويضيف UserAdministrationAudit
أحداث UserAccessChanged وUserBranchAccessChanged مع كتابة الأدوار والمنح
والفروع في نفس SaveChanges. يمكن لمالك إدارة الهوية استعمال نفس Stage
لتوثيق إجراءاته دون إرسال كلمات المرور أو الرموز إلى JSON التدقيق.

الأنواع الجديدة منفصلة الملفات، وUserService.Read.cs جزء من UserService
نفسه. لم تُنشأ طبقة DI إضافية. توجد تبعية اختيارية إلى
IIdentityUserAdministrationClient لتوافق المنشئات القائمة، وتسجيل هذه
التبعية مملوك لدفعة الهوية عند الجذر.

## الملفات المملوكة

- الخلفية الأساسية في UserService.cs وUserService.Read.cs وIUserService.cs وUserController.cs.
- الربط في Helpers/Models/User.cs وDataAccess/Configuration/UserConfig.cs وUserProfiler.cs.
- عقود UserAddVM وUserUpdateVM وUserDetailVM وUserListVM.
- التدقيق في Services/Authorization/UserAdministrationAudit.cs وإضافات SaveUserAccessAsync وSaveBranchUsersAsync وSaveUserBranchesAsync في مالكيها الحاليين.

## قبول المالك

يلزم هجرة مالك باسم AddUserStaffLink لإضافة العمود StaffId والمفتاح الخارجي
المقيد عند الحذف وفهرس العلاقة. لا تغيير مالي أو backfill تخميني. لم تُنشأ
أو تعدل هجرة أو snapshot. البناء والاختبارات وSQL والمتصفح لم تُشغّل.

نجح تحليل ١٤ ملف C# بواسطة Roslyn syntax parsing، وفحص diff للملفات
المملوكة. طُوبق namespace الخدمة والواجهة وDTOs والمراجع الحالية للمشاريع
ذات SDK source inclusion. هذه أدلة مصدر، ويظل قبول EF queries وتهيئة
AutoMapper والهجرة وتجربة الربط والتدقيق الفعلي معلقًا.

رسالة التسجيل المقترحة للخلفية هي `Complete tenant user list, staff links and access audit timeline`.
