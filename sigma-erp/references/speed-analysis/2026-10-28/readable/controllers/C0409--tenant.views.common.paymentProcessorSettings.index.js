// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:102633-102722
appModule.controller('tenant.views.common.paymentProcessorSettings.index', [
        '$scope', 'abp.services.app.paymentProcessorSetting',
        function ($scope, paymentProcessorSettingService ) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            vm.paymentProcessor = abp.features.getValue("Core.PaymentProcessorType");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //NETWORK INTERNATIONAL Setting
            vm.settingsObject = [{
                key: "API_KEY",
                value: null
            },
                {
                    key: "Outlet_Reference",
                    value: null
                },
                {
                    key: "Token_Url",
                    value: null
                },
                {
                    key: "Base_Url",
                    value: null
                }];

            vm.permissions = {
                edit: abp.auth.hasPermission('Pages.Administration.Tenant.Settings.PaymentProcessorSettings.Edit'),
                view: abp.auth.hasPermission('Pages.Administration.Tenant.Settings.PaymentProcessorSettings.View')
            };

            vm.getPaymentProcessorSettings = function () {
                vm.loading = true;
                paymentProcessorSettingService.getPaymentProcessorSetting()
                    .success(function (result) {
                        vm.paymentProcessorSetting = result;
                        vm.getPaymentProcessor();
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.savePaymentProcessorSetting = function () {
                vm.loading = true;
                vm.saving = true;
                paymentProcessorSettingService.updatePaymentProcessSetting(vm.paymentProcessorSetting)
                    .success(function () {
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                        abp.notify.success(app.localize('SavedSuccessfully'));

                    });
                vm.getPaymentProcessorSettings();

            }

            vm.getPaymentProcessor = function () {
                if (vm.paymentProcessor == "NetworkInternational") {
                    vm.paymentProcessorSetting.paymentProcessorType = 11;
                    vm.paymentProcessorType = app.localize('NetworkInternational');
                    if (vm.paymentProcessorSetting.settings.length == 0)
                        vm.addpaymentprocessorsettings();
                }
            };

           
            vm.addpaymentprocessorsettings = function () {
                if (vm.paymentProcessor == "NetworkInternational") {
                    console.log(vm.settingsObject);
                    vm.paymentProcessorSetting.settings=vm.settingsObject;
                    console.log(vm.paymentProcessorSettings);
                }
            }

            function init() {
                vm.getPaymentProcessorSettings();
            }



            init();
        }
    ]);
