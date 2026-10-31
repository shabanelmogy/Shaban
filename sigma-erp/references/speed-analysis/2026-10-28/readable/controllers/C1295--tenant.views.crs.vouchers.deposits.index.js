// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:339723-340554
appModule.controller('tenant.views.crs.vouchers.deposits.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.deposit', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod', 'utilities', '$rootScope',
        function ($scope, $uibModal, $window, uiGridConstants, depositService, directoryService, appSession, commonLookupService, billingMethodService, utilities, $rootScope) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.depositTypes = [
               { type: app.localize('PreAuthorizationDeposit'), id: 11 },
               { type: app.localize('ChequeDeposit'), id: 13 }
            ];

            vm.loading = false;
            vm.showPrintLogoCheck = appSession.tenant.tenancyName == 'Galadari';
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.showUsedDepositReport = abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.UsedDepositReport');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc().startOf('day'),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc().endOf('day')
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.customers = [];
            vm.types = [
               { name: app.localize('PreAuthorizationDeposit'), id: 11 },
               { name: app.localize('CreditCardDeposit'), id: 20 },
               { name: app.localize('CashDeposit'), id: 12 },
               { name: app.localize('ChequeDeposit'), id: 13 }
            ];
            vm.changePrintingWithoutLogo = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printHeader = vm.filters.printingWithoutLogo;
                });
            };
            vm.filters = {
                voucherNo: null,
                agreementNo: null,
                customerId: null,
                fromDate: null,
                toDate: null,
                inHold: false,
                skipCount: 0,
                depositsSearchFilter: 1,
                voucherSubTypeId: 0,
                billingMethodType: null,
                printingWithoutLogo: false,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            var getType = function (voucherSubTypeId) {
                if (voucherSubTypeId == 11)
                    return app.localize("PreAuthorizationDeposit");
                else if (voucherSubTypeId == 13)
                    return app.localize("ChequeDeposit");
                else
                    return "";
            }
            vm.getTypeById = function (row) {

                if (row.voucherSubTypeId == 12) {
                    return row.billingDetail != null ? row.billingDetail.billingMethod ? row.billingDetail.billingMethod.name: null:null;
                    //return row.billingDetail.billingMethod.name;
                }
                else{
                    return getType(row.voucherSubTypeId);
                }

            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.depositBillingMethods = data.items;
                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });
                    vm.depositTypes.forEach(function (value) {
                        vm.depositBillingMethods.push({
                            name: value.type,
                            voucherSubTypeId: value.id,
                        });
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment(moment().format('YYYY-MM-DD')).utc().startOf('day'),
                    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc().endOf('day')
                };
            }
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Edit'),
                transfer: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Transfer'),
                refund: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Refund'),
                used: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Used'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.ExportToExcel'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Delete'),
                'view': abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.View'),
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Print'),
                allocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations'),
                // depositChargesAllocation: abp.features.isEnabled('CRS.Vouchers.Deposits.DepositChargesAllocation'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposits'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.ViewOtherBranchDeposit'),
                extensionOfDeposits: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.ExtensionOfDeposits')
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
            vm.getExpiryOrDays = function (fromdate, todate, voucherSubTypeId) {

                if (voucherSubTypeId == 11) {
                    if (todate != null) {
                        var localTime = moment.utc(todate).toDate();
                        return moment(localTime).format(vm.dateFormat);
                    }
                    else
                        return "";
                }
                else {
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var firstDate = new Date(fromdate);
                    var secondDate = new Date(todate);
                    if (fromdate != null && todate != null) {
                        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                        return diffDays;
                    }
                    else
                        return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.useDeposit = function (deposit) {
                if (vm.isAllocationWithChargesTypeEnabled) {
                    openUseDepositModal2(deposit);
                }
                else {
                    openUseDepositModal(deposit);
                }
                
            };
            function openUseDepositModal(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            function openUseDepositModal2(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit2.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            vm.depositRefund = function (deposit) {

                openDepositRefund(deposit);
            };
            function openDepositRefund(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/depositRefund.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.depositRefund as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            $scope.date = new Date();
            var today = moment.utc($scope.date);
            vm.getCurrentDate = function (toDate) {
                var expiry = moment.utc(toDate);
                if (expiry > today)
                    return true;
                else
                    return false;
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
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewDeposit(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.used && row.entity.statusString == \'In-Hold\' && row.entity.voucherSubTypeId != 13" ng-click="grid.appScope.useDeposit(row.entity)">' + app.localize('UseDeposit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.statusString == \'In-Hold\' && row.entity.voucherSubTypeId == 11" ng-click="grid.appScope.openRenewExpiry(row.entity)">' + app.localize('Renew') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.statusString == \'In-Hold\' && row.entity.voucherSubTypeId == 13" ng-click="grid.appScope.returnDeposit(row.entity)">' + app.localize('Return') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.refund && row.entity.statusString == \'In-Hold\' && (row.entity.voucherSubTypeId == 12 || row.entity.voucherSubTypeId == 20)" ng-click="grid.appScope.depositRefund(row.entity)">' + app.localize('Refund') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.extensionOfDeposits && grid.appScope.permissions.extensionOfDeposits && row.entity.statusString == \'In-Hold\' && row.entity.voucherSubTypeId != 11" ng-click="grid.appScope.extendHoldDays(row.entity)">' + app.localize('Extend') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.transfer && row.entity.statusString == \'In-Hold\'" ng-click="grid.appScope.transferDeposit(row.entity)">' + app.localize('Transfer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.billingDetail.creditCard.transactionId" ng-click="grid.appScope.editDeposit(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editDeposit(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.billingDetail.creditCard.transactionId" ng-click="grid.appScope.deleteDeposit(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteDeposit(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.openprintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printDeposit/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('DepositNo'),
                        type: 'number',
                        width: 145,
                        field: 'voucherNo'
                    },
                     {
                         name: app.localize('Type'),
                         width: 140,
                         cellTemplate:
                          '<div class=\"ui-grid-cell\">' +
                          '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getTypeById(row.entity)}}</div>' +
                          '</div>'
                     },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },

                     {
                         name: app.localize('Expiry'),
                         field: 'toDate',
                         width: 100,
                         cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getExpiryOrDays(row.entity.fromDate,row.entity.toDate,row.entity.voucherSubTypeId)}}</div>' +
                             '</div>'
                     },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.customer.hasCard" class="label label-warning">CC</span> {{row.entity.customer.name}}</div>' +
                            '</div>',
                        width: 300
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'customer.code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.customer.hasCard" class="label label-warning">CC</span> {{row.entity.customer.code}}</div>' +
                            '</div>',
                        width: 130
                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'agreement.agreementNo',
                        width: 140

                    },
                    {
                        name: app.localize('Status'),
                        width: 140,
                        field: app.localize('statusString')
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        width: 140,
                        cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                             '</div>'
                    },
                    {
                        name: app.localize('Used'),
                        field: 'amount',
                        width: 140,
                        cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amountUsed)}}</div>' +
                             '</div>'
                    },
                    {
                        name: app.localize('Refunded'),
                        field: 'amount',
                        width: 140,
                        cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amountRefunded)}}</div>' +
                             '</div>'
                    },
                    {
                        name: app.localize('Balance'),
                        field: 'amount',
                        width: 140,
                        cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.balance)}}</div>' +
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

                        vm.getDeposits();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getDeposits();
                    });
                },
                data: []
            };

            vm.openprintModal = function (d) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return d;
                        }
                    }
                });
            };

            vm.returnDeposit = function (deposit) {
                abp.message.confirm(
                 //   app.localize('DeleteWarningMessage', deposit.voucherNo),
                    app.localize('ReturnCheckMessage', deposit.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            depositService.returnDeposit({
                                id: deposit.id
                            }).success(function () {
                                vm.getDeposits();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.depositsSearchFilter == 1) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc().startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc().endOf('day');
                }
                if (vm.filters.depositsSearchFilter == 3) {
                    vm.filters.fromDate = moment().startOf('day');
                    vm.filters.toDate = moment().endOf('day');

                }

                depositService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
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
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };

            function openEditDepositModal(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/editDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.editDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                deposit: deposit,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            // Opening  ViewDepositModal 
            function openViewDepositModal(depositId, agreement, deposit) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        },
                        agreement: function () {
                            return agreement;
                        },
                        deposit: function () {
                            return deposit;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            };
            function openRenewExpiryModal(depositId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/renewExpiry.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.renewExpiry as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            function extendHoldDaysModal(depositId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/extendHoldDaysModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.extendHoldDaysModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            // Opening Create Allocation Modal
            function openCreateAllocationModal(voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    voucherId: function () {
                    //        return voucherId;
                    //    },

                    //}
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucherId
                            };
                        }
                    }
                });
            }

            // Opening Charges Types Allocation Modal
            function openDepositChargesAllocationModal(voucherId, amount) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/depositChargesAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.depositChargesAllocation as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return voucherId;
                        },
                        depositAmount: function () {
                            return amount;
                        }

                    }
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
                            return '~/App/tenant/views/crs/vouchers/deposits/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.usedReport = function () {
                

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/deposits/usedReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            //vm.createDeposit = function () {
            //    openCreateOrEditDepositModal(null, null);
            //};

            vm.editDeposit = function (deposit) {
                openEditDepositModal(deposit);
            };



            vm.createDepositChargesAllocation = function (voucher) {
                openDepositChargesAllocationModal(voucher.id, voucher.amount);
            };




            //vm.locationPermission = function (row) {
            //    if (row.locationId) {
            //        if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
            //            return false;
            //    }
            //};

            vm.getDeposits = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.depositsSearchFilter == 1) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc().startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc().endOf('day');
                }
                if (vm.filters.depositsSearchFilter == 3) {
                    vm.filters.fromDate = moment().startOf('day');
                    vm.filters.toDate = moment().endOf('day');

                }
                if (vm.filters.voucherSubType) {
                    vm.filters.voucherSubTypeId = vm.filters.voucherSubType.voucherSubTypeId;
                    vm.filters.billingMethodType = vm.filters.voucherSubType.type;

                }
                //in case of InHold and InHold_ExpiredAndDueToReturn
                if (vm.filters.depositsSearchFilter == 2 || vm.filters.depositsSearchFilter == 4) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                //if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                //   initDate();
                depositService.getDeposits(vm.filters).success(function (data) {
                    if (!vm.depositBillingMethods)
                        getBillingMethods();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            printHeader: vm.filters.printingWithoutLogo
                        };
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.deleteDeposit = function (deposit) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', deposit.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            depositService.deleteDeposit({
                                id: deposit.id
                            }).success(function () {
                                vm.getDeposits();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };


            // View Deposit
            vm.viewDeposit = function (deposit) {
                openViewDepositModal(deposit.id, null, deposit);                
            };

            vm.openRenewExpiry = function (deposit) {
                openRenewExpiryModal(deposit.id);
            };

            vm.extendHoldDays = function (deposit) {
                extendHoldDaysModal(deposit.id);
            };

            vm.transferDeposit = function (deposit) {
                transferDepositModal(deposit);
            }

            function transferDepositModal(deposit) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/transferDepositModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.transferDepositModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return deposit.id;
                        },
                        customerId: function () {
                            return deposit.contactId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            // Print Deposit
            //vm.printDeposit = function (deposit) {
            //    openDepositPrintPreview(deposit.id);
            //};

            //function openDepositPrintPreview(depositId) {
            //    abp.ajax({
            //        url: abp.appPath + 'Application/PrintDeposit',
            //        data: JSON.stringify({
            //            depositId: depositId,
            //        })
            //    });
            //}

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getDeposits();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };

            vm.openJournalViewModal = function (deposit) {
                openJournalViewModal(deposit);
            }

            openJournalViewModal = function (deposit) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return deposit.id;
                        },
                        voucherNo: function () {
                            return deposit.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            function init() {

                //  initDate();
                vm.getDeposits();
            }
            init();
        }
    ]);
