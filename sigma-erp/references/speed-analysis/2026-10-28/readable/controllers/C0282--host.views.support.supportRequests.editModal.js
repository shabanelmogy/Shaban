// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81701-81810
appModule.controller('host.views.support.supportRequests.editModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.supportRequestHost','abp.services.app.customerCareTenant', 'abp.services.app.user', 'supportRequestId', 'abp.services.app.hostSettings',
        function ($scope, $uibModalInstance, supportRequestHostService, customerCareTenantService, userService, supportRequestId, hostSettingsService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = true;
            vm.users = [];

            vm.statuses = [
                { id: 1, name: "Open" },
                { id: 2, name: "Closed" }
            ];

            //vm.priorities = [
            //        { id: 1, name: "Low" },
            //        { id: 2, name: "Medium" },
            //        { id: 3, name: "High" }
            //];

            vm.priorities = [
                { id: 1, name: "Normal" },
                { id: 3, name: "High" }
            ];

            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };

            vm.getFilteredUsers = function (searchText) {
                if (!searchText || searchText.length < 1) {
                    return [];
                }
                return vm.users.filter(function (user) {
                    return user.user.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
                });
            };

            vm.save = function () {
                vm.saving = true;
                debugger
                
                customerCareTenantService.updateSupportRequest({
                    supportRequest: vm.supportRequest,

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
            vm.getTieredUsersList = function (searchText, tier) {
                if (!searchText || searchText.length < 1) {
                    return [];
                }
                var keywordTierObj = {
                    keyword: searchText,
                    tier: tier
                }
                userService.getUserByKeywordAndTier(keywordTierObj)
                    .success(function (result) {
                        vm.users = result.items;
                    });

                return vm.users || [];  // Pehle se loaded users return karo
            };
            function init() {
                vm.loading = true;

                supportRequestHostService.getSupportRequestForEdit({
                    id: supportRequestId
                }).success(function (result) {
                    vm.supportRequest = result;
                    vm.isEditMod = true;

                  /*  userService.getHostUserAccounts({})
                        .then(function (response) {
                            debugger

                            let users = response.data.items;
                            var ids = abp.setting.get('App.UserManagement.TierUsers');

                            if (!ids)
                                abp.message.error('Users for Tier ' + (vm.supportRequest.tier + 1) + ' are not defined in settings.');

                            var tierUsers = JSON.parse(ids).filter(x => x.Tier === vm.supportRequest.tier);
                            var tierUserIds = tierUsers[0].UserIds;
                            for (var i = 0; i < tierUserIds.length; i++) {
                                let u = users.find(x => x.userId === tierUserIds[i]);
                                if (u) vm.users.push(u);
                            }
                        });*/

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
