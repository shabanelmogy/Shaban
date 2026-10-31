// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:496104-496151
appModule.controller('tenant.views.workshop.labourActivities.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.labourActivity', 'labourActivityId', 'utilities',
        function ($scope, $uibModalInstance, labourActivityService, labourActivityId, utilities) {

            var vm = this;
            vm.saving = false;
            vm.itemType = null;
            vm.loading = false;

            vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

            var jobType = abp.setting.get("App.Speed.Common.ShowSelectedJobTypes")
            vm.jobTypes = jobType ? angular.fromJson(jobType) : new Array();
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();

            vm.save = function () {
                
                vm.saving = true;
                labourActivityService.createOrUpdateLabourActivity({
                    labourActivity: vm.labourActivity
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
                labourActivityService.getLabourActivityForEdit({
                    id: labourActivityId
                }).success(function (result) {
                    vm.labourActivity = result;
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
