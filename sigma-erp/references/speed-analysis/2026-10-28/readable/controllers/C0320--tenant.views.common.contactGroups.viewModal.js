// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86664-86711
appModule.controller('tenant.views.common.contactGroups.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.contactGroup', 'contactGroupId', 'abp.services.app.costCenter',
        function ($scope, $uibModalInstance, contactGroupService, contactGroupId, costCenterService) {

            var vm = this;
            vm.saving = false;
            vm.contactGroup = null;
            vm.loading = false;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");

            function getContactType(type) {

                if (type == 2)
                    return 'Customer';
                else if (type == 3)
                    return 'Supplier';
                else if (type == 6)
                    return 'CorporateDriver';
                else if (type == 7)
                    return 'CompanyContact';
                return '';
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getCostCenters = function () {
                costCenterService.getCostCenters({}).success(function (data) {
                    vm.costCenters = data.items;
                });
            };

            function init() {
                vm.loading = true;
                contactGroupService.getContactGroupForEdit({
                    id: contactGroupId
                }).success(function (result) {
                    vm.contactGroup = result;
                    vm.contactGroup.contactTypeName = getContactType(vm.contactGroup.contactType);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
