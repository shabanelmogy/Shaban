// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255157-255278
appModule.controller('tenant.views.crs.limousine.tripTypes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tripType',
        function ($scope, $uibModal, uiGridConstants, tripTypeService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Limousine.TripTypes'),
                create: abp.auth.hasPermission('Pages.Tenant.Limousine.TripTypes.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Limousine.TripTypes.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Limousine.TripTypes.Delete'),
                'tariffSettings': abp.auth.hasPermission('Pages.Tenant.Limousine.TripTypes.TariffSettings')
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
                            '      <li><a  ng-if="grid.appScope.permissions.edit"  ng-click="grid.appScope.editTripType(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.tariffSettings" ng-click="grid.appScope.openSettings(row.entity)">' + app.localize('TariffSettings') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTripType(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getTripTypes = function () {
                vm.loading = true;
                
                tripTypeService.getTripTypes().success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });;
            };

            function openCreateOrEdittripTypeModal(tripTypeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/tripTypes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.limousine.tripTypes.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tripTypeId: function () {
                            return tripTypeId;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getTripTypes();
                });
            }

            vm.createTripType = function () {
                openCreateOrEdittripTypeModal(null);
            };

            vm.openSettings = function (tripType) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/tripTypes/settingsModal.cshtml',
                    controller: 'tenant.views.crs.limousine.tripTypes.settingsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tripType: function () {
                            return tripType;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getTripTypes();
                });
            };


            vm.editTripType = function (tripType) {
                openCreateOrEdittripTypeModal(tripType.id);
            };

            vm.deleteTripType = function (tripType) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', location.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           
                           tripTypeService.deleteTripType({
                               id: tripType.id
                           }).success(function () {
                               vm.getTripTypes();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            vm.getTripTypes();
        }
    ]);
