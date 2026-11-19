# عقد تبني صلاحيات دورة الإهلاك التلقائي والمخصص

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | `/Amortization`، التحضير التلقائي والمخصص، الجداول، التشغيلات، الحفظ، الاعتماد، الإلغاء، الحذف، القيد والسجل |
| التحقق | source-only؛ لا build/test/lint/browser/DB/migration/snapshot/commit |

## القرار والمصادر

تتكون الشاشة من أربع مناطق مستقلة: تحضير تلقائي، تحضير مخصص، جداول الإهلاك،
والتشغيلات المحفوظة. يحتاج كل مصدر قراءة أو حدث إلى مفتاحه؛ لا تكفي صلاحية
عرض عامة لفتح الجدول أو تنفيذ الحفظ.

قُرئ شرح Speed لقسم السندات ودورة الإهلاك، ثم قورن بالمصدر الحالي في Sigma.
الكود المرجعي يثبت التحضير والحفظ وتغيير الفترة والتصدير، ولا يثبت مفاتيح Sigma
أو إنفاذ الخادم. لا توجد فجوة تحتاج مرجع Odoo لهذه الدفعة.

## مفاتيح المسار والأحداث

| المسار/الحدث | المتطلب المصدرّي |
|---|---|
| دخول المسار | `Amortization.Prepare` أو `Amortization.Runs` أو (`Amortization.Sources` + `Amortization.Schedules`) |
| التحضير التلقائي/المخصص | `Amortization.Prepare` |
| حفظ التشغيل | `Amortization.Prepare` + `Amortization.SaveRun` |
| قائمة الجداول ومصادرها | `Amortization.Sources` + `Amortization.Schedules` |
| إنشاء جدول | `Amortization.AddSchedule` + `Branch.Lookup` + `Account.GetPostingSelect` + `Currency.GetFinancialNumberPolicy` |
| حذف جدول | `Amortization.Schedules` + `Amortization.DeleteSchedule` |
| التشغيلات | `Amortization.Runs` |
| حذف تشغيل | `Amortization.Runs` + `Amortization.DeleteRun` |
| قراءة وقرار الاعتماد | `Amortization.Runs` + `Amortization.View` / `Amortization.ManageApproval` |
| الإلغاء والقيد والسجل | `Amortization.Runs` + `Amortization.Void` / `Amortization.Journal` / `Amortization.Log` |

التصدير قراءة محلية لنتيجة التحضير، ولا ينشئ عملية خلفية جديدة.

## العمر والحالات

تُلغى القراءات عند سحب المنحة أو تغير سياق الحساب أو الشركة أو الفرع، وتُمحى
الجداول والنوافذ التابعة عند فقد الوصول. الكتابات المرسلة تستمر بنتيجتها ولا
تعاد تلقائيًا. تعود الشاشة إلى أول تبويب ما زال ممنوحًا بعد تغيير الصلاحية.

تُحرس اختيارات الفروع والحسابات وسياسة الدقة عند فتح محرر الجدول، وتُنظف
مراقبات الاختيارات عند سحب منحة الجدول. الاعتماد يمر عبر مالك الحراسة المشترك.

## الفجوات والاستبعاد

لا يغير العقد الحسابات أو توزيع الفروع أو API/DTO أو schema. لا يُفترض مفتاح
تفصيلي غير موجود؛ شاشة التشغيلات تعتمد على عملياتها الحالية. القبول التشغيلي
والقياس والتغييرات المالية خارج source-only.
