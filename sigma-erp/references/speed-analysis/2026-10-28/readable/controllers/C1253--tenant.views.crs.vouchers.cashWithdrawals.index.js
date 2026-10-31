// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329208-329496
appModule.controller('tenant.views.crs.vouchers.cashWithdrawals.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cashWithdrawalSearch', 'abp.services.app.billingMethod', 'utilities', 'abp.services.app.cashWithdrawal',
        function ($scope, $uibModal, uiGridConstants, cashWithdrawalSearchService, billingMethodService, utilities, cashWithdrawalService) {
            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

            //Filters 
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                voucherNo: null,
                fromDate: null,
                toDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            //Permissions 
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.CashWithDrawals.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.CashWithDrawals.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Vouchers.CashWithDrawals.Delete'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.CashWithDrawals.View'),
                isJournalEnabled: abp.auth.hasPermission('Pages.Tenant.Accounts.Journal'),
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewCashWithdrawal(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editCashWithdrawal(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteCashWithdrawal(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '{{row.entity.voucherNo}}' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChequeDate'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.billingDetail.cheque.chequeDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Bank'),
                        field: 'billingDetail.bankAccount.bankName',
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        type: 'number',
                        cellTemplate:
                            '<div class=\"ui-grid-cell pull-right\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled && row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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

                        vm.getCashWithdrawal();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCashWithdrawal();
                    });
                },
                data: []
            };

            vm.createCashWithdrawal = function () {
                openCreateOrEditCashWithdrawalModal(null);
            };

            vm.editCashWithdrawal = function (cashWithdrawalId) {
                openCreateOrEditCashWithdrawalModal(cashWithdrawalId);
            };

            vm.viewCashWithdrawal = function (cashWithdrawal) {
                openViewCashWithdrawalModal(cashWithdrawal.id);
            };

            vm.deleteCashWithdrawal = function (cashWithdrawal) {
                openDeleteCashWithdrawalModal(cashWithdrawal);
            };


            // functions 
            function openCreateOrEditCashWithdrawalModal(cashWithdrawalId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/cashWithdrawals/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.cashWithdrawals.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        cashWithdrawalId: function () {
                            return cashWithdrawalId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCashWithdrawal();
                });
            }

            function openViewCashWithdrawalModal(cashWithdrawalId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/cashWithdrawals/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.cashWithdrawals.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        cashWithdrawalId: function () {
                            return cashWithdrawalId;
                        }
                    }
                });
            }

            function openDeleteCashWithdrawalModal(cashWithdrawal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', cashWithdrawal.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            cashWithdrawalService.deleteCashWithdrawal({
                                id: cashWithdrawal.id
                            }).success(function () {
                                vm.getCashWithdrawal();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            vm.openJournalViewModal = function (cashWithdrawal) {
                openJournalViewModal(cashWithdrawal);
            }

            openJournalViewModal = function (cashWithdrawal) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return cashWithdrawal.id;
                        },
                        voucherNo: function () {
                            return cashWithdrawal.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCashWithdrawal();
                });
            }


            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getCashWithdrawal = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                
                cashWithdrawalSearchService.getCashWithdrawal(vm.filters)
                    .success(function (data) {
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            // init
            function init() {
                initDate();
                getBillingMethods();
                vm.getCashWithdrawal();
            }

            init();
        }]);
