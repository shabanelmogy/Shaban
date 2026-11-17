// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443181-443320
appModule.controller('tenant.views.hrm.sponsorship.index', [
        '$scope', '$uibModal', 'uiGridConstants', '$stateParams', 'abp.services.app.sponsorship', 'abp.services.app.user', 'appSession',
        function ($scope, $uibModal, uiGridConstants, $stateParams, sponsorship, userService, appSession) {

            var vm = this;

            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.currentUserId = appSession.user.id;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.type = $stateParams.type;

            vm.filters = {
                searchName: '',
                InActive: '',
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.HRM.Sponsorship.Addnew'),
                edit: abp.auth.hasPermission('Pages.HRM.Sponsorship.Edit'),
                'delete': abp.auth.hasPermission('Pages.HRM.Sponsorship.Delete'),
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
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSponsorships(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSponsorships(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes'
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

                        vm.getSponsorships();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSponsorships();
                    });
                },
                data: []
            };

            vm.getSponsorships = function () {
                vm.loading = true;
                sponsorship.getSponsorships(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditSponsorshipsModal(sponsorshipsEdit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/sponsorship/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.sponsorship.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        sponsorshipsEdit: function () {
                            return sponsorshipsEdit;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSponsorships();
                });
            }

            vm.createSponsorships = function () {
                openCreateOrEditSponsorshipsModal(null);
            };

            vm.editSponsorships = function (sponsorshipsEdit) {
                openCreateOrEditSponsorshipsModal(sponsorshipsEdit);
            };

            vm.deleteSponsorships = function (obj) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            sponsorship.deleteSponsorships({
                                id: obj.id
                            }).success(function () {
                                vm.getSponsorships();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            }).error(function (data) {
                                if (data) {
                                    setTimeout(() => abp.message.info(data.message), 300);
                                }

                            });
                        }
                    }
                );
            };
            vm.getSponsorships();
        }
    ]);
