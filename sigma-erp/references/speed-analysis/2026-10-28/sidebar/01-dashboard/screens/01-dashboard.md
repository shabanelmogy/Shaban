# شاشة: Dashboard

المسار في القائمة: Dashboard.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_dashboard`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0002](../../../readable/routes/R0002--tenant-crs-dashboard.js)، والأصل [raw/application.js:1317](../../../raw/application.js#L1317).
- قالب الشاشة: `~/App/tenant/views/crs/dashboard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.dashboard.index as vm`.
- تعريف المسار: [R0004](../../../readable/routes/R0004--tenant-crs-dashboard.js)، والأصل [raw/application.js:1342](../../../raw/application.js#L1342).
- قالب الشاشة: `~/App/tenant/views/mcc/dashboard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `excluded-by-static-guard`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.mcc.dashboard.index as vm`.
- تعريف المسار: [R0005](../../../readable/routes/R0005--tenant-crs-dashboard.js)، والأصل [raw/application.js:1355](../../../raw/application.js#L1355).
- قالب الشاشة: `~/App/tenant/views/crs/limoDashBoard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `excluded-by-static-guard`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.limo.dashboard.index as vm`.
- تعريف المسار: [R0006](../../../readable/routes/R0006--tenant-crs-dashboard.js)، والأصل [raw/application.js:1373](../../../raw/application.js#L1373).
- قالب الشاشة: `~/App/tenant/views/crs/transportation/dashboard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `excluded-by-static-guard`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.transportation.dashboard.index as vm`.
- تعريف المسار: [R0010](../../../readable/routes/R0010--tenant-crs-dashboard.js)، والأصل [raw/application.js:1435](../../../raw/application.js#L1435).
- قالب الشاشة: `~/App/tenant/views/crs/dashboard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `excluded-by-static-guard`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.dashboard.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.dashboard.index](../../../readable/controllers/C0762--tenant.views.crs.dashboard.index.js) | 44 | 23 |
| [tenant.views.crs.vehicles.listModal](../../../readable/controllers/C1175--tenant.views.crs.vehicles.listModal.js) | 15 | 12 |
| [tenant.views.crs.bookings.listModal](../../../readable/controllers/C0664--tenant.views.crs.bookings.listModal.js) | 5 | 3 |
| [tenant.views.crs.agreements.listModal](../../../readable/controllers/C0540--tenant.views.crs.agreements.listModal.js) | 28 | 12 |
| [tenant.views.workshop.jobEstimations.listModal](../../../readable/controllers/C1795--tenant.views.workshop.jobEstimations.listModal.js) | 22 | 7 |
| [tenant.views.workshop.jobs.listModal](../../../readable/controllers/C1810--tenant.views.workshop.jobs.listModal.js) | 24 | 6 |
| [tenant.views.crs.dashboard.totalHiredVehiclestModal](../../../readable/controllers/C0763--tenant.views.crs.dashboard.totalHiredVehiclestModal.js) | 15 | 3 |
| [tenant.views.crs.lease.agreements.listModal](../../../readable/controllers/C0850--tenant.views.crs.lease.agreements.listModal.js) | 25 | 11 |
| [tenant.views.crs.limousine.trips.listModal](../../../readable/controllers/C0926--tenant.views.crs.limousine.trips.listModal.js) | 30 | 16 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.dashboard.documentExpiryModel](../../../readable/controllers/C0761--tenant.views.crs.dashboard.documentExpiryModel.js) | 14 | 1 |
| [tenant.views.crs.dashboard.approvalListModal](../../../readable/controllers/C0760--tenant.views.crs.dashboard.approvalListModal.js) | 76 | 67 |
| [tenant.views.movements.viewModal](../../../readable/controllers/C1636--tenant.views.movements.viewModal.js) | 11 | 5 |
| [tenant.views.crs.agreementsDashboard2.viewModal](../../../readable/controllers/C0578--tenant.views.crs.agreementsDashboard2.viewModal.js) | 26 | 7 |
| [tenant.views.crs.agreements.viewModal](../../../readable/controllers/C0553--tenant.views.crs.agreements.viewModal.js) | 25 | 6 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.vouchers.deposits.createDeposit](../../../readable/controllers/C1289--tenant.views.crs.vouchers.deposits.createDeposit.js) | 8 | 7 |
| [tenant.views.crs.agreements.replaceVehicleModal](../../../readable/controllers/C0547--tenant.views.crs.agreements.replaceVehicleModal.js) | 9 | 8 |
| [tenant.views.crs.agreements.extendCutShortAgreementModal](../../../readable/controllers/C0537--tenant.views.crs.agreements.extendCutShortAgreementModal.js) | 30 | 8 |
| [tenant.views.crs.agreements.upgradeAgreementModal](../../../readable/controllers/C0550--tenant.views.crs.agreements.upgradeAgreementModal.js) | 45 | 18 |
| [tenant.views.crs.agreements.billingHistoryModal](../../../readable/controllers/C0527--tenant.views.crs.agreements.billingHistoryModal.js) | 4 | 3 |
| [tenant.views.crs.agreements.closeAgreementModal](../../../readable/controllers/C0529--tenant.views.crs.agreements.closeAgreementModal.js) | 35 | 13 |
| [tenant.views.crs.agreements.createOrEditModal](../../../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js) | 80 | 38 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.workshop.jobEstimations.printTemplates.printPreview](../../../readable/controllers/C1799--tenant.views.workshop.jobEstimations.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.workshop.jobEstimations.createOrEditModal](../../../readable/controllers/C1792--tenant.views.workshop.jobEstimations.createOrEditModal.js) | 33 | 19 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.workshop.jobEstimations.viewModal](../../../readable/controllers/C1798--tenant.views.workshop.jobEstimations.viewModal.js) | 6 | 4 |
| [tenant.views.workshop.Jobs.createOrEditModal](../../../readable/controllers/C1803--tenant.views.workshop.Jobs.createOrEditModal.js) | 40 | 24 |
| [tenant.views.workshop.jobEstimations.jobLogModal](../../../readable/controllers/C1794--tenant.views.workshop.jobEstimations.jobLogModal.js) | 4 | 1 |
| [tenant.views.workshop.Jobs.createOrEditLubricationJobModal](../../../readable/controllers/C1802--tenant.views.workshop.Jobs.createOrEditLubricationJobModal.js) | 20 | 7 |
| [tenant.views.workshop.jobs.editPurchaseOrderModel](../../../readable/controllers/C1804--tenant.views.workshop.jobs.editPurchaseOrderModel.js) | 4 | 3 |
| [tenant.views.workshop.Jobs.printTemplates.printPreview](../../../readable/controllers/C1816--tenant.views.workshop.Jobs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.workshop.jobs.gatePassModal](../../../readable/controllers/C1805--tenant.views.workshop.jobs.gatePassModal.js) | 4 | 1 |
| [tenant.views.workshop.jobs.viewModal](../../../readable/controllers/C1814--tenant.views.workshop.jobs.viewModal.js) | 7 | 5 |
| [tenant.views.workshop.jobs.vehicleQualityCheckModal](../../../readable/controllers/C1813--tenant.views.workshop.jobs.vehicleQualityCheckModal.js) | 5 | 2 |
| [tenant.views.workshop.jobs.jobClosingModal](../../../readable/controllers/C1807--tenant.views.workshop.jobs.jobClosingModal.js) | 10 | 2 |
| [tenant.views.workshop.jobs.jobTimeModal](../../../readable/controllers/C1809--tenant.views.workshop.jobs.jobTimeModal.js) | 7 | 2 |
| [tenant.views.crs.lease.agreements.viewModal](../../../readable/controllers/C0855--tenant.views.crs.lease.agreements.viewModal.js) | 18 | 7 |
| [tenant.views.crs.lease.agreements.createOrEditModal](../../../readable/controllers/C0845--tenant.views.crs.lease.agreements.createOrEditModal.js) | 72 | 26 |
| [tenant.views.crs.limousine.trips.printtemplates.printPreview](../../../readable/controllers/C0939--tenant.views.crs.limousine.trips.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.limousine.trips.createOrEditModal](../../../readable/controllers/C0920--tenant.views.crs.limousine.trips.createOrEditModal.js) | 52 | 21 |
| [tenant.views.crs.limousine.trips.dispatchTripModal](../../../readable/controllers/C0921--tenant.views.crs.limousine.trips.dispatchTripModal.js) | 7 | 6 |
| [tenant.views.crs.limousine.trips.viewTripModal](../../../readable/controllers/C0937--tenant.views.crs.limousine.trips.viewTripModal.js) | 15 | 4 |
| [tenant.views.crs.limousine.trips.startTripModal](../../../readable/controllers/C0932--tenant.views.crs.limousine.trips.startTripModal.js) | 2 | 2 |
| [tenant.views.crs.limousine.trips.finishTripModal](../../../readable/controllers/C0923--tenant.views.crs.limousine.trips.finishTripModal.js) | 6 | 4 |
| [tenant.views.crs.limousine.trips.logTripModal](../../../readable/controllers/C0927--tenant.views.crs.limousine.trips.logTripModal.js) | 3 | 1 |
| [tenant.views.crs.limousine.trips.updateChargesModal](../../../readable/controllers/C0933--tenant.views.crs.limousine.trips.updateChargesModal.js) | 5 | 2 |
| [tenant.views.crs.dashboard.transactionPassword](../../../readable/controllers/C0764--tenant.views.crs.dashboard.transactionPassword.js) | 2 | 0 |
| [tenant.views.crs.companies.createOrEditModal](../../../readable/controllers/C0695--tenant.views.crs.companies.createOrEditModal.js) | 50 | 26 |
| [tenant.views.crs.vouchers.purchaseRequest.createOrEditModal](../../../readable/controllers/C1407--tenant.views.crs.vouchers.purchaseRequest.createOrEditModal.js) | 31 | 15 |
| [tenant.views.crs.vouchers.purchaseRequest.approvalModal](../../../readable/controllers/C1406--tenant.views.crs.vouchers.purchaseRequest.approvalModal.js) | 8 | 3 |
| [tenant.views.common.approval.approvalModal](../../../readable/controllers/C0301--tenant.views.common.approval.approvalModal.js) | 14 | 5 |
| [tenant.views.crs.vouchers.purchaseOrders.createOrEditModal](../../../readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js) | 32 | 17 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.vouchers.jvs.createOrEditModal](../../../readable/controllers/C1362--tenant.views.crs.vouchers.jvs.createOrEditModal.js) | 29 | 19 |
| [tenant.views.crs.vouchers.receipts.viewModal](../../../readable/controllers/C1431--tenant.views.crs.vouchers.receipts.viewModal.js) | 26 | 15 |
| [tenant.views.crs.vouchers.bills.viewModal](../../../readable/controllers/C1249--tenant.views.crs.vouchers.bills.viewModal.js) | 27 | 16 |
| [tenant.views.crs.vouchers.bills.createOrEditModal](../../../readable/controllers/C1229--tenant.views.crs.vouchers.bills.createOrEditModal.js) | 58 | 30 |
| [tenant.views.crs.vouchers.payments.viewModal](../../../readable/controllers/C1384--tenant.views.crs.vouchers.payments.viewModal.js) | 37 | 22 |
| [tenant.views.crs.vouchers.payments.createOrEditModal](../../../readable/controllers/C1376--tenant.views.crs.vouchers.payments.createOrEditModal.js) | 61 | 35 |
| [tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal](../../../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js) | 24 | 12 |
| [tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote](../../../readable/controllers/C1271--tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote.js) | 7 | 3 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModal](../../../readable/controllers/C1260--tenant.views.crs.vouchers.creditNotes.createOrEditModal.js) | 27 | 10 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount](../../../readable/controllers/C1261--tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount.js) | 34 | 17 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote](../../../readable/controllers/C1262--tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote.js) | 23 | 10 |
| [tenant.views.crs.vouchers.debitNotes.createOrEditModal](../../../readable/controllers/C1276--tenant.views.crs.vouchers.debitNotes.createOrEditModal.js) | 25 | 8 |
| [tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal](../../../readable/controllers/C1277--tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal.js) | 34 | 15 |
| [tenant.views.crs.rental.quotations.viewModal](../../../readable/controllers/C0961--tenant.views.crs.rental.quotations.viewModal.js) | 11 | 3 |
| [tenant.views.crs.rental.quotations.createOrEditQuotationModal](../../../readable/controllers/C0957--tenant.views.crs.rental.quotations.createOrEditQuotationModal.js) | 33 | 13 |
| [tenant.views.crs.rental.masterAgreements.masterAgreementModal](../../../readable/controllers/C0951--tenant.views.crs.rental.masterAgreements.masterAgreementModal.js) | 10 | 4 |
| [tenant.views.crs.lease.masterAgreements.masterAgreementModal](../../../readable/controllers/C0887--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js) | 18 | 7 |
| [tenant.views.crs.lease.masterAgreements.masterAgreementModal](../../../readable/controllers/C0888--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js) | 10 | 4 |
| [tenant.views.crs.assets.assets.viewModal](../../../readable/controllers/C0588--tenant.views.crs.assets.assets.viewModal.js) | 12 | 3 |
| [tenant.views.crs.assets.assets.disposalApprovalModal](../../../readable/controllers/C0582--tenant.views.crs.assets.assets.disposalApprovalModal.js) | 15 | 8 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |
| [tenant.views.crs.vouchers.deposits.viewModal](../../../readable/controllers/C1302--tenant.views.crs.vouchers.deposits.viewModal.js) | 9 | 6 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.agreements.mileageChargesInfoModal](../../../readable/controllers/C0541--tenant.views.crs.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.agreements.printtemplates.printReplacementPreview](../../../readable/controllers/C0560--tenant.views.crs.agreements.printtemplates.printReplacementPreview.js) | 5 | 1 |
| [tenant.views.crs.vouchers.invoices.viewModal](../../../readable/controllers/C1357--tenant.views.crs.vouchers.invoices.viewModal.js) | 14 | 5 |
| [tenant.views.mcc.movements.movementLogsModal](../../../readable/controllers/C1632--tenant.views.mcc.movements.movementLogsModal.js) | 2 | 1 |
| [tenant.views.crs.vehicles.viewModal](../../../readable/controllers/C1200--tenant.views.crs.vehicles.viewModal.js) | 19 | 6 |
| [tenant.views.movements.editModal](../../../readable/controllers/C1630--tenant.views.movements.editModal.js) | 10 | 6 |
| [tenant.views.crs.agreements.tollsDetailModal](../../../readable/controllers/C0549--tenant.views.crs.agreements.tollsDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.darbsDetailModal](../../../readable/controllers/C0532--tenant.views.crs.agreements.darbsDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.parkingDetailModal](../../../readable/controllers/C0542--tenant.views.crs.agreements.parkingDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.finesDetailModal](../../../readable/controllers/C0538--tenant.views.crs.agreements.finesDetailModal.js) | 3 | 3 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.printTemplates.printPreview](../../../readable/controllers/C1304--tenant.views.crs.vouchers.deposits.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.invoices.generateFineModal](../../../readable/controllers/C1324--tenant.views.crs.vouchers.invoices.generateFineModal.js) | 20 | 8 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.vehicles.updateMileageAlertModal](../../../readable/controllers/C1194--tenant.views.crs.vehicles.updateMileageAlertModal.js) | 2 | 1 |
| [tenant.views.crs.agreements.expiredDocOutStandingBalanceModal](../../../readable/controllers/C0536--tenant.views.crs.agreements.expiredDocOutStandingBalanceModal.js) | 4 | 1 |
| [tenant.views.crs.vehicles.addExternalVehicle](../../../readable/controllers/C1158--tenant.views.crs.vehicles.addExternalVehicle.js) | 6 | 4 |
| [tenant.views.crs.contacts.searchContactOptionModal](../../../readable/controllers/C0707--tenant.views.crs.contacts.searchContactOptionModal.js) | 7 | 1 |
| [tenant.views.crs.contacts.searchSagX3ContactModal](../../../readable/controllers/C0710--tenant.views.crs.contacts.searchSagX3ContactModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.driverChargesModal](../../../readable/controllers/C0534--tenant.views.crs.agreements.driverChargesModal.js) | 4 | 0 |
| [tenant.views.common.authorizationCodes.verifyAuthCodeModal](../../../readable/controllers/C0308--tenant.views.common.authorizationCodes.verifyAuthCodeModal.js) | 3 | 1 |
| [tenant.views.crs.agreements.agreementAdvanceAndDeposit](../../../readable/controllers/C0522--tenant.views.crs.agreements.agreementAdvanceAndDeposit.js) | 15 | 4 |
| [tenant.views.crs.agreements.printPreview](../../../readable/controllers/C0557--tenant.views.crs.agreements.printPreview.js) | 2 | 0 |
| [tenant.views.workshop.serviceItems.serviceItemsSelectorModal](../../../readable/controllers/C1821--tenant.views.workshop.serviceItems.serviceItemsSelectorModal.js) | 3 | 0 |
| [tenant.views.crs.vehicles.addExternalWorkshopVehicle](../../../readable/controllers/C1159--tenant.views.crs.vehicles.addExternalWorkshopVehicle.js) | 5 | 3 |
| [tenant.views.crs.vehicles.createOrEditModal](../../../readable/controllers/C1163--tenant.views.crs.vehicles.createOrEditModal.js) | 34 | 13 |
| [tenant.views.stock.requisitions.createOrEditModal](../../../readable/controllers/C1706--tenant.views.stock.requisitions.createOrEditModal.js) | 10 | 4 |
| [tenant.views.stock.itemReturns.createOrEditModal](../../../readable/controllers/C1681--tenant.views.stock.itemReturns.createOrEditModal.js) | 11 | 5 |
| [tenant.views.stock.itemIssues.createOrEditModal](../../../readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js) | 11 | 5 |
| [tenant.views.workshop.jobEstimations.createLogModal](../../../readable/controllers/C1791--tenant.views.workshop.jobEstimations.createLogModal.js) | 5 | 1 |
| [tenant.views.common.supportRequests.uploadDocumentsModal](../../../readable/controllers/C0438--tenant.views.common.supportRequests.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.workshop.jobs.jobLogModal](../../../readable/controllers/C1808--tenant.views.workshop.jobs.jobLogModal.js) | 9 | 3 |
| [tenant.views.crs.lease.agreements.mileageChargesInfoModal](../../../readable/controllers/C0851--tenant.views.crs.lease.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.limousine.trips.selectChauffeurModal](../../../readable/controllers/C0931--tenant.views.crs.limousine.trips.selectChauffeurModal.js) | 6 | 1 |
| [tenant.views.crs.limousine.trips.uploadDocumentsModal](../../../readable/controllers/C0935--tenant.views.crs.limousine.trips.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.limousine.trips.changeChargesModal](../../../readable/controllers/C0917--tenant.views.crs.limousine.trips.changeChargesModal.js) | 17 | 1 |
| [tenant.views.crs.vouchers.invoices.createOrEditLimoModal](../../../readable/controllers/C1314--tenant.views.crs.vouchers.invoices.createOrEditLimoModal.js) | 33 | 8 |
| [tenant.views.crs.limousine.trips.createLogModal](../../../readable/controllers/C0919--tenant.views.crs.limousine.trips.createLogModal.js) | 3 | 1 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.companies.createOrUpdateDriverModal](../../../readable/controllers/C0696--tenant.views.crs.companies.createOrUpdateDriverModal.js) | 28 | 13 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.crs.vouchers.bills.uploadDocumentsModal](../../../readable/controllers/C1248--tenant.views.crs.vouchers.bills.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.purchaseRequest.printPreview](../../../readable/controllers/C1415--tenant.views.crs.vouchers.purchaseRequest.printPreview.js) | 2 | 0 |
| [tenant.views.common.approval.rejectionReason](../../../readable/controllers/C0303--tenant.views.common.approval.rejectionReason.js) | 3 | 0 |
| [tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal](../../../readable/controllers/C1400--tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal.js) | 11 | 2 |
| [tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal](../../../readable/controllers/C1284--tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview](../../../readable/controllers/C1405--tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.jvs.uploadDocumentsModal](../../../readable/controllers/C1368--tenant.views.crs.vouchers.jvs.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.jvs.printTemplates.printPreview](../../../readable/controllers/C1370--tenant.views.crs.vouchers.jvs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.jvs.printTemplates.printPreview](../../../readable/controllers/C1394--tenant.views.crs.vouchers.jvs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |
| [tenant.views.crs.vouchers.bills.loanPaymentModal](../../../readable/controllers/C1236--tenant.views.crs.vouchers.bills.loanPaymentModal.js) | 22 | 3 |
| [tenant.views.crs.vouchers.bills.printTemplates.printPreview](../../../readable/controllers/C1251--tenant.views.crs.vouchers.bills.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.payments.uploadDocumentsModal](../../../readable/controllers/C1383--tenant.views.crs.vouchers.payments.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.common.hrm.payrolls.viewModal](../../../readable/controllers/C0388--tenant.views.common.hrm.payrolls.viewModal.js) | 3 | 1 |
| [tenant.views.common.hrm.deduction.createOrEditModal](../../../readable/controllers/C0369--tenant.views.common.hrm.deduction.createOrEditModal.js) | 12 | 6 |
| [tenant.views.crs.vouchers.payments.printTemplates.printPreview](../../../readable/controllers/C1386--tenant.views.crs.vouchers.payments.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail](../../../readable/controllers/C0875--tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail.js) | 8 | 1 |
| [tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal](../../../readable/controllers/C1270--tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal](../../../readable/controllers/C1257--tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal.js) | 9 | 3 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal](../../../readable/controllers/C1258--tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal.js) | 4 | 1 |
| [tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal](../../../readable/controllers/C1402--tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.rental.quotations.calculationDetail](../../../readable/controllers/C0956--tenant.views.crs.rental.quotations.calculationDetail.js) | 9 | 0 |
| [tenant.views.crs.rental.quotations.viewCalculationDetail](../../../readable/controllers/C0960--tenant.views.crs.rental.quotations.viewCalculationDetail.js) | 2 | 0 |
| [tenant.views.crs.agreements.createOrEditModalForMaster](../../../readable/controllers/C0531--tenant.views.crs.agreements.createOrEditModalForMaster.js) | 64 | 23 |
| [tenant.views.crs.lease.leaseQuotations.calculationDetail](../../../readable/controllers/C0874--tenant.views.crs.lease.leaseQuotations.calculationDetail.js) | 4 | 0 |
| [tenant.views.crs.assets.assets.depreciationDetailModal](../../../readable/controllers/C0581--tenant.views.crs.assets.assets.depreciationDetailModal.js) | 5 | 1 |
| [tenant.views.crs.vouchers.deposits.allocationForDeposit](../../../readable/controllers/C1287--tenant.views.crs.vouchers.deposits.allocationForDeposit.js) | 10 | 7 |
| [tenant.views.crs.vouchers.deposits.editAllocationForDeposit](../../../readable/controllers/C1291--tenant.views.crs.vouchers.deposits.editAllocationForDeposit.js) | 7 | 2 |
| [tenant.views.crs.vouchers.deposits.editAllocationForDeposit2](../../../readable/controllers/C1292--tenant.views.crs.vouchers.deposits.editAllocationForDeposit2.js) | 9 | 2 |
| [tenant.views.crs.vouchers.deposits.allocationForDeposit2](../../../readable/controllers/C1288--tenant.views.crs.vouchers.deposits.allocationForDeposit2.js) | 12 | 7 |
| [tenant.views.crs.vouchers.deposits.depositRefund](../../../readable/controllers/C1290--tenant.views.crs.vouchers.deposits.depositRefund.js) | 9 | 6 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vehicles.printDocumentModel](../../../readable/controllers/C1178--tenant.views.crs.vehicles.printDocumentModel.js) | 1 | 1 |
| [tenant.views.crs.vouchers.invoices.addMissingFineModal](../../../readable/controllers/C1309--tenant.views.crs.vouchers.invoices.addMissingFineModal.js) | 8 | 5 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |
| [tenant.views.common.makes.createOrEditModal](../../../readable/controllers/C0401--tenant.views.common.makes.createOrEditModal.js) | 2 | 2 |
| [tenant.views.common.vehiclemodels.createOrEditModal](../../../readable/controllers/C0444--tenant.views.common.vehiclemodels.createOrEditModal.js) | 3 | 3 |
| [tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal](../../../readable/controllers/C0922--tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal.js) | 2 | 0 |
| [tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal](../../../readable/controllers/C0918--tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.changeChargesModal](../../../readable/controllers/C1313--tenant.views.crs.vouchers.invoices.changeChargesModal.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.searchTripModal](../../../readable/controllers/C1352--tenant.views.crs.vouchers.invoices.searchTripModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal](../../../readable/controllers/C1351--tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal.js) | 5 | 3 |
| [tenant.views.crs.vouchers.invoices.printTemplates.printPreview](../../../readable/controllers/C1359--tenant.views.crs.vouchers.invoices.printTemplates.printPreview.js) | 6 | 0 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.common.hrm.deduction.deductionPayrollLineModal](../../../readable/controllers/C0371--tenant.views.common.hrm.deduction.deductionPayrollLineModal.js) | 5 | 2 |
| [tenant.views.mcc.dashboard.index](../../../readable/controllers/C1624--tenant.views.mcc.dashboard.index.js) | 8 | 5 |
| [tenant.views.limo.dashboard.index](../../../readable/controllers/C0895--tenant.views.limo.dashboard.index.js) | 7 | 4 |
| [tenant.views.transportation.dashboard.index](../../../readable/controllers/C1148--tenant.views.transportation.dashboard.index.js) | 6 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.dashboard.index`: `ownershipFilterChanged`، `getlocalDate`، `getVehiclesSummary`، `getVehiclesSummaryIdle`، `getVehiclesSummaryIdleBranchWise`، `getBookingsSummary`، `getAgreementsSummary`، `getLeaseAgreementsSummary`، `getDailyLeaseRevenueReport`، `getLeaseVehicles`، `getLimousineSummary`، `getJobSummary`، `getEstimationSummary`، `getDailyRentalRevenueReport`، `getRentalVehicles`، `calculateRentalSummary`، `getOtherChargesSum`، `calculateLeaseSummary`، `getTotalRevenuePerDay`، `getRevenuePerDayPerCar`، `getRevenuePerDayPerCarForLease`، `roundingforView`، `getVehiclesSummaryByType`، `getOpenTripVehiclesSummaryByType`، `getHiredVehicleSummaryByType`، `getVehicleSummaryNrm`، `getVehicleSummaryWorkShop`، `selectVehilceHandler`، `selectVehilceHandlerTrip`، `selectVehilceHandlerReplacementToday`، `selectBookingHandler`، `selectAgreementHandler`، `selectHiredTotalAgreementHandler`، `selectOpenListToOpenJobsFirst`، `selectJobEstimationHandler`، `selectMovementHandler`، `selectLeaseHandler`، `selectLimousineHandler`، `openTotalHiredVehiclesModal`، `checkVehicleAvailibity`، `agreementExpiryUser`، `getApprovalLinesCount`، `selectApprovalsHandlerSummary`، `getApprovalsSummaryForNotifications`.
- وحدة `tenant.views.crs.vehicles.listModal`: `showIdleDaysColumn`، `showModifiedUserColumn`، `localize`، `cancel`، `hideLastDateColumn`، `hideStatusColumn`، `outDaysColumnVisible`، `CurrencyFormate`، `getlocalDateTime`، `viewMovementReadyToGo`، `viewMovement`، `getVehicles`، `loadSubStatusforNrmandWorkshop`، `getMakeModelYear`، `exportToExcel`.
- وحدة `tenant.views.crs.bookings.listModal`: `subTitle`، `cancel`، `DueToCloseCalender`، `getlocalDateTime`، `getBookings`.
- وحدة `tenant.views.crs.agreements.listModal`: `dateRangeModelChanged`، `locationPermissionClose`، `dateRangeCheck`، `subTitle`، `DueToCloseCalender`، `cancel`، `getlocalDateTime`، `viewAgreement`، `locationPermissionEditDelete`، `addReceipt`، `createDeposit`، `replaceVehicle`، `extendAgreement`، `cutShortAgreement`، `upgradeAgreement`، `viewBillingHistory`، `closeAgreement`، `deleteAgreement`، `editAgreement`، `getlocalizedString`، `getMakeModel`، `getAgreements`، `onPageSizeChange`، `paginate`، `exportToExcel`، `closedexportToExcel`، `exportToExcelOpen`، `exportToExcelPreClosed`.
- وحدة `tenant.views.workshop.jobEstimations.listModal`: `searchUsers`، `createJobEstimation`، `dateRangeCheck`، `dateRangeModelChanged`، `searchCustomers`، `searchCustomerPopoup`، `openprintModal`، `clearCustomer`، `getJobEstimations`، `exportToExcel`، `report`، `deleteJobEstimation`، `rejectJobEstimation`، `getStatusString`، `openJobEstimationsViesModel`، `createJob`، `openJobLogModal`، `approveJobEstimation`، `closeEstimation`، `getlocalDateTime`، `getJobEstimations`، `cancel`.
- وحدة `tenant.views.workshop.jobs.listModal`: `searchUsers`، `createOrEditJob`، `createLubricationJob`، `dateRangeCheck`، `dateRangeModelChanged`، `searchCustomers`، `searchCustomerPopoup`، `getJobs`، `cancel`، `exportToExcel`، `report`، `clearCustomer`، `getStatusString`، `deleteJob`، `cancelJob`، `editPurchaseOrderModel`، `openprintModal`، `openprintModalGatePass`، `openJobViewModel`، `openJobLogModal`، `openVehicleQualityCheckModal`، `close`، `jobTime`، `getlocalDateTime`.
- وحدة `tenant.views.crs.dashboard.totalHiredVehiclestModal`: `showIdleDaysColumn`، `showModifiedUserColumn`، `localize`، `cancel`، `hideLastDateColumn`، `hideStatusColumn`، `outDaysColumnVisible`، `getStatusToDisplay`، `getlocalDateTime`، `viewMovementReadyToGo`، `viewMovement`، `getVehicles`، `loadSubStatusforNrmandWorkshop`، `getMakeModelYear`، `exportToExcel`.
- وحدة `tenant.views.crs.lease.agreements.listModal`: `dateRangeModelChanged`، `dateRangeCheck`، `subTitle`، `DueToCloseCalender`، `cancel`، `getlocalDateTime`، `viewAgreement`، `locationPermissionEditDelete`، `addReceipt`، `createDeposit`، `replaceVehicle`، `extendAgreement`، `cutShortAgreement`، `upgradeAgreement`، `viewBillingHistory`، `closeAgreement`، `getlocalDate`، `getlocalizedString`، `deleteAgreement`، `editAgreement`، `getLeaseAgreements`، `exportToExcel`، `exportToExcelOpen`، `exportToExcelPreClosed`، `dueExportToExcel`.
- وحدة `tenant.views.crs.limousine.trips.listModal`: `subTitle`، `cancel`، `applyChange`، `CurrencyFormate`، `isPrepaymentRequired`، `exportToNew`، `dispatchedExportToExcel`، `exportToExcelStarted`، `finishedexportToExcel`، `canceledexportToExcel`، `exportToExcelNoShow`، `isPrepaymentRequired`، `changeColumnOrdering`، `updateChargesPermission`، `locationPermission`، `getTrips`، `TripPrintModal`، `createTrip`، `dispatchTrip`، `viewTrip`، `editTrip`، `startTrip`، `finishTrip`، `logTrip`، `updateCharges`، `cancelTrip`، `noShowTrip`، `deleteTrip`، `getTripStatus`، `applyChange`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.dashboard.documentExpiryModel`: `localize`، `cancel`، `getlocalDateTime`، `exportToExcel`، `documentTypeIdentityCat`، `getAgreementNo`، `documentNoCat`، `issuedByCat`، `issuedByCat`، `expiryDateCat`، `issueDateCat`، `getIdentificationDocumentType`، `getContactCategory`، `getcustomerswithexpireddocuments`.
- وحدة `tenant.views.crs.dashboard.approvalListModal`: `localize`، `cancel`، `getlocalDateTime`، `getlocalDate`، `currencyFormate`، `applyChangeToAll`، `getSelectedRowsCount`، `getSelectedRowsCountForQuotation`، `getSelectedRowsCountForRentalQuotation`، `approveRows`، `approveAssetRows`، `getFormAndRecordIds`، `getPaymentType`، `getStatus`، `debitNoteLocationPermission`، `creditNoteLocationPermission`، `onAccountSupEditDelDisable`، `viewCompany`، `editCompany`، `approveCompanies`، `viewPurchaseRequest`، `editPurchaseRequest`، `approvePurchaseRequest`، `multiLevelApprovePurchaseRequest`، `approvePayments`، `viewPurchaseOrder`، `editPurchaseOrder`، `approvePurchaseOrder`، `rejectPurchaseOrder`، `viewJV`، `viewReceipt`، `viewBill`، `editJV`، `editReceipt`، `editBill`، `approveBills`، `approveJV`، `approveReceipt`، `rejectBills`، `viewPayment`، `editPayment`، `approveLeaseQuotation`، `rejectLeaseQuotation`، `rejectLeaseQuotationRequest`، `rejectLeaseQuotationByCustomer`، `approveLeaseQuotationByCustomer`، `viewLeaseQuotation`، `editNewLeaseQuotation`، `approveCreditNote`، `rejectCreditNote`، `viewCreditNote`، `editCreditNote`، `approveDebitNote`، `rejectDebitNote`، `viewDebitNote`، `editDebitNote`، `viewRentalQuotation`، `editNewRentalQuotation`، `approveRentalQuotation`، `rejectRentalQuotation`، `approveRentalQuotationByCustomer`، `rejectRentalQuotationByCustomer`، `getInvoiceTypeById`، `viewInvoice`، `editInvoice`، `approveInvoices`، `masterAgreementModal`، `approveMasterAgreement`، `leaseMasterAgreementModal`، `approveLeaseMasterAgreement`، `openJobEstimationsViewModel`، `createJobEstimation`، `approveJobEstimation`، `rejectJobEstimation`، `viewAsset`، `approveDisposal`.
- وحدة `tenant.views.movements.viewModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `getFieldLabel`، `isCustomFieldExists`.
- وحدة `tenant.views.crs.agreementsDashboard2.viewModal`: `getlocalDateTime`، `getlocalDate`، `localize`، `localizeChargesType`، `openViewSingleDepositModal`، `getAgreements`، `openForViewReceivedDetails`، `showTollsDetail`، `showFinesDetail`، `showParkingsDetail`، `showDarbDetail`، `getFuelLevel`، `openViewDepositModal`، `calculate`، `viewContact`، `openMileageInfoModal`، `printModel`، `generateFineInvoice`، `generateParkingInvoice`، `generateTollInvoice`، `generateDarbInvoice`، `viewMovement`، `CurrencyFormate`، `cancel`، `totalDaysAndTime`، `viewInvoice`.
- وحدة `tenant.views.crs.agreements.viewModal`: `getlocalDateTime`، `openMovementLogsModal`، `getlocalDate`، `currencyAndRoundingWithThree`، `roundingforView`، `localize`، `localizeChargesType`، `getFuelLevel`، `rounding`، `calculate`، `viewContact`، `viewVehicle`، `openMileageInfoModal`، `printModel`، `editMovement`، `viewMovement`، `showTollsDetail`، `showDarbsDetail`، `showParkingDetail`، `fetchParking`، `showFinesDetail`، `cancel`، `totalDaysAndTime`، `viewInvoice`، `getOutStandingBalance`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.deposits.createDeposit`: `uploadDocument`، `removeDocument`، `getOriginalName`، `amountChanged`، `depositSubTypeChanged`، `amountChangedDeposit`، `cancel`، `ok`.
- وحدة `tenant.views.crs.agreements.replaceVehicleModal`: `searchVehicles`، `searchGoogleLocations`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`، `generateFineInvoices`.
- وحدة `tenant.views.crs.agreements.extendCutShortAgreementModal`: `agreementTypeDisableCheck`، `localize`، `applyDiscount`، `agreementTypeSelected`، `searchVehicles`، `searchCustomers`، `searchStaff`، `searchCustomerPopoup`، `updateMileage`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `vehicleSelected`، `customerSelected`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `totalDaysAndTime`، `updateEndDateTimeWithStartDate`.
- وحدة `tenant.views.crs.agreements.upgradeAgreementModal`: `getlocalDateTime`، `getAgreementTypeName`، `agreementTypeChanged`، `getFuelLevel`، `endDateChanged`، `calculate`، `calculateMileage`، `mileageInChanged`، `sumCharges`، `taxAcceptedChanged`، `searchGoogleLocations`، `carryFwdKmsToggle`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `showTollsDetail`، `showFinesDetail`، `cancel`، `fetchTolls`، `fetchDarbTolls`، `closeAllTabs`، `fetchFines`، `localize`، `startDateChanged`، `agreementTypeSelected`، `endDateChangedOpen`، `searchVehicles`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `searchStaff`، `searchUsersWithDesignation`، `vehicleSelected`، `customerSelected`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `tariffOptionSelected`، `calculateOpen`، `includedChanged`، `taxAcceptedChangedOpen`، `discountApplied`، `save`.
- وحدة `tenant.views.crs.agreements.billingHistoryModal`: `getlocalDate`، `cancel`، `rounding`، `addCustomerPayment`.
- وحدة `tenant.views.crs.agreements.closeAgreementModal`: `localize`، `localizeChargesType`، `getlocalDateTime`، `getAgreementType`، `tariffOptionSelected`، `calculateMileage`، `includedChanged`، `getFuelLevel`، `searchGoogleLocations`، `endDateChanged`، `calculate`، `sumCharges`، `taxAcceptedChanged`، `tollsCount`، `openMileageInfoModal`، `chargesAcceptanceChanged`، `generateFineInvoice`، `totalDaysAndTime`، `save`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `cancel`، `callbackOnComplete`، `downloadTollsV3`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `fetchTolls`، `fetchDarbTolls`، `fetchFines`، `fetchParking`، `showError`، `hasError`، `ok`.
- وحدة `tenant.views.crs.agreements.createOrEditModal`: `searchProjects`، `getlocalDateTime`، `isQuotationMandatory`، `getDateTariffCard`، `searchGoogleLocations`، `agreementTypeChange`، `getTariffCards`، `getTariffCardForAgreement`، `localize`، `localizeChargesType`، `startDateChanged`، `shouldDisableRateOtherThanRent`، `shouldDisableRow`، `applyDiscount`، `agreementTypeSelected`، `updateEndDateTimeWithStartDate`، `restrictEndTime`، `onStartDateChanged`، `onEndDateChanged`، `searchVehicles`، `searchCustomers`، `searchUsersWithDesignation`، `salesPersonSelected`، `searchStaff`، `searchSaleOrigin`، `endDateChanged`، `searchCustomerPopoup`، `searchDrivers`، `searchSupplierContact`، `searchDriverPopoup`، `searchSupplierPopoup`، `driverChargesPopoup`، `clearAdditionalDriver`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `tariffCardChanged`، `vehicleSelected`، `changesRegardingQuotationCharges`، `quotationSelected`، `splitChargesForBroker`، `calculateCount`، `openExpiredDocAndOutStandingBalanceModal`، `getOutStandingBalance`، `changeTariffBasedOnCustomerCurrency`، `customerSelected`، `branchTaxCode`، `isBlackListedCustomerCheck`، `onCustomerSelect`، `commonDriverSearch`، `searchDrivers`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `getSaleOrders`، `saleOrderChanged`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `addExternalVehiclePopup`، `addExternalVehiclePopup`، `addSagX3Contact`، `save`، `cancel`، `unCheckAllCharges`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `totalDaysAndTime`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `complimentaryOnChange`، `rentOnChange`، `getAuthorizedUserName`، `amountChangedDeposit`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.workshop.jobEstimations.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.workshop.jobEstimations.createOrEditModal`: `localize`، `addJobDetail`، `addJobCharge`، `removeElementFromList`، `jobTypeOnChange`، `cancel`، `searchItems`، `branchTaxCode`، `customerSelected`، `openServiceItemsSelector`، `getServiceItems`، `calculateTax`، `calculateJobEstimationTotals`، `searchInsuranceCompany`، `getServicesByModel`، `calculateDiscountOnRow`، `getLabourTariffForJob`، `getLabourTariffForJobEdit`، `filterTariffLine`، `calculateItemPrice`، `itemSelected`، `calculateLabourCharges`، `calculateJobDetailTotals`، `calculateEstimationTotals`، `searchVehicles`، `searchVehiclePopup`، `searchCustomers`، `searchCustomerPopoup`، `getLabourActivitiesSearch`، `isTypeDuplicated`، `checkTypeDuplication`، `save`، `addExternalWorkshopVehiclePopup`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.workshop.jobEstimations.viewModal`: `cancel`، `localize`، `getlocalDateTime`، `getFaultValue`، `getJobTypeName`، `getInsuranceTypeName`.
- وحدة `tenant.views.workshop.Jobs.createOrEditModal`: `localize`، `addJobDetail`، `addJobCharge`، `removeElementFromList`، `jobTypeOnChange`، `cancel`، `searchItems`، `openServiceItemsSelector`، `getAdditionalFields`، `branchTaxCode`، `customerSelected`، `calculateItemPrice`، `calculateLabourCharges`، `calculateJobDetailTotals`، `calculateTax`، `calculateJobTotals`، `searchVehicles`، `searchVehiclePopup`، `searchCustomers`، `searchSalesPerson`، `round`، `calculateDiscountOnRow`، `getServiceItems`، `searchInsuranceCompany`، `getServicesByModel`، `getServicesByVehicleId`، `getLabourTariffForJob`، `filterTariffLine`، `searchCustomerPopoup`، `searchStaff`، `getLabourActivitiesSearch`، `isTypeDuplicated`، `showHideServiceAlert`، `checkTypeDuplication`، `checkChassisNo`، `save`، `addExternalWorkshopVehiclePopup`، `openItemRequisition`، `openItemReturn`، `openItemIssue`.
- وحدة `tenant.views.workshop.jobEstimations.jobLogModal`: `cancel`، `getlocalDateTime`، `getOriginalName`، `createLog`.
- وحدة `tenant.views.workshop.Jobs.createOrEditLubricationJobModal`: `cancel`، `searchItems`، `openServiceItemsSelector`، `customerSelected`، `searchVehicles`، `searchVehiclePopup`، `searchCustomers`، `round`، `searchCustomerPopoup`، `save`، `addVehicle`، `addNewItem`، `addJobCharge`، `removeElementFromList`، `selectedVehicle`، `addExternalWorkshopVehiclePopup`، `openItemRequisition`، `openItemReturn`، `openItemIssue`، `validateForm`.
- وحدة `tenant.views.workshop.jobs.editPurchaseOrderModel`: `cancel`، `save`، `searchLPONo`، `updatePO`.
- وحدة `tenant.views.workshop.Jobs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.workshop.jobs.gatePassModal`: `cancel`، `getFaultValue`، `getlocalDateTime`، `getDate`.
- وحدة `tenant.views.workshop.jobs.viewModal`: `cancel`، `getlocalDateTime`، `getAdditionalFields`، `getFaultValue`، `getJobTypeName`، `getInsuranceTypeName`، `viewRelatedEstimation`.
- وحدة `tenant.views.workshop.jobs.vehicleQualityCheckModal`: `cancel`، `getlocalDateTime`، `getOriginalName`، `uploadDocument`، `save`.
- وحدة `tenant.views.workshop.jobs.jobClosingModal`: `cancel`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `damageChargesChanged`، `save`، `sumCustomerAmount`، `sumInsuranceCompanyAmount`، `sumInsuranceTax`، `sumCustomerTax`.
- وحدة `tenant.views.workshop.jobs.jobTimeModal`: `cancel`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `damageChargesChanged`، `openjobLogModal`، `getEstimation`.
- وحدة `tenant.views.crs.lease.agreements.viewModal`: `getlocalDateTime`، `getlocalDate`، `localize`، `localizeChargesType`، `roundingforView`، `editMovement`، `getFuelLevel`، `viewMovement`، `openMovementLogsModal`، `viewContact`، `openMileageInfoModal`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `fetchParking`، `getClauses`، `cancel`، `viewInvoice`.
- وحدة `tenant.views.crs.lease.agreements.createOrEditModal`: `openExpiredDocAndOutStandingBalanceModal`، `addProvisionRow`، `addPreTerminationRuleRow`، `clearAdditionalDriver`، `searchGoogleLocations`، `searchUsersWithDesignation`، `salesPersonSelected`، `calculateCount`، `applyDiscount`، `disableRate`، `removeProvisionRow`، `removePreTerminationRuleRow`، `addClauseRow`، `addClauses`، `removeClauseRow`، `noOfMonthsChange`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `localize`، `localizeChargesType`، `driverChargesPopoup`، `startDateChanged`، `searchAdditionalDrivers`، `searchStaff`، `agreementTypeSelected`، `endDateChanged`، `searchVehicles`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDriverPopoup`، `vehicleSelected`، `customerSelected`، `branchTaxCode`، `branchTaxCodeForMasterAgreement`، `searchSaleOrders`، `commonDriverSearch`، `searchDrivers`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `addSagX3Contact`، `save`، `cancel`، `tariffOptionSelected`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `getClauses`، `firstNextButton`، `secondNextButton`، `thiredNextButton`، `secondTabPreviousButton`، `thiredTabPreviousButton`، `fourthTabPreviousButton`، `checkProvisionsRowEmpty`، `checkClausesRowEmpty`، `preTermValid`، `firstNextButton`، `secondNextButton`، `thiredNextButton`، `secondScreenPreviousButton`، `thiredScreenPreviousButton`، `fourthScreenPreviousButton`.
- وحدة `tenant.views.crs.limousine.trips.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.limousine.trips.createOrEditModal`: `rounding`، `getTripStatus`، `searchModel`، `externalVehicleSelected`، `onKMsChange`، `vehicleSelected`، `driverSelected`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `trustSrc`، `branchTaxCode`، `customerSelected`، `loadContactPerson`، `loadContactPersonForEdit`، `invoiceSelected`، `removeDriver`، `clearAdditionalDriver`، `searchVehiclePopup`، `selectChauffeurPopup`، `tripTypeSelected`، `tripTypesFilter`، `getlocalDateTime`، `getlocalTime`، `pickupDateTimeChanged`، `dropOffDateTimeChanged`، `swapLocations`، `cancel`، `searchCustomers`، `searchSuppliers`، `searchCustomLookup`، `searchDrivers`، `openMapUrl`، `searchLocations`، `searchVehicles`، `tariffGroupChanged`، `pickupLocationSelected`، `dropOffLocationSelected`، `uploadDocument`، `getOriginalName`، `removeDocument`، `taxCategoryChanged`، `emptyDropOffTime`، `emptyPickUpTime`، `clearIfPlaceholder`، `changeCharges`، `searchInvoicePopoup`، `searchCustomerPopoup`، `saveAndPrint`، `checkNoOfTrips`، `saveTrip`، `save`، `resetFields`.
- وحدة `tenant.views.crs.limousine.trips.dispatchTripModal`: `searchVehicles`، `searchDrivers`، `cancel`، `vehicleSelected`، `driverSelected`، `selectChauffeurPopup`، `save`.
- وحدة `tenant.views.crs.limousine.trips.viewTripModal`: `locationPermission`، `showDispatchButton`، `dispatchTrip`، `getTripStatus`، `getTaxCategory`، `trustSrc`، `getlocalDateTime`، `getlocalTime`، `cancel`، `getOriginalName`، `openMapUrl`، `viewCharges`، `viewLimoInvoice`، `getChecklist`، `loadContactPersonForEdit`.
- وحدة `tenant.views.crs.limousine.trips.startTripModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.limousine.trips.finishTripModal`: `rounding`، `dropOffDateTimeChanged`، `changeCharges`، `onKMsChange`، `cancel`، `save`.
- وحدة `tenant.views.crs.limousine.trips.logTripModal`: `cancel`، `getlocalDateTime`، `createLog`.
- وحدة `tenant.views.crs.limousine.trips.updateChargesModal`: `cancel`، `getlocalDateTime`، `sumCharges`، `localize`، `save`.
- وحدة `tenant.views.crs.dashboard.transactionPassword`: `cancel`، `save`.
- وحدة `tenant.views.crs.companies.createOrEditModal`: `getCardType`، `getlocalDate`، `localize`، `getlocalDateTime`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `addCreditCardRow`، `addDriverRow`، `updateCreditCardRow`، `removeRow`، `searchContacts`، `showAddContact`، `removeRowContact`، `save`، `cancel`، `addContactPersonsRow`، `changeDesignation`، `removeContactPersonsRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `doesIdentityDoucmentExist`، `openUploadDocument`، `addIndentityDocument`، `addMandatoryDesignations`، `isCompanyVerifiedChange`، `removeIndentityDocument`، `maskCreditCard`، `removeDoc`، `getIdentificationDocumentType`، `searchCountries`، `getTariffCards`، `getTariffCardForCompany`، `isDocument`، `getDesignations`، `isFieldMondatoryForSalesPerson`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `onOverRideChange`، `getAdvanceSettings`، `getIndustries`، `getCompanyCustomField1`، `getCompanyCustomField2`، `getHighLightBlackListCountries`، `getCompanyCustomField3`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.createOrEditModal`: `searchModel`، `rounding`، `roundingforView`، `searchVehicles`، `searchSupplier`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `onSupplierSelect`، `searchJobs`، `onJobSelectedForVoucherline`، `openJobVehicleModal`، `addRow`، `removeRow`، `changeTaxOnSupplier`، `calculateTaxPerRow`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `sumAmount`، `sumAmountTax`، `getOriginalName`، `multiLevelApprovePurchaseRequest`، `approvePurchaseRequest`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploadDocument`، `removeDocument`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.approvalModal`: `canApproveOrReject`، `canApproveOrRejectColumnWise`، `approveRow`، `rejectRow`، `cancel`، `rounding`، `getlocalDate`، `localize`.
- وحدة `tenant.views.common.approval.approvalModal`: `getRoleByUserId`، `convertTemptoUserInBranch`، `canApproveOrReject`، `canApproveOrRejectColumnWise`، `approveRow`، `rejectRow`، `cancel`، `rounding`، `getSources`، `getlocalDate`، `localize`، `getStatus`، `getRoles`، `getRole`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`: `getWorkTypeText`، `supplierSelected`، `rounding`، `roundingforView`، `openJobVehicleModal`، `searchVehicles`، `searchSupplier`، `purchaseAndSalesHistoryModel`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `clearOrder`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `searchMasterAgreement`، `sumAmount`، `sumAmountTax`، `searchItems`، `pOUnitPriceBasedOnLastSupplier`، `calculateItemPrice`، `getUnitOfMeasures`، `searchJobs`، `onItemSelected`، `onJobSelectedForVoucherline`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `cancel`، `searchModel`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.jvs.createOrEditModal`: `rounding`، `roundingforView`، `searchAccounts`، `searchContact`، `uploadDocument`، `getOriginalName`، `accountChanged`، `searchPrepaidExpense`، `isStockAccount`، `productSelected`، `searchVehicles`، `searchItems`، `searchJobs`، `searchAgreements`، `searchMasterAgreement`، `considerTaxAsTaxPercentage`، `sumAmount`، `sumAmountExcel`، `sumAmountBeforeSaving`، `getlocalDate`، `addRow`، `removeRow`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `isbranchNull`، `isdateNull`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.receipts.viewModal`: `billingMethodSelected`، `uploadDocument`، `receiptTypeChanged`، `searchAccounts`، `roundingforView`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `sumAmountAllocationCharges`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `searchVehicles`، `onCustomerSelect`، `sumReceiptAmount`، `sumAmount`، `accountChangedGeneralPayment`، `openprintModal`، `getOriginalName`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.bills.viewModal`: `rounding`، `searchContactGeneralPayment`، `getTaxCategoryName`، `getOriginalName`، `roundingforView`، `uploadDocument`، `accountChanged`، `getlocalDate`، `searchAdditionalDriverPopoup`، `taxAcceptedChanged`، `calculateTaxPerRow`، `sumAmount`، `sumAmountTax`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchJobs`، `clearBill`، `removeDocument`، `cancel`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `getStockGrnByRefNo`، `getAssetGrnByRefNo`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.vouchers.bills.createOrEditModal`: `rounding`، `searchContactGeneralPayment`، `taxCategoryChanged`، `getOriginalName`، `uploadDocument`، `accountChanged`، `getlocalDate`، `onCustomerSelect`، `searchContact`، `searchAssignToEmployeePopoup`، `searchAdditionalDriverPopoup`، `calculateCreditAndTax`، `onSupplierSelect`، `calculateCreditAndTaxFromExcel`، `openLoanPaymentModal`، `taxAcceptedChanged`، `searchAgreements`، `considerTaxAsTaxPercentage`، `calculateTaxPerRowForImport`، `branchTaxCode`، `changeTaxOnSupplier`، `calculateTaxPerRow`، `sumAmount`، `sumAmountExcel`، `sumAmountTax`، `sumAmountGrn`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchVehicles`، `searchJobs`، `onItemSelected`، `searchMasterAgreement`، `searchSupplierPopoup`، `searchSupplierAndCustomerPopoup`، `searchVehiclePopup`، `getStockGrnBySupplierId`، `getAssetGrnBySupplierId`، `applyChangeToAll`، `applyChange`، `addRow`، `removeRow`، `clearBill`، `onVehicleChange`، `removeDocument`، `cancel`، `loanOptionSelected`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploaderAssetBillRows.onSuccessItem`، `uploaderAssetBillRows.onErrorItem`، `saveGrnBill`، `searchModel`، `save`.
- وحدة `tenant.views.crs.vouchers.payments.viewModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `roundingforView`، `localize`، `getOriginalName`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `paymentTypeChanged`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchContact`، `searchAccounts`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `sumAmountAllocation`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `payrollTypes`، `getDepartmentName`، `addRow`، `cancel`، `checkCurrentDate`، `viewPayrollById`، `loadCostCenterInLine`.
- وحدة `tenant.views.crs.vouchers.payments.createOrEditModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `localize`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `getOriginalName`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `paymentTypeChanged`، `accountChanged`، `accountChangedForImport`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchAgreements`، `searchContactForSubLookUp`، `searchContact`، `onPaidToSelect`، `searchAssignToEmployeePopoup`، `searchAccounts`، `getPayrolls`، `filterPayrolls`، `onBusinessUnitChange`، `onPayrollChange`، `viewPayrollById`، `openAdvanceOrLoanPaymentModal`، `updateAmountFromPayroll`، `payrollTypes`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `currencyCodeChangedOnPaymentMethod`، `sumAmountAllocation`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `addRow`، `removeRow`، `cancel`، `save`، `removeDocument`، `checkCurrentDate`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `loadCostCenterInLine`.
- وحدة `tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal`: `rounding`، `localize`، `getPeriodType`، `getRateType`، `vehicleTypeChanged`، `roundingforView`، `quotationTypeChanged`، `calculationDetail`، `calculationDetailView`، `qunatityChanged`، `calculate`، `modelSelected`، `searchContact`، `searchContactPerson`، `customerChanged`، `searchContactPopoup`، `searchModel`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `cancel`، `getcostingParameters`، `save`.
- وحدة `tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote`: `localize`، `rounding`، `getlocalDateTime`، `getlocalDate`، `cancel`، `uploadDocument`، `getOriginalName`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModal`: `localize`، `currencyAndRoundingWithThree`، `rounding`، `customerSettings`، `uploadDocument`، `getOriginalName`، `getAmountInWords`، `moduleChanged`، `isCounterReceivableCreditNote`، `isAssetSaleInvoice`، `showAllocation`، `onAllocationAmountChanged`، `canEditAllocatedAmount`، `onAssetSalesInvoiceOnlyChanged`، `isAssetSalesInvoiceEdit`، `sumAmountAllocation`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `getlocalDateTime`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchCustomerPopoup`، `manuallyAllocatedPopup`، `save`، `removeDocument`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount`: `localize`، `rounding`، `searchAgreements`، `onAgreementSelection`، `uploadDocument`، `getOriginalName`، `sumAmountAllocation`، `currencyAndRoundingWithThree`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `moduleChanged`، `getlocalDateTime`، `getlocalDate`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchJobs`، `searchContact`، `searchVehicles`، `searchCustomerPopoup`، `searchAccounts`، `save`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `removeDocument`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `addRow`، `removeRow`، `sumAmountTax`، `accountChanged`، `calculateTaxPerRow`، `calculateDebitAndTax`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote`: `localize`، `rounding`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTax`، `onCustomerSelect`، `invoiceSelected`، `getlocalDateTime`، `getlocalDate`، `searchCustomers`، `searchContact`، `searchCustomerPopoup`، `sumAmount`، `searchInvoices`، `searchDeliveryNotes`، `getHourlyRate`، `uploadDocument`، `getOriginalName`، `save`، `removeDocument`، `cancel`، `addRow`، `removeRow`.
- وحدة `tenant.views.crs.vouchers.debitNotes.createOrEditModal`: `localize`، `rounding`، `agreementChanged`، `cancel`، `customerSettings`، `roundingforView`، `CurrencyFormate`، `sumAmount`، `taxAcceptedChanged`، `addRow`، `removeRow`، `uploadDocument`، `getOriginalName`، `removeDocument`، `onCustomerSelect`، `moduleChanged`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchAccounts`، `searchVehicles`، `searchCustomerPopoup`، `getlocalDateTime`، `sumAmountAllocation`، `save`، `localize`.
- وحدة `tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal`: `onAgreementSelection`، `localize`، `rounding`، `agreementChanged`، `cancel`، `customerSettings`، `roundingforView`، `CurrencyFormate`، `GetCostCenterName`، `searchAgreements`، `calculateCreditAndTax`، `onTaxChange`، `sumAmountTaxEditable`، `sumAmount`، `taxAcceptedChanged`، `addRow`، `removeRow`، `branchTaxCode`، `onCustomerSelect`، `moduleChanged`، `searchCustomers`، `searchAccounts`، `searchVehicles`، `searchCustomerPopoup`، `getlocalDateTime`، `sumAmountAllocation`، `searchPrepaidExpense`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `localize`، `uploader.onSuccessItem`، `uploader.onErrorItem`.
- وحدة `tenant.views.crs.rental.quotations.viewModal`: `rounding`، `localize`، `currencyAndRoundingWithThree`، `roundingforView`، `getPeriodType`، `getRateType`، `getTariffGroups`، `getStatus`، `cancel`، `calculateTaxForShow`، `lineCalc`.
- وحدة `tenant.views.crs.rental.quotations.createOrEditQuotationModal`: `rounding`، `searchSalesPersons`، `taxAcceptedChanged`، `searchSalesPersonPopoup`، `salesPersonSelected`، `localize`، `isdateNull`، `getPeriodType`، `getRateType`، `vehicleTypeChanged`، `loadandApplyTariffToAllLines`، `loadandApplyTariff`، `calculateTax`، `calculateTaxForShow`، `applyTariff`، `quotationTypeChanged`، `lineCalc`، `calculationDetail`، `calculationDetailView`، `searchContact`، `branchTaxCode`، `customerChanged`، `searchContactPopoup`، `modelSelected`، `vehicleTypeChanged`، `searchModel`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `cancel`، `calculateCharges`، `save`.
- وحدة `tenant.views.crs.rental.masterAgreements.masterAgreementModal`: `rounding`، `localize`، `cancel`، `getlocalDate`، `getAgreementStatus`، `lineWiseMonthsList`، `openViewAgreementModal`، `periodChanged`، `addAgreementUnderMasterAgreement`، `save`.
- وحدة `tenant.views.crs.lease.masterAgreements.masterAgreementModal`: `rounding`، `localize`، `searchContact`، `CurrencyFormate`، `searchContactPopoup`، `searchModel`، `getStatus`، `modelSelected`، `periodChanged`، `addRow`، `removeRow`، `calculationDetail`، `calculationDetailView`، `cancel`، `calculate`، `sum`، `getcostingParameters`، `addAgreementUnderMasterAgreement`.
- وحدة `tenant.views.crs.lease.masterAgreements.masterAgreementModal`: `rounding`، `localize`، `cancel`، `getlocalDate`، `getAgreementStatus`، `lineWiseMonthsList`، `openViewAgreementModal`، `periodChanged`، `addAgreementUnderMasterAgreement`، `save`.
- وحدة `tenant.views.crs.assets.assets.viewModal`: `rounding`، `getlocalDateTime`، `getLocationName`، `getLocationNameTwo`، `uploadDocument`، `isDocument`، `getCostCenterGroup`، `getOriginalName`، `cancel`، `depreciationPopUp`، `changeSalePriceByUser`، `viewAsset`.
- وحدة `tenant.views.crs.assets.assets.disposalApprovalModal`: `rounding`، `getlocalDateTime`، `isDocument`، `getDisposalType`، `getOriginalName`، `cancel`، `depreciationPopUp`، `changeSalePriceByUser`، `getRoleByUserId`، `getRoles`، `getRole`، `canApproveOrRejectColumnWise`، `canApproveOrReject`، `approveRow`، `save`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.crs.vouchers.deposits.viewModal`: `localize`، `cancel`، `getTypeById`، `roundingforView`، `useDeposit`، `getOriginalName`، `getExpiryOrDays`، `openUseDeposit`، `openRefundDeposit`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.agreements.printtemplates.printReplacementPreview`: `getFuelLevel`، `getlocalDateTime`، `getlocalDate`، `cancel`، `getChecklist`.
- وحدة `tenant.views.crs.vouchers.invoices.viewModal`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `roundingforView`، `uploadDocument`، `getOriginalName`، `sumPerTrip`، `moduleChanged`، `sumTaxPerTrip`، `openViewAllocationsModal`.
- وحدة `tenant.views.mcc.movements.movementLogsModal`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.vehicles.viewModal`: `getlocalDateTime`، `getVehicleExternalType`، `getChassisType`، `getVehicleWarrantyType`، `getWarrantyPeriod`، `getCostCenterGroup`، `getFuelLevel`، `openPrintModal`، `searchModel`، `getMovementStatus`، `viewMovement`، `searchTariffGroups`، `cancel`، `isAdditionalFieldsEnabled`، `isFieldMondatory`، `typeOfFeild`، `getAdvanceSettings`، `isDocument`، `isDocumentSepr`.
- وحدة `tenant.views.movements.editModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `save`.
- وحدة `tenant.views.crs.agreements.tollsDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.darbsDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.parkingDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.finesDetailModal`: `getlocalDateTime`، `ignoreFine`، `cancel`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.invoices.generateFineModal`: `getlocalDateTime`، `allBoxTicked`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `cancel`، `searchFines`، `getlocalDate`، `showFinesOnVehicleReplacement`، `ignoreFine`، `generateInvoice`، `addMissingFine`، `callbackOnComplete`، `showError`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `ok`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.vehicles.updateMileageAlertModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.agreements.expiredDocOutStandingBalanceModal`: `getlocalDate`، `cancel`، `rounding`، `getDocumentType`.
- وحدة `tenant.views.crs.vehicles.addExternalVehicle`: `localize`، `cancel`، `searchModel`، `getTeriffGroups`، `searchSupplier`، `save`.
- وحدة `tenant.views.crs.contacts.searchContactOptionModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.contacts.searchSagX3ContactModal`: `searchContacts`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.agreements.driverChargesModal`: `boxTicked`، `cancel`، `applyChange`، `saveDriverCharges`.
- وحدة `tenant.views.common.authorizationCodes.verifyAuthCodeModal`: `cancel`، `rounding`، `verify`.
- وحدة `tenant.views.crs.agreements.agreementAdvanceAndDeposit`: `uploadDocument`، `uploadAdvanceDocument`، `removeDocument`، `removeAdvanceDocument`، `getOriginalName`، `amountChanged`، `amountChangedDeposit`، `customerCurrencyChanged`، `amountWithoutCommissionChanged`، `cancel`، `calculateCreditCardCommission`، `conversionRateChanged`، `onCustomerSelect`، `ok`، `dateNullOrNot`.
- وحدة `tenant.views.crs.agreements.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.workshop.serviceItems.serviceItemsSelectorModal`: `selectionCommit`، `selectAllChange`، `cancel`.
- وحدة `tenant.views.crs.vehicles.addExternalWorkshopVehicle`: `localize`، `cancel`، `searchModel`، `getTariffGroups`، `save`.
- وحدة `tenant.views.crs.vehicles.createOrEditModal`: `removeImage`، `warrantyPeriodSelection`، `getCostCenterGroup`، `removeRow`، `addRow`، `isVehicleExternalType`، `removewarrantyRow`، `addwarrantyRow`، `searchMake`، `searchModel`، `searchOwner`، `cancel`، `vehicleInsuranceDateAdd`، `vehicleRegistrationDateAdd`، `createMake`، `createVehicleModel`، `locationPermission`، `getTeriffGroups`، `getSourceCode`، `getCostCenters`، `GetTypeOrOwnership`، `openUploadDocument`، `save`، `removeDocuments`، `openUploadDocumentModel`، `removeDocument`، `isDocument`، `isDocumentSepr`، `isAdditionalFieldsEnabled`، `isFieldMondatory`، `typeOfFeild`، `getAdvanceSettings`، `getInsuranceCompanies`، `getPlateNo`.
- وحدة `tenant.views.stock.requisitions.createOrEditModal`: `getJobType`، `jobSelected`، `cancel`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `save`.
- وحدة `tenant.views.stock.itemReturns.createOrEditModal`: `cancel`، `jobSelected`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `tenant.views.stock.itemIssues.createOrEditModal`: `jobSelected`، `cancel`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `tenant.views.workshop.jobEstimations.createLogModal`: `cancel`، `getlocalDateTime`، `getOriginalName`، `uploadDocument`، `save`.
- وحدة `tenant.views.common.supportRequests.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.workshop.jobs.jobLogModal`: `cancel`، `removeRow`، `deleteRow`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `getJobChargeTimeLogs`، `calculateTotalMinutes`، `save`.
- وحدة `tenant.views.crs.lease.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.limousine.trips.selectChauffeurModal`: `getChauffeurQueue`، `changeBranchDriver`، `redButtonClicked`، `openViewTripModal`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.limousine.trips.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.changeChargesModal`: `cancel`، `rounding`، `taxCategoryChanged`، `onChangeTaxCategory`، `sumCharges`، `sumChargesTax`، `calculateCharges`، `calculateDiscountCharges`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `calculationDetail`، `getlocalDateTime`، `markManualCharges`، `localize`، `save`، `showCalculationDetail`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditLimoModal`: `rounding`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `localize`، `rounding`، `editTripChargesModal`، `branchTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `calculateTaxPerRow`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `getlocalDateTime`، `addLimoRow`، `searchAndAddMultipleTrips`، `uploadDocument`، `getOriginalName`، `searchTrips`، `tripSelected`، `removeLimoRow`، `searchCustomers`، `searchVehicles`، `searchCustomerPopoup`، `setTaxPercentOnTaxCode`، `onCustomerSelect`، `save`، `removeDocument`، `normalizeTripCharges`.
- وحدة `tenant.views.crs.limousine.trips.createLogModal`: `cancel`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.companies.createOrUpdateDriverModal`: `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `getDocsByContactId`، `searchCustomLookup`، `scanDocument`، `openUploadDocument`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `searchCountries`، `searchCompany`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `isDocument`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `getAdvanceSettings`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.crs.vouchers.bills.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.common.approval.rejectionReason`: `getlocalDate`، `localize`، `saveRejectionReason`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `getPurchaseHistory`، `customFilter`، `getSaleHistory`، `openprintModal`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.jvs.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.jvs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.jvs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.
- وحدة `tenant.views.crs.vouchers.bills.loanPaymentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `addRow`، `removeRow`، `chequeNoChanged`، `prepareInstallments`، `interestChanged`، `emiChanged`، `dateChanged`، `downpaymentChanged`، `interestAmountChanged`، `searchSupplier`، `searchSupplierPopoup`، `cancel`، `save`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `calculateCreditAndTax`، `sumAmountTax`، `sumAmount`.
- وحدة `tenant.views.crs.vouchers.bills.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.payments.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.hrm.payrolls.viewModal`: `showSalaryType`، `cancel`، `rounding`.
- وحدة `tenant.views.common.hrm.deduction.createOrEditModal`: `cancel`، `getLocalize`، `searchStaff`، `searchVoucher`، `onVoucherSelect`، `rounding`، `getStatusTypes`، `getDeductionEmiStatus`، `searchStaffPopoup`، `onStaffSelect`، `opendeductionLineModal`، `save`.
- وحدة `tenant.views.crs.vouchers.payments.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail`: `includedChanged`، `localize`، `CurrencyFormate`، `currencyAndRounding`، `calculateEmi`، `ok`، `cancel`، `modelSelected`.
- وحدة `tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal`: `searchAccounts`، `rounding`، `sumAmount`، `searchRentalOrLeaseAgreement`، `cancel`، `localize`، `addRow`، `removeRow`، `save`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal`: `cancel`، `saveAllocateCharges`، `rounding`، `changeAllocateAmount`.
- وحدة `tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.rental.quotations.calculationDetail`: `disableRate`، `tariffOptionSelected`، `includedChanged`، `includedChanged`، `localize`، `calculate`، `calculateTax`، `taxAcceptedChanged`، `cancel`.
- وحدة `tenant.views.crs.rental.quotations.viewCalculationDetail`: `localize`، `cancel`.
- وحدة `tenant.views.crs.agreements.createOrEditModalForMaster`: `getlocalDateTime`، `isQuotationMandatory`، `getDateTariffCard`، `searchGoogleLocations`، `agreementTypeChange`، `openAdvanceAgreementCreation`، `sumAmountReceipt`، `openDepositAgreementCreation`، `sumDepositAmountReceipt`، `getTariffCards`، `localize`، `localizeChargesType`، `startDateChanged`، `applyDiscount`، `agreementTypeSelected`، `endDateChanged`، `searchVehicles`، `searchCustomers`، `searchStaff`، `searchCustomerPopoup`، `searchDrivers`، `searchSupplierContact`، `searchDriverPopoup`، `searchSupplierPopoup`، `driverChargesPopoup`، `clearAdditionalDriver`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `tariffCardChanged`، `changePermanentVehicle`، `vehicleSelected`، `changesRegardingQuotationCharges`، `quotationSelected`، `customerSelected`، `branchTaxCode`، `commonDriverSearch`، `searchDrivers`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `getSaleOrders`، `saleOrderChanged`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `addExternalVehiclePopup`، `addExternalVehiclePopup`، `disableRateRow`، `addSagX3Contact`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `round`، `getCustomerDiscount`، `calculate`، `alert`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `totalDaysAndTime`.
- وحدة `tenant.views.crs.lease.leaseQuotations.calculationDetail`: `includedChanged`، `localize`، `calculate`، `cancel`.
- وحدة `tenant.views.crs.assets.assets.depreciationDetailModal`: `CurrencyFormate`، `ConvertToNumFormate`، `getlocalDateTime`، `cancel`، `getlocalDateTimeShort`.
- وحدة `tenant.views.crs.vouchers.deposits.allocationForDeposit`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `rounding`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.editAllocationForDeposit`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.editAllocationForDeposit2`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `addChargesType`، `addInHeadRow`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.allocationForDeposit2`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `rounding`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`، `addChargesType`، `addInHeadRow`.
- وحدة `tenant.views.crs.vouchers.deposits.depositRefund`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vehicles.printDocumentModel`: `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.addMissingFineModal`: `clearCustomer`، `searchVehicles`، `vehicleChanged`، `localize`، `searchCustomers`، `searchCustomerPopoup`، `save`، `cancel`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.
- وحدة `tenant.views.common.makes.createOrEditModal`: `save`، `cancel`.
- وحدة `tenant.views.common.vehiclemodels.createOrEditModal`: `searchMake`، `save`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal`: `ok`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal`: `rounding`، `calculateTotalFare`، `calculateChargesPerRow`، `localize`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.changeChargesModal`: `cancel`، `rounding`، `sumChargesTax`، `calculateTaxPerRow`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.searchTripModal`: `searchTrips`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal`: `cancel`، `getlocalDateTime`، `applyChange`، `save`، `getTrips`.
- وحدة `tenant.views.crs.vouchers.invoices.printTemplates.printPreview`: `exportToPDF`، `exportToWord`، `exportPrintToWord`، `cancel`، `ok`، `getTemplateUrl`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.common.hrm.deduction.deductionPayrollLineModal`: `searchReceiptVoucher`، `onVoucherKeyPress`، `getlocalDate`، `save`، `cancel`.
- وحدة `tenant.views.mcc.dashboard.index`: `selectVehilceHandler`، `getVehiclesSummary`، `getAgreementsSummary`، `selectLimousineHandler`، `getLimousineSummary`، `getApprovalLinesCount`، `selectApprovalsHandlerSummary`، `getApprovalsSummaryForNotifications`.
- وحدة `tenant.views.limo.dashboard.index`: `ownershipFilterChanged`، `getlocalDate`، `getVehiclesSummary`، `getTripsSummary`، `getVehicleSummaryNrm`، `getVehicleSummaryWorkShop`، `selectVehilceHandler`.
- وحدة `tenant.views.transportation.dashboard.index`: `ownershipFilterChanged`، `getlocalDate`، `getVehiclesSummary`، `getTransportationSummary`، `getVehicleSummaryNrm`، `getVehicleSummaryWorkShop`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.getVehiclesSummary` | POST | api/services/app/vehicle/GetVehiclesSummary | [المصدر](../../../raw/application.js#L198933) |
| `abp.services.app.vehicle.getVehiclesSummaryIdle` | POST | api/services/app/vehicle/GetVehiclesSummaryIdle | [المصدر](../../../raw/application.js#L198958) |
| `abp.services.app.vehicle.getVehiclesSummaryIdleBranchWise` | POST | api/services/app/vehicle/GetVehiclesSummaryIdleBranchWise | [المصدر](../../../raw/application.js#L198966) |
| `abp.services.app.bookingSearch.getBookingsSummary` | POST | api/services/app/bookingSearch/GetBookingsSummary | [المصدر](../../../raw/application.js#L198989) |
| `abp.services.app.rentalAgreementSearch.getAgreementsSummary` | POST | api/services/app/rentalAgreementSearch/GetAgreementsSummary | [المصدر](../../../raw/application.js#L199002) |
| `abp.services.app.leaseAgreementSearch.getAgreementsSummary` | POST | api/services/app/leaseAgreementSearch/GetAgreementsSummary | [المصدر](../../../raw/application.js#L199017) |
| `abp.services.app.leaseAgreementSearch.getOpenLeaseAgreementsSummary` | POST | api/services/app/leaseAgreementSearch/GetOpenLeaseAgreementsSummary | [المصدر](../../../raw/application.js#L199030) |
| `abp.services.app.vehicle.getLeaseVehiclesCount` | POST | api/services/app/vehicle/GetLeaseVehiclesCount | [المصدر](../../../raw/application.js#L199043) |
| `abp.services.app.limoTripSearch.getTripsSummaryOnDashBoard` | POST | api/services/app/limoTripSearch/GetTripsSummaryOnDashBoard | [المصدر](../../../raw/application.js#L445761) |
| `abp.services.app.job.getJobsSummary` | POST | api/services/app/job/GetJobsSummary | [المصدر](../../../raw/application.js#L199066) |
| `abp.services.app.jobEstimation.getJobEstimationsUnApproved` | POST | api/services/app/jobEstimation/GetJobEstimationsUnApproved | [المصدر](../../../raw/application.js#L199072) |
| `abp.services.app.rentalAgreementSearch.getOpenRentalAgreementsSummary` | POST | api/services/app/rentalAgreementSearch/GetOpenRentalAgreementsSummary | [المصدر](../../../raw/application.js#L199080) |
| `abp.services.app.vehicle.getRentalVehiclesCount` | POST | api/services/app/vehicle/GetRentalVehiclesCount | [المصدر](../../../raw/application.js#L199095) |
| `abp.services.app.vehicle.getVehiclesSummaryByType` | POST | api/services/app/vehicle/GetVehiclesSummaryByType | [المصدر](../../../raw/application.js#L199309) |
| `abp.services.app.vehicle.getOpenTripVehiclesDashboardCount` | POST | api/services/app/vehicle/GetOpenTripVehiclesDashboardCount | [المصدر](../../../raw/application.js#L199315) |
| `abp.services.app.vehicle.getHiredVehicleSummaryByType` | POST | api/services/app/vehicle/GetHiredVehicleSummaryByType | [المصدر](../../../raw/application.js#L199321) |
| `abp.services.app.vehicle.getVehicleSummaryNrm` | POST | api/services/app/vehicle/GetVehicleSummaryNrm | [المصدر](../../../raw/application.js#L300371) |
| `abp.services.app.vehicle.getVehicleSummaryWorkShop` | POST | api/services/app/vehicle/GetVehicleSummaryWorkShop | [المصدر](../../../raw/application.js#L300378) |
| `abp.services.app.vehicle.getHiredVehiclesSummary` | POST | api/services/app/vehicle/GetHiredVehiclesSummary | [المصدر](../../../raw/application.js#L199345) |
| `abp.services.app.customerRequest.getCustomerRequestsSummary` | POST | api/services/app/customerRequest/GetCustomerRequestsSummary | [المصدر](../../../raw/application.js#L199354) |
| `abp.services.app.saleOrder.getAgreementsExpiringSaleOrderCount` | POST | api/services/app/saleOrder/GetAgreementsExpiringSaleOrderCount | [المصدر](../../../raw/application.js#L199715) |
| `abp.services.app.documentsEmail.getCustomersByExpiredDocumentsCount` | POST | api/services/app/documentsEmail/GetCustomersByExpiredDocumentsCount | [المصدر](../../../raw/application.js#L199721) |
| `abp.services.app.approval.getDueApprovalsSummary` | POST | api/services/app/approval/GetDueApprovalsSummary | [المصدر](../../../raw/application.js#L445830) |
| `abp.services.app.movement.getLastStatusChangedMovementId` | POST | api/services/app/movement/GetLastStatusChangedMovementId | [المصدر](../../../raw/application.js#L200072) |
| `abp.services.app.vehicle.getOpenTripVehiclesDashboard` | POST | api/services/app/vehicle/GetOpenTripVehiclesDashboard | [المصدر](../../../raw/application.js#L311748) |
| `abp.services.app.vehicle.getBookedVehiclesDashboard` | POST | api/services/app/vehicle/GetBookedVehiclesDashboard | [المصدر](../../../raw/application.js#L311744) |
| `abp.services.app.vehicle.getVehiclesDashboardReplacementToday` | POST | api/services/app/vehicle/getVehiclesDashboardReplacementToday | [المصدر](../../../raw/application.js#L311752) |
| `abp.services.app.vehicle.getVehiclesDashboard` | POST | api/services/app/vehicle/GetVehiclesDashboard | [المصدر](../../../raw/application.js#L311755) |
| `abp.services.app.vehicle.getVehicles` | POST | api/services/app/vehicle/GetVehicles | [المصدر](../../../raw/application.js#L311756) |
| `abp.services.app.vehicle.exportToExcelOpenTripDashBoardCrs` | POST | api/services/app/vehicle/ExportToExcelOpenTripDashBoardCrs | [المصدر](../../../raw/application.js#L311819) |
| `abp.services.app.vehicle.exportToExcelReplacementTodayDashBoardCrs` | POST | api/services/app/vehicle/ExportToExcelReplacementTodayDashBoardCrs | [المصدر](../../../raw/application.js#L311823) |
| `abp.services.app.vehicle.exportToExcelDashBoardCrs` | POST | api/services/app/vehicle/ExportToExcelDashBoardCrs | [المصدر](../../../raw/application.js#L311825) |
| `abp.services.app.vehicle.exportToExcelDashBoard` | POST | api/services/app/vehicle/ExportToExcelDashBoard | [المصدر](../../../raw/application.js#L311826) |
| `abp.services.app.bookingSearch.getDueBookings` | POST | api/services/app/bookingSearch/GetDueBookings | [المصدر](../../../raw/application.js#L173822) |
| `abp.services.app.bookingSearch.getOverDueBookings` | POST | api/services/app/bookingSearch/GetOverDueBookings | [المصدر](../../../raw/application.js#L173947) |
| `abp.services.app.bookingSearch.getBookings` | POST | api/services/app/bookingSearch/GetBookings | [المصدر](../../../raw/application.js#L173958) |
| `abp.services.app.rentalAgreementSearch.getDueAgreements` | POST | api/services/app/rentalAgreementSearch/GetDueAgreements | [المصدر](../../../raw/application.js#L144592) |
| `abp.services.app.agreement.deleteAgreement` | POST | api/services/app/agreement/DeleteAgreement | [المصدر](../../../raw/application.js#L144842) |
| `abp.services.app.rentalAgreementSearch.agreementsGridView` | POST | api/services/app/rentalAgreementSearch/AgreementsGridView | [المصدر](../../../raw/application.js#L145337) |
| `abp.services.app.rentalAgreementSearch.getOverDueAgreements` | POST | api/services/app/rentalAgreementSearch/GetOverDueAgreements | [المصدر](../../../raw/application.js#L145277) |
| `abp.services.app.rentalAgreementSearch.getClosedTodayAgreements` | POST | api/services/app/rentalAgreementSearch/GetClosedTodayAgreements | [المصدر](../../../raw/application.js#L145292) |
| `abp.services.app.rentalAgreementSearch.getPreClosedAgreements` | POST | api/services/app/rentalAgreementSearch/GetPreClosedAgreements | [المصدر](../../../raw/application.js#L145307) |
| `abp.services.app.commonAgreement.getAgreements` | POST | api/services/app/commonAgreement/GetAgreements | [المصدر](../../../raw/application.js#L145328) |
| `abp.services.app.rentalAgreementExport.exportToExcelOverdueClosing` | POST | api/services/app/rentalAgreementExport/ExportToExcelOverdueClosing | [المصدر](../../../raw/application.js#L145379) |
| `abp.services.app.rentalAgreementExport.exportToExcelDue` | POST | api/services/app/rentalAgreementExport/ExportToExcelDue | [المصدر](../../../raw/application.js#L145399) |
| `abp.services.app.rentalAgreementExport.exportToExcelOpen` | POST | api/services/app/rentalAgreementExport/ExportToExcelOpen | [المصدر](../../../raw/application.js#L145412) |
| `abp.services.app.rentalAgreementExport.exportToExcelPreClosed` | POST | api/services/app/rentalAgreementExport/ExportToExcelPreClosed | [المصدر](../../../raw/application.js#L145425) |
| `abp.services.app.jobEstimation.getJobEstimations` | POST | api/services/app/jobEstimation/GetJobEstimations | [المصدر](../../../raw/application.js#L490022) |
| `abp.services.app.jobEstimation.exportToExcel` | POST | api/services/app/jobEstimation/ExportToExcel | [المصدر](../../../raw/application.js#L490052) |
| `abp.services.app.jobEstimation.deleteJobEstimation` | POST | api/services/app/jobEstimation/DeleteJobEstimation | [المصدر](../../../raw/application.js#L490207) |
| `abp.services.app.jobEstimation.rejectJobEstimation` | POST | api/services/app/jobEstimation/RejectJobEstimation | [المصدر](../../../raw/application.js#L490226) |
| `abp.services.app.jobEstimation.approveJobEstimation` | POST | api/services/app/jobEstimation/ApproveJobEstimation | [المصدر](../../../raw/application.js#L490308) |
| `abp.services.app.jobEstimation.closeEstimation` | POST | [object Object] | [المصدر](../../../raw/application.js#L490320) |
| `abp.services.app.jobEstimation.getJobEstimationsUnApprovedFilter` | POST | api/services/app/jobEstimation/GetJobEstimationsUnApprovedFilter | [المصدر](../../../raw/application.js#L490369) |
| `abp.services.app.job.getJobsSummaryFilter` | POST | api/services/app/job/GetJobsSummaryFilter | [المصدر](../../../raw/application.js#L494868) |
| `abp.services.app.job.exportToExcel` | POST | api/services/app/job/ExportToExcel | [المصدر](../../../raw/application.js#L494903) |
| `abp.services.app.job.deleteJob` | POST | api/services/app/job/DeleteJob | [المصدر](../../../raw/application.js#L495104) |
| `abp.services.app.job.cancelJob` | POST | api/services/app/job/CancelJob | [المصدر](../../../raw/application.js#L495124) |
| `abp.services.app.job.validateGatePass` | POST | api/services/app/job/ValidateGatePass | [المصدر](../../../raw/application.js#L495171) |
| `abp.services.app.job.closeJob` | POST | api/services/app/job/CloseJob | [المصدر](../../../raw/application.js#L494422) |
| `abp.services.app.vehicle.getTotalHiredVehiclesForDashboard` | POST | api/services/app/vehicle/GetTotalHiredVehiclesForDashboard | [المصدر](../../../raw/application.js#L200103) |
| `abp.services.app.vehicle.exportToExcelDashBoardTotalHired` | POST | api/services/app/vehicle/ExportToExcelDashBoardTotalHired | [المصدر](../../../raw/application.js#L200148) |
| `abp.services.app.leaseAgreementSearch.getDueAgreements` | POST | api/services/app/leaseAgreementSearch/GetDueAgreements | [المصدر](../../../raw/application.js#L232680) |
| `abp.services.app.leaseAgreement.deleteLeaseAgreement` | POST | api/services/app/leaseAgreement/DeleteLeaseAgreement | [المصدر](../../../raw/application.js#L232943) |
| `abp.services.app.leaseAgreementSearch.getLeaseAgreements` | POST | api/services/app/leaseAgreementSearch/GetLeaseAgreements | [المصدر](../../../raw/application.js#L233177) |
| `abp.services.app.leaseAgreementSearch.getOverDueAgreements` | POST | api/services/app/leaseAgreementSearch/GetOverDueAgreements | [المصدر](../../../raw/application.js#L233148) |
| `abp.services.app.leaseAgreementSearch.getClosedTodayAgreements` | POST | api/services/app/leaseAgreementSearch/GetClosedTodayAgreements | [المصدر](../../../raw/application.js#L233157) |
| `abp.services.app.leaseAgreementSearch.getPreClosedAgreements` | POST | api/services/app/leaseAgreementSearch/GetPreClosedAgreements | [المصدر](../../../raw/application.js#L233166) |
| `abp.services.app.leaseAgreementExport.exportToExcelForListModel` | POST | api/services/app/leaseAgreementExport/ExportToExcelForListModel | [المصدر](../../../raw/application.js#L233193) |
| `abp.services.app.leaseAgreementExport.exportToExcelOpen` | POST | api/services/app/leaseAgreementExport/ExportToExcelOpen | [المصدر](../../../raw/application.js#L233206) |
| `abp.services.app.leaseAgreementExport.exportToExcelPreClosed` | POST | api/services/app/leaseAgreementExport/ExportToExcelPreClosed | [المصدر](../../../raw/application.js#L233219) |
| `abp.services.app.leaseAgreementExport.dueExportToExcel` | POST | api/services/app/leaseAgreementExport/DueExportToExcel | [المصدر](../../../raw/application.js#L233237) |
| `abp.services.app.limoTripExport.exportToExcelNew` | POST | api/services/app/limoTripExport/ExportToExcelNew | [المصدر](../../../raw/application.js#L252233) |
| `abp.services.app.limoTripExport.exportToExcelDispatch` | POST | api/services/app/limoTripExport/ExportToExcelDispatch | [المصدر](../../../raw/application.js#L252247) |
| `abp.services.app.limoTripExport.exportToExcelStart` | POST | api/services/app/limoTripExport/ExportToExcelStart | [المصدر](../../../raw/application.js#L252260) |
| `abp.services.app.limoTripExport.exportToExcelFinish` | POST | api/services/app/limoTripExport/ExportToExcelFinish | [المصدر](../../../raw/application.js#L252275) |
| `abp.services.app.limoTripExport.exportToExcelCanceled` | POST | api/services/app/limoTripExport/ExportToExcelCanceled | [المصدر](../../../raw/application.js#L252288) |
| `abp.services.app.limoTripExport.exportToExcelNoShow` | POST | api/services/app/limoTripExport/ExportToExcelNoShow | [المصدر](../../../raw/application.js#L252302) |
| `abp.services.app.limoTripSearch.getTripsOnDashBoard` | POST | api/services/app/limoTripSearch/GetTripsOnDashBoard | [المصدر](../../../raw/application.js#L252695) |
| `abp.services.app.limoTrip.cancelTrip` | POST | api/services/app/limoTrip/CancelTrip | [المصدر](../../../raw/application.js#L252878) |
| `abp.services.app.limoTrip.noShowTrip` | POST | api/services/app/limoTrip/NoShowTrip | [المصدر](../../../raw/application.js#L252893) |
| `abp.services.app.limoTrip.deleteTrip` | POST | api/services/app/limoTrip/DeleteTrip | [المصدر](../../../raw/application.js#L252908) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L384601) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L342298) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L339009) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L364723) |
| `abp.services.app.documentsEmail.getCustomersByExpiredDocumentsDashboardView` | POST | api/services/app/documentsEmail/GetCustomersByExpiredDocumentsDashboardView | [المصدر](../../../raw/application.js#L198766) |
| `abp.services.app.leaseQuotation.bulkLeaseQuotationApprovals` | POST | api/services/app/leaseQuotation/BulkLeaseQuotationApprovals | [المصدر](../../../raw/application.js#L196577) |
| `abp.services.app.rentalQuotation.bulkRentalQuotationApprovals` | POST | api/services/app/rentalQuotation/BulkRentalQuotationApprovals | [المصدر](../../../raw/application.js#L196591) |
| `abp.services.app.creditNote.approveCreditNotes` | POST | api/services/app/creditNote/ApproveCreditNotes | [المصدر](../../../raw/application.js#L196603) |
| `abp.services.app.debitNote.approveDebitNotes` | POST | api/services/app/debitNote/ApproveDebitNotes | [المصدر](../../../raw/application.js#L196612) |
| `abp.services.app.approval.bulkApproval` | POST | api/services/app/approval/BulkApproval | [المصدر](../../../raw/application.js#L196688) |
| `abp.services.app.jobEstimation.verifyTransactionPassword` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L196664) |
| `abp.services.app.company.approveCompany` | POST | api/services/app/company/ApproveCompany | [المصدر](../../../raw/application.js#L196935) |
| `abp.services.app.payment.approvePayment` | POST | api/services/app/payment/ApprovePayment | [المصدر](../../../raw/application.js#L197053) |
| `abp.services.app.purchaseOrder.approvePurchaseOrder` | POST | api/services/app/purchaseOrder/ApprovePurchaseOrder | [المصدر](../../../raw/application.js#L197112) |
| `abp.services.app.purchaseOrder.rejectPurchaseOrder` | POST | api/services/app/purchaseOrder/RejectPurchaseOrder | [المصدر](../../../raw/application.js#L197154) |
| `abp.services.app.bill.approveBill` | POST | api/services/app/bill/ApproveBill | [المصدر](../../../raw/application.js#L197317) |
| `abp.services.app.jV.approveJV` | POST | api/services/app/jV/ApproveJV | [المصدر](../../../raw/application.js#L197338) |
| `abp.services.app.receipt.approveReceipt` | POST | api/services/app/receipt/ApproveReceipt | [المصدر](../../../raw/application.js#L197359) |
| `abp.services.app.bill.rejectBill` | POST | api/services/app/bill/RejectBill | [المصدر](../../../raw/application.js#L197397) |
| `abp.services.app.leaseQuotation.approveLeaseQuotation` | POST | api/services/app/leaseQuotation/ApproveLeaseQuotation | [المصدر](../../../raw/application.js#L197456) |
| `abp.services.app.leaseQuotation.rejectLeaseQuotation` | POST | api/services/app/leaseQuotation/RejectLeaseQuotation | [المصدر](../../../raw/application.js#L197497) |
| `abp.services.app.leaseQuotation.rejectQuotationByCustomer` | POST | api/services/app/leaseQuotation/RejectQuotationByCustomer | [المصدر](../../../raw/application.js#L197534) |
| `abp.services.app.leaseQuotation.approveQuotationByCustomer` | POST | api/services/app/leaseQuotation/ApproveQuotationByCustomer | [المصدر](../../../raw/application.js#L197554) |
| `abp.services.app.creditNote.approveCreditNote` | POST | api/services/app/creditNote/ApproveCreditNote | [المصدر](../../../raw/application.js#L197616) |
| `abp.services.app.creditNote.rejectCreditNote` | POST | api/services/app/creditNote/RejectCreditNote | [المصدر](../../../raw/application.js#L197670) |
| `abp.services.app.debitNote.approveDebitNote` | POST | api/services/app/debitNote/ApproveDebitNote | [المصدر](../../../raw/application.js#L197799) |
| `abp.services.app.debitNote.rejectDebitNote` | POST | api/services/app/debitNote/RejectDebitNote | [المصدر](../../../raw/application.js#L197852) |
| `abp.services.app.rentalQuotation.approveQuotation` | POST | api/services/app/rentalQuotation/ApproveQuotation | [المصدر](../../../raw/application.js#L197984) |
| `abp.services.app.rentalQuotation.approveQuotationByCustomer` | POST | api/services/app/rentalQuotation/ApproveQuotationByCustomer | [المصدر](../../../raw/application.js#L198026) |
| `abp.services.app.rentalQuotation.rejectQuotation` | POST | api/services/app/rentalQuotation/RejectQuotation | [المصدر](../../../raw/application.js#L198067) |
| `abp.services.app.rentalQuotation.rejectQuotationByCustomer` | POST | api/services/app/rentalQuotation/RejectQuotationByCustomer | [المصدر](../../../raw/application.js#L198083) |
| `abp.services.app.purchaseReturn.approveInvoice` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L198190) |
| `abp.services.app.invoice.approveMasterAgreement` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L198230) |
| `abp.services.app.rentalMasterAgreement.approveMasterAgreement` | POST | api/services/app/rentalMasterAgreement/ApproveMasterAgreement | [المصدر](../../../raw/application.js#L198272) |
| `abp.services.app.leaseMasterAgreement.approveJobEstimation` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L198327) |
| `abp.services.app.leaseMasterAgreement.rejectJobEstimation` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L198348) |
| `abp.services.app.movement.getSupportingDocuments` | POST | api/services/app/movement/GetSupportingDocuments | [المصدر](../../../raw/application.js#L448044) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L448095) |
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L448109) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L448151) |
| `abp.services.app.commonAgreement.getOpenAgreementsForAgreementsDashboard2` | POST | api/services/app/commonAgreement/GetOpenAgreementsForAgreementsDashboard2 | [المصدر](../../../raw/application.js#L158278) |
| `abp.services.app.directory.searchCustomerPhoto` | POST | api/services/app/directory/SearchCustomerPhoto | [المصدر](../../../raw/application.js#L139900) |
| `abp.services.app.invoice.generatFineInvoiceByAgreementId` | POST | api/services/app/invoice/GeneratFineInvoiceByAgreementId | [المصدر](../../../raw/application.js#L136089) |
| `abp.services.app.invoice.generatParkingInvoiceByAgreementId` | POST | api/services/app/invoice/GeneratParkingInvoiceByAgreementId | [المصدر](../../../raw/application.js#L158798) |
| `abp.services.app.invoice.generatTollInvoiceByAgreementId` | POST | api/services/app/invoice/GeneratTollInvoiceByAgreementId | [المصدر](../../../raw/application.js#L158847) |
| `abp.services.app.commonAgreement.getExcessKMsOnAgreement` | POST | api/services/app/commonAgreement/GetExcessKMsOnAgreement | [المصدر](../../../raw/application.js#L235678) |
| `abp.services.app.parkingTicket.getParkingTicket` | POST | api/services/app/parkingTicket/GetParkingTicket | [المصدر](../../../raw/application.js#L145561) |
| `abp.services.app.commonAgreement.getAgreementLogs` | POST | api/services/app/commonAgreement/GetAgreementLogs | [المصدر](../../../raw/application.js#L235706) |
| `abp.services.app.directory.getCustomerOutstandingBalance` | POST | api/services/app/directory/GetCustomerOutstandingBalance | [المصدر](../../../raw/application.js#L137905) |
| `abp.services.app.rentalAgreementSearch.getAgreementForView` | POST | api/services/app/rentalAgreementSearch/GetAgreementForView | [المصدر](../../../raw/application.js#L150530) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L338640) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L393485) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L336240) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L331336) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L342377) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L139772) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L338998) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L134369) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L339295) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L339111) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L372716) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L336026) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L393994) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L142528) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.deposit.createDepositForAgreement` | POST | api/services/app/deposit/CreateDepositForAgreement | [المصدر](../../../raw/application.js#L338766) |
| `abp.services.app.deposit.createDepositWithChargeForAgreement` | POST | api/services/app/deposit/CreateDepositWithChargeForAgreement | [المصدر](../../../raw/application.js#L338783) |
| `abp.services.app.deposit.getDepositForEdit` | POST | api/services/app/deposit/GetDepositForEdit | [المصدر](../../../raw/application.js#L341482) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L139481) |
| `abp.services.app.agreementReplacement.replaceVehicle` | POST | api/services/app/agreementReplacement/ReplaceVehicle | [المصدر](../../../raw/application.js#L148212) |
| `abp.services.app.commonLookup.getReplacementReasons` | POST | api/services/app/commonLookup/GetReplacementReasons | [المصدر](../../../raw/application.js#L148244) |
| `abp.services.app.agreement.extendCutShortAgreement` | POST | api/services/app/agreement/ExtendCutShortAgreement | [المصدر](../../../raw/application.js#L142010) |
| `abp.services.app.agreement.advanceInvoiceOnCreation` | POST | api/services/app/agreement/AdvanceInvoiceOnCreation | [المصدر](../../../raw/application.js#L138762) |
| `abp.services.app.agreement.getAgreementWithAdvanceAndDepositForEdit` | POST | api/services/app/agreement/GetAgreementWithAdvanceAndDepositForEdit | [المصدر](../../../raw/application.js#L140983) |
| `abp.services.app.toll.prepareDataForExtension` | POST | api/services/app/toll/PrepareDataForExtension | [المصدر](../../../raw/application.js#L136644) |
| `abp.services.app.toll.getTolls` | POST | api/services/app/toll/GetTolls | [المصدر](../../../raw/application.js#L141214) |
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L348984) |
| `abp.services.app.uaeFine.getFines` | POST | api/services/app/uaeFine/GetFines | [المصدر](../../../raw/application.js#L142511) |
| `abp.services.app.directory.searchSalesPersonWithDesignation` | POST | api/services/app/directory/SearchSalesPersonWithDesignation | [المصدر](../../../raw/application.js#L227350) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.rentalAgreementSearch.getAgreementForUpgrade` | POST | api/services/app/rentalAgreementSearch/GetAgreementForUpgrade | [المصدر](../../../raw/application.js#L149659) |
| `abp.services.app.agreement.upgradeOrDowngradeAgreement` | POST | api/services/app/agreement/UpgradeOrDowngradeAgreement | [المصدر](../../../raw/application.js#L149791) |
| `abp.services.app.receiptSearch.getReceivedVouchersByAgreementId` | POST | api/services/app/receiptSearch/GetReceivedVouchersByAgreementId | [المصدر](../../../raw/application.js#L135647) |
| `abp.services.app.refund.getRefundsByAgreementId` | POST | api/services/app/refund/GetRefundsByAgreementId | [المصدر](../../../raw/application.js#L135658) |
| `abp.services.app.agreement.closeAgreement` | POST | api/services/app/agreement/CloseAgreement | [المصدر](../../../raw/application.js#L136200) |
| `abp.services.app.rentalAgreementSearch.getAgreementForClosing` | POST | api/services/app/rentalAgreementSearch/GetAgreementForClosing | [المصدر](../../../raw/application.js#L136357) |
| `abp.services.app.uaeFine.getTrafficFilesOnVehicles` | POST | api/services/app/uaeFine/GetTrafficFilesOnVehicles | [المصدر](../../../raw/application.js#L136690) |
| `abp.services.app.parkingTicket.getParkingTicketOnClosingAgreement` | POST | api/services/app/parkingTicket/GetParkingTicketOnClosingAgreement | [المصدر](../../../raw/application.js#L136950) |
| `abp.services.app.customerProject.getCustomerProject` | POST | api/services/app/customerProject/GetCustomerProject | [المصدر](../../../raw/application.js#L137165) |
| `abp.services.app.tariffCard.getActiveTariffCardsPeriodWise` | POST | api/services/app/tariffCard/GetActiveTariffCardsPeriodWise | [المصدر](../../../raw/application.js#L137218) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.directory.searchSalesPersonActiveOne` | POST | api/services/app/directory/SearchSalesPersonActiveOne | [المصدر](../../../raw/application.js#L227116) |
| `abp.services.app.saleOrigin.getSaleOrigins` | POST | api/services/app/saleOrigin/GetSaleOrigins | [المصدر](../../../raw/application.js#L137625) |
| `abp.services.app.agreementGroup.getAgreementGroups` | POST | api/services/app/agreementGroup/GetAgreementGroups | [المصدر](../../../raw/application.js#L137631) |
| `abp.services.app.directory.searchPersonStaffCustomer` | POST | api/services/app/directory/SearchPersonStaffCustomer | [المصدر](../../../raw/application.js#L139819) |
| `abp.services.app.rentalQuotation.getQuotationsByContactId` | POST | api/services/app/rentalQuotation/GetQuotationsByContactId | [المصدر](../../../raw/application.js#L139941) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L140023) |
| `abp.services.app.directory.searchForCompany` | POST | api/services/app/directory/SearchForCompany | [المصدر](../../../raw/application.js#L140095) |
| `abp.services.app.agreementSaleOrder.getAgreementSaleOrdersByContactId` | POST | api/services/app/agreementSaleOrder/GetAgreementSaleOrdersByContactId | [المصدر](../../../raw/application.js#L140139) |
| `abp.services.app.rentalQuotation.getQuotationForEdit` | POST | api/services/app/rentalQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L140149) |
| `abp.services.app.accident.checkRepeatedAccidentsOnDriver` | POST | api/services/app/accident/CheckRepeatedAccidentsOnDriver | [المصدر](../../../raw/application.js#L140197) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L140415) |
| `abp.services.app.agreement.createOrUpdateAgreement` | POST | api/services/app/agreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L140549) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L228040) |
| `abp.services.app.staff.getStaffForEdit` | POST | api/services/app/staff/GetStaffForEdit | [المصدر](../../../raw/application.js#L139097) |
| `abp.services.app.commonLookup.getUser` | POST | api/services/app/commonLookup/GetUser | [المصدر](../../../raw/application.js#L139120) |
| `abp.services.app.agreementGroup.getDefaultGroupId` | POST | api/services/app/agreementGroup/GetDefaultGroupId | [المصدر](../../../raw/application.js#L139192) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184853) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L464645) |
| `abp.services.app.vehicleService.getVehicleServiceForEdit` | POST | api/services/app/vehicleService/GetVehicleServiceForEdit | [المصدر](../../../raw/application.js#L492561) |
| `abp.services.app.vehicleService.getVehicleServicesByModelOrDefault` | POST | api/services/app/vehicleService/GetVehicleServicesByModelOrDefault | [المصدر](../../../raw/application.js#L492648) |
| `abp.services.app.labourTariff.getLabourTariffByVehicleType` | POST | api/services/app/labourTariff/GetLabourTariffByVehicleType | [المصدر](../../../raw/application.js#L494679) |
| `abp.services.app.vehicle.searchVehiclesForWorkshop` | POST | api/services/app/vehicle/SearchVehiclesForWorkshop | [المصدر](../../../raw/application.js#L491853) |
| `abp.services.app.labourActivity.getLabourActivitiesSearch` | POST | api/services/app/labourActivity/GetLabourActivitiesSearch | [المصدر](../../../raw/application.js#L492736) |
| `abp.services.app.jobEstimation.createOrUpdateJobEstimation` | POST | api/services/app/jobEstimation/CreateOrUpdateJobEstimation | [المصدر](../../../raw/application.js#L488829) |
| `abp.services.app.job.getJobForEdit` | POST | api/services/app/job/GetJobForEdit | [المصدر](../../../raw/application.js#L495793) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.jobEstimation.getJobEstimationForEdit` | POST | api/services/app/jobEstimation/GetJobEstimationForEdit | [المصدر](../../../raw/application.js#L491924) |
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L180086) |
| `abp.services.app.vehicleService.getVehicleServices` | POST | api/services/app/vehicleService/GetVehicleServices | [المصدر](../../../raw/application.js#L493341) |
| `abp.services.app.labourActivity.getLabourActivities` | POST | api/services/app/labourActivity/GetLabourActivities | [المصدر](../../../raw/application.js#L495845) |
| `abp.services.app.tenantSettings.getDocumentSetting` | POST | [object Object] | [المصدر](../../../raw/application.js#L495760) |
| `abp.services.app.job.getVehicleServices` | POST | api/services/app/job/GetVehicleServices | [المصدر](../../../raw/application.js#L492666) |
| `abp.services.app.jobCategory.getJobCategory` | POST | api/services/app/jobCategory/GetJobCategory | [المصدر](../../../raw/application.js#L492719) |
| `abp.services.app.directory.searchStaff` | POST | api/services/app/directory/SearchStaff | [المصدر](../../../raw/application.js#L250208) |
| `abp.services.app.job.checkDuplicateChassisNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L492784) |
| `abp.services.app.job.createOrUpdateJob` | POST | api/services/app/job/CreateOrUpdateJob | [المصدر](../../../raw/application.js#L492835) |
| `abp.services.app.workOrder.getWorkOrderForEdit` | POST | api/services/app/workOrder/GetWorkOrderForEdit | [المصدر](../../../raw/application.js#L491898) |
| `abp.services.app.bill.getBillForEdit` | POST | api/services/app/bill/GetBillForEdit | [المصدر](../../../raw/application.js#L323990) |
| `abp.services.app.jobEstimation.getJobLogs` | POST | api/services/app/jobEstimation/GetJobLogs | [المصدر](../../../raw/application.js#L489807) |
| `abp.services.app.job.createOrUpdateLubricationJob` | POST | api/services/app/job/CreateOrUpdateLubricationJob | [المصدر](../../../raw/application.js#L491882) |
| `abp.services.app.job.updatePo` | POST | api/services/app/job/UpdatePo | [المصدر](../../../raw/application.js#L493412) |
| `abp.services.app.purchaseOrder.searchLPONo` | POST | api/services/app/purchaseOrder/SearchLPONo | [المصدر](../../../raw/application.js#L493422) |
| `abp.services.app.job.getPrintForGatePass` | POST | api/services/app/job/GetPrintForGatePass | [المصدر](../../../raw/application.js#L493495) |
| `abp.services.app.job.addVehicleQualityCheckReport` | POST | api/services/app/job/AddVehicleQualityCheckReport | [المصدر](../../../raw/application.js#L495691) |
| `abp.services.app.job.getVehicleQualityCheckReportForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L495701) |
| `abp.services.app.job.getJobForClosing` | POST | api/services/app/job/GetJobForClosing | [المصدر](../../../raw/application.js#L494409) |
| `abp.services.app.job.getJobTime` | POST | api/services/app/job/GetJobTime | [المصدر](../../../raw/application.js#L494688) |
| `abp.services.app.leaseClause.getClausesForEdit` | POST | api/services/app/leaseClause/GetClausesForEdit | [المصدر](../../../raw/application.js#L228195) |
| `abp.services.app.leaseClause.getLeaseClauseTypes` | POST | api/services/app/leaseClause/GetLeaseClauseTypes | [المصدر](../../../raw/application.js#L228265) |
| `abp.services.app.leaseAgreementSearch.getLeaseAgreementForView` | POST | api/services/app/leaseAgreementSearch/GetLeaseAgreementForView | [المصدر](../../../raw/application.js#L235714) |
| `abp.services.app.taxCode.getTaxCodeById` | POST | api/services/app/taxCode/GetTaxCodeById | [المصدر](../../../raw/application.js#L227598) |
| `abp.services.app.agreementSaleOrder.searchSaleOrdersForAgreement` | POST | api/services/app/agreementSaleOrder/SearchSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L227626) |
| `abp.services.app.leaseAgreement.createOrUpdateLeaseAgreement` | POST | api/services/app/leaseAgreement/CreateOrUpdateLeaseAgreement | [المصدر](../../../raw/application.js#L228062) |
| `abp.services.app.leaseAgreement.getLeaseAgreementWithAdvanceAndDepositForEdit` | POST | api/services/app/leaseAgreement/GetLeaseAgreementWithAdvanceAndDepositForEdit | [المصدر](../../../raw/application.js#L228333) |
| `abp.services.app.limoTrip.getStaffShiftByVehicleOrDriver` | POST | api/services/app/limoTrip/GetStaffShiftByVehicleOrDriver | [المصدر](../../../raw/application.js#L250237) |
| `abp.services.app.limoTrip.getContactPersonsByCustomer` | POST | [object Object] | [المصدر](../../../raw/application.js#L254908) |
| `abp.services.app.commonLookup.searchContact` | POST | api/services/app/commonLookup/SearchContact | [المصدر](../../../raw/application.js#L307244) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L180737) |
| `abp.services.app.commonLookup.searchLimoPlaces` | POST | api/services/app/commonLookup/SearchLimoPlaces | [المصدر](../../../raw/application.js#L249353) |
| `abp.services.app.googleMapAPI.getDistanceWithTime` | POST | api/services/app/googleMapAPI/GetDistanceWithTime | [المصدر](../../../raw/application.js#L249450) |
| `abp.services.app.limoTrip.calculateCharges` | POST | api/services/app/limoTrip/CalculateCharges | [المصدر](../../../raw/application.js#L250471) |
| `abp.services.app.commonLookup.getTripTypes` | POST | api/services/app/commonLookup/GetTripTypes | [المصدر](../../../raw/application.js#L364730) |
| `abp.services.app.limoQuotation.getQuotationForEdit` | POST | api/services/app/limoQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L249764) |
| `abp.services.app.limoTrip.getTripForEdit` | POST | api/services/app/limoTrip/GetTripForEdit | [المصدر](../../../raw/application.js#L254027) |
| `abp.services.app.limoTrip.getPerDayAndHourTripCount` | POST | api/services/app/limoTrip/GetPerDayAndHourTripCount | [المصدر](../../../raw/application.js#L249959) |
| `abp.services.app.limoTrip.createOrUpdateTrip` | POST | api/services/app/limoTrip/CreateOrUpdateTrip | [المصدر](../../../raw/application.js#L250088) |
| `abp.services.app.invoice.createOrUpdateInvoice` | POST | api/services/app/invoice/CreateOrUpdateInvoice | [المصدر](../../../raw/application.js#L343427) |
| `abp.services.app.limoTrip.dispatchTrip` | POST | api/services/app/limoTrip/DispatchTrip | [المصدر](../../../raw/application.js#L250311) |
| `abp.services.app.limoTripSearch.getCheckList` | POST | api/services/app/limoTripSearch/GetCheckList | [المصدر](../../../raw/application.js#L254901) |
| `abp.services.app.directory.getContactInfo` | POST | api/services/app/directory/GetContactInfo | [المصدر](../../../raw/application.js#L254924) |
| `abp.services.app.limoTripSearch.getTripForView` | POST | api/services/app/limoTripSearch/GetTripForView | [المصدر](../../../raw/application.js#L254937) |
| `abp.services.app.limoTrip.startTrip` | POST | api/services/app/limoTrip/StartTrip | [المصدر](../../../raw/application.js#L253917) |
| `abp.services.app.limoTrip.finishTrip` | POST | api/services/app/limoTrip/FinishTrip | [المصدر](../../../raw/application.js#L250503) |
| `abp.services.app.tripType.getTripTypeSettingForEdit` | POST | api/services/app/tripType/GetTripTypeSettingForEdit | [المصدر](../../../raw/application.js#L250523) |
| `abp.services.app.limoTrip.getTripLogs` | POST | api/services/app/limoTrip/GetTripLogs | [المصدر](../../../raw/application.js#L252999) |
| `abp.services.app.limoTrip.updateCharges` | POST | api/services/app/limoTrip/UpdateCharges | [المصدر](../../../raw/application.js#L254037) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L258367) |
| `abp.services.app.directory.getDriverForCompany` | POST | [object Object] | [المصدر](../../../raw/application.js#L179552) |
| `abp.services.app.company.deleteCompanyDriver` | POST | [object Object] | [المصدر](../../../raw/application.js#L179593) |
| `abp.services.app.company.createOrUpdateCompany` | POST | api/services/app/company/CreateOrUpdateCompany | [المصدر](../../../raw/application.js#L179662) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L181210) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L181124) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.company.getCompanyForEdit` | POST | api/services/app/company/GetCompanyForEdit | [المصدر](../../../raw/application.js#L180102) |
| `abp.services.app.company.getContactCards` | POST | api/services/app/company/GetContactCards | [المصدر](../../../raw/application.js#L180183) |
| `abp.services.app.company.getAdvanceSettings` | POST | api/services/app/company/GetAdvanceSettings | [المصدر](../../../raw/application.js#L180386) |
| `abp.services.app.industry.getIndustries` | POST | api/services/app/industry/GetIndustries | [المصدر](../../../raw/application.js#L180410) |
| `abp.services.app.company.getCompanyCustomField1` | POST | api/services/app/company/GetCompanyCustomField1 | [المصدر](../../../raw/application.js#L180419) |
| `abp.services.app.company.getCompanyCustomField2` | POST | api/services/app/company/GetCompanyCustomField2 | [المصدر](../../../raw/application.js#L180428) |
| `abp.services.app.company.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L180436) |
| `abp.services.app.company.getCompanyCustomField3` | POST | api/services/app/company/GetCompanyCustomField3 | [المصدر](../../../raw/application.js#L180441) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L322560) |
| `abp.services.app.purchaseRequest.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L383162) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L372216) |
| `abp.services.app.purchaseRequest.createOrUpdatePurchaseRequest` | POST | api/services/app/purchaseRequest/CreateOrUpdatePurchaseRequest | [المصدر](../../../raw/application.js#L383279) |
| `abp.services.app.itemRequisition.getItemRequisitionToCreatePR` | POST | api/services/app/itemRequisition/getItemRequisitionToCreatePR | [المصدر](../../../raw/application.js#L383329) |
| `abp.services.app.leaseQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/leaseQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L383355) |
| `abp.services.app.assetType.getAssetDefaultType` | POST | api/services/app/assetType/GetAssetDefaultType | [المصدر](../../../raw/application.js#L380652) |
| `abp.services.app.purchaseRequest.getPurchaseRequestForEdit` | POST | api/services/app/purchaseRequest/GetPurchaseRequestForEdit | [المصدر](../../../raw/application.js#L380585) |
| `abp.services.app.purchaseRequest.voucherApprovalBySpecificUser` | POST | api/services/app/purchaseRequest/VoucherApprovalBySpecificUser | [المصدر](../../../raw/application.js#L382592) |
| `abp.services.app.purchaseRequest.voucherRejectionBySpecificUser` | POST | api/services/app/purchaseRequest/VoucherRejectionBySpecificUser | [المصدر](../../../raw/application.js#L382605) |
| `abp.services.app.purchaseRequest.getVoucherApprovals` | POST | api/services/app/purchaseRequest/GetVoucherApprovals | [المصدر](../../../raw/application.js#L382637) |
| `abp.services.app.user.getRoleByUserId` | POST | api/services/app/user/GetRoleByUserId | [المصدر](../../../raw/application.js#L159637) |
| `abp.services.app.approval.rejectionBySpecificUser` | POST | api/services/app/approval/RejectionBySpecificUser | [المصدر](../../../raw/application.js#L84812) |
| `abp.services.app.approval.approvalBySpecificUser` | POST | api/services/app/approval/ApprovalBySpecificUser | [المصدر](../../../raw/application.js#L159693) |
| `abp.services.app.user.getRole` | POST | api/services/app/user/GetRole | [المصدر](../../../raw/application.js#L159647) |
| `abp.services.app.approval.getApprovals` | POST | api/services/app/approval/GetApprovals | [المصدر](../../../raw/application.js#L159753) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L323376) |
| `abp.services.app.purchaseOrder.getPOUnitPriceBasedOnLastSupplier` | POST | api/services/app/purchaseOrder/GetPOUnitPriceBasedOnLastSupplier | [المصدر](../../../raw/application.js#L380428) |
| `abp.services.app.purchaseOrder.createOrUpdatePurchaseOrder` | POST | api/services/app/purchaseOrder/CreateOrUpdatePurchaseOrder | [المصدر](../../../raw/application.js#L380537) |
| `abp.services.app.commonQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/commonQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L380649) |
| `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | POST | api/services/app/purchaseOrder/GetPurchaseOrderForEdit | [المصدر](../../../raw/application.js#L323969) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L370572) |
| `abp.services.app.jV.getexpenseaccounts` | POST | api/services/app/jV/Getexpenseaccounts | [المصدر](../../../raw/application.js#L336139) |
| `abp.services.app.jV.isStockAccount` | POST | api/services/app/jV/IsStockAccount | [المصدر](../../../raw/application.js#L366731) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L335632) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L307414) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L366814) |
| `abp.services.app.jV.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L367126) |
| `abp.services.app.jV.createOrUpdateJV` | POST | api/services/app/jV/CreateOrUpdateJV | [المصدر](../../../raw/application.js#L367337) |
| `abp.services.app.jV.getLinkedAccountId` | POST | api/services/app/jV/GetLinkedAccountId | [المصدر](../../../raw/application.js#L367367) |
| `abp.services.app.jV.getJVForEdit` | POST | api/services/app/jV/GetJVForEdit | [المصدر](../../../raw/application.js#L367384) |
| `abp.services.app.allocation.getAgreementsAllocations` | POST | api/services/app/allocation/GetAgreementsAllocations | [المصدر](../../../raw/application.js#L393502) |
| `abp.services.app.allocation.getAllocationsForEdit2` | POST | api/services/app/allocation/GetAllocationsForEdit2 | [المصدر](../../../raw/application.js#L338558) |
| `abp.services.app.commonLookup.validateCheque` | POST | [object Object] | [المصدر](../../../raw/application.js#L393936) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L134377) |
| `abp.services.app.bill.getexpenseaccounts` | POST | api/services/app/bill/Getexpenseaccounts | [المصدر](../../../raw/application.js#L323319) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L372351) |
| `abp.services.app.grn.getStockGrnByRefNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L328873) |
| `abp.services.app.grn.getAssetGrnByRefNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L328882) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L326426) |
| `abp.services.app.linkedAccount.getLoanPrepaidExpenseAccount` | POST | api/services/app/linkedAccount/GetLoanPrepaidExpenseAccount | [المصدر](../../../raw/application.js#L322731) |
| `abp.services.app.grn.getStockGrnBySupplierId` | POST | [object Object] | [المصدر](../../../raw/application.js#L323484) |
| `abp.services.app.grn.getAssetGrnBySupplierId` | POST | api/services/app/grn/GetAssetGrnBySupplierId | [المصدر](../../../raw/application.js#L323507) |
| `abp.services.app.bill.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L323666) |
| `abp.services.app.bill.assetBillImportFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L323758) |
| `abp.services.app.bill.createOrUpdateGrnBill` | POST | api/services/app/bill/CreateOrUpdateGrnBill | [المصدر](../../../raw/application.js#L323823) |
| `abp.services.app.bill.createOrUpdateBill` | POST | api/services/app/bill/CreateOrUpdateBill | [المصدر](../../../raw/application.js#L323891) |
| `abp.services.app.grn.getGrnForEdit` | POST | api/services/app/grn/GetGrnForEdit | [المصدر](../../../raw/application.js#L323932) |
| `abp.services.app.account.getStaffAccounts` | POST | api/services/app/account/GetStaffAccounts | [المصدر](../../../raw/application.js#L371571) |
| `abp.services.app.payment.getexpenseaccounts` | POST | api/services/app/payment/Getexpenseaccounts | [المصدر](../../../raw/application.js#L371869) |
| `abp.services.app.department.getDepartment` | POST | api/services/app/department/GetDepartment | [المصدر](../../../raw/application.js#L371673) |
| `abp.services.app.payment.getPaymentForView` | POST | api/services/app/payment/GetPaymentForView | [المصدر](../../../raw/application.js#L377941) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L464652) |
| `abp.services.app.payment.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L370811) |
| `abp.services.app.payroll.getPayrollsForPayment` | POST | api/services/app/payroll/GetPayrollsForPayment | [المصدر](../../../raw/application.js#L371666) |
| `abp.services.app.payment.createOrUpdatePayment` | POST | api/services/app/payment/CreateOrUpdatePayment | [المصدر](../../../raw/application.js#L372500) |
| `abp.services.app.payment.getPaymentForEdit` | POST | api/services/app/payment/GetPaymentForEdit | [المصدر](../../../raw/application.js#L372667) |
| `abp.services.app.eRSTariff.getTariff` | POST | api/services/app/eRSTariff/GetTariff | [المصدر](../../../raw/application.js#L239399) |
| `abp.services.app.costSetting.getCostSettingByModel` | POST | api/services/app/costSetting/GetCostSettingByModel | [المصدر](../../../raw/application.js#L238873) |
| `abp.services.app.leaseInquiry.getLeaseInquiryForEdit` | POST | api/services/app/leaseInquiry/GetLeaseInquiryForEdit | [المصدر](../../../raw/application.js#L239826) |
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L241741) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForRevision` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForRevision | [المصدر](../../../raw/application.js#L239864) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForEdit` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForEdit | [المصدر](../../../raw/application.js#L239866) |
| `abp.services.app.leaseQuotation.reviseLeaseQuotation` | POST | api/services/app/leaseQuotation/ReviseLeaseQuotation | [المصدر](../../../raw/application.js#L239903) |
| `abp.services.app.leaseQuotation.createOrUpdateLeaseQuotation` | POST | api/services/app/leaseQuotation/CreateOrUpdateLeaseQuotation | [المصدر](../../../raw/application.js#L239905) |
| `abp.services.app.creditNote.getCreditNoteOnDeliveryForView` | POST | api/services/app/creditNote/GetCreditNoteOnDeliveryForView | [المصدر](../../../raw/application.js#L334355) |
| `abp.services.app.commonLookup.getVoucherReasons` | POST | api/services/app/commonLookup/GetVoucherReasons | [المصدر](../../../raw/application.js#L332168) |
| `abp.services.app.creditNote.createOrUpdateCreditNote` | POST | api/services/app/creditNote/CreateOrUpdateCreditNote | [المصدر](../../../raw/application.js#L330868) |
| `abp.services.app.creditNote.getCreditNoteForEdit` | POST | api/services/app/creditNote/GetCreditNoteForEdit | [المصدر](../../../raw/application.js#L331792) |
| `abp.services.app.creditNote.createOrUpdateOnAccountCreditNote` | POST | api/services/app/creditNote/CreateOrUpdateOnAccountCreditNote | [المصدر](../../../raw/application.js#L331491) |
| `abp.services.app.creditNote.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L331568) |
| `abp.services.app.commonLookup.searchInvoices` | POST | api/services/app/commonLookup/SearchInvoices | [المصدر](../../../raw/application.js#L332072) |
| `abp.services.app.commonLookup.searchDeliveryNotes` | POST | api/services/app/commonLookup/SearchDeliveryNotes | [المصدر](../../../raw/application.js#L332083) |
| `abp.services.app.commonLookup.getInvoiceHourlyRate` | POST | api/services/app/commonLookup/GetInvoiceHourlyRate | [المصدر](../../../raw/application.js#L332097) |
| `abp.services.app.creditNote.createOrUpdateCreditNoteOnDelivery` | POST | api/services/app/creditNote/CreateOrUpdateCreditNoteOnDelivery | [المصدر](../../../raw/application.js#L332126) |
| `abp.services.app.creditNote.getCreditNoteOnDeliveryForEdit` | POST | api/services/app/creditNote/GetCreditNoteOnDeliveryForEdit | [المصدر](../../../raw/application.js#L332177) |
| `abp.services.app.debitNote.createOrUpdateDebitNote` | POST | api/services/app/debitNote/CreateOrUpdateDebitNote | [المصدر](../../../raw/application.js#L335361) |
| `abp.services.app.debitNote.getDebitNoteForEdit` | POST | api/services/app/debitNote/GetDebitNoteForEdit | [المصدر](../../../raw/application.js#L336357) |
| `abp.services.app.debitNote.createOrUpdateDebitNoteOnAccount` | POST | api/services/app/debitNote/CreateOrUpdateDebitNoteOnAccount | [المصدر](../../../raw/application.js#L336223) |
| `abp.services.app.debitNote.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L336290) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L241976) |
| `abp.services.app.directory.getContactsByCompanyId` | POST | api/services/app/directory/GetContactsByCompanyId | [المصدر](../../../raw/application.js#L258241) |
| `abp.services.app.rentalQuotation.getQuotationForRevision` | POST | api/services/app/rentalQuotation/GetQuotationForRevision | [المصدر](../../../raw/application.js#L258410) |
| `abp.services.app.rentalQuotation.reviseQuotation` | POST | api/services/app/rentalQuotation/ReviseQuotation | [المصدر](../../../raw/application.js#L258504) |
| `abp.services.app.rentalQuotation.createOrUpdateQuotation` | POST | api/services/app/rentalQuotation/CreateOrUpdateQuotation | [المصدر](../../../raw/application.js#L258506) |
| `abp.services.app.rentalMasterAgreement.updateScheduleLine` | POST | api/services/app/rentalMasterAgreement/UpdateScheduleLine | [المصدر](../../../raw/application.js#L257216) |
| `abp.services.app.rentalMasterAgreement.createOrUpdateMasterRentalAgreement` | POST | api/services/app/rentalMasterAgreement/CreateOrUpdateMasterRentalAgreement | [المصدر](../../../raw/application.js#L257227) |
| `abp.services.app.rentalMasterAgreement.getMasterAgreementForView` | POST | api/services/app/rentalMasterAgreement/GetMasterAgreementForView | [المصدر](../../../raw/application.js#L257241) |
| `abp.services.app.leaseMasterAgreement.getMasterLeaseAgreementForView` | POST | api/services/app/leaseMasterAgreement/GetMasterLeaseAgreementForView | [المصدر](../../../raw/application.js#L241852) |
| `abp.services.app.leaseMasterAgreement.updateScheduleLine` | POST | api/services/app/leaseMasterAgreement/UpdateScheduleLine | [المصدر](../../../raw/application.js#L242127) |
| `abp.services.app.leaseMasterAgreement.createOrUpdateMasterLeaseAgreement` | POST | api/services/app/leaseMasterAgreement/CreateOrUpdateMasterLeaseAgreement | [المصدر](../../../raw/application.js#L242139) |
| `abp.services.app.leaseMasterAgreement.getMasterAgreementForView` | POST | api/services/app/leaseMasterAgreement/GetMasterAgreementForView | [المصدر](../../../raw/application.js#L242150) |
| `abp.services.app.asset.changeSalePriceByUser` | POST | api/services/app/asset/ChangeSalePriceByUser | [المصدر](../../../raw/application.js#L159624) |
| `abp.services.app.asset.getAssetForView` | POST | api/services/app/asset/GetAssetForView | [المصدر](../../../raw/application.js#L159773) |
| `abp.services.app.profile.verifyTransactionPassword` | POST | api/services/app/profile/VerifyTransactionPassword | [المصدر](../../../raw/application.js#L159722) |
| `abp.services.app.asset.approveDisposal` | POST | api/services/app/asset/ApproveDisposal | [المصدر](../../../raw/application.js#L159739) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |
| `abp.services.app.deposit.updateUsedDeposit` | POST | api/services/app/deposit/UpdateUsedDeposit | [المصدر](../../../raw/application.js#L341312) |
| `abp.services.app.deposit.getRefundtAmountOnDeposit` | POST | [object Object] | [المصدر](../../../raw/application.js#L341345) |
| `abp.services.app.deposit.getAllocatedAmountOnDeposit` | POST | [object Object] | [المصدر](../../../raw/application.js#L339066) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L181343) |
| `abp.services.app.agreementPrint.printReplacement` | POST | api/services/app/agreementPrint/PrintReplacement | [المصدر](../../../raw/application.js#L151387) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L365812) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L365821) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L365905) |
| `abp.services.app.movement.getMovementLogs` | POST | api/services/app/movement/GetMovementLogs | [المصدر](../../../raw/application.js#L449051) |
| `abp.services.app.vehicle.getVehicleMovements` | POST | [object Object] | [المصدر](../../../raw/application.js#L316432) |
| `abp.services.app.vehicle.getAdvanceSettings` | POST | api/services/app/vehicle/GetAdvanceSettings | [المصدر](../../../raw/application.js#L307684) |
| `abp.services.app.vehicleAttachment.getVehicleAttachmentsByVehicle` | POST | api/services/app/vehicleAttachment/GetVehicleAttachmentsByVehicle | [المصدر](../../../raw/application.js#L316489) |
| `abp.services.app.vehicle.getVehicleForView` | POST | api/services/app/vehicle/GetVehicleForView | [المصدر](../../../raw/application.js#L316519) |
| `abp.services.app.movement.updateMovement` | POST | api/services/app/movement/UpdateMovement | [المصدر](../../../raw/application.js#L448136) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L348885) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L329705) |
| `abp.services.app.receipt.getAdvanceReceipts` | POST | api/services/app/receipt/GetAdvanceReceipts | [المصدر](../../../raw/application.js#L346346) |
| `abp.services.app.receipt.getAdvanceTaxReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L346361) |
| `abp.services.app.invoice.createOrUpdateAdvanceTaxInvoice` | POST | api/services/app/invoice/CreateOrUpdateAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L346448) |
| `abp.services.app.vehicleModel.getVehicleModels` | POST | api/services/app/vehicleModel/GetVehicleModels | [المصدر](../../../raw/application.js#L346739) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L346755) |
| `abp.services.app.salesAgreement.getSalesAgreementForEdit` | POST | api/services/app/salesAgreement/GetSalesAgreementForEdit | [المصدر](../../../raw/application.js#L346763) |
| `abp.services.app.salesQuotation.getQuotationForEdit` | POST | api/services/app/salesQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L346820) |
| `abp.services.app.account.getAccount` | POST | api/services/app/account/GetAccount | [المصدر](../../../raw/application.js#L346904) |
| `abp.services.app.uaeFine.processFines` | POST | api/services/app/uaeFine/ProcessFines | [المصدر](../../../raw/application.js#L348778) |
| `abp.services.app.uaeFine.getPendingFines` | POST | api/services/app/uaeFine/GetPendingFines | [المصدر](../../../raw/application.js#L348860) |
| `abp.services.app.invoice.generateFineInvoices` | POST | api/services/app/invoice/GenerateFineInvoices | [المصدر](../../../raw/application.js#L348911) |
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.vehicle.updateMileage` | POST | api/services/app/vehicle/UpdateMileage | [المصدر](../../../raw/application.js#L314576) |
| `abp.services.app.directory.getExpiredDocumentAndOutStandingBalance` | POST | api/services/app/directory/GetExpiredDocumentAndOutStandingBalance | [المصدر](../../../raw/application.js#L141621) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.directory.searchSagX3Contacts` | POST | api/services/app/directory/SearchSagX3Contacts | [المصدر](../../../raw/application.js#L185395) |
| `abp.services.app.company.createSagX3Contact` | POST | api/services/app/company/CreateSagX3Contact | [المصدر](../../../raw/application.js#L185442) |
| `abp.services.app.authorizationCode.verifyCode` | POST | api/services/app/authorizationCode/VerifyCode | [المصدر](../../../raw/application.js#L85555) |
| `abp.services.app.vehicleModel.searchVehicleMakes` | POST | api/services/app/vehicleModel/SearchVehicleMakes | [المصدر](../../../raw/application.js#L307225) |
| `abp.services.app.sourceCode.getSourceCodes` | POST | api/services/app/sourceCode/GetSourceCodes | [المصدر](../../../raw/application.js#L307408) |
| `abp.services.app.vehicle.createOrUpdateVehicle` | POST | api/services/app/vehicle/CreateOrUpdateVehicle | [المصدر](../../../raw/application.js#L307542) |
| `abp.services.app.uaeFine.getFiltersData` | POST | api/services/app/uaeFine/GetFiltersData | [المصدر](../../../raw/application.js#L307655) |
| `abp.services.app.vehicle.getInsuranceCompanies` | POST | api/services/app/vehicle/GetInsuranceCompanies | [المصدر](../../../raw/application.js#L307711) |
| `abp.services.app.vehicle.getVehicleForEdit` | POST | api/services/app/vehicle/GetVehicleForEdit | [المصدر](../../../raw/application.js#L312225) |
| `abp.services.app.itemRequisition.createOrUpdateItemRequisition` | POST | api/services/app/itemRequisition/CreateOrUpdateItemRequisition | [المصدر](../../../raw/application.js#L469932) |
| `abp.services.app.itemRequisition.getItemRequisitionForEdit` | POST | api/services/app/itemRequisition/GetItemRequisitionForEdit | [المصدر](../../../raw/application.js#L464699) |
| `abp.services.app.job.getItemReturnRows` | POST | api/services/app/job/GetItemReturnRows | [المصدر](../../../raw/application.js#L465122) |
| `abp.services.app.itemReturn.createOrUpdateItemReturn` | POST | api/services/app/itemReturn/CreateOrUpdateItemReturn | [المصدر](../../../raw/application.js#L465227) |
| `abp.services.app.itemReturn.getItemReturnForEdit` | POST | api/services/app/itemReturn/GetItemReturnForEdit | [المصدر](../../../raw/application.js#L465243) |
| `abp.services.app.itemIssue.createOrUpdateItemIssue` | POST | api/services/app/itemIssue/CreateOrUpdateItemIssue | [المصدر](../../../raw/application.js#L464683) |
| `abp.services.app.itemIssue.getItemIssueForEdit` | POST | api/services/app/itemIssue/GetItemIssueForEdit | [المصدر](../../../raw/application.js#L464729) |
| `abp.services.app.jobEstimation.addJobLog` | POST | api/services/app/jobEstimation/AddJobLog | [المصدر](../../../raw/application.js#L488304) |
| `abp.services.app.job.deleteJobTimeLogs` | POST | api/services/app/job/DeleteJobTimeLogs | [المصدر](../../../raw/application.js#L494520) |
| `abp.services.app.job.getJobChargeTimeLogs` | POST | api/services/app/job/GetJobChargeTimeLogs | [المصدر](../../../raw/application.js#L494554) |
| `abp.services.app.job.createJobTimeLogs` | POST | api/services/app/job/CreateJobTimeLogs | [المصدر](../../../raw/application.js#L494568) |
| `abp.services.app.limoTrip.getChauffeurQueue` | POST | api/services/app/limoTrip/GetChauffeurQueue | [المصدر](../../../raw/application.js#L253836) |
| `abp.services.app.commonLookup.searchTripsForInvoice` | POST | api/services/app/commonLookup/SearchTripsForInvoice | [المصدر](../../../raw/application.js#L364764) |
| `abp.services.app.invoice.getLimoInvoiceForEdit` | POST | api/services/app/invoice/GetLimoInvoiceForEdit | [المصدر](../../../raw/application.js#L343500) |
| `abp.services.app.limoTrip.addTripLog` | POST | api/services/app/limoTrip/AddTripLog | [المصدر](../../../raw/application.js#L248566) |
| `abp.services.app.company.createOrUpdateCopmanyDriver` | POST | api/services/app/company/CreateOrUpdateCopmanyDriver | [المصدر](../../../raw/application.js#L181019) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L181246) |
| `abp.services.app.company.getAdvanceSettingsForDriver` | POST | api/services/app/company/GetAdvanceSettingsForDriver | [المصدر](../../../raw/application.js#L181282) |
| `abp.services.app.person.getDriverForEdit` | POST | api/services/app/person/GetDriverForEdit | [المصدر](../../../raw/application.js#L181326) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.stockReport.getItemsPurchaseHistory` | POST | api/services/app/stockReport/GetItemsPurchaseHistory | [المصدر](../../../raw/application.js#L382076) |
| `abp.services.app.stockReport.getItemsSaleHistory` | POST | api/services/app/stockReport/GetItemsSaleHistory | [المصدر](../../../raw/application.js#L382155) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |
| `abp.services.app.bill.importLoanPaymentPlanFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L326759) |
| `abp.services.app.payroll.getPayroll` | POST | api/services/app/payroll/GetPayroll | [المصدر](../../../raw/application.js#L100016) |
| `abp.services.app.deduction.getStaffAdvanceOrLoanPayments` | POST | [object Object] | [المصدر](../../../raw/application.js#L95716) |
| `abp.services.app.deduction.createOrUpdateDeduction` | POST | api/services/app/deduction/CreateOrUpdateDeduction | [المصدر](../../../raw/application.js#L95857) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L95868) |
| `abp.services.app.payment.getSalaryItemTypes` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L95884) |
| `abp.services.app.deduction.getDeductionForEdit` | POST | api/services/app/deduction/GetDeductionForEdit | [المصدر](../../../raw/application.js#L95903) |
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L329686) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypesDistinct` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypesDistinct | [المصدر](../../../raw/application.js#L329715) |
| `abp.services.app.creditNote.getChargesTypeAllocations` | POST | api/services/app/creditNote/GetChargesTypeAllocations | [المصدر](../../../raw/application.js#L329795) |
| `abp.services.app.tariffCard.getTariffCardsPeriodWise` | POST | api/services/app/tariffCard/GetTariffCardsPeriodWise | [المصدر](../../../raw/application.js#L139591) |
| `abp.services.app.depreciationDetail.getDepreciationDetailByAssetId` | POST | api/services/app/depreciationDetail/GetDepreciationDetailByAssetId | [المصدر](../../../raw/application.js#L159516) |
| `abp.services.app.deposit.useDepositWithAllocations` | POST | api/services/app/deposit/UseDepositWithAllocations | [المصدر](../../../raw/application.js#L338514) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L339427) |
| `abp.services.app.deposit.depositRefund` | POST | api/services/app/deposit/DepositRefund | [المصدر](../../../raw/application.js#L339174) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.trafficFine.getMovementOnVehicle` | POST | api/services/app/trafficFine/GetMovementOnVehicle | [المصدر](../../../raw/application.js#L342313) |
| `abp.services.app.customer.getSurcharge` | POST | [object Object] | [المصدر](../../../raw/application.js#L342333) |
| `abp.services.app.trafficFine.createOrUpdateTrafficFine` | POST | api/services/app/trafficFine/CreateOrUpdateTrafficFine | [المصدر](../../../raw/application.js#L342413) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |
| `abp.services.app.make.createOrUpdateMake` | POST | api/services/app/make/CreateOrUpdateMake | [المصدر](../../../raw/application.js#L101617) |
| `abp.services.app.make.getMakeForEdit` | POST | api/services/app/make/GetMakeForEdit | [المصدر](../../../raw/application.js#L101632) |
| `abp.services.app.make.searchMakes` | POST | api/services/app/make/SearchMakes | [المصدر](../../../raw/application.js#L115400) |
| `abp.services.app.vehicleModel.createOrUpdateVehicleModel` | POST | api/services/app/vehicleModel/CreateOrUpdateVehicleModel | [المصدر](../../../raw/application.js#L115409) |
| `abp.services.app.vehicleModel.getVehicleModelForEdit` | POST | api/services/app/vehicleModel/GetVehicleModelForEdit | [المصدر](../../../raw/application.js#L115424) |
| `abp.services.app.limoTripSearch.searchTripsToInvoice` | POST | api/services/app/limoTripSearch/SearchTripsToInvoice | [المصدر](../../../raw/application.js#L364738) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.deduction.getReceiptVoucherForDeduction` | POST | api/services/app/deduction/GetReceiptVoucherForDeduction | [المصدر](../../../raw/application.js#L95995) |
| `abp.services.app.deduction.addCashDeductionPayrollLine` | POST | api/services/app/deduction/AddCashDeductionPayrollLine | [المصدر](../../../raw/application.js#L96060) |
| `abp.services.app.vehicle.getVehiclesSummaryForMCC` | POST | api/services/app/vehicle/GetVehiclesSummaryForMCC | [المصدر](../../../raw/application.js#L445705) |
| `abp.services.app.movement.getMovementsSummaryForMCC` | POST | api/services/app/movement/GetMovementsSummaryForMCC | [المصدر](../../../raw/application.js#L445727) |
| `abp.services.app.inspection.getInspectionCountForDashBoard` | POST | api/services/app/inspection/GetInspectionCountForDashBoard | [المصدر](../../../raw/application.js#L445846) |
| `abp.services.app.vehicle.getLimoVehiclesSummary` | POST | api/services/app/vehicle/GetLimoVehiclesSummary | [المصدر](../../../raw/application.js#L300341) |
| `abp.services.app.limoTripSearch.getTripsSummary` | POST | api/services/app/limoTripSearch/GetTripsSummary | [المصدر](../../../raw/application.js#L243414) |
| `abp.services.app.transAgreement.getTransAgreementsSummary` | POST | api/services/app/transAgreement/GetTransAgreementsSummary | [المصدر](../../../raw/application.js#L300358) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Companies.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ForSale`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Chauffeur`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.SaleOrders`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Dashboard.DocumentExpiryModel`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reports.DailyRentalRevenueReport`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reports.DailyLeaseRevenueReport`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ReplaceVehicle`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Extend`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CutShort`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.UnClose`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.UpGrade`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ExtendCutShort`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.ReplaceVehicle`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.ReplaceDriver`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.UnClose`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.AllActionsOnOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.AgreementAdditionalCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.EditFinishTrip`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.EditInvoicedTrip`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Dispatch`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Start`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Finish`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Cancel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ViewTripLogs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.CustomerWebApp`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ChangeCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanViewCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Process_CreditCard.Payment`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Quotations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Quotations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Quotations.Approval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Quotations.CustomerApproval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.Approval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.Quotations.CustomerApproval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Reject`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Reject`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseRequest.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseRequest.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseRequest.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Reject`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Reject`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseReturns.View`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseReturns.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseReturns.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.masterAgreements.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.MasterAgreement.Detail`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Rental.MasterAgreement.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.WORKSHOP.JobEstimations.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.WORKSHOP.JobEstimations.RejectEstimation`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.DisposalApproval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementEditing`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementLogs`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.EditLimitedRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.Alerts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeChargesOnClosing`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeOnlyRecurringCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeDiscount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.PreClose.AllowLimitedUsersToEditOneTimeChargesOnPreClose`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelRate`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllowKMsLimitandExcessEditable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeAdvanceAmount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllowComplimentaryAgreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.AgreementGroups`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.MonthChange`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeLeaseClauses`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanEnterChangeDriverCommision`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditPeriod`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditLimit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Tenant.Integration.Fusion.Mappings`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.NoonPayments`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.AllActionsOnOtherBranchPayments`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.CostSettings.ManageVehicleCost`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Transfer`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Refund`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Used`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.EditUsedDeposit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnmarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.CanChangeFleetType`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.CanChangeOwnership`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SourceCodes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllowEditNextRegistrationDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllowEditNextInsuranceDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Inspections`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Transportation`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.masterFilters.ownership` | radio | radioAll |  |
| `vm.masterFilters.ownership` | radio | radioOwn |  |
| `vm.masterFilters.ownership` | radio | radioExternal |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeAll |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeRental |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeLease |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeReplacement |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeLimousine |  |
| `vm.masterFilters.ownership` | radio | radioAll |  |
| `vm.masterFilters.ownership` | radio | radioOwn |  |
| `vm.masterFilters.ownership` | radio | radioExternal |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeAll |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeRental |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeLease |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeReplacement |  |
| `vm.masterFilters.vehicleType` | radio | radioFleetTypeLimousine |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
