# CURRENCY_REVALUATION_FINAL_RECONCILIATION

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Date | 2026-11-05 |
| Scope | Saved combined currency revaluation, source cutoff protection, allocation guard, Angular screen and guide |

## النتيجة

أضيفت شريحة التقييم المجمع المحفوظ: معاينة بتاريخ قطع، سعر مؤرخ لا يتجاوز التاريخ، مساهمات فردية تحفظ القيمة الدفترية والسعر والحساب والأبعاد، قيد مجمع، منع التكرار، قائمة وتفاصيل وإبطال محروس. لا يفتح هذا الحارس الترحيل الأجنبي أو التسوية أو تقييم البنك؛ تلك ملاك ماليون مستقلون ما زالوا غير موصولين.

## الأدلة التي قُرئت

- قواعد سيجما الحية: `.agents/SIGMA_WORKFLOW_RULES.md`، ومهارة `.agents/skills/sigma-screen-refactor/SKILL.md`.
- الدليل المرجعي وشرح Speed: `references/speed-analysis/README.md`، شاشة العملات 20، ودورة الحسابات في لقطة 2026-10-28، مع كودي C0324/C0325 وشرح S045.
- وثيقتا Odoo 19 الرسميتان المكملتان: تعدد العملات والبنك بالعملة الأجنبية. أوضحتا اختيار عملة المستند، حفظ قيمتي الأساسية والأصلية، وحساب فروق الصرف؛ سياسة Sigma التراكمية وحارس الترحيل المغلق هما العقد المحلي المعتمد.
- العقود المحلية: `CURRENCY_REVALUATION_PERSISTENCE_CONTRACT_FREEZE.md`، `CURRENCY_LEDGER_SETTLEMENT_CONTRACT_FREEZE.md`، `CURRENCY_LEDGER_SETTLEMENT_FINAL_RECONCILIATION.md`.

## المطابقة النهائية

| concern | producer | consumer | status |
|---|---|---|---|
| Preview/add/detail/void contract | `CurrencyRevaluationService`, `CurrencyRevaluationService.Preview` | `CurrencyRevaluationController`, Angular service/models | matched source |
| Source range | `EvaluateAsync` | filter form and guide | matched; upper source date is clamped to valuation date |
| Dated rate and precision | `CurrencyWriteBoundary`, `CurrencyRateUsage`, `FinancialNumberPolicy` | preview rows, saved lines, ledger readers | matched source |
| Source classification | `EvaluateAsync` generated approved invoice/Bill predicates | error state and bilingual guide | conservative rejection for unknown sources |
| Allocation safety | `SiGmaDbContext.AllocationCurrency`, `JournalVoucherService` | allocation candidate reads and writer | matched source; foreign allocation remains closed |
| Cutoff immutability | `SiGmaDbContext.Revaluation` | journal/detail/rate writers | matched source; owner runtime race acceptance pending |
| Historical account | `CurrencyRevaluationLine.UnrealizedAccountId` | posted aggregate journal | matched source |
| UI route/menu/guide | `CurrencyRevaluation` Angular module, routing, sidebar, `accounts-guide.ts` | authenticated shell and journal source link | matched source |
| Loading/cache | page loader, local detail state, reference lookup bindings | preview/list/detail/dialog | source conformance; runtime visibility pending |

## القرارات والحساب

- أحدث سعر مؤرخ لا يتجاوز تاريخ الاعتراف المحاسبي.
- التقييم تراكمي: الفرق الإضافي فقط، دون إعادة عكس دورية.
- الإشارة الموجبة `BaseAdjustment` مدين، والسالبة دائن؛ الربح والخسارة يحددان حسابهما من لقطة المساهمة.
- لا يتم جمع العملات الأصلية المختلفة؛ كل قراءة أصلية منفصلة، والدفتر الأساسي يظل منفصلًا.
- أي allocation history بلا إثبات استهلاك القيمة الدفترية يوقف المعاينة.
- الجلسة لا تتغير بعد الحفظ إلا بإبطال محروس، ولا تُعاد استخدام `OperationId` بنتيجة مختلفة.

## الملفات

الخلفية:

- `SigmaBackend/SiGma.Business/IServices/ICurrencyRevaluationService.cs`
- `SigmaBackend/SiGma.Business/Services/AccountServices/CurrencyRevaluationService.cs`
- `SigmaBackend/SiGma.Business/Services/AccountServices/CurrencyRevaluationService.Preview.cs`
- `SigmaBackend/SiGma.ServerAPI/Controller/CurrencyRevaluationController.cs`
- `SigmaBackend/SiGma.Helpers/Models/Accounts/CurrencyRevaluation.cs`
- `SigmaBackend/SiGma.Helpers/Models/Accounts/CurrencyRevaluationLine.cs`
- `SigmaBackend/SiGma.DataAccess/Configuration/CurrencyRevaluationConfig.cs`
- `SigmaBackend/SiGma.DataAccess/Configuration/CurrencyRevaluationLineConfig.cs`
- `SigmaBackend/SiGma.DataAccess/SiGmaDbContext.Revaluation.cs`
- `SigmaBackend/SiGma.DataAccess/SiGmaDbContext.AllocationCurrency.cs`
- `SigmaBackend/SiGma.Business/Services/VouchersServices/JournalVoucherService.cs`
- `SigmaBackend/SiGma.Business/Services/AccountServices/JournalReportSourceResolver.cs`
- `SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
- `SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`

الواجهة والدليل:

- `SiGmaAngularFrontEnd/src/app/modules/Accounts/CurrencyRevaluation/`
- `SiGmaAngularFrontEnd/src/app/pages/routing.ts`
- `SiGmaAngularFrontEnd/src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`
- `SiGmaAngularFrontEnd/src/app/modules/Accounts/Journal/models/journal-source-navigation.ts`
- `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/accounts-guide.ts`
- `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts`
- `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts`
- `SiGmaAngularFrontEnd/tsconfig.app.json`

## المخطط

الكيانات والتكوينات تحتاج هجرة يطبقها المالك:

`Add-Migration AddCurrencyRevaluationSessionsAndContributions`

لم تُنشأ أو تُعدل هجرة أو `ModelSnapshot`.

## التحقق المصدرّي

- فحص وصفات Sigma:
  `Generate-SigmaRecipes.ps1 -Check` — نجحت الحزم الثماني.
- فحص فروق المصدر وملفات الشريحة، علامات الدمج، مفاتيح الترجمة، namespaces، route wiring وملفات دليل المستخدم — مصدرّي فقط.
- لم تُشغّل builds أو tests أو lint أو browser أو database أو migrations أو commits أو pushes أو deployment؛ لذلك قبول التجميع والتشغيل والتزامن والمخطط والواجهة البصرية عند المالك.

## المخاطر والمتبقي

- لا يمكن تمييز مسودة أصلية عن قيد سبق إلغاء ترحيله بعد أن يمسح مسار unpost تاريخ الترحيل؛ الرفض المحافظ قائم حتى يتوفر سجل أحداث موثوق.
- البنوك الأجنبية، التخصيص الأجنبي، فرق السداد المحقق، الاعتراف الأجنبي لباقي المستندات، والضريبة متعددة الدول لم تُفتح في هذه الشريحة.
- لا يوجد قياس زمني أو SQL plan مصرح به؛ الاستعلامات الجديدة دفعتية وحد المعاينة واضح. اقتراح فهرس المالك بعد قياس فعلي: `(SubscriptionId, CurrencyRevaluationId, SourceJournalVoucherDetailId)` و`(SubscriptionId, SourceJournalVoucherId, ValuationDate)` مع مراجعة تداخل الفهارس قبل الهجرة.

## تجربة المالك اليدوية

1. جهز عملة أجنبية وسعرين مؤرخين، واربط حساب ربح غير محقق وحساب خسارة غير محققة.
2. أنشئ فاتورة عميل أجنبية مرحلة، ثم غيّر السعر بعد تاريخها.
3. افتح `Accounts → Account Settings → Currency Revaluation`، اختر تاريخ التقييم، ثم Preview.
4. راجع الأصل والمتبقي والدفتر والسعر والفرق والحساب والأبعاد، ثم احفظ القيد المجمع.
5. أعد Preview بنفس السعر؛ يجب أن يكون الفرق صفرًا. ارفع السعر في تاريخ لاحق؛ يجب تسجيل الفرق الإضافي فقط.
6. أعد إرسال نفس `OperationId`؛ يجب إعادة نتيجة الجلسة السابقة دون جلسة جديدة.
7. حاول تخصيص قيد التقييم من شاشة اليومية؛ يجب رفضه من القراءة والكاتب والحفظ.
8. حاول تعديل أو حذف سطر مصدر سبق تقييمه، أو تعديل السعر المستخدم؛ يجب الرفض برسالة تاريخ القطع.
9. افتح القائمة والتفاصيل، ثم اختبر إبطال آخر جلسة بسبب. لا ينعكس القيد تلقائيًا؛ يظهر كملغى وتبقى لقطاته.
10. اختبر حالة مصدر مقدم/تأمين/قيد يدوي أو مصدر غير مرحل؛ يجب رفض المعاينة المحافظ.

اقتراح رسالة commit للخلفية:
`feat(currency): persist cumulative revaluation with cutoff and allocation guards`

اقتراح رسالة commit للواجهة:
`feat(currency): add revaluation workspace and saved-session navigation`

استخدمت الوكلاء المصرح بهم في ملكيات مستقلة: مراجعة عقد/سلامة، تخزين وحراس، وواجهة ودليل. لم تعدل أي ملكية متداخلة، والجذر دمج التغييرات وراجع النتيجة.
