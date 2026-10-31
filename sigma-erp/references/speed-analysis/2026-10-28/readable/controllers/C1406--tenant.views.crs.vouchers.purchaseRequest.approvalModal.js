// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:382549-382647
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.approvalModal', [
        'appSession', '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.purchaseRequest','purchaseRequest', 
        function (appSession, $uibModal, $uibModalInstance, utilities, purchaseRequestService, purchaseRequest) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.viewMode = null;
            vm.purchaseRequest = purchaseRequest;

            vm.currentUserId = appSession.user.id;

            vm.canApproveOrReject = function (row, index) {
                var canApproveOrReject = true;
                if (row.userId == vm.currentUserId && !row.isApproved && !row.isRejected) {
                    if (index != 0) {
                        for (var i = 0; i < index; i++) {
                            var current = vm.purchaseRequest.approvals[i];
                            if (!current.isApproved) 
                                canApproveOrReject = false;
                            
                        }
                    }
                }
                else {
                    canApproveOrReject = false;
                }
                return canApproveOrReject;
            };

            vm.canApproveOrRejectColumnWise = function () {
                vm.purchaseRequest.approvals.forEach(function (e, i) {
                    e.approvable = vm.canApproveOrReject(e, i);
                });
                if (vm.purchaseRequest.approvals.some(e => e.approvable == true))
                    return true;
                else false;
            };
            vm.approveRow = function (row) {
                vm.loading = true;

                purchaseRequestService.voucherApprovalBySpecificUser({ id: row.id })
                    .success(function (data) {
                        vm.purchaseRequest.approvals = data;
                        vm.canApproveOrRejectColumnWise();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.rejectRow = function (row) {
                vm.loading = true;

                purchaseRequestService.voucherRejectionBySpecificUser({ id: row.id })
                    .success(function (data) {
                        vm.purchaseRequest.approvals = data;
                        vm.canApproveOrRejectColumnWise();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            vm.cancel = function () {
                $uibModalInstance.close();
            };
            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            
            vm.localize = function (input) {
                return app.localize(input);
            };

            function init() {
                vm.loading = true;
                purchaseRequestService.getVoucherApprovals({ id: purchaseRequest.id })
                    .success(function (data) {
                        vm.purchaseRequest.approvals = data;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            init();
        }
    ]);
