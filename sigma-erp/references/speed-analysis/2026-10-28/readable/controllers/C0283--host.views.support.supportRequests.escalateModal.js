// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81813-81892
appModule.controller('host.views.support.supportRequests.escalateModal', [
        '$scope', 'SupportRequest', '$uibModalInstance', 'abp.services.app.hostSettings', 'abp.services.app.user', 'abp.services.app.supportRequestHost',
        function ($scope, supportRequest, $uibModalInstance, hostSettingsService, userService, supportRequestService) {
            var vm = this;

            vm.supportRequest = {};
            vm.settings = [];
            vm.users = [];

            vm.getSettings = function () {

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
          /*  vm.getUser = function (selectedTier) {
                 selectedTier = parseInt(selectedTier)
                userService.getHostUserAccounts()
                    .success(function (r) {
                        var users = r.items;
                        var tus = abp.setting.get('App.UserManagement.TierUsers');
                        if (tus) {
                            var tierUsers = JSON.parse(tus).filter(x => x.Tier === selectedTier);

                            if (tierUsers.length === 0)
                                abp.message.error('Users for Tier ' + selectedTier + ' are not defined in settings.');
                                var tierUserIds = tierUsers[0].UserIds;
                                for (var i = 0; i < tierUserIds.length; i++) {
                                    let u = users.find(x => x.userId === tierUserIds[i]);
                                    if (u) vm.users.push(u);
                            }
                        }
                    });
            };
*/
            vm.getUsersByTier = function (tier) {
                return vm.settings.userManagement.tierUsers.filter(x => x.tier === tier)[0];
            };

            function init() {

                vm.supportRequest.id = supportRequest.id;
                vm.supportRequest.reqNo = supportRequest.reqNo;
                vm.supportRequest.requestNo = supportRequest.requestNo;
                vm.originalTier = supportRequest.tier;
                vm.supportRequest.tier = null;
                vm.supportRequest.isBug = supportRequest.isBug;
            }

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.save = function () {
                vm.saving = true;
                vm.supportRequest.assignedToUserId = vm.supportRequest.escalatedToUserId;
                supportRequestService.escalateTier(vm.supportRequest)
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
