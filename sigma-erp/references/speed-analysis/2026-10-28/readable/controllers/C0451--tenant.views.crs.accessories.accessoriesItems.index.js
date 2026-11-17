// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115930-116491
appModule.controller('tenant.views.crs.accessories.accessoriesItems.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.accessory', 'abp.services.app.vehicleStatus', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicleModel',
        function ($scope, $uibModal, uiGridConstants, accessoriesService, vehicleStatusService, appSession, lookupService, utilities, vehicleModelService) {

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
                { name: app.localize('Available'), statusId: 'IDL', subStatus: 1 },
                { name: app.localize('Defleeted'), statusId: 'DFL', subStatus: null },

            ];

            vm.disbleDateRange = function () {
                if (vm.filters.ownership !== 2 && vm.filters.ownership !== 3) {
                    vm.filters.enableDateRange = false;
                    initDate();
                }
            }


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
                defleetAccessories: abp.auth.hasPermission('Pages.Tenant.AccessoriesRental.DefleetAccessories'),
                onfleetAccessories: abp.auth.hasPermission('Pages.Tenant.AccessoriesRental.OnfleetAccessories'),
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

            //function getTariffGroups() {
            //    //vm.loading = true;
            //    lookupService.getTariffGroups({}).success(function (data) {
            //        vm.tariffGroups = data.items;
            //    });
            //};

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
                            '      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editVehicle(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.changeSubStatus && row.entity.statusId != \'DFL\' && grid.appScope.locationPermission(row.entity) && row.entity.statusId == \'IDL\' && row.entity.subStatus != 8" ng-click="grid.appScope.changeVehicleStatus(row.entity)">' + app.localize('ChangeSubStatus') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.defleetAccessories && row.entity.statusId == \'IDL\' && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.defleetAccessory(row.entity)">' + app.localize('Defleet') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.onfleetAccessories && row.entity.statusId == \'DFL\' && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.onfleetAccessory(row.entity)">' + app.localize('Onfleet') + '</a></li>' +                            //'      <li><a ng-if="grid.appScope.permissions.alert && row.entity.statusId != \'DFL\' && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.updateMileage(row.entity)">' + app.localize('UpdateMileage') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.features.rental || grid.appScope.features.lease || grid.appScope.features.chauffeur" ng-click="grid.appScope.viewAgreementsHistoryModal(row.entity)">' + app.localize('ViewAgreementsHistory') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteVehicle(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.features.vehicleLog"  ng-click="grid.appScope.openVehicleLogsModal(row.entity)">' + app.localize('VehicleLogs') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AccessoryNo'),
                        //width: "10%",
                        field:'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.ownership==2" class="label label-danger">' + app.localize('External') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Make'),
                        //width: "10%",
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.model.make}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Model'),
                        field:'model.name',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModelYear(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Location'),
                        //width: "10%",
                        field: 'location.name'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status.name',
                       //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.localize(row.entity.status)}}  <small ng-if=\"row.entity.statusId == \'IDL\' && row.entity.subStatus == 2 && row.entity.notReadyReason \">({{row.entity.notReadyReason}})</small></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PurchaseDate'),
                        field: 'purchaseDate',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.purchaseDate)}}</div>' +
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
            function getLocations() {

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
                            return '~/App/tenant/views/crs/accessories/accessoriesItems/report.cshtml';
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

                accessoriesService.getAccessories(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null))
                        initDate();

                }).finally(function () {
                    vm.loading = false;
                });
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
                    templateUrl: '~/App/tenant/views/crs/accessories/accessoriesItems/viewModal.cshtml',
                    controller: 'tenant.views.crs.accessories.accessoriesItems.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }

            vm.defleetAccessory = function (vehicle) {
                opendefleetAccessoryModal(vehicle.id);
            };

            function opendefleetAccessoryModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accessories/accessoriesItems/defleetModal.cshtml',
                    controller: 'tenant.views.crs.accessories.accessoriesItems.defleetModal as vm',
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


            vm.onfleetAccessory = function (vehicle) {

                openOnfleetAccessoryModal(vehicle.id);
            };

            function openOnfleetAccessoryModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl:'~/App/tenant/views/crs/accessories/accessoriesItems/onfleetModal.cshtml',
                    controller: 'tenant.views.crs.accessories.accessoriesItems.onfleetModal as vm',
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
       
            // Export To Excel Functionality
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                accessoriesService.exportToExcel(vm.filters).success(function (result) {
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

            function openCreateOrEditVehicleModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accessories/accessoriesItems/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.accessories.accessoriesItems.createOrEditModal as vm',
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
            }

            vm.createVehicle = function () {
                openCreateOrEditVehicleModal(null);
            };

            vm.editVehicle = function (vehicle) {
                openCreateOrEditVehicleModal(vehicle.id);
            };

            vm.deleteVehicle = function (vehicle) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', vehicle.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            accessoriesService.deleteAccessory({
                                id: vehicle.id
                            }).success(function () {
                                vm.getVehicles();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                //getTariffGroups();
                getLocations();
                vm.getVehicles();
                //PopulateVehicleTypes(); // make vehilce type array on module enabled basis.
            }

            init();
        }
    ]);
