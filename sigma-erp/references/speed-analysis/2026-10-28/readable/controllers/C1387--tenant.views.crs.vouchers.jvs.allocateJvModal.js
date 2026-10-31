// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:378277-378317
appModule.controller('tenant.views.crs.vouchers.jvs.allocateJvModal',
        ['$uibModalInstance', 'JVId', '$filter', 'abp.services.app.jV', '$uibModal',
        function ($uibModalInstance, JVId, $filter, JVService, $uibModal) {
            var vm = this;
            vm.jvLines = [];

            vm.ok = function () {
                $uibModalInstance.close();
            };

            vm.rowSelected = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                allocatingVoucherLineId: row.id
                            };
                        }
                    }
                });
                $uibModalInstance.close();
            };

            function init() {
                vm.loading = true;
                JVService.getJVForEdit({ id: JVId }).success(function (data) {
                    vm.jv = data;
                    vm.jv.voucherLines.forEach(function (value) {
                        if (value.contactId)
                            vm.jvLines.push(value);
                    });
                    vm.loading = false;
                });
            }

            init();
        }]);
