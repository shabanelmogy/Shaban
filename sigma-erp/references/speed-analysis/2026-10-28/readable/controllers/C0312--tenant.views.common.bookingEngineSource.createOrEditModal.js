// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85957-85996
appModule.controller('tenant.views.common.bookingEngineSource.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bookingEngineSource', 'bookingId', 'bookingEngineSource', 'utilities',
        function ($scope, $uibModalInstance, bookingEngineService, bookingId, bookingEngineSource, utilities) {

            var vm = this;
            vm.saving = false;
            vm.bookingEngineSource = null;
            vm.loading = false;
            vm.isEditMode = false;

            vm.save = function () {
                vm.saving = true;
                bookingEngineService.createOrUpdateBookingEngineSource({
                    bookingEngineSource: vm.bookingEngineSource,
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

            function init() {
                vm.loading = true;
                bookingEngineService.getBookingEngineSourceForEdit({
                    id: bookingId
                }).success(function (result) {
                    vm.bookingEngineSource = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
