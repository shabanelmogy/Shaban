// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:320501-320561
appModule.controller('tenant.views.crs.vouchers.bills.allocateBillModal',
        ['$uibModalInstance', 'BillId', '$filter', 'abp.services.app.bill', '$uibModal',
            function ($uibModalInstance, BillId, $filter, billService, $uibModal) {
                var vm = this;
                vm.billLines = [];

                vm.ok = function () {
                    $uibModalInstance.close();
                };

                vm.rowSelected = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/createAllocationBill.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.createAllocationBill as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            options: function () {
                                return {
                                    allocatingVoucherLineId: row.id,
                                    BillId: BillId
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
                openAllocateBillModal = function (BillId) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/allocateBillModal.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.allocateBillModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            BillId: function () {
                                return BillId;
                            }
                        }
                    });

                }
                function init() {
                    vm.loading = true;
                    billService.getBillForEdit({ id: BillId }).success(function (data) {
                        vm.bill = data;
                        vm.bill.voucherLines.forEach(function (value) {
                            if (value.contactId)
                                vm.billLines.push(value);
                        });
                        vm.loading = false;
                    });
                }

                init();
            }]);
