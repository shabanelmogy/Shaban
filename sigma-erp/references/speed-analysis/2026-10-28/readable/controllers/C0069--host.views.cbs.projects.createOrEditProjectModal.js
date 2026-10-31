// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36959-37168
appModule.controller('host.views.cbs.projects.createOrEditProjectModal', [
        '$scope', '$uibModalInstance', 'projectId', 'abp.services.app.directory', 'abp.services.app.project', 'abp.services.app.tenant', 'abp.services.app.user', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModalInstance, projectId, directoryService, projectService, tenantService, userService, utilities, businessDivisionService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.isEditMode = false;
            vm.teamMembers = [];
            vm.additionalTenants = [];
            vm.tenantMembers = [];
            vm.userItems = [];
            vm.userItemsCust = [];
            vm.projectManager = null;
            vm.businessName = utilities.divisionName();
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getProjectStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
                if (status == 3)
                    return 'On Hold';
                if (status == 4)
                    return 'Cancelled';
            };
            vm.getProjectTypes = function (status) {
                if (!status || status==0)
                    return 'Not Set';
                if (status == 1)
                    return 'Domestic';
                if (status == 2)
                    return 'International';
                if (status == 3)
                    return 'Internal';
                
            };
            vm.projectStatuses = [
                { id: 1, name: "Open" },
                { id: 2, name: "Closed" },
                { id: 3, name: "On Hold" },
                { id: 4, name: "Cancelled" }
            ];
            vm.divisions = [
                { id: 1, name: "ERP" },
                { id: 2, name: "RPA" },
                { id: 3, name: "Mobility" }
            ];

            vm.projectTypes = [
                
                { id: 1, name: "Domestic" },
                { id: 2, name: "International" },
                { id: 3, name: "Internal" }
            ];
            vm.categories = [
                
                { id: 1, name: "Retail" },
                { id: 2, name: "Corporate" }
            ];

            vm.projectPriorities = [
                { id: 1, name: "Green" },
                { id: 2, name: "Yellow" },
                { id: 3, name: "Red" },
                { id: 4, name: "Grey" }
            ];

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            }
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            vm.getTenantUsersMethod = function (id) {
                userService.getTenantUserAccounts({ id: id }).then(function (response) {
                    vm.userItemsCust = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.project.teamMembers = vm.teamMembers;
                vm.project.tenantMembers = vm.tenantMembers.map(function (member) {
                    return {
                        id: member.id,
                        projectId: member.projectId,
                        fullName: member.fullName,
                        emailAddress: member.emailAddress
                        
                    };
                });
                vm.additionalTenantIds = [];
                if (vm.additionalTenants) {
                    angular.forEach(vm.additionalTenants, function (value) {
                        vm.additionalTenantIds.push(value.id);
                    });
                }
                console.log('Saving project:', vm.project);
                console.log('Tenant Members:', vm.tenantMembers);
                console.log('Team Members:', vm.teamMembers);
                projectService.createOrUpdateProject({
                    project: vm.project,
                    additionalTenantIds: vm.additionalTenantIds
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

            vm.removeTeamRow = function (row) {
                var index = vm.teamMembers.indexOf(row);
                vm.teamMembers.splice(index, 1);
            };
            vm.removeCustTeamRow = function (row) {
                var index = vm.tenantMembers.indexOf(row);
                vm.tenantMembers.splice(index, 1);
            };

            vm.addTeamRow = function () {
                vm.teamMembers.push(
                    {
                        item: null,
                        fullName: null,
                        email: null,
                        isTenantMember: false
                    });
            };

            vm.addCustTeamRow = function () {
                vm.tenantMembers.push(
                    {
                        fullName: null,
                        emailAddress: null
                    });
            };

            function init() {
                vm.loading = true;
                projectService.getProjectForEdit({
                    id: projectId
                }).success(function (result) {
                    vm.project = result;
                    if (vm.project.id > 0) {
                        vm.isEditMode = true;
                        vm.teamMembers = result.teamMembers;
                        vm.tenantMembers = result.tenantMembers;
                        vm.additionalTenants = result.additionalTenants;
                        vm.projectManager = result.projectManager;
                        vm.associateConsultant = result.associateConsultant;

                        if (result.tenantId != null) {
                            userService.getTenantUserAccounts({ id: result.tenantId }).then(function (response) {
                                vm.userItemsCust = response.data.items;
                            });
                        }

                    } else {
                        vm.isEditMode = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });

                
            }
            vm.searchUserItems = function ($select) {
                if ($select.search == "")
                    return null;
                //userService.searchUsers({ keyword: $select.search }).then(function (response) {
                //    vm.users = response.data.items;
                //});
                userService.getHostUserAccountsByKeyword({ keyword: $select.search }).then(function (response) {
                    vm.userItems = response.data.items;
                });
            }
            vm.getbusinessDivisions();
            init();
        }
    ]);
