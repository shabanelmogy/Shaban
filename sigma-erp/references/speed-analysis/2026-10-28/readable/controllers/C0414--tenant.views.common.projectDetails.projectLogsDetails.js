// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:103281-103389
appModule.controller('tenant.views.common.projectDetails.projectLogsDetails', [
        '$scope', 'abp.services.app.projectLog', '$uibModal',
        function ($scope, projectLogService, $uibModal) {
            var vm = this;
            vm.saving = false;
            vm.documents = [];
            vm.project = {};
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
                    templateUrl: '~/App/tenant/views/common/projectDetails/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.common.projectDetails.uploadDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return vm.project.tenantId
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
                    templateUrl: '~/App/tenant/views/common/projectDetails/showLogDocumentsModal.cshtml',
                    controller: 'tenant.views.common.projectDetails.showLogDocumentsModal as vm',
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
                projectLogService.saveProjectLog({
                    projectId: vm.project.id,
                    detail: vm.project.detail,
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
                projectLogService.getProjectLogs({

                }).success(function (data) {
                    vm.project.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getProject = function () {
                vm.loading = true;
                projectLogService.getProject({

                }).success(function (data) {
                    vm.project = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getProject();
            vm.getProjectLogs();
        }
    ]);
