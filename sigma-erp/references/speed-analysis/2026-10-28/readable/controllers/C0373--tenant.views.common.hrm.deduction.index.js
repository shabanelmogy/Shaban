// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:96428-96872
appModule.controller('tenant.views.common.hrm.deduction.index', [
        '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.deductionSearch', 'abp.services.app.deduction', 'abp.services.app.salaryItemsSetting',
        function ($scope, $uibModal, directoryService, uiGridConstants, deductionSearchService, deductionService, salaryItemsSettingService) {

            var vm = this;

            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.Deduction.View'),
                create: abp.auth.hasPermission('Pages.HRM.Deduction.AddNew'),
                edit: abp.auth.hasPermission('Pages.HRM.Deduction.Edit'),
                delete: abp.auth.hasPermission('Pages.HRM.Deduction.Delete')
            };

            vm.filters = {
                enableDateRange: true,
                status: null,
                startDate: null,
                endDate: null,
                staffId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                type: null,
            };

            vm.statuses = [
                { id: 0, name: app.localize("Pending") },
                { id: 1, name: app.localize("Deducted") },
                { id: 2, name: app.localize("WaivedOff") }
            ];

            vm.types = null;
            vm.staffs = [];

            //functions
            vm.getDeductions = function () {
                vm.loading = true;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.staff != null) {
                    vm.filters.staffId = vm.filters.staff.id;
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                deductionSearchService.getDeductions(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });

            };

            function getDeductionTypes() {
                vm.types = [
                    { id: 1, name: app.localize("Loan Deduction") }
                ];
            };

            //function getStatusTypes() {
            //    vm.statuses = [
            //        { id: 0, name: app.localize("Pending") },
            //        { id: 1, name: app.localize("Deducted") },
            //        { id: 1, name: app.localize("WaivedOff") }
            //    ];
            //};

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

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

            vm.exportToExcel = function () {
                vm.loading = true;

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                vm.filters.fromDate = vm.filters.startDate;
                vm.filters.toDate = vm.filters.endDate;

                deductionSearchService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
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

            vm.createDeduction = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/deduction/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.hrm.deduction.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: null
                            }
                        },
                        amount: function () {
                            return 0;
                        },
                        staff: function () {
                            return {
                                staff: null
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeductions();
                });
            };

            vm.editDeduction = function (deduction) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/deduction/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.hrm.deduction.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: deduction.id
                            }
                        },
                        amount: function () {
                            return 0;
                        },
                        staff: function () {
                            return {
                                staff: null
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeductions();
                });
            };

            vm.viewDeduction = function (deduction) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/deduction/viewModal.cshtml',
                    controller: 'tenant.views.common.hrm.deduction.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: deduction.id
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeductions();
                });
            };

            vm.deleteDeduction = function (deduction) {
                abp.message.confirm(
                    app.localize('DeleteDeductionMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            deductionService.deleteDeduction({
                                id: deduction.id
                            }).success(function () {
                                vm.getDeductions();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.deductionLog = function (deduction) {
                opendeductionLogModal(deduction);
            };

            function opendeductionLogModal(deduction) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/deduction/deductionLogModal.cshtml',
                    controller: 'tenant.views.common.hrm.deduction.deductionLogModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                deductionId: deduction.id,
                            };
                        }
                    }
                });

            }

            vm.getStatusTypes = function (status) {
                if (status == 0) {
                    return app.localize("Pending");
                } else if (status == 1) {
                    return app.localize("Deducted");
                } else if (status == 1) {
                    return app.localize("WaivedOff");
                } else {
                    return "";
                }
            };

            vm.getTypeOfDeduction = function (type) {
                if (type == 51) {
                    return app.localize("AdvanceDeduction");
                } else if (type == 52)
                    return app.localize("LoanDeduction");
                else if (type == 55)
                    return app.localize("FinesDeduction");
                else if (type == 65)
                    return app.localize("ExtraDeduction");

                else {
                    return "";
                }
            };


            // Import deductions

            vm.openImportDeductionModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/deduction/importDeductions.cshtml',
                    controller: 'tenant.views.common.hrm.deduction.importDeductions as vm',
                    backdrop: 'static',
                    size: 'full',


                });
            };

            //vm.getTypeOfDeduction = function (salaryItemId) {             
            //    if (salaryItemId != null && vm.salaryTypes != null) {
            //        var salaryType = vm.salaryTypes.find(salaryType => salaryType.id === salaryItemId);

            //        if (salaryType != null) {
            //            return abp.localization.localize(salaryType.type || '');
            //        }
            //    }
            //    // Handle the case when salaryItemId is null or vm.salaryTypes is null
            //    return ''; // or any other default value or behavior you want
            //};

            //init
            function init() {
                initDate();
                vm.getStatusTypes();
                getDeductionTypes();
                vm.getDeductions();
            }


            //grid 
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewDeduction(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.statusType == 0 && row.entity.numberOfPaidInstallments == 0" ng-click="grid.appScope.deleteDeduction(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.statusType == 0" ng-hide="row.entity.status == 8" ng-click="grid.appScope.editDeduction(row.entity)">' + app.localize('ReviseInstallments') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.deductionLog(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getTypeOfDeduction(row.entity.salaryItemId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Staff'),
                        field: 'staff.name',
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'totalAmount',
                        type: 'totalAmount',
                    },
                    {
                        name: app.localize('NumberOfInstallments'),
                        type: 'number',
                        field: 'numberOfDeductions',

                    },
                    {
                        name: app.localize('NumberOfPaidInstallments'),
                        type: 'number',
                        field: 'numberOfPaidInstallments',

                    },
                    {
                        name: app.localize('Status'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatusTypes(row.entity.statusType)}}</div>' +
                            '</div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getDeductions();
                    });
                },
                data: []
            };
            function getSalaryItemTypes() {
                vm.loading = true;
                salaryItemsSettingService.getSalaryItemTypes().success(function (data) {
                    vm.salaryTypes = data.map(function (item) {
                        item.type = vm.getLocalize(item.type);
                        return item;
                    });
                    init();

                }).finally(function () {
                    vm.loading = false;
                });
            }
            getSalaryItemTypes();

            vm.getLocalize = (name) => {
                if (name === "OtherDeduction1")
                    return "Extra Deduction";

                return abp.localization.localize(name);
            }
        }
    ]);
