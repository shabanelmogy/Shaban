const fs = require('fs');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/';
const additions = {
 'general.export': ['Export','تصدير'],
 'location.errors.list': ['Locations could not be loaded. Please try again.','تعذر تحميل المواقع. أعد المحاولة.'],
 'location.errors.load': ['The location could not be loaded. Please try again.','تعذر تحميل الموقع. أعد المحاولة.'],
 'location.errors.search': ['Location search failed. Please try again.','تعذر البحث عن المواقع. أعد المحاولة.'],
 'location.confirmDeleteTitle': ['Delete location','حذف الموقع'],
 'location.confirmDeleteQuestion': ['Delete this location?','هل تريد حذف هذا الموقع؟'],
 'location.confirmDeleteWarning': ['Linked records may prevent deletion.','قد تمنع السجلات المرتبطة حذف الموقع.'],
 'tripType.errors.list': ['Trip types could not be loaded. Please try again.','تعذر تحميل أنواع الرحلات. أعد المحاولة.'],
 'tripType.errors.load': ['The trip type could not be loaded. Please try again.','تعذر تحميل نوع الرحلة. أعد المحاولة.'],
 'tripType.errors.settings': ['Tariff settings could not be loaded. Please try again.','تعذر تحميل إعدادات التعريفة. أعد المحاولة.'],
 'tripType.confirmDeleteTitle': ['Delete trip type','حذف نوع الرحلة'],
 'tripType.confirmDeleteQuestion': ['Delete this trip type?','هل تريد حذف نوع الرحلة هذا؟'],
 'tripType.confirmDeleteWarning': ['Linked records may prevent deletion.','قد تمنع السجلات المرتبطة حذف نوع الرحلة.'],
 'limousineTariff.errors.load': ['Tariffs could not be loaded. Please try again.','تعذر تحميل التعريفات. أعد المحاولة.'],
 'limousineTariff.errors.lookups': ['Tariff choices could not be loaded. Retry before saving.','تعذر تحميل خيارات التعريفة. أعد المحاولة قبل الحفظ.'],
 'limousineTariff.removeTitle': ['Remove tariff row','حذف صف التعريفة'],
 'limousineTariff.removeMessage': ['Remove this tariff row from the current list?','هل تريد حذف صف التعريفة من القائمة الحالية؟'],
 'limousineTariff.duplicateRows': ['Each vehicle, rate type and location combination must be unique.','يجب عدم تكرار مجموعة المركبة ونوع السعر والمواقع.'],
 'limousineTariffReport.loadError': ['The tariff report could not be loaded. Please try again.','تعذر تحميل تقرير التعريفات. أعد المحاولة.'],
 'limousineTariffReport.lookupLoadError': ['Report choices could not be loaded. Please try again.','تعذر تحميل خيارات التقرير. أعد المحاولة.'],
 'limousineTariffReport.tariffType': ['Tariff type','نوع التعريفة'],
 'limousineTariffReport.oneTime': ['One time','مرة واحدة'],
 'limousineTariffReport.halfDay': ['Half day','نصف يوم'],
 'limousineTariffReport.weekly': ['Weekly','أسبوعي'],
 'limousineTariffReport.twoWayTransfer': ['Two way transfer','انتقال ذهاب وعودة'],
 'limousineTariffReport.threeWayTransfer': ['Three way transfer','انتقال بثلاثة اتجاهات'],
 'limousineTariffReport.rateTypes.oneTime': ['One time','مرة واحدة'],
 'limousineTariffReport.rateTypes.perKm': ['Per km','لكل كيلومتر'],
 'limousineTariffReport.rateTypes.extraHour': ['Extra hour','ساعة إضافية'],
 'limousineUtilizationReport.lookupLoadError': ['Report choices could not be loaded. Please try again.','تعذر تحميل خيارات التقرير. أعد المحاولة.'],
 'tripBooking.dateRange': ['Date range','الفترة الزمنية'],
 'tripBooking.fromStatus': ['Previous status','الحالة السابقة'],
 'tripBooking.toStatus': ['New status','الحالة الجديدة'],
 'tripBooking.lookupLoadError': ['Choices or trip settings could not be loaded. Please retry.','تعذر تحميل الخيارات أو إعدادات الرحلات. أعد المحاولة.'],
 'tripBooking.view': ['View trip','عرض الرحلة'],
 'tripBooking.fileCleanupFailed': ['The trip was saved, but some files could not be cleaned up. Retry cleanup.','تم حفظ الرحلة، لكن تعذر تنظيف بعض الملفات. أعد محاولة التنظيف.'],
 'tripBooking.removeDocumentTitle': ['Remove document','حذف المستند'],
 'tripBooking.removeDocumentMessage': ['Remove this document from the trip?','هل تريد حذف هذا المستند من الرحلة؟'],
 'driversTracker.title': ['Drivers tracker','متابعة السائقين'],
 'driversTracker.map': ['Drivers map','خريطة السائقين'],
 'driversTracker.mapCenter': ['Map center','مركز الخريطة'],
 'tripGridCustomization.title': ['Trip grid customization','تخصيص جدول الرحلات'],
 'tripGridCustomization.column': ['Column','العمود'],
 'tripGridCustomization.hide': ['Hide column','إخفاء العمود'],
 'tripGridCustomization.loadError': ['Grid preferences could not be loaded. Please try again.','تعذر تحميل تفضيلات الجدول. أعد المحاولة.'],
 'tripGridCustomization.deleteTitle': ['Delete grid preference','حذف تفضيل الجدول'],
 'tripGridCustomization.deleteMessage': ['Delete this grid preference?','هل تريد حذف تفضيل الجدول هذا؟'],
 'limoQuotation.title': ['Limo Quotation','عرض سعر ليموزين'],
 'limoQuotation.manage': ['Manage Limo Quotations','إدارة عروض أسعار الليموزين'],
 'limoQuotation.reviseFrom': ['Revise Quotation From','مراجعة عرض السعر من'],
 'limoQuotation.addNew': ['Create New Limo Quotation','إنشاء عرض سعر ليموزين'],
 'limoQuotation.add': ['Add Limo Quotation','إضافة عرض سعر ليموزين'],
 'limoQuotation.id': ['ID','المعرف'],
 'limoQuotation.no': ['Quotation No','رقم عرض السعر'],
 'limoQuotation.date': ['Date','التاريخ'],
 'limoQuotation.dateRange': ['Date Range','الفترة الزمنية'],
 'limoQuotation.customer': ['Customer','العميل'],
 'limoQuotation.customerId': ['Customer','العميل'],
 'limoQuotation.tripTypeId': ['Trip Type','نوع الرحلة'],
 'limoQuotation.roundTrip': ['Round Trip','ذهاب وعودة'],
 'limoQuotation.pickUpLocationId': ['Pick Up Location','موقع الانطلاق'],
 'limoQuotation.dropOffLocationId': ['Drop Off Location','موقع الوصول'],
 'limoQuotation.tariffGroupId': ['Tariff Group','مجموعة التعريفة'],
 'limoQuotation.fuelCharge': ['Fuel Charges','رسوم الوقود'],
 'limoQuotation.charges': ['Charges','الرسوم'],
 'limoQuotation.tax': ['Tax','الضريبة'],
 'limoQuotation.notes': ['Notes','ملاحظات'],
 'limoQuotation.basicInfo': ['Basic Information','البيانات الأساسية'],
 'limoQuotation.create': ['Create Limo Quotation','إنشاء عرض سعر ليموزين'],
 'limoQuotation.edit': ['Edit Limo Quotation','تعديل عرض سعر ليموزين'],
 'limoQuotation.details': ['Limo Quotation Details','تفاصيل عرض سعر الليموزين'],
 'limoQuotation.internalApproval': ['Internal Approval','الاعتماد الداخلي'],
 'limoQuotation.customerApproval': ['Customer Approval','اعتماد العميل'],
 'limoQuotation.exportToExcel': ['Export to Excel','تصدير إلى إكسل'],
 'limoQuotation.refresh': ['Refresh','تحديث'],
 'limoQuotation.searchCustomer': ['Search customer','بحث عن عميل'],
 'limoQuotation.swapLocations': ['Swap pick up and drop off locations','تبديل موقعي الانطلاق والوصول'],
 'limoQuotation.openLocation': ['Open location selector','فتح اختيار الموقع'],
 'limoQuotation.calculateTax': ['Calculate tax','حساب الضريبة'],
 'limoQuotation.taxRate': ['Tax {{rate}}%','الضريبة {{rate}}٪'],
 'limoQuotation.selectCustomer': ['Select a Customer','اختر العميل'],
 'limoQuotation.selectTripType': ['Select a Trip Type','اختر نوع الرحلة'],
 'limoQuotation.selectPickUpLocation': ['Select a Pick Up Location','اختر موقع الانطلاق'],
 'limoQuotation.selectDropOffLocation': ['Select a Drop Off Location','اختر موقع الوصول'],
 'limoQuotation.selectTariffGroup': ['Select a Tariff Group','اختر مجموعة التعريفة'],
 'limoQuotation.selectFuelCharge': ['Select a Fuel Charge','اختر رسوم الوقود'],
 'limoQuotation.fuelCharges.inclusive': ['Inclusive','شامل'],
 'limoQuotation.fuelCharges.exclusive': ['Exclusive','غير شامل'],
 'limoQuotation.approval.pending': ['Pending','قيد الانتظار'],
 'limoQuotation.approval.approved': ['Approved','معتمد'],
 'limoQuotation.approval.rejected': ['Rejected','مرفوض'],
 'limoQuotation.approval.revised': ['Revised','تمت المراجعة'],
 'limoQuotation.status.pending': ['Pending','قيد الانتظار'],
 'limoQuotation.status.internallyApproved': ['Internally Approved','معتمد داخليًا'],
 'limoQuotation.status.internallyRejected': ['Internally Rejected','مرفوض داخليًا'],
 'limoQuotation.status.customerApproved': ['Customer Approved','معتمد من العميل'],
 'limoQuotation.status.customerRejected': ['Customer Rejected','مرفوض من العميل'],
 'limoQuotation.actions.internallyApprove': ['Internally Approve','اعتماد داخلي'],
 'limoQuotation.actions.internallyReject': ['Internally Reject','رفض داخلي'],
 'limoQuotation.actions.approveByCustomer': ['Approve By Customer','اعتماد من العميل'],
 'limoQuotation.actions.rejectByCustomer': ['Reject By Customer','رفض من العميل'],
 'limoQuotation.actions.revise': ['Revise','مراجعة'],
 'limoQuotation.confirm.title': ['Confirm Action','تأكيد الإجراء'],
 'limoQuotation.confirm.internallyApprove': ['Internally approve this limo quotation?','هل تريد اعتماد عرض السعر داخليًا؟'],
 'limoQuotation.confirm.internallyReject': ['Internally reject this limo quotation?','هل تريد رفض عرض السعر داخليًا؟'],
 'limoQuotation.confirm.approveByCustomer': ['Mark this limo quotation as approved by the customer?','هل تريد اعتماد عرض السعر من العميل؟'],
 'limoQuotation.confirm.rejectByCustomer': ['Mark this limo quotation as rejected by the customer?','هل تريد رفض عرض السعر من العميل؟'],
 'limoQuotation.confirm.revise': ['Return this limo quotation to Pending for revision?','هل تريد إعادة عرض السعر إلى حالة الانتظار للمراجعة؟'],
 'limoQuotation.validation.nonNegative': ['The value cannot be negative.','لا يمكن أن تكون القيمة سالبة.'],
 'limoQuotation.validation.notesMaxLength': ['Notes cannot exceed 2000 characters.','يجب ألا تتجاوز الملاحظات ٢٠٠٠ حرف.'],
 'limoQuotation.errors.load': ['The quotation could not be loaded. Please try again.','تعذر تحميل عرض السعر. أعد المحاولة.'],
 'limoQuotation.errors.lookups': ['Choices could not be loaded. Retry before saving.','تعذر تحميل الخيارات. أعد المحاولة قبل الحفظ.'],
 'limoQuotation.errors.editLocked': ['Only pending quotations can be edited.','يمكن تعديل عروض الأسعار قيد الانتظار فقط.'],
 'limoQuotation.total': ['Total','الإجمالي'],
};
for (const feature of ['location','tripType','limousineTariff','limoQuotation','tripBooking','tripGridCustomization']) {
 additions[feature + '.discardTitle'] = ['Discard changes?','تجاهل التغييرات؟'];
 additions[feature + '.discardMessage'] = ['Unsaved changes will be lost. Continue?','ستفقد التغييرات غير المحفوظة. هل تريد المتابعة؟'];
 additions[feature + '.discard'] = ['Discard','تجاهل'];
}
Object.assign(additions, {
 'tripBooking.subscription': ['Subscription','الاشتراك'],
 'tripBooking.subscriptionId': ['Subscription','الاشتراك'],
 'tripGridCustomization.create': ['Create grid preference','إضافة تفضيل عرض'],
 'tripGridCustomization.record': ['Preference #{{id}}','تفضيل رقم {{id}}'],
 'tripGridCustomization.columns.Actions': ['Actions','الإجراءات'],
 'tripGridCustomization.columns.TripNo': ['Trip number','رقم الرحلة'],
 'tripGridCustomization.columns.TripType': ['Trip type','نوع الرحلة'],
 'tripGridCustomization.columns.Customer': ['Customer','العميل'],
 'tripGridCustomization.columns.Guest': ['Guest','الضيف'],
 'tripGridCustomization.columns.Pickup': ['Pickup','الانطلاق'],
 'tripGridCustomization.columns.DropOff': ['Drop off','الوصول'],
 'tripGridCustomization.columns.From': ['From','من'],
 'tripBooking.workflowActions.action0': ['Created','إنشاء'],
 'tripBooking.workflowActions.action1': ['Updated','تعديل'],
 'tripBooking.workflowActions.action2': ['Assigned','تخصيص'],
 'tripBooking.workflowActions.action3': ['Dispatched','إرسال'],
 'tripBooking.workflowActions.action4': ['Cancelled','إلغاء'],
 'tripBooking.workflowActions.action5': ['Deleted','حذف'],
 'tripBooking.workflowActions.action6': ['Started','بدء'],
 'tripBooking.workflowActions.action7': ['Finished','إنهاء'],
 'tripBooking.workflowActions.action8': ['Marked no show','تسجيل عدم الحضور'],
});
function nodes(source) {
 const ast = ts.createSourceFile('locale.ts',source,ts.ScriptTarget.Latest,true);
 const result = {};
 function obj(node,prefix) { if (!ts.isObjectLiteralExpression(node)) return; result[prefix] = node; for(const p of node.properties) if(ts.isPropertyAssignment(p)) { const key=prefix?prefix+'.'+p.name.text:p.name.text; result[key]=p.initializer; obj(p.initializer,key); } }
 function visit(n) { if(ts.isVariableDeclaration(n)&&n.name.text==='locale') { const data=n.initializer.properties.find(p=>p.name.text==='data'); obj(data.initializer,''); } ts.forEachChild(n,visit); } visit(ast);
 return result;
}
function render(obj, indent) {
 return Object.entries(obj).map(([k,v]) => ' '.repeat(indent)+JSON.stringify(k)+': '+ (typeof v === 'object' ? '{\n'+render(v,indent+2)+' '.repeat(indent)+'}' : JSON.stringify(v)) + ',\n').join('');
}
for (let index=0;index<2;index++) {
 const file=root+(index?'ar':'en')+'.ts'; let source=fs.readFileSync(file,'utf8'); const map=nodes(source), groups={};
 for(const [key,values] of Object.entries(additions)) {
  if(map[key]) continue;
  const parts=key.split('.'); let parent=parts.slice(0,-1).join('.');
  while(!map[parent] || !ts.isObjectLiteralExpression(map[parent])) parent=parent.split('.').slice(0,-1).join('.');
  const tail=parts.slice(parent?parent.split('.').length:0); let group=groups[parent] ??= {};
  for(let i=0;i<tail.length-1;i++) group=group[tail[i]] ??= {};
  group[tail[tail.length-1]]=values[index];
 }
 const changes=[];
 for(const [parent,items] of Object.entries(groups)) {
  const node=map[parent], position=node.end-1;
  const indent=source.slice(source.lastIndexOf('\n',node.getStart())+1,node.getStart()).match(/^\s*/)[0].length+2;
  changes.push({start:position,end:position,text:(node.properties.length&&!node.properties.hasTrailingComma?',':'')+'\n'+render(items,indent)+' '.repeat(Math.max(0,indent-2))});
 }
 const showing=map['general.showingEntries'];
 if(showing) changes.push({start:showing.getStart(),end:showing.end,text:JSON.stringify(showing.text.replace('{total}','{totalRecords}'))});
 for(const c of changes.sort((a,b)=>b.start-a.start)) source=source.slice(0,c.start)+c.text+source.slice(c.end);
 fs.writeFileSync(file,source,'utf8'); console.log(file+': '+Object.keys(groups).length+' inserted groups');
}

