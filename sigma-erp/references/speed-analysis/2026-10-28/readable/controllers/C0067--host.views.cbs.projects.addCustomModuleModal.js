// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36864-36905
appModule.controller('host.views.cbs.projects.addCustomModuleModal', [
    '$uibModalInstance', 'isFromCustomModule', 'existingModule', 'esistingGapPoint', 'isEdit',
    function ($uibModalInstance, isFromCustomModule, existingModule, esistingGapPoint, isEdit) {
        var vm = this;
        vm.saving = false;
        vm.isFromCustomModule = isFromCustomModule;
        vm.existingModule = existingModule;
        vm.esistingGapPoint = esistingGapPoint;
        vm.isEdit = isEdit;

        vm.module = vm.existingModule || {
            moduleId: null,
            name: '',
            detail: ''
        };

        vm.gapPoint = vm.esistingGapPoint || {
            taskId: null,
            description: '',
            scope: '',
            estimatedHours: 0.0
        };

        vm.saveModule = function () {
            vm.saving = true;
            $uibModalInstance.close(vm.module);
            //abp.notify.info(app.localize('SavedSuccessfully'));
            vm.saving = false;
        };
     
        vm.saveGapPoint = function () {
            vm.saving = true;
            $uibModalInstance.close(vm.gapPoint);
            //abp.notify.info(app.localize('SavedSuccessfully'));
            vm.saving = false;
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);
