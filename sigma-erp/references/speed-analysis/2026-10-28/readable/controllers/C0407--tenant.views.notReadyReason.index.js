// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:102089-102193
appModule.controller('tenant.views.notReadyReason.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.reason',
        function ($scope, $uibModal, uiGridConstants, reasonService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                //create: true,
                //edit: true,
                //'delete': true

                create: abp.auth.hasPermission('Pages.Tenant.Reasons.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.Reasons.Edit'),
            'delete': abp.auth.hasPermission('Pages.Tenant.Reasons.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editReason(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteReason(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Reasons'),
                        field: 'reason'
                    },
                ],
                data: []
            };

            vm.getReasons = function () {
                vm.loading = true;
                reasonService.getReasons({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditReasonModal(locationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/notReadyReason/createOrEditModal.cshtml',
                    controller: 'tenant.views.notReadyReason.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        locationId: function () {
                            return locationId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getReasons();
                });
            }

            vm.createReason = function () {
                openCreateOrEditReasonModal(null);
            };

            vm.editReason = function (location) {
                openCreateOrEditReasonModal(location.id);
            };

            vm.deleteReason = function (location) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            reasonService.deleteReason({
                                id: location.id
                            }).success(function () {
                                vm.getReasons();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getReasons();
        }
    ]);
