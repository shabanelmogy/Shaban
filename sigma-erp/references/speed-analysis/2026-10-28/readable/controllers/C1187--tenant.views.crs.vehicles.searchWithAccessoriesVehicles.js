// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:313083-313348
appModule.controller('tenant.views.crs.vehicles.searchWithAccessoriesVehicles', ['$scope', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.commonLookup',
            'abp.services.app.vehicleModel', 'uiGridConstants', 'options',
            function ($scope, $uibModalInstance, vehicleService, lookupService,
                vehicleModelService, uiGridConstants, options) {

                var vm = this;
                vm.viewOtherBranchVehicle = abp.auth.hasPermission('Pages.Tenant.Vehicles.ViewOtherBranchVehicles');
                vm.selectedModel = null;
                vm.selectedTariffGroup = null;
                vm.tariffGroups = [];
                vm.options = options;
                //vm.disableTariffGroup = false; //tariffGroup != null ? true : false;
                vm.disableTariffGroup = vm.options.tariffGroupId != null ? true : false;
                vm.disableMakeAndModel = vm.options.modelId != null ? true : false;
                vm.initialized = false;
                vm.selectedTariffGroup = vm.options.tariffGroup ? vm.options.tariffGroup.title : null;
                vm.searchModelFilters = {
                    name: '',
                    makeId: null,
                };
                vm.selectedModel = vm.options.model;

                if (vm.option) {
                    if (vm.option.fromDateTime)
                        vm.options.fromDateTime = vm.options.fromDateTime.toJSON();
                    if (vm.option.toDateTime)
                        vm.options.toDateTime = vm.options.toDateTime.toJSON();
                }

                vm.searchVehicleFilters = {
                    fromDateTime: vm.options.fromDateTime,
                    toDateTime: vm.options.toDateTime,
                    plateNo: null,

                    tariffGroupId: vm.options.tariffGroupId,
                    modelId: vm.options.modelId,
                    statusId: vm.options.statusId,
                    subStatus: vm.options.subStatus,
                    subStatuses: vm.options.subStatuses,
                    ownership: vm.options.ownership,
                    source: vm.options.source,
                    doNotIncludeReplacementVehicle: vm.options.doNotIncludeReplacementVehicle,
                    skipCount: 0,
                    maxResultCount: 100 //app.consts.grid.defaultPageSize,
                };
                vm.searchWithAccessoriesVehiclesPaged = function ($select) {
                    vm.searchModelFilters.name = $select.search;
                    if (vm.searchModelFilters.name == '')
                        vm.searchModelFilters.name = "~";  //to avoid default suggestions 

                    return vehicleModelService.searchVehicleModelsNew(vm.searchModelFilters).then(function (response) {
                        vm.models = response.data.items;
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.clearInput = function () {
                    vm.selectedModel = null;
                    if (!vm.disableTariffGroup)
                        vm.selectedTariffGroup = null;
                };

                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('YYYY-MM-DD HH:mm');
                    }
                    else {
                        return "";
                    }
                };

                vm.fromDateTimeChanged = function () {
                    if (vm.initialized) {
                        var fromDate = angular.copy(vm.searchVehicleFilters.fromDateTime);
                        vm.searchVehicleFilters.toDateTime = moment(fromDate.add(1, 'day')).utc();
                    }
                    else
                        vm.initialized = true;
                };

                vm.searchVehicles = function () {
                    vm.loading = true;

                    vm.searchVehicleFilters.modelId = null;
                    //vm.searchVehicleFilters.tariffGroupId = null;

                    if (vm.selectedModel != null)
                        vm.searchVehicleFilters.modelId = vm.selectedModel.id;

                    if (vm.selectedTariffGroup != null)
                        vm.searchVehicleFilters.tariffGroupId = vm.selectedTariffGroup.id;


                    var vehicleSearchCall;
                    if (vm.options.isWorkShop)
                        vehicleSearchCall = vehicleService.searchVehiclesPagedWorkShop(vm.searchVehicleFilters);
                    else
                        vehicleSearchCall = vehicleService.searchWithAccessoriesVehiclesPaged(vm.searchVehicleFilters);


                        vehicleSearchCall.success(
                            function (result) {
                                vm.gridOptions.totalItems = result.totalCount;
                                vm.gridOptions.data = result.items;
                                angular.forEach(vm.gridOptions.data, function (row) {
                                    row.getMakeAndModel = function () {
                                        return this.model.make + ' ' + this.model.name;
                                    };
                                    row.getStatusInPeriod = function () {
                                        return app.localize(this.statusInPeriod);
                                    };
                                    row.getDetail = function () {
                                        var period = (this.startDate ? vm.getlocalDateTime(this.startDate) : '') + (this.endDate ? ' - ' + vm.getlocalDateTime(this.endDate) : '');
                                        return (period != '' ? '(' + period + ') ' : '') + (this.detail ? this.detail : '');
                                    };
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });;
                };

                vm.gridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: 100, //app.consts.grid.defaultPageSize,
                    maxResultCount: 100,
                    useExternalPagination: true,
                    appScopeProvider: vm,
                    enableSorting: false,
                    columnDefs: [
                        {
                            name: app.localize('VehicleNo'),
                            field: 'plateNo',
                            width: 120,

                            //cellTemplate:
                            //    '<div class="ui-grid-cell-contents">' +
                            //                          '{{row.entity.plateNo}} &nbsp' +
                            //                          '<span id="isBooked" ng-if="row.entity.isBooked" class="label label-warning" data-toggle="tooltip" title="{{grid.appScope.getBookingDate(row.entity)}}" data-placement="top">'
                            //                          + app.localize('Booked') +
                            //                          '</span>' +
                            //                          '</div>'
                        },
                        {
                            name: app.localize('MakeAndModel'),
                            field: 'getMakeAndModel()',
                            width: 220
                        },
                        {
                            name: app.localize('VehicleType'),
                            field: 'tariffGroup.title',
                            width: 150
                        },
                        {
                            name: app.localize('Colour'),
                            field: 'exteriorColor',
                            width: 100
                        },
                        {
                            name: app.localize('Location'),
                            field: 'location.name',
                            width: 200
                        },
                        {
                            name: app.localize('Status'),
                            field: 'getStatusInPeriod()',
                            width: 120
                        },
                        {
                            name: app.localize('Detail'),
                            field: 'getDetail()',
                            width: 600
                        }

                    ],
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                            if (!sortColumns.length || !sortColumns[0].field) {
                                vm.searchVehicleFilters.sorting = null;
                            } else {
                                vm.searchVehicleFilters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            }
                            vm.searchVehicles();
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                            vm.searchVehicleFilters.skipCount = (pageNumber - 1) * pageSize;
                            vm.searchVehicleFilters.maxResultCount = pageSize;

                            vm.searchVehicles();
                        });
                    },
                    data: []
                };

                if (vm.options.selectable) {
                    vm.gridOptions.columnDefs.splice(0, 0, {
                        name: app.localize('Select'),
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" aria-haspopup="true" ng-disabled="row.entity.statusIdInPeriod != \'IDL\'" ng-click="grid.appScope.vehicleSelected(row.entity)" ><i class="fa fa-check"></i> ' + app.localize('Select') + ' </button>' +
                            '  </div>' +
                            '</div>'
                    });
                }

                if (vm.options.allSelectable) {
                    vm.gridOptions.columnDefs.splice(0, 0, {
                        name: app.localize('Select'),
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" aria-haspopup="true" ng-click="grid.appScope.vehicleSelected(row.entity)" ><i class="fa fa-check"></i> ' + app.localize('Select') + ' </button>' +
                            '  </div>' +
                            '</div>'
                    });
                }

                vm.vehicleSelected = function (vehicle) {
                    // Below two make and model values are made for agreement vehicle selection (Search vehicle from vehicle model and press select button)
                    vehicle.make = vehicle.model.make;
                    vehicle.model = vehicle.model.name;


                    $uibModalInstance.close(vehicle);
                };

                vm.getBookingDate = function (vehicle) {
                    if (vehicle.startDate) {
                        return vm.getlocalDateTime(vehicle.startDate) + ' - ' + vm.getlocalDateTime(vehicle.endDate);
                    }
                    return '';
                };

                function getLocations() {
                    lookupService.getLocations({}).success(function (data) {
                        vm.locations = data.items;
                    });
                }
                function init() {
                    vm.loading = true;
                    getLocations();
                    lookupService.getTariffGroups({})
                        .success(function (result) {
                            vm.tariffGroups = result.items;

                            if (vm.options.tariffGroup != null)
                                vm.selectedTariffGroup = vm.options.tariffGroup;

                        }).finally(function () {
                            vm.loading = false;
                        });

                }

                init();

            }]);
