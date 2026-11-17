// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298398-298439
appModule.controller('tenant.views.crs.tariffLocations.createOrEditModal', ['$scope', 'tariffLocationId', '$uibModalInstance', 'abp.services.app.tariffLocation',
    function ($scope, tariffLocationId, $uibModalInstance, tariffLocationService)
    {
        var vm = this;
        vm.saving = false;


        vm.cancel = function ()
        {
            $uibModalInstance.dismiss();
        }

       




        vm.save = function () {
            vm.saving = true;
            tariffLocationService.createOrUpdateTariffLocation({
                tariffLocation: vm.tariffLocation,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        function init() {
            tariffLocationService.getTariffLocationForEdit({
                id: tariffLocationId
            }).success(function (result) {
                vm.tariffLocation = result;
            });
        }

        init();

       
       
    }]);
