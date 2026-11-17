// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:248478-248526
appModule.controller('tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'chargesType', 'viewMode', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, chargesType, viewMode, utilities) {

            var vm = this;
            var unchangedCalcDetail = angular.copy(chargesType.calcDetail);
            vm.calcDetail = chargesType.calcDetail;
            vm.viewMode = viewMode;

            vm.rounding = function (amount) {
                return utilities.round(parseFloat(amount) || 0, 2);
            };

            vm.calculateTotalFare = function () {
                vm.total = 0.0;

                angular.forEach(vm.calcDetail, function (item) {
                    item.unit = vm.rounding(item.unit);
                    item.rate = vm.rounding(item.rate);
                    item.charges = vm.rounding(item.charges);

                    vm.total += item.charges;
                });

                vm.total = vm.rounding(vm.total);
            };

            vm.calculateChargesPerRow = function (row) {
                row.unit = vm.rounding(row.unit);
                row.rate = vm.rounding(row.rate);

                row.charges = vm.rounding(row.unit * row.rate);

                vm.calculateTotalFare();
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.cancel = function () {
                chargesType.calcDetail = unchangedCalcDetail;
                $uibModalInstance.dismiss();
            };
            vm.save = function () {
                $uibModalInstance.close(chargesType);
            }
            vm.calculateTotalFare();
        }
    ]);
