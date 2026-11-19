# Settings layout UI contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-01 |

Consumes the frozen SETTINGS_LAYOUT_MAINTENANCE_EVOLUTION_PLAN.md.
Owner: root; consumers: SettingsLayout and its24 child templates, global shared
styles, EditorTabs, FeatureTitle, Administration guide. No delegated writes.

- Shared route/page/panel shell; parent card and child content stretch to the
  same inline edges. No viewport-height calculations or local page palette.
- Shared child allocation separates title, body and Save. Body is the vertical
  content scroll owner; vertical section navigation is an independent region.
- Internal vertical tabs on Common, Document Number and Fields only; stable
  IDs/labels, one selected section, persistent parent model and mounted controls.
- Keep current fields, field types, control names, enum meanings, requiredness,
  child data, action handlers, route paths, GET/write URLs and response wrappers.
- BE16 single-row/keyed settings and one owning Save remain unchanged. In
  particular tabs do not POST individual fragments or delete omitted settings.
- Preserve API Key independent Google/DeepSeek actions and dirty-exit guard;
  preserve list/dialog actions on holiday, toll and traffic-file settings.
- Source-supported layout/accessibility corrections only. Financial policy,
  numeric policy, permission changes and legacy backend migration are separate.
- Source checks only; no executed build, test, lint, browser, database or migration.

Final binding/control preservation, scoped changes, cache/loading/performance
evidence and remaining owner checks live in SETTINGS_LAYOUT_FEATURE_REVIEW.md.

## ملحق مجمد — تحسين محتوى التبويبات، ٢ نوفمبر ٢٠٢٦

طلب المالك تحسين تنسيق العناصر داخل التبويبات بعد التنظيم الأول. يقتصر
التعديل على عرض الحقول الحالية: المجموعات الدلالية في بطاقات FormSection
المشتركة، وشبكة حقول منتظمة تتكيف مع عرض المحتوى الفعلي، وخيارات منطقية
في صفوف واضحة قابلة للالتفاف بعمودين ثم عمود واحد. تُزال أعمدة العرض
والهوامش القديمة من الحقول التي تتبنى الشبكة. تظل الجداول والحوارات
ومجموعات الحقول والتبويبات والنماذج وعمليات القراءة والحفظ كما هي.

يملك styles.scss توزيع محتوى الإعدادات العام؛ تملك FormSection البطاقات
والعناوين والثيم؛ وتبقى عناصر الإدخال الحالية بمالكيها. لا CSS خاص لكل
صفحة، ولا إعادة تشكيل سياسة مالية أو خلفية. تبقى بيانات التحميل والكاش
والأداء في التقرير السابق صالحة لأن هذه الشريحة لا تغيّر أي طلب.

تُقارن جميع ربطات الحقول والمدخلات والإجراءات بالنسخة الموجودة عند بدء
المتابعة، لا برأس المستودع وحده، مع حماية تعديلات الإيجار والفواتير
والأدوات المشتركة المتزامنة. الفحص مصدري؛ قبول العرض والتشغيل عند المالك.

## ملحق مجمد — مجموعات داخل تبويبات داخلية، ٢ نوفمبر ٢٠٢٦

طلب المالك تحويل المجموعات المتتالية داخل القسم إلى تبويبات داخلية،
ومثاله مجموعات العام والنظام في العامة. يُحتفظ بالتنقل الرئيسي الرأسي،
وتستخدم المجموعات المتعددة داخله شريطًا أفقيًا من EditorTabs الحالي.
تظل المجموعة الوحيدة بلا شريط إضافي. ينطبق التركيب على العامة والترقيم
وأجزاء الحقول ذات المجموعات المتعددة، والإشعارات وإدارة المستخدمين.
في النماذج والحقول يظل اختيار نوع النموذج ظاهرًا قبل تبويبي الإلزام والإضافة.

يُستخرج تركيب قوالب المجموعات إلى رفيق ضمن مالك EditorTabs، بمفاتيح
ومعرّفات مستقلة لكل مستوى. تبقى جميع القوالب مركبة مع إخفاء غير المختار؛
ولا طلب أو حفظ عند التبديل. يفتح التحقق القسم الرئيسي والمجموعة الداخلية
قبل استعمال focusField الحالي. الشريط ثابت ومنطقة المجموعة هي مالك
التمرير الوحيد؛ الطباعة تطلق الحدود وتظهر المجموعات. لا عقد خلفي متغير.

## ملحق مجمد — البحث عن التبويبات، ٣ نوفمبر ٢٠٢٦

يبحث كل حقل في أسماء التبويبات المترجمة في شريطه: صفحات الإعدادات،
والأقسام الرأسية، والمجموعات الداخلية. البحث محلي وفوري ويطابق جزءًا
من الاسم. يعرض حالة عدم المطابقة ويعيد المسح كل الخيارات المتاحة.
يبقى المحتوى الحالي والمسودة عند التصفية، وتفتح النتيجة بالتنقل المعتاد.
يعيد التحقق إظهار تبويب القسم أو المجموعة إذا أخفاه البحث. لا تعتمد
التصفية على قيم الحقول أو استدعاء خدمات ولا تدخل في حمولة الحفظ.
