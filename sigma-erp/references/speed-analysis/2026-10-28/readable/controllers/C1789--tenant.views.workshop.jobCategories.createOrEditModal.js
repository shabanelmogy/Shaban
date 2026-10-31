// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:488069-488116
appModule.controller('tenant.views.workshop.jobCategories.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.jobCategory', 'jobCategoryId', 'utilities',
        function ($scope, $uibModalInstance, jobCategoryService, jobCategoryId, utilities) {

            var vm = this;
            vm.saving = false;
            vm.itemType = null;
            vm.loading = false;

            vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

           /* var jobType = abp.setting.get("App.Speed.Common.ShowSelectedJobTypes")
            vm.jobTypes = jobType ? angular.fromJson(jobType) : new Array();
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();*/

            vm.save = function () {
                
                vm.saving = true;
                jobCategoryService.createOrUpdateJobCategory({
                    jobCategory: vm.jobCategory
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
                jobCategoryService.getJobCategoryForEdit({
                    id: jobCategoryId
                }).success(function (result) {
                    vm.jobCategory = result;
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
