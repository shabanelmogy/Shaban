# عقد تبني صلاحيات الترحيل الشهري للمخصصات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | `/MonthlyPosting`، تحضير الشهر، التصدير، الترحيل والتحديث بعد النجاح |
| التحقق | source-only؛ لا build/test/lint/browser/DB/migration/snapshot/commit |

## القرار والمصادر

قُرئ شرح Speed للشاشة `18-vouchers/screens/17-provisions-monthly-posting.md`
وكود الدورة المؤرخ `readable/controllers/C1395--tenant.views.crs.vouchers.provisions.provisoinPosting.index.js`،
ثم قورن بمصدر Sigma الحالي. المصدر يثبت اختيار الشهر والتحضير والترحيل
والتصدير؛ لا يثبت مفاتيح Sigma أو إنفاذ الخادم.
لا توجد فجوة تحتاج Odoo لهذه الدفعة.

## مفاتيح المسار والأحداث

| الجزء | المتطلب المصدرّي |
|---|---|
| دخول المسار والتحضير | `MonthlyPosting.Prepare` |
| الترحيل | `MonthlyPosting.Prepare` + `MonthlyPosting.Post` |
| التصدير وإعادة القراءة | `MonthlyPosting.Prepare` |

التصدير قراءة محلية. القراءة تلغى عند سحب منحة التحضير أو تغير سياق الحساب أو
الشركة أو الفرع؛ الترحيل الذي بدأ يستمر بنتيجته ولا يعاد تلقائيًا.

## الفجوات والاستبعاد

لا يغير العقد الحسابات أو API/DTO أو schema. القبول التشغيلي وقياس الأداء
والبيانات خارج source-only.
