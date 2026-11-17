// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:141402-141438
appModule.controller('tenant.views.crs.agreements.driverChargesModal',
        ['$uibModalInstance', 'agreementCharges', '$filter',
            function ($uibModalInstance, agreementCharges, $filter) {
                var vm = this;
                vm.chargesSettings = agreementCharges;
                vm.boxTicked = function (row) {
                    if (row.chargesTypeId == 7) {
                        var foundLines = $filter('filter')(vm.chargesSettings, {
                            chargesTypeId: 33
                        }, true);
                        if (foundLines.length > 0) {
                            foundLines[0].invoiceToDriver = row.invoiceToDriver;
                        }
                    }
                    else if (row.chargesTypeId == 8) {
                        var foundLines = $filter('filter')(vm.chargesSettings, {
                            chargesTypeId: 34
                        }, true);
                        if (foundLines.length > 0) {
                            foundLines[0].invoiceToDriver = row.invoiceToDriver;
                        }
                    }
                };
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.applyChange = function () {
                    vm.chargesSettings.forEach(function (value) {
                        value.selected = vm.all;
                    });
                };
                vm.saveDriverCharges = function () {
                    $uibModalInstance.close(vm.chargesSettings);
                }


            }]);
