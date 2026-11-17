// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:201155-201591
appModule.controller('tenant.views.deliveries.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.delivery', 'utilities',
        function ($scope, $uibModal, uiGridConstants, deliveryService, utilities) {

            var vm = this;
            vm.showDriverMinutesInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowDriverMinutesInMovements"));

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);

            vm.filters = {
                enableDateRange: true,
                plateNo: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.movementSubTypes = [
                { type: app.localize("AgreementDelivery"), id: 8 },
                { type: app.localize("ReplacementDelivery"), id: 9 },
            ];

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format(vm.dateFormat)).utc(),
                endDate: moment(moment().format(vm.dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.DeliveryMovements'),
                create: abp.auth.hasPermission('Pages.Tenant.DeliveryMovements.Addnew'),
                'return': abp.auth.hasPermission('Pages.Tenant.DeliveryMovements.Return'),
                close: abp.auth.hasPermission('Pages.Tenant.DeliveryMovements.Close'),
                allActionsOnOtherBranch: true,
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
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

            vm.getDeliveryMovements = function () {
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
                deliveryService.getDeliveries(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getMovemntType = function (type) {
                if (type == 8)
                    return app.localize("AgreementDelivery");
                else if (type == 9) return app.localize("ReplacementDelivery");
            };

            vm.getStatus = function (row) {
                if (!row.isComplete && !row.isDeliveryCancelled)
                    return "Open";
                else if (row.isComplete && !row.isDeliveryCancelled)
                    return "Delivered";
                else if (row.isComplete && row.isDeliveryCancelled)
                    return "Returned";
            };

            vm.getDriverMinutes = function (row) {
                if (!row ||
                    !row.outDetail ||
                    !row.inDetail ||
                    !row.outDetail.dateTime ||
                    !row.inDetail.dateTime) {
                    return '';
                }

                var outTime = moment(row.outDetail.dateTime);
                var inTime = moment(row.inDetail.dateTime);

                var minutes = inTime.diff(outTime, 'minutes');

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
                            '      <li><a ng-if="grid.appScope.permissions.view"  ng-click="grid.appScope.viewDeliveryMovement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.close && !row.entity.isComplete  && !row.entity.isDeliveryCancelled"  ng-click="grid.appScope.closeDeliveryMovement(row.entity)">' + app.localize('Close') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.return && !row.entity.isComplete && row.entity.movementSubType==9 && !row.entity.isDeliveryCancelled"  ng-click="grid.appScope.returnDeliveryMovement(row.entity)">' + app.localize('ReturnDeliveryMovements') + '</a></li>' +

                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        field: 'id',
                        width: 60

                    },
                    {
                        name: app.localize('Type'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getMovemntType(row.entity.movementSubType)}}</div>' +
                            '</div>',
                        width: 160

                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'nrmMovAgreement.agreementNo',
                        width: 140
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicle',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                            '</div>',
                        width: 140
                    },
                    {
                        name: app.localize('DeliveryLocation'),
                        field: 'inDetail_GeoLocation',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.inDetail_GeoLocation.title}}</div>' +
                            '</div>',
                        width: 250
                    },
                    {
                        name: app.localize('DateOut'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.outDetail.dateTime)}}</div>' +
                            '</div>',
                        width: 140

                    },
                    {
                        name: app.localize('FuelLevelOut'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFuelLevel(row.entity.outDetail.fuelLevel)}}</div>' +
                            '</div>',
                        width: 120

                    },
                    {
                        name: app.localize('KmOut'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.outDetail.km}}</div>' +
                            '</div>',
                        width: 80

                    },
                    {
                        name: app.localize('DateIn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.inDetail.dateTime)}}</div>' +
                            '</div>',
                        width: 150

                    },
                    {
                        name: app.localize('FuelLevelIn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFuelLevel(row.entity.inDetail.fuelLevel)}}</div>' +
                            '</div>',
                        width: 120

                    },
                    {
                        name: app.localize('KmIn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.inDetail.km}}</div>' +
                            '</div>',
                        width: 80

                    },
                    {
                        name: app.localize('Status'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatus(row.entity)}}</div>' +
                            '</div>',
                        width: 80

                    },
                    {
                        name: app.localize('DriverMinutes'),
                        width: 140,
                        enableSorting: false,
                        visible: vm.showDriverMinutesInMovements,
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">' +
                            '<span ng-if="row.entity.isComplete">' +
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

                        vm.getDeliveryMovements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getDeliveryMovements();
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
                deliveryService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function openCreateOrEditDeliveryMovementModal(deliveryMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/deliveries/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.deliveries.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                deliveryMovementId: deliveryMovementId,

                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeliveryMovements();
                });
            }

            function opencloseDeliveryMovementModal(deliveryMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/deliveries/closeModal.cshtml',
                    controller: 'tenant.views.crs.deliveries.closeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                deliveryMovementId: deliveryMovementId,

                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeliveryMovements();
                });
            }

            function openReturnDeliveryMovementModal(deliveryMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/deliveries/returnModal.cshtml',
                    controller: 'tenant.views.crs.deliveries.returnModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                deliveryMovementId: deliveryMovementId,

                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeliveryMovements();
                });
            }

            function opencloseReplacementDeliveryMovementModal(agreementId, vehicle, deliveryMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                vehicle: vehicle,
                                deliveryMovementId: deliveryMovementId
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getDeliveryMovements();
                });
            }

            function openViewDeliveryMovementModal(deliveryMovementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/deliveries/viewModal.cshtml',
                    controller: 'tenant.views.crs.deliveries.closeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                deliveryMovementId: deliveryMovementId,

                            }
                        }
                    }

                });

            }

            vm.createDeliveryMovement = function () {
                openCreateOrEditDeliveryMovementModal(null);
            };


            vm.closeDeliveryMovement = function (deliveryMovement) {
                if (deliveryMovement.movementSubType == 9)
                    opencloseReplacementDeliveryMovementModal(deliveryMovement.nrmMovAgreementId, deliveryMovement.vehicle, deliveryMovement.id);
                else
                    opencloseDeliveryMovementModal(deliveryMovement.id);
            };
            vm.returnDeliveryMovement = function (deliveryMovement) {
                openReturnDeliveryMovementModal(deliveryMovement.id);
            };


            vm.viewDeliveryMovement = function (deliveryMovement) {
                openViewDeliveryMovementModal(deliveryMovement.id);
            };



            function initializeFilters() {
                vm.getDeliveryMovements();
            }
            initializeFilters();

        }
    ]);
