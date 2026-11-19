| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock reports — shared handoff, 2026-10-04

Authority: root AGENTS, Frozen STOCK_REPORTS_MAINTENANCE_EVOLUTION_PLAN, Master2/4/5/7, UI07/20/21 and BE17. Request authorizes implementation. No entity/EF/writer/schema/accounting-posting changes. Generated packets stale; canonical blocks govern. Backend and frontend consume this same handoff.

## Transport

Keep all eight GET actions under `StockReports/<action>` and Authorize. Interface/service returns `StockReportResults<T> : Results<T>` (new report-family DTO), adding `bool IsComplete` and `Dictionary<string, decimal> Totals` only. Preserve every existing row member. Request DTOs retain SpecificationRequestDto, default pageSize20; normalize PageNumber>=1 and PageSize1..100 for paged callers. `Filters[completeReport]=true` explicitly returns ALL filtered rows once, IsComplete=true, TotalCount=all matching rows, PageNo=1, PageSize=max(1,count), TotalPages=count==0?0:1. Paged default IsComplete=false, same authoritative filtered totals/count, SQL paging after aggregation/order where feasible. New Angular report services request completeReport through shared toFilterParams and reject noncomplete/mismatched counts rather than exporting partial output. Inline report/lookup errors own feedback with X-Skip-Error-Interceptor and shared apiErrorMessage; both channels restore state.

## Filters

Only present controls exist in the typed form. Dates use dateRange:Date[]|string|null, currentMonthRange defaults/reset, required two valid ordered endpoints for the six date reports; shared dateRangeValidator/parseDateRange. API accepts optional dates for old callers but rejects nonempty malformed dates, one-sided/reversed ranges and invalid provided positive IDs/enums. Inclusive from midnight; exclusive next day toDate. Supplied itemId/supplierId/jobId/purchaseOrderId are numeric; itemType is the persisted enum, accepting zero. hideZeroQuantity false includes all; true filters Summary.Quantity or Detailed.EndingQuantity!=0. Missing/null/empty filters omitted; false and enum zero preserved by serializer. completeReport true explicit.

| Report | Keys |
|---|---|
| Summary | itemId, itemType, hideZeroQuantity |
| Detailed | fromDate,toDate,itemId,itemType,hideZeroQuantity |
| PO Detail | fromDate,toDate,supplierId (itemId existing optional extension supported if consumed) |
| Purchases | fromDate,toDate,itemId,supplierId; dates continue SupplierBillDate |
| Issue / Return | fromDate,toDate,jobId; dates DateAndTime |
| Pending | fromDate,toDate,purchaseOrderId (new numeric select), existing lpoNo text and supplierId retained; date PO.Date |
| Moving | itemId |

## Rows, columns and authoritative totals

All strings nullable unless stable document/row identity; numbers follow existing quantity types. Add rowId:int to transaction DTOs for stable line identity. Summary/Detailed use itemId; Moving uses itemId. Every money column type money, quantity/index/id type number, date type date, remaining fields text; no invented server sorting or row actions. UI uses 15-row local pager except grouped Pending (complete document flow). Current-language translated headers and values from the shared grid formatter drive complete Excel. Print disables local paginator/scrollable through shared createSession, retains offsets/sizes and reactive filter state.

| Report | Exact ordered grid fields (beside DTO property names; camelCase maps PascalCase) | Totals keys |
|---|---|---|
| Summary | itemCode,itemName,supplierItemCode,unitPrice,minimumStockValue,maximumQuantity,branchName,itemType,quantity,unitCost,stockValue | stockValue |
| Detailed | itemCode,itemName,supplierItemCode,beginningQuantity,inQuantity,outQuantity,netQuantity,endingQuantity,unitCost,stockValue,minimumStockValue,maximumQuantity,branchName,itemType | beginningQuantity,inQuantity,outQuantity,netQuantity,endingQuantity,stockValue (unit costs are rates, not additive totals) |
| PO Detail | date,itemName,itemCode,poNo,supplierItemCode,uom,supplierName,quantity,unitPrice,amount | amount |
| Purchases | date,itemName,itemCode,supplierItemCode,voucherNo,supplierName,uom,quantity,unitPrice,amount | amount |
| Issue | date,jobId,jobNo,itemName,itemCode,supplierItemCode,description,issueNo,quantity,unitPrice,amount,user | amount |
| Return | date,jobNo,itemName,itemCode,supplierItemCode,description,itemsIssue,quantity,unitPrice,amount | amount |
| Pending | date,itemCode,itemName,supplierItemCode,lpoNo,supplierName,description,quantityOrdered,quantityReceived,pendingQuantity | pendingQuantity |
| Moving | rowNo (derived display index only),itemId (retained current column),itemName,itemCode,supplierItemCode,asOfNow,byThisWeek,byThisMonth,byThreeMonth,bySixMonth,byOneYear | none |

Summary/Detailed metadata: Item.MaximumQuantity -> MaximumQuantity; tenant-scoped StockBranch.Name -> BranchName; Item.Type -> ItemType, rendered using the current Stock/Item/models/item-type.ts numeric enum (not old metronic enum). MinimumStockValue:decimal? has no source and stays null, never zero. No separate item-group entity exists; Summary itemType caption is Item Group, sourced from this enum, while filter says Type. PO uses h.No, UOM.Name. Purchases retains GRN.No, SupplierBillDate and stored detail Amount, UOM.Name, adds item filter. No ListVM or AutoMapper changes; report DTOs are explicit projections.

## Calculation decisions — reviewer decision (owner standing rule)

1. Summary and Detailed preserve the opening-balance costing basis: posted nonvoid opening quantity/value, GRN plus returns minus issues, live tenant parent/children. UnitCost=openingValue/openingQuantity when nonzero else0. Detailed previously divided by period beginning quantity: correcting the denominator keeps the same cost basis as Summary. Beginning adds transactions before fromDate; period ending=beginning+in-out; StockValue=quantity*UnitCost. Opening balance dates use the linked journal's date if an authoritative date exists, with final implementation evidence recorded. No weighted average/FIFO or journal backfill introduced. Existing missing historic valuation remains an owner acceptance limitation.
2. Issue/Return: one row per persisted stock detail; no Cartesian JobItem join. Stock detail lacks historical price/description. Use nullable deterministic latest JobItem.UnitPrice matched by parent JobId AND ItemId, not unrelated job items; no match means null price/amount/description rather than fabricated zero. Amount=matched price*stock line quantity; not header total repeated. Returns keep existing earliest same-job/item issue-id inference (not a historical FK); unmatched stays null. These are documented proxies, not accounting entries. Totals sum known amounts; expose a visible translated valuation caveat so incomplete historical prices are not represented as fully valued records.
3. Pending: one grouped PO/item row (stable first detail Id) with summed ordered quantity; earliest detail Description when several exist. Receipt sum uses live tenant GRN header.LPONo==PO.No AND matching SupplierId and ItemId. No receipt exists -> received0; positive ordered-received rows only. Never match by arbitrary string Id or invent an FK. Preserve legacy lpoNo filter; new purchaseOrderId uses actual select Id so label/ID transport cannot disagree. Include PO orders with no GRN. Date filters apply to PO.Date; receipt totals are all current linked receipts, matching a pending-as-now report. Group UI sections by PO identity with date/supplier/No; print/export include every row. Textual linkage and duplicate same-item line description choice are explicit source-supported limitations.
4. Moving: measure remains gross issue quantity (confirmed existing report), not current on-hand balance or sales. AsOfNow counts issues up to a single captured UTC now; rolling 7-day/1/3/6/12-month windows start from that day's UTC midnight and include today up to now. Correct 4/7/13-month accidental windows. Outer join all tenant Items so never-moved items show zero; real Item.Name/BarCode/SupplierItemCode, deterministic code/name/itemId order. Labels say As Of Now and rolling periods, not Current Balance. No net-return/FIFO policy invented.

Backend computes aggregates/counts/totals before paging. No new price persistence. Unknown source values remain null. Totals are complete filtered scope; Excel appends the returned applicable totals in the corresponding columns, never sums browser rows.

## UI/lifecycle, integration and boundaries

Canonical bounded ReportPage/ReportPanel/FeatureTitle; shared global report strip (not mixing list FilterPanel); top alignment via existing align-items-start utility and reserved date FieldError retain same control line. That report-main-form recipe is the UI4/20 report exception to list stableLayout; no feature filter CSS. Search is one real typed form submit, disabled/reactive form locked during request/print. Filter edits cancel/invalidate prior output/totals and reset first; Refresh reapplies current valid filters, Reset restores defaults and clears not-run state. Auxiliary lookups use local loading and explicit Retry. All selected controls start null; text LPO values remain source names. Print/Excel success+rows gates. No automatic initial request: intentional Search-first canonical report workflow with visible structural headers/not-run message. Grouped Pending uses one outer flow scroller; other reports use one fill grid viewport and fixed pager/title/filters/summary. SummaryCards owns compact/row/min140/max80 totals (12px host separation), backend values only. Page never scrolls; print releases bounds.

Eight routes/root lazy links/menu remain intact. Root services use environment.baseUrl and one inherited interceptor client; no manual auth/client/provider. No permissions invented, no mutations or confirmations. No schema migration. Agent backend owns only StockReports service/interface/controller/DTOs and consumed new localized keys; root owns shared FE lifecycle/template and translations, frontend worker owns eight screen consumers/models/services/routes. All must preserve unrelated changes. Build/runtime/SQL/print/theme/RTL/narrow acceptance pending for owner.

## Implementation evidence amendment — 2026-10-04

The linked authoritative opening date exists as JournalVoucher.Date. Detailed therefore places posted nonvoid opening rows before From in Beginning and opening rows inside the period in InQuantity; rows after the exclusive To boundary do not enter period quantities. For backward-compatible callers with both dates absent, Beginning is the complete opening seed, and each movement enters In/Out once. UnitCost deliberately remains the existing all-posted-opening proxy, so it is not a historic-as-of valuation policy. GRN movement dates remain CreatedAt; purchases use SupplierBillDate. No accounting writers change.

QueryReport applies tenant/soft-delete rules only to its query root (Repository source), so report document parents and optional lookup metadata must use explicit scoped query joins/projections; navigation alone does not prove scope. Unknown references remain blank while the stock/document line stays present. Job price lookup joins scoped JobItem and JobDetail and selects latest Id for the same Job/Item. Pending requires a nonblank PO.No before textual receipt matching; absent links cannot accidentally match null document numbers.

New translations use `stockReportViews.*`: Arabic already owns a legacy root `stockReports` string. Preserve that existing key and other consumers instead of overwriting it with a nested object. Both new blocks have 71 matching leaf keys. Moving rowNo is optional on the transport model and populated as a display index after complete-response validation. Excel includes the same issue/return source-price caveat as the screen/print. The public grid event's pageSize is explicitly mapped to resolver rows; selected local page size is preserved across Search/Reset. These are integration clarifications of the frozen lifecycle, not new report formulas.

## Owner presentation amendment — 2026-10-05 (Frozen)

The owner requests readjusting filter formatting and explicitly removes the region reading `Select filters and press Search to run report`. The shared report strip remains the selected UI20 presentation. Fields occupy a full-width equal-flex wrapping group, top-aligned with shared reserved date feedback; actions occupy a separate full-width row aligned at logical end. Existing layout utilities and shared report/control/action styles own presentation; no feature filter CSS is introduced. The hide-zero checkbox retains its labelled input and uses the shared inline-flex check row without the direct-field-label display conflict.

The explicit owner instruction supersedes only the earlier requirement for a visible initial not-run message. Initial headers remain visible with no empty-result claim before Search. Operational errors/recovery, post-search empty state, backend-authoritative totals and valuation caveat remain. No initial automatic request, filter default, query/payload, report column, computation, paging, print or Excel behavior changes. This amendment is scoped to the eight Stock Reports consumers of the shared template; visual/theme/RTL/narrow acceptance remains pending.

## Owner-approved badges and indicators amendment — 2026-10-05 (Frozen)

Authority: after the optional proposals the owner says `تمام نفذهم`. Implement the proposed source-supported KPI cards and row badges across the eight reports. The explicitly deferred minimum/reorder and fast/slow threshold classifications stay outside scope. Existing shared SummaryCards and DataTable status columns own all appearance; no custom badge/card CSS or schema change.

### Additive response and metric contract

Add `Metrics: Dictionary<string,decimal>` to StockReportResults<T>, serialized as `metrics`. Retain Totals and all existing row members/routes/default paging/complete opt-in. Metrics are nonnegative integer counts over the exact final filtered query BEFORE Page/Skip/Take, including hide-zero. Use SQL CountAsync/Distinct/CountAsync (no in-memory page counts); omit null identities from distinct item/supplier counts. Successful responses return all configured keys even when zero; failures return an empty metric dictionary. Backend totals remain unchanged.

| Report | Exact metrics keys and predicates | Additional row status column |
|---|---|---|
| Summary | positiveStockItems: Quantity>0; zeroStockItems: Quantity==0; negativeStockItems: Quantity<0 | Available / zero stock / negative stock, anchored to quantity; append after original columns. |
| Detailed | same three keys, using EndingQuantity | Same labels using endingQuantity; append after original columns. |
| Pending | pendingOrders: distinct non-null PurchaseOrderId; notReceivedLines: QuantityReceived==0; partiallyReceivedLines: QuantityReceived>0, on existing PendingQuantity>0 rows | Not received / partially received; unexpected negative receipt quantity shows Receipt quantity anomaly. This status concerns each grouped PO/item, not the whole order. |
| Moving | neverIssuedItems: AsOfNow==0; dormantSixMonthItems: AsOfNow>0 && BySixMonth==0; issuedLastMonthItems: ByThisMonth>0 | Priority: zero AsOfNow → No issued quantity; dormant predicate → No issues in last 6 months; recent predicate → Issued in last month; otherwise → Previously issued. Labels describe gross issue quantity, not sales/on-hand or fast/slow classes. Sum-zero does not prove absence of zero-quantity documents, hence precise No issued quantity wording. |
| Issue / Return | unpricedLines: !UnitPrice.HasValue || !Amount.HasValue | Price unavailable when UnitPrice is null; otherwise Matched job price. Zero is a present price. Missing return quantity may also leave Amount null, so card says Lines without valuation. A matched proxy is not asserted to be a verified historical price. |
| PO Detail / Purchases | distinctItems: distinct non-null ItemId; distinctSuppliers: distinct non-null SupplierId | No added financial row status. |

### Frontend and output contract

StockReportConfig adds optional typed metric descriptors (key, translation label, shared icon/accent). StockReportPage validates every configured metric as a finite nonnegative integer before accepting output, stores/clears it alongside rows/totals, and composes existing total cards plus metric cards. Row status columns reuse existing numeric fields with `type:'status'` and translated status(row), appended so original numeric columns/totals remain intact. No DTO display fields or client aggregate calculations are added. Shared status formatting supplies translated Excel/print text.

All KPI values and statuses appear in full print. Excel retains original columns/full rows/total row, then appends a translated Report indicators / Count subsection using the first two worksheet columns and backend metric values. Source-price caveat remains. Complete-response, output/busy/error/filter invalidation/local paging contracts and recently adjusted filters stay unchanged. Counts refer to current report filters, including hide-zero; no independent global-stock denominator is implied. Only two/three additional cards per report (one valuation card for Issue/Return), shared compact/row/min140/max80 host bounds retained. EN/AR translations are paired. No migration, permissions, accounting writes, CRUD or new automatic request.

### Shared column identity prerequisite (Frozen, before shared edit)

Actual DataTable header/body loops track column.field alone. The approved appended status columns intentionally reuse existing numeric fields with distinct semantic header keys, so that identity would collide with the retained numeric columns. Under UI20's shared-capability extension rule, adjust only the shared loops' track expression to column.field + ':' + column.header. Header is the stable translation KEY, not current-language text. Each (field,header-key) pair must be unique. Keep field-driven sorting, row identity, formatting/export, status tone, template fallback and all numeric columns unchanged. Existing unique-field consumers retain their same stable pair during updates; no consumer migration or new API/display member is required. Owner runtime/DOM/print verification remains pending.

## عقد تنفيذ الملاحظات المؤكدة بعد مراجعة سبيد — ١ نوفمبر ٢٠٢٦

الحالة Frozen. أذن المالك الآن صراحةً بتعديل الملاحظات. تشمل الشريحة F01–F07: الطباعة الكاملة، حماية سياق المخرجات، توسيع الكميات قبل التجميع وبعقد تقرير عشري، إعادة تقرير المشتريات إلى SupplierBillDate المحدد صراحةً في العقد، المراقبة الصحيحة للمراجع ومؤشر الصفحة، ودليل التقارير الثمانية. لا تعديل نطاق tenant/live/approval/void/branch أو مصدر GRN/معادلةالتقييم أو كُتابالمخزون أو schema/فهارس. الرد JSON يبقى رقمًا لا string، والهويات والمؤشرات true counts تبقى صحيحة.

القرارات المحافظة المعتمدة بهذه الشريحة: يستمر تفسير تاريخ التفصيلي/الصرف/الإرجاع كتاريخ أثر الاعتماد للمعتمد (أو تاريخ المستند التاريخي)، ويُشرح صراحةً بدل إرجاع أثر معتمد إلى الماضي. المشتريات وحده يعود إلى SupplierBillDate لأنه تقرير الفترة الموثق بهذه الدلالة؛ يبقى مصدره GRN كما ينص العقد الحالي، ولا يتغير إلى فواتير Bill دون عقد مصادر/عملة/ضريبة. معالجة overflow تعتمد decimal قبل SUM والجمع في كل كمية مشتقة مستهلكة، دون اختراع كسور عند المنتجين الحاليين. سياسة المنتجين العددية F08 تبقى شريحة مجال عابرة للكيانات والحفظ والرصيد والهجرة؛ لا ندعي أن توسيع ناتج التقرير يحلها. دقة SQL الفعلية وخططها/زمنها عند المالك، ولا تنفيذ فهارس من مقترح مراجعة.

الفرق المرجعي منخفض المخاطر D03 يُعتمد: أربعة تقارير (PO/Issue/Return/Pending) تحصل على اختيار تفعيل فترة، افتراضيًا مفعل مع الشهر الحالي؛ عند تعطيله تُحذف fromDate/toDate صراحةً من الطلب، ولا يُرسل التاريخ المتروك. عند التفعيل يعود التحقق المشترك ذو الطرفين المرتبين. Detailed/Purchases يحتفظان بفترتهما المطلوبة. API الحالي يقبل غياب الطرفين بالفعل، ولا تغيير URL أو DTO طلب أو حدود max page أو completeReport. المصدر المؤرخ يثبت هذا التبديل، وطلب تعديل الملاحظات يأذن بتغطيته دون مالية أو بيانات جديدة.

عقد الكاش: StockReportLookup يضيف source?:BaseService للمصادر المنضمة فعلًا فقط؛ load المنتهي القائم يبقى bootstrap. بعد نجاح كل مصدر يربط watchSelectList وrefreshSelectList مرة واحدة عبر ReferenceLookupBindings مع selected/current getters؛ الفرز/التصفية الحالية للخيارات محفوظان، والتحديث لا يكتب form أو يمس المخرجات، والفشل يحتفظ بالخيارات مع Retry. PurchaseOrder يبقى load مباشرًا بلا source. فشل bootstrap/EMPTY يمنع البحث حتى نجاحه. ReferenceLookupStatus واحد بpage scope يملك تجهيز الخيارات، ولا مؤشر داخل Select أو رسائل تحميل مكررة.

عقد السياق: عند contextChanges يُلغى الطلب والمراقبة والتحضير للطباعة، وتُفرغ النتائج والإجماليات والمؤشرات والخيارات والهويات. النموذج والمخرجات يظلان محميين وتظهر رسالة إعادة فتح التقرير؛ لا قراءة تلقائية بهوية/جلسة قديمة أو إعادة تشغيل أثناء خروج الجلسة. يُعاد تجهيز الصفحة من مصادرها عند فتحها من جديد. لا write في هذه التقارير.

التفويض بعد التجميد: الجذر يملك shared/stock-report-page.ts/.html وshared/stock-report-contract.ts وترجمات en/ar والمصالحة. وكيل الخلفية يملك StockReportsService وDTOs النتائج المستهلكة فقط. وكيل إعدادات الواجهة يملك المكونات الثمانية لإضافة source وحقل optionalDateRange للأربعة فقط. وكيل الدليل يملك stock-guide.ts فقط مع حفظ التغييرات الموجودة. ملفات غير متداخلة؛ لا tests/build/lint/browser/DB/migrations/commit. الحزم الثماني Check ناجح وMaster/الأنماط ذاتها حاكمة.
## ملحق فتح التقارير وكروت الإجماليات — ١ نوفمبر ٢٠٢٦

| البند | القرار |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | وافق المالك على التشغيل التلقائي للتفصيلي عند الفتح، ثم طلب تطبيق المنطق نفسه على بقية تقارير المخزون، وتصغير كروت الإجماليات دون سكرول داخلي. |
| الشريحة | تعديل صغير Tier S في StockReportPage وقالب العائلة ودليل المخزون. يلغي هذا الملحق شرط Search-first عند الفتح وحدود compact/max80 السابقة فقط للثمانية. |
| الفتح | محاولة تقرير واحدة بعد نجاح جميع قراءات المرشحات المحدودة وانتهاء loading؛ تستخدم search الحالية والتحقق والفلاتر الافتراضية لكل تقرير، بما فيها الشهر الحالي حيث توجد فترة. لا طلب قبل نجاح الخيارات، ولا إعادة تلقائية لفشل التقرير أو لإشعارات الكاش. |
| الاسترداد | فشل خيارات البداية ينتظر نجاح Retry ثم يسمح بالمحاولة الأولى؛ فشل التقرير يستخدم Retry الحالي. تعديل مرشح أو Reset يلغي نية التشغيل الأول ويحتفظ بالبحث اليدوي. تغير السياق أو تدمير الشاشة يمنع تشغيلًا متأخرًا. |
| الإجماليات | استخدام SummaryCards الحالي بكثافة slim وتخطيط row وعرض أدنى140، مع إزالة maxHeight ليبقى ارتفاع المحتوى طبيعيًا وتلتف البطاقات دون منطقة تمرير داخلية. القيم والعناوين والمؤشرات والطباعة كما هي. |
| حدود العقد | لا تغيير للخادم أو الحسابات أو بيانات الفترة أو عدد طلبات البحث الواحد أو مصدر كاش جديد. لا تعميم على عائلات التقارير الأخرى خارج stockReports. |
| الأدلة | UI20/24/22/2/28، Master1/2/4/5/7؛ فحص الحزم الثماني ناجح. المرجع المحلي28 أكتوبر: R0586/C1697، شاشة09 وسطور init التي تستدعي getDetailedStockReport؛ دليل27 أكتوبر فصل16 وS113 شرح عام لا يحدد توقيت الفتح. التوقيت المعتمد قرار المالك الصريح، وليس استنتاج قاعدة خادم من المرجع. |

