# اكتشاف وتخطيط تبني صلاحيات Staff — البند ١٥٢

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | قائمة Staff ومحرر الخطوات وحوار تعديل الراتب والوثائق الخاصة |
| العقد | [العقد المجمد](STAFF_ACCESS_CONTRACT_FREEZE.md) |
| حدود التنفيذ | المصدر فقط؛ لا ترقية الجرد قبل المصالحة |

## المرجع والوظيفة

قُرئ مدخل Speed المحلي ودليله `2026-10-27/Speed_Analysis_Guide.md` في مواضع سجل الموظف والموارد البشرية. الشرح يثبت الموظفين والوثائق والحضور والرواتب كنطاقات متصلة، ولا يقرر حساب رواتب أو استحقاقات جديدًا. ثم قرئت شريحة `2026-10-28/sidebar/06-staff/screens/01-staff.md` وR0362 وC1113 وC1112 وC1116. الأول يثبت قائمة الموظفين والمخرجات والحذف والتعديل، والثاني ملف البيانات والوثائق والبنوك والأهلية مع فصل قراءة/تحرير الراتب، والثالث تعديل الحزمة. تُطبق منح Sigma الفعلية ولا تُنقل أسماء منح Speed حرفيًا. لا غموض وظيفي متبقٍ يحتاج مكمّل Odoo لهذه الشريحة؛ لا توسع إلى نظام عمل أو حساب راتب جديد.

## مصفوفة الطلبات

| المستهلك | الخدمة/الطلب | المنحة | صاحب البيانات/التحميل |
|---|---|---|---|
| القائمة/البحث/Excel | StaffService.getList/getAllList؛ GET Staff | Staff.View | قراءة تشغيلية؛ page loader؛ لا cache نتائج |
| العرض والتعديل | StaffService.getDetails؛ GET Staff/GetByWithNavigationsId | Staff.View؛ editor Edit يزيد Update/Branch.Lookup | DTO محدود؛ page loader؛ View بلا قوائم تحرير |
| الإنشاء/الحفظ | POST/PUT Staff | Create أو View+Update؛ Branch.Lookup؛ مراجع اختيارية عند الإسناد/التغيير | وحدة العمل والخادم يملكان التحقق؛ الكتابة المرسلة مستقلة |
| حذف الملف | DELETE Staff | Staff.View+Delete | تأكيد قائم؛ page loader؛ ارتباطات الخادم قائمة |
| قراءة/تعديل الحزمة | GET/PUT Staff/{id}/SalaryPackage | View+GetSalaryRevision؛ PUT يزيد ReviseSalary | رسالة محلية في dialog؛ المحرر يقرأها فقط بمنحتها |
| الحزمة الأولية | StaffAddVM.SalaryPackage | Staff.ReviseSalary شرطية | إدخال اختياري لا ينشئ حزمة صامتة دون المنحة |
| اختيار الفرع/البلد | Branch/Country GetSelect | Lookup لكل منهما | مصدر مرجعي مع finite bootstrap ثم watch؛ owner ReferenceLookupBindings |
| بقية مراجع المحرر | Department/Shift/StaffDesignation/SponserShip/LeaveType/Staff GetSelect | Lookup لكل مصدر | قراءات مباشرة بلا opt-in للكاش مثبت في مصدر الخدمة؛ لا يُجلب المصدر غير الممنوح |
| مرجع الدور الموجود | GET Staff/role-options | Staff.GetRoleOptions | قراءة محدودة جديدة لنفس علاقة RoleId؛ لا فتح RoleController لغير المدير |
| التكرار الاستباقي | Staff/CheckUnique | Staff.Validate عند منحها | inline validator؛ التحقق الخادمي عند الحفظ لا يعتمد عليها |
| وثيقة الموظف | POST/GET/DELETE Media، staff-document | منح Media مع مالك Staff/المستند والرافع | مخزن خاص؛ رابط authenticated/no public fallback؛ uploader draft cleanup |
| رابط التقرير | /StaffBalancesSummary | Staff.GetStaffBalancesSummary عبر حزمة الوجهة الحالية | تقرير مستقل سبق تبنيه؛ لا تغيير حساب أو صلاحياته |

## مطابقة الشكل والمالكين

| الاهتمام | المرجع الحاكم | المالك القائم | قرار التنفيذ |
|---|---|---|---|
| القائمة والمحرر | UI02/UI03؛ Staff route/components الحاليان | DataTable وStepForm وEditableRows | Keep/Extend؛ لا إعادة رسم أو تغيير أعمدة |
| السياق والمنح | UI26/28 | AccessViewPolicy/AuthSession/CurrentAccess | Extend؛ trigger حي؛ إعادة تحقق دلالية؛ حفظ مسودة وعزل نتائج الكتابة |
| الحوارات والتجاهل | UI7/10/28 | EditorDialog وConfirmationDialogService | Keep/Extend؛ إخفاء البيانات مع وسيلة خروج محلية؛ لا هدم المسودة كحل أمني |
| الاختيارات والكاش | UI2/16/22 | خدمات المصدر وReferenceLookupBindings | Preserve؛ تهيئة الصفحة مرئية، والتحديث المحتفظ صامت |
| الوسائط | UI18/26، مالكو private uploads الحاليون | FileStore وPrivateUploadPath وFileLink/FileField/DocumentUploadTracker | Extend بمورد Staff؛ لا مخزن أو API رفع بديل |
| الحفظ والملكية | BE5/8 | StaffService ووحدة العمل وInvalidInputAsync | Preserve؛ لا تغيير حسابات أو مخطط؛ عدم كشف graph راتب من GET بديل |

الأعمدة: no/displayName/mobileNo/email/designationLabel؛ ListDTO: id/no/firstName/middleName/lastName/mobileNo/email/staffDesignation، ثم يحسب المكوّن تسميات العرض. المعرف وقطع الاسم حد أدنى للعرض والأفعال؛ لا حاجة لحمولة SalaryPackages في القائمة. لا تغيير في العقود المالية للراتب/الإضافي، ولا AutoMapper جديد مطلوب لمجرد إخفاء زر.

توزيع العمل بعد التجميد: عامل terra للقائمة وحوار الراتب، وعامل terra للمحرر، وعامل sol للخادم والوسائط؛ الجذر يملك المصدر المشترك للمفاتيح والاعتماديات والطرق واللغات والدليل والتكامل. الملكيات غير متقاطعة؛ الفحص النهائي وملاحظات الدمج عند الجذر. لا worktree إضافي لتجنب فصل تغييرات العمل الموجودة بين المستودعين، ولا أوامر commit أو تشغيل.

قائمة الخادم محدودة بترقيم موجود وفلاتر الاشتراك، وGetRoleOptions إسقاط مباشر Id/Name بلا استعلام لكل صف. قراءة الحزمة الحالية تحمل تاريخ حزم الموظف وفق الحساب القائم؛ لا تُستبدل بسعر أو مدة مخترعة. فحص المراجع الاختيارية قبل Update يقرأ snapshot واحدًا مخزنًا بعمر الطلب فقط إذا غابت منحة مطلوبة لتقرير أن المرجع لم يتغير، ولا يضيف cache بيانات عبر المستخدمين. لا اقتراح فهرس جديد قبل plan/cardinality حقيقية؛ فهارس الموظف/Partner والمراجع القائمة تراجع في قبول المالك. لا قياس زمن أو SQL/EF translation مدعى من فحص المصدر.
