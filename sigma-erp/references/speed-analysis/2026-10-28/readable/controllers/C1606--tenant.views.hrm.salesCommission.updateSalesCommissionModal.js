// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:442479-442550
appModule.controller('tenant.views.hrm.salesCommission.updateSalesCommissionModal', [
        '$uibModalInstance', 'abp.services.app.salesCommission', 'options',
        function ($uibModalInstance, salesCommissionService, options) {

            var vm = this;
            vm.loading = false;

            var salesCommissionId = options.id;
            vm.modifiedRows = [];

            vm.filters = {
                skipCount: 0,
                maxResultCount: vm.batchSize
            };
            vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
            vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // Save function
            vm.save = function () {
                vm.isSaving = true;

                // Send only the modified rows to the backend
                var modifiedData = vm.modifiedRows.map(function (row) {
                    return {
                        staffId: row.staffId,
                        notes: row.notes,
                        amount: row.amount,
                    };
                });

                salesCommissionService.createOrUpdateSalesCommission({
                    id: salesCommissionId,
                    fromDate: vm.filters.fromDate,
                    toDate: vm.filters.toDate,
                    staffSalesCommissions: modifiedData
                })
                    .success((id) => {
                        vm.isSalesCommissionForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Sales Commission Updated Successfully.");

                    })
                    .finally(() => {
                        vm.isSaving = false;
                        vm.isSalesCommissionForSave = false;
                        $uibModalInstance.close();
                    });
            };

            // Function to track changes
            vm.onSalesCommissionsChange = function (row) {
                if (!vm.modifiedRows.includes(row)) {
                    vm.modifiedRows.push(row);
                }
            };

            function init() {
                vm.loading = true;
                salesCommissionService.getSalesCommissionForEdit({ id: salesCommissionId }).success(function (result) {
                    vm.salesCommission = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
