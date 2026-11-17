// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312644-313077
appModule.controller('tenant.views.crs.vehicles.searchVehicleModal', ['$scope', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.commonLookup',
            'abp.services.app.vehicleModel', 'uiGridConstants', 'options', 'utilities',
            function ($scope, $uibModalInstance, vehicleService, lookupService,
                vehicleModelService, uiGridConstants, options, utilities) {

                var vm = this;
                vm.viewOtherBranchVehicle = abp.auth.hasPermission('Pages.Tenant.Vehicles.ViewOtherBranchVehicles');
                vm.isVehicleSelectionByTypeInAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableVehicleSelectionByTypeInAgreements"));

                vm.selectedModel = null;
                vm.selectedVehicle = null;
                vm.selectedTariffGroup = null;
                vm.tariffGroups = [];
                vm.options = options;
                vm.source = options.source;
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
                vm.agreementType = [];
                //vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));

                function getAgreementType() {
                    vm.agreementType.push({ name: app.localize("Daily"), id: 1 });
                    vm.agreementType.push({ name: app.localize("Weekly"), id: 2 });
                    vm.agreementType.push({ name: app.localize("Monthly"), id: 3 });
                };
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
                    agreementType: [],
                    customerContact: [],
                    tariffGroupId: vm.options.tariffGroupId,
                    modelId: vm.options.modelId,
                    statusId: vm.options.statusId,
                    subStatus: vm.options.subStatus,
                    subStatuses: vm.options.subStatuses,
                    vehicleType: vm.options.vehicleType,
                    ownership: vm.options.ownership,
                    source: vm.options.source,
                    isSearchFromLimo: vm.options.isSearchFromLimo || false,
                    doNotIncludeReplacementVehicle: vm.options.doNotIncludeReplacementVehicle,
                    skipCount: 0,
                    maxResultCount: 100 //app.consts.grid.defaultPageSize,
                };
               

                vm.statuses = [
                    { name: app.localize('Hired'), statusId: 'HIR', subStatus: null },
                    { name: app.localize('OnNRM'), statusId: 'NRM', subStatus: null },
                    { name: app.localize('InWorkshop'), statusId: 'WRK', subStatus: null },
                    { name: app.localize('ForSale'), statusId: 'IDL', subStatus: 3 },
                    { name: app.localize('TotalLoss'), statusId: 'IDL', subStatus: 4 },
                    { name: app.localize('Custody'), statusId: 'IDL', subStatus: 8 },
                    { name: app.localize('PendingCustomerDelivery'), statusId: 'IDL', subStatus: 5 },
                    { name: app.localize('PendingWorkshopDelivery'), statusId: 'IDL', subStatus: 6 },
                    { name: app.localize('NotReady'), statusId: 'IDL', subStatus: 2 },
                    { name: app.localize('Available'), statusId: 'IDL', subStatus: 1 },
                    { name: app.localize('ReadyToGo'), statusId: 'IDL', subStatus: 7 },
                    { name: app.localize('Booked'), statusId: 'BKD', subStatus: null },

                ];
                vm.statusChanged = function () {
                    if (vm.searchVehicleFiltersStatus != null) {
                        vm.searchVehicleFilters.statusId = vm.searchVehicleFiltersStatus.statusId;
                        vm.searchVehicleFilters.subStatus = vm.searchVehicleFiltersStatus.subStatus;
                    } else {
                        vm.searchVehicleFilters.statusId = '';
                        vm.searchVehicleFilters.subStatus = null;
                    }
                };

                vm.searchModel = function ($select) {
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

                vm.clearVehicle = function () {
                    vm.selectedVehicle = null;
                    vm.searchVehicleFilters.plateNo = null;

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

                    vm.searchVehicleFilters.agreementTypeArray = [];
                    if (vm.searchVehicleFilters.agreementType.length > 0) {
                        angular.forEach(vm.searchVehicleFilters.agreementType, function (value) {
                            vm.searchVehicleFilters.agreementTypeArray.push(value.id);
                        });
                    }

                    var vehicleSearchCall;
                    if (vm.options.isWorkShop)
                        vehicleSearchCall = vehicleService.searchVehiclesPagedWorkShop(vm.searchVehicleFilters);
                    else {

                        if (vm.searchVehicleFilters.agreementTypeArray.length > 0) {
                            vehicleSearchCall = vehicleService.searchVehiclesPagedByAgreement(vm.searchVehicleFilters);

                        } else {
                            vehicleSearchCall = vehicleService.searchVehiclesPaged(vm.searchVehicleFilters);
                        }

                    }

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

                vm.searchVehiclesFilters = function ($select) {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                    if (vm.isVehicleSelectionByTypeInAgreements) {
                        return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', vehicleType: vm.options.vehicleType, isSearchFromLimo: vm.options.isSearchFromLimo || false, subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId }).then(function (response) {
                            vm.vehicles = response.data.items;
                        });
                    }
                    else {
                        return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', isSearchFromLimo: vm.options.isSearchFromLimo || false, subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId }).then(function (response) {
                            vm.vehicles = response.data.items;
                        });
                    }                  
                };  

                vm.exportToExcelByAgreement = function () {
                    vm.loading = true;
                    if (vm.searchVehicleFilters.enableDateRange) {
                        vm.searchVehicleFilters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                        vm.searchVehicleFilters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                    //vm.changeInvoiceRange();
                    if (vm.searchVehicleFilters.vehicle) {
                        vm.searchVehicleFilters.vehicleId = vm.searchVehicleFilters.vehicle.id;
                    }
                    if (vm.searchVehicleFilters.vip != null) {
                        vm.searchVehicleFilters.isVipCustomer = vm.searchVehicleFilters.vip;
                    } else {
                        vm.searchVehicleFilters.isVipCustomer = null;
                    }
                    vm.searchVehicleFilters.agreementTypeArray = [];
                    vm.searchVehicleFilters.contactGroups = []; //ids only


                    vm.searchVehicleFilters.agreementTypeArray = [];
                    if (vm.searchVehicleFilters.agreementType.length > 0) {
                        angular.forEach(vm.searchVehicleFilters.agreementType, function (value) {
                            vm.searchVehicleFilters.agreementTypeArray.push(value.id);
                        });
                    }
                    if (vm.searchVehicleFilters.customerContact.length > 0) {
                        angular.forEach(vm.searchVehicleFilters.customerContact, function (value) {
                            vm.searchVehicleFilters.contactGroups.push(value.id);
                        });
                    }

                    if (vm.searchVehicleFilters.agreementType.length > 0) {

                        vehicleService.exportToExcelByAgreement(vm.searchVehicleFilters)
                            .success(function (result) {
                                app.downloadTempFile(result);
                            }).finally(function () {
                                vm.loading = false;
                            });
                    } else {

                    vehicleService.exportToExcelByAgreement(vm.searchVehicleFilters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
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
                            name: app.localize('ChassisNo'),
                            field: 'chassisNo',
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
                //vm.getTeriffGroups = function () {
                  
                //        if (vm.tariffGroups.inActive) {
                //            lookupService.getTariffGroups({ inActive: vm.tariffGroups.inActive }).success(function (data) {
                //                vm.tariffGroups = data.items;
                //            });
                //        }
                //        else {
                //            lookupService.getTariffGroups({}).success(function (data) {
                //                vm.tariffGroups = data.items;
                //            });
                //        }
                    
                //};
                vm.getTeriffGroups = function () {
                    var params = {};

                    // Check if any object in the array has inActive property set to true
                    var anyInactive = false;

                    vm.tariffGroups.forEach(function (tariffGroup) {
                        if (vm.selectedTariffGroup.inActive) {
                            anyInactive = true;
                        }
                    });

                    // Set the 'inActive' property in the params object based on the array content
                    if (anyInactive) {
                        params.inActive = true;
                    }

                    lookupService.getTariffGroups(params)
                        .success(function (data) {
                            vm.tariffGroups = data.items;
                        });
                };

                function init() {
                    vm.loading = true;
                    getLocations();
                    vm.getTeriffGroups();
                    lookupService.getTariffGroups({})
                        .success(function (result) {
                            vm.tariffGroups = result.items;

                            if (vm.options.tariffGroup != null)
                                vm.selectedTariffGroup = vm.options.tariffGroup;

                        }).finally(function () {
                            vm.loading = false;
                        });
                    getAgreementType();
                }

                init();

            }]);
