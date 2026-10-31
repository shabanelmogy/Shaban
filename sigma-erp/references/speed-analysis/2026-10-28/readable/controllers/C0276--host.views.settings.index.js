// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80798-81210
appModule.controller('host.views.settings.index', [
        '$scope', '$uibModal', 'appSession', 'abp.services.app.hostSettings', 'abp.services.app.user', 'abp.services.app.commonLookup', 'uiGridConstants', 'abp.services.app.organizationUnit',
        function ($scope, $uibModal, appSession, hostSettingsService, userService, commonLookupService, uiGridConstants, orginizationUnitService)
        {
            var vm = this;

            $scope.$on('$viewContentLoaded', function ()
            {
                App.initAjax();
            });

            vm.loading = false;
            vm.settings = {};
            vm.settings.smsProviderSettings = [];
            vm.editions = [];
            vm.testEmailAddress = appSession.user.emailAddress;

            vm.users = [];
            vm.unSelectedUsers = [];
            vm.tier1Users = [];
            vm.tier2Users = [];
            vm.tier3Users = [];
            vm.staffRequestUsers = [];
            vm.unSelectedStaffRequestUsers = [];
            vm.staffRequestTier1Users = [];
            vm.staffRequestTier2Users = [];
            vm.staffRequestTier3Users = [];

            vm.allTeams = [];
            vm.selectedTeams = [];

            function initAllTeamArray(callback)
            {
                orginizationUnitService.getOrganizationUnits()
                    .success((r) =>
                    {
                        vm.allTeams = r.items;
                    }).finally(callback);
            }

            vm.searchTeamsResults = [];
            vm.searchTeams = function ($select)
            {
                if ($select.search == "")
                    return [];
                vm.searchTeamsResults = vm.allTeams.filter(x => x.displayName.toUpperCase().startsWith($select.search.toUpperCase()));
            };

            vm.getSettings = function ()
            {
                vm.loading = true;
                initAllTeamArray(() =>
                {
                    hostSettingsService.getAllSettings()
                        .success(function (result)
                        {
                            vm.settings = result;

                            if (vm.settings.userManagement.teamIdsForTasksAssignment) {
                                vm.selectedTeams = vm.allTeams.filter(x => vm.settings.userManagement.teamIdsForTasksAssignment.filter(y => y == x.id).length > 0);
                            }

                            vm.searchUser();

                        }).finally(function ()
                        {
                            vm.loading = false;
                        });
                });
            };

            vm.getUsersByTier = function (tier)
            {
                let r = vm.settings.userManagement.tierUsers.filter(x => x.tier === tier);
                if (r.length > 0) return r[0];
                else return { tier: tier, userIds: [] };
            };
            vm.getStaffRequestUsersByTier = function (tier)
            {
                let r = vm.settings.userManagement.staffRequestTierUsers.filter(x => x.tier === tier);
                if (r.length > 0) return r[0];
                else return { tier: tier, userIds: [] };
            };
            vm.searchUser = function (keyword)
            {
                userService.getAllUsers({})
                    .success(function (r)
                    {
                        vm.users = r.items;

                        if (vm.settings.userManagement.tierUsers) {
                            var tier1UserIds = vm.getUsersByTier(1).userIds;
                            tier1UserIds.forEach(function (tier1UserId)
                            {
                                var user = vm.users.filter(x => x.id === tier1UserId)[0];
                                vm.tier1Users.push(user);
                            });

                            var tier2UserIds = vm.getUsersByTier(2).userIds;
                            tier2UserIds.forEach(function (tier2UserId)
                            {
                                var user = vm.users.filter(x => x.id === tier2UserId)[0];
                                vm.tier2Users.push(user);
                            });

                            var tier3UserIds = vm.getUsersByTier(3).userIds;
                            tier3UserIds.forEach(function (tier3UserId)
                            {
                                var user = vm.users.filter(x => x.id === tier3UserId)[0];
                                vm.tier3Users.push(user);
                            });
                        }
                        if (vm.settings.userManagement.staffRequestTierUsers) {
                            var staffRequestTier1UserIds = vm.getStaffRequestUsersByTier(1).userIds;
                            staffRequestTier1UserIds.forEach(function (tier1UserId)
                            {
                                var user = vm.users.filter(x => x.id === tier1UserId)[0];
                                vm.staffRequestTier1Users.push(user);
                            });

                            var staffRequestTier2UserIds = vm.getStaffRequestUsersByTier(2).userIds;
                            staffRequestTier2UserIds.forEach(function (tier2UserId)
                            {
                                var user = vm.users.filter(x => x.id === tier2UserId)[0];
                                vm.staffRequestTier2Users.push(user);
                            });

                            var staffRequestTier3UserIds = vm.getStaffRequestUsersByTier(3).userIds;
                            staffRequestTier3UserIds.forEach(function (tier3UserId)
                            {
                                var user = vm.users.filter(x => x.id === tier3UserId)[0];
                                vm.staffRequestTier3Users.push(user);
                            });


                        }

                        //Marketing & Sales Manager
                        if (vm.settings.userManagement.salesManagerUserId) {
                            vm.settings.userManagement.salesManagerUser = vm.users.find(x => x.id == vm.settings.userManagement.salesManagerUserId);
                            console.log(vm.settings.userManagement.salesManagerUser);
                        }
                        if (vm.settings.userManagement.marketingManagerUserId) {
                            vm.settings.userManagement.marketingManagerUser = vm.users.find(x => x.id == vm.settings.userManagement.marketingManagerUserId);
                            console.log(vm.settings.userManagement.marketingManagerUser);
                        }

                        vm.getUnSelectedUsers();
                        vm.getStaffRequestUnSelectedUsers();

                    });
            };

            vm.searchUsers = function ($select)
            {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response)
                {
                    vm.users = response.data.items;
                });
            };

            vm.getUnSelectedUsers = function ()
            {
                userService.getAllUsers({})
                    .success(function (r)
                    {
                        vm.unSelectedUsers = r.items;

                        vm.tier1Users.forEach(function (tier1User)
                        {
                            for (var i = 0; i <= vm.unSelectedUsers.length; i++) {
                                if (vm.unSelectedUsers[i].id === tier1User.id) {
                                    vm.unSelectedUsers.splice(i, 1);
                                    break;
                                }
                            }
                        });
                        vm.tier2Users.forEach(function (tier2User)
                        {
                            for (var i = 0; i <= vm.unSelectedUsers.length; i++) {
                                if (vm.unSelectedUsers[i].id === tier2User.id) {
                                    vm.unSelectedUsers.splice(i, 1);
                                    break;
                                }
                            }
                        });
                        vm.tier3Users.forEach(function (tier3User)
                        {
                            for (var i = 0; i <= vm.unSelectedUsers.length; i++) {
                                if (vm.unSelectedUsers[i].id === tier3User.id) {
                                    vm.unSelectedUsers.splice(i, 1);
                                    break;
                                }
                            }
                        });






                    });
            };
            vm.getStaffRequestUnSelectedUsers = function ()
            {
                userService.getAllUsers({})
                    .success(function (r)
                    {

                        vm.unSelectedStaffRequestUsers = r.items;



                        vm.staffRequestTier1Users.forEach(function (tier1User)
                        {
                            for (var i = 0; i <= vm.unSelectedStaffRequestUsers.length; i++) {
                                if (vm.unSelectedStaffRequestUsers[i].id === tier1User.id) {
                                    vm.unSelectedStaffRequestUsers.splice(i, 1);
                                    break;
                                }
                            }
                        });
                        vm.staffRequestTier2Users.forEach(function (tier2User)
                        {
                            for (var i = 0; i <= vm.unSelectedStaffRequestUsers.length; i++) {
                                if (vm.unSelectedStaffRequestUsers[i].id === tier2User.id) {
                                    vm.unSelectedStaffRequestUsers.splice(i, 1);
                                    break;
                                }
                            }
                        });
                        vm.staffRequestTier3Users.forEach(function (tier3User)
                        {
                            for (var i = 0; i <= vm.unSelectedStaffRequestUsers.length; i++) {
                                if (vm.unSelectedStaffRequestUsers[i].id === tier3User.id) {
                                    vm.unSelectedStaffRequestUsers.splice(i, 1);
                                    break;
                                }
                            }
                        });



                    });
            };

            vm.saveAll = function ()
            {
                vm.saving = true;

                // push newly created setting
                if (vm.settings.newSmsProviderSetting) {
                    smsProviderSettings.push(vm.settings.newSmsProviderSetting);
                }

                var tier1UserIds = [];
                vm.tier1Users.forEach(function (tier1User)
                {
                    tier1UserIds.push(tier1User.id);
                });

                var tier2UserIds = [];
                vm.tier2Users.forEach(function (tier2User)
                {
                    tier2UserIds.push(tier2User.id);
                });

                var tier3UserIds = [];
                vm.tier3Users.forEach(function (tier3User)
                {
                    tier3UserIds.push(tier3User.id);
                });

                vm.settings.userManagement.tierUsers = [
                    { 'tier': 1, 'userIds': tier1UserIds },
                    { 'tier': 2, 'userIds': tier2UserIds },
                    { 'tier': 3, 'userIds': tier3UserIds }
                ];
                var staffRequestTier1UserIds = [];
                vm.staffRequestTier1Users.forEach(function (tier1User)
                {
                    staffRequestTier1UserIds.push(tier1User.id);
                });

                var staffRequestTier2UserIds = [];
                vm.staffRequestTier2Users.forEach(function (tier1User)
                {
                    staffRequestTier2UserIds.push(tier1User.id);
                });

                var staffRequestTier3UserIds = [];
                vm.staffRequestTier3Users.forEach(function (tier1User)
                {
                    staffRequestTier3UserIds.push(tier1User.id);
                });

                vm.settings.userManagement.teamIdsForTasksAssignment = vm.selectedTeams.map(x => x.id);

                vm.settings.userManagement.staffRequestTierUsers = [
                    { 'tier': 1, 'userIds': staffRequestTier1UserIds },
                    { 'tier': 2, 'userIds': staffRequestTier2UserIds },
                    { 'tier': 3, 'userIds': staffRequestTier3UserIds }
                ];
                if (vm.settings.billing.invoicingStartDate != null) {
                    vm.settings.billing.invoicingStartDate = moment(vm.settings.billing.invoicingStartDate).startOf('day');
                }
                hostSettingsService.updateAllSettings(
                    vm.settings
                ).success(function ()
                {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function ()
                {
                    vm.saving = false;
                });
            };

            vm.sendTestEmail = function ()
            {
                hostSettingsService.sendTestEmail({
                    emailAddress: vm.testEmailAddress
                }).success(function ()
                {
                    abp.notify.info(app.localize('TestEmailSentSuccessfully'));
                });
            };

            vm.getEditionValue = function (item)
            {
                if (item.value) {
                    return parseInt(item.value);
                }
                return item.value;
            };

            vm.getEditions = function ()
            {
                commonLookupService.getEditionsForCombobox({}).success(function (result)
                {
                    vm.editions = result.items;
                    vm.editions.unshift({ value: null, displayText: app.localize('NotAssigned') });
                });
            };

            vm.init = function ()
            {
                vm.getEditions();
                vm.getSettings();
            };

            vm.init();

            vm.getSmsProviderSettings = function ()
            {

                vm.loading = true;
                hostSettingsService.getSmsProviderSettings({
                }).success(function (result)
                {
                    vm.SmsProvidersSettings = result.items;
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };
            vm.getWhatsAppSettings = function ()
            {
                vm.loading = true;
                hostSettingsService.getWhatsAppSettings({
                }).success(function (result)
                {
                    vm.whatsAppSettings = result.items;
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };

            vm.createSmsproviderSetting = function ()
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/settings/SmsProviderSettings/createModal.cshtml',
                    controller: 'host.views.settings.smsProviderSettings.createModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result)
                {
                    vm.getSmsProviderSettings();
                });
            };
            vm.createWhatsAppSetting = function ()
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/settings/SmsProviderSettings/whatsAppCreateModal.cshtml',
                    controller: 'host.views.settings.smsProviderSettings.whatsAppCreateModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result)
                {
                    vm.getWhatsAppSettings();
                });
            };

            vm.cancel = function ()
            {
                $uibModalInstance.dismiss();
            };
        }
    ]);
