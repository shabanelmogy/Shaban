// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:95481-95673
appModule.controller('tenant.views.common.hrm.accountLinking.index', [
        '$scope', 'abp.services.app.account', 'abp.services.app.linkedAccount', 'abp.services.app.linkedPrepaidExpense', 'utilities', 'abp.services.app.bankAccount', 'abp.services.app.chargesSetting', 'abp.services.app.contactGroup', '$filter', 'abp.services.app.itemType', 'abp.services.app.commonLookup',
        'abp.services.app.tenantSettings', 'abp.services.app.payrollAccountLinked', 'abp.services.app.businessUnit', 'abp.services.app.division',
        function ($scope, accountService, linkedAccountService, linkedPrepaidExpenseService, utilities, bankAccountService, chargesSettingService, contactGroupService, $filter, itemTypeService, commonLookupService,
            tenantSettingsService, payrollAccountLinkedService, businessUnitService, divisionService) {
            var vm = this;
            vm.loading = false;
            vm.isBusinessUnitEnabled = abp.features.isEnabled("HRM.Business.Unit");
            vm.isDivisionsEnabled = abp.features.isEnabled("Core.Divisions");
            vm.accountLinkingType = parseInt(abp.setting.get("App.Speed.Hrm.AccountLinkingType"));

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.billingMethodsLocationId = null;
            vm.defaultContactGroupStaff = null;
            vm.defaultContactGroupForStaff = null;
            vm.locations = [];
            vm.filters = {
                accountNo: '',
                bankName: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };
            vm.businessUnitId = null;
            vm.divisionId = null;
            vm.modifiedAccountRows = [];

            vm.searchAccounts = function ($select, accountCategory) {
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true, accountCategory: accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.addStaffContactGroupRow = function () {

                vm.linkAccounts.push({ account: null, contactGroup: vm.defaultContactGroupStaff, contactGroupId: vm.defaultContactGroupStaff.id });
            };

            vm.addStaffContactGroupRowForStaff = function () {

                vm.linkAccounts.push({ account: null, contactGroup: vm.defaultContactGroupForStaff, contactGroupId: vm.defaultContactGroupForStaff.id });
            };
            vm.removeStaffContactGroupRow = function (row) {
                var item = vm.linkAccounts.indexOf(row);
                vm.linkAccounts.splice(item, 1);
            };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                if (input == "OtherDeduction1")
                    return "Extra Deduction";

                return app.localize(input);
            };

            vm.removeRow = function (obj) {
                var index = vm.linkedPrepaidExpense.indexOf(obj);
                vm.linkedPrepaidExpense.splice(index, 1);
                linkedPrepaidExpenseService.DeleteLinkedPrepaidExpense(obj);

            };

            // Function to track changes
            vm.onAccountChange = function (row) {
                if (!vm.modifiedAccountRows.includes(row)) {
                    vm.modifiedAccountRows.push(row);
                }
            };

            // Get all accounts
            vm.getAllPayrollAccounts = () => {
                vm.loading = true;
                payrollAccountLinkedService.getPayrollLinkedAccountsForEdit(vm.businessUnitId, vm.divisionId)
                    .then((data) => {
                        if (data && data.data.items) {
                            vm.linkAccounts = data.data.items;
                        } else {
                            vm.linkAccounts = [];
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getPayrollAccounts = function () {
                vm.loading = true;

                payrollAccountLinkedService.createOrUpdatePayrollLinkedAccount({
                    BusinessUnitId: vm.businessUnitId,
                    DivisionId: vm.divisionId
                })
                    .then(() => {
                        vm.getAllPayrollAccounts();
                    })
                    .catch((error) => {
                        abp.notify.error('An error occurred: ' + (error.message || 'Please try again.'));
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            vm.save = function () {
                vm.saving = true;

                var rawData = vm.modifiedAccountRows.length > 0 ? vm.modifiedAccountRows : vm.linkAccounts;

                // Clean the data to avoid sending UI-related properties
                var dataToSend = rawData.map(function (row) {
                    return {
                        businessUnitId: row.businessUnitId,
                        divisionId: row.divisionId,
                        staffLedgerAccountId: row.staffLedgerAccountId,
                        expenseLedgerAccountId: row.expenseLedgerAccountId,
                        provisionLedgerAccountId: row.provisionLedgerAccountId,
                        salaryItemTypeId: row.salaryItemTypeId
                    };
                });

                payrollAccountLinkedService.createOrUpdatePayrollLinkedAccount({
                    PayrollAccountLinking: dataToSend,
                    BusinessUnitId: vm.businessUnitId,
                    DivisionId: vm.divisionId,
                })
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.getAllPayrollAccounts();
                    })
                    .finally(function () {
                        vm.saving = false;
                        vm.modifiedAccountRows = [];
                    });
            };

            vm.getAllBusinessUnits = () => {
                vm.loading = true;
                return businessUnitService.getBusinessUnits({})
                    .then(function (response) {
                        vm.businessUnits = response.data;
                        if (vm.businessUnits && vm.businessUnits.length > 0) {
                            vm.businessUnitId = vm.businessUnits[0].id;
                        }

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getAllDivisions = () => {
                vm.loading = true;
                return divisionService.getDivisions({})
                    .then(function (response) {
                        vm.divisions = response.data.items;
                        if (vm.divisions && vm.divisions.length > 0) {
                            vm.divisionId = vm.divisions[0].id;
                        }

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            function init() {
                if (vm.accountLinkingType === 2) {
                    if (vm.isBusinessUnitEnabled) {
                        vm.getAllBusinessUnits()
                            .then(() => {
                                vm.getPayrollAccounts();
                            });
                    }
                }
                else if (vm.accountLinkingType === 3) {
                    if (vm.isDivisionsEnabled) {

                        vm.getAllDivisions()
                            .then(() => {
                                vm.getPayrollAccounts();
                            });
                    }
                }
                else {
                    vm.getPayrollAccounts();
                }
            }

            init();
        }
    ]);
