// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:211622-212687
appModule.controller('tenant.views.crs.equipmentSales.equipments.index', [
        '$scope', '$state', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.equipmentSales', 'abp.services.app.vehicleStatus', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicleModel', 'abp.services.app.uaeFine', 'abp.services.app.tariffGroup', 'abp.services.app.directory', '$stateParams',
        function ($scope, $state, $uibModal, uiGridConstants, vehicleService, equipmentSalesService, vehicleStatusService, appSession, lookupService, utilities, vehicleModelService, finesService, tariffGroupService, directoryService, $stateParams) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.models = null;
            vm.vehicleTypes = [];
            vm.server = [];
            vm.trafficFileId = [];
            vm.AcrissTypes = [];
            vm.type = $stateParams.type;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.allowRateTypeChargesWithVehicle = abp.features.isEnabled("CRS.CustomFeatures.AllowRateTypeChargesWithVehicle");
            vm.isDamageRevenueLedgerEnabled = abp.features.isEnabled("CRS.Reports.DamageRevenueLedger");
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.vehicleCustomField1 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleCustomField1'));
            vm.vehicle_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField1"));
            vm.vehicle_EnableInvestor = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Investor"));
            vm.vehicle_EnableMortgage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Mortgage"));
            vm.vehicle_EnableLeaseToOwn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseToOwn"));
            vm.replacementOfMakeAndModelInGridForVehicles = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ReplacementOfMakeAndModelInGridForVehicles'));
            vm.operationVehicleShowInSalesModule = utilities.parseBoolean(abp.setting.get("App.Speed.Common.OperationVehicleShowInSalesModule"));

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            function initPurchaseDate() {
                vm.purchaseDateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.purchaseDateRangeModelChanged = function () {
                vm.filters.purchaseStartDate = vm.purchaseDateRangeModel.startDate != null ? vm.purchaseDateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.purchaseEndDate = vm.purchaseDateRangeModel.endDate != null ? vm.purchaseDateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            vm.prchaseDateRangeCheck = purchaseDateRangeCheck;
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
            function purchaseDateRangeCheck() {
                if (vm.filters.enablePurchaseDateRange) {
                    vm.filters.purchaseStartDate = vm.purchaseDateRangeModel.startDate != null ? vm.purchaseDateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.purchaseEndDate = vm.purchaseDateRangeModel.endDate != null ? vm.purchaseDateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enablePurchaseDateRange) {
                    vm.filters.purchaseStartDate = null;
                    vm.filters.purchaseEndDate = null;
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
            vm.isDateBefore = function (paramDate) {
                return (new Date(paramDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0));
            }
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.filters = {
                enableDateRange: false,
                enablePurchaseDateRange: false,
                fleetCode: null,
                vehicleType: null,
                ownership: null,
                plateNo: '',
                statusId: '',
                subStatus: null,
                modelId: null,
                server: null,
                locationId: '',
                status: null, //to be used only on client side will have both statusId and subStatus
                skipCount: 0,
                exteriorColor: null,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.statuses = [
                { name: app.localize('Available'), statusId: 'IDL', subStatus: 1 },
                { name: app.localize('Sold'), statusId: 'DFL', subStatus: null },
            ];
            if (vm.operationVehicleShowInSalesModule) {
                vm.statuses = vm.statuses.filter(function (s) {
                    return s.subStatus !== 1; // Available
                });

                vm.statuses.push({
                    name: app.localize('ForSale'),
                    statusId: 'IDL',
                    subStatus: 3
                });
            }
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
                vm.vehicleTypes.push({ key: 'Staff', value: 6 });
            };
            vm.vehicleOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Buy Back', value: 3 }

            ];
            vm.getVehicleValue = function () {
                vm.filters.vehicleType = vm.vehicle.vehicleType.value;
            };
            vm.getOwnershipValue = function () {
                vm.filters.ownership = vm.vehicle.ownership.value;
            };
            //vm.getStatusToDisplay = function (vehicle) {
            //    if (vehicle == null) return '';

            //    if (vehicle.statusId == 'HIR') return app.localize('Hired');
            //    if (vehicle.statusId == 'NRM') return app.localize('OnNRM');
            //    if (vehicle.statusId == 'WRK') return app.localize('InWorkshop');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus == 3) return app.localize('ForSale');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus == 4) return app.localize('TotalLoss');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus == 2) return app.localize('NotReady');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus <= 1) return app.localize('Ready');
            //    if (vehicle.statusId == 'BKD') return app.localize('Booked');
            //    if (vehicle.statusId == 'DFL') return app.localize('Defleeted');

            //    return '';
            //};

            vm.locations = [];

            //vm.vehicleSubstatusArray = utilities.getVehicleSubStatusesArray();
            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
                vehicleLog: abp.features.isEnabled("CRS.CustomFeatures.VehicleLog"),
                fines: abp.features.isEnabled("CRS.Fines"),

            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.SalesModule.EquipmentSales.AddNew'),
                view: abp.auth.hasPermission('Pages.Tenant.SalesModule.EquipmentSales.View'),
                edit: abp.auth.hasPermission('Pages.Tenant.SalesModule.EquipmentSales.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SalesModule.EquipmentSales.Delete'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.SalesModule.EquipmentSales.ExportToExcel'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.ViewOtherBranchVehicles'),
                tariff: abp.auth.hasPermission('Pages.Tenant.Tariff')
                    || abp.auth.hasPermission('Pages.ERS.Rental.Tariff')
                    || abp.auth.hasPermission('Pages.ERS.Lease.Tariff')
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.statusChanged = function () {
                console.log("Status changed:", vm.filters.status);

                if (vm.filters.status) {
                    vm.filters.statusId = vm.filters.status.statusId;
                    vm.filters.subStatus = vm.filters.status.subStatus;
                    console.log("Set statusId:", vm.filters.statusId);
                } else {
                    vm.filters.statusId = null;
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
            vm.searchvehicleOwners = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.vehicleOwners = response.data.items;
                });
            };
            vm.searchvehicleOwnersPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.vehicleOwner = customer;
                    }
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
                    return app.localize("Rental")
                if (id == 2)
                    return app.localize("Lease")
                if (id == 3)
                    return app.localize("Replacement")
                if (id == 4)
                    return app.localize("Limousine")
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
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.statusId !== \'DFL\'" ng-click="grid.appScope.editVehicle(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.statusId !== \'DFL\'" ng-click="grid.appScope.deleteVehicle(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.features.vehicleLog"  ng-click="grid.appScope.openVehicleLogsModal(row.entity)">' + app.localize('VehicleLogs') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PlateNo'),
                        width: "10%",
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.plateNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },

                    ...!vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('Make'),
                        width: "10%",
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.model.make}}</div>' +
                            '</div>'
                    }] : [],
                    ...!vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('Model'),
                        field: 'model.name',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModelYear(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    }] : [],
                    {
                        name: app.localize('VehicleType'),
                        width: "10%",
                        field: 'tariffGroup.title'
                    },

                    {
                        name: app.localize('Color'),
                        width: "10%",
                        field: 'exteriorColor',
                        visible: vm.operationVehicleShowInSalesModule,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\"' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="grid.appScope.operationVehicleShowInSalesModule">{{row.entity.exteriorColor}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('InteriorColor'),
                        width: "10%",
                        field: 'exteriorColor',
                        visible: !vm.operationVehicleShowInSalesModule,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\"' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="!grid.appScope.operationVehicleShowInSalesModule">{{row.entity.interiorColor}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Status'),
                        field: 'status.name',
                        width: "10%",
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents" ng-style="{color: row.entity.statusId === \'DFL\' ? \'red\' : (row.entity.status === \'Available\' ? \'green\' : \'black\')}">' +
                            '{{grid.appScope.localize(row.entity.status)}}' +
                            '<small ng-if="row.entity.statusId == \'IDL\' && row.entity.subStatus == 2 && row.entity.notReadyReason">({{row.entity.notReadyReason}})</small>' +
                            '</div>' +
                            '</div>',

                    },

                    {
                        name: app.localize('Location'),
                        width: "15%",
                        field: 'location.name'
                    },
                    {
                        name: app.localize('ChassisNo'),
                        width: "10%",
                        field: 'chassisNo'
                    },
                    {
                        name: app.localize('Make'),
                        width: "15%",
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.model.make}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Model'),
                        field: 'model.name',
                        width: "15%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModelYear(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('EngineCapacity'),
                        width: "20%",
                        field: 'engineCapacity',
                    },

                    {
                        name: app.localize('EngineNo'),
                        width: "10%",
                        field: 'engineNo',
                    },
                    {
                        name: app.localize('FuelTankCapacity'),
                        visible: !vm.operationVehicleShowInSalesModule,
                        width: "10%",
                        field: 'fuelTankCapacity',
                    },
                    {
                        name: app.localize('PurchaseDate'),
                        field: 'purchaseDate',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.purchaseDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PurchasePrice'),
                        visible: vm.operationVehicleShowInSalesModule,
                        width: "15%",
                        field: 'purchasePrice',
                    },
                    {
                        name: app.localize('Supplier'),
                        width: "15%",
                        field: 'supplier.name', // or supplierName (check your API)
                        cellTemplate:
                            '<div class="ui-grid-cell-contents" ng-if="grid.appScope.operationVehicleShowInSalesModule">' +
                            '   {{row.entity.supplier.name}}' +
                            '</div>'
                    }
                    //{
                    //    name: app.localize('WeeklyRentRate'),
                    //    width: "15%",
                    //    type: 'number',
                    //    field: 'weeklyRentRate',
                    //    visible: vm.allowRateTypeChargesWithVehicle,

                    //},








                    //{
                    //    name: app.localize('VehicleOwner'),
                    //    width: "10%",
                    //    field: 'supplier.name'
                    //}
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

            vm.openVehicleLogsModal = function (vehicle) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrShowVehicleLogsModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrShowVehicleLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        }
                    }
                });
            };

            vm.openInvestorLogsModal = function (vehicle) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/investorLogsModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.investorLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        }
                    }
                });
            };


            function openViewAgreementsHistoryModal(VehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewAgreementsHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewAgreementsHistoryModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        VehicleId: VehicleId,
                        ContactId: null
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };

            vm.viewAgreementsHistoryModal = function (Vehicle) {
                openViewAgreementsHistoryModal(Vehicle.id);
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/equipmentSales/equipments/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.detailReport = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vehicles/detailReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.updateMileage = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/updateMileageAlertModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.updateMileageAlertModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mileageAlert: function () {
                            return {
                                id: row.id,
                                plateNo: row.plateNo,
                                kms: row.kMs
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };


            var tfCopy = [];
            function getFiltersData() {
                finesService.getFiltersData().success(function (data) {

                    finesService.getFiltersData().success(function (data) {
                        vm.trafficFileId.push({ name: '', id: 0, state: '' })
                        angular.forEach(data.trafficFileId, function (value, key) {
                            vm.trafficFileId.push({ name: value.name, id: value.id, state: value.state });
                        });
                        tfCopy = angular.copy(vm.trafficFileId);
                    });
                    angular.forEach(data.server, function (value, key) {
                        vm.server.push({ name: value.name, id: value.name });
                    });

                });
            }

            vm.openStatusDetailModal = function (vehicle) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/statusDetailModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.statusDetailModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        }
                    }
                });
            };

            vm.clearVehicleOwner = function () {
                vm.filters.vehicleOwner = null;
                vm.filters.vehicleOwnerId = null;
            };
            vm.stateChanged = function () {

                vm.filters.trafficFileId = null;
                if (!vm.filters.server) {
                    vm.trafficFileId = tfCopy;
                }
                else {
                    vm.trafficFileId = tfCopy.filter(c => c.state.toLowerCase() === vm.filters.server.toLowerCase());
                }
            }
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getVehicles();
                    eventOnKeyPress.preventDefault();
                }
            }
            vm.getVehicles = function () {
                vm.loading = true;

                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                purchaseDateRangeCheck();
                if (vm.vehicle) {
                    if (vm.vehicle.model)
                        vm.filters.modelId = vm.vehicle.model.id;
                }
                if (vm.filters.vehicleOwner != null) {
                    vm.filters.vehicleOwnerId = vm.filters.vehicleOwner.id;
                }
                if (vm.filters.ownership != 2) {
                    vm.filters.vehicleOwnerId = null;
                    vm.filters.vehicleOwner = null;
                }
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;

                vm.filters.serverArr = [];
                if (vm.filters.statusId == 'BKD') {
                    vm.filters.dontPaginate = false;
                    vehicleService.getBookedVehicles(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null))
                            initDate();
                        initPurchaseDate();

                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    equipmentSalesService.getEquipments(vm.filters).success(function (data) {

                        if (vm.filters.allActive) {

                            vm.filters.statusId = tempStatusId;
                        }
                        data.items.forEach(function (item) {
                            if (item.status === 'Defleeted') {
                                item.status = 'Sold';
                            }
                        })
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null) || !vm.dateRangeModel || !vm.purchaseDateRangeModel || (!vm.purchaseDateRangeModel.endDate == null && !vm.purchaseDateRangeModel.startDate == null)) {
                            initDate();
                            initPurchaseDate();
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });

                }
            };
            vm.clearModel = function () {
                vm.vehicle.model = null;
                vm.filters.modelId = null;
            };

            vm.viewVehicle = function (vehicle) {
                openViewVehicleModal(vehicle.id);
            };

            function openViewVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/equipments/viewModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.equipments.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }
            vm.viewBooking = function (vehicle) {
                openViewBookingModal(vehicle.plateNo);
            };

            function openViewBookingModal(vehiclePlateNo) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewBookingModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewBookingModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehiclePlateNo: function () {
                            return vehiclePlateNo;
                        }
                    }
                });
            }
            vm.defleetVehicle = function (vehicle) {

                opendefleetVehicleModal(vehicle.id);
            };

            function opendefleetVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/defleetModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.defleetModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };

            vm.changeVehicleStatus = function (vehicle) {

                openchangeVehicleStatusModal(vehicle.id);
            };

            function openchangeVehicleStatusModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/changeStatus.cshtml',
                    controller: 'tenant.views.crs.vehicles.changeStatus as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };
            vm.onfleetVehicle = function (vehicle) {

                openOnfleetVehicleModal(vehicle.id);
            };

            function openOnfleetVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/onfleetModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.onfleetModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };
            // Export To Excel Functionality
            vm.exportToExcel = function () {
                vm.loading = true;

                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                purchaseDateRangeCheck();
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;
                equipmentSalesService.exportToExcel(vm.filters).success(function (result) {
                    if (vm.filters.allActive) {

                        vm.filters.statusId = tempStatusId;
                    }
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            // Export To Excel Functionality
            vm.vehicleDetailExportToExcel = function () {
                vm.loading = true;
                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                purchaseDateRangeCheck();
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;
                vehicleService.getVehiclesDetailExportToExcel(vm.filters).success(function (result) {
                    if (vm.filters.allActive) {

                        vm.filters.statusId = tempStatusId;
                    }
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //function getVehicleStatuses() {
            //    vm.loading = true;
            //    vehicleStatusService.getVehicleStatuses({}).success(function (data) {
            //        vm.statuses = data.items;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            function getFiltersData1() {

            }
            function openCreateOrEditEquipmentModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/equipments/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.equipments.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            }

            function openDamageRevenueLedger(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/openDamageRevenueLedger.cshtml',
                    controller: 'tenant.views.crs.vehicles.openDamageRevenueLedger as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }


            vm.damageRevenueLedger = function (vehicle) {
                openDamageRevenueLedger(vehicle.id);
            };
            vm.createEquipment = function () {
                openCreateOrEditEquipmentModal(null);
            };

            vm.editVehicle = function (vehicle) {
                openCreateOrEditEquipmentModal(vehicle.id);
            };

            vm.deleteVehicle = function (vehicle) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', vehicle.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            equipmentSalesService.deleteEquipment({
                                id: vehicle.id
                            }).success(function () {
                                vm.getVehicles();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            //vm.defleetVehicle = function (vehicle) {
            //    abp.message.confirm(
            //        app.localize('VehicleDefleetWarningMessage', vehicle.name),
            //        function(isConfirmed) {
            //            if (isConfirmed) {
            //                vehicleService.defleetVehicle({
            //                    id: vehicle.id
            //                }).success(function() {
            //                    vm.getVehicles();
            //                    abp.notify.success(app.localize('SuccessfullyDefleeted'));
            //                });
            //            }
            //        }
            //    );
            //};


            vm.getAccrissCode = function () {
                var selectedAcrissCategoryTypeCode = "";
                if (vm.filters.acrissCategoryId != null) {
                    selectedAcrissCategoryTypeCode = vm.AcrissCategoryTypes.filter(function (obj) {
                        return obj.id === vm.tariffGroup.acrissCategoryId;
                    })[0].code;
                }


                var selectedAcrissTypeCode = "";
                if (vm.filters.acrissTypeId != null) {
                    selectedAcrissTypeCode = vm.AcrissTypes.filter(function (obj) {
                        return obj.id === vm.filters.acrissTypeId;
                    })[0].code;
                }
                vm.filters.accrissCode = selectedAcrissCategoryTypeCode + selectedAcrissTypeCode;
            }

            function getAcrissTypes() {
                vm.loading = true;
                vehicleService.getVehicleTariffGroupAcrissTypes({}).success(function (data) {
                    angular.forEach(data,
                        function (item) {
                            if (item != null && item != 'null') {
                                var acrissType = new Object();
                                acrissType.id = item.id;
                                acrissType.name = item.name;//+ " (" + item.code + ")";
                                acrissType.code = item.code;
                                vm.AcrissTypes.push(acrissType);
                            }
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.defineTariff = function (tariffGroup) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffs/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.tariffs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tariffGroup: function () {
                            return tariffGroup.tariffGroup.title;
                        },
                        tariffGroupId: function () {
                            return tariffGroup.tariffGroup.id;
                        },
                        toViewInVehicles: function () {
                            return true;
                        },
                    }
                });
            };

            function init() {
                getTariffGroups();
                getAcrissTypes();
                getLocationsActiveAndInActive();
                vm.filters.status = vm.statuses.find(s => s.statusId === 'IDL');

                vm.statusChanged();
                vm.getVehicles();
                PopulateVehicleTypes(); // make vehilce type array on module enabled basis.
                getFiltersData();
                if (vm.vehicle_EnableMortgage) {
                    vm.vehicleOwnerships.push({ key: 'Mortgage', value: 8 })
                }
                if (vm.vehicle_EnableLeaseToOwn) {
                    vm.vehicleOwnerships.push({ key: 'LeaseToOwn', value: 9 })
                }
            }

            init();
        }
    ]);
