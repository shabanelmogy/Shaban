// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:348373-348635
appModule.controller('tenant.views.crs.vouchers.invoices.generateExcessKMsModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory', 'options','utilities',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService, options, utilities) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.invoicesDue = null;
            vm.dueToGenerateCount = 0;
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.generatedCount = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.agreementDashboardFilters = null;
            if (options.agreement) {
                vm.agreementDashboardFilters = options.agreement;
            }
            

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
                    var foundLines = $filter('filter')(vm.invoicesDue, {
                        customerId: row.customerId,
                        invoiceFromDate: row.invoiceFromDate,
                        invoiceToDate: row.invoiceToDate,
                    }, true);
                    vm.invoicesDue = foundLines;
                }
            };

            vm.allBoxTicked = function () {
                if (vm.invoicesDue == null) return;

                angular.forEach(vm.invoicesDue, function (invoiceDue) {
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

            vm.startKMsChanged = function (row) {
                row.kMsDifference = row.endKMs - row.startKMs
            }

            vm.endKMsChanged = function (row, invoice) {
                row.kMsDifference = row.endKMs - row.startKMs;

                invoice.drivenKMs = 0.0;
                invoice.vehiclesKMs.forEach(e => {
                    invoice.drivenKMs += e.kMsDifference;
                });
                if (invoice.allowedKMs < invoice.drivenKMs)
                    invoice.excessKMs = invoice.drivenKMs - invoice.allowedKMs;
                else
                    invoice.excessKMs = 0;


                var nextTickedInvoice = vm.invoicesDue.filter(e => e.rowId > invoice.rowId)[0];
                if (nextTickedInvoice) {
                    var sameVehicleRow = nextTickedInvoice.vehiclesKMs.find(e => e.vehicleId == row.vehicleId);
                    if (sameVehicleRow) {
                        sameVehicleRow.startKMs = row.endKMs;
                        sameVehicleRow.startKMsEditable = false;
                        sameVehicleRow.kMsDifference = sameVehicleRow.endKMs - sameVehicleRow.startKMs;

                        nextTickedInvoice.drivenKMs = 0.0;
                        nextTickedInvoice.vehiclesKMs.forEach(e => {
                            nextTickedInvoice.drivenKMs += e.kMsDifference;
                        });
                        if (nextTickedInvoice.allowedKMs < nextTickedInvoice.drivenKMs)
                            nextTickedInvoice.excessKMs = nextTickedInvoice.drivenKMs - nextTickedInvoice.allowedKMs;
                        else
                            nextTickedInvoice.excessKMs = 0;
                    }
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.generate = function () {
                var invoicesToGenerate = [];
                var i = 1;

                angular.forEach(vm.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.error == null && i <= generateNoOfInvoicesPerBatch) {
                        var excessKMsObj = {
                            agreementId: invoiceDue.agreementId,
                            fromDate: invoiceDue.invoiceFromDate,
                            toDate: invoiceDue.invoiceToDate,
                            drivenKMs: invoiceDue.drivenKMs,
                            allowedKMs: invoiceDue.allowedKMs,
                            excessKMs: invoiceDue.excessKMs,
                            vehiclesKMs: invoiceDue.vehiclesKMs
                        };
                        var inputOBJECT = { invoiceDue: invoiceDue, agreementExcessKMs: excessKMsObj };
                        invoicesToGenerate.push(inputOBJECT);
                        i += 1;
                    }
                });
                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;
                vm.isEnableGeneratedInvoices = false;

                invoiceService.generateExcessKMsInvoices({ invoicesDue: invoicesToGenerate }).success(function (data) {
                    generatedInvoices = data;

                    angular.forEach(generatedInvoices, function (generateInvoice) {

                        var foundLines = $filter('filter')(vm.invoicesDue, {
                            rowId: generateInvoice.rowId,
                        }, true);

                        if (foundLines.length > 0) {
                            foundLines[0].invoiceId = generateInvoice.invoiceId;
                            foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                            foundLines[0].error = generateInvoice.error;
                            foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                            //foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;


                            if (generateInvoice.invoiceId > 0 || generateInvoice.invoiceToDriverId > 0)
                                vm.generatedCount += 1;
                        }
                    });
                    vm.isEnableGeneratedInvoices = true;

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

            vm.getInvoicesDueToGenerate = function () {
                vm.isEnableGeneratedInvoices = false;
                generatedInvoices = [];

                vm.loading = true;
                invoiceDueService.getExcessKMInvoicesDueToGenerate({ agreementCategory: 1, agreementNo: vm.agreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId }).success(
                    function (result) {
                        vm.invoicesDue = result;
                        vm.dueToGenerateCount = vm.invoicesDue.length;
                        vm.generatedCount = 0;

                        //vm.invoicesDue.forEach(invoice => {
                        //    vm.endKMsChanged
                        //});
                    }).finally(function () {
                        vm.loading = false;
                    });
                
            };

            function init() {
                if (vm.agreementDashboardFilters) {
                    vm.asOfDate = moment();
                    vm.customer = vm.agreementDashboardFilters.customer;
                    vm.customerId = vm.customer.id;
                    vm.agreementNo = vm.agreementDashboardFilters.agreementNo;
                    vm.getInvoicesDueToGenerate();
                }
            }
            init();

        }
    ]);
