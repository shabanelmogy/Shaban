// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:72562-72605
appModule.controller('host.views.hr.training.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.training', 'trainingId',
        function ($scope, $uibModalInstance, trainingService, trainingId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Page.HR.Training'),
                create: abp.auth.hasPermission('Page.HR.Training.Add'),
                edit: abp.auth.hasPermission('Page.HR.Training.Edit'),
                'delete': abp.auth.hasPermission('Page.HR.Training.Delete'),
            };

            vm.training = null;

            function init() {
                trainingService.getTrainingForEdit({ id: trainingId })
                    .success(function (r) {
                        vm.training = r;
                    });

                if (trainingId) vm.isEditMod = true;
            }

            vm.save = function () {
                vm.saving = true;
                trainingService.createOrUpdateTraining({ training: vm.training })
                    .success(function (r) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            init();
        }
    ]);
