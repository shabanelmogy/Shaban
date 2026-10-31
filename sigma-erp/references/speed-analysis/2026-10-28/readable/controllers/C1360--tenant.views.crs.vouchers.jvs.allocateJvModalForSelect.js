// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:366276-366336
appModule.controller('tenant.views.crs.vouchers.jvs.allocateJvModalForSelect',
        ['$uibModalInstance', 'JVId', '$filter', 'abp.services.app.jV', '$uibModal',
        function ($uibModalInstance, JVId, $filter, JVService, $uibModal) {
            var vm = this;
            vm.jvLines = [];

            vm.ok = function () {
                $uibModalInstance.close();
            };

            vm.rowSelected = function (row) {
               
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/createAllocationJv.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createAllocationJv as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                allocatingVoucherLineId: row.id,
                                JVId: JVId
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    //init();
                    debugger;
                    //openAllocateJvModal(1394534);
                });
                $uibModalInstance.close();
            };
            openAllocateJvModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/allocateJvModalForSelect.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.allocateJvModalForSelect as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        }
                    }
                });
                
            }
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
