// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:37171-37274
appModule.controller('host.views.cbs.projects.createOrShowProjectLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.project', 'project', '$uibModal',
        function ($scope, $uibModalInstance, projectService, project, $uibModal) {

            var vm = this;
            vm.saving = false;
            vm.project = project;
            vm.documents = [];
            vm.isInternal = true;

            vm.getStatus = function (status) {
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

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/uploadDocumentsModal.cshtml',
                    controller: 'host.views.cbs.projects.uploadDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return 0;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);

                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.openLogDocumentsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/showLogDocumentsModal.cshtml',
                    controller: 'host.views.cbs.projects.showLogDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectLog: function () {
                            return row;
                        }
                    }
                });
            };

            vm.save = function () {
                vm.loading = true;
                projectService.saveProjectLog({
                    projectId: project.id,
                    detail: vm.project.detail,
                    isInternal: vm.isInternal,
                    documents: vm.documents
                }).success(function (data) {
                    vm.getProjectLogs();
                    vm.project.detail = "";
                    vm.documents = [];
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getProjectLogs = function () {
                vm.loading = true;
                projectService.getProjectLogs({
                    id: project.id
                }).success(function (data) {
                        vm.project.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getProjectLogs();
        }
    ]);
