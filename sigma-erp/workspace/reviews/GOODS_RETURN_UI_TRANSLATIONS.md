| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Proposed Purchase Return goods UI translations and user-guide copy for integration by the root owner |

Root integration, 2026-10-25: entries below were integrated into both locale
sources under purchaseReturn.goods and the existing Return guide. This file is
the bounded agent handoff; the final reconciliation owns current implementation
evidence. Read-only credit amounts use the shared MoneyPipe; credit/void forms
freeze through the shared form-state helper while their requests are pending.

## English translation entries

```ts
goods: {
  create: 'Create goods return', edit: 'Edit goods return', view: 'View goods return', creditView: 'View financial credit',
  sections: 'Goods return sections', header: 'Return information', lines: 'Returned source lines', emptyLines: 'No source lines selected.',
  linesRequired: 'Select at least one source line.', receiptNo: 'Receipt no.', billNo: 'Bill no.', item: 'Item', description: 'Description',
  quantity: 'Return quantity', credited: 'Credited quantity', reserved: 'Reserved credit quantity', net: 'Net amount', tax: 'Tax amount',
  selectSources: 'Select receipt lines', availableSources: 'Eligible receipt and bill segments', createCredit: 'Create financial credit',
  sourcePicker: { title: 'Select return sources', source: 'Receipt / bill / item', available: 'Available quantity', used: 'Already selected' },
  tabs: { details: 'Return details' },
  errors: { load: 'The goods return could not be loaded.', wrongKind: 'This record is a financial return. Open it from the financial return route.',
    lookups: 'Branches and suppliers could not be loaded.', sources: 'Eligible receipt lines could not be loaded.', invalid: 'Complete the required return fields and select valid quantities.', save: 'The goods return could not be saved.' },
  credit: { title: 'Create financial credit', lines: 'Billed returned lines', linesRequired: 'Enter a positive quantity for at least one billed line.',
    noEligibleLines: 'No billed quantities are available for credit.', failed: 'The financial credit could not be created.' }
}
```

Also add `documentLog.action: 'Log'` if the existing translation tree does not already expose that key.

## Arabic translation entries

```ts
goods: {
  create: 'إنشاء مرتجع عيني', edit: 'تعديل المرتجع العيني', view: 'عرض المرتجع العيني', creditView: 'عرض الإشعار المالي',
  sections: 'أقسام المرتجع العيني', header: 'بيانات المرتجع', lines: 'بنود مصادر المرتجع', emptyLines: 'لم يتم اختيار بنود مصدر.',
  linesRequired: 'اختر بند مصدر واحدًا على الأقل.', receiptNo: 'رقم الاستلام', billNo: 'رقم الفاتورة', item: 'الصنف', description: 'الوصف',
  quantity: 'كمية المرتجع', credited: 'الكمية الدائنة', reserved: 'الكمية المحجوزة للإشعار', net: 'الصافي', tax: 'الضريبة',
  selectSources: 'اختيار بنود الاستلام', availableSources: 'بنود الاستلام والفواتير المتاحة', createCredit: 'إنشاء إشعار مالي',
  sourcePicker: { title: 'اختيار مصادر المرتجع', source: 'الاستلام والفاتورة والصنف', available: 'الكمية المتاحة', used: 'المحدد سابقًا' },
  tabs: { details: 'تفاصيل المرتجع' },
  errors: { load: 'تعذر تحميل المرتجع العيني.', wrongKind: 'هذا سجل مرتجع مالي. افتحه من مسار المرتجعات المالية.',
    lookups: 'تعذر تحميل الفروع والموردين.', sources: 'تعذر تحميل بنود الاستلام المتاحة.', invalid: 'أكمل بيانات المرتجع المطلوبة واختر كميات صحيحة.', save: 'تعذر حفظ المرتجع العيني.' },
  credit: { title: 'إنشاء إشعار مالي', lines: 'بنود المرتجع المفوترة', linesRequired: 'أدخل كمية موجبة لبند مفوتر واحد على الأقل.',
    noEligibleLines: 'لا توجد كميات مفوترة متاحة للإشعار.', failed: 'تعذر إنشاء الإشعار المالي.' }
}
```

أضف أيضًا `documentLog.action: 'السجل'` إذا لم يكن المفتاح موجودًا في شجرة الترجمة الحالية.

## Proposed in-app guide copy

### English

Create a goods return by choosing a branch and supplier, then select one or more eligible receipt or bill segments. Enter the quantity for each segment and choose Apply; this stages the rows without saving. Save creates a draft only. Stock changes occur when the return is approved through the Approval tab. For an approved billed return, choose Create financial credit, enter quantities up to the displayed available balance, and save. The created credit opens in read-only view and does not move stock again. Use Log to review document actions. Void and approval actions remain subject to server checks.

### العربية

أنشئ المرتجع العيني باختيار الفرع والمورد، ثم اختر بندًا أو أكثر من بنود الاستلام أو الفواتير المتاحة. أدخل كمية كل بند واضغط تطبيق؛ تُضاف البنود إلى المسودة من دون حفظ. ينشئ الحفظ مسودة فقط، ويحدث أثر المخزون عند اعتماد المرتجع من تبويب الاعتماد. للمرتجع المفوتر المعتمد، اختر إنشاء إشعار مالي وأدخل كميات لا تتجاوز الرصيد المتاح المعروض ثم احفظ. يُفتح الإشعار الناتج في وضع العرض ولا ينشئ حركة مخزون أخرى. استخدم السجل لمراجعة إجراءات المستند. تظل إجراءات الإلغاء والاعتماد خاضعة لتحقق الخادم.
