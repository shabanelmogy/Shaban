// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:457337-457525
appModule.controller('tenant.views.safetyCheckTemplates.createOrEditTemplateModal', [
        '$scope', '$uibModalInstance', '$uibModal', 'abp.services.app.safetyCheckTemplate', 'templateId',
        function ($scope, $uibModalInstance, $uibModal, safetyCheckTemplateService, templateId) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.safetyCheck = {
                templateJson: []
            };
            
            function init() {
                if (templateId) {
                    vm.loading = true;
                    safetyCheckTemplateService.getTemplateForEdit({ id: templateId })
                        .success(function (result) {
                            vm.safetyCheck = result;
                            vm.safetyCheck.templateJson = JSON.parse(result.template);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            };

            vm.save = function () {
                vm.loading = true;
                vm.saving = true;
                vm.safetyCheck.template = JSON.stringify(vm.safetyCheck.templateJson);
                safetyCheckTemplateService.createOrUpdateTemplate({ safetyCheck: vm.safetyCheck })
                    .success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });
            }

            vm.addSubGroup = function (item) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/createOrEditSubGroup.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createOrEditSubGroup as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return item;
                        },
                        isEdit: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.editSubGroup = function (item) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/createOrEditSubGroup.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createOrEditSubGroup as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return item;
                        },
                        isEdit: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.addGroupModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/createOrEditGroup.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createOrEditGroup as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return vm.safetyCheck.templateJson;
                        },
                        isEdit: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.editGroupModal = function (item) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/createOrEditGroup.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createOrEditGroup as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return item;
                        },
                        isEdit: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.addQuestion = function (item) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/createQuestion.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createQuestion as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.editQuestionModal = function (item, isView) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/editQuestionModal.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.editQuestionModal as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return item;
                        },
                        isView: function () {
                            return isView;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.changeOrderModal = function (items) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/changeOrderModal.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.changeOrderModal as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        items: function () {
                            return items;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //$scope.$apply();
                });
            }

            vm.deleteItem = function (item, items) {
                var index = items.indexOf(item);
                items.splice(index, 1);
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            init();

        }
    ]);
