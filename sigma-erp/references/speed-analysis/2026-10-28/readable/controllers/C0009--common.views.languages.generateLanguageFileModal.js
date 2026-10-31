// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:25349-25421
appModule.controller('common.views.languages.generateLanguageFileModal', [
        '$scope', 'abp.services.app.language', 'code', '$uibModalInstance',
        function ($scope, languageService, code, $uibModalInstance) {
            var vm = this;
            var totalCount = 0;
            vm.skipCount = 0;
            var successCount = 0;
            var fileGenerated = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.generate = function () {
                vm.localizedFile = '';
                successCount = 0;
                var functionCount = 0;
                var skipCount = vm.skipCount > 0 ? vm.skipCount - 100 : -100;
                if (vm.skipCount > 0) {
                    totalCount = vm.totalCount - Math.floor(vm.skipCount / 100);
                }
                vm.localizedFile = '<?xml version=' + '"1.0" ' + 'encoding=' + '"utf-8" ' + '?>';
                vm.localizedFile = vm.localizedFile + '\n';
                vm.localizedFile = vm.localizedFile + '<localizationDictionary culture=' + '"' + code + '"' + '>';
                vm.localizedFile = vm.localizedFile + '\n';
                vm.localizedFile = vm.localizedFile + '<texts>'
                vm.localizedFile = vm.localizedFile + '\n';
                for (count = 0; count < totalCount ; count++) {
                    vm.saving = true;
                    skipCount = skipCount + 100;
                    if (vm.totalStrings > skipCount) {
                        functionCount++;
                        languageService.generateLanguageFile({
                            code: code,
                            skipCount: skipCount,
                            maxResultCount: 100
                        }).success(function (result) {

                            vm.localizedFile = vm.localizedFile + result;
                            successCount++;
                            if (successCount == functionCount) {
                                vm.localizedFile = vm.localizedFile + '\n';
                                vm.localizedFile = vm.localizedFile + '</texts>';
                                vm.localizedFile = vm.localizedFile + '\n';
                                vm.localizedFile = vm.localizedFile + '</localizationDictionary>';
                                vm.saving = false;
                                abp.notify.info('Successfully Generated');
                            }

                        }).finally(function () {
                        });
                    }


                }

            };

            function init() {
                vm.loading = true;
                languageService.getLanguageTexts({
                    baseLanguageName: "en",
                    sourceName: "Speed",
                    targetLanguageName: "en",
                    targetValueFilter: "All",
                }).success(function (result) {
                    vm.totalCount = Math.ceil(result.totalCount / 100);
                    vm.totalStrings = result.totalCount;
                }).finally(function () {
                    vm.loading = false;
                })
            }
            init();
        }
    ]);
