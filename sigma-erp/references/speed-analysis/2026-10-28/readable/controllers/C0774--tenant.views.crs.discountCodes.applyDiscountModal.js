// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:201751-201822
appModule.controller('tenant.views.crs.discountCodes.applyDiscountModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.userWiseDiscount', 'options', 'appSession', '$uibModal', 'utilities',
        function ($scope, $uibModalInstance, userWiseDiscountService, options, appSession, $uibModal, utilities) {

            var vm = this;
            vm.saving = false;
            vm.isDiscountFromQuotation = options.isDiscountFromQuotation;
            vm.agreementVehicleTypeId = options.vehicleTypeId;
            vm.excludedVehicleTypesList = [];
            vm.discountForVehicleTypes = abp.features.isEnabled("CRS.CustomFeatures.DiscountForVehicleType");
            vm.branchWiseUserDiscount = abp.features.isEnabled("CRS.UserWiseDiscount.BranchWiseUserDiscount");
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
                vm.chargesRow.discountPercent = parseFloat(((vm.chargesRow.rate - vm.chargesRow.discountedRate) * (100 / vm.chargesRow.rate)).toFixed(6));
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
                    if (vm.discountForVehicleTypes) {
                        if (vm.discountAuthCode.excludedVehicleTypes) {
                            vm.excludedVehicleTypesList = vm.discountAuthCode.excludedVehicleTypes.split(',');
                            vm.isPresent = vm.excludedVehicleTypesList.includes(vm.agreementVehicleTypeId.toString());
                            if (vm.isPresent) {
                                abp.message.error("Selected discount code can't be applied to this vehicle type.")
                            }
                        }
                    }
                    vm.maxDiscountPercent = result.maxDiscountPercent;
                });
            };

            function init() {
                vm.chargesRow = angular.copy(options.chargesRow);
                vm.discountAuthCode = options.discountAuthCode;
                if (vm.discountAuthCode != null)
                    vm.maxDiscountPercent = vm.discountAuthCode.maxDiscountPercent;
                else if (vm.branchWiseUserDiscount)
                    vm.getBranchWiseDiscount();
                else
                    vm.maxDiscountPercent = appSession.user.maxDiscountPercent;
            }
            vm.getBranchWiseDiscount = function () {
                return userWiseDiscountService.getBranchWiseUserDiscount({ locationId: appSession.user.locationId, userId: appSession.user.id }).then(function (response) {
                    vm.maxDiscountPercent = response.data;
                });
            }
            vm.applyDiscount = function () {
                $uibModalInstance.close({ discountAuthCode: vm.discountAuthCode, chargesRow: vm.chargesRow });
            };

            init();
        }
    ]);
