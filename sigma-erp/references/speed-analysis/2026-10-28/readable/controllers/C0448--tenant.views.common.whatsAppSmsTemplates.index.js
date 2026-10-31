// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115699-115748
appModule.controller('tenant.views.common.whatsAppSmsTemplates.index', [
        '$scope', 'utilities', 'abp.services.app.smsTemplate',
        function ($scope, utilities, smsTemplateService) {
            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.smsTemplates = utilities.getWhatsAppSmsTemplates();
            vm.uploadTemplateInput = {
                key: null,
                template: ''
            };
            vm.smsTemplateChanged = function () {
                if (vm.selectedItem) {
                    vm.uploadTemplateInput.key = vm.selectedItem.key;
                    downloadFile();
                }
                else
                {
                    vm.uploadTemplateInput = {
                        key: null,
                        template: ''
                    };
                }
            };
            vm.loading = false;
            vm.upload = function () {
                vm.loading = true;
                console.log(vm.uploadTemplateInput);
                smsTemplateService.uploadSMSTemplate(vm.uploadTemplateInput).success(function () {
                }).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                  //  $uibModalInstance.close();
                });
            }
            var downloadFile = function () {
                vm.loading = true;
                smsTemplateService.downloadSMSTemplate({ id: vm.uploadTemplateInput.key }).success(function (result) {
                    if (result !== null) {
                        vm.uploadTemplateInput = result;
                    }
                    else {
                        vm.uploadTemplateInput.template = null;
                    }
                    vm.loading = false;
                })
            }
        }
    ]);
