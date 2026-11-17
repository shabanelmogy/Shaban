// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:41896-41945
appModule.controller('host.views.cbs.projectsDashboard.projectDocumentsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.project', 'project', '$uibModal',
        function ($scope, $uibModalInstance, projectService, project, $uibModal) {

            var vm = this;
            vm.project = project;
            vm.tasksDocuments = null;
            vm.saving = false;
            vm.cancel = function () {
                $uibModalInstance.close();;
            };
            vm.getProjectLogs = function () {
                vm.loading = true;
                projectService.getProjectLogsDocuments({
                    id: project.id
                }).success(function (data) {
                    vm.project.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getTasksDocuments = function () {
                vm.loading = true;
                projectService.getTasksDocuments({
                    id: project.id
                }).success(function (data) {
                    vm.tasksDocuments = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
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
            vm.getProjectLogs();
            vm.getTasksDocuments();
        }
    ]);
