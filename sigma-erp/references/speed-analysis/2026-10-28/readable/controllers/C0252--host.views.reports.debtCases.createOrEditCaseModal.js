// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76726-76833
appModule.controller('host.views.reports.debtCases.createOrEditCaseModal', [
        '$scope', '$uibModalInstance', 'caseId', 'abp.services.app.directory', 'abp.services.app.case', 'abp.services.app.tenant', 'abp.services.app.user', 'utilities',
        function ($scope, $uibModalInstance, caseId, directoryService, caseService, tenantService, userService, utilities) {
            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.isEditMode = false;
            vm.userItems = [];
            vm.userItemsCust = [];

            vm.paymentDelayTypes = {
                Warning: 1,
                SlowDownService: 2,
                StopService: 3
            };

            vm.getCaseStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
            };
            vm.caseLabelColour = [
                { id: 1, name: "Grey" },
                { id: 2, name: "Red" },
                { id: 3, name: "Yellow" },
                { id: 4, name: "Green" }
            ];
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
            }
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenantsWithCompany({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.getTenantUsersMethod = function (id) {
                userService.getTenantUserAccounts({ id: id }).then(function (response) {
                    vm.userItemsCust = response.data.items;
                });
                vm.case.companyId = vm.case.tenant.contact.id;
            };
            vm.save = function () {
                vm.saving = true;

                // Ensure paymentDelayType is set properly when saving
                if (!vm.case.isPaymentDelay) {
                    vm.case.paymentDelayType = null;
                } else if (!vm.case.paymentDelayType) {
                    // Default to Warning (1) if nothing is selected but isPaymentDelay is true
                    vm.case.paymentDelayType = vm.paymentDelayTypes.Warning;
                }

                // Make sure paymentDelayType is sent as a number
                if (vm.case.paymentDelayType) {
                    vm.case.paymentDelayType = parseInt(vm.case.paymentDelayType);
                }

                caseService.createOrUpdateCase({
                    case: vm.case,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.loading = true;
                caseService.getCaseForEdit({
                    id: caseId
                }).success(function (result) {
                    vm.case = result;

                    // Ensure paymentDelayType is properly initialized as a number if it exists
                    if (vm.case.paymentDelayType !== null && vm.case.paymentDelayType !== undefined) {
                        vm.case.paymentDelayType = parseInt(vm.case.paymentDelayType);
                    }

                    if (vm.case.id > 0) {
                        vm.isEditMode = true;
                    } else {
                        vm.isEditMode = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
