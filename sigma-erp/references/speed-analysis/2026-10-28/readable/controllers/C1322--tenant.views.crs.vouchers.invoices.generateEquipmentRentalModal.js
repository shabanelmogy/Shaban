// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:347902-348370
appModule.controller('tenant.views.crs.vouchers.invoices.generateEquipmentRentalModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory', 'abp.services.app.masterAgreement', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService, masterAgreementService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.showEquipmentMergedInvoiceBtn = false;
            vm.disableEquipmentMergedInvoiceBtn = false;
            vm.equipmentMergedInvoice;
            var mergedInvoicesDueToGenerate = [];
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));

            vm.dueToGenerateCount = 0;
            vm.generatedCount = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");

            var generateNoOfInvoicesPerBatch = 10;

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.customer = customer;
                        vm.customerId = customer.id;
                    }
                });
            };
            vm.clearCustomer = function () {
                vm.customer = null;
                vm.customerId = null;
                vm.masterAgreements = null;
                vm.masterAgreement = null;
                vm.merge = false;
            };

            //vm.searchMasterAgreement = function ($select) {
            //    return masterAgreementService.searchMasterAgreements({ keyword: $select.search }).then(function (response) {
            //        vm.masterAgreements = response.data.items;
            //    });
            //};
            //vm.clearMasterAgreement = function () {
            //    vm.masterAgreement = null;
            //    vm.masterAgreementId = null;
            //};
            //vm.masterAgreementSelected = function () {
            //    vm.customer = vm.masterAgreement.quotation.customer;
            //    vm.customerId = vm.masterAgreement.quotation.customerId;
            //    vm.masterAgreementId = vm.masterAgreement.id;
            //};

            vm.customerSelected = function () {
                return masterAgreementService.getMasterAgreementsByCustomer({ id: vm.customerId }).then(function (response) {
                    vm.masterAgreements = response.data;
                    vm.masterAgreement = null;
                    vm.masterAgreementId = null;
                });
            };


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.boxTicked = function (row) {
                vm.canPreviewSingleInvoice = false;
                if (vm.merge) {
                    var foundLines = $filter('filter')(vm.data.invoicesDue, {
                        customerId: row.customerId,
                        //invoiceFromDate: row.invoiceFromDate,
                        //invoiceToDate: row.invoiceToDate,
                    }, true);
                    vm.data.invoicesDue = foundLines;
                }
                else {
                    var noOfInvoicesDueSelected = vm.data.invoicesDue.filter(e => e.generate).length
                    if (noOfInvoicesDueSelected == 1)
                        vm.canPreviewSingleInvoice = true;
                }
            };

            vm.allBoxTicked = function () {
                if (vm.data == null) return;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.invoiceNo == null)
                        invoiceDue.generate = vm.all;
                });
            };

            vm.getInvoicingRule = function (id) {
                if (id == 1)
                    return app.localize('DateToDate');
                else if (id == 2)
                    return app.localize('CalendarMonth');
                else if (id == 3)
                    return app.localize('ThirtyDays');
                else
                    return '';
            };

            vm.getInvoicingType = function (id) {
                if (id == 1)
                    return app.localize('Advance');
                else if (id == 2)
                    return app.localize('Post');
                else
                    return '';
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.generate = function () {
                var invoicesToGenerate = [];
                var i = 1;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.invoiceToDriverNo == null && invoiceDue.error == null && i <= generateNoOfInvoicesPerBatch) {
                        if (vm.merge)
                        {
                            invoiceDue.invoiceDate = vm.invoiceDate;
                        }
                        
                        invoicesToGenerate.push(invoiceDue);
                        i += 1;
                    }
                });

                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;

                invoiceService.generateEquipmentInvoices({ invoicesDue: invoicesToGenerate }).success(function (data) {
                    generatedInvoices = data;

                    angular.forEach(generatedInvoices, function (generateInvoice) {

                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            rowId: generateInvoice.rowId,
                        }, true);

                        if (foundLines.length > 0) {
                            foundLines[0].invoiceId = generateInvoice.invoiceId;
                            foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                            foundLines[0].error = generateInvoice.error;
                            foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                            foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;


                            if (generateInvoice.invoiceId > 0 || generateInvoice.invoiceToDriverId > 0)
                                vm.generatedCount += 1;
                        }
                    });

                    if (generatedInvoices.length > 0) //continue generating invoices till not invoice is pending to generate
                        vm.generate();
                    else
                        vm.saving = false;

                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {

                });
            };

            function checkIfSameDeliveryNoteSelectedMultipleTimes(invoicesToGenerate) {
                if (invoicesToGenerate.length != [...new Set(invoicesToGenerate.map(e => e.agreementId))].length) {
                    abp.message.info('Multiple periods for one delivery note cannot be merged in one invoice.');
                    vm.saving = false;
                    return true;
                }
                return false;
            }

            vm.previewMergeInvoice = function () {
                var invoice = null;
                var invoicesToGenerate = [];

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true)
                        invoicesToGenerate.push(invoiceDue);
                });
                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }

                if (checkIfSameDeliveryNoteSelectedMultipleTimes(invoicesToGenerate))
                    return;


                mergedInvoicesDueToGenerate = invoicesToGenerate;

                openMergePreviewprintModal(invoicesToGenerate);

               // openViewMergeInvoiceModal(invoicesToGenerate);

            };
            function openViewMergeInvoiceModal(invoicesToGenerate) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/previewMergeInvoiceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.previewMergeInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        //invoiceId: null,
                        options: {
                            invoicesToGenerate: invoicesToGenerate,
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.equipmentMergedInvoice = result;
                    vm.showEquipmentMergedInvoiceBtn = true;
                });
            }

            vm.openViewSingleInvoiceModal = function () {
                var invoiceToGenerate = vm.data.invoicesDue.filter(e => e.generate == true)[0];
                // openViewSingleInvoiceModal(invoiceToGenerate);
                openprintModal(invoiceToGenerate);
            };

            function openViewSingleInvoiceModal(invoiceToGenerate) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/previewSingleInvoiceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.previewSingleInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        //invoiceId: null,
                        options: {
                            invoiceToGenerate: invoiceToGenerate,
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        vm.showEquipmentMergedInvoiceBtn = false;
                        invoiceToGenerate.invoiceDate = result.date;
                    }
                });
            }
            vm.changeInvoiceDate = function ()
            {
                if (vm.merge)
                {
                   
                    angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                        if (invoiceDue.generate == true)
                        {
                            invoiceDue.invoiceDate = vm.invoiceDate;
                                
                        }
                    });

                }
            }
            function openMergePreviewprintModal(invoicesToGenerate) {
                if (invoicesToGenerate) {
                    invoiceService.previewEquipmentMergeInvoice({
                        invoicesDue: invoicesToGenerate,
                        IsMerge: true
                    }).success(function (data) {
                        var invoiceToPrintPreview = data;
                        vm.masterAgreementNo = invoicesToGenerate[0].masterAgreementNo;

                        //openViewInvoiceModal(mergeInvoicePreview);
                        vm.isMergedInvoice = invoiceToPrintPreview.voucherSubTypeId == 46 && !invoiceToPrintPreview.agreementId;

                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                            controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                filters: null,
                                previewVoucher: function () {
                                    return invoiceToPrintPreview;
                                },
                                exportWord: false,
                                exportPrintToWord: false,
                                isArabic: function () {
                                    return false; // or true, or logic to detect locale
                                }
                            }
                        });

                        modalInstance.result.then(function (result) {
                            if (result) {
                                vm.equipmentMergedInvoice = result;
                                vm.showEquipmentMergedInvoiceBtn = true;
                            }
                        });

                    }).error(function (response) {
                        abp.message.error(response.error);
                        vm.saving = false;

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            function openprintModal(invoiceToGenerate) {

                if (invoiceToGenerate) {
                    invoiceService.previewEquipmentSingleInvoice(invoiceToGenerate).success(function (data) {
                        var invoiceToPrintPreview = data;

                        invoiceToPrintPreview.rentWithOperator = invoiceToPrintPreview.voucherLines.filter(e => e.chargesTypeId == 1 || e.chargesTypeId == 70).reduce((a, c) => a += c.credit, 0);
                        invoiceToPrintPreview.rentWithOperatorTax = invoiceToPrintPreview.voucherLines.filter(e => e.chargesTypeId == 1 || e.chargesTypeId == 70).reduce((a, c) => a += c.tax, 0);

                        invoiceToPrintPreview.masterAgreementNo = invoiceToGenerate.masterAgreementNo;

                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                            controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                filters: null,
                                previewVoucher: function () {
                                    return invoiceToPrintPreview;
                                },
                                exportWord: false,
                                exportPrintToWord: false,
                                isArabic: function () {
                                    return false; // or true, or logic to detect locale
                                }
                            }
                        });

                        modalInstance.result.then(function (result) {
                            if (result) {
                                vm.canPreviewSingleInvoice = false;
                                invoiceToGenerate.invoiceDate = result.date;
                            }
                        });

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };


            vm.generateMergeInvoice = function () {
                vm.loading = true;
                vm.equipmentMergedInvoice.voucherLines.forEach(e => e.agreement = null);
                invoiceService.createEquipmentMergedInvoice(vm.equipmentMergedInvoice)
                    .success(function (result) {
                        vm.generatedCount = 1;
                        mergedInvoicesDueToGenerate.forEach(e => {
                            e.invoiceNo = result;
                        });
                        vm.disableEquipmentMergedInvoiceBtn = true;
                    }).finally(function () { vm.loading = false; });
            }

            vm.mergeInvoice = function () {
                var invoicesToGenerate = [];

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true)
                        invoicesToGenerate.push(invoiceDue);
                });
                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }
                vm.saving = true;
                invoiceService.generateEquipmentInvoices({
                    invoicesDue: invoicesToGenerate,
                    IsMerge: vm.merge,
                })
                    .success(function (data) {
                        generatedInvoices = data;
                        angular.forEach(generatedInvoices, function (generateInvoice) {
                            var foundLines = $filter('filter')(vm.data.invoicesDue, {
                                rowId: generateInvoice.rowId,
                            }, true);
                            if (foundLines.length > 0) {
                                foundLines[0].invoiceId = generateInvoice.invoiceId;
                                foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                                foundLines[0].error = generateInvoice.error;
                                foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                                foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;
                            }
                            vm.saving = false;
                        });

                    }).error(function (response) {
                        abp.message.error(response.error);
                        vm.saving = false;

                    }).finally(function () {

                    });
            };

            vm.getEquipmentRentalInvoicesDueToGenerate = function () {
                generatedInvoices = [];

                vm.loading = true;
                invoiceDueService.getEquipmentInvoicesDueToGenerate({ agreementCategory: 7, agreementNo: vm.agreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId, masterAgreementNo: vm.masterAgreement.agreementNo }).success(
                    function (result) {
                        vm.data = result;
                        vm.dueToGenerateCount = vm.data.invoicesDue.length;
                        if (vm.data.invoicesDue.length > 0)
                            vm.invoiceDate = vm.data.invoicesDue[0].invoiceDate;
                        vm.generatedCount = 0;
                        vm.disableEquipmentMergedInvoiceBtn = false;
                        vm.showEquipmentMergedInvoiceBtn = false;

                    }).finally(function () {
                        vm.loading = false;
                    });
            };
        }
    ]);
