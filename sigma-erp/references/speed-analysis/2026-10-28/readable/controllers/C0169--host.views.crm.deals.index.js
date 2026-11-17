// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:63717-64163
appModule.controller('host.views.crm.deals.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.user', 'abp.services.app.deal', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, userService, dealService, commonLookupService, directoryService) {

            var vm = this;

            vm.allowDateRange = true;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.statuses = [
                { id: 1, name: 'Open' },
                { id: 2, name: 'Closed' },
                { id: 3, name: 'In-Active' },
                { id: 4, name: 'Cancelled' }
            ];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                status: null,
                editionId: null,
                companyId: null,
                probability: null,
                salesPersonUserId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                dealDateFilter: 1
            };

            vm.getSubscriptionType = function (type) {
                if (!type)
                    return '';

                else if (type == 1)
                    return 'Year';

                else if (type == 2)
                    return 'Month';
            };

            vm.getDealStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
                if (status == 3)
                    return 'In-Active';
                if (status == 4)
                    return 'Cancelled';
            };
            vm.getDealStages = function (stages) {
                if (stages === 1)
                    return 'New';
                else if (stages === 2)
                    return 'Average';
                else if (stages === 3)
                    return 'Hot';
                else if (stages === 4)
                    return 'Final';
                else
                    return '';
            };
            vm.dealStages = [
                { id: 1, name: 'New' },
                { id: 2, name: 'Average' },
                { id: 3, name: 'Hot' },
                { id: 4, name: 'Final' }
            ];
            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };
            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };
            vm.searchUsers = function ($select) {
                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();

                    return moment(localTime).format(vm.dateTimeFormat);

                }
                else {
                    return "";
                }
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CRM.Deals'),
                create: abp.auth.hasPermission('Pages.CRM.Deals.AddNew'),
                edit: abp.auth.hasPermission('Pages.CRM.Deals.Edit'),
                'delete': abp.auth.hasPermission('Pages.CRM.Deals.Delete'),
                reopenClosedDeal: abp.auth.hasPermission('Pages.CRM.ReopenClosedDeal')
            };

            vm.showEditAction = function (row) {
                return (vm.permissions.reopenClosedDeal && row.status === 2) ||
                    (row.status !== 2 && (vm.permissions.edit || vm.permissions.create));
            };

            vm.totalValue = function (value, setup) {
                return value + setup;
            }

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
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false">' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewDeal(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.dealLog(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.showEditAction(row.entity)" ng-click="grid.appScope.editDeal(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteDeal(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="row.entity.linkedTenantId > 0" ng-click="grid.appScope.viewTenantActivity(row.entity)">' + app.localize('TenantActivity') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Title',
                        field: 'title'
                    },
                    {
                        name: 'Company',
                        field: 'company.companyName',
                        width: 150
                    },
                    {
                        name: 'CreationDate',
                        field: 'creationTime',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.creationTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Edition',
                        field: 'edition.displayName'
                    },
                    {
                        name: 'Tenant',
                        field: 'linkedTenant.name'
                    },
                    {
                        name: 'Setup Value',
                        field: 'setupValue'
                    },
                    {
                        name: 'Subscription',
                        field: 'value',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.value + " / " + grid.appScope.getSubscriptionType(row.entity.subscriptionType)}}</div>' +
                            '</div>'

                    },
                    {
                        name: 'Total Value',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.totalValue(row.entity.value, row.entity.setupValue)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Sale Person',
                        field: 'salesPersonUser.name'
                    },
                    {
                        name: 'Status',
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDealStatus(row.entity.status)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Stage',
                        field: 'stage',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDealStages(row.entity.stage)}}</div>' +
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

                        vm.getDeals();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getDeals();
                    });
                },
                data: []
            };
            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };

            vm.clearSalesPersonUser = function () {
                vm.filters.salesPersonUserId = null;
                vm.filters.salesPersonUser = null;
            };
            vm.getDeals = function () {
                vm.loading = true;
                vm.filters.salesPersonUserIds = [];
                if (vm.filters.salesPersonUser != null && vm.filters.salesPersonUser.length > 0) {
                    angular.forEach(vm.filters.salesPersonUser, function (value) {
                        vm.filters.salesPersonUserIds.push(value.id);
                    });
                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                dealService.getDeals(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //    //if null then get as following
            //    //fromDate: get local date with time 00:00:00 and then convert to utc
            //    //toDate: get local date of max time of night and then convert to utc
            //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //    if (vm.filters.user != null)
            //        vm.filters.CreatedBy = vm.filters.user.id;
            //    if (vm.filters.nationality != null)
            //        vm.filters.country = vm.filters.nationality.name;
            //    if (!vm.disableDate) {
            //        vm.filters.fromDate = null;
            //        vm.filters.toDate = null;
            //    }

            //    companyService.exportToExcel(vm.filters).success(function (result) {
            //        app.downloadTempFile(result);
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            function openCreateOrEditDealModal(dealId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/deals/createOrEditDealModal.cshtml',
                    controller: 'host.views.crm.deals.createOrEditDealModal as vm',
                    backdrop: 'static',
                    resolve: {
                        dealId: function () {
                            return dealId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDeals();
                });
            }

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/host/views/crm/deals/dealReportModal.cshtml';
                        },
                        filters: function () {
                            if (vm.allowDateRange) {
                                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                            }
                            else {
                                vm.filters.fromDate = null;
                                vm.filters.toDate = moment().endOf('Day');
                            }
                            return vm.filters;
                        }
                    }
                });
            };

            function openViewDealModal(dealId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/deals/viewModal.cshtml',
                    controller: 'host.views.crm.deals.createOrEditDealModal as vm',
                    backdrop: 'static',
                    resolve: {
                        dealId: function () {
                            return dealId;
                        }

                    }
                });

            }
            vm.createDeal = function () {
                openCreateOrEditDealModal(null);
            };
            vm.dealLog = function (deal) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/deals/dealLog.cshtml',
                    controller: 'host.views.crm.deals.dealLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deal: function () {
                            return deal;
                        }

                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeals();
                });
            }
            vm.editDeal = function (deal) {
                openCreateOrEditDealModal(deal.id);
            };
            vm.viewDeal = function (deal) {
                openViewDealModal(deal.id);
            };

            vm.deleteDeal = function (deal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {

                        if (isConfirmed) {
                            dealService.deleteDeal({
                                id: deal.id
                            }).success(function () {
                                vm.getDeals();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.viewTenantActivity = function (deal) {
                openTenantActivityModal(deal);
            };

            function openTenantActivityModal(deal) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/deals/tenantActivityModal.cshtml',
                    controller: 'host.views.crm.tenants.tenantActivityModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tenantId: function () {
                            return deal.linkedTenantId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeals();
                });
            }

            function getEditions() {
                vm.loading = true;
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function init() {
                vm.getDeals();
                getEditions();
            }
            init();
        }
    ]);
