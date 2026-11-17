// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:498783-499228
appModule.controller('tenant.views.workshop.workshopVehicles.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.vehicleStatus', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicleModel',
        function ($scope, $uibModal, uiGridConstants, vehicleService, vehicleStatusService, appSession, lookupService, utilities, vehicleModelService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.models = null;
            vm.vehicleTypes = [];

            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.filters = {
                enableDateRange: false,
                fleetCode: null,
                vehicleType: null,
                ownership: null,
                plateNo: '',
                statusId: '',
                subStatus: null,
                modelId: null,
                locationId: '',
                status: null, //to be used only on client side will have both statusId and subStatus
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
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
                { name: app.localize('Defleeted'), statusId: 'DFL', subStatus: null },

            ];

            vm.disbleDateRange = function () {
                if (vm.filters.ownership !== 2 && vm.filters.ownership !== 3) {
                    vm.filters.enableDateRange = false;
                    initDate();
                }
            }

            function PopulateVehicleTypes() {
                isRentalEnabled = abp.features.isEnabled("CRS.Rental");
                isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
                isLimoEnabled = abp.features.isEnabled("CRS.Limo");
                
                //---------------------------------------------------------------------
                //---------------------------------------------------------------------
                if (isRentalEnabled) vm.vehicleTypes.push({ key: 'Rental', value: 1 });
                if (isLeaseEnabled) vm.vehicleTypes.push({ key: 'Lease', value: 2 });
                if (isRentalEnabled || isLeaseEnabled)
                    vm.vehicleTypes.push({ key: 'Replacement', value: 3 });
                if (isLimoEnabled) vm.vehicleTypes.push({ key: 'Limousine', value: 4 });
                vm.vehicleTypes.push({ key: 'Workshop', value: 5 });
            };
            vm.vehicleOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Temp External', value: 4 },
                { key: 'Buy Back', value: 3 }
            ];
            vm.getVehicleValue = function () {
                vm.filters.vehicleType = vm.vehicle.vehicleType.value;
            };
            vm.getOwnershipValue = function () {
                vm.filters.ownership = vm.vehicle.ownership.value;
            };


            vm.locations = [];

            //vm.vehicleSubstatusArray = utilities.getVehicleSubStatusesArray();
            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
                vehicleLog : abp.features.isEnabled("CRS.CustomFeatures.VehicleLog")
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vehicles.Addnew'),
                view: abp.auth.hasPermission('Pages.Tenant.Vehicles.View'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vehicles.Edit'),
                defleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.DeFleet'),
                onfleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.OnFleet'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vehicles.Delete'),
                changeSubStatus: abp.auth.hasPermission('Pages.Tenant.Vehicles.ChangeSubStatus'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.ViewOtherBranchVehicles'),
                alert: abp.auth.hasPermission('Pages.Tenant.Vehicles.Alerts')
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.statusChanged = function () {
                if (vm.filters.status != null) {
                    vm.filters.statusId = vm.filters.status.statusId;
                    vm.filters.subStatus = vm.filters.status.subStatus;
                } else {
                    vm.filters.statusId = '';
                    vm.filters.subStatus = null;
                }
            };

            //vm.getVehicleSubStatuses = function (substatus) {
            //    return utilities.getVehicleSubStatuses(substatus);
            //};
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            function getTariffGroups() {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };

            vm.locationPermission = function (row) {
                if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;

                return true;
            };
            vm.getMakeAndModel = function (model, modelYear) {
                return model.make + ' ' + model.name + ' ' + modelYear;

            };

            vm.getModelYear = function (model, modelYear) {
                return model.name + ' ' + modelYear;
            };

            vm.getVehicleType = function (id) {
                if (id == 1)
                    return app.localize("Rental");
                if (id == 2)
                    return app.localize("Lease");
                if (id == 3)
                    return app.localize("Replacement");
                if (id == 4)
                    return app.localize("Limousine");
                if (id == 5)
                    return app.localize("Workshop");
                else
                    return "";
            };

            vm.getOwnershipName = function (id) {
                if (id == 1)
                    return app.localize("Own")
                if (id == 2)
                    return app.localize("External")
                else
                    return "";
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
                        name: ' ',
                        width: "4%",
                        enableSorting: false,
                        cellTemplate:
                            //grid.appScope.permissions.onfleet &&
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewVehicle(row.entity)">' + app.localize('View') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PlateNo'),
                        width: "10%",
                        field:'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.ownership==2" class="label label-danger">' + app.localize('External') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Make'),
                        width: "10%",
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.model.make}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Model'),
                        field:'model.name',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModelYear(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VehicleType'),
                        width: "10%",
                        field: 'tariffGroup.title'
                    },
                    {
                        name: app.localize('KMs'),
                        width: "8%",
                        type: 'number',
                        field: 'kMs'
                    },
                    {
                        name: app.localize('Fuel'),
                        field: 'fuelLevel',
                        width:"8%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFuelLevel(row.entity.fuelLevel)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        width: "10%",
                        field: 'location.name'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status.name',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.localize(row.entity.status)}}  <small ng-if=\"row.entity.statusId == \'IDL\' && row.entity.subStatus == 2 && row.entity.notReadyReason \">({{row.entity.notReadyReason}})</small></div>' +
                            '</div>'
                    },                    
                    {
                        name: app.localize('RegistrationExpiry'),
                        field: 'nextRegistrationDate',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.nextRegistrationDate)}}</div>' +
                            '</div>'
                    },                    
                    {
                        name: app.localize('InsuranceExpiry'),
                        field: 'nextInsuranceDate',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.nextInsuranceDate)}}</div>' +
                            '</div>'
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
            function getLocationsActiveAndInActive() {

                lookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }



            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vehicles/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };



            vm.getVehicles = function () {
                vm.loading = true;
                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                if (vm.vehicle) {
                    if (vm.vehicle.model)
                        vm.filters.modelId = vm.vehicle.model.id;
                }

                vehicleService.getVehiclesForWorkshop(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null))
                        initDate();

                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.viewVehicle = function (vehicle) {
                openViewVehicleModal(vehicle.id);
            };

            function openViewVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/workshopVehicles/viewModal.cshtml',
                    controller: 'tenant.views.workshop.workshopVehicles.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }


            // Export To Excel Functionality
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                vehicleService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function init() {
                getTariffGroups();
                getLocationsActiveAndInActive();
                vm.getVehicles();
                PopulateVehicleTypes(); // make vehilce type array on module enabled basis.
            }

            init();
        }
    ]);
