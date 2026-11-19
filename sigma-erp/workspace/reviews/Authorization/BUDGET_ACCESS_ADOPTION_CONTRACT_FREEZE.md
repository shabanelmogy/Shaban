# تبني صلاحيات محرر الموازنة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | Accounts/Budget الحالي وخدمته ومساره، سجل المسارات والدليل والجرد |
| التحقق | source-only؛ لا builds/tests/lint/browser/DB/migrations/commits |

## العقد والمرجع

المسار الفعلي /Budget من pages/routing.ts:1786 إلى budget.routes.ts ثم
components/budget/BudgetComponent. مصدره BudgetService؛ GET وPOST إلى
AccountReports/Budget. المالك الخلفي AccountReportsController وAccountReportsService.
المفتاحان assignable في ReviewedPermissionOperations: AccountReports.GetBudget
وAccountReports.SaveBudget. ليس CRUD عامًا، ولا يرث المصدر مفاتيح Budget.View/Update.

الشكل UI05 financial collection editor، مع UI14/10/22/26/28/29 وUI2 وMaster4/5/7؛
المالك EditableCollectionTable وحقول ReactiveForms والملخص والحوار الحاليون.
قرئ Speed قسم21 شاشة20-budget بتاريخ2026-10-28 ثم المتحكم C0476 منفصلًا:
سنة/نوع حساب، خلايا شهرية، إجماليات، حفظ ثم إعادة قراءة، وتصدير. لا يثبت ذلك
إنفاذ صلاحيات خادم. لا شرح أصلي مطابق في guide/catalog بتاريخ2026-10-27 ضمن
بحث العناوين السابق، ولا غموض مفاهيمي يحتاج Odoo لهذه الشريحة.
قرئ المصدر المحلي والدليل الحالي؛ الحفظ يرسل changed cells فقط. الحسابات
والمجاميع وسياسة أهلية AccountSelectionPolicy.Budget والـDTO/EF لا تتغير.
فحص الحزم قبل الاستخدام٨/٨OK.

## المتطلبات والأحداث

| العملية | المتطلب | المصدر/العمر |
|---|---|---|
| فتح/قراءة/بحث/تصدير الموازنة | allOf(GetBudget,FiscalYear.GetSelect,AccountGroupDefinition.GetReportOptions) بأسماء الموارد الكاملة | المصادر إلزامية للمحرر الحالي: السنة ونوع الحساب والتحقق عند الحفظ |
| تعديل الخلايا والحفظ | متطلب القراءة + AccountReports.SaveBudget | الشاهد/handler معًا، ولا تجاوز من تغيير FormControl برمجيًا |
| اختيار السنة | FiscalYear.GetSelect | GET FiscalYear/GetSelect؛ مباشر بلا opt-in cache |
| اختيار نوع الحساب | AccountGroupDefinition.GetReportOptions | GET AccountGroupDefinition/ReportOptions؛ مباشر بلا cache |
| تحديث بعد حفظ مثبت/Retry | متطلب القراءة الحالي فقط | GET مستقل قابل للإلغاء؛ سحب Save لا يلغي POST المرسل أو يمنع قراءة نتيجته عند بقاء منحة القراءة |
| البحث/Reset مع dirty | confirmation محلي كسول، capture/recheck قبل القراءة/التغيير | إلغاء القرار عند انتهاء المنحة/السياق؛ لا discard متأخر يطلق GET |
| مغادرة بمسودة | dirty exit المحلي الحالي | يسمح بتأكيد تجاهل جديد بدأ أثناء الرفض حتى يستطيع المستخدم المغادرة؛ الإلغاء يعيد false وفق UI28 |

المفتاح الكامل للقراءة AccountReports.GetBudget. المصدران جزء من متطلب الصفحة
والمسار، بعكس اختيار نوع الحساب الاختياري في BudgetVariance. لا تعديل لعقد
BudgetVariance السابق. Page route exact فقط، مع landing candidate.

## الحالة والعمر

يستهلك المحرر AccessViewPolicyService الحالي. يبقى mounted لحفظ المسودة؛ يُحجب
host بhidden+inert وaria-hidden عند الرفض، مع رسالة الرفض وإغلاق Select portals.
تظل الخلايا مقروءة ومعطلة بلا منحة الحفظ، ويُحجب زر الحفظ عند غيابها. يستعيد
المنح الصالحة دون overwrite لمسودة dirty. الحارس المباشر يفحص actor/auth/token
وdataContext قبل effect. انتهاء السياق ينهي الجلسة القديمة حتى إعادة فتحها،
ولا يسرب rows/options/periods من مستخدم أو فرع/نطاق سابق.

تُلغى كل قراءة options/report/post-save refresh وقرارات التأكيد عند انتهاء
access/context، مع تحرير loader/busy في finalize. يُستعاد bootstrap الناقص
والبحث المنقطع مرة عند إعادة المنح في السياق نفسه؛ لا GET بسبب revision غير
متعلق، ولا إعادة بحث لم يُطلب، ولا استبدال rows dirty بقراءة مستعادة.

بعد إرسال POST لا يضاف له takeUntil(access/context) ولا يُعاد تلقائيًا. يحتفظ
بنتيجته المستقلة وتحرير busy/loader. نفس السياق: نجاحه يمنع إعادة حفظ changed
cells قبل قبول إعادة القراءة؛ تبقى refreshPending ودالة Retry. إذا مُنعت
القراءة تُؤجل إلى إعادة المنح. عند تغير السياق لا تُطبَّق result/error/toast
على الجلسة الحالية. الفشل يحافظ على المسودة. لا دمج إلغاء GET اللاحق مع POST
المرسل بحيث يخفي نجاح الحفظ أو يترك إمكانية تكراره.

## الكاش والتحميل والأداء والمخطط

المصادر كلها مباشرة، ولا cache جديد أو watch لمصدر بلا opt-in. تستخدم عمليات
القراءة والحفظ loader الصفحة القائم؛ تصحيح stateMessage loading المكرر ضمن
حراسة الصفحة إن وجد، مع busy/aria-busy وأخطاء وRetry. لا per-row HTTP.
GetBudget يقرأ الحسابات المسموحة ثم موازنة السنة بنطاق accountIds، ويعيد
collection كاملة مرتبة؛ لا paging مستحدث. فهرس AccountBudget الموجود
(SubscriptionId,FiscalYearId,AccountId,Year,Month) يدعم نطاق القراءة/الحفظ.
لا index جديد أو schema أو migration؛ قياس الشبكة والخطة وزمن العرض عند المالك.

## الملكية والتسليم

عامل التنفيذ يملك Accounts/Budget فقط، بما فيه spec جديد بالاسم
budget-access.spec.ts دون حذف أي مواصفات أو تغييرات أخرى. لا تعديل للمشترك أو
registry/docs/inventory أو backend؛ يملكها الجذر. المطلوب implementation+
source specs ومراجعة scoped diff دون تشغيل. الجذر يراجع التكامل ويحدّث
الدليل الثنائي /UserGuide/accounts والجرد والمصالحة. الهدف العام active.

التنفيذ المصدرّي في Budget سلّم: التعديلات محصورة في component وHTML ومواصفة
الوصول الجديدة؛ route registry ودليل الحسابات تحت تكامل الجذر. المراجعة المستقلة
حددت عيب استعادة P1 في ترتيب finalize/effect؛ صُحح بوضع أعلام interruption
داخل مسار denied نفسه، واستهلاكها حتى عند coalesced revoke/regrant، مع تغطية
خيارات التقرير وrefresh بعد POST. أضيفت كذلك معالجة lookup فارغ ومواصفات
الاستعادة السريعة والتدمير؛ لم تُشغّل المواصفات بعد.
