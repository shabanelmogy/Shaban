// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86145-86171
appModule.controller('tenant.views.common.bookingEngineSource.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bookingEngineSource', 'bookingSourceId', 'utilities',
        function ($scope, $uibModalInstance, bookingEngineService, bookingSourceId, utilities) {

            var vm = this;
            vm.saving = false;
            vm.bookingEngineSource = null;
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                bookingEngineService.getBookingEngineSourceForEdit({
                    id: bookingSourceId
                }).success(function (result) {
                    vm.bookingEngineSource = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
