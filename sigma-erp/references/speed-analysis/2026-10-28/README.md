# تحليل البرنامج حسب القائمة الجانبية

حزمة مراجعة مبنية على ملفات الجافاسكربت المتاحة من Speed بتاريخ ٢٨ أكتوبر ٢٠٢٦، ومقسمة حسب القائمة المرسلة للحساب وشروط اختيارها في الكود. الغرض تتبع دورات العمل عبر الأقسام، وليس اعتبار الواجهة مواصفة نهائية لمنطق الخادم.

ابدأ من [خريطة دورات العمل](workflows/00-review-cycles.md)، ثم افتح القسم والشاشة. راجع [نطاق الأدلة وحدودها](EVIDENCE-AND-LIMITS.md) قبل اعتماد أي استنتاج.

## الأقسام بترتيب القائمة

| الترتيب | القسم كما ورد في البرنامج | روابط الشاشات | ملف المراجعة |
|---:|---|---:|---|
| 1 | Dashboard | 1 | [فتح القسم](sidebar/01-dashboard/README.md) |
| 2 | Agreements Dashboard 2 | 1 | [فتح القسم](sidebar/02-agreements-dashboard-2/README.md) |
| 3 | Customers | 8 | [فتح القسم](sidebar/03-customers/README.md) |
| 4 | CRM | 19 | [فتح القسم](sidebar/04-crm/README.md) |
| 5 | Suppliers | 4 | [فتح القسم](sidebar/05-suppliers/README.md) |
| 6 | Staff | 7 | [فتح القسم](sidebar/06-staff/README.md) |
| 7 | Sales | 5 | [فتح القسم](sidebar/07-sales/README.md) |
| 8 | Fleet | 18 | [فتح القسم](sidebar/08-fleet/README.md) |
| 9 | Rental | 8 | [فتح القسم](sidebar/09-rental/README.md) |
| 10 | Lease | 9 | [فتح القسم](sidebar/10-lease/README.md) |
| 11 | Equipment Rental | 4 | [فتح القسم](sidebar/11-equipment-rental/README.md) |
| 12 | Transportation | 3 | [فتح القسم](sidebar/12-transportation/README.md) |
| 13 | Movements | 6 | [فتح القسم](sidebar/13-movements/README.md) |
| 14 | Workshop | 12 | [فتح القسم](sidebar/14-workshop/README.md) |
| 15 | Stock | 15 | [فتح القسم](sidebar/15-stock/README.md) |
| 16 | Limousine | 9 | [فتح القسم](sidebar/16-limousine/README.md) |
| 17 | HRM | 21 | [فتح القسم](sidebar/17-hrm/README.md) |
| 18 | Vouchers | 21 | [فتح القسم](sidebar/18-vouchers/README.md) |
| 19 | Banking | 7 | [فتح القسم](sidebar/19-banking/README.md) |
| 20 | Loan | 3 | [فتح القسم](sidebar/20-loan/README.md) |
| 21 | Accounts | 21 | [فتح القسم](sidebar/21-accounts/README.md) |
| 22 | Assets | 6 | [فتح القسم](sidebar/22-assets/README.md) |
| 23 | Reports | 69 | [فتح القسم](sidebar/23-reports/README.md) |
| 24 | Administration | 40 | [فتح القسم](sidebar/24-administration/README.md) |
| 25 | Support | 1 | [فتح القسم](sidebar/25-support/README.md) |
| 26 | Project Dashboard | 1 | [فتح القسم](sidebar/26-project-dashboard/README.md) |
| 27 | Data Entry Corrections | 1 | [فتح القسم](sidebar/27-data-entry-corrections/README.md) |
| 28 | Billing | 1 | [فتح القسم](sidebar/28-billing/README.md) |

## حجم التغطية

- روابط القائمة: 321؛ كلها مرتبطة بتعريفات مسارات.
- تعريفات المسارات في الحزمة: 681، بعدد 674 اسمًا فريدًا؛ التعريفات المكررة أو المشروطة ليست شاشات مستقلة.
- تسجيلات وحدات التحكم المفصولة: 1833؛ المرتبط بالقائمة الحالية منها 948، والباقي محفوظ للمراجعة دون افتراض ظهوره للحساب. قد يتكرر الاسم في أكثر من تسجيل.
- مصانع الخدمات: 481، وبداخلها 3929 إجراءً معلنًا؛ لم تُستدعَ خدمات الأعمال أثناء التحليل.
- قوالب تم طلبها بالقراءة فقط: 312؛ استجابات ناجحة: 312؛ شاشات ثبتت وحداتها من روابط القالب: 321.

## محتويات الحزمة

- عارض محلي قابل للبحث والتصفح بحسب القائمة: [افتح التقرير التفاعلي](index.html). يعمل دون تحميل مكتبات خارجية.
- ملفات الأقسام والشاشات: [مجلد القائمة](sidebar/).
- ملفات الجافاسكربت الأصلية الملتقطة: [مجلد المصادر](raw/)، وبصماتها في [سجل المصادر](data/asset-manifest.json).
- وحدات التحكم وتعريفات المسارات: [نسخ مفصولة للقراءة](readable/).
- جدول قابل للتصفية: [خريطة الشاشات](data/sidebar-screen-map.csv).
- جدول طلبات الخدمات: [فهرس المسارات والخدمات](data/service-endpoints.csv).
- بيانات آلية تفصيلية: [وحدات التحكم](data/controllers.json)، [المسارات](data/routes.json)، [الخدمات](data/services.json).
- نتائج فحص البصمات والروابط والتغطية: [سجل التحقق](data/verification.json).

القيم المستخرجة من الواجهة والأسماء لا تثبت تنفيذ المنطق على الخادم أو القيود المحاسبية. لم تُحفظ كلمات المرور أو الجلسات ضمن هذه الحزمة.
