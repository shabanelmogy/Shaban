// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:438599-438886
appModule.controller('tenant.views.hrm.leaves.leaveApprovalModal', [
        'appSession', '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.directory', 'abp.services.app.leave', 'abp.services.app.user', 'leaveId',
        function (appSession, $uibModal, $uibModalInstance, utilities, directoryService, leaveService, userService, leaveId) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.IsChangeLeaveStatus = false;
            vm.viewMode = null;
            vm.approvalId = leaveId;
            //vm.formValue = formValues;
            vm.tempIsUserInBranch = [];
            vm.isReadOnly = true;
            vm.getTotalRegistration = function () {
                return vm.formValue.voucherLines ? vm.formValue.voucherLines.filter(x => x.valueField2).reduce((p, c) => p + (c.valueField2 * c.quantity), 0) : 0;
            }
            vm.name = [];
            vm.roles = [];
            vm.currentRoles = [];
            vm.appSessioncurrentUserId = appSession.user.id;
            vm.currentUserId;
            vm.isUserInBranch = [];
            vm.voucherLines = [];
            vm.enumApproverTypes = [
                { name: "ReportingTo", id: 1 },
                { name: "Having Designation", id: 2 },
                //{ name: "Department", id: 3 },
                { name: "Staff", id: 3 },
                { name: "Having Role", id: 4 }
            ];
            vm.enumStatus = [
                { name: "NotApproved", id: 1 },
                { name: "Approved", id: 2 },
                { name: "Rejected", id: 3 },
            ];
            function getCurrentUserInfo() {
                return userService.getUserForEdit(appSession.user).then(function (response) {
                    vm.currentUserInfo = response.data;
                    vm.currentUserId = response.data.user.contactId;
                });
            }

            vm.getApproverTypeName = function (id) {
                var matchingType = vm.enumApproverTypes.find(function (type) {
                    return type.id === id;
                });

                return matchingType ? matchingType.name : ''; // Return the name or an empty string if not found
            };

            vm.getStatusName = function (id) {
                var matchingType = vm.enumStatus.find(function (type) {
                    return type.id === id;
                });
                return matchingType ? matchingType.name : ''; // Return the name or an empty string if not found
            };

            vm.getContactName = function (id) {
                if (id != null) {
                    return directoryService.getContactInfo({ Id: id }).then(function (response) {
                        vm.name[id] = response.data.name;
                    });
                } else {
                    return null;
                }
            };

            vm.canApproveOrReject = function (row, index) {
                var canApproveOrReject = false;
                var user = null;
                if (row.approvalStatus != 2) {
                    if (row.approverType == 1 && row.staffId == vm.currentUserId) {
                        var rowIndex = index - 1;
                        var checkArr = []
                        for (var j = rowIndex; j >= 0; j--) {
                            if (vm.approvalLines[j].approvalStatus == 2) {
                                checkArr[j] = true
                            }
                        }
                        if (checkArr.length == index) {
                            canApproveOrReject = true
                        }
                        //canApproveOrReject = true
                    }
                    else if (row.approverType == 3 && vm.currentUserId == row.staffId) {
                        var rowIndex = index - 1;
                        var checkArr = []
                        for (var j = rowIndex; j >= 0; j--) {
                            if (vm.approvalLines[j].approvalStatus == 2) {
                                checkArr[j] = true
                            }
                        }
                        if (checkArr.length == index) {
                            canApproveOrReject = true
                        }
                    }
                    else if (vm.currentUserInfo) {
                        if (vm.currentUserInfo.designationId != null) {
                            if (row.approverType == 2 && vm.currentUserInfo.designationId == row.designationId) {
                                var rowIndex = index - 1;
                                var checkArr = []
                                for (var j = rowIndex; j >= 0; j--) {
                                    if (vm.approvalLines[j].approvalStatus == 2) {
                                        checkArr[j] = true
                                    }
                                }
                                if (checkArr.length == index) {
                                    canApproveOrReject = true
                                }
                                //canApproveOrReject = true
                            }
                        }
                        else if (vm.currentUserInfo.staffRoleId != null) {
                            if (row.approverType == 4 && vm.currentUserInfo.staffRoleId == row.staffRoleId) {
                                var rowIndex = index - 1;
                                var checkArr = []
                                for (var j = rowIndex; j >= 0; j--) {
                                    if (vm.approvalLines[j].approvalStatus == 2) {
                                        checkArr[j] = true
                                    }
                                }
                                if (checkArr.length == index) {
                                    canApproveOrReject = true
                                }
                                //canApproveOrReject = true
                            }
                        }
                    }
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

            function openCreateOrEditCompanyModal(companyId, row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
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
                });
            }
            function openRejectionReasonModal(companyId, row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/rejection/rejectionReason.cshtml',
                    controller: 'tenant.views.common.rejection.rejectionReason as vm',
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
                });
            };

            vm.approveRow = function (row) {
                abp.message.confirm(
                    'Do you really want to approve?',
                    function (isConfirmed) {

                        if (isConfirmed) {
                            row.approvalStatus = 2;                                                         //True
                            row.staffId = vm.currentUserId;
                            var approvedCount = 0;
                            for (var i = 0; i < vm.leave.leaveApprovalLines.length; i++) {
                                if (vm.leave.leaveApprovalLines[i].id == row.id) {
                                    vm.leave.leaveApprovalLines[i].approvalStatus = row.approvalStatus
                                }
                                if (vm.leave.leaveApprovalLines[i].approvalStatus == 2) {                   // Getting Count of How much have been approved
                                    approvedCount++
                                }
                                if (approvedCount == vm.leave.leaveApprovalLines.length - 1) {
                                    vm.leave.leaveStatus = 2                                                // True
                                }
                            }

                            vm.leave.IsChangeLeaveStatus = true;
                            leaveService.createOrUpdateLeave(vm.leave)
                                .then(function (result) {
                                    abp.notify.info(app.localize('savedsuccessfully'));
                                    //$uibmodalinstance.close();
                                })
                                .finally(function () {
                                    vm.saving = false;
                                });
                        }
                        else {
                            vm.loading = true;
                        }
                    }
                );

            };

            vm.rejectRow = function (row) {

                abp.message.confirm(
                    'Do you really want to reject?',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            row.approvalStatus = 3;
                            row.staffId = vm.currentUserId;
                            for (var i = 0; i < vm.leave.leaveApprovalLines.length; i++) {
                                if (vm.leave.leaveApprovalLines[i].id == row.id) {
                                    vm.leave.leaveApprovalLines[i].approvalStatus = row.approvalStatus
                                }
                            }
                            vm.leave.IsChangeLeaveStatus = true;
                            leaveService.createOrUpdateLeave(vm.leave)
                                .then(function (result) {
                                    abp.notify.info(app.localize('savedsuccessfully'));
                                    // $uibmodalinstance.close();
                                })
                                .finally(function () {
                                    vm.saving = false;
                                });
                        }
                    }
                );
            };
            vm.cancel = function () {
                $uibModalInstance.close();
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

            function init() {
                getCurrentUserInfo();
                approvalForm();
            }

            function approvalForm() {
                vm.loading = true;
                vm.approvalLines = [];
                leaveService.getLeavesForEdit(vm.approvalId)
                    .success(function (data) {
                        vm.leave = data;
                        vm.approvalLines = vm.leave.leaveApprovalLines;
                        if (vm.leave.staffId) {
                            vm.leave.staffId.id = vm.leave.staffId
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            //vm.getRoleByUserId();

            init();
        }
    ]);
