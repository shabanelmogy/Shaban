// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:274537-274987
appModule.controller('tenant.views.crs.reports.outStandingReport.index', [
        '$scope', '$uibModal', 'appSession', 'abp.services.app.user', 'abp.services.app.directory', 'utilities', 'abp.services.app.commonLookup', 'uiGridConstants', 'abp.services.app.outStandingReport', '$stateParams', 'abp.services.app.statementOfAccounts',
        function ($scope, $uibModal, appSession, userService, directoryService, utilities, commonLookupService, uiGridConstants, outStandingReportService, $stateParams, statementOfAccountsService) {

            var vm = this;
            vm.contactType = $stateParams.contactType;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };
            vm.allBranchPermission = abp.auth.hasPermission('Pages.Tenant.Customers.ViewOtherBranchCustomers');
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.customerCategories = [
                { id: 1, name: app.localize('Individual') }, { id: 2, name: app.localize('Company') }
            ];
            vm.customerStatus = [
                { id: 0, name: app.localize('Active') },
                { id: 1, name: app.localize('In-Active') }
            ];
            vm.loading = false;
            vm.customers = [];
            vm.filters = {
                skipCount: 0,
                balanceRadio: 0,
                locationId: appSession.user.locationId,
                customerCategory: null,
                inActive: null,
                firstDateSearch: false,
                contactType: $stateParams.contactType,
                salesPersonId: null,
                salesPerson: null,
                customerId: null,
                accountId: null,
                ToBalance: null,
                FromBalance: null,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.permissions = {
                isViewBalanceSummaryEnabled: abp.auth.hasPermission('Pages.Tenant.Customers.ViewOtherSalesPersonInBalanceSummary'),
            };
            //vm.balanceRadio = null;
            vm.totalAmount = null;

            vm.isAllBranchUser = appSession.user.branchAccess == 3;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.searchUsers = function ($select) {
                if (!$select.search) return;
                directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };
            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }
            vm.resetRangeValues = function () {
                if (vm.filters.balanceRadio != "3") {
                    vm.filters.FromBalance = null;
                    vm.filters.ToBalance = null;
                }
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    vm.totalLocations = angular.copy(data.items);
                    if (!vm.allBranchPermission) {
                        if (appSession.user.branchAccess == 2)
                            getSelectiveBranches();
                        else if (appSession.user.branchAccess == 1) {
                            vm.filters.locationId = appSession.user.locationId;
                            vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                        }
                    } else {
                        if (vm.totalLocations) {
                            if (vm.totalLocations.length == 1) {
                                vm.filters.locationId = null;
                                vm.getOutStandingReport();

                            }
                        }
                    }

                });
            }
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: vm.contactType, activeOnly: true, contactCategory: vm.filters.contactCategory }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return vm.contactType;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.getContactType = function () {
                if (!$stateParams.contactType && $stateParams.contactType == '')
                    return null;
                if ($stateParams.contactType == 1)
                    return app.localize('Staff');
                if ($stateParams.contactType == 2)
                    return app.localize('Customers');
                if ($stateParams.contactType == 3)
                    return app.localize('Suppliers');
                return null
            }


            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(dateFormat)).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.showSalesperson = $stateParams.contactType == 2;
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                outStandingReportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getBalance = function (balance) {

                if (balance != 0) {
                    return balance > 0 ? 'Dr ' + vm.CurrencyFormate(balance) : 'Cr ' + (vm.CurrencyFormate(-balance));
                }
                return balance;
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Select'),
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" aria-haspopup="true" ng-click="grid.appScope.viewStatementOfAccount(row.entity)" ><i class="fa fa-check"></i> ' + app.localize('Select') + ' </button>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        minWidth: 85,
                        name: app.localize('Code'),
                        //enableSorting: true,
                        field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.code}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        minWidth: 330,
                        name: app.localize('Name'),
                        //enableSorting: true,
                        field: 'name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.name}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        minWidth: 100,
                        name: app.localize('ContactPerson'),
                        field: 'name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.contactPersonName}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        minWidth: 100,
                        name: app.localize('Mobile'),
                        // enableSorting: true,
                        field: 'mobileNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.mobileNo}}' + '&nbsp' + '</span>' +
                            '</div>'

                    },
                    {
                        minWidth: 110,
                        name: app.localize('ContactNo'),
                        // enableSorting: true,
                        field: 'contactNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.contactNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        minWidth: 220,
                        name: app.localize('Email'),
                        // enableSorting: true,
                        field: 'email',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.email}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        minWidth: 150,
                        name: app.localize('SalesPerson'),
                        // enableSorting: true,
                        field: 'salesPerson.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.salesPerson.name}}</div>' +
                            '</div>',
                        visible: vm.showSalesperson
                    },
                    {
                        minWidth: 130,
                        name: app.localize('balance'),
                        // enableSorting: true,
                        field: 'balance',
                        type: 'number',
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.getBalance(row.entity.balance)}}</div>',
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

                        vm.getOutStandingReport();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getOutStandingReport();
                    });
                },
                data: []
            };

            vm.report = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/outStandingReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }

            vm.contactGroupStaffFilter = function (item) {
                if (item.contactGroupId != null && item.contactGroupId > 0 && item.contactGroup.contactType == 1) {
                    return true;
                }
                return false;
            };

            vm.getOutStandingReport = function () {

                vm.loading = true;
                //getting linked accounts of staff
                statementOfAccountsService.getLinkedAccountsForEdit().success(function (data) {
                    vm.linkAccounts = data.items;
                    vm.filters.contactType = vm.contactType;
                });
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.filters.salesPersonId = [];
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                if (!vm.permissions.isViewBalanceSummaryEnabled) {
                    vm.filters.salesPersonId = [];
                    vm.filters.salesPersonId.push(appSession.user.contactId);

                }

                vm.resetRangeValues();


                outStandingReportService.getOutStandingReport(vm.filters).success(function (data) {
                    vm.totalAmount = data.totalAmount;
                    if (vm.totalAmount != 0) {
                        vm.totalAmount = vm.totalAmount > 0 ? 'Dr ' + vm.CurrencyFormate(vm.totalAmount) : 'Cr ' + (vm.CurrencyFormate(-vm.totalAmount));
                    }
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.outstandingList;
                }).finally(function () {
                    vm.loading = false;
                });

            };
            vm.viewStatementOfAccount = function (customer) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/viewStatementOfAccount.cshtml',
                    controller: 'tenant.views.crs.reports.statementOfAccounts.viewStatementOfAccount as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        customer: function () {
                            return customer;
                        }
                    }
                });

            }

            vm.showReport = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/outStandingReport/report.cshtml',
                    controller: 'tenant.views.crs.reports.outStandingReport.report as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    abc: function () {
                    //        return vm.filters;
                    //    }
                    //}
                });

            }
            function init() {
                vm.getOutStandingReport();
                getLocationsActiveAndInActive();
                vm.searchUsersWithDesignation();
            }
            init();

        }
    ]);
