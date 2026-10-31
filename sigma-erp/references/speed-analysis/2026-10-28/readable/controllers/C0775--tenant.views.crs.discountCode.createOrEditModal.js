// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:201825-201915
appModule.controller('tenant.views.crs.discountCode.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.discountAuthCode', 'abp.services.app.commonLookup', 'discountCodeId', 'abp.services.app.user', 'abp.services.app.userWiseDiscount', 'appSession',
        function ($scope, $uibModalInstance, discountCodeService, commonLookUp, discountCodeId, userService, userWiseDiscountService, appSession) {

            var vm = this;
            vm.branchWiseUserDiscount = abp.features.isEnabled("CRS.UserWiseDiscount.BranchWiseUserDiscount");
            vm.saving = false;
            vm.discountCode = null;
            vm.isEditMod = false;
            vm.discountForVehicleTypes = abp.features.isEnabled("CRS.CustomFeatures.DiscountForVehicleType");
            vm.vehicleTypes = null;
            vm.isCodeDisabledDefaut = true;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.validHours =
                [
                    1, 2, 3

                ];

            vm.validityType =
            {
                "Hours": 1,
                "Days": 2
            }

            vm.save = function () {
                vm.saving = true;
                vm.discountCode.createdForUserId = vm.discountCode.createdForUser ? vm.discountCode.createdForUser.id : null;
                if (vm.validForDays && !vm.discountCode.validForHours)
                    vm.discountCode.validForHours = vm.validForDays * 24;
                if (vm.discountForVehicleTypes) {
                    if (vm.discountCode.excludedVehicleTypes) {
                        
                        vm.discountCode.excludedVehicleTypes = vm.discountCode.excludedVehicleTypes.map(function (type) {
                            return type.id;
                        }).join(',');
                    }
                }
                discountCodeService.createOrUpdateDiscountCode({
                    discountCode: vm.discountCode
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            function getTariffGroups() {

                commonLookUp.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };

            vm.preventfloat = function ($event) {
                if ($event.which == '46' || $event.which == '190')
                    event.preventDefault();
            };

            vm.searchUsers = function ($select) {

                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            function init() {
                vm.loading = true;
                getTariffGroups();
                debugger;
                discountCodeService.getDiscountAuthCodeForEdit({ id: discountCodeId }).success(function (data) {
                    vm.discountCode = data;
                    vm.discountCode.usesLimit = 1;
                }).finally(function () {
                    vm.loading = false;
                });

                if (vm.branchWiseUserDiscount) {
                    return userWiseDiscountService.getBranchWiseUserDiscount({ locationId: appSession.user.locationId, userId: appSession.user.id }).then(function (response) {
                        vm.discountCode.discountAllowed = response.data;
                    });
                }
            }
            init();
        }
    ]);
