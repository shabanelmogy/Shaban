// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:297747-297814
appModule.controller('tenant.views.crs.tariffGroups.branchWiseUserSettingModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.commonLookup', 'abp.services.app.user', 'abp.services.app.userWiseDiscount',
        function ($scope, $uibModalInstance, commonLookupService, userService, userWiseDiscountService) {

            var vm = this;
            vm.saving = false;
            vm.saved = false;
            vm.assignedRoleNames = [];
            vm.userss = [];
            vm.locations = [];
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.locationId = vm.locations[0].id;
                    vm.locationChange();
                    vm.getUsers();

                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.save = function () {
                save();
            };

            vm.saveAndClose = function () {
                save();
                $uibModalInstance.close();
            }

            function save() {
                vm.saving = true;
                userWiseDiscountService.createOrUpdateBranchWiseUserDiscount({
                    userDiscounts: vm.user,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });

            }

            vm.getUsers = function () {
                vm.loading = true;
                vm.locationId = vm.locationId ? vm.locationId : vm.locations[0].id;

                userWiseDiscountService.getUsersByLocationId({ id: vm.locationId }).success(function (result) {
                    vm.user = result.branchWiseDiscountUsers;
                    vm.saved = result.saved;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.locationChange = function () {
                vm.getUsers();
            }
            function init() {
                vm.loading = true;
                getLocations();
            }
            init();
        }
    ]);
