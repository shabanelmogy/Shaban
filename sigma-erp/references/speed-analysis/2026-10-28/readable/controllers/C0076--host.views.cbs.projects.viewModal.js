// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:38739-38793
appModule.controller('host.views.cbs.projects.viewModal', [
        '$uibModalInstance', 'projectId', 'abp.services.app.project',
        function ($uibModalInstance, projectId, projectService) {
            var vm = this;
            vm.teamMembers = [];
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
                if (status == 5)
                    return 'Completed';
            };
            vm.getProjectType = function (type) {
                if (!type || type == 0)
                    return 'Not Set';
                if (type == 1)
                    return 'Domestic';
                if (type == 2)
                    return 'International';
                if (type == 3)
                    return 'Internal';

            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            
            function init() {
                vm.loading = true;
                projectService.getProjectForView({
                    id: projectId
                }).success(function (result) {
                    vm.project = result;
                    vm.teamMembers = result.teamMembers;
                    vm.additionalTenants = "";
                    angular.forEach(vm.project.additionalTenants, function (value) {
                        vm.additionalTenants += value.tenancyName + " " + value.name + ", ";
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
