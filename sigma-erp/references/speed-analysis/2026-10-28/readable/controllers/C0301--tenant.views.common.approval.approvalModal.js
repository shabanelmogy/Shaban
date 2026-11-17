// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84729-84920
appModule.controller('tenant.views.common.approval.approvalModal', [
        'appSession', '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.purchaseRequest', 'abp.services.app.approval', 'approvalId', 'form', 'recordId', 'abp.services.app.user', 'formValue',
        function (appSession, $uibModal, $uibModalInstance, utilities, purchaseRequestService, approvalAppService, approvalId, form, recordId, userService, formValue) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.viewMode = null;
            vm.approvalId = approvalId;
            vm.formValue = formValue;
            vm.tempIsUserInBranch = [];
            vm.isApproveEnable = false;

            vm.form = form;
            vm.recordId = recordId;
            vm.roles = [];
            vm.currentRoles = [];
            vm.currentUserId = appSession.user.id;
            vm.isUserInBranch = [];
            vm.voucherLines = [];
            vm.getRoleByUserId = function () {
                return userService.getRoleByUserId({ id: vm.currentUserId })
                    .success(function (data) {
                        vm.currentRoles = data;
                    }).finally(function () {
                        vm.canApproveOrRejectColumnWise();
                    });
            }
            vm.convertTemptoUserInBranch = function () {
                for (var element of vm.tempIsUserInBranch) {
                    for (var i = 0; i < element.length; i++) {
                        vm.isUserInBranch.push(element[i]);
                    }
                }
            }

            vm.canApproveOrReject = function (row, index) {
                var canApproveOrReject = true;
                vm.convertTemptoUserInBranch();
                if ((vm.currentRoles.some(x => x.id == row.roleId) || vm.currentUserId == row.userId) && row.status == 1) {
                    if (index != 0) {
                        for (var i = 0; i < index; i++) {
                            var current = vm.approvalLines[i];
                            if (current.status != 2)
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
                vm.approvalLines.forEach(function (e, i) {
                    e.approvable = vm.canApproveOrReject(e, i);
                });
                if (vm.approvalLines.some(e => e.approvable == true))
                    return true;
                else return false;
            };

            function openRejectionReasonModal(companyId, row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/approval/rejectionReason.cshtml',
                    controller: 'tenant.views.common.approval.rejectionReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        },
                        fromApproval: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.rejectionBySpecificUser({ approvalId: row.approvalId, recordId: vm.recordId, form: vm.form, id: row.id, rejectionReason: result })
                        .success(function (data) {
                            abp.notify.info(app.localize('Rejected.'));
                            vm.approvalLines = data && data.length > 0 ? data : vm.approvalLines;
                            //vm.approvalLines.find(x => x.id == row.id).status = 3;
                            vm.canApproveOrRejectColumnWise();
                        }).finally(function () {
                            vm.loading = false;
                        });
                });
            };

            vm.approveRow = function (row) {
                abp.message.confirm(
                    'Do you really want to approve?',
                    function (isConfirmed) {

                        if (isConfirmed) {
                            vm.loading = true;
                            approvalAppService.approvalBySpecificUser({ approvalId: row.approvalId, recordId: vm.recordId, form: vm.form, id: row.id })
                                .success(function (data) {
                                    abp.notify.info(app.localize('Approved.'));
                                    vm.approvalLines = data && data.length > 0 ? data : vm.approvalLines;
                                    //vm.approvalLines.find(x => x.id == row.id).status = 2;
                                    vm.canApproveOrRejectColumnWise();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }

                    }
                );
            };

            vm.rejectRow = function (row) {

                var modalInstance = openRejectionReasonModal(formValue.id, row);

            };
            vm.cancel = function () {
                $uibModalInstance.close();
            };
            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };
            vm.getSources = function (code) {
                if (code === 1)
                    return "Lease Quotation";
                else if (code === 2)
                    return "Rental Quotation";
                else
                    return "Lease Quotation";
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
            vm.getStatus = function (status) {
                if (status == 1)
                    return app.localize("NotApproved");
                else if (status == 2)
                    return app.localize("Approved");
                else if (status == 3)
                    return app.localize("Rejected");
            }
            vm.getRoles = function (id) {
                id = id ? id : null;
                return userService.getRole({ id: id }).then(function (response) {
                    vm.roles = response.data;
                });
            };

            vm.getRole = function (id) {
                var result = vm.roles.filter(x => x.id == id);
                return result[0] ? result[0].displayName : '';
            };

            function init() {
                approvalForm();
            }



            function approvalForm() {
                vm.loading = true;
                vm.approvalLines = [];
                approvalAppService.getApprovals({ id: vm.approvalId })
                    .success(function (data) {
                        vm.approvalLines = data.approvalLines;
                        vm.isResubmitted = data.isResubmitted;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getRoleByUserId();
            vm.getRoles();
            init();
        }
    ]);
