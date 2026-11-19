# التدقيق المستقل لحواري رفض عرض الإيجار وإنشاء الماستر

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-10 |
| النطاق | `components/rejection-dialog/**` و`components/master-agreement-dialog/**` |
| التنفيذ | قراءة فقط؛ لم يُعدّل مصدر الحوارين ولم تُشغّل اختبارات أو build/typecheck/lint/browser |

## النتائج المفتوحة

لا توجد نتائج مفتوحة في النطاق المقروء.

## قرار التدقيق

- حوار الرفض يفصل منحة الرفض الداخلي عن رفض العميل مع اشتراط View، ويجعل تبديل
  العرض أو نوع القرار أو الممثل انتهاءً طرفيًا، ويحفظ المسودة عند سحب المنحة
  وإعادتها. التأكيد كسول وقابل للإلغاء مع بقاء local discard متاحًا عند بدء
  denial، والكتابة المرسلة مستقلة وتثبت committed/pristine قبل النشر.
- حوار الماستر يقرأ العرض بـView فقط ويكتب بـView مع
  `RentalMasterAgreement.Create`. دورة read recovery لا تعيد ترطيب المسودة،
  وتبديل id أو actor طرفي، ورفض منحة الكتابة لا يسقط قراءة View. payload يأخذ
  quotation/customer من المصدر السلطوي، والكتابة المرسلة مستقلة مع success latch
  قبل `saved` ثم الإغلاق.
- الحوارات تغلق portals وتقيّد focus وMockData بالجلسة والمنحة الحالية، وتعرض
  قنوات فشل قابلة لإعادة المحاولة دون إسقاط المسودة.
- المواصفات السلوكية موجودة في
  `rejection-dialog.component.spec.ts` و`master-agreement-dialog-access.spec.ts`
  وتغطي الحالات الحرجة المذكورة أعلاه. يبقى تنفيذها والقبول في المتصفح pending
  عند المالك وفق حدود source-only.
