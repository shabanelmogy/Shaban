// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236078-236207
appModule.controller('tenant.views.crs.lease.costingParameters.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.costParameter',
        function ($scope, $uibModal, uiGridConstants, costParameterService) {
            var vm = this;
            vm.filter = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };
            //var no = null;
            //var name = null;


            //vm.costingParameterArray = [
            //    { id: 1, name: 'Depreciation Cost' },
            //    { id: 2, name: 'Insurance Cost' },
            //    { id: 3, name: 'Parts Cost' },
            //    { id: 4, name: 'Labour Cost' },
            //    { id: 5, name: 'Financial Charges' },
            //    { id: 6, name: 'Replacement Cost' },
            //    { id: 7, name: 'Overhead Cost' },
            //];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.costingParameterss.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.costingParameterss.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.costingParameterss.Delete')
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
                            '      <li><a  ng-click="grid.appScope.editcostingParameter(row.entity)">' + app.localize('Edit') + '</a></li>' +
                           // '      <li><a  ng-click="grid.appScope.createcostingParameter(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deletecostingParameter(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('CostingParameterName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Order'),
                        field: 'order'
                    }
                ],
                data: []
            };

            //vm.getcostingParameters = function () {
            //    vm.gridOptions.data = vm.costingParameterArray;
            //};

            vm.getcostingParameters = function () {
                vm.loading = true;
                costParameterService.getcostingParameters({}).success(function (data) {
                  // vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditcostingParameterModal(costingParameter) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/costingParameters/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.costingParameters.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        costingParameter: function () {
                            return costingParameter;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getcostingParameters();
                });
            }


            vm.createcostingParameter = function () {
                openCreateOrEditcostingParameterModal(null);
            };

            vm.editcostingParameter = function (costingParameter) {
                openCreateOrEditcostingParameterModal(costingParameter);
            };

            vm.deletecostingParameter = function (costingParameter) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', location.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           costParameterService.deleteCostingParameter({
                               id: costingParameter.id
                           }).
                           success(function () {
                               vm.getcostingParameters();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            vm.getcostingParameters();
        }
    ]);
