# القرارات والأعمال المؤجلة

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Updated | 2026-10-23 — navigation and current-owner references only |

هذه مسائل أجّل المالك استكمالها. ابدأ بعمود القرار المفتوح، ثم اقرأ السجل
الأصلي وأعد التحقق من مصدره قبل التنفيذ. لا تعيد الجزء المنفذ، ولا تعتبر
القائمة تفويضًا بإكمال قرار مؤجل. حالة كل ملف وقراراته تخصه؛ لا نفترض أن
كل ما ورد في خطة قديمة ما زال مفتوحًا.

| File | Topic | Waits for | Open owner decisions |
|---|---|---|---|
| [تأجيل تقرير فروق الرسوم الإضافية (Surcharge Variance Report)](SURCHARGE_VARIANCE_REPORT_DEFERRED_REVIEW.md) | تقرير فروق الرسوم الإضافية تحت Finance & Expenses مع تعطيله وتمييزه بعلامة `Soon` في القائمة الجانبية | توحيد إعدادات المخالفات وإتاحة مالك حي للرسم الإضافي القياسي للمخالفات | مالك الرسم القياسي للمخالفات في الإعدادات، تفسير `null` مقابل `0.00` على العميل، وشمول قسم `Darb` من عدمه |
| [تأجيل تقارير المخالفات ورسوم الطرق (Fines & Tolls)](TOLLS_REPORT_DEFERRED_REVIEW.md) | مجموعة تقارير Fines & Tolls كاملةً (٦ تقارير) مع تعطيلها وتمييزها بعلامة `Soon` في القائمة الجانبية | حسم خطة المخالفات وسالك ودرب وتنفيذ التخزين والاستيراد والمعالجة والترحيل الشهري | قرارات `D1–D10` في [خطة سالك ودرب](../FINES_TOLLS_INTEGRATION_MAINTENANCE_EVOLUTION_PLAN.md) (كيان `TollTransaction` المشترك، التنزيل والاستيراد، المطابقة الزمنية، الترحيل الشهري) |
| [معلّقات الإقرار الضريبي](TAX_RETURN_CLASSIFICATION_AND_RECOVERY_REVIEW.md) | تقرير Tax Return وتصنيف المخرجات والمدخلات | حسم العقد المالي ومصدر التسجيل | إمارة التوريد، أهلية الاسترداد ومبلغه لكل بند، الاستيراد والتكليف العكسي، تسويات الإقرار، عملة الدرهم وبيانات المنشأة |
| [JOURNAL_ENTRY_CREATION_AND_ROUNDING_FEATURE_REVIEW.md](JOURNAL_ENTRY_CREATION_AND_ROUNDING_FEATURE_REVIEW.md) | Per-document journal findings F1–F11, I1–I2 (payments without journal, receipt types, credit/debit note accounts, clearing accounts, allocations) | Invoices, vouchers and journal screens review | General/asset-sale receipt accounts; debit-note meaning; allocation-only credit note; PDC on receipt; year-end method |
| [TAX_SETTINGS_MAINTENANCE_EVOLUTION_PLAN.md](TAX_SETTINGS_MAINTENANCE_EVOLUTION_PLAN.md) | **Implemented 2026-09-29** (rate from settings everywhere). Rate inputs read-only; purchase tax from the supplier, bill adjustment ±0.05, trip tax calculated (implemented). Remaining: inclusive pricing and taxable/exempt flags per screen, Bill screen full review | Each screen review | Tax codes (standard / zero / exempt) |
| [CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md](CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md) | Exchange rates, document/line currency, realised and unrealised differences, 3-decimal base currency | Owner decision on the currency mechanism | Base currency change; rate source; first documents; revaluation; 3 decimals |
| [AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md](AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md) | Permissions: roles/permission claims, API policies, Angular route and action visibility (Audit 4 A4-10, foundation F6). Meanwhile screen reviews record "Authorization candidates" | Owner decision to resume | Model (roles / permission claims / server lookup); who administers; granularity; hide vs disable |
| [DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN.md](DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN.md) | One counter-based numbering service for every document (backend backlog 14/15) | Owner decision | Separator; reset period; per-branch sequence; renumber test data |
| [خطة تنظيم الوثائق](../SIGMA_DOCUMENTATION_STRUCTURE_MAINTENANCE_EVOLUTION_PLAN.md) | حوكمة الوثائق: نقل ملكية التعليمات إلى مستودع الوثائق، وتطبيع بصمات العناوين، وميزانية حجم رقمية | قرارات المالك التاريخية غير المنفذة | قرارات النقل وتطبيع البصمات والحدود الرقمية تبقى منفصلة؛ تبسيط المدخل والمهارة نُفذ بتوجيه المالك في 2026-10-23 ولا ينتظر هذه القرارات |

## القواعد المحسومة ومصدرها الحالي

قواعد القيود والمبالغ والضريبة الحالية يملكها كتاب الخلفية، خصوصًا الكتلة 15،
وقواعد الترقيم تملكها الكتلة 11. اتبع آخر قرار معتمد فيها، لا وصفًا قديمًا
لتقريب الضريبة أو إلغاء القيود داخل سجل مؤجل. سجلات التنفيذ السابقة تحفظ
الدليل التاريخي ولا تتقدم على القاعدة الحالية.

## Rule for new deferrals

Add the plan or review to this folder, give it a status table (`Draft`), add a row here, and link it from the owning book backlog item when one exists.
