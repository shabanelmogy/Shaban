// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:72608-72683
appModule.controller('tenant.views.hr.training.index', [
        '$scope', '$uibModal', 'abp.services.app.training',
        function ($scope, $uibModal, trainingService) {
            var vm = this;

            vm.permissions = {
                view: abp.auth.hasPermission('Page.HR.Training'),
                create: abp.auth.hasPermission('Page.HR.Training.Add'),
                edit: abp.auth.hasPermission('Page.HR.Training.Edit'),
                'delete': abp.auth.hasPermission('Page.HR.Training.Delete')
            };

            vm.filters = {
                title: ""
            };

            vm.trainings = [];

            vm.getTraining = function () {
                vm.loading = true;
                trainingService.getTraining(vm.filters).success(function (data) {
                    vm.trainings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getTraining();
            }

            vm.createTraining = function () {
                openCreateOrEditTrainingModal(null);
            };

            vm.updateTraining = function (trainingId) {
                openCreateOrEditTrainingModal(trainingId);
            };

            function openCreateOrEditTrainingModal(trainingId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/trainings/createOrEditModal.cshtml',
                    controller: 'host.views.hr.training.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        trainingId: function () {
                            return trainingId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTraining();
                });
            }

            vm.delete = function (training) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            trainingService.deleteTraining({
                                id: training.id
                            }).success(function () {
                                vm.getTraining();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            init();
        }
    ]);
