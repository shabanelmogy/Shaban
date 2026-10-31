// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:418360-418659
appModule.controller('tenant.views.externalVehiclesControlPanel.controlPanel.totalHiredVehiclestModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.externalVehicle', 'abp.services.app.externalMovement', 'options',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, externalVehicleService, externalMovementService, options) {

            var vm = this;
            
            // var showColumnIdlDays = options.statusId == "IDL" && options.subStatus == null;

            vm.showIdleDaysColumn = function (statusId, subStatus) {

                if (options.statusId == "IDL" && options.subStatus == null) {
                    return true;
                }
                else if (options.statusId == "IDL" && options.subStatus == 3) {
                    return true;
                }
                else if (options.statusId == "IDL" && options.subStatus == 4) {
                    return true;
                }
                else {
                    return false;
                }
            }

            vm.showModifiedUserColumn = function () {
                if (options.subStatus == 5)
                    return true;
                return false;
            }


            vm.title = app.localize(options.status);

            vm.filters = {
                vehicleType: options.fleetType,
                ownership: options.ownerShip,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                DashboardName: options.DashboardName,
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.hideLastDateColumn = function (value) {

                if (value == 'HIR') {
                    return false;
                }
                else if (value == 'NRM') {
                    return false;
                }
                else if (value == 'WRK') {
                    return false;
                }
                else if (value == '') {
                    return false;
                }
                else {
                    return true;
                }
            };


            vm.hideStatusColumn = function (value) {

                if (value == 'HIR') {
                    return false;
                }
                //else if (value == 'NRM') {
                //    return false;
                //}
                //else if (value == 'WRK') {
                //    return false;
                //}
                return true;
            };

            vm.outDaysColumnVisible = function (value) {
                if (value == 'HIR') {
                    return true;
                }
                else if (value == 'NRM') {
                    return true;
                }
                else if (value == 'WRK') {
                    return true;
                }
                else {
                    return false;
                }
            };

            vm.getStatusToDisplay = function (vehicle) {
                if (vehicle == null) return '';

                if (vehicle.statusId == 'HIR') return app.localize('Hired');
                if (vehicle.statusId == 'NRM') return app.localize('OnNRM');
                if (vehicle.statusId == 'WRK') return app.localize('InWorkshop');
                if (vehicle.statusId == 'IDL' && vehicle.subStatus == 3) return app.localize('ForSale');
                if (vehicle.statusId == 'IDL' && vehicle.subStatus == 4) return app.localize('TotalLoss');
                if (vehicle.statusId == 'IDL' && vehicle.subStatus == 2) return app.localize('NotReady');
                if (vehicle.statusId == 'IDL' && vehicle.subStatus <= 1) return app.localize('Ready');
                if (vehicle.statusId == 'BKD') return app.localize('Booked');
                if (vehicle.statusId == 'DFL') return app.localize('Defleeted');

                return '';
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

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,

                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('VehicleNo'),
                        enableSorting: false,
                        field: 'vehicle.plateNo'

                    },
                    {
                        name: app.localize('AgreementNo'),
                        width: 140,
                        type: 'number',
                        enableSorting: false,
                        field: 'agreementNo'
                    },
                    {
                        name: app.localize('Customer'),
                        enableSorting: false,
                        field: 'customer.name'
                    },
                    {
                        name: app.localize('PermanentVehicle'),
                        enableSorting: false,
                        field: 'permanentVehicle.plateNo'
                    },

                    //{
                    //    name: app.localize('ExpectedEndDate'),
                    //    field: 'endDate',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                    //        '</div>'
                    //},
                    {
                        name: app.localize('Location'),
                        field: 'locationId',
                        enableSorting: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),

                        field: 'vehicle.statusId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatusToDisplay(row.entity.vehicle)}}</div>' +
                            '</div>'
                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getVehicles();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getVehicles();
                    });
                },
                data: []
            };

            vm.viewMovementReadyToGo = function (VehicleId) {
                console.log(VehicleId);
                vm.loading = true;
                externalMovementService.getLastStatusChangedMovementId({ id: VehicleId }).success(function (data) {
                    vm.viewMovement(data);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.viewMovement = function (movementId) {
                openViewMovementModal(movementId, null);
            };

            function openViewMovementModal(movementId, checklist) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/reports/movements/viewModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.reports.movements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movementId;
                        },
                        checklist: function () {
                            return checklist;
                        }
                    }
                });
            }

            vm.getVehicles = function () {
                vm.loading = true;

                externalVehicleService.getTotalHiredVehiclesForDashboard(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;

                });
            };

            vm.loadSubStatusforNrmandWorkshop = function (vehicle) {
                if (vehicle.status == "OnNRM") {
                    if (vehicle.movementSubType == 4)
                        return vm.localize("NRM_General");
                    if (vehicle.movementSubType == 5)
                        return vm.localize("NRM_StaffCar");
                    if (vehicle.movementSubType == 6)
                        return vm.localize("NRM_SoldCarCustomerMovement");
                    if (vehicle.movementSubType == 7)
                        return vm.localize("NRM_NRT");
                    if (vehicle.movementSubType == 8)
                        return vm.localize("NRM_AgreementDelivery");
                    if (vehicle.movementSubType == 9)
                        return vm.localize("NRM_ReplacementDelivery");
                }
                if (vehicle.status == "InWorkshop") {
                    if (vehicle.movementSubType == 1)
                        return vm.localize("Workshop_Maintenance");
                    if (vehicle.movementSubType == 2)
                        return vm.localize("Workshop_Repair");
                    if (vehicle.movementSubType == 3)
                        return vm.localize("Workshop_AccidentRepair");
                    if (vehicle.movementSubType == 10)
                        return vm.localize("Workshop_Inspection");
                }
            };

            vm.getMakeModelYear = function (vehicle) {
                return vehicle.model.make + ' '
                    + vehicle.model.name + ' '
                    + vehicle.modelYear;
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                externalVehicleService.exportToExcelDashBoardTotalHired(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getVehicles();
                //   vm.idlDaysVisible();
            }

            init();
        }
    ]);
