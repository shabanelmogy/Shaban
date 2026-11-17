// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255122-255153
appModule.controller('tenant.views.crs.limousine.tripTypes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'tripTypeId', 'abp.services.app.tripType',
        function ($scope, $uibModalInstance, tripTypeId,tripTypeService) {

            var vm = this;
            vm.saving = false;
            vm.tripType = null;
           // vm.tripType = tripType;
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
           
            vm.save = function () {
                vm.saving = true;
                tripTypeService.createOrUpdateTripType({ tripType: vm.tripType }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                tripTypeService.getTripTypeForEdit({ id: tripTypeId }).success(function (data) {
                    vm.tripType = data;
                });
            }


            init();
        }
    ]);
