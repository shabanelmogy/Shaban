// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:311290-311843
appModule.controller('tenant.views.crs.vehicles.listModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.movement', 'options', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, vehicleService, movementService, options, utilities) {

            var vm = this;
            vm.allowRateTypeChargesWithVehicle = abp.features.isEnabled("CRS.CustomFeatures.AllowRateTypeChargesWithVehicle");
            vm.replacementOfMakeAndModelInGridForVehicles = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ReplacementOfMakeAndModelInGridForVehicles'));

            // var showColumnIdlDays = options.statusId == "IDL" && options.subStatus == null;

            vm.showIdleDaysColumn = function (statusId, subStatus) {

                if (options.statusId == "IDL" && options.subStatus == null) {
                    return true;
                }
                else if (options.statusId == "IDL" && options.subStatus == 2) {
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
                fleetCode: null,
                plateNo: '',
                vehicleType: options.fleetType,
                ownership: options.ownerShip,
                status: options.status,
                statusId: options.statusId,
                subStatus: options.subStatus,
                subStatuses: options.subStatuses,
                isModalFromIdleVehicles: options.isModalFromIdleVehicles || false,
                locationId: options.locationId,
                isOpenTrip: options.isOpenTrip,
                isReplacementToday: options.isReplacementToday,
                movementSubType: options.movementSubType,
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

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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
                        name: app.localize('PlateNo'),
                        width: 150,
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.ownership==2" class="label label-danger">' + app.localize('External') + '</span>' +
                            '<a class="btn btn-circle btn-xs green-haze" style="font-size: 0.7rem;" ng-if="row.entity.lastMovementId && row.entity.subStatus==5" ng-click="grid.appScope.viewMovement(row.entity.lastMovementId)" title="View Movement"><i class="fa fa-eye fa-xs"></i></a></span></small></div> ' +
                            '</div>'
                    },
                    ... !vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('MakeAndModel'),
                        field: 'model.makeId',
                        width: "12%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getMakeModelYear(row.entity)}}</div>' +
                            '</div>'
                    }] : [],
                    {
                        name: app.localize('VehicleType'),
                        field: 'tariffGroup.title',
                        width: "12%",

                    },
                    {
                        name: app.localize('Color'),
                        field: 'exteriorColor',
                        width: "12%",
                    },
                    {
                        name: app.localize('DailyRentRate'),
                        width: "10%",
                        /*displayName: 'D / PRICE',*/
                        field: 'dailyRentRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.dailyRentRate) }}</div>',

                    },
                    {
                        name: app.localize('MonthlyRentRate'),
                        width: "10%",
                        /*displayName: 'M / PRICE',*/
                        field: 'monthlyRentRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.monthlyRentRate) }}</div>',

                    },
                    {
                        name: app.localize('DailyCDWRate'),
                        width: "9%",
                        /*displayName: 'CDW / D',*/
                        field: 'dailylyCDWRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.dailyCDWRate) }}</div>',

                    },                    
                    {
                        name: app.localize('MonthlyCDWRate'),
                        width: "9%",
                        /*displayName: 'CDW / M',*/
                        field: 'monthlyCDWRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.monthlyCDWRate) }}</div>',

                    },
                    //{
                    //    name: app.localize('OneTimeExtra2Charges'),
                    //    width: "15%",
                    //    type: 'number',
                    //    field: 'oneTimeExtra2Charges',
                    //    visible: vm.allowRateTypeChargesWithVehicle,
                    //    cellTemplate: '<div style="color: #337ab7; text-align: center; ">{{ grid.appScope.CurrencyFormate(row.entity.oneTimeExtra2Charges) }}</div>',


                    //},
                    {
                        name: app.localize('DailyExtra2Charges'),
                        width: "12%",
                        type: 'number',
                        field: 'dailyExtra2Charges',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center; ">{{ grid.appScope.CurrencyFormate(row.entity.dailyExtra2Charges) }}</div>',


                    },
                    {
                        name: app.localize('MonthlyExtra2Charges'),
                        width: "12%",
                        type: 'number',
                        field: 'monthlyExtra2Charges',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center; ">{{ grid.appScope.CurrencyFormate(row.entity.monthlyExtra2Charges) }}</div>',


                    },

                    
                    {
                        name: app.localize('Status'),
                        //width: 100,
                        field: 'statusId',
                        width: "12%",
                        visible: vm.hideStatusColumn(options.statusId),
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents" ng-style="{' +
                            'color: (row.entity.status === \'Hired\' || row.entity.status === \'InWorkshop\') ? \'red\' : ' +
                            '(row.entity.status === \'Available\' ? \'green\' : \'black\')' +
                            '}">' +
                            '{{grid.appScope.localize(row.entity.status)}}' +
                            '<small ng-if="row.entity.statusId === \'IDL\' && row.entity.subStatus === 2 && row.entity.notReadyReason">' +
                            '({{row.entity.notReadyReason}})' +
                            '</small>' +
                            '<small><span ng-if="row.entity.movementSubType !== null">' +
                            '({{grid.appScope.loadSubStatusforNrmandWorkshop(row.entity)}})' +
                            '</span></small>' +
                            '<small><span ng-if="row.entity.subStatus === 7" style="display: inline-block;padding-left:4px">' +
                            '<a class="btn btn-circle btn-xs green-haze" style="font-size: 0.7rem;" ' +
                            'ng-click="grid.appScope.viewMovementReadyToGo(row.entity.id)" title="View Movement">' +
                            '<i class="fa fa-eye fa-xs"></i></a></span></small>' +
                            '</div>' +
                            '</div>'

                    },

                    {
                        name: app.localize('Agreement'),
                        enableSorting: false,
                        visible: options.subStatus == 8 || options.statusId == 'HIR', //ON custody OR HIRED
                        field: 'agreementNo',
                        width: "12%",

                    },
                    {
                        name: app.localize('Contact'),
                        enableSorting: false,
                        visible: options.subStatus == 8 || options.statusId == 'NRM' || options.statusId == 'HIR', //custody or NRM or hired
                        field: 'contactName',
                        width: "12%",

                    },                  
                    {
                        name: app.localize('Workshop'),
                        visible: options.statusId == 'WRK' ? true : false,
                        width: 100,
                        enableSorting: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.contactName}}</div>' +
                            '</div>'

                    },                                       
                    {
                        name: app.localize('OutDays'),
                        //visible: options.statusId == 'WRK' ? true : false,
                        visible: vm.outDaysColumnVisible(options.statusId),
                        width: 100,
                        enableSorting: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.outDays}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Reason'),
                        visible: options.statusId == 'WRK' || options.statusId == 'NRM',
                        enableSorting: false,
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.reason}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('IdleDays'),
                        //visible: showColumnIdlDays,
                        visible: vm.showIdleDaysColumn(options.statusId, options.subStatus),
                        enableSorting: false,
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.idlDays}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('LastDateIn'),
                        width: 100,
                        visible: vm.hideLastDateColumn(options.statusId) && options.statusId != "BKD",
                        enableSorting: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.lastMovement)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('User'),
                        width: 100,
                        visible: vm.showModifiedUserColumn(),
                        enableSorting: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.lastMovementModifiedUser}}</div>' +
                            '</div>'

                    },
                    
                    {
                        name: app.localize('Location'),
                        field: 'location.name',
                        width: "12%",

                    },
                    {
                        name: app.localize('KMs'),
                        field: 'kMs',
                        width: "12%",
                    },
                    ... vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('MakeAndModel'),
                        field: 'model.makeId',
                        width: "12%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getMakeModelYear(row.entity)}}</div>' +
                            '</div>'
                    }] : [],
                    
                    //{
                    //    name: app.localize('Status'),
                    //    width: 100,
                    //    cellTemplate:
                    //       '<div class=\"ui-grid-cell\">' +
                    //       '<div class=\"ui-grid-cell-contents\">{{grid.appScope.localize(row.entity.status)}}</div>' +
                    //       '</div>'

                    //},
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                        visible: options.statusId != "BKD",
                        //width: 100,
                        width: "12%",

                    },
                    {
                        name: app.localize('BookingNos'),
                        field: 'notes',
                        visible: options.statusId == "BKD",
                        width: 250,
                    }
                    

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
                movementService.getLastStatusChangedMovementId({ id: VehicleId }).success(function (data) {
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
                    templateUrl: '~/App/tenant/views/mcc/movements/viewModal.cshtml',
                    controller: 'tenant.views.movements.viewModal as vm',
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
                var getVehicleFunction = null;
                if (vm.filters.isOpenTrip) {
                    getVehicleFunction = vehicleService.getOpenTripVehiclesDashboard(vm.filters);
                } else {
                    if (vm.filters.statusId == "BKD") {
                        getVehicleFunction = vehicleService.getBookedVehiclesDashboard(vm.filters);
                    }
                    else if (vm.filters.statusId == "LIMO") {
                        vm.filters.statusId == null;
                        getVehicleFunction = vehicleService.getOpenTripVehiclesDashboard(vm.filters);
                    }
                    else {
                        if (vm.filters.isReplacementToday) {
                            getVehicleFunction = vehicleService.getVehiclesDashboardReplacementToday(vm.filters)
                        }
                        else {
                            getVehicleFunction = vm.filters.DashboardName == 'crs' ? vehicleService.getVehiclesDashboard(vm.filters)
                                : vehicleService.getVehicles(vm.filters);
                        }
                    }
                }
                //if (vm.filters.DashboardName == 'crs')
                //    getVehicleFuction = vehicleService.getVehiclesDashboard(vm.filters);
                //else
                //    getVehicleFuction = vehicleService.getVehicles(vm.filters);

                getVehicleFunction.success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    //vm.gridOptions.data
                    //angularpurchaseOrder(vm.gridOptions.data,function (value)
                    //{
                    //    vehicleService.getVehicleAvailableDays(value.fleetCode)
                    //});
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
                var getVehicleFunction = null;
                if (vm.filters.isOpenTrip) {
                    getVehicleFunction = vehicleService.exportToExcelOpenTripDashBoardCrs(vm.filters)
                } else if (vm.filters.statusId == "LIMO") {
                    vm.filters.statusId == null;
                    getVehicleFunction = vehicleService.exportToExcelOpenTripDashBoardCrs(vm.filters);
                }
                else {
                    if (vm.filters.isReplacementToday) {
                        getVehicleFunction = vehicleService.exportToExcelReplacementTodayDashBoardCrs(vm.filters)
                    } else {
                        getVehicleFunction = vm.filters.DashboardName == 'crs' ? vehicleService.exportToExcelDashBoardCrs(vm.filters)
                            : vehicleService.exportToExcelDashBoard(vm.filters);
                    }
                }
                getVehicleFunction.success(function (result) {
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
