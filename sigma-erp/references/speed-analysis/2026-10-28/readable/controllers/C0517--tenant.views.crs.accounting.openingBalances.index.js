// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:130312-133215
appModule.controller('tenant.views.crs.accounting.openingBalances.index', [
        '$scope', 'abp.services.app.openingBalance', 'abp.services.app.directory', 'abp.services.app.asset', '$uibModal', '$filter', 'abp.services.app.commonLookup', 'FileUploader', 'appSession', 'uiGridConstants', 'utilities', 'abp.services.app.item', 'abp.services.app.costCenter', 'abp.services.app.account', 'abp.services.app.vehicle', 'abp.services.app.bill',
        function ($scope, openingBalanceService, directoryService, assetService, $uibModal, $filter, commonLookupService, fileUploader, appSession, uiGridConstants, utilities, itemAppService, costCenterService, accountService, vehicleService, billService) {
            var vm = this;
            vm.loading = false;
            vm.isVehicle = false;
            vm.totalDebit = 0;
            vm.totalCredit = 0;
            vm.balance = 0;
            vm.totalDebitSupplier = 0;
            vm.totalCreditSupplier = 0;
            vm.balanceSupplier = 0;
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.accountLines = [];
            vm.locations = [];
            vm.displayAccounts = [];
            vm.items = [];
            vm.enableLoanTabsInOpeningBalances = abp.features.isEnabled("CRS.CustomFeatures.EnableLoanTabsInOpeningBalances");
            vm.isRentalAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
            vm.isLeaseAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
            vm.importPermission = appSession.tenant.tenancyName.toLowerCase() == 'carleaserentacar';
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.stockMultiBranch = abp.features.isEnabled("Stock_MultiBranch");
            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.filtersSupplier = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            function getAccounts() {
                return accountService.getAccounts().then(function (response) {
                    vm.displayAccounts = response.data.items;
                });
            };

            getAccounts().then(function () {
                initAccountOpeningBalance();
                initCostCenterOpeningBalance();
            });

            // search from dropdown
            vm.searchContacts = function ($select, contactType) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: contactType }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };
            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };
            vm.vehicles = null;
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }

                return vehicleService.searchVehicles({
                    plateNo: $select.search
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearContact = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.clearSupplier = function () {
                vm.filtersSupplier.contact = null;
                vm.filtersSupplier.contactId = null;
            };
            vm.setImportFlag = function (flag) {
                vm.isVehicle = flag;
            };

            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {

                if ($select.search == '') return;
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };
            vm.searchAsset = function ($select) {
                return assetService.search({ keyword: $select.search }).then(function (response) {
                    vm.assets = response.data.items;
                });
            };

            // Searching Accounts
            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true, accountCategory: vm.accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return utilities.currencyAndRounding(amount);
            };
            function accountLineObject() {

                var line = new Object();
                line.id = null,
                    line.account = null,
                    line.accountId = null,
                    line.locationId = null,
                    line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            }

            function openingBalanceCostCenterObject() {
                var line = new Object();
                line.id = null,
                    line.account = null,
                    line.accountId = null,
                    line.locationId = null,
                    line.costCenter2Id = null,
                    line.Description = null;
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            }
            // For Adding Customer 
            function accountLineCustomerObject() {
                var line = new Object();
                line.contactId = 12,
                    //line.filterContactId=1,
                    line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.customerGroupId = 2;
                return line;
            }

            // For Adding Customer Voucher
            function openingBalanceContactObject() {
                var line = new Object();
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            }


            function openingBalanceStockObject() {
                var line = new Object();
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.description = null;
                line.quantity = 0;
                line.productId = null;
                line.unitOfMeasureId = null;
                return line;
            }
            // For Adding Supplier
            function accountLineSupplierObject() {
                var line = new Object();
                line.contactId = 12,
                    //line.filterContactId=1,
                    line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.supplierGroupId = 2;
                return line;
            }
            // For Adding Staff
            function accountLineStaffObject() {
                var line = new Object();
                line.contactId = 12,
                    //line.filterContactId=1,
                    line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.staffGroupId = 2;
                return line;
            }

            // For Adding Asset
            function accountLineAssetObject() {
                var line = new Object();
                //line.contactId = 12,
                line.assetId = -1;
                line.filterContactId = 1,
                    line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                //line.assetGroupId = 2;
                return line;
            }

            // For Adding 
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            //Add row
            vm.addRow = function () {
                vm.accountOpeningBalance.voucherLines.push(accountLineObject());
            };

            //// Adding Customer Row
            //vm.addCustomerRow = function () {
            //    vm.openingBalance.voucherLines.push(accountLineCustomerObject());
            //};

            vm.addCostCenterRow = function () {
                vm.costCenterOpeningBalance.voucherLines.push(openingBalanceCostCenterObject());
            };

            // Adding Customer Row
            vm.addCustomerRow = function () {
                vm.customerOpeningBalance.push(openingBalanceContactObject());
            };

            //  Adding Supplier Row
            vm.addSupplierRow = function () {
                vm.supplierOpeningBalance.push(openingBalanceContactObject());
            };
            //  Adding Supplier Row
            vm.addStaffRow = function () {
                vm.staffOpeningBalance.push(openingBalanceContactObject());
            };

            vm.addStockRow = function () {
                if (!vm.stockOpeningBalance.voucherLines)
                    vm.stockOpeningBalance.voucherLines = [];
                vm.stockOpeningBalance.voucherLines.push(openingBalanceStockObject());
            };
            //// Adding Staff Row
            //vm.addStaffRow = function () {
            //    vm.openingBalance.voucherLines.push(accountLineStaffObject());
            //};
            //// Adding Supplier Row
            //vm.addSupplierRow = function () {
            //    vm.openingBalance.voucherLines.push(accountLineSupplierObject());
            //};

            // Adding Asset Row
            vm.addAssetRow = function () {
                vm.openingBalance.voucherLines.push(accountLineAssetObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.accountOpeningBalance.voucherLines.indexOf(obj);
                vm.accountOpeningBalance.voucherLines.splice(index, 1);

            };

            // Removing Customer Row
            vm.removeRowCustomer = function (row) {
                var index = vm.customerOpeningBalance.indexOf(row);
                vm.customerOpeningBalance.splice(index, 1);
            };

            vm.removeRowCostCenter = function (row) {
                var index = vm.costCenterOpeningBalance.voucherLines.indexOf(row);
                vm.costCenterOpeningBalance.voucherLines.splice(index, 1);
            };

            // Removing Supplier Row
            vm.removeSupplierRow = function (row) {
                var index = vm.supplierOpeningBalance.indexOf(row);
                vm.supplierOpeningBalance.splice(index, 1);
            };

            // Removing Staff Row
            vm.removeStaffRow = function (row) {
                var index = vm.staffOpeningBalance.indexOf(row);
                vm.staffOpeningBalance.splice(index, 1);
            };
            vm.removeStockRow = function (row) {
                var index = vm.stockOpeningBalance.voucherLines.indexOf(row);
                vm.stockOpeningBalance.voucherLines.splice(index, 1);
            };
            vm.individaulContactFilter = function (item) {
                if ((item.contactId != null && item.contactId > 0)) {
                    return true;
                }
                return false;
            };
            vm.openingBalanceFilter = function (item) {
                if ((item.contactId == null || item.contactId == 0) && item.account != null) {
                    return true;
                }
                return false;
            };

            // CustomerFilter
            vm.customerFilter = function (item) {
                if (item.customerGroupId) {
                    return true;
                }
                if (item.contact && item.contact.contactType == 2) {
                    return true;
                }
                return false;
            };
            // Supplier Filter
            vm.supplierFilter = function (item) {
                if (item.supplierGroupId) {
                    return true;
                }
                if (item.contact && item.contact.contactType == 3) {
                    return true;
                }
                return false;
            }
            // Staff Filter
            vm.staffFilter = function (item) {
                if (item.staffGroupId) {
                    return true;
                }
                if (item.contact && item.contact.contactType == 1) {
                    return true;
                }
                return false;
            }
            // Asset Filter
            vm.assetFilter = function (item) {
                if (item.assetId) {
                    return true;
                }
                //if (item.contact && item.contact.contactType == 1) {
                //    return true;
                //}
                return false;
            }

            vm.clearItem = function () {
                vm.filters.product = null;
                vm.filters.productId = null;
            };
            // Assigning Values On Change of Contact in Individual Contact Tab

            vm.onChangeOfContact = function (account) {
                //account.accountId = 23;
                account.contactId = account.contact.id;
            };

            vm.onChangeOfAsset = function (account) {
                account.assetId = account.asset.id;
            };

            vm.changeProduct = function (row) {

                row.productId = row.product.id;
                if (row.product.unitOfMeasure) {
                    row.unitOfMeasureId = row.product.unitOfMeasure.id;
                }
                //alert(JSON.stringify(vm.stockOpeningBalance))
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            getLocations();


            vm.save = function () {
                vm.saving = true;
                //   vm.openingBalance.locationId = 1;

                openingBalanceService.createOrUpdateOpeningBalance({
                    openingBalance: vm.openingBalance
                }).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    init();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                vm.loading = true;
                getCostCenters();
                openingBalanceService.getOpeningBalancesForEdit().success(function (data) {

                    //  accountService.getBalanceSheet().success(function (data) {
                    vm.openingBalance = data;
                    //check if half day price line is already added. then disable adding new row
                    var foundLines = $filter('filter')(vm.openingBalance.voucherLines, {
                        contactId: null,
                        assetId: null,

                    }, true);
                    if (foundLines.length == vm.openingBalance.voucherLines.length) {
                        vm.addCustomerRow();
                        vm.addSupplierRow();
                        vm.addStaffRow();
                        vm.addAssetRow();
                    }
                    else {
                        var staffCount = 0;
                        var customerCount = 0;
                        var supplierCount = 0;
                        var assetCount = 0;


                        angular.forEach(vm.openingBalance.voucherLines, function (value, key) {
                            if (value.contact && value.contact.contactType == 1) {
                                staffCount++;
                                if (value.account && value.account.accountType == 2)
                                    value.debit = value.credit;
                            }

                            if (value.contact && value.contact.contactType == 2) {
                                customerCount++;
                                if (value.account && value.account.accountType == 2)
                                    value.debit = value.credit;
                            }

                            if (value.contact && value.contact.contactType == 3) {
                                supplierCount++;
                                //    //if (value.account && value.account.accountType == 2)
                                //        //value.debit = value.credit;
                            }
                            //if (value.assetId==-1) {
                            //    assetCount++;

                            //}

                            //else 
                            //    assetCount++;

                            //        value.debit = value.debit;

                        });
                        if (staffCount == 0)
                            vm.addStaffRow();
                        if (customerCount == 0)
                            vm.addCustomerRow();
                        if (supplierCount == 0)
                            vm.addSupplierRow();
                        //if (assetCount == 0)
                        //   vm.addAssetRow();

                    }


                }).finally(function () {
                    vm.loading = false;
                });

            }
            //init();

            /* function initAccountOpeningBalance() {
                 vm.loading = true;
                 openingBalanceService.getValidAccountOpeningBalancesForEdit().success(function (data) {
                     vm.accountOpeningBalance = data;
                 }).finally(function () {
                     vm.loading = false;
                 });
                 //GetAccountOpeningBalancesForEdit
             }
 
             initAccountOpeningBalance();*/

            function initAccountOpeningBalance() {
                vm.loading = true;
                openingBalanceService.getValidAccountOpeningBalances(vm.filters)
                    .success(function (data) {
                        let rows = [];

                        if (data && data.openingBalances && data.openingBalances.items) {


                            angular.forEach(data.openingBalances.items, function (line) {
                                // Set account display regardless of whether account is found
                                if (line.accountId) {
                                    var acc = vm.displayAccounts.find(x => x.id === line.accountId);
                                    if (acc) {
                                        line.accountDisplay = acc.accountCode + " " + acc.name;
                                    } else {
                                        line.accountDisplay = "Account ID: " + line.accountId; // Fallback
                                    }
                                }

                                rows.push(line);
                            });


                            // Set total items from the correct path
                            vm.gridOptionsAccounts.totalItems = data.openingBalances.totalCount;
                            vm.gridOptionsAccounts.data = rows;

                            // Set totals from the correct path
                            vm.totalDebit = utilities.round(data.totalDebit, 2);
                            vm.totalCredit = utilities.round(data.totalCredit, 2);
                            vm.balance = utilities.round(data.balance, 2);

                            if (vm.balance !== 0) {
                                vm.balance = vm.balance > 0 ? "Dr " + vm.balance : "Cr " + (-vm.balance);
                            }
                        } else {
                            vm.gridOptionsAccounts.totalItems = 0;
                            vm.gridOptionsAccounts.data = [];
                            vm.totalDebit = 0;
                            vm.totalCredit = 0;
                            vm.balance = 0;
                        }


                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            getCostCenters();

            /* vm.saveAccountOpeningBalance = function () {
                 vm.saving = true;
                 if (vm.stockOpeningBalance && vm.stockOpeningBalance.id <= 0)
                     vm.stockOpeningBalance.date = moment();
                 openingBalanceService.createOrUpdateAccountOpeningBalance(vm.accountOpeningBalance).success(function (data) {
 
                     initAccountOpeningBalance();
                 }).finally(function () {
                     vm.saving = false;
                 });
             };*/


            //GetCustomerOpeningBalancesForEdit
            function initCustomerOpeningBalance() {
                vm.loading = true;
                openingBalanceService.getCustomerOpeningBalances(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.openingBalances.totalCount;
                    vm.gridOptions.data = data.openingBalances.items;
                    vm.totalDebit = utilities.round(data.totalDebit, 2);
                    vm.totalCredit = utilities.round(data.totalCredit, 2);
                    vm.balance = utilities.round(data.balance, 2);
                    if (vm.balance != 0)
                        vm.balance = vm.balance > 0 ? "Dr " + vm.balance : "Cr " + -(vm.balance);
                    //vm.customerOpeningBalance = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.vehicles = null;
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }

                return vehicleService.searchVehicles({
                    plateNo: $select.search
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.exportToExcelForPrepaid = function () {
                vm.loading = true;
                openingBalanceService.exportToExcelPrepaid(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                        //File downloaded...
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.searchAccountOpeningBalance = function () {
                initAccountOpeningBalance();
            };
            vm.searchPrepaidOpeningBalance = function () {
                initPrepaidOpeningBalance();
            };
            vm.searchCostCenterOpeningBalance = function () {
                initCostCenterOpeningBalance();
            };
            vm.searchStockOpeningBalance = function () {
                initStockOpeningBalance();
            };

            function initPrepaidOpeningBalance() {
                vm.loading = true;

                openingBalanceService.getPrepaidOpeningBalances(vm.filters).success(function (data) {
                    // Map locationName for each item
                    vm.gridOptionsPrepaid.data = data.openingBalances.items.map(function (item) {
                        var location = vm.locations.find(function (l) {
                            return l.id === item.locationId;
                        });
                        item.locationName = location ? location.name : '';
                        return item;
                    });

                    vm.gridOptionsPrepaid.totalItems = data.openingBalances.totalCount;

                    vm.prepaid = {
                        totalDebit: utilities.round(data.totalDebit, 2),
                        totalCredit: utilities.round(data.totalCredit, 2),
                        balance: utilities.round(data.balance, 2)
                    };

                    if (vm.prepaid.balance != 0) {
                        vm.prepaid.balance = vm.prepaid.balance > 0
                            ? "Dr " + vm.roundingforView(vm.prepaid.balance)
                            : "Cr " + -vm.roundingforView(vm.prepaid.balance);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }


            vm.gridOptionsPrepaid = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editPrepaidOpeningBalance(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deletePrepaidOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        field: 'voucherNo',
                    },
                    {
                        name: app.localize('VoucherDate'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherDetail'),
                        field: 'notes',
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationName',
                    },
                    {
                        name: app.localize('Debit'),
                        field: 'debit',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.debit)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Credit'),
                        field: 'credit',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.credit)}}</div>' +
                            '</div>'
                    },
                ],
                onRegisterApi: function (gridApi) {

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        initPrepaidOpeningBalance();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        initPrepaidOpeningBalance();
                    });
                },
                data: []
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.editPrepaidOpeningBalance = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/editPrepaidOpeningBalance.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.editPrepaidOpeningBalance as vm',
                    size: 'lg',
                    resolve: {
                        prepaidOpeningBalanceRow: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    initPrepaidOpeningBalance();
                });
            };

            vm.deletePrepaidOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deletePrepaidOpeningBalance({
                                id: row.id
                            }).success(function () {
                                initPrepaidOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            //------- Deposit Import ------------------
            vm.exportToExcelForDeposit = function () {
                vm.loading = true;
                openingBalanceService.exportDepositOpeningBalances(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                        //File downloaded...
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.searchDepositOpeningBalance = function () {
                initDepositOpeningBalance();
            };

            vm.gridOptionsAssetLoans = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewAssetLoan(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteAssetLoan(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        width: 200,
                        type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DealNo'),
                        field: 'refNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.refNo}}</div>' +
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
                        name: app.localize('PlateNo'),
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Financer'),
                        field: 'supplier.name',
                        width: 200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.supplier.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('FinancerCode'),
                        field: 'supplier.code',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.supplier.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.amount)}}</div>' +
                            '</div>'
                    },
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.searchAssetLoans();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.searchAssetLoans();
                    });
                },
                data: []
            };

            vm.gridOptionsOtherLoans = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewAssetLoan(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteOtherLoan(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        width: 200,
                        type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DealNo'),
                        field: 'refNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.refNo}}</div>' +
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
                        name: app.localize('Financer'),
                        field: 'supplier.name',
                        width: 200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.supplier.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('FinancerCode'),
                        field: 'supplier.code',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.supplier.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.amount)}}</div>' +
                            '</div>'
                    },
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.searchOtherLoans();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.searchOtherLoans();
                    });
                },
                data: []
            };

            // Asset Loans Functions
            vm.searchAssetLoans = function () {
                initAssetLoans();
            };
            vm.searchOtherLoans = function () {
                initOtherLoans();
            };

            function initAssetLoans() {
                vm.loading = true;
                vm.filters.isVehicle = true;
                billService.getAssetLoans(vm.filters).success(function (data) {
                    // Map location names to asset loans
                    vm.gridOptionsAssetLoans.data = data.items.map(function (item) {
                        var location = vm.locations.find(function (l) {
                            return l.id === item.locationId;
                        });
                        item.locationName = location ? location.name : '';
                        return item;
                    });
                    vm.gridOptionsAssetLoans.totalItems = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function initOtherLoans() {
                vm.loading = true;
                vm.filters.isVehicle = false;
                billService.getAssetLoans(vm.filters).success(function (data) {
                    // Map location names to asset loans
                    vm.gridOptionsOtherLoans.data = data.items.map(function (item) {
                        var location = vm.locations.find(function (l) {
                            return l.id === item.locationId;
                        });
                        item.locationName = location ? location.name : '';
                        return item;
                    });
                    vm.gridOptionsOtherLoans.totalItems = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            // Asset Loan Action Functions
            vm.viewAssetLoan = function (assetLoan) {
                assetLoan.billId = assetLoan.id; // Set billId for the loan
                vm.openAssetLoanModal(assetLoan, true);
            };
            vm.openAssetLoanModal = function (loan) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/loan/loanSummary/dealViewModal.cshtml',
                    controller: 'tenant.views.crs.loan.loanSummaryh.dealViewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                loan: loan
                            };
                        }
                    }
                });
            };


            vm.deleteAssetLoan = function (assetLoan) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billService.deleteAssetLoans({
                                id: assetLoan.id
                            }).success(function () {
                                vm.searchAssetLoans();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.deleteOtherLoan = function (assetLoan) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billService.deleteAssetLoans({
                                id: assetLoan.id
                            }).success(function () {
                                vm.searchOtherLoans();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };



            /* vm.exportToExcelForAssetLoans = function () {
                 vm.loading = true;
                 billService.exportToExcelAssetLoans(vm.filters)
                     .success(function (result) {
                         app.downloadTempFile(result);
                         //File downloaded...
                     }).finally(function () {
                         vm.loading = false;
                     });
             };*/
            function initDepositOpeningBalance() {
                vm.loading = true;
                openingBalanceService.getDepositOpeningBalances(vm.filters).success(function (data) {

                    // vm.gridOptionsDeposit.data = data.items;
                    vm.gridOptionsDeposit.data = data.items.map(function (item) {
                        var location = vm.locations.find(function (l) {
                            return l.id === item.locationId;
                        });
                        item.locationName = location ? location.name : '';
                        return item;
                    });
                    vm.gridOptionsDeposit.totalItems = data.totalCount;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.gridOptionsDeposit = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.deleteDepositOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        field: 'voucherNo',
                    },
                    {
                        name: app.localize('VoucherDate'),
                        field: 'voucherDate',
                        width: 125,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.voucherDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'agreementNo',
                        width: 130
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                    },
                    {
                        name: app.localize('Type'),
                        field: 'voucherSubType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.voucherSubType.replace("Deposit", " Deposit")}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationName',
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                    }
                ],
                onRegisterApi: function (gridApi) {

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        initDepositOpeningBalance();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        initDepositOpeningBalance();
                    });
                },
                data: []
            };

            vm.deleteDepositOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deleteDepositOpeningBalance({
                                id: row.id
                            }).success(function () {
                                initDepositOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            /* vm.addDepositOpeningBalance = function () {
                 var modalInstance = $uibModal.open({
                     templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addPrepaidOpeningBalance.cshtml',
                     controller: 'tenant.views.crs.accounting.openingBalances.addPrepaidOpeningBalance as vm',
                     //backdrop: 'static',
                     size: 'xl',
                 });
 
                 modalInstance.result.then(function () {
                     initPrepaidOpeningBalance();
                 });
             };*/

            function initCostCenterOpeningBalance() {
                vm.loading = true;
                openingBalanceService.getCostCenterOpeningBalances(vm.filters)
                    .success(function (data) {
                        let rows = [];
                        if (data && data.openingBalances && data.openingBalances.items) {
                            angular.forEach(data.openingBalances.items, function (line) {
                                if (!line.hidden) {

                                    var loc = vm.locations.find(x => x.id === line.locationId);
                                    line.locationName = loc ? loc.name : line.locationId;


                                    var cc = vm.costCentersGroup1.find(x => x.id === line.costCenterId);
                                    line.costCenterName = cc ? cc.name : line.costCenterId;
                                    var cc2 = vm.costCentersGroup2.find(x => x.id === line.costCenter2Id);
                                    line.costCenter2Name = cc2 ? cc2.name : line.costCenter2Id;

                                    if (line.accountId) {
                                        var acc = vm.displayAccounts.find(x => x.id === line.accountId);
                                        line.accountDisplay = acc.accountCode + " " + acc.name;
                                    }
                                    rows.push(line);
                                }

                            });

                            vm.gridOptionsCostCenter.totalItems = data.openingBalances.totalCount;
                            vm.gridOptionsCostCenter.data = rows;

                            // Totals
                            vm.totalDebit = utilities.round(data.totalDebit, 2);
                            vm.totalCredit = utilities.round(data.totalCredit, 2);
                            vm.balance = utilities.round(data.balance, 2);

                            if (vm.balance !== 0) {
                                vm.balance = vm.balance > 0 ? "Dr " + vm.balance : "Cr " + (-vm.balance);
                            }
                        } else {
                            vm.gridOptionsCostCenter.totalItems = 0;
                            vm.gridOptionsCostCenter.data = [];
                            vm.totalDebit = 0;
                            vm.totalCredit = 0;
                            vm.balance = 0;
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }



            //if (appSession.tenant.tenancyName.toLowerCase() != 'carleaserentacar')
            //    initCustomerOpeningBalance();
            vm.searchCustomerOpeningBalance = function () {
                initCustomerOpeningBalance();
            };

            vm.saveCostCenterOpeningBalance = function () {
                vm.saving = true;
                openingBalanceService.createOrUpdateCostCenterOpeningBalance(vm.costCenterOpeningBalance).success(function (data) {
                    vm.initCostCenterOpeningBalance();
                }).finally(function () {
                    vm.saving = false;
                });
            };


            vm.saveCustomerOpeningBalance = function () {
                vm.saving = true;
                openingBalanceService.createOrUpdateCustomerOpeningBalance({ openingBalances: vm.customerOpeningBalance }).success(function (data) {
                    if (appSession.tenant.tenancyName.toLowerCase() != 'carleaserentacar')
                        initCustomerOpeningBalance();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            //function initSupplierOpeningBalance() {
            //    vm.loading = true;
            //    openingBalanceService.getSupplierOpeningBalancesForEdit().success(function (data) {
            //        vm.supplierOpeningBalance = data;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            //  initSupplierOpeningBalance();

            vm.saveSupplierOpeningBalance = function () {
                vm.saving = true;
                openingBalanceService.createOrUpdateSupplierOpeningBalance({ openingBalances: vm.supplierOpeningBalance }).success(function (data) {
                    initSupplierOpeningBalance();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.initStaffOpeningBalance = function () {
                if (!vm.staffOpeningBalance) {
                    vm.loading = true;
                    openingBalanceService.getStaffOpeningBalancesForEdit().success(function (data) {
                        vm.staffOpeningBalance = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            //initStaffOpeningBalance();

            vm.saveStaffOpeningBalance = function () {
                vm.saving = true;
                openingBalanceService.createOrUpdateStaffOpeningBalance({ openingBalances: vm.staffOpeningBalance }).success(function (data) {
                    vm.initStaffOpeningBalance();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function initStockOpeningBalance() {
                vm.loading = true;
                openingBalanceService.getStockOpeningBalances(vm.filters)
                    .success(function (data) {
                        let rows = [];
                        if (data && data.openingBalances && data.openingBalances.items) {
                            angular.forEach(data.openingBalances.items, function (line) {
                                if (!line.hidden) {

                                    var loc = vm.locations.find(x => x.id === line.locationId);
                                    line.locationName = loc ? loc.name : line.locationId;

                                    if (line.product) {
                                        line.product.unitOfMeasure = line.unitOfMeasure;
                                        line.product.unitOfMeasureId = line.unitOfMeasureId;
                                    }
                                    rows.push(line);
                                }

                            });

                            vm.gridOptionsStock.totalItems = data.openingBalances.totalCount;
                            vm.gridOptionsStock.data = rows;

                            // Totals
                            vm.totalDebit = utilities.round(data.totalDebit, 2);
                            vm.totalCredit = utilities.round(data.totalCredit, 2);
                            vm.balance = utilities.round(data.balance, 2);

                            if (vm.balance !== 0) {
                                vm.balance = vm.balance > 0 ? "Dr " + vm.balance : "Cr " + (-vm.balance);
                            }
                        }
                        else {
                            vm.gridOptionsStock.totalItems = 0;
                            vm.gridOptionsStock.data = [];
                            vm.totalDebit = 0;
                            vm.totalCredit = 0;
                            vm.balance = 0;
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });


                /* openingBalanceService.getStockOpeningBalances1().success(function (data) {
                     vm.stockOpeningBalance = data;
 
                     angular.forEach(vm.stockOpeningBalance.voucherLines, function (line) {
                         if (line.product) {
                             line.product.unitOfMeasure = line.unitOfMeasure;
                             line.product.unitOfMeasureId = line.unitOfMeasureId;
                         }
 
                         // Optional: If vehicle info is used later
                         // if (line.vehicle && line.vehicle.model && line.vehicle.model.make) {
                         //     line.model = line.vehicle.model;
                         //     line.model.make = line.vehicle.model.make;
                         // }
                     });
 
                 }).finally(function () {
                     vm.loading = false;
                 });*/
            }


            initStockOpeningBalance();

            vm.addPrepaidOpeningBalance = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addPrepaidOpeningBalance.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.addPrepaidOpeningBalance as vm',
                    //backdrop: 'static',
                    size: 'xl',
                });

                modalInstance.result.then(function () {
                    initPrepaidOpeningBalance();
                });
            };

            vm.saveStockOpeningBalance = function () {
                vm.saving = true;

                if (vm.stockOpeningBalance.voucherLines) {
                    vm.stockOpeningBalance.voucherLines.forEach(function (value) {
                        value.location = null;
                    });
                }

                //if (vm.stockOpeningBalance.date) {
                //    var date = moment(vm.stockOpeningBalance.date);
                //    if (!date.isValid())
                //        vm.stockOpeningBalance.date = moment();
                //}

                if (vm.stockOpeningBalance.id <= 0)
                    vm.stockOpeningBalance.date = moment();


                openingBalanceService.createOrUpdateStockOpeningBalance({ stockOpeningBalance: vm.stockOpeningBalance }).success(function (data) {
                    vm.initStockOpeningBalance();
                }).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });
            };

            // Import openingBalance Code
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openUploadOpeningBalanceModal(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            function openUploadOpeningBalanceModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/importOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.importOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    if (appSession.tenant.tenancyName.toLowerCase() != 'carleaserentacar')
                        initCustomerOpeningBalance();
                    vm.importing = false;
                });
            };

            // Import openingBalance Stock
            vm.uploaderStock = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderStock.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openUploadStockOpeningBalanceModal(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploaderStock.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };
            function openUploadStockOpeningBalanceModal(fileName) {

                if (!fileName) {
                    abp.message.error("Please select a file to upload!", "Error");
                    return;
                }

                vm.loading = true;
                vm.saving = false;
                vm.importResult = null;

                // Step 1: Import and parse Excel file
                openingBalanceService.importFromExcelInventory(fileName)
                    .success(function (result) {
                        if (!result || !result.voucherLines || result.voucherLines.length === 0) {
                            abp.message.warn("No valid records found in the Excel file.", "Warning");
                            vm.loading = false;
                            return;
                        }

                        vm.stockOpeningBalance = result;
                        vm.saving = true;

                        // Step 2: Create or update stock opening balance
                        openingBalanceService.createOrEditStockOpeningBalance(vm.stockOpeningBalance)
                            .success(function (data) {

                                // Store the result for display
                                vm.importResult = {
                                    successCount: data.successCount !== undefined ? data.successCount : result.voucherLines.length,
                                    duplicateCount: data.duplicateCount || 0,
                                    message: data.message || "Import completed successfully!",
                                    duplicateDetails: data.duplicateDetails || []
                                };

                                // Refresh the grid/table
                                initStockOpeningBalance();

                                // Show the result modal
                                if (vm.importResult.duplicateCount > 0) {
                                    $('#importResultModal').modal('show');
                                } else {
                                    abp.message.success(
                                        'Successfully imported ' + vm.importResult.successCount + ' record(s)!',
                                        "Import Successful"
                                    );
                                }
                            })
                            .error(function (error) {
                                vm.saving = false;
                                vm.loading = false;

                                var errorMessage = "An error occurred while saving the opening balance.";

                                if (error && error.message) {
                                    errorMessage = error.message;
                                } else if (error && error.error && error.error.message) {
                                    errorMessage = error.error.message;
                                }

                                abp.message.error(errorMessage, "Save Error");
                            })
                            .finally(function () {
                                vm.saving = false;
                                vm.loading = false;
                            });
                    })
                    .error(function (error) {
                        vm.loading = false;

                        var errorMessage = "An error occurred while reading the Excel file.";

                        if (error && error.message) {
                            errorMessage = error.message;
                        } else if (error && error.error && error.error.message) {
                            errorMessage = error.error.message;
                        }

                        abp.message.error(errorMessage, "Import Error");
                    });
            }

            // Helper function to close the modal
            vm.closeImportResultModal = function () {
                $('#importResultModal').modal('hide');
                vm.importResult = null;
            };
            /* function openUploadStockOpeningBalanceModal(fileName) {
 
                 vm.loading = false;
 
                 openingBalanceService.importFromExcelInventory(fileName).success(function (result) {
                     vm.stockOpeningBalance = result;
                 }).finally(function () {
                     openingBalanceService.createOrEditStockOpeningBalance(vm.stockOpeningBalance).success(function (data) {
                         initStockOpeningBalance();
                     }).finally(function () {
                         vm.saving = false;
                     });
                 });;
 
                *//* openingBalanceService.importFromExcelInventory(fileName)
         .success(function (result) {
             vm.data = result;

             vm.data.forEach(function (value) {
                 var isfind = false;

                 vm.stockOpeningBalance.voucherLines.forEach(function (item) {
                     if (!isfind) {
                         if (item.productId == value.productId) {
                             if (item.locationId == value.locationId) {
                                 item.quantity += value.quantity;
                                 item.credit += value.credit;
                                 item.debit += value.debit;
                                 item.description = value.description;
                                 isfind = true;
                                 //break;
                             }
                         }
                     }

                 });
                 if (!isfind) {
                     vm.stockOpeningBalance.voucherLines.push(value);
                 }
             });

         })
         .error(function (response) {
             abp.message.error(response.error);
         })
         .finally(function () {
             vm.importing = false;
             vm.loading = false;
         });*//*
};*/


            vm.addCustomerOpeningBalance = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addCustomerOpeningBalance.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.addCustomerOpeningBalance as vm',
                    //backdrop: 'static',
                    size: 'lg',

                });

                modalInstance.result.then(function () {
                    initCustomerOpeningBalance();
                });
            };


            vm.createOrEditCostCenterOpeningBalance = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addCostCenterOpeningBalances.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.addCostCenterOpeningBalances as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entryToEdit: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    initCostCenterOpeningBalance();
                });
            };


            vm.addCostCenterOpeningBalance = function () {
                vm.createOrEditCostCenterOpeningBalance(null);
            };

            vm.editCostCenterOpeningBalance = function (row) {
                vm.createOrEditCostCenterOpeningBalance(row.id);
            };


            vm.createOrEditAccountOpeningBalance = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addAccountOpeningBalances.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.addAccountOpeningBalances as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entryToEdit: function () {
                            return id;
                        }
                    }

                });

                modalInstance.result.then(function () {
                    initAccountOpeningBalance();
                });
            };

            vm.addAccountOpeningBalance = function () {
                vm.createOrEditAccountOpeningBalance(null);
            };

            vm.editAccountOpeningBalance = function (row) {
                vm.createOrEditAccountOpeningBalance(row.id);
            };

            vm.createOrEditStockOpeningBalance = function (stockId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addStockOpeningBalances.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.addStockOpeningBalances as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        stockId: function () {
                            return stockId;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    initStockOpeningBalance();
                });
            };

            vm.addStockOpeningBalance = function () {
                vm.createOrEditStockOpeningBalance(null);
            };

            vm.editStockOpeningBalance = function (row) {
                vm.createOrEditStockOpeningBalance(row.id);
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
            };


            vm.createAllocation = function (voucher) {
                openCreateAllocationModal(voucher.id);
            };

            vm.gridOptionsAccounts = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle aria-haspopup="true" aria-expanded="false">' +
                            '      <i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span>' +
                            '    </button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.editAccountOpeningBalance(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteAccountOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Account'),
                        field: 'accountDisplay'
                    },
                    {
                        name: app.localize('Debit'),
                        field: 'debit',
                        cellTemplate:
                            '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div></div>'
                    },
                    {
                        name: app.localize('Credit'),
                        field: 'credit',
                        cellTemplate:
                            '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div></div>'
                    }
                ],

                onRegisterApi: function (gridApi) {

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        initAccountOpeningBalance()
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        initAccountOpeningBalance();
                    });
                },
                data: []
            };


            vm.gridOptionsCostCenter = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle aria-haspopup="true" aria-expanded="false">' +
                            '      <i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span>' +
                            '    </button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.editCostCenterOpeningBalance(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteCostCenterOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Account'),
                        field: 'accountDisplay'
                    },
                    {
                        name: app.localize('Branch'),
                        field: 'locationName'

                    },
                    {
                        name: app.localize('CostCenterGroup1'),
                        field: 'costCenterName'
                    },
                    {
                        name: app.localize('CostCenterGroup2'),
                        field: 'costCenter2Name',
                        visible: vm.isCostCenter2Enabled
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description'
                    },
                    {
                        name: app.localize('Debit'),
                        field: 'debit',
                        cellTemplate:
                            '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div></div>'
                    },
                    {
                        name: app.localize('Credit'),
                        field: 'credit',
                        cellTemplate:
                            '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div></div>'
                    }
                ],

                onRegisterApi: function (gridApi) {

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        initCostCenterOpeningBalance()
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        initCostCenterOpeningBalance();
                    });
                },
                data: []
            };

            vm.gridOptionsStock = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle aria-haspopup="true" aria-expanded="false">' +
                            '      <i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span>' +
                            '    </button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.editStockOpeningBalance(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteStockOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Item'),
                        field: 'product',
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  <span ng-if="!row.entity.product.model || !row.entity.product.unitOfMeasureId">{{row.entity.product.itemNo}} {{row.entity.product.name}}</span>' +
                            '  <span ng-if="row.entity.product.model">{{row.entity.product.itemNo}} {{row.entity.product.name}} ({{row.entity.product.model.name}}, {{row.entity.product.model.make.name}})</span>' +
                            '  <span ng-if="row.entity.product.unitOfMeasureId">{{row.entity.product.itemNo}} {{row.entity.product.name}} ({{row.entity.product.unitOfMeasure.name}})</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Branch'),
                        field: 'locationName'
                    },
                    {
                        name: app.localize('Quantity'),
                        field: 'quantity'
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description'
                    },
                    {
                        name: app.localize('Debit'),
                        field: 'debit',
                        cellTemplate:
                            '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div></div>'
                    },
                    {
                        name: app.localize('Credit'),
                        field: 'credit',
                        cellTemplate:
                            '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div></div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        initStockOpeningBalance()
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        initStockOpeningBalance();
                    });
                },
                data: []
            };

            // initCostCenterOpeningBalance();

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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editCustomerOpeningBalance(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="row.entity.credit>0" ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteCustomerOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'contact.name',

                    },

                    {
                        name: app.localize('VoucherDate'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherDetail'),
                        field: 'notes',

                    },
                    {
                        name: app.localize('Agreement'),
                        field: 'agreement.agreementNo',
                    },
                    {
                        name: app.localize('Debit'),
                        field: 'debit',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Credit'),
                        field: 'credit',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div>' +
                            '</div>'

                    },


                ],
                onRegisterApi: function (gridApi) {

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        initCustomerOpeningBalance()
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        initCustomerOpeningBalance();
                    });
                },
                data: []
            };

            vm.editCustomerOpeningBalance = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/editCustomerOpeningBalance.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.editCustomerOpeningBalance as vm',
                    size: 'lg',
                    resolve: {
                        openingBalanceId: function () {
                            return row.id;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    initCustomerOpeningBalance();
                });
            };

            vm.deleteCustomerOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deleteCustomerOpeningBalance({
                                id: row.id
                            }).success(function () {
                                initCustomerOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.deleteCostCenterOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deleteOpeningBalanceEntry(row.id).success(function () {
                                initCostCenterOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.deleteAccountOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deleteOpeningBalanceEntry(row.id).success(function () {
                                initAccountOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.deleteStockOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deleteOpeningBalanceEntry(row.id).success(function () {
                                initStockOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.customerTabSelected = function () {

                initCustomerOpeningBalance();
            };

            // Supplier Opening Balance

            //GetCustomerOpeningBalancesForEdit        
            vm.searchSupplierOpeningBalance = function () {

                initSupplierOpeningBalance();
            };

            function initSupplierOpeningBalance() {
                vm.loading = true;
                openingBalanceService.getSupplierOpeningBalances(vm.filtersSupplier).success(function (data) {
                    vm.gridOptionsSupplier.totalItems = data.openingBalances.totalCount;
                    vm.gridOptionsSupplier.data = data.openingBalances.items;
                    vm.totalDebitSupplier = utilities.round(data.totalDebit, 2);
                    vm.totalCreditSupplier = utilities.round(data.totalCredit, 2);
                    vm.balanceSupplier = utilities.round(data.balance, 2);
                    if (vm.balanceSupplier != 0)
                        vm.balanceSupplier = vm.balanceSupplier > 0 ? "Dr " + vm.balanceSupplier : "Cr " + -(vm.balanceSupplier);
                    //vm.SupplierOpeningBalance = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.gridOptionsSupplier = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editSupplierOpeningBalance(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="row.entity.debit>0" ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteSupplierOpeningBalance(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'contact.name',

                    },

                    {
                        name: app.localize('VoucherDate'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherDetail'),
                        field: 'notes',

                    },
                    {
                        name: app.localize('Debit'),
                        field: 'debit',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Credit'),
                        field: 'credit',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div>' +
                            '</div>'
                    },


                ],
                onRegisterApi: function (gridApi) {

                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filtersSupplier.sorting = "";
                        } else {
                            vm.filtersSupplier.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        initSupplierOpeningBalance();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filtersSupplier.skipCount = (pageNumber - 1) * pageSize;
                        vm.filtersSupplier.maxResultCount = pageSize;

                        initSupplierOpeningBalance();
                    });
                },
                data: []
            };

            // Add SupplierOpeningBalance
            vm.addSupplierOpeningBalance = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/addSupplierOpeningBalance.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.addSupplierOpeningBalance as vm',
                    size: 'lg',
                });

                modalInstance.result.then(function () {
                    initSupplierOpeningBalance();
                });
            };

            vm.editSupplierOpeningBalance = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/editSupplierOpeningBalance.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.editSupplierOpeningBalance as vm',
                    size: 'lg',
                    resolve: {
                        openingBalanceId: function () {
                            return row.id;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    initSupplierOpeningBalance();
                });
            };

            vm.deleteSupplierOpeningBalance = function (row) {
                abp.message.confirm(
                    app.localize('AreYouSure', row),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            openingBalanceService.deleteSupplierOpeningBalance({
                                id: row.id
                            }).success(function () {
                                initSupplierOpeningBalance();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            // Importing Supplier From Excel
            // Import openingBalance Code
            vm.uploaderSupplier = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderSupplier.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openUploadSupplierOpeningBalanceModal(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploaderSupplier.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };


            vm.uploaderAccounts = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderAccounts.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    importFromExcelAccounts(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploaderAccounts.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };


            vm.uploaderCostCenter = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderCostCenter.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    importFromExcelCostCenter(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploaderCostCenter.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            vm.uploaderPrepaidOpening = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderPrepaidOpening.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openUploadPrepaidrOpeningBalanceModal(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };

            vm.uploaderPrepaidOpening.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            // search from dropdown
            vm.searchAccounts = function ($select) {
                //get leaf accounts only
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };
            vm.clearPrepaidAccount = function () {
                vm.filters.prepaidAccount = null;
                vm.filters.prepaidAccountId = null;
            };

            function openUploadPrepaidrOpeningBalanceModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/importPrepaidOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.importPrepaidOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    initPrepaidOpeningBalance();
                    vm.importing = false;
                });
            };


            function importFromExcelAccounts(fileName) {
                vm.loading = false;

                openingBalanceService.importFromExcelAccounts(fileName).success(function (result) {
                    vm.accountOpeningBalance = result;
                }).finally(function () {
                    openingBalanceService.createOrUpdateAccountOpeningBalance(vm.accountOpeningBalance).success(function (data) {
                        initAccountOpeningBalance();
                    }).finally(function () {
                        vm.saving = false;
                    });
                });;
            };
            function importFromExcelCostCenter(fileName) {
                vm.loading = false;

                openingBalanceService.importFromExcelCostCenter(fileName).success(function (result) {
                    vm.costCenterOpeningBalance = result;
                }).finally(function () {
                    openingBalanceService.createOrUpdateCostCenterOpeningBalance(vm.costCenterOpeningBalance).success(function (data) {
                        initCostCenterOpeningBalance();
                    }).finally(function () {
                        vm.saving = false;
                    });
                });;
            };
            function openUploadPrepaidrOpeningBalanceModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/importPrepaidOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.importPrepaidOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    // initSupplierOpeningBalance();
                    // vm.importing = false;
                });
            };
            function openUploadSupplierOpeningBalanceModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/importSupplierOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.importSupplierOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    initSupplierOpeningBalance();
                    vm.importing = false;
                });
            };

            vm.exportToExcel = function (filters) {

                vm.loading = true;
                if (filters.openingBalanceType == 'Customer' || filters.openingBalanceType == 'Supplier') {
                    openingBalanceService.exportToExcel(filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                            //File downloaded...
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                if (filters.openingBalanceType == 'Stock') {
                    openingBalanceService.exportToExcelStock(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                            //File downloaded...
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

                if (filters.openingBalanceType == 'Staff') {
                    openingBalanceService.exportToExcelStaff(filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                            //File downloaded...
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                if (filters.openingBalanceType == 'Accounts') {
                    openingBalanceService.exportToExcelAccounts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                            //File downloaded...
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                if (filters.openingBalanceType == 'CCWise') {
                    openingBalanceService.exportToExcelCostCenters(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                            //File downloaded...
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            };


            function getLocations() {

                commonLookupService.getLocations({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            function openUploadDepositOpeningBalanceModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/importDepositOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.importDepositOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    initDepositOpeningBalance();
                    // vm.importing = false;
                });
            };

            vm.uploaderDepositOpening = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderDepositOpening.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openUploadDepositOpeningBalanceModal(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };

            vm.uploaderDepositOpening.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            function openUploadAssetLoansModal(fileName, isVehicle) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/openingBalances/importAssetLoansModal.cshtml',
                    controller: 'tenant.views.crs.accounting.openingBalances.importAssetLoansModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },
                        isVehicle: function () {
                            return isVehicle;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    if (isVehicle)
                        initAssetLoans();
                    else
                        initOtherLoans();
                    vm.importing = false;
                });
                return modalInstance.result;
            };
            function resetFileInput() {
                var inputId = vm.isVehicle ? "vehicleLoanUploadInput" : "otherLoanUploadInput";
                var input = document.getElementById(inputId);
                if (input) {
                    input.value = null;
                }
            }

            vm.uploaderAssetLoans = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderAssetLoans.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;

                    openUploadAssetLoansModal(fileName, vm.isVehicle)
                        .finally(function () {
                            resetFileInput();
                        });
                }
                else {
                    abp.message.error(response.error.message);
                    resetFileInput();
                }
            };


            vm.uploaderAssetLoans.onErrorItem = function (fileItem, response, status, headers) {
                abp.message.error("Error in File Uploading");
                resetFileInput();
            };





        }
    ]);
