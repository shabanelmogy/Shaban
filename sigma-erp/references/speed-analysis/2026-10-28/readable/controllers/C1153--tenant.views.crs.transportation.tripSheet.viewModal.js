// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:301293-301319
appModule.controller('tenant.views.crs.transportation.tripSheet.viewModal', [
        '$uibModal', '$uibModalInstance', 'options', 'abp.services.app.transTrip',
        function ($uibModal, $uibModalInstance, options, transTripService) {
            var vm = this;
            vm.loading = false;

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                transTripService.getTransTrip({ id: options.transTripId }).success(function (data) {
                    vm.transTrip = data;
                    //vm.transTrip.agreementNo = options.agreement.agreementNo
                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
