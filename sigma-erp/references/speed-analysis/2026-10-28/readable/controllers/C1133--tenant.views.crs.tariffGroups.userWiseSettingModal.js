// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298305-298362
appModule.controller('tenant.views.crs.tariffGroups.userWiseSettingModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.commonLookup', 'abp.services.app.locationTariffAdjustment', 'abp.services.app.user', 'abp.services.app.userWiseDiscount',
    function ($scope, $uibModalInstance, commonLookupService, locationTariffAdjustmentService, userService, userWiseDiscountService) {

        var vm = this;
        vm.saving = false;

        vm.assignedRoleNames = [];
        vm.userss = [];

        function locationTariffAdjustmentObject() {
            var line = new Object();
            line.locationId = null;
            line.adjustmentPercentage = '';
            vm.filterText = "";

            return line;
        }


        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };


        vm.save = function () {
            
            vm.saving = true;

            userWiseDiscountService.createOrUpdateUserWiseDiscount({

                UserDiscountAdjustment: vm.user,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });

        };

        vm.getUsers = function () {
            vm.loading = true;
            userWiseDiscountService.getUsers().success(function (result) {
                vm.user = result.items;
            }).finally(function () {
                vm.loading = false;
            });
        };
        function init() {
            vm.loading = true;
            vm.getUsers();
        }


        init();
    }
    ]);
