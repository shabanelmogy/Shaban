// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:439308-439741
appModule.controller('tenant.views.hrm.leaveType.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.leaveType', 'abp.services.app.directory', 'abp.services.app.staffRole', 'abp.services.app.designation', 'abp.services.app.department', 'leaveTypeId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, leaveTypeService, directoryService, staffRoleService, designationService, departmentService, leaveTypeId, $uibModal, $http) {
            var vm = this;

            vm.saving = false;

            vm.leaveType = {
                leaveTypeApprovalSettings: [],
                staffWiseAnnualLeaves: [],
            };
            vm.availInHour = 0
            vm.title = "Create Leave Type";

            //vm.contactBranchRows = [];
            vm.contactPersons = [];
            vm.leaveTypeApprovalSettings = [];

            //enums
            vm.enumApproverTypes = [
                { name: "ReportingTo", id: 1 },
                { name: "Having Designation", id: 2 },
                //{ name: "Department", id: 3 },
                { name: "Staff", id: 3 },
                { name: "Having Role", id: 4 }
            ];
            vm.enumGenders = [
                { name: "Any", id: 3 },
                { name: "Male", id: 1 },
                { name: "Female", id: 2 }
            ];
            vm.enumMartialStatus = [
                { name: "Married", id: 1 },
                { name: "Single", id: 2 }
            ];
            vm.enumLeaveCategories = [
                { name: "Short Leave", id: 1 },
                { name: "Long Leave", id: 2 }
            ];
            vm.enumLeaveQuotaTypes = [
                { name: "None", id: 0 },
                //{ name: "Every Monthly", id: 1 },
                //{ name: "Every Quarterly", id: 2 },
                { name: "Yearly", id: 3 },
                //{ name: "Every TwoYearly", id: 4 },
                //{ name: "Occasional", id: 5 }
            ];
            vm.enumAccruedOn = [
                //{ name: "None", id: 0 },
                //{ name: "Every Monthly", id: 1 },
                //{ name: "Every Quarterly", id: 2 },
                { name: "Yearly", id: 3 },
                //{ name: "Every TwoYearly", id: 4 },
                //{ name: "Occasional", id: 5 }
            ];
            vm.enumLeavePeriodTypes = [
                { name: "None", id: 0 },
                { name: "Date To Date", id: 1 },
                { name: "Calendar Year", id: 2 }
            ];
            vm.enumLeaveQuotaRules = [
                { name: "Add at Start of Period", id: 1 },
                { name: "Add at End of Period", id: 2 },
                { name: "Calculate from Rejoining till Leave Start Date", id: 3 }
            ];
            vm.enumLeaveStartFromOptions = [
                { name: "Joining Date", id: 1 },
                { name: "Confirmation Date", id: 2 }
            ];
            vm.staffCategories = [
                { name: "Top Management", id: 1 },
                { name: "Manager", id: 2 },
                { name: "General", id: 3 }
            ];

            //vm.sortOfDocumentApprovals = function (event, ui) {
            //    var currentList = vm.leaveType.leaveTypeApprovalSettings;

            //    var obj = JSON.parse(ui.item.attr('data-id'));
            //    var updatedIndex = ui.item.index();

            //    var leaveTypeApprovalSetting = obj.leaveTypeApprovalSetting;

            //    if (updatedIndex == 0) {
            //        leaveTypeApprovalSetting.order = currentList[0].order / 2;
            //    } else if (updatedIndex == currentList.length - 1) {
            //        leaveTypeApprovalSetting.order = (currentList[updatedIndex].order + currentList[updatedIndex - 1].order) / 2;
            //    } else {
            //        leaveTypeApprovalSetting.order = (currentList[updatedIndex - 1].order + currentList[updatedIndex + 1].order) / 2;
            //    }

            //    currentList.splice(obj.leaveTypeApprovalSettingIndex, 1);
            //    currentList.splice(updatedIndex, 0, leaveTypeApprovalSetting);

            //    $scope.$apply();
            //};

            //vm.sortOfDocumentApprovals = function (event, ui) {
            //    var currentList = vm.leaveType.leaveTypeApprovalSettings;

            //    var obj = JSON.parse(ui.item.attr('data-id'));
            //    var updatedIndex = ui.item.index();

            //    var leaveTypeApprovalSetting = obj.leaveTypeApprovalSetting;

            //    if (updatedIndex == 0) {
            //        leaveTypeApprovalSetting.order = currentList[0].order / 2;
            //    } else if (updatedIndex == currentList.length - 1) {
            //        leaveTypeApprovalSetting.order = (currentList[updatedIndex].order + currentList[updatedIndex - 1].order) / 2;
            //    } else {
            //        leaveTypeApprovalSetting.order = (currentList[updatedIndex - 1].order + currentList[updatedIndex + 1].order) / 2;
            //    }

            //    // Update the order in the array
            //    currentList[updatedIndex].order = leaveTypeApprovalSetting.order;
            //    vm.leaveType.leaveTypeApprovalSettings[obj.leaveTypeApprovalSettingIndex].order = updatedIndex;
            //    vm.leaveType.leaveTypeApprovalSettings.sort(function (a, b) {
            //        return a.order - b.order;
            //    });

            //    // Sort the array based on the order

            //    currentList.sort(function (a, b) {
            //        return a.order - b.order;
            //    });

            //    $scope.$apply();
            //};




            vm.clearStaff = function () {
                vm.filters.staff = null;
                vm.filters.staffId = null;
            };

            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.searchStaffPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (staff) {
                    if (staff != null) {
                        vm.filters.staff = staff;
                    }
                });
            };
            function getReportingStaff(reportingStaffId, index) {
                vm.loading = true;

                directoryService.getContactInfo({ Id: reportingStaffId }).then(function (result) {
                    vm.leaveType.leaveTypeApprovalSettings[index].staffId = result.data;
                }).catch(function (error) {
                    // Handle errors here
                }).finally(function () {
                    // Do something when the request is complete, regardless of success or failure
                    vm.loading = false;
                });
            }
            function getDepartments() {
                departmentService.getDepartment({}).success(function (data) {
                    vm.departments = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getDesignationDetails() {
                designationService.getDesignations().success(function (result) {
                    vm.designationDetails = result.items;
                    //console.log(test);
                });
            };
            function getStaffRoles() {
                staffRoleService.getStaffRole({}).success(function (data) {
                    vm.staffRoles = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function designationObject() {
                let designation = new Object();
                designation.designationId = null;
                designation.firstName = null;
                designation.lastName = null;
                designation.contactNo = null;
                designation.email = null;
                return designation;
            }
            //vm.addRow = function () {
            //    // Add logic to initialize the new row
            //    var newLeaveTypeApprovalSetting = {
            //        enumApproverType: 1, // Set a default value, adjust as needed
            //        // Add other properties as needed
            //    };
            //    vm.leaveType.leaveTypeApprovalSettings.push(newLeaveTypeApprovalSetting);

            //    // Add logic to initialize the new row's state in vm.approverTypeStates
            //    vm.approverTypeStates.push({});
            //};
            //vm.addRow = function () {
            //    // Add logic to initialize the new row's state
            //    var newLeaveTypeApprovalSetting = { enumApproverType: 1 };

            //    // Set the order number for the new row
            //    if (vm.leaveType.leaveTypeApprovalSettings.length === 0) {
            //        // If the array is empty, set order as 1
            //        newLeaveTypeApprovalSetting.order = 1;
            //    } else {
            //        // Otherwise, set order as the maximum order + 1
            //        var maxOrder = Math.max.apply(Math, vm.leaveType.leaveTypeApprovalSettings.map(function (o) { return o.order; }));
            //        newLeaveTypeApprovalSetting.order = maxOrder + 1;
            //    }

            //    vm.leaveType.leaveTypeApprovalSettings.push(newLeaveTypeApprovalSetting);

            //    // Update the order for all rows after adding a new one
            //    updateOrderForRows();

            //    // Update approverTypeStates array
            //    vm.approverTypeStates.push({}); // Initialize other state properties as needed
            //};

            // Function to update order for all rows
            //function updateOrderForRows() {
            //    vm.leaveType.leaveTypeApprovalSettings.forEach(function (row, index) {
            //        row.order = index + 1;
            //    });
            //}


            //vm.sortOfDocumentApprovals = function (event, ui) {
            //    var currentList = vm.leaveType.leaveTypeApprovalSettings;
            //    var obj = JSON.parse(ui.item.attr('data-id'));
            //    var updatedIndex = ui.item.index();
            //    var leaveTypeApprovalSetting = obj.leaveTypeApprovalSetting;

            //    // Assign order based on the sort position
            //    if (updatedIndex === 0) {
            //        leaveTypeApprovalSetting.order = currentList[0].order / 2;
            //    } else if (updatedIndex === currentList.length - 1) {
            //        leaveTypeApprovalSetting.order = (currentList[updatedIndex].order + currentList[updatedIndex - 1].order) / 2;
            //    } else {
            //        leaveTypeApprovalSetting.order = (currentList[updatedIndex - 1].order + currentList[updatedIndex + 1].order) / 2;
            //    }

            //    // Update the order for all rows after sorting
            //    updateOrderForRows();

            //    $scope.$apply();
            //};

            // Function to update order for all rows
            //function updateOrderForRows() {
            //    vm.leaveType.leaveTypeApprovalSettings.forEach(function (row, index) {
            //        row.order = index + 1;
            //    });
            //}


            vm.removeRow = function (leaveTypeApprovalSetting) {
                var index = vm.leaveType.leaveTypeApprovalSettings.indexOf(leaveTypeApprovalSetting);
                vm.leaveType.leaveTypeApprovalSettings.splice(index, 1);

                // Add logic to remove the corresponding state from vm.approverTypeStates
                if (vm.approverTypeStates != null)
                    vm.approverTypeStates.splice(index, 1);
            };


            $scope.sortableOptions = {
                handle: '.btn-drag-handle', // Set the draggable handle class
                axis: 'y' // Enable vertical drag-and-drop
            };

            vm.save = function () {
                vm.saving = true;
                if (vm.leaveType) {
                    for (var i = 0; i < vm.leaveType.leaveTypeApprovalSettings.length; i++) {
                        if (vm.leaveType.leaveTypeApprovalSettings[i].staffId != null) {
                            vm.leaveType.leaveTypeApprovalSettings[i].staffId = vm.leaveType.leaveTypeApprovalSettings[i].staffId.id;
                        }
                    }
                    //vm.leave.staffId = vm.leave.staffId[0].id
                }

                if (leaveTypeId != null) {
                    leaveTypeService.createOrUpdateLeaveType(vm.leaveType)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                } else {
                    leaveTypeService.createOrUpdateLeaveType(vm.leaveType)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            // Annual leave modal section 

            vm.addAnnualLeaveRow = function () {
                var row = {};
                row.order = vm.leaveType.staffWiseAnnualLeaves.length < 1
                    ? 1
                    : vm.leaveType.staffWiseAnnualLeaves[vm.leaveType.staffWiseAnnualLeaves.length - 1].order + 1;

                vm.leaveType.staffWiseAnnualLeaves.push(row);
            };

            vm.removeAnnualLeaveRow = function (staffAnnualLeave) {
                var index = vm.leaveType.staffWiseAnnualLeaves.indexOf(staffAnnualLeave);
                if (index !== -1) {
                    vm.leaveType.staffWiseAnnualLeaves.splice(index, 1);
                }
            };

            //


            function init() {
                getDepartments();
                getDesignationDetails();
                getStaffRoles();

                if (leaveTypeId != null) {
                    vm.isEditMod = true;
                    vm.title = "Update LeaveType"
                    leaveTypeService.getLeaveTypeForEdit(leaveTypeId).then(function (data) {
                        vm.leaveType = data.data;
                        if (vm.leaveType.leaveTypeApprovalSettings.length > 0) {
                            for (var i = 0; i < vm.leaveType.leaveTypeApprovalSettings.length; i++) {
                                if (vm.leaveType.leaveTypeApprovalSettings[i].staffId != null) {
                                    getReportingStaff(vm.leaveType.leaveTypeApprovalSettings[i].staffId, i);
                                }
                            }

                        }
                    });
                }
                else {
                }
            }
            init();
            vm.addRow = function () {
                var row = new Object();
                //row.fromValue = null;
                //row.toValue = null;
                //row.levelName = "";
                //row.userId = null;
                //row.user = null;
                row.enumApproverType = 1;
                row.order = vm.leaveType.leaveTypeApprovalSettings.length < 1 ? 1 : vm.leaveType.leaveTypeApprovalSettings[vm.leaveType.leaveTypeApprovalSettings.length - 1].order + 1;
                vm.leaveType.leaveTypeApprovalSettings.push(row);
            };
            vm.sortOfDocumentApprovals = function (event, ui) {
                var currentList = null;

                currentList = vm.leaveType.leaveTypeApprovalSettings;


                //  vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var setting = obj.setting;

                //var milestone = project.milestones[obj.milestoneIndex];
                //var task = milestone.tasks[obj.taskIndex];

                if (updatedIndex == 0) {
                    //setting.priority = (milestone.tasks[0].priority) / 2;
                    setting.order = updatedIndex;
                    var element = setting;
                    currentList.splice(obj.settingIndex, 1);
                    currentList.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (currentList.length - 1)) {
                    setting.order = currentList.length - 1;
                    var element = setting;
                    currentList.splice(obj.settingIndex, 1);
                    currentList.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.settingIndex)
                        setting.order = updatedIndex;
                    else if (updatedIndex < obj.settingIndex)
                        setting.order = updatedIndex;
                    var element = setting;
                    currentList.splice(obj.settingIndex, 1);
                    currentList.splice(updatedIndex, 0, element);
                }
                vm.leaveType.leaveTypeApprovalSettings = currentList;
                for (let i = 0; i < vm.leaveType.leaveTypeApprovalSettings.length; i++) {
                    vm.leaveType.leaveTypeApprovalSettings[i].order = i + 1;
                }
                //projectTaskService.updateProjectTaskPriority(task).success(function () {

                //}).finally(function () {
                //    vm.loading = false;
                //});

                $scope.$apply();
            };
        }
    ]);
