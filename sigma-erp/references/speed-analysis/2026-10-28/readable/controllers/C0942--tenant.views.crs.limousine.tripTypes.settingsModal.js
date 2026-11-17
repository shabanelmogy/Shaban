// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255281-255362
appModule.controller('tenant.views.crs.limousine.tripTypes.settingsModal', [
        '$scope', '$filter', '$uibModalInstance', 'abp.services.app.tripType', 'abp.services.app.chargesSetting', 'tripType',
        function ($scope, $filter, $uibModalInstance, tripTypeService, chargesSettingService, tripType) {

            var vm = this;
            vm.saving = false;

            vm.baseRateTypeSelected = function () {
                if (vm.tripType.baseSetting.rateTypes == null) return;

                var foundRateTypes = $filter('filter')(vm.tripType.baseSetting.rateTypes, {
                    id: 10 // per extra hour
                }, true);

                if (foundRateTypes.length > 0) {
                    vm.tripType.baseSetting.inputTimeLimit = true;
                } else {
                    vm.tripType.baseSetting.inputTimeLimit = false;
                }

            };

            vm.corporateRateTypeSelected = function () {
                if (vm.tripType.corporateSetting.rateTypes == null) return;

                var foundRateTypes = $filter('filter')(vm.tripType.corporateSetting.rateTypes, {
                    id: 10 // per extra hour
                }, true);

                if (foundRateTypes.length > 0) {
                    vm.tripType.corporateSetting.inputTimeLimit = true;
                } else {
                    vm.tripType.corporateSetting.inputTimeLimit = false;
                }

            };


            vm.save = function () {
                vm.saving = true;
                vm.tripType.id = tripType.id;
                tripTypeService.updateTripTypeSetting({
                    setting: vm.tripType,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getRateTypes() {
                vm.loading = true;
                chargesSettingService.getRateTypes().success(function (data) {
                    vm.rateTypes = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getSetting() {
                vm.loading = true;

                tripTypeService.getTripTypeSettingForEdit({ id: tripType.id }).success(function (data) {
                    vm.tripType = data;
                }).finally(function () {
                    vm.loading = false;
                });;
            }

            function init() {
                getRateTypes();
                getSetting();
            }

            init();
        }
    ]);
