// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:39849-39899
appModule.controller('host.views.cbs.projectsDashboard.generateInvoiceModal', [
        '$scope', '$uibModalInstance', 'milestone', '$uibModal', 'abp.services.app.milestone', 'abp.services.app.currency',
        function ($scope, $uibModalInstance, milestone, $uibModal, milestoneService, currencyService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.documents = [];
            

            vm.milestone = angular.copy(milestone);
            vm.businessDivision = milestone.project.businessDivision;
            var existingAmount = parseFloat((vm.milestone && vm.milestone.amount) || 0);
            vm.amountLocked = existingAmount > 0;
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items;
                    if (vm.businessDivision && vm.businessDivision.currencyId) {
                        var match = vm.currencies.find(c => c.id === vm.businessDivision.currencyId);
                        if (match) {
                            vm.selectedCurrencyCode = match.code; 
                        }
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.save = function () {
                vm.saving = true;
                milestoneService.projectInvoiceGenerate(
                    vm.milestone
                ).success(function (voucherNo) {
                    abp.notify.info("Generate Successfully");
                    vm.milestone.invoiceNo = voucherNo;

                    $uibModalInstance.close(vm.milestone);
                }).finally(function () {
                    vm.saving = false;
                });
            };
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getCurrencies();

            
        }
    ]);
