// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:169164-169478
appModule.controller('tenant.views.crs.banking.creditCardTransBankTransfer.index', [
        '$scope', 'appSession', 'abp.services.app.user', '$uibModal', 'uiGridConstants', 'abp.services.app.creditCardTransBankTransfer', 'abp.services.app.commonLookup', 'abp.services.app.account', 'utilities',
        function ($scope, appSession, userService, $uibModal, uiGridConstants, creditCardTransBankTransferService, commonLookupService, accountService, utilities) {

            var vm = this;
            vm.balanceSheet = null;
            vm.showemptynode = appSession.user.branchAccess == 3;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.filters = {
                fromDate: null,
                toDate: null,
                accountId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                locationId: '',
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;

                    if (appSession.user.branchAccess === 1) {
                        vm.locations = vm.locations.filter(location => location.id === appSession.user.locationId);
                        vm.filters.locationId = appSession.user.locationId;
                    }
                    else if (appSession.user.branchAccess === 2) {
                        getSelectiveBranches();
                    }
                    else {
                        vm.locations;
                    }
                });
            }
            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                   
                });
            }

            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                });
            }

            vm.getCreditCardTransBankTransfers = function () {

                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                creditCardTransBankTransferService.getCreditCardTransBankTransfers(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Banking.CreditCardTransTransfers'),
                edit: abp.auth.hasPermission('Pages.Tenant.Banking.CreditCardTransBankTransfer.CashDeposits.Edit'),
                create: abp.auth.hasPermission('Pages.Tenant.Banking.CreditCardTransBankTransfer.Addnew'),
                delete: abp.auth.hasPermission('Pages.Tenant.Banking.CreditCardTransBankTransfer.CashDeposits.Delete'),
            };
            console.log(vm.permissions);
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.view(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editTransaction(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.CreditCardTransTransferPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printCreditCardTransTransfer/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.delete(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CreditCardTransactionsBankTransferNo'),
                        field: 'voucherNo',
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>',
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                          '<div class=\"ui-grid-cell\">' +
                          '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.amount)}}</div>' +
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

                        vm.getCreditCardTransBankTransfers();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCreditCardTransBankTransfers();
                    });
                },
                data: []
            }; 

            vm.CreditCardTransTransferPrintModal = function (creditCardTransBankTransferId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/creditCardTransBankTransfer/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.banking.creditCardTransBankTransfer.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        creditCardTransBankTransferId: function () {
                            return creditCardTransBankTransferId;
                        }
                    }
                });
            };

            vm.clearAccount = function () {
                vm.filters.account = null;
                vm.filters.accountId = null;
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.exportToExcel = function () {
                vm.loading = true;


                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                creditCardTransBankTransferService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            //vm.searchAccounts = function ($select) {
            //    //get leaf accounts only
            //    if ($select.search == "") { vm.accounts = null; return null; }
            //    return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
            //        vm.bankAccounts = response.data.items;
            //    });
            //};


            vm.createPopup = function () {
                openCreateOrEditcreditCardTransBankTransferModal();
            };
            vm.editTransaction = function (row) {
                openCreateOrEditcreditCardTransBankTransferModal(row.id);
            };
            
            vm.createPopup = function () {
                openCreateOrEditcreditCardTransBankTransferModal();
            };
            vm.view = function (creditCardTransBankTransfer) {
                openViewModal(creditCardTransBankTransfer.id);
            };

            openViewModal = function(creditCardTransBankTransferId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/creditCardTransBankTransfer/viewModal.cshtml',
                    controller: 'tenant.views.crs.banking.creditCardTransBankTransfer.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditCardTransBankTransferId: function() {
                            return creditCardTransBankTransferId;
                        }
                    }
                });

            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/banking/creditCardTransBankTransfer/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openCreateOrEditcreditCardTransBankTransferModal(creditCardTransBankTransferId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/creditCardTransBankTransfer/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.banking.creditCardTransBankTransfer.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditCardTransBankTransferId: function () {
                            return creditCardTransBankTransferId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCreditCardTransBankTransfers();
                });
            }


            vm.delete = function (creditCardTransBankTransfer) {
                abp.message.confirm(
                  app.localize('DeleteWarningMessage', creditCardTransBankTransfer.voucherNo),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           creditCardTransBankTransferService.deleteCreditCardTransBankTransfer({ id: creditCardTransBankTransfer.id })
                               .success(function (data) {
                                   vm.getCreditCardTransBankTransfers();
                                   abp.notify.success(app.localize('SuccessfullyDeleted'));
                               });
                       }
                   }
               );
            };



            function init() {
                initDate();
                getBankAccounts();
                vm.getCreditCardTransBankTransfers();
                getLocations();
            }
            init();
            //vm.getCreditCardTransBankTransfers();
        }
    ]);
