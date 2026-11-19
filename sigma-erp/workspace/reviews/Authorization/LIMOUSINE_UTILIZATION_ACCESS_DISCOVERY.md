# اكتشاف صلاحيات تقرير استخدام الليموزين

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| التاريخ | 2026-11-11 |

المسار LimousineUtilizationReport في قسم تقارير الليموزين. يستهلك
جدول العرض والتحميل الإضافي TripBooking/UtilizationReportPage،
وتقرأ الطباعة والتصدير TripBooking/UtilizationReport. مفاتيح الكتالوج
هي TripBooking.GetUtilizationReportPage وTripBooking.GetUtilizationReport.

يعمل المنفذان من PrepareUtilizationReportAsync في خدمة الرحلات. تتبنى
الواجهة الحالية خيارات الفروع والعملاء وأنواع المركبات قبل البحث.
يُراجع فصل منح هذه الخيارات عن قراءة التقرير، وتطابق المرشحات بين
العرض والطباعة والتصدير ونطاق الاستعراض من فرع الرحلة. مرجع سبيد هو
الشاشة 08-reports-utilization-report والمتحكم C0903. يظل اعتماد
المسار في الجرد معلقًا إلى إقفال المطابقة.
