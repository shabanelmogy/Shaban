// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71895-72003
appModule.controller('host.views.hr.staffRequests.editModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staffRequest', 'abp.services.app.user', 'staffRequestId', 'abp.services.app.hostSettings',
        function ($scope, $uibModalInstance, staffRequestService, userService, staffRequestId, hostSettingsService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = true;
            vm.users = [];
            vm.settings;
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

            vm.save = function () {
                vm.saving = true;
                
                staffRequestService.updateStaffRequest(
                     vm.supportRequest

                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.getStaffRequestUsersByTier = function (tier) {
                
                let r = vm.settings.userManagement.staffRequestTierUsers.filter(x => x.tier === tier);
                if (r.length > 0) return r[0];
                else return { tier: tier, userIds: [] };
            };
            vm.searchUser = function (keyword) {
                userService.getAllUsers({})
                    .success(function (r) {
                        let users = r.items;
                        
                        var tierUserIds = vm.getStaffRequestUsersByTier(vm.supportRequest.tier).userIds;
                        if (!tierUserIds.length===0)
                            abp.message.error('Users for Tier ' + (vm.supportRequest.tier) + ' are not defined in settings.');

                        console.log(tierUserIds);
                        for (var i = 0; i < tierUserIds.length; i++) {
                            let u = users.find(x => x.id === tierUserIds[i]);
                            console.log(u);
                            if (u) vm.users.push(u);

                        }
                        

                    });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.types = [
                { id: 1, name: 'Hardware' },
                { id: 2, name: 'Admin' },
                { id: 3, name: 'Hr' },
                { id: 4, name: 'Other' },
                { id: 5, name: 'Suggestion' },
            ];
            function init() {
                vm.loading = true;

                staffRequestService.getStaffRequestForEdit(
                     staffRequestId
                ).success(function (result) {
                    vm.supportRequest = result;
                    vm.isEditMod = true;
                    hostSettingsService.getTierUsers()
                        .success(function (result) {
                            vm.settings = result;
                            vm.searchUser();

                        }).finally(function () {
                            vm.loading = false;
                        });

                  

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
