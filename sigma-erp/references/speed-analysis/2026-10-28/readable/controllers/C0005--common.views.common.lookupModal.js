// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:24953-25080
appModule.controller('common.views.common.lookupModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'lookupOptions',
        function ($scope, $uibModalInstance, uiGridConstants, lookupOptions) {
            var vm = this;

            vm.loading = false;

            //Options
            vm.options = angular.extend({
                serviceMethod: null, //Required
                title: app.localize('SelectAnItem'),
                loadOnStartup: true,
                showFilter: true,
                filterText: 'SpeedSupport',
                skipCount: 0,
                pageSize: app.consts.grid.defaultPageSize,
                callback: function (selectedItem) {
                    //This method is used to get selected item
                },
                canSelect: function (item) {
                    /* This method can return boolean or a promise which returns boolean.
                     * A false value is used to prevent selection.
                     */
                    return true;
                }
            }, lookupOptions);

            //Check required parameters
            if (!vm.options.serviceMethod) {
                $uibModalInstance.dismiss();
                return;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: vm.options.pageSize,
                useExternalPagination: true,
                enableSorting: false,
                appScopeProvider: vm,
                rowTemplate: '<div class="ui-grid-cell" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" ng-class="{ \'text-highlited\': grid.appScope.checkSpeedUser(row.entity) }"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Select'),
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <button class="btn btn-default btn-xs" ng-click="grid.appScope.selectItem(row.entity)"><i class="fa fa-check"></i> ' + app.localize('Select') + '</button>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.options.skipCount = (pageNumber - 1) * pageSize;
                        vm.options.pageSize = pageSize;

                        vm.refreshGrid();
                    });
                },
                data: []
            };

            vm.selectItem = function (item) {
                var boolOrPromise = vm.options.canSelect(item);
                if (!boolOrPromise) {
                    return;
                }

                if (boolOrPromise === true) {
                    vm.options.callback(item);
                    $uibModalInstance.close(item);
                    return;
                }

                //assume as promise
                boolOrPromise.then(function(result) {
                    if (result) {
                        vm.options.callback(item);
                        $uibModalInstance.close(item);
                    }
                });
            };

            vm.checkSpeedUser = function (item) {
                return item.name.toLowerCase().includes("speedsupport");
            };

            vm.refreshGrid = function () {
                var prms = angular.extend({
                    skipCount: vm.options.skipCount,
                    maxResultCount: vm.options.pageSize,
                    filter: vm.options.filterText
                }, lookupOptions.extraFilters);

                vm.loading = true;
                vm.options.serviceMethod(prms).success(function (result) {

                    if (result.items) {
                        var obj = result.items.filter(e => e.name.toLowerCase().includes("speedsupport"))[0];
                        if (obj) {
                            var index = result.items.indexOf(obj);
                            result.items.splice(index, 1);
                            result.items.splice(0, 0, obj);
                        }
                    }

                    vm.gridOptions.totalItems = result.totalCount;
                    vm.gridOptions.data = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            if (vm.options.loadOnStartup) {
                vm.refreshGrid();
            }
        }
    ]);
