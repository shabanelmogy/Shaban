// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298014-298302
appModule.controller('tenant.views.crs.tariffGroups.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tariffGroup', 'abp.services.app.commonLookup', 'utilities', '$stateParams',
        function ($scope, $uibModal, uiGridConstants, tariffGroupService, commonLookupService, utilities, $stateParams) {

            var vm = this;
            //vm.enableUserWiseDiscount = utilities.parseBoolean(abp.setting.get("App.General.EnableUserWiseDiscount"));
            vm.enableUserWiseDiscount = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.enableBranchWiseUserDiscount = abp.features.isEnabled("CRS.UserWiseDiscount.BranchWiseUserDiscount");

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
                view: abp.auth.hasPermission('Pages.Tenant.TariffGroups'),
                create: abp.auth.hasPermission('Pages.Tenant.TariffGroups.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.TariffGroups.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TariffGroups.Delete'),
                discountCode: abp.auth.hasPermission('Pages.Tenant.DiscountAuthCode'),
                tariff: abp.auth.hasPermission('Pages.Tenant.Tariff')
                || abp.auth.hasPermission('Pages.ERS.Rental.Tariff')
                || abp.auth.hasPermission('Pages.ERS.Lease.Tariff')
            };

            vm.viewtariffGroup = function (tariffGroup) {

                openViewTariffGroupModal(tariffGroup.id);
            };

            function openViewTariffGroupModal(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffGroups/viewModal.cshtml',
                    controller: 'tenant.views.crs.tariffGroups.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tariffGroupId: function () {
                            return tariffGroupId;
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
                        width: 90,
                        cellTemplate:
                       '<div class=\"ui-grid-cell-contents\">' +
                       '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                       '    <button ng-disabled="!grid.appScope.permissions.tariff" class="btn btn-xs btn-primary blue" aria-haspopup="true"  ng-click="grid.appScope.defineTariff(row.entity)" > ' + app.localize('Tariff') + ' </button>' +
                       '  </div>' +
                       '</div>'
                    },

                    {
                        name: app.localize('VehicleType'),
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
                tariffGroupService.getTariffGroup(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTariffGroupModal(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffGroups/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.tariffGroups.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tariffGroupId: function () {
                            return tariffGroupId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTariffGroup();
                });
            }

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
                            tariffGroupService.deleteTariffGroup({
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
                        templateUrl: '~/App/tenant/views/crs/lease/tariff/createOrEditModal.cshtml',
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
                if (vm.type == 7) {      /// type is equal to 7 represents the equipment rental tariff pop up
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/ers/rental/tariff/createOrEditModal.cshtml',
                        controller: 'tenant.views.ers.rental.tariff.createOrEditModal as vm',
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
                if (vm.type == 8) {      /// type is equal to 8 represents the equipment Lease tariff pop up
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/ers/lease/tariff/createOrEditModal.cshtml',
                        controller: 'tenant.views.ers.lease.tariff.createOrEditModal as vm',
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
                else if (vm.type != 2 && vm.type != 4 && vm.type != 7 && vm.type != 8) {  //rental tariff pop up
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/tariffs/createOrEditModal.cshtml',
                        controller: 'tenant.views.crs.tariffs.createOrEditModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            tariffGroup: function () {
                                return tariffGroup.title;
                            },
                            tariffGroupId: function () {
                                return tariffGroup.id;
                            },
                            toViewInVehicles: function () {
                                return false;
                            },
                        }
                    });
                }
                else if (vm.type == 4) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/chauffeur/tariffs/createOrEditModal.cshtml',
                        controller: 'tenant.views.crs.chauffeur.tariffs.createOrEditModal as vm',
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
                if (vm.type == 4) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/chauffeur/tariffs/locationWiseSettingModal.cshtml',
                        controller: 'tenant.views.crs.chauffeur.tariffs.locationWiseSettingModal as vm',
                        backdrop: 'static',
                    });
                }
                else {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/tariffs/locationWiseSettingModal.cshtml',
                        controller: 'tenant.views.crs.tariffs.locationWiseSettingModal as vm',
                        backdrop: 'static',
                    });
                }
            };
            vm.userWiseSetting = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffGroups/userWiseSettingModal.cshtml',
                    controller: 'tenant.views.crs.tariffGroups.userWiseSettingModal as vm',
                    backdrop: 'static',
                });
            };

            vm.branchWiseSetting = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffGroups/branchWiseUserSettingModal.cshtml',
                    controller: 'tenant.views.crs.tariffGroups.branchWiseUserSettingModal as vm',
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
