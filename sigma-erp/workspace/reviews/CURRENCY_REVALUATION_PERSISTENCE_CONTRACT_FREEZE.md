# عقد التقييم المجمع المحفوظ

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-05 |
| التفويض | «كمل الدورة للنهاية»؛ تنفيذ D1–D6 المعتمدة بلا تكرار طلب الاعتماد |

## حدود الشريحة والعلاقة بالدورة

تضيف هذه الشريحة جلسة تقييم فعلية ومعاينة وحفظًا وقيدًا مجمعًا وإبطالًا محروسًا. لا تمنح إزالة حارس الترحيل الأجنبي قبل اكتمال اعتراف المصادر والتسوية والبنك. الحسابات المؤهلة في هذه الشريحة ذمم مدينة/دائنة ذات طرف وسطر أجنبي مثبت؛ رصيد البنك وحدة منفصلة بالمتوسط ولا يعامل كفاتورة. أي تخصيص أجنبي بلا دليل استهلاك موثق يرفض المعاينة ولا يعاد بناء قيمته بسعر اليوم.

## التخزين

- `CurrencyRevaluation` يرث EntityBase: OperationId Guid، ValuationDate DateTime.Date، SourceFromDate/SourceToDate اختياريان، CurrencyId/AccountId/PartnerId/BranchId فلاتر اختيارية، PreviewToken64، JournalVoucherId nullable، IsVoided، VoidReason500، VoidedAt/VoidedBy256، Lines.
- `CurrencyRevaluationLine` يرث EntityBase وICurrencyDocument: CurrencyRevaluationId/Navigation، SourceJournalVoucherDetailId/Navigation، ValuationDate، CurrencyId/Navigation، CurrencyRateUsageId/Navigation، AccountId/PartnerId/BranchId/CostCenterId/JobId، SourceDate، OriginalAmount، OpenOriginalAmount، HistoricalBaseAmount، CarryingBaseAmount، TargetBaseAmount، BaseAdjustment (موقع مدين موجب)، CurrencyCode10، BaseCurrencyCode10، DecimalPlaces/BaseDecimalPlaces. مقادير22,6، الفهرس الفريد اشتراك/جلسة/مصدر؛ operation اشتراك/OperationId فريد دائم حتى بعد Void. لا migration أو snapshot يكتبه الوكيل.
- تحفظ لقطة كل بند بمالك CurrencyRateUsage القائم بتاريخ التقييم. تبقى مقفلة بعد إبطال الجلسة. لا يعاد تسعير الجلسة عند إعادة فتحها.

## واجهات البيانات

المسار `CurrencyRevaluation`:

- `POST Preview`: فلاتر ValuationDate مطلوب، SourceFromDate/SourceToDate/CurrencyId/AccountId/PartnerId/BranchId اختيارية. التواريخ نص yyyy-MM-dd، المعرفات أعداد صحيحة. ترد `CurrencyRevaluationPreviewVM`: PreviewToken، ValuationDate، BaseCurrencyCode، BaseMoneyDecimalPlaces، TotalGain/TotalLoss، Rows.
- السطر `CurrencyRevaluationRowVM`: SourceJournalVoucherDetailId، SourceJournalVoucherId، SourceNo، SourceDate، CurrencyId/CurrencyCode، MoneyDecimalPlaces، AccountId/AccountCode/AccountName، PartnerId/PartnerName، BranchId/BranchName، OriginalAmount/OpenOriginalAmount/HistoricalBaseAmount/CarryingBaseAmount/TargetBaseAmount/BaseAdjustment، RateDate/RateToBase، LastValuationDate/LastJournalVoucherId. المبالغ والأسعار نصوص دقيقة باستخدام المحولات المالية؛ لا Number.
- `POST` ينشئ ويُرحل الجلسة: OperationId GUID مطلوب، PreviewToken، Filters. يعيد Result بالمعرف. إعادة نفس OperationId بنفس token تعيد المعرف السابق؛ تختلف المعاينة تحت القفل فترفض. لا قيد صفري، وغياب الفروق يرفض الحفظ برسالة مفهومة.
- `GET ?pageNo=1&pageSize=20`: قائمة `CurrencyRevaluationListVM` تضم Id/No/ValuationDate/JournalVoucherId/IsVoided/CanVoid/LineCount فقط، بحد100. `GET {id}` يرد `CurrencyRevaluationDetailVM` ببيانات القائمة وRows وBaseCurrencyCode/BaseMoneyDecimalPlaces وTotalGain/TotalLoss وVoidReason.
- `POST {id}/Void`: Reason مطلوب حتى500؛ لا عكس تلقائي. يفحص الفترة الأصلية والملكية وعدم جلسة لاحقة متداخلة أو تخصيص تابع قبل وضع العلم على المصدر والقيد معًا. الفعل مكرر بنفس الهوية يعيد النجاح الأصلي.

## المعاملة والحساب

القفل القائم JournalVoucherAllocation ثم Currency في معاملة واحدة، وتستخدم المعاينة/التنفيذ نفس دالة القراءة والحساب. token SHA256 من الفلاتر ومفاتيح وإصدارات ومبالغ المصادر والتخصيصات والتقييمات والسعر؛ لا يعتمد على النص المترجم. حد2000 مساهمة للمعاينة، ويرفض الزائد صراحة دون اقتطاع. استعلامات دفعيّة، لا استعلام لكل سطر.

يتحدد المصدر من قيود أجنبية مرحلة ومعتمدة وغير ملغاة وسطور أحادية الجانب تحمل أصلًا ولقطة صحيحة. يُستعمل نوع Receivable/Payable الفعلي مع طرف، وتُحفظ كل الأبعاد. التاريخ الأعلى للمصدر هو الأصغر من SourceToDate وتاريخ التقييم. الفرق الإضافي = المستهدف − الدفتر القائم (مع إشارة المدين/الدائن). الدفتر = الأصل الأساسي الباقي + مساهمات تقييم سابقة نافذة؛ لا يحتسب المصدر مرتين ولا يعكس دوريًا.

يبنى القيد الأساسي المجمع بمالك JournalVoucherResolver، مع سطر الذمة وسطر ربح/خسارة غير محقق من الفتحات المعتمدة، وتجميع الأبعاد دون إسقاطها. تربط كل مساهمة بالسطر الأصلي ولو تجمعت أسطر القيد. عدم اكتمال حسابات الربط يرفض قبل mutation. الحفظ متعدد المراحل ذري داخل ExecuteUniqueWriteAsync نفسه.

يحجب حارس التخزين تعديل/إلغاء/إعادة ترحيل مصدر أجنبي له تقييم نافذ في/بعد تاريخ المصدر؛ ويحجب إدراج مصدر رجعي في نطاق قطع تقييم نافذ. لا يمنع تحرير مسودة لا أثر لها. التخصيص الأجنبي الحالي يبقى محجوبًا حتى كاتب التسوية؛ لا يغير التقييم رصيد الأصل الأجنبي.

## الواجهة والدليل

صفحة كاملة `/CurrencyRevaluation` تحت الحسابات/إعدادات الحسابات بجانب أسعار الصرف. يملك المرشح تاريخ تقييم ونطاق تواريخ مصادر ومعرفات الفلاتر المرجعية، المعاينة منزر مستقل، والقائمة المحفوظة بتحميل صريح. يعرض جدول المعاينة المصدر والتاريخ والعملة والحساب والطرف والأصل والمتبقي والدفتر والسعر والمستهدف والفرق، دون جمع أصل العملات. الحفظ يحتاج تأكيدًا والمعاينة الحالية فقط؛ تعديل الفلاتر يبطلها. Source context change يلغي القراءات والمعاينة والتأكيد دون إلغاء الكتابة المرسلة. الجداول/الفورم/الحالة والتحميل والدليل من المالكين المشتركين.

## قبول المالك المعلق

تقييم1000 عند50 إلى52 يعطي2000؛ إعادة المعاينة بنفس السعر فرق0 ولا قيد جديد؛ تقييم تالٍ إلى53 يعطي1000 فقط. إعادة OperationId لا تنشئ ثانية؛ معاينة قديمة ترفض؛ الإبطال الأحدث دون تخصيص يحرر أثره ولا يحذف اللقطة؛ جلسة سابقة ذات تابع ترفض. تواريخ المصدر/القطع والأبعاد والمستأجر والدقة والإخراج والتزامن/Built/DB acceptance لم تُشغّل.

## Amendment — source classification, account snapshots and guarded integration — 2026-11-05

- The accepted first slice is deliberately limited to generated, posted and approved customer-invoice receivable lines and supplier-bill payable lines with a partner. Advances, refundable deposits and manual journal lines remain unclassified and are rejected; account type alone is not treated as proof of monetary origin.
- A source with any allocation history is rejected until a settlement writer persists both foreign quantity consumption and carrying-value evidence. A source that is currently unposted or unapproved is rejected conservatively because the current journal lifecycle can erase `PostingDate` on unpost; no audit timestamp is invented as a historical posting date.
- Each contribution stores the selected unrealized gain/loss account identity (`UnrealizedAccountId`) in addition to the source account and dimensions. The posted journal is built from that snapshot, so later Link Accounts changes cannot rewrite the historical account used by the session.
- The preview caps prior contributions at 20,000 in addition to the 2,000 source-line cap. Currency-rate and contribution reads remain batched; the per-source history lookup uses one in-memory lookup.
- A revaluation journal is a carrying-value adjustment and is blocked from allocation on both sides at the service and `DbContext` persistence boundaries, including persisted, soft-deleted, voided and tracked sessions. Child-only journal writes cross the cutoff guard even when the header is unchanged; the saved source state is checked independently from the resulting tracked state.
