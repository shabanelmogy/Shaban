// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:60381-60417
appModule.controller('host.views.cmmi.projectHealth.viewProjectHealthLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.project', 'project', '$uibModal',
        function ($scope, $uibModalInstance, projectService, project, $uibModal) {

            var vm = this;
           
            vm.project = project;
            vm.projectHealthLogs = [];

            vm.cancel = function () {
                $uibModalInstance.close();;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.getProjectHealthLogs = function () {
                vm.loading = true;
                projectService.getProjectHealthLogs({
                    id: project.id
                }).success(function (data) {
                    vm.projectHealthLogs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getProjectHealthLogs();
        }
    ]);
