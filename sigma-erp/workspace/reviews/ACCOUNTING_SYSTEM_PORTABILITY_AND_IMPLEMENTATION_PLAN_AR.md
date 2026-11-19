# خطة تصميم ونقل دليل الحسابات والنظام المحاسبي

## 1. بيانات الوثيقة

| البند | القيمة |
|---|---|
| اسم الوثيقة | خطة تصميم ونقل دليل الحسابات والنظام المحاسبي |
| الإصدار | 1.0 |
| تاريخ الاستخراج | 2026-09-01 |
| مصدر المتطلبات | مصدر Sigma الحالي – Backend وFrontend |
| طبيعة الوثيقة | تحليل مصدر وخطة تنفيذ، وليست Migration أو تنفيذًا برمجيًا |
| اللغة | العربية، مع الاحتفاظ بالأسماء التقنية الأصلية |

هذه الوثيقة تجمع تفاصيل النظام المحاسبي الموجودة حاليًا في Sigma، ثم تحولها إلى تصميم قابل لإعادة الاستخدام في برنامج آخر. يجب التمييز بين:

- **السلوك الحالي المؤكد:** مستخرج من الكود الحالي.
- **التصميم المقترح:** تحسينات مطلوبة عند بناء النظام الجديد.
- **قرار مطلوب:** نقطة لا ينبغي حسمها افتراضيًا قبل موافقة مالك العمل.

## 2. الهدف والنطاق

الهدف هو بناء نظام محاسبي يدعم:

1. شركات أو اشتراكات متعددة.
2. دليل حسابات هرمي.
3. قيود يومية مزدوجة ومتوازنة.
4. سنوات وفترات مالية.
5. مراكز تكلفة وفروع وعملات.
6. حسابات عملاء وموردين وموظفين مساعدة.
7. ترحيل تلقائي من المستندات التشغيلية.
8. Allocation لتسوية المستحقات والتحصيلات.
9. أرصدة افتتاحية.
10. ميزانيات وتوقعات وانحرافات.
11. تسويات بنكية.
12. قوائم وتقارير مالية وتشغيلية.
13. سجل تدقيق وإلغاء وعكس محاسبي.

خارج نطاق هذه الوثيقة:

- اختيار تقنية البرمجة النهائية.
- تصميم شاشات بصري نهائي.
- تنفيذ Migration لقاعدة البيانات الحالية.
- تغيير قواعد العمل دون اعتمادها من مالك النظام.

## 3. ملخص معماري

```text
Company / Subscription
├── Chart of Accounts
│   ├── Account Categories
│   ├── Statement Subgroups
│   └── Posting Accounts
├── Fiscal Years / Periods
├── Branches / Currencies / Cost Centers
├── Journal Vouchers
│   └── Journal Voucher Lines
├── Subledgers
│   ├── Customers
│   ├── Suppliers
│   └── Staff
├── Operational Documents
│   ├── Invoices / Bills
│   ├── Receipts / Payments
│   ├── Credit Notes / Debit Notes
│   └── Deposits / Advances / Assets / Stock
├── Allocations
├── Opening Balances
├── Account Links
├── Budgets
├── Bank Reconciliations
└── Financial Reports
```

المبدأ الأساسي هو أن **دفتر الأستاذ العام والقيود المرحلة هما مصدر الحقيقة المالي**. المستندات التشغيلية تنشئ القيود، والـ Allocation يربط السطور المدينة والدائنة دون إنشاء قيمة مالية جديدة.

## 4. المبادئ المحاسبية الأساسية

1. كل عملية ذات أثر مالي تنتج قيدًا متوازنًا.
2. لا يقبل الخادم إجماليات مالية مشتقة من الواجهة باعتبارها حقيقة نهائية.
3. القيود المرحلة وغير الملغاة فقط تدخل القوائم المالية.
4. الترحيل يكون على حسابات طرفية Posting Accounts فقط.
5. كل مستند يحتفظ برابط إلى القيد الناتج عنه.
6. حذف مستند مرحل غير مسموح؛ الإجراء الصحيح هو الإلغاء أو العكس.
7. لا يسمح بتجاوز رصيد المستند في Allocation.
8. التاريخ المحاسبي يجب أن يقع داخل فترة مفتوحة.
9. الحساب والفرع ومركز التكلفة والعملة والشريك يجب أن ينتموا إلى نفس الشركة.
10. قيم الضرائب والخصومات والعمولات والاستهلاك تحسب في طبقة المجال أو الخادم.

## 5. دليل الحسابات Chart of Accounts

### 5.1 عقد بيانات الحساب

| الحقل | النوع المقترح | الغرض |
|---|---|---|
| Id | مفتاح داخلي | معرف قاعدة البيانات |
| CompanyId / SubscriptionId | مفتاح خارجي | الشركة المالكة |
| AccountCode | نص | الكود المحاسبي الثابت |
| ExternalAccountCode | نص اختياري | الربط مع نظام خارجي |
| Name | نص | الاسم الأساسي |
| LocalizedName | نص اختياري | الاسم المترجم |
| Notes | نص اختياري | ملاحظات |
| ParentId | مفتاح اختياري | الحساب الأب |
| Category | Enum | أصل، التزام، حقوق ملكية، إيراد، مصروف |
| StatementSubGroup | Enum اختياري | المجموعة داخل القائمة المالية |
| AccountLevel | رقم | المستوى من 1 إلى 5 |
| AllowChildren | Boolean | السماح بإضافة حسابات فرعية |
| IsPostingAccount | Boolean محسوب | حساب يقبل الترحيل |
| NormalBalance | Enum محسوب | مدين أو دائن |
| StatementType | Enum محسوب | ميزانية أو قائمة دخل |
| CostCenterRequired | Boolean | إلزام مركز التكلفة |
| DefaultCostCenterId | مفتاح اختياري | مركز التكلفة الافتراضي |
| IsActive | Boolean | نشط أو متوقف |
| IsDeleted | Boolean | حذف منطقي |
| CreatedAt / CreatedBy | Audit | بيانات الإنشاء |
| UpdatedAt / UpdatedBy | Audit | بيانات التعديل |
| DeletedAt / DeletedBy | Audit | بيانات الحذف |
| RowVersion | Concurrency | منع التعديلات المتزامنة |

### 5.2 التصنيفات الرئيسية

| القيمة | التصنيف | الطبيعة | القائمة |
|---:|---|---|---|
| 1 | Asset | Debit | Balance Sheet |
| 2 | Liability | Credit | Balance Sheet |
| 3 | Equity | Credit | Balance Sheet |
| 4 | Revenue | Credit | Income Statement |
| 5 | Expense | Debit | Income Statement |

### 5.3 المجموعات الفرعية

```text
CurrentAssets
NonCurrentAssets
CurrentLiabilities
LongTermLiabilities
Equity
OperatingRevenue
OtherRevenue
CostOfSales
SellingExpense
AdministrativeExpense
MaintenanceExpense
DepreciationExpense
FinancialExpense
OtherExpense
```

المجموعة الفرعية مطلوبة على المستوى الثاني، ثم تورثها الحسابات التابعة. تغييرها بعد وجود معاملات يجب أن يكون ممنوعًا أو خاضعًا لعملية ترحيل معتمدة.

### 5.4 قواعد شجرة الحسابات

1. الحد الأقصى خمسة مستويات.
2. حساب المستوى الأول Root، بلا Parent، وغير قابل للحذف.
3. حساب المستوى الخامس طرفي ولا يسمح بأبناء.
4. لا يمكن إضافة ابن إلى حساب `AllowChildren = false`.
5. لا يمكن إضافة ابن إلى حساب محذوف أو غير نشط.
6. لا يمكن إضافة أبناء إلى حساب سبق الترحيل عليه.
7. لا يسمح بالترحيل على حساب له أبناء.
8. لا يمكن حذف حساب له أبناء أو معاملات.
9. لا يمكن تغيير Parent بعد إنشاء معاملات.
10. الحساب الأب لا يطلب مركز تكلفة.
11. إذا كان مركز التكلفة مطلوبًا، يجب تقديم مركز صالح عند القيد.
12. الكود فريد داخل الشركة.
13. الاسم فريد تحت نفس الأب داخل الشركة.

قيود قاعدة البيانات المقترحة:

```text
UNIQUE (CompanyId, AccountCode)
UNIQUE (CompanyId, ParentId, Name)
CHECK  (AccountLevel BETWEEN 1 AND 5)
CHECK  (ParentId IS NOT NULL OR AccountLevel = 1)
```

### 5.5 نظام تكوين الأكواد

النظام الحالي يستخدم نمطًا هرميًا بشرطات:

```text
Level 1: 1
Level 2: 1-01
Level 3: 1-01-001
Level 4: 1-01-001-001
Level 5: 1-01-001-003-001
```

- المستوى الثاني: خانتان بحد أقصى 99.
- المستويات من الثالث إلى الخامس: ثلاث خانات بحد أقصى 999.
- يجب تكوين الكود في الخادم داخل Transaction أو باستخدام Sequence يمنع التكرار.

### 5.6 شجرة الحسابات الحالية

```text
1 Assets
├── 1-01 Liquid / Current Assets
│   ├── 1-01-001 Cash & Bank
│   │   ├── 1-01-001-001 Cash on Hand
│   │   ├── 1-01-001-002 Petty Cash
│   │   └── 1-01-001-003 Bank Accounts
│   │       ├── 1-01-001-003-001 Bank – National Bank of Egypt
│   │       ├── 1-01-001-003-002 Bank – Banque Misr
│   │       └── 1-01-001-003-003 Bank – CIB
│   ├── 1-01-002 Accounts Receivable
│   │   └── 1-01-002-001 Customer Receivable
│   ├── 1-01-003 Inventory
│   │   ├── 1-01-003-001 Spare Parts Inventory
│   │   ├── 1-01-003-002 Fuel Inventory
│   │   └── 1-01-003-003 Accessories Inventory
│   └── 1-01-004 Advances & Deposits
│       ├── 1-01-004-001 Supplier Advances
│       ├── 1-01-004-002 Staff Advances
│       ├── 1-01-004-003 Customer Advances
│       ├── 1-01-004-004 Prepaid Expenses
│       │   ├── 1-01-004-004-001 Prepaid Taxes
│       │   ├── 1-01-004-004-002 Prepaid Interest
│       │   ├── 1-01-004-004-003 Darb Prepaid
│       │   ├── 1-01-004-004-004 Tolls Prepaid
│       │   └── 1-01-004-004-005 Prepaid Coupon Liability
│       └── 1-01-004-005 Accrued Revenue
└── 1-02 Fixed Assets
    ├── 1-02-001 Vehicles – Rental Fleet
    ├── 1-02-002 Vehicles – Limousine Fleet
    ├── 1-02-003 Vehicles – Transportation Fleet
    ├── 1-02-004 Furniture & Fixtures
    ├── 1-02-005 Computers & Equipment
    ├── 1-02-006 Buildings
    └── 1-02-007 Accumulated Depreciation

2 Liabilities
├── 2-01 Accounts Payable
│   ├── 2-01-001 AP – Spare Parts Suppliers
│   ├── 2-01-002 AP – Fuel Suppliers
│   └── 2-01-003 AP – Maintenance Providers
├── 2-02 Staff Payables
│   ├── 2-02-001 Salaries Payable
│   └── 2-02-002 Staff Deductions
├── 2-03 Taxes & Government
│   ├── 2-03-001 VAT Payable
│   └── 2-03-002 Withholding Tax Payable
├── 2-04 Customer Deposits & Advances
│   ├── 2-04-001 Deposits – Renting Cars
│   ├── 2-04-002 Deposits – Limousine
│   ├── 2-04-003 Deposits – Transportation
│   └── 2-04-004 Deposits – Vehicle Renting
└── 2-05 Loans & Long-Term Obligations
    ├── 2-05-001 Vehicle Loans
    └── 2-05-002 Bank Loans

3 Equity
├── 3-01 Owner’s Capital
├── 3-02 Retained Earnings
└── 3-03 Current Year Profit/Loss

4 Revenues
├── 4-01 Operating Revenues
│   ├── 4-01-001 Revenue – Car Renting
│   ├── 4-01-002 Revenue – Limousine Services
│   ├── 4-01-003 Revenue – Transportation
│   ├── 4-01-004 Revenue – Vehicle Renting
│   ├── 4-01-005 Credit Card Commission Revenue
│   └── 4-01-006 Asset Sale Revenue
└── 4-02 Other Revenues
    ├── 4-02-001 Penalties & Fines
    └── 4-02-002 Interest Income

5 Expenses
├── 5-01 Direct Operating Expenses
│   ├── 5-01-001 Vehicle Depreciation
│   ├── 5-01-002 Fuel Expense
│   ├── 5-01-003 Insurance Expense
│   ├── 5-01-004 Maintenance & Repairs
│   ├── 5-01-005 Driver Wages
│   ├── 5-01-006 Parking & Toll Fees
│   ├── 5-01-007 Cost of Sales
│   ├── 5-01-008 Vehicle Cost of Sale
│   ├── 5-01-009 Fines Expense
│   ├── 5-01-010 Tolls Expense
│   ├── 5-01-011 Taxes Paid
│   ├── 5-01-012 Asset Sale Expense
│   ├── 5-01-013 Darb Expense
│   ├── 5-01-014 Interest Expense
│   ├── 5-01-015 Commission Expense
│   ├── 5-01-016 External Vehicle Rental Expense
│   ├── 5-01-017 External Driver Rental Expense
│   ├── 5-01-018 Labour Expense
│   ├── 5-01-019 Stock Adjustment
│   └── 5-01-020 Asset Discount
├── 5-02 Administrative Expenses
│   ├── 5-02-001 Admin Salaries
│   ├── 5-02-002 Office Rent
│   ├── 5-02-003 Utilities
│   ├── 5-02-004 Marketing & Advertising
│   ├── 5-02-005 IT & Software Licenses
│   └── 5-02-006 Professional Fees
└── 5-03 Financial Expenses
    ├── 5-03-001 Bank Charges
    └── 5-03-002 Loan Interest
```

قرار مطلوب: بعض حسابات المستوى الثالث تسمح حاليًا بأبناء، ولذلك يجب اعتماد قائمة نهائية توضح أي حساب Posting وأي حساب Group قبل استيراد الأرصدة أو القيود.

## 6. السنوات والفترات المالية

### 6.1 Fiscal Year

```text
Id
CompanyId
Name / Code
StartDate
EndDate
Status: Open | Closed
ClosedAt
ClosedBy
RowVersion
```

### 6.2 قواعد السنة المالية

1. `EndDate >= StartDate`.
2. لا تتداخل السنوات المالية لنفس الشركة.
3. السنة المغلقة لا تعدل.
4. يغلق أقدم عام مكتمل ومفتوح أولًا.
5. يجب ألا توجد قيود غير متوازنة أو بلا سطور.
6. كل القيود غير الملغاة يجب أن تكون معتمدة ومرحلة.
7. الإغلاق يتم داخل Transaction بمستوى عزل مناسب.
8. يجب تسجيل من أغلق السنة ووقت الإغلاق.

### 6.3 تحسين مقترح: Accounting Period

إضافة جدول فترات شهرية أو دورية:

```text
FiscalYearId
PeriodNo
StartDate
EndDate
Status: Open | SoftClosed | Closed
ClosedAt / ClosedBy
```

يسمح ذلك بإغلاق شهر دون إغلاق السنة بالكامل، مع صلاحية خاصة لإعادة الفتح.

## 7. القيود اليومية Journal Vouchers

### 7.1 رأس القيد

```text
Id
CompanyId
VoucherNo
Date
BranchId
CurrencyId
ExchangeRate
FiscalYearId
VoucherType
VoucherSubType
PostingGroup
SourceDocumentType
SourceDocumentId
AssetId
ApprovalStatus
IsPosted
PostingDate
PostedBy
IsVoided
VoidedDate
VoidedBy
VoidReason
Description
CreatedAt / CreatedBy
RowVersion
```

### 7.2 سطر القيد

```text
Id
JournalVoucherId
LineNo
AccountId
Description
SubLookUp
Debit
Credit
PartnerId
PartnerType
JobId
AssetId
VehicleId
BranchId
CostCenterId
OriginalCurrencyDebit
OriginalCurrencyCredit
```

الدقة الحالية للأرقام `decimal(18,2)`. في النظام الجديد يجب جعل الدقة إعدادًا للعملة، مع استخدام دقة أعلى لسعر الصرف.

### 7.3 قواعد القيد

1. القيد يحتوي على سطرين على الأقل عند الترحيل.
2. كل سطر مدين أو دائن وليس الاثنين.
3. القيم موجبة وغير صفرية.
4. مجموع المدين يساوي مجموع الدائن بالعملة الأساسية.
5. الحساب طرفي ونشط وغير محذوف.
6. التاريخ داخل فترة مالية مفتوحة.
7. كل Foreign Keys صالحة ومن نفس الشركة.
8. مركز التكلفة مطلوب إذا طلبه الحساب أو إعداد الشركة.
9. لا يعدل القيد المرحل؛ ينشأ قيد عكسي أو يتم فك الترحيل وفق صلاحية وسياسة معتمدة.
10. القيد الملغي لا يدخل التقارير المالية.

قيود مقترحة:

```text
CHECK ((Debit > 0 AND COALESCE(Credit, 0) = 0)
    OR (Credit > 0 AND COALESCE(Debit, 0) = 0))
UNIQUE (CompanyId, VoucherNo)
```

### 7.4 دورة الحالة

```text
Draft
  └── Approve / Post
          └── Posted
                ├── Allocation
                └── Void / Reverse حسب السياسة
```

الحالة الحالية:

```text
Draft  = ApprovalStatus.NotApproved + IsPosted false
Posted = ApprovalStatus.Approved + IsPosted true
Voided = IsVoided true مع سبب وتاريخ ومنفذ
```

### 7.5 أنواع المستندات

```text
Receipt
Payment
JournalVoucher
CreditNote
DebitNote
SalesInvoice
RentalInvoice
LimousineInvoice
EquipmentRentalInvoice
TransportationInvoice
MiscellaneousInvoice
BillingInvoice
TaxAdvanceInvoice
Bill
SaleOrder
LoanPaymentPlan
LoanEMI
TrafficFine
```

الأنواع الفرعية:

```text
JV
JVProvision
JobExpenseJV
StockSaleExpenseJV
DepreciationJV
SalaryJV
OpeningBalanceJV
ClosingJV
```

## 8. Allocation – تخصيص وتسوية المستحقات

### 8.1 الهدف

الـ Allocation يربط مبلغًا من مستند تسوية بسطر مستحق دون تغيير إجمالي الأستاذ العام.

أمثلة:

```text
Receipt       -> Customer Invoice
Credit Note   -> Customer Invoice
Debit Note    -> Supplier Bill
Payment       -> Supplier Bill
Advance       -> Invoice
Deposit       -> Invoice
Journal Entry -> Journal Entry
```

### 8.2 النموذج الحالي

```text
JournalVoucherAllocation
------------------------
JournalVoucherId
JournalVoucherDetailId
ReceiptId?
CreditNoteId?
DebitNoteId?
AllocatedJournalVoucherId?
AllocatedJournalVoucherDetailId?
AllocatedAmount
AllocationDate
Notes
```

`JournalVoucherId` و`JournalVoucherDetailId` يمثلان المستند أو السطر المستحق. الجانب الآخر يمثل مستند أو سطر التسوية.

### 8.3 المعادلات

```text
AlreadyAllocated = SUM(Active Allocations.AllocatedAmount)
Due              = OriginalAmount - AlreadyAllocated
Available         = LineAmount - AlreadyAllocated
```

مثال:

```text
Invoice Amount          10,000
Existing Allocation      4,000
New Allocation           2,500
Total Allocated          6,500
Remaining Due            3,500
```

### 8.4 الحالات المقترحة

النظام الحالي يعرض `Allocated` و`Unallocated`. التصميم المقترح:

```text
Unallocated
PartiallyAllocated
FullyAllocated
Reversed
```

الحالة تحسب من الإجماليات، ولا تكون قيمة مستقلة قابلة للتعديل يدويًا.

### 8.5 قواعد Allocation

1. مبلغ التخصيص أكبر من صفر.
2. نفس الشركة في الطرفين.
3. نفس العميل أو المورد.
4. نفس حساب الأستاذ المساعد AR/AP.
5. سطر مدين يقابله سطر دائن.
6. المستندان مرحلان وغير ملغيين.
7. التخصيص لا يتجاوز Due في المستند المستحق.
8. التخصيص لا يتجاوز Available في مستند التسوية.
9. العملة متوافقة أو يحفظ سعر صرف التخصيص.
10. لا تعدل أو تحذف المستندات ذات تخصيص نشط.
11. الحفظ يتم داخل Transaction.
12. استخدام RowVersion أو قفل مناسب لمنع Double Allocation.
13. عكس Allocation يسجل كعملية Reversal ولا يمسح التاريخ المحاسبي بلا أثر.

### 8.6 النموذج المحسن

```text
Allocation
----------
Id
CompanyId
PartnerId
AllocationDate
CurrencyId
Status
Notes
ReversalOfId?
CreatedAt / CreatedBy
ReversedAt / ReversedBy
RowVersion

AllocationLine
--------------
AllocationId
SourceJournalLineId
TargetJournalLineId
SourceDocumentType
SourceDocumentId
TargetDocumentType
TargetDocumentId
AllocatedAmount
```

قيود قاعدة البيانات:

```text
CHECK (AllocatedAmount > 0)
CHECK (SourceJournalLineId <> TargetJournalLineId)
UNIQUE حسب سياسة منع تكرار نفس الربط
```

### 8.7 واجهة المستخدم

شاشة Allocation تعرض:

```text
Voucher Type
Voucher No
Date
Partner
Description
Original Amount
Already Allocated
Due
Allocated Now
Notes
```

المقترح:

- إظهار المستندات المفتوحة فقط.
- ترتيب افتراضي FIFO حسب تاريخ الاستحقاق ثم تاريخ المستند.
- زر Auto Allocate مع معاينة قبل الحفظ.
- منع تجاوز Due لحظيًا وفي الخادم.
- إظهار العملة وسعر الصرف.
- صفحة Allocation History وعملية Reverse بصلاحية مستقلة.

## 9. مراكز التكلفة

### 9.1 Cost Center Group

```text
Id
CompanyId
Code
Name
Description
IsActive
```

### 9.2 Cost Center

```text
Id
CompanyId
Code
Name
CostCenterGroupId
IsActive
```

الاستخدامات:

- سطور القيود.
- أرصدة أول المدة.
- المصروفات والإيرادات.
- دفتر الأستاذ.
- قائمة الدخل والتحليلات.
- الميزانية ومقارنة الأداء.

قرار مطلوب: هل مركز التكلفة إلزامي على كل حسابات الربح والخسارة، أم يحدد لكل حساب، أم يحدد بالإعداد العام مع استثناءات؟

## 10. الفروع والعملات

### 10.1 الفرع

```text
Id
CompanyId
Code
Name
DefaultCostCenterId?
IsActive
```

### 10.2 العملة

```text
Id
CompanyId
Code
Name
DecimalName
DecimalPrecision
IsBase
CurrentBaseRate
```

يجب حفظ سعر الصرف داخل المستند والقيد وقت العملية، وعدم الاعتماد على السعر الحالي عند إعادة التقارير التاريخية.

قرار مطلوب: طريقة تقييم فروق العملة، دورية إعادة التقييم، وحسابات الأرباح والخسائر الناتجة عن فروق الصرف.

## 11. ربط الحسابات Account Links

جدول الربط يفصل قواعد الترحيل عن كود الوحدات التشغيلية.

```text
CompanyId
LinkType
LinkKey
Module
SubType
JobType
LinkSection
AccountId
EffectiveFrom?
EffectiveTo?
```

الأنواع الحالية:

```text
General
ChargesType
Contacts
PaymentMethods
BankAccounts
PrepaidExpense
Workshop
```

الإعدادات العامة تتضمن:

```text
Current Earnings Equity Account
Retained Earnings Equity Account
Opening Balance Equity
Default Collection Account
Tax Collected
Tax Paid
Customer Advances
Customer Deposits Payable
Stock Account
Cost Of Sales Account
Misc Income
GRN Clearing Account
Credit Card Surcharge Expense
Asset Sale Revenue
Asset Sale Expense
Accumulated Depreciation
Depreciation Expense
Interest Expense
Commission Expense
Stock Adjustment
```

الوحدات:

```text
Rental
Lease
Limousine
Transportation
Workshop
Equipment
Sales
Miscellaneous
```

أمثلة حالية:

| الغرض | الحساب |
|---|---|
| Rental Revenue | 4-01-001 |
| Limousine Revenue | 4-01-002 |
| Transportation Revenue | 4-01-003 |
| Vehicle Renting Revenue | 4-01-004 |
| Fuel Expense | 5-01-002 |
| Maintenance Expense | 5-01-004 |
| Driver Wages | 5-01-005 |
| Fines Expense | 5-01-009 |
| Tolls Expense | 5-01-010 |
| Commission Expense | 5-01-015 |

في التصدير إلى نظام آخر يجب استخدام `AccountCode` أو `ExternalAccountCode`، وليس رقم `AccountId` وحده.

## 12. حسابات الأستاذ المساعد

يتم ربط العميل أو المورد أو الموظف بحساب مراقبة Control Account من خلال مجموعة الاتصال أو إعداد الربط.

```text
Partner
-------
Id
CompanyId
PartnerType: Customer | Supplier | Staff | Driver | Other
PartnerCode
Name
ContactGroupId
ControlAccountId
CurrencyId?
CreditLimit?
PaymentTerms?
```

القيد يحتفظ بـ `PartnerId` على سطر AR/AP لتمكين:

- كشف الحساب.
- الأعمار.
- Allocation.
- الرصيد الحالي.
- تقارير العملاء والموردين والموظفين.

## 13. أرصدة أول المدة

| الوحدة | الحقول الأساسية |
|---|---|
| Accounts | AccountId, BranchId, CostCenterId, Detail, Debit, Credit |
| Cost Centers | AccountId, BranchId, CostCenterGroupId, Detail, Debit, Credit |
| Customers | CustomerId, VoucherDate, AgreementNo, Debit, Credit |
| Suppliers | SupplierId, VoucherDate, Detail, Debit, Credit |
| Staff | StaffId, VoucherDate, Detail, Debit, Credit |
| Stock | ItemId, Quantity, Description, Debit, Credit |
| Prepaid | AccountId, VehicleId, Detail, Debit, Credit |
| Deposits | AgreementNo, ContactCode, CustomerId, DepositType, Amount, Notes |

قواعد التنفيذ:

1. إنشاء قيد `OpeningBalanceJV` لكل مجموعة مناسبة، غالبًا حسب الفرع.
2. ربط كل سجل بالقيد الناتج عنه.
3. استخدام حساب `Opening Balance Equity` لموازنة الفرق.
4. منع السطر الذي يحتوي مدينًا ودائنًا معًا.
5. التحقق من عدم تكرار الرصيد لنفس المفتاح.
6. إعادة بناء القيد عند تعديل الرصيد إذا لم يكن مرحلًا أو مخصصًا.
7. منع التعديل عند وجود Allocation نشط.

مشكلة حالية: مسار أرصدة الموظفين يحفظ السجلات، لكن إنشاء القيد الخاص به معلق في المصدر. يجب اعتباره بند إصلاح قبل الاعتماد.

## 14. الترحيل من المستندات التشغيلية

### 14.1 فاتورة العميل

```text
Debit  Customer Accounts Receivable = Total Amount
Credit Revenue Account              = Net Amount
Credit Tax Collected                = Tax Amount
```

### 14.2 فاتورة المورد Bill

```text
Debit  Expense / Inventory Account = Net Amount
Debit  Tax Paid                    = Tax Amount
Credit Supplier Accounts Payable   = Total Amount
```

### 14.3 الإيصال Receipt

```text
Debit  Cash / Bank / Card Clearing = Receipt Amount
Credit Customer Accounts Receivable = Receipt Amount
```

### 14.4 المدفوع Payment

```text
Debit  Supplier Accounts Payable
Credit Cash / Bank / Payment Method Account
```

يجب تثبيت هذه القاعدة في النظام الجديد؛ مسار Payment الحالي لا يظهر تكامل قيد واضحًا بنفس درجة بقية المستندات.

### 14.5 Credit Note للعملاء

```text
Debit  Revenue / Sales Return
Debit  Tax Collected Reversal
Credit Customer Accounts Receivable
```

ثم ينشأ Allocation بين سطر Credit Note وسطر الفاتورة.

### 14.6 Debit Note للموردين

```text
Debit  Supplier Accounts Payable
Credit Expense / Purchase Return
Credit Tax Paid Reversal عند التطبيق
```

ثم ينشأ Allocation بين Debit Note وBill المورد.

### 14.7 عمولة البطاقة

```text
Commission = Amount × CommissionPercentage / 100
VAT        = Commission × TaxRate
Actual     = Amount - Commission - VAT
```

الضريبة والنسبة يجب أن تكونا إعدادات فعالة بتاريخ، لا قيمًا ثابتة داخل الكود.

## 15. الموازنة Budget

```text
AccountBudget
-------------
CompanyId
FiscalYearId
AccountId
Year
Month
Amount
```

القيد الفريد:

```text
UNIQUE (CompanyId, FiscalYearId, AccountId, Year, Month)
```

المعادلات:

```text
Actual   = Net posted activity for the account and period
Variance = Budget - Actual
VariancePercentage = Variance / Budget × 100، مع معالجة الصفر
```

تحسينات مقترحة:

- نسخ Budget Version متعددة.
- اعتماد وموافقة على الميزانية.
- Budget by Branch وCost Center.
- Forecast منفصل عن Approved Budget.

## 16. التسوية البنكية

### 16.1 رأس التسوية

```text
BankId
PaymentMethodId?
StatementDate
StatementBalance
LedgerBalance
ReconciledBalance
Difference
IsReconciled
ReconciledAt / ReconciledBy
```

### 16.2 سطور التسوية

```text
JournalVoucherDetailId
Date
VoucherType
VoucherNo
Description
Debit
Credit
IsSelected
```

لا تكتمل التسوية إلا إذا:

```text
Difference = 0
```

تحسينات مقترحة:

- استيراد كشف البنك CSV/Excel.
- مطابقة تلقائية بالمبلغ والتاريخ والمرجع.
- دعم Outstanding Deposits وOutstanding Cheques.
- عدم تعديل جلسة مكتملة؛ يتم فتح Adjustment أو Reversal.

## 17. التقارير

### 17.1 التقارير المالية

| التقرير | الناتج الرئيسي |
|---|---|
| Trial Balance | أول المدة، مدين، دائن، الحركة، آخر المدة |
| Ledger | تفاصيل الحساب ورصيد متحرك |
| Journal | كل سطور اليومية |
| Income Statement | الإيرادات والمصروفات والربح أو الخسارة |
| Balance Sheet | الأصول والالتزامات وحقوق الملكية |
| Cash Flow | التشغيل والاستثمار والتمويل |
| Income Comparison | مقارنة فترتين والانحراف |
| Income Statement YTD | الشهر الحالي ومن بداية العام والمقارنة |
| Income Statement FY | أعمدة شهرية للسنة المالية |
| Vehicle Income Statement | دخل ومصروف وربح المركبة |
| Budget Variance | الفعلي مقابل الميزانية |
| Bank Reconciliation | جلسات وتسويات البنك |

### 17.2 المعادلات

```text
Revenue Balance       = Credit - Debit
Expense Balance       = Debit - Credit
Asset Balance         = Debit - Credit
Liability Balance     = Credit - Debit
Equity Balance        = Credit - Debit
Net Activity          = Debit - Credit
Ending Balance        = Beginning Balance + Net Activity
```

### 17.3 فلاتر موحدة

```text
FromDate / ToDate / AsOfDate
FiscalYearId
BranchId
CostCenterGroupId / CostCenterId
AccountId
AccountLevel
PartnerId
VehicleId / ChassisNo / PlateNo
VoucherNo / VoucherType
LeafOnly
HideZeroActivity
HideZeroEndingBalance
ShowOriginalCurrency
SummaryReport
```

### 17.4 تقارير الأستاذ المساعد

```text
Customer Balance Summary
Customer Statement
Supplier Balance Summary
Supplier Statement
Staff Statement
Receivable Age Analysis
Payable Age Analysis
```

شرائح الأعمار الحالية:

```text
0–30
31–60
61–90
91–120
121–150
151–180
181+
```

قرار مطلوب: هل العمر يحسب من تاريخ الفاتورة أم تاريخ الاستحقاق؟ التصميم المحاسبي المعتاد يعتمد تاريخ الاستحقاق.

## 18. واجهات API الأساسية

### 18.1 الحسابات

```text
GET    Account
GET    Account/GetById/{id}
GET    Account/TreeList
GET    Account/SubGroups?category={category}
GET    Account/GetSelect
POST   Account
PUT    Account
DELETE Account?id={id}
```

### 18.2 السنوات المالية

```text
GET  FiscalYear
POST FiscalYear/VerfiyValidFiscalYear
POST FiscalYear/VerfiyVoucherApprovals
POST FiscalYear/VerfiyDataInconsistency
POST FiscalYear/CloseFiscalYear
```

يفضل تصحيح التهجئة في API الجديد إلى `Verify` مع إصدار Versioned API.

### 18.3 القيود

```text
GET    JournalVoucher
POST   JournalVoucher
PUT    JournalVoucher
DELETE JournalVoucher?id={id}
POST   JournalVoucher/Approve/{id}
POST   JournalVoucher/UnApprove/{id}
POST   JournalVoucher/Void
```

خدمات Allocation موجودة في طبقة الأعمال، لكن نقاط API المقابلة غير ظاهرة حاليًا في Controller. النظام الجديد يحتاج:

```text
GET  JournalVoucher/{id}/allocation-lines
GET  Partners/{partnerId}/open-allocation-items
POST Allocations
POST Allocations/{id}/reverse
GET  Allocations/{id}
GET  Documents/{type}/{id}/allocations
```

### 18.4 ربط الحسابات

```text
GET  LinkAccounts/by-type/{type}
GET  LinkAccounts/options
POST LinkAccounts/upsert
```

### 18.5 التقارير

```text
AccountReports/TrialBalance
AccountReports/Ledger
AccountReports/Journals
AccountReports/IncomeStatement
AccountReports/BalanceSheet
AccountReports/CashFlow
AccountReports/Budget
AccountReports/BudgetVariance
AccountReports/BankReconciliation
```

## 19. تصور واجهات المستخدم

### 19.1 دليل الحسابات

- Tree grid.
- بحث بالكود والاسم.
- فتح وإغلاق الشجرة.
- إضافة ابن من صف الأب.
- إظهار الحساب الطرفي وحالة المعاملات.
- تفاصيل الحساب وتاريخه.
- تعطيل الحذف عند وجود أبناء أو معاملات.

### 19.2 القيد اليومي

- رأس القيد أعلى الشاشة.
- جدول سطور Typed ومتوازن.
- إجمالي المدين والدائن والفرق ظاهر دائمًا.
- اختيار حساب طرفي فقط.
- طلب Partner على حسابات AR/AP.
- طلب Cost Center حسب الحساب.
- Draft، Post، Unpost، Void وفق الصلاحية.

### 19.3 Allocation

- تحديد سطر التسوية أولًا.
- إظهار المستندات المفتوحة للشريك.
- Amount، Already Allocated، Due، Allocated Now.
- Auto Allocate FIFO اختياري.
- تاريخ وسجل كامل للتخصيصات.
- Reverse بدل الحذف المباشر.

### 19.4 التقارير

- فلاتر موحدة.
- Loading وEmpty وError states.
- تصدير Excel/PDF.
- Drill-down من الإجمالي إلى الحساب ثم سطر القيد ثم المستند.
- دعم RTL والثيم الفاتح والداكن والطباعة.

## 20. الصلاحيات والرقابة

النظام الحالي يحتوي Authentication من خلال `AuthGuard`، لكن لا توجد آلية Authorization واضحة يمكن اعتبارها عقد صلاحيات كاملًا. لا ينبغي افتراض أن إخفاء زر يؤمن العملية.

الصلاحيات المقترحة:

```text
Accounts.View
Accounts.Create
Accounts.Update
Accounts.Delete
Journal.View
Journal.Create
Journal.Post
Journal.Unpost
Journal.Void
Allocation.Create
Allocation.Reverse
FiscalYear.Close
FiscalPeriod.Reopen
Budget.Edit
BankReconciliation.Complete
Reports.View
Reports.Export
```

كل صلاحية حساسة تطبق في الخادم، وليس الواجهة فقط.

## 21. التدقيق Audit والاحتفاظ التاريخي

يجب تسجيل:

- المستخدم والتاريخ لكل إنشاء وتعديل.
- من رحل القيد ومن فك الترحيل.
- سبب الإلغاء أو العكس.
- قيم ما قبل وما بعد التعديل للإعدادات المالية.
- تاريخ تغيير Account Links.
- سجل Allocation وReversal.
- سجل إغلاق وإعادة فتح الفترة.
- IP أو Session عند الحاجة الرقابية.

لا يفضل الحذف الفعلي للبيانات المالية المرحلة.

## 22. تصميم ملفات النقل

### 22.1 accounts.csv

```text
company_code
source_account_id
account_code
external_account_code
parent_account_code
name
localized_name
category
statement_sub_group
account_level
normal_balance
statement_type
is_posting_account
allow_children
cost_center_required
default_cost_center_code
is_active
```

### 22.2 journal_headers.csv

```text
company_code
source_voucher_id
voucher_no
voucher_date
branch_code
currency_code
exchange_rate
fiscal_year_code
voucher_type
voucher_sub_type
source_document_type
source_document_id
status
is_posted
is_voided
posting_date
void_reason
```

### 22.3 journal_lines.csv

```text
source_voucher_id
line_no
account_code
description
debit
credit
partner_type
partner_code
branch_code
cost_center_code
job_code
asset_code
vehicle_code
```

### 22.4 allocations.csv

```text
source_allocation_id
allocation_date
partner_code
source_document_type
source_document_no
source_journal_line_key
target_document_type
target_document_no
target_journal_line_key
allocated_amount
currency_code
status
reversal_of_source_id
notes
```

### 22.5 opening_balances.csv

```text
opening_type
account_code
partner_code
item_code
branch_code
cost_center_code
voucher_date
reference_no
description
quantity
debit
credit
```

### 22.6 account_links.csv

```text
link_type
link_key
module
sub_type
job_type
link_section
account_code
effective_from
```

## 23. خطة ترحيل البيانات

### المرحلة M0 – تجميد القرارات

- اعتماد كود الحسابات النهائي.
- تحديد حسابات Group وPosting.
- اعتماد الضرائب والعملات والفترات.
- اعتماد طريقة إغلاق السنة.
- اعتماد سياسة Allocation وReversal.
- اعتماد صلاحيات العمليات الحساسة.

### المرحلة M1 – استخراج وتنظيف Master Data

- الشركات.
- العملات والفروع.
- الحسابات والشجرة.
- مراكز التكلفة.
- العملاء والموردون والموظفون.
- Account Links.

### المرحلة M2 – إنشاء خرائط المعرفات

```text
OldAccountId -> AccountCode -> NewAccountId
OldPartnerId -> PartnerCode -> NewPartnerId
OldVoucherId -> VoucherNo   -> NewVoucherId
```

### المرحلة M3 – تحميل أرصدة أول المدة

- تحديد تاريخ Cutover.
- تحميل الأرصدة حسب حساب/شريك/فرع/مركز تكلفة/عملة.
- إنشاء قيد افتتاحي متوازن.
- مطابقة ميزان المراجعة مع النظام القديم.

### المرحلة M4 – تحميل القيود التاريخية عند الحاجة

- ترحيل القيود المرحلة وغير الملغاة فقط افتراضيًا.
- الاحتفاظ برقم المستند والقيد القديم.
- التحقق من التوازن لكل قيد.
- التحقق من المجاميع حسب الفترة والحساب.

### المرحلة M5 – تحميل Allocation

- بعد تحميل المستندات والقيود.
- ربط كل Allocation بسطرين محاسبيين.
- التحقق من عدم تجاوز Due.
- مطابقة أعمار الديون قبل وبعد النقل.

### المرحلة M6 – Reconciliation

تتم مقارنة:

```text
Trial Balance by Account
Customer Balances
Supplier Balances
Staff Balances
Open Invoices / Bills
Allocation Totals
Bank Balances
Tax Balances
Inventory Control Account
Retained Earnings
```

### المرحلة M7 – Cutover

- إيقاف التسجيل في النظام القديم.
- استخراج Delta أخير.
- تحميل Delta.
- تشغيل تقارير المطابقة.
- موافقة المحاسب المسؤول.
- فتح النظام الجديد للمستخدمين.

## 24. خطة تنفيذ النظام الجديد

### Phase 0 – Discovery and Contract Freeze

المخرجات:

- قرار كود الحسابات.
- قائمة الحسابات النهائية.
- مصفوفة Account Links.
- عقود المستندات والترحيل.
- حالات القيد وAllocation.
- الصلاحيات.
- معايير القبول.

### Phase 1 – Accounting Foundation

- Company/Tenant.
- Fiscal Years/Periods.
- Branches/Currencies.
- Chart of Accounts.
- Cost Centers.
- Partner Control Accounts.

### Phase 2 – General Ledger

- Journal Voucher header/lines.
- التوازن والتحقق.
- Draft/Post/Void/Reverse.
- أرقام قيود آمنة ومتسلسلة.
- Ledger وJournal وTrial Balance.

### Phase 3 – Subledgers and Allocation

- Customer/Supplier/Staff ledgers.
- Open items.
- Allocation جزئي وكامل.
- Auto Allocation.
- Reversal وسجل تخصيص.
- Ageing reports.

### Phase 4 – Operational Posting

- Invoices/Bills.
- Receipts/Payments.
- Credit/Debit Notes.
- Taxes/commissions.
- Deposits/advances.
- Account Links configuration.

### Phase 5 – Opening Balances and Migration

- قوالب الاستيراد.
- Dry run.
- تقارير الأخطاء.
- Reconciliation.
- Cutover tooling.

### Phase 6 – Financial Statements

- Income Statement.
- Balance Sheet.
- Cash Flow.
- Comparative/YTD/FY.
- Drill-down/export.

### Phase 7 – Budget and Bank Reconciliation

- Budget versions.
- Variance.
- Bank statement import.
- Auto matching.
- Completion/reversal controls.

### Phase 8 – Hardening

- صلاحيات الخادم.
- Audit.
- Concurrency.
- Performance/indexes.
- Localization/RTL.
- Backup/recovery.
- Closing simulation.

## 25. أولويات التنفيذ

### MVP

1. دليل الحسابات.
2. السنوات والفترات المالية.
3. القيود اليومية والترحيل.
4. العملاء والموردون وحسابات المراقبة.
5. الإيصالات والمدفوعات.
6. الفواتير والمشتريات.
7. Allocation.
8. ميزان المراجعة والأستاذ واليومية.
9. قائمة الدخل والميزانية.
10. الأرصدة الافتتاحية والترحيل.

### المرحلة التالية

- العملات وإعادة التقييم.
- الميزانيات والـ Forecast.
- التسويات البنكية التلقائية.
- Cash Flow متقدم.
- الأصول والاستهلاك.
- تكامل المخزون.
- تحليلات المركبات والمشروعات.

## 26. معايير القبول

### 26.1 دليل الحسابات

- [ ] لا يوجد كود حساب مكرر داخل الشركة.
- [ ] كل حساب غير Root له Parent صالح.
- [ ] لا يتجاوز العمق خمسة مستويات.
- [ ] لا ترحل معاملات على حساب Group.
- [ ] لا يحذف حساب له معاملات أو أبناء.

### 26.2 القيود

- [ ] كل قيد مرحل متوازن.
- [ ] لا يوجد سطر مدين ودائن معًا.
- [ ] كل حساب طرفي ونشط.
- [ ] التاريخ داخل فترة مفتوحة.
- [ ] القيد الملغي مستبعد من التقارير.
- [ ] المستند مرتبط بالقيد الناتج عنه.

### 26.3 Allocation

- [ ] لا يوجد Allocation بقيمة صفر أو سالبة.
- [ ] الطرفان لنفس الشريك والشركة.
- [ ] إجمالي Allocation لا يتجاوز قيمة أي طرف.
- [ ] Partial Allocation يظهر بشكل صحيح.
- [ ] Fully Allocated لا يظهر كمستند مفتوح.
- [ ] التعديل والحذف والإلغاء محظوران مع Allocation نشط.
- [ ] Reversal يعيد Due ويحفظ سجل التدقيق.
- [ ] التزامن لا يسمح بتخصيص مزدوج.

### 26.4 التقارير

- [ ] Trial Balance متوازن.
- [ ] Ledger يطابق قيود الحساب.
- [ ] مجموع أرصدة العملاء يطابق Control Account.
- [ ] مجموع أرصدة الموردين يطابق Control Account.
- [ ] Balance Sheet تحقق Assets = Liabilities + Equity.
- [ ] صافي قائمة الدخل يطابق Current Year Profit/Loss وفق سياسة الإقفال.

### 26.5 الترحيل

- [ ] جميع الأكواد القديمة لها Mapping.
- [ ] لا توجد قيود غير متوازنة.
- [ ] الأرصدة الافتتاحية تطابق النظام القديم.
- [ ] المستندات المفتوحة والـ Allocation متطابقة.
- [ ] تقارير المطابقة موقعة من المسؤول المالي.

## 27. اختبارات عمل يدوية مطلوبة من المالك

1. إنشاء شجرة حسابات حتى المستوى الخامس.
2. محاولة الترحيل على حساب أب والتأكد من الرفض.
3. إنشاء قيد غير متوازن والتأكد من رفض الترحيل.
4. إغلاق فترة بها قيد Draft والتأكد من الرفض.
5. إنشاء فاتورة والتأكد من قيد AR/Revenue/Tax.
6. إنشاء Receipt وتخصيصه جزئيًا على فاتورتين.
7. محاولة تخصيص أكثر من Due والتأكد من الرفض.
8. تخصيص نفس الرصيد من مستخدمين بالتزامن.
9. Reverse Allocation والتأكد من عودة Due.
10. إنشاء Credit Note وتخصيصه على فاتورة.
11. إنشاء Bill وDebit Note للمورد والتحقق من AP.
12. مطابقة Trial Balance وLedger وCustomer Statement.
13. إغلاق شهر ثم محاولة إدخال قيد في الشهر المغلق.
14. اختبار عملة أجنبية بسعر صرف تاريخي.
15. إكمال Bank Reconciliation والتأكد أن Difference يساوي صفرًا.

## 28. نقاط عدم الاتساق والمخاطر في النظام الحالي

| الأولوية | المشكلة | الأثر | الإجراء المقترح |
|---|---|---|---|
| عالية | وجود أكواد قديمة رقمية وأكواد حديثة بشرطات | فشل الربط والترحيل | اعتماد نظام أكواد واحد وخريطة تحويل |
| عالية | Cash Flow يعتمد IDs ثابتة | نتائج خاطئة بين قواعد البيانات | الربط بالكود أو إعداد Account Link |
| عالية | بعض الخدمات تبحث بأكواد لا تطابق Seed الحالي | عدم إيجاد حساب العميل/المورد/الموظف | إزالة الأكواد الصلبة وتوحيد الربط |
| عالية | بعض تقارير الحسابات لا يظهر فيها شرط Posted/Voided صريح | دخول Draft أو Voided بالتقارير | فلتر محاسبي مركزي لكل التقارير |
| عالية | مسار إضافة JV لا يمر دائمًا بكل Resolver checks | قيد خارج سنة مفتوحة أو على حساب أب | خدمة ترحيل واحدة إلزامية |
| عالية | Allocation API غير مكتمل في Controller | الوظيفة غير متاحة كعقد خارجي كامل | تثبيت endpoints وعقودها |
| عالية | التحقق من الطرف المقابل في Allocation غير مكتمل | Over-allocation أو شريك خاطئ | تحقق ذري للطرفين وقت الحفظ |
| عالية | أرصدة الموظفين لا تنشئ JV حاليًا | اختلاف الأستاذ عن شاشة الأرصدة | استكمال قيد OpeningBalanceJV |
| متوسطة | مولد كود Subledger يحاول تحويل الكود ذي الشرطات إلى Integer | أكواد غير صحيحة | مولد أكواد هرمي موحد |
| متوسطة | تعدد جداول Allocation ونسخ AlreadyAllocated/Due | اختلاف مصادر الحقيقة | اعتماد Journal/Ledger allocation كمصدر وحيد |
| متوسطة | حالتا Allocated/Unallocated فقط | عدم تمييز الجزئي | إضافة PartiallyAllocated محسوبة |
| متوسطة | ضريبة عمولة البطاقة تبدو ثابتة | عدم ملاءمة دولة أو تاريخ مختلف | Tax configuration effective-dated |
| متوسطة | Payment لا يظهر ترحيله بنفس وضوح بقية المستندات | AP غير مكتمل | تجميد عقد Payment posting |
| متوسطة | بعض حسابات المستوى الثالث تسمح بأبناء | غموض حسابات Posting | اعتماد IsPostingAccount صريح |

## 29. القرارات المطلوب اعتمادها قبل التنفيذ

| رقم | القرار | الخيارات الرئيسية | الحالة |
|---:|---|---|---|
| 1 | نظام كود الحسابات | Hyphenated / Numeric / Configurable | مطلوب |
| 2 | أقصى عمق للحسابات | ثابت 5 / قابل للإعداد | مطلوب |
| 3 | حسابات Posting | مشتقة من الأبناء / علم صريح / الاثنين | مطلوب |
| 4 | الفترات المالية | سنة فقط / سنة وشهور | مطلوب |
| 5 | فك الترحيل | مسموح بصلاحية / عكس فقط | مطلوب |
| 6 | الإلغاء | Void دون قيد / Reversal Journal | مطلوب |
| 7 | مركز التكلفة | حسب الحساب / حسب الإعداد / الاثنين | مطلوب |
| 8 | Allocation | FIFO يدوي / تلقائي / كلاهما | مطلوب |
| 9 | عكس Allocation | حذف / Reversal محفوظ | يوصى بـ Reversal |
| 10 | العملات | عملة واحدة / متعددة مع إعادة تقييم | مطلوب |
| 11 | الأعمار | تاريخ الفاتورة / تاريخ الاستحقاق | يوصى بتاريخ الاستحقاق |
| 12 | الضرائب | ثابتة / إعدادات فعالة بتاريخ | يوصى بإعدادات مؤرخة |
| 13 | إقفال الأرباح | آلي / يدوي مع قيد Closing | مطلوب |
| 14 | ترحيل التاريخ | أرصدة فقط / قيود تاريخية كاملة | مطلوب |
| 15 | صلاحيات المحاسبة | Role matrix معتمدة | مطلوب |

## 30. قرارات التصميم المستخرجة من المصدر

| المجال | القرار المؤكد من المصدر | الدليل |
|---|---|---|
| Chart of Accounts | شجرة هرمية متعددة المستويات | Account model/service وواجهة Account tree |
| Account Nature | Assets/Expenses مدين والبقية دائن | خصائص Account المحسوبة |
| Posting | لا ترحيل على حساب له أبناء | JournalVoucherResolver |
| Fiscal Year | الترحيل داخل سنة مفتوحة | JournalVoucherResolver/FiscalYearService |
| Journal | Master-detail ومتوازن | JournalVoucher وJournalVoucherDetail |
| Allocation | الربط المحاسبي الأساسي عبر JournalVoucherAllocation | خدمات JV/CreditNote/DebitNote |
| Opening Balances | تنشئ OpeningBalanceJV مع حساب Equity للموازنة | OpeningBalance helper/services |
| Account Links | الترحيل التشغيلي يعتمد إعداد ربط الحسابات | LinkAccounts service/seed |
| Reports | Roll-up من الحسابات الطرفية إلى الآباء | AccountReportsService |
| Calculations | الخادم يملك الحسابات النهائية | Invoice/Bill/Receipt services |

## 31. التحقق والمراقبة بعد التشغيل

تقارير رقابية يومية:

```text
Unbalanced Draft Vouchers
Posted Vouchers Without Source Document
Documents Without Journal Voucher
Allocations Exceeding Document Amount
Allocated Documents That Are Voided
Subledger vs Control Account Difference
Transactions in Closed Periods
Accounts With Transactions and Children
Missing Account Links
Missing Cost Centers
Bank Reconciliation Differences
```

مؤشرات أداء تقنية:

- زمن استخراج Trial Balance.
- زمن Ledger للحساب الكبير.
- عدد Deadlocks أثناء Allocation.
- عدد محاولات الترحيل المرفوضة.
- عدد المستندات بلا قيد.
- عدد قيود العكس والإلغاء.

## 32. مراجع المصدر

Backend:

```text
F:\Sigma\SigmaBackend\SiGma.Helpers\Models\Accounts\Account.cs
F:\Sigma\SigmaBackend\SiGma.Business\Services\AccountServices\AccountService.cs
F:\Sigma\SigmaBackend\SiGma.Business\Services\SeedDataService.cs
F:\Sigma\SigmaBackend\SiGma.Helpers\Models\Vouchers\JournalVoucher.cs
F:\Sigma\SigmaBackend\SiGma.Helpers\Models\Vouchers\JournalVoucherDetail.cs
F:\Sigma\SigmaBackend\SiGma.Helpers\Models\Vouchers\JournalVoucherAllocation.cs
F:\Sigma\SigmaBackend\SiGma.Business\Resolver\JournalVoucherResolver.cs
F:\Sigma\SigmaBackend\SiGma.Business\Services\VouchersServices\JournalVoucherService.cs
F:\Sigma\SigmaBackend\SiGma.Business\Services\AccountServices\FiscalYearService.cs
F:\Sigma\SigmaBackend\SiGma.Business\Services\AccountServices\AccountReportsService.cs
F:\Sigma\SigmaBackend\SiGma.Helpers\Models\Accounts\LinkAccounts.cs
```

Frontend:

```text
F:\Sigma\SiGmaAngularFrontEnd\src\app\modules\Accounts
F:\Sigma\SiGmaAngularFrontEnd\src\app\modules\Vouchers
F:\Sigma\SiGmaAngularFrontEnd\src\app\pages\routing.ts
```

وثائق السلطة المستخدمة:

```text
F:\Shaban Documents\Shaban\sigma-erp\SIGMA_FEATURE_REVIEW_MASTER.md
F:\Shaban Documents\Shaban\sigma-erp\SIGMA_BACKEND_PATTERNS.md
F:\Shaban Documents\Shaban\sigma-erp\SIGMA_UI_PATTERNS.md
```

حزم الوصفات المولدة PHASE-00 إلى PHASE-06 ظهر بها Drift وقت إعداد الوثيقة، لذلك لم تستخدم كمصدر حقيقة ولم تعدل.

## 33. سجل التنفيذ لهذه الوثيقة

- تم إنشاء هذه الوثيقة فقط.
- لم يتم تعديل Backend أو Frontend.
- لم يتم إنشاء أو تعديل Migration أو Model Snapshot.
- لم يتم تشغيل Build أو Test أو Lint.
- لم يتم تشغيل Browser أو Database commands.
- لم يتم تنفيذ Commit أو Push أو Deployment.
- التحقق الوظيفي والتشغيلي يظل مطلوبًا من مالك النظام عند بدء التنفيذ.

