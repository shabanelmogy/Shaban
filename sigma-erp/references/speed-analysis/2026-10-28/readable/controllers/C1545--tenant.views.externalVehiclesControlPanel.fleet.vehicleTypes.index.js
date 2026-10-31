// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:423953-424209
appModule.controller('tenant.views.externalVehiclesControlPanel.fleet.vehicleTypes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.externalTariffGroup', 'abp.services.app.commonLookup', 'utilities', '$stateParams',
        function ($scope, $uibModal, uiGridConstants, externalTariffGroupService, commonLookupService, utilities, $stateParams) {

            var vm = this;
            //vm.enableUserWiseDiscount = utilities.parseBoolean(abp.setting.get("App.General.EnableUserWiseDiscount"));
            //vm.enableUserWiseDiscount = abp.features.isEnabled("CRS.UserWiseDiscount");
            //vm.isMccEnabled = abp.features.isEnabled("MCC");
            //vm.isVmiWorkshopEnabled = abp.features.isEnabled("VMIWorkshop");
            //vm.isCrsEnabled = abp.features.isEnabled("CRS");

            vm.manageGroupBtnEnabled = true;
            if (vm.isMccEnabled == true)
                vm.manageGroupBtnEnabled = false;
            if (vm.isVmiWorkshopEnabled == true)
                vm.manageGroupBtnEnabled = false;
            if (vm.isCrsEnabled == true)
                vm.manageGroupBtnEnabled = true;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.type = $stateParams.type;

            vm.filters = {
                Title: '',
                SubTitle: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.VehicleTypes'),
                create: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.VehicleTypes.AddNew'),
                edit: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.VehicleTypes.Edit'),
                'delete': abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.VehicleTypes.Delete'),
            //    discountCode: abp.auth.hasPermission('Pages.Tenant.DiscountAuthCode')
            };

            vm.viewtariffGroup = function (tariffGroup) {

                openViewTariffGroupModal(tariffGroup.id);
            };

            function openViewTariffGroupModal(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/fleet/vehicleTypes/viewModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.fleet.vehicleTypes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tariffGroupId: function () {
                            return tariffGroupId;
                        },
                        isViewModal: function () {
                            return true;
                        }
                    }
                });
            }

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
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewtariffGroup(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editTariffGroup(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTariffGroup(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        field: 'title'
                    },
                    {
                        name: app.localize('Detail'),
                        field: 'subTitle'
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes'
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

                        vm.getTariffGroup();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTariffGroup();
                    });
                },
                data: []
            };


            vm.getTariffGroup = function () {

                vm.loading = true;
                externalTariffGroupService.getTariffGroup(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTariffGroupModal(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/fleet/vehicleTypes/createOrEditModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.fleet.vehicleTypes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tariffGroupId: function () {
                            return tariffGroupId;
                        },
                        isViewModal: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTariffGroup();
                });
            }

            function openManageGroups(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/vehicleTypes/manageGroups.cshtml',
                    controller: 'tenant.views.crs.vehicles.vehicleTypes.manageGroups as vm',
                    backdrop: 'static',
                    size: 'md'
                });

                modalInstance.result.then(function (result) {
                    vm.getTariffGroup();
                });
            }


            vm.manageGroups = function () {
                openManageGroups(null);
            };

            vm.createTariffGroup = function () {
                openCreateOrEditTariffGroupModal(null);
            };

            vm.editTariffGroup = function (tariffGroup) {

                openCreateOrEditTariffGroupModal(tariffGroup.id);
            };

            vm.deleteTariffGroup = function (tariffGroup) {

                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            externalTariffGroupService.deleteTariffGroup({
                                id: tariffGroup.id
                            }).success(function () {
                                vm.getTariffGroup();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.defineTariff = function (tariffGroup) {
                if (vm.type == 2) {      /// type is equal to 2 represents the Lease tariff pop up
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vehicles/vehicleTypes/createOrEditModal.cshtml',
                        controller: 'tenant.views.crs.lease.tariff.createOrEditModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            tariffGroup: function () {
                                return tariffGroup.title;
                            },
                            tariffGroupId: function () {
                                return tariffGroup.id;
                            }
                        }
                    });
                }
                else {  //rental tariff pop up
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vehicles/vehicleTypes/createOrEditModal.cshtml',
                        controller: 'tenant.views.crs.tariffs.createOrEditModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            tariffGroup: function () {
                                return tariffGroup.title;
                            },
                            tariffGroupId: function () {
                                return tariffGroup.id;
                            }
                        }
                    });
                }
            };
            vm.locationWiseSetting = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffs/locationWiseSettingModal.cshtml',
                    controller: 'tenant.views.crs.tariffs.locationWiseSettingModal as vm',
                    backdrop: 'static',
                });
            };
            vm.userWiseSetting = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffGroups/userWiseSettingModal.cshtml',
                    controller: 'tenant.views.crs.tariffGroups.userWiseSettingModal as vm',
                    backdrop: 'static',
                });
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            getLocations();
            vm.getTariffGroup();
        }
    ]);
