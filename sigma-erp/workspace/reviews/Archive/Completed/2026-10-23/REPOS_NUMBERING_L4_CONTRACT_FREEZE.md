| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-10-02 |
| تفويض المالك | «ظبط التعديل» بعد شرح حجز الأرقام من counter مشترك |

# عقد إصلاح L4 — ترقيم الدفعات المشتركة

## النطاق والقرارات

- استبدال Count + 1 داخل CodeCreateService الحالي بعدّاد DocumentNumberCounter الموجود؛ لا خدمة ترقيم موازية.
- عدّاد لكل SubscriptionId + DocumentType. تُضاف قيم enum في نهايته للأنواع التي ترقمها الخدمة وليس لها نوع حالي: Company، IndividualPartner، Supplier، Staff، LubricationJob. لا تغيير لأرقام قيم enum الموجودة.
- preserve: البادئات والفواصل وأجزاء branch/type/date وصيغ/manual settings الحالية، والأرقام المحفوظة، وتوقيت توليد رقم الجذر قبل الحفظ. لا تغيير سياسة branch codes أو date source أو تصفير شهري/سنوي؛ العدّاد يستمر لكل اشتراك/نوع دون تصفير.
- إنشاء counter من أكبر جزء رقمي نهائي صادر لنفس النوع والاشتراك، شامل soft-deleted records؛ يعاد استخدام counter المحذوف منطقيًا أيضًا بدل إرجاع التسلسل للبداية. الأرقام غير القابلة للتحليل لا تدخل max؛ الأرقام القديمة لا تعدل.
- الحجز يزيد counter المتتبع، فيشمل الدفعات والصفوف الجديدة عند Update. الحفظ الحالي يكتب counter والـ graph معًا في EF implicit transaction أو transaction الحالية؛ لا SaveChanges لكل صف.
- concurrency: CurrentValue يصبح concurrency token. تحديث EF يقارن بالقيمة الأصلية ذريًا؛ الطلب المتعارض يفشل ويرجع middleware الحالي 409، دون blind retry أو حفظ graph بأرقام متعارضة. أول إنشاء متزامن يحميه القيد الفريد الموجود (SubscriptionId, DocumentType).
- لا إنشاء No index جديد على Partner/TPT بشكل يفرض uniqueness بين أنواع العملاء والموردين كلها؛ القيد الفريد للcounter وCAS يحميان الأرقام المولدة عبر الخدمة، والقيود الموجودة للمستندات تبقى. قيود No لكل جدول/نوع ومراجعة البيانات السابقة ضمن خطة الترقيم الأوسع، وليست تغييرًا صامتًا لهذا الإصلاح.
- JournalVoucher يحافظ على IJournalNumberGenerator وصيغته الحالية؛ الخدمة العامة لا تحجز له رقمًا مؤقتًا يُستبدل لاحقًا. مسارا JournalVoucherResolver وOpeningBalanceJournalVoucherHelper يستدعيان المولد القائم بعد AddAsync. JobEstimation وخدمته لا يتغيران.
- التغيير يشمل cancellation للواجهات الحالية عند الحاجة للحجز/seed؛ optional token يحافظ على توافق الاستدعاءات الحالية. لا تغيير routes أو DTOs أو Angular أو mapping أو accounting calculations.

## علاقتها بالخطة المؤجلة

تفويض اليوم ينفذ جزء batch/counter فقط ويستبدل تأجيل هذا الجزء من خطة DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN. توحيد separators، real branch/type، document-date formatting، دمج JV/JobEstimation وشمول الأنواع غير المعروفة ما زال مؤجلًا. هذا ليس تنفيذًا للخطة كاملة.

## الأدلة والتحقق المطلوب

المراجع: CodeCreateService، Repository.AddAsync/AddRangeAsync، UOW.PrepareAddedNumbersAsync، DocumentNumberCounterConfig، JournalNumberGenerator، JournalVoucherResolver.SaveCoreAsync، OpeningBalanceJournalVoucherHelper، AccountingConfigurationExceptionMiddleware.

Owner verifies: دفعة موردين؛ شركتان متتاليتان؛ اشتراكان؛ أعلى رقم محذوف؛ أول counter متزامن؛ counter قائم متزامن؛ فشل graph save لا يزيد counter المحفوظ؛ JV لا يحجز مرتين؛ no-change update. لا builds/tests/DB/browser/migrations ضمن التنفيذ. تغييرات EF concurrency metadata لا تضيف column؛ لا migration تنفذها هذه المهمة. runtime/schema/index verification pending.
