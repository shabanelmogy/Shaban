// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101428-101555
appModule.controller('tenant.views.locations.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.location',
        function ($scope, $uibModal, uiGridConstants, locationService) {

            var vm = this;
            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.isTaxBranchEnabled = abp.features.isEnabled("CRS.CustomFeatures.TaxBranchwise");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Locations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Locations.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Locations.Delete')
            };

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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editLocation(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteLocation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('LocationCode'),
                        field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span ng-class="{ \'red-text\': row.entity.inActive }">' + '{{row.entity.code}}' + '&nbsp' + '</span>' +
                            ' <span ng-show="row.entity.inActive" class="label label-danger">' + app.localize('In-Active') + '</span>' +
                            '</div>'
                    },

                    {
                        name: app.localize('LocationCode2'),
                        field: 'code2'
                    },

                    {
                        name: app.localize('LocationName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('TaxId'),
                        field: 'taxId',
                        visible: vm.isCrsEnabled
                    },
                    {
                        name: app.localize('TaxPercent'),
                        field: 'taxPercent',
                        visible: vm.isCrsEnabled && vm.isTaxBranchEnabled
                    },
                ],
                data: []
            };

            vm.getLocations = function () {
                vm.loading = true;
                locationService.getLocations({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditLocationModal(locationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/locations/createOrEditModal.cshtml',
                    controller: 'tenant.views.locations.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        locationId: function () {
                            return locationId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getLocations();
                });
            }

            vm.createLocation = function () {
                openCreateOrEditLocationModal(null);
            };

            vm.editLocation = function (location) {
                openCreateOrEditLocationModal(location.id);
            };

            vm.deleteLocation = function (location) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            locationService.deleteLocation({
                                id: location.id
                            }).success(function () {
                                vm.getLocations();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getLocations();
        }
    ]);
