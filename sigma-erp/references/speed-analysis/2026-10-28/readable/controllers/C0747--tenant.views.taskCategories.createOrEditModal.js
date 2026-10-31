// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:194649-194697
appModule.controller('tenant.views.taskCategories.createOrEditModal', ['$uibModal', '$timeout', '$scope', '$uibModalInstance', 'abp.services.app.cRMCampaign', 'categoryId', 'editFlag', 'viewFlag',
        function ($uibModal, $timeout, $scope, $uibModalInstance, taskCategoryService, categoryId, editFlag, viewFlag) {
            var vm = this;
            vm.categoryId = categoryId || null;
            vm.editFlag = editFlag || false;
            vm.viewFlag = viewFlag || false;
            vm.category = {
                id: null,
                name: null,
                description: null,
                isActive: true
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                if (vm.categoryId) {
                    taskCategoryService.updateCategory(vm.category).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    taskCategoryService.createCategory(vm.category).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            function init() {
                if (vm.categoryId) {
                    vm.loading = true;
                    taskCategoryService.getCategoryForEdit(vm.categoryId).success(function (data) {
                        vm.category = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }
    ]);
