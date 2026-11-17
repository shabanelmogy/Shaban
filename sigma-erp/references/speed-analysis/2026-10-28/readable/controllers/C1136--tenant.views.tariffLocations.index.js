// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298444-298576
appModule.controller('tenant.views.tariffLocations.index', ['$scope', '$uibModal', 'abp.services.app.tariffLocation', 'uiGridConstants',
        function ($scope, $uibModal, tariffLocationService, uiGridConstants) {
            var vm = this;

            vm.loading = false;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

           

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.TariffLocations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.TariffLocations.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TariffLocations.Delete')
            };

            

            // OpeningCreateOrEditTrafficLocationModal 
            function openCreateOrEditTariffLocationModal(tariffLocationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffLocations/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.tariffLocations.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffLocationId: function () {
                            return tariffLocationId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTariffLocations();
                });
            }

            //  Opening View TariffLocationModal
            function openViewTariffLocationModal(tariffLocationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffLocations/viewModal.cshtml',
                    controller: 'tenant.views.crs.tariffLocations.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffLocationId: function () {
                            return tariffLocationId;
                        }
                    }
                });
            }

            // getTariffLocations
            vm.getTariffLocations = function () {
                {
                    vm.loading = true;
                    tariffLocationService.getTariffLocations({}).success(function (data) {
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                };
            }
                        
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.viewTariffLocation(row.entity)">' + app.localize('View') + '</a></li>' +

                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editTariffLocation(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTariffLocation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('TariffLocationName'),
                        field: 'name'
                    }
                ],
                data: []
            };

            // creating TariffLocations
            vm.createTariffLocation = function () {
                openCreateOrEditTariffLocationModal(null);
            }

            // viewing TariffLocations
            vm.viewTariffLocation = function (tarrifLocation)
            {
                openViewTariffLocationModal(tarrifLocation.id);
            }

            // Editing TariffLocations
            vm.editTariffLocation = function (tarrifLocation) {
                openCreateOrEditTariffLocationModal(tarrifLocation.id);
            };

            // delete TariffLocations
            vm.deleteTariffLocation = function (tariffLocation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', tariffLocation.name),
                    //app.localize('LocationDeleteWarningMessage', tariffLocation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            tariffLocationService.deleteTariffLocation({
                                id: tariffLocation.id
                            }).success(function () {
                                vm.getTariffLocations();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            // Getting Tariff Locations
            vm.getTariffLocations();
        }
    ]);
