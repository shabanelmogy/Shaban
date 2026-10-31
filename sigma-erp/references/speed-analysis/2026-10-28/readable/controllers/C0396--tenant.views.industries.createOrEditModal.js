// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101193-101229
appModule.controller('tenant.views.industries.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.industry','industryId', 
        function ($scope, $uibModalInstance, industryService, industryId) {

            var vm = this;
            vm.saving = false;
            

            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.save = function () {
                vm.saving = true;
                vm.industry.tenantId = abp.session.tenantId;
                industryService.createOrUpdateIndustry({
                    industry: vm.industry,
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
                industryService.getIndustryForEdit({
                    id: industryId
                }).success(function (result) {
                    vm.industry = result;
                });
            }

            init();
        }
    ]);
