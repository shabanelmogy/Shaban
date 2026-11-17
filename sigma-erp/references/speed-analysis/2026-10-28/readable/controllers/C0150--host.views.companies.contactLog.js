// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:60598-60711
appModule.controller('host.views.companies.contactLog', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.tenant', 'contactId', 'abp.services.app.contactLog', 'uiGridConstants',
        function ($scope, $uibModal, $uibModalInstance, tenantService, contactId, contactLogService, uiGridConstants) {
            var vm = this;
            vm.saving = false;
            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                contactId: contactId
            };

            vm.getContactLogs = function () {
                vm.loading = true;
                contactLogService.getContactLogs(vm.filters).success(function (data) {
                    //vm.gridOptions.totalItems = data.totalCount;
                    //vm.gridOptions.data = data.items;
                    vm.contactLogs = data.items;
                        vm.loading = false;
                });
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };
            //vm.gridOptions = {
            //    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            //    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            //    paginationPageSizes: app.consts.grid.defaultPageSizes,
            //    paginationPageSize: app.consts.grid.defaultPageSize,
            //    useExternalPagination: true,
            //    appScopeProvider: vm,
            //    // rowHeight: 80,
            //    columnDefs: [
            //        {
            //            name: app.localize('DateAndTime'),
            //            field: 'creationTime',
            //            width: '20%',
            //            //cellClass: 'ui-grid-cell-contents',
            //            cellTemplate:
            //           '<div class=\"ui-grid-cell\">' +
            //           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}</div>' +
            //           '</div>'
            //        },
            //        {
            //            name: app.localize('User'),
            //            width: '25%',
            //            //cellClass: 'ui-grid-cell-contents',
            //            field: 'creatorUser.userName'
            //        },
            //        {
            //            name: app.localize('Detail'),
            //            width: '55%',
                        
            //            //cellClass: 'ui-grid-cell-contents',
            //            field: 'notes',
            //            cellTemplate: '<div  style="text-align:left;margin-left:5px;word-wrap:break-word">{{row.entity.notes}}</div>',
            //        },

            //    ],
            //    onRegisterApi: function (gridApi) {
            //        $scope.gridApi = gridApi;
            //        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            //            if (!sortColumns.length || !sortColumns[0].field) {
            //                vm.filters.sorting = null;
            //            } else {
            //                vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
            //            }

            //            vm.getContactLogs();
            //        });
            //        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
            //            vm.filters.skipCount = (pageNumber - 1) * pageSize;
            //            vm.filters.maxResultCount = pageSize;

            //            vm.getContactLogs();
            //        });
            //    },
            //    data: []
            //};
            function openCreateOrEditContactLogModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/companies/createOrEditContactLogModal.cshtml',
                    controller: 'host.views.companies.createOrEditContactLogModal as vm',
                    backdrop: 'static',
                    resolve: {
                        contactId: function () {
                            return contactId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getContactLogs();
                });
            }
            vm.addContactLog = function () {
                openCreateOrEditContactLogModal(null);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                debugger
                vm.getContactLogs();

            }
            init();
        }
    ]);
