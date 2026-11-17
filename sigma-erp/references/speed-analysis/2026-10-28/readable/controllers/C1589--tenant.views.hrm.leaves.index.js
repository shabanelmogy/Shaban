// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:438083-438596
appModule.controller('tenant.views.hrm.leaves.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.leave', 'abp.services.app.leaveType', 'utilities',
        function ($scope, $uibModal, uiGridConstants, directoryService, leaveService, leaveTypeService, utilities) {
            var vm = this;
            vm.filters;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';;
            vm.timeFormat = "HH:mm";
            vm.showPendingRejoiningDateLeaves = false;
            vm.showApprovalPendingLeaves = false;
            vm.showRejectedLeaves = false;
            vm.dateTimeFormat = vm.dateFormat;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.showDeleteOptionForApprovedLeave = utilities.parseBoolean(abp.setting.get("App.Speed.Hrm.ShowDeleteOptionForApprovedLeave"));
            vm.filters = {
                enableDateRange: true
            };
            //vm.dateFormat = abp.setting.get("App.General.DateFormat");
            //vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.staff = {
                id: null,
            }
            vm.staffId = null
            vm.leave = {
                leaveTypeId: null,
                staff: null
            }
            //enums
            vm.enumLeaveCategories = [
                { name: "Short Leave", id: 1 },
                { name: "Long Leave", id: 2 }
            ];
            vm.enumLeaveQuotaTypes = [
                { name: "Monthly", id: 1 },
                { name: "Quarterly", id: 2 },
                { name: "Yearly", id: 3 },
                { name: "Two Yearly", id: 4 },
                { name: "Occasional", id: 5 }
            ];
            vm.enumLeavePeriodTypes = [
                { name: "None", id: 0 },
                { name: "Date To Date", id: 1 },
                { name: "Calendar Month Or Year", id: 2 }
            ];
            vm.enumLeaveQuotaRules = [
                { name: "Start Of Period", id: 1 },
                { name: "End Of Period", id: 2 },
                { name: "Occasional For Staff", id: 3 }
            ];
            vm.enumLeaveStartFromOptions = [
                { name: "Date Of Joining", id: 1 },
                { name: "Date Of Confirmation", id: 2 }
            ];
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
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.HRM.Leaves.Create'),
                view: abp.auth.hasPermission('Pages.HRM.Leaves.View'),
                approve: abp.auth.hasPermission('Pages.HRM.Leaves.Approve'),
                edit: abp.auth.hasPermission('Pages.HRM.Leaves.Edit'),
                delete: abp.auth.hasPermission('Pages.HRM.Leaves.Delete'),
            };
            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: "id asc"
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDateRange = vm.dateRangeModel.startDate
                        ? vm.dateRangeModel.startDate
                        : moment().startOf('day');

                    vm.filters.endDateRange = vm.dateRangeModel.endDate
                        ? vm.dateRangeModel.endDate
                        : moment().endOf('day');
                } else {
                    vm.filters.startDateRange = null;
                    vm.filters.endDateRange = null;
                }
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.startDateRange = vm.dateRangeModel.startDate
                    ? vm.dateRangeModel.startDate
                    : moment().add(-29, 'days').startOf('day');

                vm.filters.endDateRange = vm.dateRangeModel.endDate
                    ? vm.dateRangeModel.endDate
                    : moment().endOf('day');
            };
            function getLeaveTypes() {
                leaveTypeService.getLeaveType({}).success(function (data) {
                    vm.leaveTypes = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.clearStaff = function () {
                vm.leave.staff = null;
                vm.leave.staffId = null;
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
                        vm.leave.staff = staff;
                    }
                });
            };

            function convertEnumValueToName(value, enumArray) {
                const enumItem = enumArray.find(item => item.id === value);
                return enumItem ? enumItem.name : '';
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.verifyLeaveStatus = function (leave) {

                if (leave.leaveStatus == 'Approved' || leave.leaveStatus == 'Rejected') {
                    return false
                }
                else {
                    return true
                }

            };

            vm.showDeleteAction = function (leave) {

                if (!vm.showDeleteOptionForApprovedLeave && leave.leaveStatus == 'Approved') {
                    return false
                }
                else {
                    return true
                }

            };

            vm.checkLeaveStatus = function (leave) {
                if (leave && Array.isArray(leave.leaveApprovalLines) && leave.leaveApprovalLines.length > 0) {

                    var allApproved = leave.leaveApprovalLines.every(function (item) {

                        return item.approvalStatus === 2;
                    });

                    return allApproved;
                }
                return false;
            };

            vm.checkApprovarExist = function (leave) {
                if (leave && Array.isArray(leave.leaveApprovalLines) && leave.leaveApprovalLines.length > 0) {
                    return true;
                }
                return false;
            };



            vm.tenantGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                enableColumnResizing: true,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 115,
                        enableColumnResizing: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewLeave(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approve && grid.appScope.verifyLeaveStatus(row.entity) && grid.appScope.checkApprovarExist(row.entity)" ng-click="grid.appScope.approveLeave(row.entity)">' + app.localize('Approve/Reject') + '</a></li>' +
                            '      <li><a ng-if="row.entity.leaveType.isRejoingRequired == true && row.entity.rejoiningDate == null && grid.appScope.checkLeaveStatus(row.entity)"  ng-click="grid.appScope.rejoining(row.entity)">' + app.localize('Rejoining') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.verifyLeaveStatus(row.entity)" ng-click="grid.appScope.editLeave(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.showDeleteAction(row.entity)" ng-click="grid.appScope.deleteLeave(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'staff.name'
                    },
                    {
                        name: app.localize('LeaveType Name'),
                        field: 'leaveType.name'
                    },
                    {
                        name: app.localize('From Date'),
                        field: 'fromDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.fromDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('To Date'),
                        field: 'toDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.toDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('LeaveStatus'),
                        field: 'leaveStatus'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            requestParams.sorting = null;
                            console.log(sortColumns);
                        } else {
                            requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            console.log("Else Condition Sort :" + sortColumns[0].field + "Direction  :" + sortColumns[0].sort.direction + "Sort Length :" + sortColumns[0].length);
                            console.log("Sorting params :" + requestParams.sorting);
                        }
                        vm.getLeaves();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        requestParams.skipCount = (pageNumber - 1) * pageSize;
                        requestParams.maxResultCount = pageSize;
                        //if (vm.filters != null) {
                        vm.searchItems(requestParams.skipCount, requestParams.maxResultCount);
                        //}
                    });
                },
                data: []
            };
            vm.searchButtonCLick = function () {
                requestParams.skipCount = 0;
                requestParams.maxResultCount = 10;
                vm.tenantGridOptions.paginationCurrentPage = 1;
                vm.tenantGridOptions.paginationPageSize = 10;
                vm.searchItems();
            }

            vm.searchItems = function () {
                vm.loading = true;
                if (vm.filters == null) {
                    vm.filters = { isFeatured: false };
                }
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "id asc"
                }
                if (vm.leave.staff == null) {
                    vm.leave.staff = vm.staff;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDateRange = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDateRange = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDateRange = null;
                    vm.filters.endDateRange = null;
                }
                leaveService.getLeaves({
                    StaffId: vm.leave.staff.id, LeaveTypeId: vm.leave.leaveTypeId, skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount,
                    sorting: requestParams.sorting, isPendingReJoiningDate: vm.showPendingRejoiningDateLeaves, isApprovalPending: vm.showApprovalPendingLeaves,
                    isRejectedLeaves: vm.showRejectedLeaves, startDateRange: vm.filters.startDateRange, endDateRange: vm.filters.endDateRange
                }).then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.items;
                        let modifiedData = datas.map(item => ({
                            ...item,
                            leaveStatus: convertEnumValueToName(item.leaveStatus, vm.enumStatus),
                        }));
                        // let modifiedData = transformLeaveData(datas);
                        vm.tenantGridOptions.data = modifiedData;
                    }
                    else {
                        vm.tenantGridOptions.data = [];
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };
            // it is used to get leave status from approvalLines
            //function transformLeaveData(leaves) {
            //    return leaves.map(leave => {
            //        // Get the approval status from the first approval line if available
            //        const primaryApprovalStatus = leave.leaveApprovalLines.length > 0
            //            ? leave.leaveApprovalLines[0].approvalStatus
            //            : null;

            //        return {
            //            ...leave,
            //            leaveStatus: convertEnumValueToName(primaryApprovalStatus, vm.enumStatus) // Convert to human-readable name
            //        };
            //    });
            //}


            vm.getLeaves = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "id asc"
                }
                vm.tenantGridOptions.data = [];

                if (vm.filters.enableDateRange) {
                    vm.filters.startDateRange = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDateRange = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDateRange = null;
                    vm.filters.endDateRange = null;
                }

                leaveService.getLeaves({
                    skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting, LeaveTypeId: vm.leave.leaveTypeId, isPendingReJoiningDate: vm.showPendingRejoiningDateLeaves,
                    isApprovalPending: vm.showApprovalPendingLeaves, isRejectedLeaves: vm.showRejectedLeaves, startDateRange: vm.filters.startDateRange, endDateRange: vm.filters.endDateRange
                }).then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.items;
                        //let modifiedData = [];
                        let modifiedData = datas.map(item => ({
                            ...item,
                            leaveStatus: convertEnumValueToName(item.leaveStatus, vm.enumStatus),
                        }));
                        // let modifiedData = transformLeaveData(datas);

                        vm.tenantGridOptions.data = modifiedData;
                    }
                    else {
                        vm.tenantGridOptions.data = [];
                    }
                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };

            vm.addLeave = function (leave) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaves/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.leaves.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    /*vm.getLeaves();*/
                    vm.searchItems();
                });
            };

            vm.viewLeave = function (leave) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaves/viewModal.cshtml',
                    controller: 'tenant.views.hrm.leaves.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveId: function () {
                            return leave.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    /*vm.getLeaves();*/
                    vm.searchItems();
                });
            };

            vm.rejoining = function (leave) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaves/rejoining.cshtml',
                    controller: 'tenant.views.hrm.leaves.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        leaveId: function () {
                            return leave.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    /*vm.getLeaves();*/
                    vm.searchItems();
                });
            };

            vm.approveLeave = function (leave) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaves/leaveApprovalModal.cshtml',
                    controller: 'tenant.views.hrm.leaves.leaveApprovalModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveId: function () {
                            return leave.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    /*vm.getLeaves();*/
                    vm.searchItems();
                });
            };

            vm.editLeave = function (leave) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaves/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.leaves.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveId: function () {
                            return leave.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchItems();
                });
            };

            vm.deleteLeave = function (leave) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaveService.deleteLeave(leave.id)
                                .then(function (data) {
                                    console.log("Leave Deleted !!")
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.searchItems();
                                });
                        }
                    }
                );
            };

            function init() {
                getLeaveTypes();
                initDate();
                vm.getLeaves();
            }
            init();
        }
    ]);
