// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:63341-63446
appModule.controller('host.views.crm.deals.createOrEditDealModal', [
        '$scope', '$uibModalInstance', 'dealId', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.deal', 'abp.services.app.tenant', 'abp.services.app.user',
        function ($scope, $uibModalInstance, dealId, directoryService, commonLookupService, dealService, tenantService, userService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.closedDeal = false;
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
            vm.dealStages = [
                { id: 1, name: 'New' },
                { id: 2, name: 'Average' },
                { id: 3, name: 'Hot' },
                { id: 4, name: 'Final' }
            ];

            vm.subscriptionTypes = [
                { id: 1, name: 'Yearly' },
                { id: 2, name: 'Monthly ' }
            ];

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;
                if (!vm.isEditMod)
                    vm.deal.nextFollowupDate = moment().startOf('day').utc();
                dealService.createOrUpdateDeal({
                    deal: vm.deal,
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
            function getEditions() {
                vm.loading = true;
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                }).finally(function () {
                    vm.loading = false;
                });

            }
            function init() {
                vm.loading = true;
                dealService.getDealForEdit({
                    id: dealId
                }).success(function (result) {
                    getEditions();
                    vm.deal = result;
                    vm.closedDeal = vm.deal.status == 2 ? true : false;
                    if (vm.deal.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                        vm.deal.value = null;
                        vm.deal.setupValue = null;
                        vm.deal.probability = null;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
