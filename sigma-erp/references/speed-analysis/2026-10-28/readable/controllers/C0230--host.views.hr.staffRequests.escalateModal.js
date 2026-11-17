// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:72006-72078
appModule.controller('host.views.hr.staffRequests.escalateModal', [
        '$scope', 'SupportRequest', '$uibModalInstance', 'abp.services.app.hostSettings', 'abp.services.app.user', 'abp.services.app.staffRequest',
        function ($scope, supportRequest, $uibModalInstance, hostSettingsService, userService, staffRequestService) {
            var vm = this;

            vm.supportRequest = supportRequest;
            vm.settings = [];
            vm.users = [];

           
            

            vm.getStaffRequestUsersByTier = function (tier) {

                let r = vm.settings.userManagement.staffRequestTierUsers.filter(x => x.tier === tier);
                if (r.length > 0) return r[0];
                else return { tier: tier, userIds: [] };
            };
            vm.searchUser = function (keyword) {
                userService.getAllUsers({})
                    .success(function (r) {
                        let users = r.items;

                        var tierUserIds = vm.getStaffRequestUsersByTier(vm.supportRequest.tier+1).userIds;
                        if (!tierUserIds.length === 0)
                            abp.message.error('Users for Tier ' + (vm.supportRequest.tier + 1) + ' are not defined in settings.');

                        console.log(tierUserIds);
                        for (var i = 0; i < tierUserIds.length; i++) {
                            let u = users.find(x => x.id === tierUserIds[i]);
                            console.log(u);
                            if (u) vm.users.push(u);

                        }


                    });
            };
            function init() {
                vm.loading = true;

                hostSettingsService.getTierUsers()
                    .success(function (result) {
                        vm.settings = result;
                        vm.searchUser();

                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            

            

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.save = function () {
                vm.saving = true;
                staffRequestService.escalateToNextTier(vm.supportRequest)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            init();
        }
    ]);
