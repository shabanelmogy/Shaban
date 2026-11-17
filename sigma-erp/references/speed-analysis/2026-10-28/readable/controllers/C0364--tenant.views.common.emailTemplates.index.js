// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94829-94910
appModule.controller('tenant.views.common.emailTemplates.index', [
        '$scope', 'utilities', 'abp.services.app.emailTemplate', 'abp.services.app.tenantSettings', 'abp.services.app.designation',
        function ($scope, utilities, emailTemplateService, tenantSettingsService, designationService) {
            var vm = this;
            vm.isEmailSmtpMultiple = abp.features.isEnabled("CRS.CustomFeatures.MultipleEmailSmtp");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.emailTemplates = utilities.getEmailTemplates();
            vm.uploadTemplateInput = {
                key: null,
                template: ''
            };

            vm.getDesignations = designationService.getDesignations().then(function (result) {
                vm.designations = result.data.items;
            });

            vm.multipleEmailSendersSetting = tenantSettingsService.getMultipleEmailSendersAdvanceSetting()
                .then(function (result) {
                    vm.emailSenderCategory = result.data.map(function (email) {
                        return email.sender;
                    });
                });

            vm.emailTemplateChanged = function () {

                if (vm.selectedItem) {
                    vm.uploadTemplateInput.key = vm.selectedItem.key;
                    downloadFile();
                }
                else {
                    vm.uploadTemplateInput = {
                        key: null,
                        template: ''
                    };
                    $(".summernote").code(null);
                }

            };

            vm.loading = false;
            vm.upload = function () {

                vm.loading = true;
                var value = $("#htmlText").code();
                vm.uploadTemplateInput.template = value;
                var replaced1 = value.replace(/(<p)/g, '<div');
                var replaced2 = replaced1.replace(/(<\/p)/g, '</div');
                vm.uploadTemplateInput.template = replaced2;
                vm.uploadTemplateInput.key = vm.selectedItem.key;
                emailTemplateService.uploadEmailTemplate(vm.uploadTemplateInput).success(function () {

                }).success(function () {
                    vm.loading = false;
                });
            }

            var downloadFile = function () {
                vm.loading = true;
                vm.uploadTemplateInput.key = vm.selectedItem.key;
                emailTemplateService.downloadEmailTemplate({ id: vm.uploadTemplateInput.key }).success(function (result) {
                    if (result != null) {
                        vm.uploadTemplateInput = result;
                        $(".summernote").code(vm.uploadTemplateInput.template);
                    }
                    else {
                        vm.uploadTemplateInput.subject = null;
                        vm.uploadTemplateInput.emailCC = null;
                        vm.uploadTemplateInput.emailBCC = null;
                        $(".summernote").code(null);
                    }

                    vm.loading = false;
                })
            }

            //downloadFile();
        }
    ]);
