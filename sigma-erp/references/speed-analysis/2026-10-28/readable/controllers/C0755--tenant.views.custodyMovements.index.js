// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:195587-196007
appModule.controller('tenant.views.custodyMovements.index', [
        '$scope', '$state', '$uibModal','utilities','uiGridConstants', 'abp.services.app.directory', 'abp.services.app.custody', 'appSession', 'FileUploader',
        function ($scope, $state, $uibModal, utilities, uiGridConstants, directoryService, custodyMovementService, appSession, fileUploader) {

            var vm = this;
            vm.showDriverMinutesInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowDriverMinutesInMovements"));

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.editCloseMovement = abp.features.isEnabled("MCC.EditCloseMovement");
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                enableDateRange: true,
                plateNo: '',
                IsCompleted: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.statusChanged = function () {
                if (vm.filters.IsCompleted == "false") {
                    vm.filters.enableDateRange = false;
                }
                else
                    vm.filters.enableDateRange = true;
                vm.dateRangeCheck();

            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.CustodyMovements'),
                create: abp.auth.hasPermission('Pages.Tenant.CustodyMovements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.CustodyMovements.Edit'),
                close: abp.auth.hasPermission('Pages.Tenant.CustodyMovements.Close'),
                'delete': abp.auth.hasPermission('Pages.Tenant.CustodyMovements.Delete'),
                allActionsOnOtherBranch: true,
            };

            vm.locationPermissionClose = function (row) {
                if (row.inDetail_LocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.inDetail_LocationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            vm.locationPermissionEditDelete = function (row) {
                if (row.outDetail_LocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.outDetail_LocationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
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
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };

            vm.getCustodyMovements = function () {
                vm.loading = true;
                // set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                // if null then get as following
                //  fromDate: get local date with time 00:00:00 and then convert to utc
                //  toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                //vm.filters
                custodyMovementService.getCustodys(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDriverMinutes = function (row) {

                if (!row ||
                    !row.inMovement ||
                    !row.outMovement ||
                    !row.inMovement.inDetail ||
                    !row.outMovement.outDetail ||
                    !row.inMovement.inDetail.dateTime ||
                    !row.outMovement.outDetail.dateTime) {
                    return '';
                }

                var inTime = moment(row.inMovement.inDetail.dateTime);
                var outTime = moment(row.outMovement.outDetail.dateTime);

                var minutes = outTime.diff(inTime, 'minutes');

                return minutes >= 0 ? minutes : '';
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
                        width: 120,
                        cellTemplate:
                        '<div class=\"ui-grid-cell-contents\">' +
                        '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                        '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                        '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewCustodyMovement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.printMethod(row.entity)">' + app.localize('Print') + '</a></li>' +
                        '      <li><a ng-if="(grid.appScope.permissions.edit && (!row.entity.outMovement.isComplete || (row.entity.outMovement.isComplete && grid.appScope.editCloseMovement)))" ng-click="grid.appScope.editCustodyMovement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.close && !row.entity.outMovement && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.closeCustodyMovement(row.entity)">' + app.localize('Close') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isComplete && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteCustodyMovement(row.entity)">' + app.localize('Delete') + '</a></li>' +

                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('No'),
                        field: 'id',

                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'inMovement.vehicle',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.inMovement.vehicle.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DateIn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.inMovement.inDetail.dateTime)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('FuelLevelIn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFuelLevel(row.entity.inMovement.inDetail.fuelLevel)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('KmIn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.inMovement.inDetail.km}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('DateOut'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.outMovement.outDetail.dateTime)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('FuelLevelOut'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFuelLevel(row.entity.outMovement.outDetail.fuelLevel)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('KmOut'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.outMovement.outDetail.km}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('DriverMinutes'),
                        width: 140,
                        enableSorting: false,
                        visible: vm.showDriverMinutesInMovements,
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">' +
                            '<span ng-if="row.entity.inMovement.isComplete && row.entity.outMovement.isComplete">' +
                            '{{grid.appScope.getDriverMinutes(row.entity)}}' +
                            '</span>' +
                            '</div>' +
                            '</div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getCustodyMovements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCustodyMovements();
                    });
                },
                data: []
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                custodyMovementService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };




            vm.printMethod = function (custodyMovement) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/custodyMovements/printModal.cshtml',
                    controller: 'tenant.views.crs.custodyMovements.printModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        custodyMovementId: function () {
                            return custodyMovement.id;
                        }
                    }
                });
            };



            function openCreateOrEditCustodyMovementModal(custodyMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/custodyMovements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.custodyMovements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                custodyMovementId: custodyMovementId,

                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCustodyMovements();
                });
            }

            function opencloseCustodyMovementModal(custodyMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/custodyMovements/closeModal.cshtml',
                    controller: 'tenant.views.crs.custodyMovements.closeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        custodyMovementId: function () {
                            return custodyMovementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCustodyMovements();
                });
            }

            function openViewCustodyMovementModal(custodyMovementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/custodyMovements/viewModal.cshtml',
                    controller: 'tenant.views.crs.custodyMovements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        custodyMovementId: function () {
                            return custodyMovementId;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getCustodyMovements();
                });
            }
            
            function openEditCustodyMovementModal(custodyMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/custodyMovements/editModal.cshtml',
                    controller: 'tenant.views.crs.custodyMovements.editModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        custodyMovementId: function () {
                            return custodyMovementId;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getCustodyMovements();
                });
            }

            vm.createCustodyMovement = function () {
                openCreateOrEditCustodyMovementModal(null);
            };

            vm.editCustodyMovement = function (custodyMovement) {
                openCreateOrEditCustodyMovementModal(custodyMovement.id);
            };

            vm.closeCustodyMovement = function (custodyMovement) {
                if (custodyMovement.canClose)
                    opencloseCustodyMovementModal(custodyMovement.id);
                else
                    abp.message.info('Custody Movement Can Not Closed As It has Open Movement');
            };

            vm.viewCustodyMovement = function (custodyMovement) {
                openViewCustodyMovementModal(custodyMovement.id);
            };
            
            vm.editCustodyMovement = function (custodyMovement) {
                openEditCustodyMovementModal(custodyMovement.id);
            };

            //vm.deleteCustodyMovement = function (custodyMovement) {
            //    abp.message.confirm(
            //        app.localize('MovementDeleteWarningMessage'),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                custodyMovementService.deleteCustodyMovement({
            //                    id: custodyMovement.id
            //                }).success(function () {
            //                    vm.getCustodyMovements();
            //                    abp.notify.success(app.localize('SuccessfullyDeleted'));
            //                });
            //            }
            //        }
            //    );
            //};

            function initializeFilters() {
                vm.getCustodyMovements();
            }
            initializeFilters();

        }
    ]);
