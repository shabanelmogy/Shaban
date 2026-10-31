// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:62009-62200
appModule.controller('host.views.companies.viewChangeRequest', [
        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.carRental', 'lookupOptions', 'pageName',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, carRentalService, lookupOptions, pageName) {
            var vm = this;
            vm.filters = {
                fromDate: new Date(1, 0, 1, 0, 0, 0, 0),
                toDate: new Date(),
                IsApproved: 0,
                titleInput: ""
            };
            vm.IsApprovedOptions = [
                { name: "False", id: 0 },
                { name: "True", id: 1 }
            ];

            vm.loading = false;
            vm.dateRangeModel = {
                startDate: new Date(1, 0, 1, 0, 0, 0, 0),
                endDate: moment().add(1, 'days').format(abp.setting.get("App.General.DateFormat"))
            };
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.min = moment().add(-3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.options = angular.extend({
                serviceMethod: null,
                title: app.localize('SelectAnItem'),
                loadOnStartup: true,
                showFilter: true,
                filterText: 'SpeedSupport',
                titleInput: '',
                skipCount: 0,
                pageSize: app.consts.grid.defaultPageSize,
                callback: function (selectedItem) {
                },
                canSelect: function (item) {
                    return true;
                }
            }, lookupOptions);
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
                        name: app.localize('Title'),
                        field: 'title'
                    },
                    {
                        name: app.localize('RequestBy'),
                        field: 'requestBy'
                    },
                    {
                        name: app.localize('RequestTime'),
                        field: 'requestTime'
                    },
                    {
                        name: app.localize('IsApproved'),
                        field: 'isApproved'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.options.skipCount = (pageNumber - 1) * pageSize;
                        vm.options.pageSize = pageSize;
                        vm.getChangeLog();
                    });
                },
                data: []
            };
            function openRequestEditCompanyModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/openAcceptOrCloseRequestModal.cshtml',
                    controller: 'host.views.companies.openAcceptOrCloseRequestModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        },
                        isChangeRequest: function () {
                            return false;
                        },
                        pageName: function () {
                            return pageName;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    $uibModalInstance.close();
                });
            }
            vm.selectItem = function (item) {
                openRequestEditCompanyModal(item._id)
                var boolOrPromise = vm.options.canSelect(item);
            };
            vm.checkSpeedUser = function (item) {
                //return item.name.includes("speedsupport");
            };
            vm.formatDate = function (date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
            vm.searchChangeLog = function () {
                if (vm.filters == null) {
                    vm.filters = { IsApproved: false };
                }
                if (!vm.disableDate) {
                    vm.filters.fromDate = new Date(1, 0, 1, 0, 0, 0, 0); // Reset fromDate
                    vm.filters.toDate = new Date(); // Reset toDate
                }
                if (vm.dateRangeModel) {
                    var fromDate = moment(vm.dateRangeModel.startDate).format('YYYY-MM-DD HH:mm:ss');
                    var toDate = moment(vm.dateRangeModel.endDate).format('YYYY-MM-DD HH:mm:ss');

                } else {
                    var fromDate = formatDate(vm.filters.fromDate);
                    var toDate = formatDate(vm.filters.toDate);
                }
                carRentalService.getChangeLogFromCarRentalPaginated({ PageNameEnum: pageName, Title: vm.filters.titleInput, fromDate: fromDate, toDate: toDate, IsApproved: vm.filters.IsApproved, pageNumber: vm.options.skipCount, pageSize: vm.options.pageSize }).success(function (data) {
                    if (data.isSuccess == false) {
                        vm.gridOptions.data = []
                        abp.notify.info(app.localize('No Data Found'));
                    }
                    else {
                        vm.gridOptions.data = []
                        vm.gridOptions.data = data.data
                        abp.notify.info(app.localize('DataDelivedSucessfully'));
                    }
                }).finally(function () {
                    vm.saving = false;
                });
            }
            vm.getChangeLog = function () {
                vm.loading = true;
                if (vm.filters == null) {
                    vm.filters = { IsApproved: false };
                }
                if (!vm.disableDate) {
                    vm.filters.fromDate = new Date(1, 0, 1, 0, 0, 0, 0);
                    vm.filters.toDate = new Date();
                }
                var fromDate = formatDate(vm.filters.fromDate);
                var toDate = formatDate(vm.filters.toDate);
                carRentalService.getChangeLogFromCarRentalPaginated({ PageNameEnum: pageName, Title: vm.filters.titleInput, fromDate: fromDate, toDate: toDate, IsApproved: vm.filters.IsApproved, pageNumber: vm.options.skipCount, pageSize: vm.options.pageSize })
                    .success(function (data) {
                        vm.loading = false;
                        vm.gridOptions.data = data.data
                        vm.gridOptions.totalItems = data.totalCount;
                        abp.notify.info(app.localize('DataDelivedSucessfully'));
                    }).finally(function () {
                        vm.saving = false;
                    });
            }
            function formatDate(date) {
                return date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2) + ' ' +
                    ('0' + date.getHours()).slice(-2) + ':' +
                    ('0' + date.getMinutes()).slice(-2) + ':' +
                    ('0' + date.getSeconds()).slice(-2);
            }
            function init() {
                vm.getChangeLog();
            }
            init();
        }
    ]);
