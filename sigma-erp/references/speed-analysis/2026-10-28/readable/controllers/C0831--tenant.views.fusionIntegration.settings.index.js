// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223827-223878
appModule.controller('tenant.views.fusionIntegration.settings.index', [
        '$scope', 'abp.services.app.fusionIntegration',
        function ($scope, fusionIntegrationService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.configuration = {
            }

            function getallsettings() {
                vm.loading = true;
                fusionIntegrationService.getAllSettings().success(function (result) {
                    vm.settings = result;
                    if (vm.settings && vm.settings.configuration) {
                        vm.configuration = vm.settings.configuration;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
                vm.settings.dataToShare = 7;
                vm.settings.sharingFormat = 0;
                vm.settings.isActive = 1;
                vm.configuration.postingStartDate = moment(vm.configuration.postingStartDate).startOf('day');
                vm.settings.configuration = vm.configuration;
                fusionIntegrationService.updateAllSettings(vm.settings).success(function (result) {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getallsettings();
                }).finally(function () {
                    vm.saving = false;
                })
            }

            function init() {
                getallsettings();
            }


            init();
        }
    ]);
