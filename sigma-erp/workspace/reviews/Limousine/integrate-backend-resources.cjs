const fs = require('fs');
const backend='F:/My Work/Sigma/SigmaBackend/';
const file=backend+'SiGma.Business/Services/LimousinesServices/TripBookingService.cs';
let text=fs.readFileSync(file,'utf8');
const messages=[
 ['NotFound','Trip booking not found.','لم يتم العثور على الرحلة.'],
 ['DriverRequiredAfterAssignment','Driver is required after a trip booking has been assigned or dispatched.','يلزم تحديد السائق بعد تخصيص الرحلة أو إرسالها.'],
 ['ConcurrentChange','This trip booking was changed by another user. Refresh and try again.','عدّل مستخدم آخر هذه الرحلة. حدّث البيانات وأعد المحاولة.'],
 ['AssignStateInvalid','Only a new trip booking can be assigned.','يمكن تخصيص الرحلات الجديدة فقط.'],
 ['VehicleRequiredToAssign','Vehicle is required before assigning a trip.','يلزم تحديد المركبة قبل تخصيص الرحلة.'],
 ['DriverRequiredToAssign','Driver is required before assigning a trip.','يلزم تحديد السائق قبل تخصيص الرحلة.'],
 ['Assigned','Trip assigned successfully.','تم تخصيص الرحلة بنجاح.'],
 ['DispatchStateInvalid','Only a new or assigned trip booking can be dispatched.','يمكن إرسال الرحلات الجديدة أو المخصصة فقط.'],
 ['AssignmentRequiredBeforeDispatch','This company requires the trip to be assigned before dispatch.','تتطلب هذه الشركة تخصيص الرحلة قبل إرسالها.'],
 ['VehicleRequiredToDispatch','Vehicle is required before dispatching a trip.','يلزم تحديد المركبة قبل إرسال الرحلة.'],
 ['DriverRequiredToDispatch','Driver is required before dispatching a trip.','يلزم تحديد السائق قبل إرسال الرحلة.'],
 ['DriverNotFound','Driver not found.','لم يتم العثور على السائق.'],
 ['Dispatched','Trip dispatched successfully.','تم إرسال الرحلة بنجاح.'],
 ['StartStateInvalid','Only a dispatched trip can be started.','يمكن بدء الرحلات المرسلة فقط.'],
 ['StartDateRequired','Start date and time is required.','يلزم إدخال تاريخ ووقت البدء.'],
 ['Started','Trip started successfully.','بدأت الرحلة بنجاح.'],
 ['FinishStateInvalid','Only a started trip can be finished.','يمكن إنهاء الرحلات التي بدأت فقط.'],
 ['DropOffDateRequired','Drop-off date and time is required.','يلزم إدخال تاريخ ووقت الوصول.'],
 ['DropOffBeforeStart','Drop-off date and time cannot be before the trip start time.','لا يجوز أن يسبق وقت الوصول وقت بدء الرحلة.'],
 ['KmsNegative','KMs cannot be negative.','لا يمكن أن تكون الكيلومترات سالبة.'],
 ['TripChargesNegative','Trip charges cannot be negative.','لا يمكن أن تكون رسوم الرحلة سالبة.'],
 ['Finished','Trip finished successfully.','انتهت الرحلة بنجاح.'],
 ['NoShowStateInvalid','Only a dispatched trip can be marked as no show.','يمكن تسجيل عدم الحضور للرحلات المرسلة فقط.'],
 ['MarkedNoShow','Trip marked as no show.','تم تسجيل عدم الحضور للرحلة.'],
 ['InvoicedCannotCancel','An invoiced trip cannot be cancelled. Reverse the invoice first.','لا يمكن إلغاء رحلة مفوترة. اعكس الفاتورة أولًا.'],
 ['CancellationReasonRequired','Cancellation reason is required.','يلزم إدخال سبب الإلغاء.'],
 ['Cancelled','Trip cancelled successfully.','تم إلغاء الرحلة بنجاح.'],
 ['VehicleTypeRequired','Vehicle Type is required.','يلزم تحديد نوع المركبة.'],
 ['InvoicedCannotDelete','An invoiced trip cannot be deleted.','لا يمكن حذف رحلة مفوترة.'],
 ['DeleteStateInvalid','Only New or Cancelled trip bookings can be deleted.','يمكن حذف الرحلات الجديدة أو الملغاة فقط.'],
 ['DateRangeInvalid','From Date must be less than or equal to To Date.','يجب ألا يتجاوز تاريخ البداية تاريخ النهاية.'],
 ['UtilizationBreakupInvalid','Utilization Breakup must be Hourly or Daily.','يجب أن يكون تجميع الاستخدام بالساعة أو باليوم.'],
 ['BranchNotFound','Branch not found.','لم يتم العثور على الفرع.'],
 ['CustomerNotFound','Customer not found.','لم يتم العثور على العميل.'],
 ['VehicleTypeNotFound','Vehicle Type not found.','لم يتم العثور على نوع المركبة.'],
 ['CustomerRequired','Customer is required.','يلزم تحديد العميل.'],
 ['TripTypeRequired','Trip Type is required.','يلزم تحديد نوع الرحلة.'],
 ['PickupLocationRequired','Pickup Location is required.','يلزم تحديد موقع الانطلاق.'],
 ['DropOffLocationRequired','Drop-off Location is required.','يلزم تحديد موقع الوصول.'],
 ['PickupDateRequired','Pickup Date & Time is required.','يلزم إدخال تاريخ ووقت الانطلاق.'],
 ['DropOffDateOrder','Drop-off Date & Time must be greater than Pickup Date & Time.','يجب أن يلي وقت الوصول وقت الانطلاق.'],
 ['ChargesNegative','Charges cannot be negative.','لا يمكن أن تكون الرسوم سالبة.'],
 ['TaxNegative','Tax cannot be negative.','لا يمكن أن تكون الضريبة سالبة.'],
 ['DiscountNegative','Discount cannot be negative.','لا يمكن أن يكون الخصم سالبًا.'],
 ['SupplierChargesNegative','Supplier Charges cannot be negative.','لا يمكن أن تكون رسوم المورد سالبة.'],
 ['TripTypeNotFound','Trip Type not found.','لم يتم العثور على نوع الرحلة.'],
 ['PickupLocationNotFound','Pickup Location not found.','لم يتم العثور على موقع الانطلاق.'],
 ['DropOffLocationNotFound','Drop-off Location not found.','لم يتم العثور على موقع الوصول.'],
 ['VehicleNotFound','Vehicle not found.','لم يتم العثور على المركبة.'],
 ['SupplierNotFound','Supplier not found.','لم يتم العثور على المورد.'],
 ['ExternalRegistrationRequired','Vehicle Registration No is required for external vehicle booking.','يلزم إدخال رقم تسجيل المركبة الخارجية.'],
 ['ExternalMakeModelRequired','Make & Model is required for external vehicle booking.','يلزم إدخال الماركة والطراز للمركبة الخارجية.'],
 ['ExternalSupplierRequired','Supplier is required for external vehicle booking.','يلزم تحديد المورد لحجز المركبة الخارجية.'],
 ['ExternalDriverRequired','Driver Name is required for external vehicle booking.','يلزم إدخال اسم السائق للمركبة الخارجية.'],
 ['VehicleSelectionRequired','Vehicle is required when Search Vehicle By Any is disabled or no matching vehicle is available.','يلزم تحديد المركبة عند تعطيل البحث التلقائي أو عدم توفر مركبة مناسبة.'],
 ['VehicleTypeMismatch','Selected Vehicle does not match the selected Vehicle Type.','المركبة المختارة لا تطابق نوع المركبة المحدد.'],
 ['VehicleUnavailable','Selected Vehicle is not available for the selected time.','المركبة المختارة غير متاحة في الوقت المحدد.'],
 ['DriverUnavailable','Selected Driver is not available for the selected time.','السائق المختار غير متاح في الوقت المحدد.'],
];
const resources={};
for (const [suffix,en,ar] of messages) {
 const key='TripBooking'+suffix; resources[key]=[en,ar];
 const literal=JSON.stringify(en); const escaped=literal.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 // Change only response failures, validation results and workflow success arguments; retain persisted history notes.
 text=text.replace(new RegExp('(Fail(?:<[^>]+>)?\\()'+escaped+'(\\))','g'),'$1'+JSON.stringify(key)+'$2');
 text=text.replace(new RegExp('(return )'+escaped+'(;)','g'),'$1'+JSON.stringify(key)+'$2');
 text=text.replace(new RegExp('(SaveWorkflowAsync\\(booking.Id, )'+escaped+'(,)','g'),'$1'+JSON.stringify(key)+'$2');
}
text=text.replace('Fail($"Cannot edit a trip booking with status \'{entity.Status}\'.")','BusinessFailure("TripBookingEditStateInvalid")');
text=text.replace('Fail($"A trip with status \'{booking.Status}\' cannot be cancelled.")','BusinessFailure("TripBookingCancelStateInvalid")');
resources.TripBookingEditStateInvalid=['This trip cannot be edited in its current status.','لا يمكن تعديل الرحلة في حالتها الحالية.'];
resources.TripBookingCancelStateInvalid=['This trip cannot be cancelled in its current status.','لا يمكن إلغاء الرحلة في حالتها الحالية.'];
resources.TripBookingInvalidDocumentOwnership=['Every saved document must belong to this trip and may appear only once.','يجب أن يتبع كل مستند محفوظ هذه الرحلة وألا يتكرر.'];
text=text.replace(/private static Result Fail\(string message\)[\s\S]*?=> new\(\) \{ IsSuccess = false, Message = message \};\s*private static Result<T> Fail<T>\(string message\)[\s\S]*?=> new\(\) \{ IsSuccess = false, Message = message \};/,'');
text=text.replace(/\bFail(?=[<(])/g,'BusinessFailure').replace('Message = successMessage','Message = LocalizeMessage(successMessage)');
text=text.replace("// Documents are a full snapshot of this booking's live owned rows.",'// Reviewed clients send a full snapshot. Legacy null leaves documents unchanged.');
fs.writeFileSync(file,text,'utf8');
const quotes=JSON.parse(fs.readFileSync('F:/My Work/Sigma/reviews/Limousine/QUOTATION_TRANSLATION_REQUIREMENTS.json','utf8').replace(/^\uFEFF/,''));
const quoteArabic={
 LimoQuotationNotFound:'لم يتم العثور على عرض سعر الليموزين.', LimoQuotationEditStateInvalid:'يمكن تعديل عروض الأسعار قيد الانتظار فقط.', LimoQuotationDeleteStateInvalid:'يمكن حذف عروض الأسعار قيد الانتظار فقط.',
 LimoQuotationInternalApproveStateInvalid:'يمكن اعتماد عروض الأسعار قيد الانتظار داخليًا فقط.', LimoQuotationInternalRejectStateInvalid:'يمكن رفض عروض الأسعار قيد الانتظار داخليًا فقط.',
 LimoQuotationCustomerApproveStateInvalid:'يمكن للعميل اعتماد عروض الأسعار المعتمدة داخليًا فقط.', LimoQuotationCustomerRejectStateInvalid:'يمكن للعميل رفض عروض الأسعار المعتمدة داخليًا فقط.', LimoQuotationReviseStateInvalid:'يمكن مراجعة عروض الأسعار المعتمدة داخليًا فقط.',
 LimoQuotationChargesNegative:'يجب ألا تكون الرسوم سالبة.', LimoQuotationTaxNegative:'يجب ألا تكون الضريبة سالبة.', LimoQuotationCustomerInvalid:'العميل المحدد غير صالح.', LimoQuotationTripTypeInvalid:'نوع الرحلة المحدد غير صالح.',
 LimoQuotationPickUpLocationInvalid:'موقع الانطلاق المحدد غير صالح.', LimoQuotationDropOffLocationInvalid:'موقع الوصول المحدد غير صالح.', LimoQuotationTariffGroupInvalid:'مجموعة التعريفة المحددة غير صالحة.', LimoQuotationFuelChargeInvalid:'رسوم الوقود المحددة غير صالحة.',
 LimoQuotationCustomerRequired:'يلزم تحديد العميل قبل الاعتماد الداخلي.', LimoQuotationTripTypeRequired:'يلزم تحديد نوع الرحلة قبل الاعتماد الداخلي.', LimoQuotationTariffGroupRequired:'يلزم تحديد مجموعة التعريفة قبل الاعتماد الداخلي.',
 LimoQuotationPickUpLocationRequired:'يلزم تحديد موقع الانطلاق قبل الاعتماد الداخلي.', LimoQuotationDropOffLocationRequired:'يلزم تحديد موقع الوصول قبل الاعتماد الداخلي.', LimoQuotationFuelChargeRequired:'يلزم تحديد رسوم الوقود قبل الاعتماد الداخلي.',
 LimoQuotationInternallyApproved:'تم اعتماد عرض سعر الليموزين داخليًا بنجاح.', LimoQuotationInternallyRejected:'تم رفض عرض سعر الليموزين داخليًا بنجاح.', LimoQuotationCustomerApproved:'اعتمد العميل عرض سعر الليموزين بنجاح.', LimoQuotationCustomerRejected:'رفض العميل عرض سعر الليموزين بنجاح.', LimoQuotationRevised:'تمت مراجعة عرض سعر الليموزين بنجاح.', LimoQuotationStatusUpdateFailed:'تعذر تحديث حالة عرض سعر الليموزين.'
};
for(const [key,en] of Object.entries(quotes)) { if(!quoteArabic[key]) throw new Error('Missing Arabic '+key); resources[key]=[en,quoteArabic[key]]; }
const xml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for(let index=0;index<2;index++) {
 const resfile=backend+'SiGma.Helpers/Localization/Shared/GeneralMessage'+(index?'.ar-SA':'')+'.resx'; let source=fs.readFileSync(resfile,'utf8'); let insert='';
 for(const [key,values] of Object.entries(resources)) {
  if(source.includes('<data name="'+key+'"')) continue;
  insert+='  <data name="'+key+'" xml:space="preserve">\n    <value>'+xml(values[index])+'</value>\n  </data>\n';
 }
 source=source.replace('</root>',insert+'</root>'); fs.writeFileSync(resfile,source,'utf8'); console.log(resfile+': added '+(insert.match(/<data /g)||[]).length);
}
fs.writeFileSync('F:/My Work/Sigma/reviews/Limousine/BACKEND_TRANSLATION_REQUIREMENTS.json',JSON.stringify(resources,null,2),'utf8');
