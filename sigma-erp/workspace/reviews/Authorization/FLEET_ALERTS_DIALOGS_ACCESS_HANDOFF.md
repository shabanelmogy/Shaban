# تسليم حواري تنبيهات الأسطول

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | `Fleet/Alerts/components/complete-service-dialog/**` و`renew-insurance-dialog/**` فقط |
| التحقق | مراجعة مصدر/قالب و`git diff --check` فقط؛ لا build أو tests أو browser أو DB |

- يستخدم تجديد التأمين `fleetAlertsAccess.renew`، وإتمام الخدمة
  `fleetAlertsAccess.complete`، مع `EditorDialog` و`MockData` المحميين.
- لا يبدأ أي من الحوارين lookup. يظل مدخل المركبة/الخدمة من الصف الأصلي
  ويُتحقق من الهويات الموجبة قبل الإرسال. إتمام الخدمة يختار فرع تنفيذ قابلًا
  للتسجيل من `CurrentBranchService` فقط.
- الكتابات المرسلة تستعمل `trackWrite` و`HttpContext`. نجاحها يثبت أولًا؛
  إن سحب الوصول حجب النشر، يبقى الإغلاق المحلي الصريح ممكنًا دون إعادة كتابة.
  فشل الكتابة العادي يعيد إتاحة المسودة.
- قرار discard كسول، قابل للإلغاء عند تغير الوصول/السياق، والإغلاق بعد الرفض
  لا يتطلب بقاء المنحة. تنظف منافذ DatePicker/Select عند الرفض والتدمير.
- أضيفت مواصفات مصدرية غير منفذة لتثبيت سياق الكتابة، فرع غير قابل للتسجيل،
  وعدم replay/النشر بعد revoke ثم الإغلاق المحلي.

يبقى قبول التشغيل والتحقق النوعي والمرئي مع المالك. الأداة لا تملك خيار
`--fleet-alerts` مستقلًا؛ نفذ الجذر لاحقًا `--service-log` الموسع ليشمل
كل مجلد Alerts مع الوحدتين السابقتين، وهو parsing/import existence
فقط. راجع العامل عناصر القالب واستيراد InputNumberModule وTranslateOptionsPipe
وأصحاب DatePicker/Select/MockData يدويًا؛ هذا لا يعادل type checking.
