// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:201669-201747
appModule.controller('tenant.views.crs.deliveries.searchDeliveryAgreementModal', ['$scope', '$uibModalInstance',
         'uiGridConstants', 'options',  'abp.services.app.delivery',
        function ($scope, $uibModalInstance,
            uiGridConstants, options, deliveryService) {

            var vm = this;
            vm.filters = options;
            vm.filters.skipCount = 0;
            vm.filters.maxResultCount = app.consts.grid.defaultPageSize;
          
            vm.searchAgreements = function () {
                vm.loading = true;
                deliveryService.searchDeliveryAgreements(vm.filters).success(
                    function (result) {
                        vm.gridOptions.totalItems = result.totalCount;
                        vm.gridOptions.data = result.items;
                       
                    }).finally(function () {
                        vm.loading = false;
                    });;
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
                        name: app.localize('Select'),
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" aria-haspopup="true"  ng-click="grid.appScope.agreementSelected(row.entity)" ><i class="fa fa-check"></i> ' + app.localize('Select') + ' </button>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'agreementNo',
                       
                    },

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "id desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.searchAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.searchAgreements();
                    });
                },
                data: []
            };

          

            vm.agreementSelected = function (agreement) {
                $uibModalInstance.close(agreement);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchAgreements();
        }]);
