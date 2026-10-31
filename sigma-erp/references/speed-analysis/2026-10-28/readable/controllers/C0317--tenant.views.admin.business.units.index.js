// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86269-86430
appModule.controller('tenant.views.admin.business.units.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tariffGroup', 'abp.services.app.commonLookup', 'utilities', '$stateParams', 'abp.services.app.businessUnit', 'abp.services.app.user', 'appSession',
        function ($scope, $uibModal, uiGridConstants, tariffGroupService, commonLookupService, utilities, $stateParams, businessUnit, userService, appSession) {

            var vm = this;

            vm.enableUserWiseDiscount = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isMccEnabled = abp.features.isEnabled("MCC");
            vm.isVmiWorkshopEnabled = abp.features.isEnabled("VMIWorkshop");
            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.currentUserId = appSession.user.id;



            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.type = $stateParams.type;

            vm.filters = {
                SerachNameOrCode: '',
                InActive: '',
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.BusinessUnits.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.BusinessUnits.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.BusinessUnits.Delete'),
                hrmCreate: abp.auth.hasPermission('Pages.Tenant.HrmBusinessUnits.Addnew'),
                hrmEdit: abp.auth.hasPermission('Pages.Tenant.HrmBusinessUnits.Edit'),
                'hrmDelete': abp.auth.hasPermission('Pages.Tenant.HrmBusinessUnits.Delete'),

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
                            '      <li><a ng-if="grid.appScope.permissions.edit || grid.appScope.permissions.hrmEdit" ng-click="grid.appScope.editBusinessUnits(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete || grid.appScope.permissions.hrmDelete" ng-click="grid.appScope.deleteBusinessUnits(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Code'),
                        field: 'code'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
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

                        vm.getBusinessUnits();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getBusinessUnits();
                    });
                },
                data: []
            };


            vm.getBusinessUnits = function () {
                vm.loading = true;
                businessUnit.getBusinessUnits(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };



            function openCreateOrEditBusinessUnitsModal(businessUnitsEdit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/businessUnits/createOrEditModal.cshtml',
                    controller: 'tenant.views.admin.business.units.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        businessUnitsEdit: function () {
                            return businessUnitsEdit;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getBusinessUnits();
                });
            }



            vm.createBusinessUnits = function () {
                openCreateOrEditBusinessUnitsModal(null);
                //vm.getBusinessUnits();
            };

            vm.editBusinessUnits = function (businessUnitsEdit) {
                openCreateOrEditBusinessUnitsModal(businessUnitsEdit);
            };

            vm.deleteBusinessUnits = function (tariffGroup) {

                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            businessUnit.deleteBusinessUnits({
                                id: tariffGroup.id
                            }).success(function () {
                                vm.getBusinessUnits();
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



            vm.getBusinessUnits();
        }
    ]);
