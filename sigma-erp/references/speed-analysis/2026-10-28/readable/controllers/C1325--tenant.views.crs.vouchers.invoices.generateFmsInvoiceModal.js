// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:349115-349389
appModule.controller('tenant.views.crs.vouchers.invoices.generateFmsInvoiceModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', '$filter', 'abp.services.app.directory',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, $filter, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.downloadingTolls = false;
            vm.downloadingFines = false;
                        
            vm.dueToGenerateCount = 0;
            vm.generatedCount = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            //Modified by arslan for Qatar fines
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");

            vm.isSalikModuleEnabledAndClubbedInvoice = vm.isSalikModuleEnabled && abp.setting.get("App.General.TollsInvoice") == 1;
            vm.isFineModuleEnabledAndClubbedInvoice = (vm.isAuhFinesModuleEnabled || vm.isDxbFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && abp.setting.get("App.General.TrafficFineInvoice") == 1;

            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.showFine = (vm.isDxbFinesModuleEnabled || vm.isAuhFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && (parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? false : true);
            vm.showSalik = (vm.isSalikModuleEnabled) && (parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? false : true);
            vm.includeFines = parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? true : false;
            vm.includeSalik = parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? true : false;

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
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
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

            vm.generate = function () {
                var invoicesToGenerate = [];
                var i = 1;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.invoiceToDriverNo == null && invoiceDue.error == null && i <= generateNoOfInvoicesPerBatch) {
                        invoicesToGenerate.push(invoiceDue);
                        i += 1;
                    }
                });

                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;

                invoiceService.generateInvoices({ invoicesDue: invoicesToGenerate }).success(function (data) {
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
                invoiceService.generateInvoices({
                    invoicesDue: invoicesToGenerate,
                    IsMerge: vm.merge,
                    includeFines: vm.includeFines,
                    includeSalik: vm.includeSalik
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


            //Old downloading methods 
            //---------------------------------------
            //function downloadTolls() {
            //    vm.downloadingTolls = true;
            //    tollService.downloadAllTolls(
            //    ).success(function (result) {

            //    }).finally(function () {
            //        vm.downloadingTolls = false;
            //    });
            //}

            //function downloadFines() {
            //    vm.downloadingFines = true;
            //    fineService.downloadAllFines(
            //      ).success(function (result) {

            //      }).finally(function () {
            //          vm.downloadingFines = false;
            //      });
            //}

            vm.getInvoicesDueToGenerate = function () {
                generatedInvoices = [];

                vm.loading = true;
                invoiceService.getFmsInvoicesDueToGenerate({ agreementCategory: 1, agreementNo: vm.agreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId }).success(
                    function (result) {
                        vm.data = result;
                        vm.dueToGenerateCount = vm.data.invoicesDue.length;
                        vm.generatedCount = 0;

                    }).finally(function () {
                        vm.loading = false;
                    });

                ////if salik or fine enabled then first download then get agreement list after downloading
                ////if (vm.isSalikModuleEnabledAndClubbedInvoice || vm.isFineModuleEnabledAndClubbedInvoice) {
                //if (vm.isSalikModuleEnabledAndClubbedInvoice)
                //    downloadTolls();

                ////if Dubai/Abu Dhabi Fines are enabled
                //if (vm.isFineModuleEnabledAndClubbedInvoice)
                //    downloadFines();
                ////}
            };

        }
    ]);
