// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:347675-347899
appModule.controller('tenant.views.crs.vouchers.invoices.generateEquipmentLeaseModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.dueToGenerateCount = 0;
            vm.generatedCount = 0;
            var generatedInvoices = null;
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
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
                vm.merge = false;
            };
            vm.boxTicked = function (row) {
                if (vm.merge) {
                    var foundLines = $filter('filter')(vm.data.invoicesDue, {
                        customerId: row.customerId,
                        invoiceFromDate: row.invoiceFromDate,
                        invoiceToDate: row.invoiceToDate,
                    }, true);
                    vm.data.invoicesDue = foundLines;
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

            //generate invoices in batches 25 invoices per request
            vm.generate = function () {
                var invoicesToGenerate = [];

                var i = 1;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.error == null && i <= generateNoOfInvoicesPerBatch) {
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

                            if (generateInvoice.invoiceId > 0)
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

            vm.getLeaseInvoicesDueToGenerate = function () {
                generatedInvoices = [];
                vm.loading = true;
                invoiceDueService.getInvoicesDueToGenerate({ agreementCategory: 8, agreementNo: vm.agreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId, masterAgreementNo: vm.masterAgreementNo }).success(
                    function (result) {
                        vm.data = result;
                        vm.dueToGenerateCount = vm.data.invoicesDue.length;
                        vm.generatedCount = 0;

                    }).finally(function () {
                        vm.loading = false;
                    });
            };

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

                            }
                            vm.saving = false;
                        });

                    }).error(function (response) {
                        abp.message.error(response.error);
                        vm.saving = false;

                    }).finally(function () {

                    });
            };

            vm.sendCaptcha = function (row) {
                var event = new CustomEvent('sendCaptchaAndDownloadEvent', { detail: row.captchaTxt + ',' + row.trafficFile.fileId });
                event.initEvent('sendCaptchaAndDownloadEvent');
                document.dispatchEvent(event);
            };
        }
    ]);
