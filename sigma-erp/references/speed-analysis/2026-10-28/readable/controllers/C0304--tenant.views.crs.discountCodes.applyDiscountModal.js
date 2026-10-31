// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85080-85134
appModule.controller('tenant.views.crs.discountCodes.applyDiscountModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.userWiseDiscount', 'options', 'appSession', '$uibModal', 'utilities',
    function ($scope, $uibModalInstance, userWiseDiscountService, options, appSession, $uibModal, utilities) {

        var vm = this;
        vm.saving = false;
        vm.isDiscountFromQuotation = options.isDiscountFromQuotation;

        //vm.cancel = function () {
        //    $uibModalInstance.dismiss();
        //};

        vm.calculateDiscountedRate = function () {
            if (vm.chargesRow == null) return 0;
            vm.chargesRow.discountedRate = utilities.round(parseFloat(vm.chargesRow.rate - (vm.chargesRow.rate * (vm.chargesRow.discountPercent / 100))), 2);
            return vm.chargesRow.discountedRate;
        };

        vm.calculateDiscountedPercentage = function () {
            if (vm.chargesRow == null) return 0;
            vm.chargesRow.discountPercent = utilities.round(parseFloat(((vm.chargesRow.rate - vm.chargesRow.discountedRate) * (100 / vm.chargesRow.rate))), 6);
            vm.chargesRow.discountPercent = vm.chargesRow.discountPercent < 0 ? 0 : vm.chargesRow.discountPercent;
        };

        vm.verifyAuthCode = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/discountCodes/verifyAuthCodeModal.cshtml',
                controller: 'tenant.views.crs.discountCodes.verifyAuthCodeModal as vm',
                backdrop: 'static',
                size: 'sm'
            });
            modalInstance.result.then(function (result) {

                vm.discountAuthCode = result;
                vm.maxDiscountPercent = result.maxDiscountPercent;
            });
        };

        function init() {
            vm.chargesRow = angular.copy(options.chargesRow);
            vm.discountAuthCode = options.discountAuthCode;

            if (vm.discountAuthCode != null)
                vm.maxDiscountPercent = vm.discountAuthCode.maxDiscountPercent;
            else
                vm.maxDiscountPercent = appSession.user.maxDiscountPercent;
        }

        vm.applyDiscount = function () {
            $uibModalInstance.close({ discountAuthCode: vm.discountAuthCode, chargesRow: vm.chargesRow });
        };

        init();
    }
    ]);
