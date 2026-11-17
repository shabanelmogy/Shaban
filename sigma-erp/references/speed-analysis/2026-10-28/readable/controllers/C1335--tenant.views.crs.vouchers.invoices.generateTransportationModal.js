// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:357274-357388
appModule.controller('tenant.views.crs.vouchers.invoices.generateTransportationModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', '$filter', 'abp.services.app.toll', 'abp.services.app.uaeFine',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, $filter, tollService, fineService) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
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
                
                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null)
                        invoicesToGenerate.push(invoiceDue);
                });

                if (invoicesToGenerate.length == 0) return;

                vm.saving = true;
                
                invoiceService.generateTransportationInvoices({ invoicesDue: invoicesToGenerate }).success(function (data) {
                    vm.generatedInvoices = data;

                    angular.forEach(vm.generatedInvoices, function (generateInvoice) {

                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            rowId: generateInvoice.rowId,
                        }, true);

                        if (foundLines.length > 0) {
                            foundLines[0].invoiceId = generateInvoice.invoiceId;
                            foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                            foundLines[0].error = generateInvoice.error;

                        }
                    });

                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.generatedInvoices = [];
                
                vm.loading = true;
                invoiceService.getTransportationInvoicesDueToGenerate().success(
                    function (result) {
                        vm.data = result;
                    }).finally(function () {
                        vm.loading = false;
                    });

              
            }

            init();
        }
    ]);
