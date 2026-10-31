// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80174-80454
appModule.controller('host.views.reports.subscriptionReceipts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.subscriptionInvoices', 'abp.services.app.tenant', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, uiGridConstants, subscriptionInvoicesService, tenantAppService, utilities, businessDivisionService) {
            var vm = this;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.voucherStatus = [
                { id: 1, name: "Not Allocated" },
                { id: 2, name: "Partially Allocated" },
                { id: 3, name: "Allocated" }
            ];


            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };


            vm.permissions = {

                addReceipt: abp.auth.hasPermission('Page.Billing.Receipts.AddReceipt'),
                allocationsReceipt: abp.auth.hasPermission('Page.Billing.Receipts.AllocationsReceipt'),
                viewAllocations: abp.auth.hasPermission('Page.Billing.Receipts.ViewReceipt'),
                print: abp.auth.hasPermission('Page.Billing.Receipts.Print'),
            };

            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null,

            };
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {

                    return date.replace('Z', '');

                }
                else {
                    return "";
                }
            };

            vm.getStatusName = function (id) {
                if (id == 1) {
                    return "Not Allocated";
                }
                else if (id == 2) {
                    return "Partially Allocated";
                }
                else if (id == 3) {
                    return "Allocated";
                }
            }

            vm.printReceipt = function (receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/subscriptionReceipts/printModal.cshtml',
                    controller: 'host.views.reports.subscriptionReceipts.printModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return receipt.id;
                        }
                    }
                });

            };

            vm.addReceipt = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/subscriptionReceipts/createReceiptModal.cshtml',
                    controller: 'host.views.reports.subscriptionReceipts.createReceiptModal as vm',
                    backdrop: 'static',
                    size: 'lg',

                });
                modalInstance.result.then(function (result) {
                    vm.getReceipts();
                });
            };

            vm.getReceiptTotalAmountSummary = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                subscriptionInvoicesService.getReceiptTotalAmountSummary(vm.filters).then(function (data) {
                    vm.groupAmount = data.data;
                });
            }

            vm.viewAllocations = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/subscriptionReceipts/viewReceiptAllocationsModal.cshtml',
                    controller: 'host.views.reports.subscriptionReceipts.viewReceiptAllocationsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return id;
                        },
                        fromReceipt: function () {
                            return true;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getReceipts();
                });
            };

            vm.allocationInvoices = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/subscriptionReceipts/allocationModal.cshtml',
                    controller: 'host.views.reports.subscriptionReceipts.allocationModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return id;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getReceipts();
                });

            };

            vm.getReceipts = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                subscriptionInvoicesService.getReceipts(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 60,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.viewAllocations && row.entity.receiptAllocationStatus !== 1" ng-click="grid.appScope.viewAllocations(row.entity.id)">' + app.localize('ViewAllocations') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.allocationsReceipt && row.entity.receiptAllocationStatus !== 3" ng-click="grid.appScope.allocationInvoices(row.entity.id)">' + app.localize('Allocations') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printReceipt(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Receipt No',
                        field: 'voucherNo',

                    },
                    {
                        name: 'Date',
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getlocalDateTime(row.entity.date) | date:"dd-MMM-yy"}}</span>' +
                            '</div>',

                    },
                    {
                        name: 'Tenant',
                        field: 'tenant.tenancyName',
                    },
                    {
                        name: 'Payment Method Detail',
                        field: 'paymentMethodDetail',
                    },
                    {
                        name: 'Amount',
                        field: 'totalAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{row.entity.currency.code}} {{row.entity.totalAmount.toFixed(2)}}</span>' +
                            '</div>',
                    },
                    {
                        name: app.localize('Status'),
                        field: 'receiptAllocationStatus',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getStatusName(row.entity.receiptAllocationStatus)}}</span>' +
                            '</div>',
                    }

                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getReceipts();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getReceipts();
                    });
                },


                data: []
            };

            function init() {
                initDate();
                vm.getReceipts();
                vm.getReceiptTotalAmountSummary();
            }
            init();
        }
    ]);
