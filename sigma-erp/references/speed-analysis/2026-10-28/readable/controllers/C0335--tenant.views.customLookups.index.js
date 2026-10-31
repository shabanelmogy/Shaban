// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:88192-88337
appModule.controller('tenant.views.customLookups.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.customLookup',
        function ($scope, $uibModal, uiGridConstants, customLookupService) {
            var vm = this;
            vm.customFields = null;
            vm.selectedCustomFieldName = -1;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                lookup: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.loading = false;

            vm.permissions = {
                create: true, //abp.auth.hasPermission('Pages.CustomLookups.Create'),
                edit: true, //abp.auth.hasPermission('Pages.CustomLookups.Edit'),
                'delete': true // abp.auth.hasPermission('Pages.CustomLookups.Delete')
            };

            vm.customLookupGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.create" ng-click="grid.appScope.editCustomLookup(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.deleteCustomLookup(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'value'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "value desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getLookupData();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getLookupData();
                    });
                },
                data: []
            };

            vm.getLookupData = function () {
                vm.loading = true;
                vm.filters.lookup = vm.selectedCustomFieldName;
                customLookupService.getLookupData(vm.filters).success(function (data) {
                    vm.customLookupGridOptions.data = data.items;
                    vm.customLookupGridOptions.totalItems = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function loadCustomSelectionFields() {
                vm.loading = true;
                customLookupService.getEnabledCustomSelectionFields().success(function (data) {
                    vm.customFields = data.items;
                    for (var i = 0; i < vm.customFields.length; i++) {
                        vm.customFields[i].fieldDetail = app.localize(vm.customFields[i].fieldName);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function openCreateOrEditCustomLookupModal(customLookupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customLookups/createOrEditModal.cshtml',
                    controller: 'tenant.views.customLookups.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        customLookup: function () {
                            return { id: customLookupId, lookup: vm.selectedCustomFieldName, value: '' };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getLookupData();
                });
            }

            vm.createCustomLookup = function () {
                openCreateOrEditCustomLookupModal(null);
            };

            vm.editCustomLookup = function (customLookup) {
                openCreateOrEditCustomLookupModal(customLookup.id);
            };

            vm.deleteCustomLookup = function (customLookup) {
                abp.message.confirm(
                    app.localize('CustomLookupDeleteWarningMessage', customLookup.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customLookupService.deleteCustomLookup({
                                id: customLookup.id
                            }).success(function () {
                                vm.getLookupData();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.customFieldChanged = function () {
                vm.getLookupData();
                vm.getCreateBtnText = app.localize("CreateNew" + vm.selectedCustomFieldName);
            };

            loadCustomSelectionFields();
        }
    ]);
