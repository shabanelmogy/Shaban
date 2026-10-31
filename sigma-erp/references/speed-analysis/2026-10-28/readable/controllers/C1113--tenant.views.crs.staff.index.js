// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:293454-293815
appModule.controller('tenant.views.crs.staff.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.staff',
        function ($scope, $uibModal, uiGridConstants, staffService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.showExpiries = abp.setting.get("App.DocumentNos.ShowExpiryDateofDocumentsInStaff") === 'true';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isDesignationFeatureEnabled = abp.features.isEnabled("Core.Staff.Designations");
            vm.isHrmEnabled = abp.features.isEnabled("HRM");
           
            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Staff'),
                create: abp.auth.hasPermission('Pages.Tenant.Staff.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Staff.Edit'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Staff.Export'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Staff.Delete'),
                revise: abp.auth.hasPermission('Pages.Tenant.Staff.SalaryPackage.Revise'),

            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewStaff(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editStaff(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.revise " ng-click="grid.appScope.openRevisePayStaffModal(row.entity.id)">' + app.localize('Revise') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteStaff(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code',
                        minWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'firstName',
                        minWidth: 160,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MobileNo'),
                        minWidth: 150,
                        field: 'mobileNo'
                    },
                    {
                        name: app.localize('Email'),
                        minWidth: 150,
                        field: 'email'
                    },
                    {
                        name: app.localize('Designation'),
                        minWidth: 150,
                        field: 'designationName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<span ng-if="grid.appScope.isDesignationFeatureEnabled">{{row.entity.designation.name}}</span>' +
                            '<span ng-if="!grid.appScope.isDesignationFeatureEnabled">{{row.entity.designationName}}</span>' +
                            '</div> ' +
                            '</div>',
                    },
                    //{
                    //    name: app.localize('DesignationsName'),
                    //    minWidth: 150,
                    //    field: 'designation.name'
                    //},
                    {
                        name: app.localize('Passport') + ' ' + app.localize('Expiry'),
                        field: 'passportExpiry',
                        minWidth: 150,
                        visible: vm.showExpiries,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                            '<div ng-show=\"doc.identityDocumentType === 2\">' +
                            '<div class=\"ui-grid-cell-contents\">{{ grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('NationalId') + ' ' + app.localize('Expiry'),
                        field: 'nationalIdExpiry',
                        minWidth: 150,
                        visible: vm.showExpiries,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                            '<div ng-show=\"doc.identityDocumentType === 3\">' +
                            '<div class=\"ui-grid-cell-contents\">{{  grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('TradeLicense') + ' ' + app.localize('Expiry'),
                    //    field: 'tradeLicenseExpiry',
                    //    minWidth: 150,
                    //    visible: vm.showExpiries,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                    //        '<div ng-show=\"doc.identityDocumentType === 1\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{  grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                    //        '</div>' +
                    //        '</div>' +
                    //        '</div>'
                    //},
                    {
                        name: app.localize('DrivingLicense') + ' ' + app.localize('Expiry'),
                        field: 'drivingLicenseExpiry',
                        minWidth: 150,
                        visible: vm.showExpiries,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                            '<div ng-show=\"doc.identityDocumentType === 4\">' +
                            '<div class=\"ui-grid-cell-contents\">{{  grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('HealthCard') + ' ' + app.localize('Expiry'),
                        field: 'healthCardExpiry',
                        minWidth: 150,
                        visible: vm.showExpiries,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                            '<div ng-show=\"doc.identityDocumentType === 7\">' +
                            '<div class=\"ui-grid-cell-contents\">{{  grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StaffDocument1') + ' ' + app.localize('Expiry'),
                        field: 'staffDocument1Expiry',
                        minWidth: 150,
                        visible: vm.showExpiries,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                            '<div ng-show=\"doc.identityDocumentType === 6\">' +
                            '<div class=\"ui-grid-cell-contents\">{{  grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('OtherDocument') + ' ' + app.localize('Expiry'),
                        field: 'otherDocumentExpiry',
                        minWidth: 150,
                        visible: vm.showExpiries,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-repeat=\"doc in row.entity.identityDocuments\">' +
                            '<div ng-show=\"doc.identityDocumentType === 5\">' +
                            '<div class=\"ui-grid-cell-contents\">{{  grid.appScope.getlocalDateTime(doc.expiryDate) }}</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    }

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {

                        if (!sortColumns.length ||
                            !sortColumns[0].field ||
                            sortColumns[0].field === 'passportExpiry' ||
                            sortColumns[0].field === 'nationalIdExpiry' ||
                            sortColumns[0].field === 'tradeLicenseExpiry' ||
                            sortColumns[0].field === 'healthCardExpiry' ||
                            sortColumns[0].field === 'drivingLicenseExpiry' ||
                            sortColumns[0].field === 'staffDocument1Expiry' ||
                            sortColumns[0].field === 'otherDocumentExpiry') {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getStaff();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStaff();
                    });
                },
                data: []
            };


            vm.getStaff = function () {
                vm.loading = true;
                staffService.getStaff(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/staff/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                staffService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function openCreateOrEditStaffModal(staffId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staff/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.staff.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffId: function () {
                            return staffId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getStaff();
                });
            }
            vm.openRevisePayStaffModal=function (staffId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staff/revisePayModal.cshtml',
                    controller: 'tenant.views.crs.staff.revisePayModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffId: function () {
                            return staffId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getStaff();
                });
            }

            function openViewModal(staffId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staff/viewModel.cshtml',
                    controller: 'tenant.views.crs.staff.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffId: function () {
                            return staffId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getStaff();
                });
            }

            vm.createStaff = function () {
                openCreateOrEditStaffModal(null);
            };

            vm.editStaff = function (staff) {
                openCreateOrEditStaffModal(staff.id);
            };

            vm.viewStaff = function (staff) {
                openViewModal(staff.id);
            };

            vm.deleteStaff = function (staff) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            staffService.deleteStaff({
                                id: staff.id
                            }).success(function () {
                                vm.getStaff();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getStaff();
        }
    ]);
