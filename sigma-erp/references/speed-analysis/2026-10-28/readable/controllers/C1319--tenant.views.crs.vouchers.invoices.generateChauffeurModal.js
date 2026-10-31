// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:346976-347152
appModule.controller('tenant.views.crs.vouchers.invoices.generateChauffeurModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory','utilities',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));

                        
            vm.dueToGenerateCount = 0;
            vm.generatedCount = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

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
                //vm.merge = false;
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

            vm.getInvoicesDueToGenerate = function () {
                generatedInvoices = [];

                vm.loading = true;
                invoiceDueService.getInvoicesDueToGenerate({ agreementCategory: 4, agreementNo: vm.agreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId }).success(
                    function (result) {
                        vm.data = result;
                        vm.dueToGenerateCount = vm.data.invoicesDue.length;
                        vm.generatedCount = 0;

                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            

            //init();
        }
    ]);
