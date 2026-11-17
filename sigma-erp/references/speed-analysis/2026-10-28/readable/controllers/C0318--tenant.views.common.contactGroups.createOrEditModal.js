// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86433-86501
appModule.controller('tenant.views.common.contactGroups.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.contactGroup', 'contactGroupId', 'contactType', 'abp.services.app.costCenter', 'utilities',
        function ($scope, $uibModalInstance, contactGroupService, contactGroupId, contactType, costCenterService, utilities) {

            var vm = this;
            vm.saving = false;
            vm.contactGroup = null;
            vm.loading = false;
            vm.isInsuranceDateRequired = utilities.parseBoolean(abp.setting.get("App.Speed.Common.InsuranceDates"));
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");

            vm.contactTypes = [
                { id: 1, name: 'Staff' },
                { id: 2, name: 'Customer' },
                { id: 3, name: 'Supplier' },
                { id: 6, name: 'CorporateDriver' },
                { id: 7, name: 'CompanyContact' }
            ];
           function getContactType (type) {

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
            vm.save = function () {
                vm.saving = true;
                contactGroupService.createOrUpdateContactGroup({
                    contactGroup: vm.contactGroup,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.getCostCenters = function () {
                costCenterService.getCostCenters({}).success(function (data) {
                    vm.costCenters = data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                contactGroupService.getContactGroupForEdit({
                    id: contactGroupId
                }).success(function (result) {
                    vm.contactGroup = result;
                    if (!contactGroupId > 0)
                        vm.contactGroup.contactType = contactType;
                    vm.contactGroup.contactTypeName = getContactType(vm.contactGroup.contactType);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
