// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50931-51515
appModule.controller('host.views.cbs.subscriptionInvoices.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.subscriptionInvoices', 'abp.services.app.tenant', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, uiGridConstants, subscriptionInvoicesAppService, tenantAppService, utilities, businessDivisionService) {
            var vm = this;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //vm.businessName = [
            //    { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 0 },
            //    { id: 3, name: "D1 (UAE)", currency: "AED", tax: 0 },
            //    { id: 4, name: "D2 (UK)", currency: "GBP", tax: 0 },
            //    { id: 2, name: "D3 (USA)", currency: "USD", tax: 0 }
            //];
            vm.businessName = utilities.divisionName();
            vm.voucherStatus = [
                { id: 1, name: "Open" },
                { id: 2, name: "Closed" },
                { id: 5, name: "Voided"}
            ];

            vm.invoiceTypes = [
                { id: 1, name: "Subscription" },
                { id: 2, name: "Change Request" },
                { id: 3, name: "Project" }
            ];
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                subscriptionInvoicesAppService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

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
                subscriptionCreate: abp.auth.hasPermission('Page.Billing.Invoices.SubscriptionCreate'),
                changeRequestsCreate: abp.auth.hasPermission('Page.Billing.Invoices.ChangeRequestsCreate'),
                projectsCreate: abp.auth.hasPermission('Page.Billing.Invoices.ProjectsCreate'),
                delete: abp.auth.hasPermission('Page.Billing.Invoices.Delete'),
                print: abp.auth.hasPermission('Page.Billing.Invoices.Print'),
                //addReceipt: abp.auth.hasPermission('Page.Billing.Receipts.AddReceipt'),
                chargeCard: abp.auth.hasPermission('Page.Billing.Invoices.ChargeCard'),
                void: abp.auth.hasPermission('Page.Billing.Invoices.Void')
            };

            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: "transactionNo asc"
            };
            
            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null,
                isFeatured: false,
                dateType:1
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
            vm.getPayStatus= function (value) {
                if (value) {
                    return "YES";
                }
                else {
                    return "NO";
                }
            };

            vm.getBusinessName = function (id) {
                return utilities.getDivisionName(id);
            }

            vm.getStatusName = function (id) {
                if (id == 1) {
                    return "Open";
                }
                else if (id == 2) {
                    return "Closed";
                }
                else if (id == 5) {
                    return "Voided";
                }
            }

            vm.print = function (subscription) {

                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/subscriptionInvoices/SubscriptionInvoicePrintTemplate.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.SubscriptionInvoicePrintTemplate as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return subscription.id;
                        }
                    }
                });
            };

            vm.viewSubscriptionInvoice = function (subscriptionInvoice) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/cbs/subscriptionInvoices/viewModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.SubscriptionInvoicePrintTemplate as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return subscriptionInvoice.id;
                        }
                    }
                });
                
            };

           /*vm.addReceipt = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/subscriptionInvoices/createReceiptModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.createReceiptModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        invoiceId: function () {
                            return id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getSubscriptionInvoices();
                });
            };*/

            vm.viewReceipt = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/subscriptionInvoices/viewReceiptModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.viewReceiptModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        invoiceId: function () {
                            return id;
                        }
                    }
                });
                
            };

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
                            return false;
                        }
                    }
                });
            };

            vm.voidInvoice = function (invoice) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', invoice.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            subscriptionInvoicesAppService.voidInvoice({
                                id: invoice.id
                            }).success(function () {
                                vm.getSubscriptionInvoices();
                                abp.notify.success(app.localize('SuccessfullyVoided'));
                            }).error(function (data) {
                                if (data) {
                                    setTimeout(() => abp.message.info(data.message), 300);
                                }

                            }).finally(function () { vm.loading = false; });
                        }
                    }
                );
            };

            vm.tenantGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                enableColumnResizing: true,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize(' '),
                        enableSorting: false,
                        enableColumnResizing: false,
                        width:65,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewSubscriptionInvoice(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print && row.entity.status != 5" ng-click="grid.appScope.print(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status != 5" ng-click="grid.appScope.viewAllocations(row.entity.id)">' + app.localize('ViewAllocations') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editsubscriptionInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.addReceipt && row.entity.status!=2" ng-click="grid.appScope.addReceipt(row.entity.id)">' + app.localize('AddReceipt') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.allocatedAmount <= 0 && row.entity.status == 1" ng-click="grid.appScope.voidInvoice(row.entity)">' + app.localize('Void') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.DeleteSubscriptionInvoice(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.chargeCard && row.entity.status!=2 && row.entity.status != 5 && row.entity.tenant.hasCard"  ng-click="grid.appScope.openSilentPaymentModal(row.entity)">' + app.localize('ChargeCard') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('InvoiceNo'),
                        field: 'voucherNo'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getlocalDateTime(row.entity.date) | date:"dd-MMM-yy"}}</span>' +
                            '</div>'
                    },
                    
                    {
                        name: app.localize('Period'),
                        field: 'fromDate',
                        width:200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-if="row.entity.fromDate">{{grid.appScope.getlocalDateTime(row.entity.fromDate) | date:"dd-MMM-yy"}}  -  {{grid.appScope.getlocalDateTime(row.entity.toDate) | date:"dd-MMM-yy"}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Division'),
                        field: 'division',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{row.entity.businessDivision?row.entity.businessDivision.code:""}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Tenant'),
                        field: 'tenant.tenancyName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-if="row.entity.tenant.hasCard" class="label label-warning">CC</span>' +
                            '  <span>{{row.entity.tenant.tenancyName}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description',
                    },
                    {
                        name: app.localize("Amount"),
                        field: 'totalAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{row.entity.currency.code}} {{row.entity.totalAmount.toFixed(2)}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Due Amount'),
                        field: 'dueAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{row.entity.currency.code}} {{row.entity.dueAmount.toFixed(2)}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getStatusName(row.entity.status)}}</span>' +
                            '</div>'
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
                        vm.getSubscriptionInvoices();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getSubscriptionInvoices();
                    });
                },
                data: []
            };
            vm.searchButtonCLick = function () {
                requestParams.skipCount = 0;
                requestParams.maxResultCount = 10;
                vm.tenantGridOptions.paginationCurrentPage = 1;
                vm.tenantGridOptions.paginationPageSize = 10;
                vm.getSubscriptionInvoices();
                //vm.searchItems();
            }
            vm.searchItems = function () {
                vm.loading = true;
                if (vm.filters == null) {
                    vm.filters = { isFeatured: false };
                }
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "transactionNo asc"
                }
                subscriptionInvoicesAppService.getSubscriptionInvoices({
                    tenantName: vm.filters.tenantName, skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting
                })
                    .then(function (data) {
                        if (data.data != null) {
                            vm.tenantGridOptions.totalItems = data.data.totalCount;
                            let datas = data.data.items;
                            let subscriptionInvoices = data.data.items;
                            let modifiedData = [];
                            for (let i = 0; i < datas.length; i++) {
                                let item = datas[i];
                                for (let j = 0; j < vm.enumLimitType.length; j++) {
                                    if (vm.enumLimitType[j].id === item.limitType) {
                                        item.limitType = vm.enumLimitType[j].name;
                                        break;
                                    }
                                }
                                modifiedData.push(datas[i]);
                            }
                            vm.tenantGridOptions.data = modifiedData;
                        }
                        else {
                            vm.tenantGridOptions.data = [];
                        }

                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getSubscriptionInvoices = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "transactionNo asc"
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.tenantGridOptions.data = [];
                subscriptionInvoicesAppService.getSubscriptionInvoices(vm.filters).then(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.tenantGridOptions.totalItems = data.data.totalCount;
                    let datas = data.data.items;
                    vm.tenantGridOptions.data = data.data.items;
                    vm.getAmountSummary();
                    //var groupedData = data.data.items.reduce(function (acc, invoice) {
                    //    if (invoice.currency != null) {

                    //        var currencyCode = invoice.currency.code;
                    //        if (!acc[currencyCode]) {
                    //            acc[currencyCode] = { currencyCode: currencyCode, totalAmount: 0 };
                    //        }
                    //        acc[currencyCode].totalAmount += invoice.amount;
                    //        return acc;
                    //    }
                    //    return acc;
                    //}, {});

                    //vm.groupAmount = Object.values(groupedData);

                    //let modifiedData = [];
                    //for (let i = 0; i < datas.length; i++) {
                    //    modifiedData.push(datas[i]);
                    //}
                    //vm.tenantGridOptions.data = modifiedData;
                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };

            vm.openSilentPaymentModal = (invoice) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/subscriptionInvoices/silentPaymentModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.silentPaymentModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        invoice: () => {
                            return invoice
                        }
                    }
                });
                modalInstance.result.then(result => {
                    init();
                });
            }

            vm.getAmountSummary = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                subscriptionInvoicesAppService.getAmountSummary(vm.filters).then(function (data) {
                    vm.groupAmount = data.data;
                });
            }

            vm.addSubscriptionInvoice = function (subscriptionInvoice) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/cbs/subscriptionInvoices/createOrEditModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        subscriptionInvoiceId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getSubscriptionInvoices();
                });
            };
            vm.editsubscriptionInvoice = function (subscriptionInvoice) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/cbs/subscriptionInvoices/createOrEditModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        subscriptionInvoiceId: function () {
                            return subscriptionInvoice.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getSubscriptionInvoices();
                });
            };
            vm.DeleteSubscriptionInvoice = function (subscriptionInvoice) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            subscriptionInvoicesAppService.deleteSubscriptionInvoices(subscriptionInvoice.id)
                                .then(function (data) {
                                    console.log("SubscriptionInvoices Deleted !!")
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getSubscriptionInvoices();
                                });
                        }
                    }
                );
            };

            vm.generateInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/cbs/subscriptionInvoices/generateModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.generateModal as vm',
                    backdrop: 'static',
                    size: 'full'
                   
                });
                modalInstance.result.then(function (result) {
                    vm.getSubscriptionInvoices();
                });
            };

            vm.changeRequestGenerateInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/cbs/subscriptionInvoices/changeRequestMilestonesModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.changeRequestMilestonesModal as vm',
                    backdrop: 'static',
                    size: 'full'
                   
                });
                modalInstance.result.then(function (result) {
                    vm.getSubscriptionInvoices();
                });
            };

            vm.projectGenerateInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/cbs/subscriptionInvoices/projectMilestonesModal.cshtml',
                    controller: 'host.views.cbs.subscriptionInvoices.projectMilestonesModal as vm',
                    backdrop: 'static',
                    size: 'full'
                   
                });
                modalInstance.result.then(function (result) {
                    vm.getSubscriptionInvoices();
                });
            };

            function init() {
                vm.getbusinessDivisions();
                initDate();
                vm.getSubscriptionInvoices();
            }
            init();
        }
    ]);
