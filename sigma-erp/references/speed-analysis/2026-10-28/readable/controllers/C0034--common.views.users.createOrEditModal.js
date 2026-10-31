// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:28798-28962
appModule.controller('common.views.users.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.user', 'userId', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'appSession', 'utilities',
        function ($scope, $uibModalInstance, userService, userId, directoryService, commonLookupService, appSession, utilities) {
            var vm = this;

            vm.branches = [];
            vm.saving = false;
            vm.user = null;
            vm.profilePictureId = null;
            vm.roles = [];
            vm.setRandomPassword = false; //(userId == null);
            vm.sendActivationEmail = false; //(userId == null);
            vm.canChangeUserName = true;
            vm.isTenantSide = appSession.tenant ? true : false;
            vm.filters = {
                contactId: null,
            };
            vm.save = function () {

                vm.user.branchIds = [];
                if (vm.user.branchAccess == 2) {
                    vm.branches.forEach(function(branch) {
                        vm.user.branchIds.push(branch.id);
                    });
                }

                let haveBranchInBranches = false;
                vm.user.branchIds.forEach(function (branchId) {
                    if (branchId == vm.user.locationId) {
                        haveBranchInBranches = true;
                    }
                });

                if (haveBranchInBranches || vm.user.branchAccess != 2) {

                    var assignedRoleNames = _.map(
                        _.where(vm.roles, { isAssigned: true }), //Filter assigned roles
                        function(role) {
                            return role.roleName; //Get names
                        });

                    if (vm.setRandomPassword) {
                        vm.user.password = null;
                    }

                    vm.saving = true;

                    if (vm.user.contact) {
                        vm.user.contactId = vm.user.contact.id;
                    }
                    if (vm.locations && vm.locations.length == 1)
                        vm.user.locationId = vm.locations[0].id;
                    userService.createOrUpdateUser({
                        user: vm.user,
                        assignedRoleNames: assignedRoleNames,
                        sendActivationEmail: vm.sendActivationEmail
                    }).success(function() {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function() {
                        vm.saving = false;
                    });
                } else {
                    abp.message.error("Current Branch can be one of selective branches.", "Validation Error")
                }
            };

            vm.passwordValidation = function () {
                if (vm.isEditMod == false) {
                    vm.checkEnterPassword = utilities.checkPassword(vm.user.userName, vm.user.password);
                }
                if (vm.isEditMod) {
                    if (vm.user.password.length > 0) {
                        vm.checkEnterPassword = utilities.checkPassword(vm.user.userName, vm.user.password);
                    }
                    else {
                        vm.checkEnterPassword = { valid: true, message: '' };
                        vm.user.passwordRepeat = '';
                        vm.user.password = '';
                    }
                    
                }
                
            }


            vm.branchAccessChanged = function () {
                if (vm.user.branchAccess == 2) {
                    vm.showBranches = true;
                } else {
                    vm.showBranches = false;
                }
            }

            vm.searchLocation = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.getLocationsForSearch({ keyword: $select.search }).then(function (response) {
                    vm.locationForMultiSelect = response.data.items;
                });
            }
            var showOnlyStaff = abp.setting.get("App.Speed.Common.ShowOnlyStaff");
            vm.contactType = showOnlyStaff == 'true' ? 1 : null;
            vm.searchContacts = function ($select) {
                return directoryService.search({
                    keyword: $select.search,
                    contactType: vm.contactType
                }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getAssignedRoleCount = function () {
                return _.where(vm.roles, { isAssigned: true }).length;
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function init() {
                if (vm.isTenantSide)
                    getLocations();
                //getContacts();
                userService.getUserForEdit({
                    id: userId
                }).success(function (result) {
                    vm.user = result.user;
                    vm.profilePictureId = result.profilePictureId;
                    vm.user.passwordRepeat = vm.user.password;
                    vm.roles = result.roles;
                    vm.canChangeUserName = vm.user.userName != app.consts.userManagement.defaultAdminUserName;

                    vm.user.shouldChangePasswordOnNextLogin = false;

                    if (vm.user.id > 0) {
                        vm.user.branchIds = [];
                        result.user.branches.forEach(function (branch) {
                            let selectBranch = vm.locations.filter(function (location) {
                                return location.id == branch.locationId;
                            })[0];
                            vm.user.branchIds.push(branch.locationId);
                            vm.branches.push(selectBranch);
                        });
                        vm.isEditMod = true;
                        vm.checkEnterPassword = { valid: true, message: '' };
                        if (vm.user.branchAccess == 2) {
                            vm.showBranches = true;
                        } else {
                            vm.showBranches = false;
                        }
                        vm.user.branches = [];
                    } else {
                        vm.isEditMod = false;
                    }
                });
            }

            init();
        }
    ]);
