// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94258-94292
appModule.controller('tenant.views.common.dataTranslator.dataTranslatorModal', [
        '$scope', '$uibModalInstance', 'options', 'abp.services.app.dataTranslation',
        function ($scope, $uibModalInstance, options, dataTranslationService) {
            var vm = this;
            vm.saving = false;

            vm.translations = options.translations;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.loading = true;
                var translations = [];
                angular.forEach(vm.translations, function (value, key) {
                    if (value.modified) {
                        translations.push(value);
                    }
                });
                if (translations.length > 0) {
                    dataTranslationService.saveDataTranslations(translations).success(function () {
                        abp.notify.success(app.localize('SuccessfullySaved'));
                    }).finally(function () {
                        vm.loading = false;
                        $uibModalInstance.close();
                    });
                }
                else {
                    vm.loading = false;
                    $uibModalInstance.close();
                }
            }
        }
    ]);
